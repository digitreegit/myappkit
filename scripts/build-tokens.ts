/**
 * build-tokens.ts
 * figma/tokens/{tokens,light,dark}.json  ->  packages/theme/src/{tokens.generated.ts, variables.css}
 *
 * 지원 포맷 (둘 다 자동 인식):
 *  1) 단순 포맷:   "primary": "#4f46e5"
 *  2) Tokens Studio / DTCG: "primary": { "$value": "#4f46e5", "$type": "color" }
 *  참조(alias)는 두 포맷 모두 "{color.brand.600}" 형태.
 *
 * 외부 의존성 없음. 실행: `npm run build:tokens`
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKENS_DIR = resolve(ROOT, "figma/tokens");
const THEME_SRC = resolve(ROOT, "packages/theme/src");

type Json = Record<string, any>;
const readJson = (p: string): Json => JSON.parse(readFileSync(p, "utf8"));

/** DTCG 리프({$value}) 또는 원시 문자열 리프인지 판별. */
function isLeaf(node: unknown): boolean {
  if (typeof node === "string") return true;
  return !!node && typeof node === "object" && "$value" in (node as Json);
}
function leafValue(node: any): string {
  return typeof node === "string" ? node : String(node.$value);
}

/** $메타 키를 제거하고 DTCG 리프를 문자열로 펼친 plain 중첩 객체로 정규화. */
function normalize(node: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (isLeaf(v)) out[k] = leafValue(v);
    else if (v && typeof v === "object") out[k] = normalize(v as Json);
  }
  return out;
}

/** 중첩 plain 객체 -> { "a.b.c": value } 플랫 맵. */
function flatten(node: Json, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(node)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object") Object.assign(out, flatten(v, key));
  }
  return out;
}

const ALIAS = /^\{([^}]+)\}$/;

/** primitive 맵 내부의 alias 를 끝까지(transitive) 해석. */
function resolveMap(map: Record<string, string>): Record<string, string> {
  const out = { ...map };
  for (let pass = 0; pass < 10; pass++) {
    let changed = false;
    for (const [key, val] of Object.entries(out)) {
      const m = ALIAS.exec(val);
      if (m?.[1] && out[m[1]] !== undefined) {
        out[key] = out[m[1]] as string;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return out;
}

/** semantic set 의 color 그룹을 primitive 로 해석해 { name: hex } 로 반환. */
function resolveSemantic(set: Json, primitives: Record<string, string>): Record<string, string> {
  const normalized = normalize(set);
  const colorGroup = normalized.color ?? {};
  const flat = flatten(colorGroup); // 예: "primary-foreground" 또는 "primary.foreground"
  const out: Record<string, string> = {};
  for (const [path, value] of Object.entries(flat)) {
    const name = path.replace(/\./g, "-");
    const m = ALIAS.exec(value);
    if (m?.[1]) {
      const resolved = primitives[m[1]];
      if (resolved === undefined) throw new Error(`토큰 alias 해석 실패: {${m[1]}}`);
      out[name] = resolved;
    } else {
      out[name] = value;
    }
  }
  return out;
}

/** #rrggbb / #rgb -> "r g b" (Tailwind alpha-modifier 용) */
function hexToRgbChannels(hex: string): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function main() {
  const primitivesPlain = normalize(readJson(resolve(TOKENS_DIR, "tokens.json")));
  const primitives = resolveMap(flatten(primitivesPlain));

  const light = resolveSemantic(readJson(resolve(TOKENS_DIR, "light.json")), primitives);
  const dark = resolveSemantic(readJson(resolve(TOKENS_DIR, "dark.json")), primitives);

  // --- 1) TS 토큰 파일 ---
  const ts = `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// 원본: figma/tokens/*.json  ·  생성: npm run build:tokens
/* eslint-disable */

export const primitives = ${JSON.stringify(primitivesPlain, null, 2)} as const;

export const semantic = {
  light: ${JSON.stringify(light, null, 2)},
  dark: ${JSON.stringify(dark, null, 2)},
} as const;

export type ColorToken = keyof typeof semantic.light;
export type ThemeMode = keyof typeof semantic;

export const tokens = { primitives, semantic } as const;
export default tokens;
`;

  // --- 2) CSS 변수 파일 ---
  const colorVars = (m: Record<string, string>) =>
    Object.entries(m)
      .map(([k, v]) => `    --sf-color-${k}: ${hexToRgbChannels(v)};`)
      .join("\n");

  const staticVars = [
    ...Object.entries(primitivesPlain.radius ?? {}).map(([k, v]) => `    --sf-radius-${k}: ${v};`),
    ...Object.entries(primitivesPlain.shadow ?? {}).map(([k, v]) => `    --sf-shadow-${k}: ${v};`),
    ...Object.entries(primitivesPlain.fontFamily ?? {}).map(([k, v]) => `    --sf-font-${k}: ${v};`),
  ].join("\n");

  const css = `/* 자동 생성 — figma/tokens/*.json · npm run build:tokens */
:root {
${colorVars(light)}
${staticVars}
  }

.dark {
${colorVars(dark)}
  }
`;

  mkdirSync(THEME_SRC, { recursive: true });
  writeFileSync(resolve(THEME_SRC, "tokens.generated.ts"), ts);
  writeFileSync(resolve(THEME_SRC, "variables.css"), css);

  console.warn(
    `✔ 토큰 생성 완료 — colors(light:${Object.keys(light).length}, dark:${Object.keys(dark).length})`,
  );
}

main();
