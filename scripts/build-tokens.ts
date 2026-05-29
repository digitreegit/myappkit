/**
 * build-tokens.ts
 * figma/tokens/{tokens,light,dark}.json  ->  packages/theme/src/{tokens.generated.ts, variables.css}
 *
 * 외부 의존성 없음. 실행: `npm run build:tokens` (= tsx scripts/build-tokens.ts)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const TOKENS_DIR = resolve(ROOT, "figma/tokens");
const THEME_SRC = resolve(ROOT, "packages/theme/src");

type Json = Record<string, any>;

function readJson(path: string): Json {
  return JSON.parse(readFileSync(path, "utf8"));
}

/** 객체에서 $description 같은 메타 키 제거 */
function stripMeta<T extends Json>(obj: T): T {
  const out: Json = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    out[k] = v && typeof v === "object" && !Array.isArray(v) ? stripMeta(v) : v;
  }
  return out as T;
}

/** "{color.brand.600}" 형태 alias 를 primitive 값으로 해석 */
function resolveAlias(value: string, primitives: Json): string {
  const match = /^\{([^}]+)\}$/.exec(value.trim());
  if (!match?.[1]) return value;
  const path = match[1].split(".");
  let cur: any = primitives;
  for (const seg of path) {
    if (cur == null) break;
    cur = cur[seg];
  }
  if (typeof cur !== "string") {
    throw new Error(`토큰 alias 를 찾을 수 없습니다: ${value}`);
  }
  return cur;
}

function resolveSemantic(set: Json, primitives: Json): Record<string, string> {
  const colors = stripMeta(set).color ?? {};
  const out: Record<string, string> = {};
  for (const [name, val] of Object.entries(colors)) {
    out[name] = resolveAlias(String(val), primitives);
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
  const primitives = stripMeta(readJson(resolve(TOKENS_DIR, "tokens.json")));
  const lightSet = readJson(resolve(TOKENS_DIR, "light.json"));
  const darkSet = readJson(resolve(TOKENS_DIR, "dark.json"));

  const light = resolveSemantic(lightSet, primitives);
  const dark = resolveSemantic(darkSet, primitives);

  // --- 1) TS 토큰 파일 ---
  const ts = `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// 원본: figma/tokens/*.json  ·  생성: npm run build:tokens
/* eslint-disable */

export const primitives = ${JSON.stringify(primitives, null, 2)} as const;

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

  const radius = primitives.radius ?? {};
  const shadow = primitives.shadow ?? {};
  const font = primitives.fontFamily ?? {};

  const staticVars = [
    ...Object.entries(radius).map(([k, v]) => `    --sf-radius-${k}: ${v};`),
    ...Object.entries(shadow).map(([k, v]) => `    --sf-shadow-${k}: ${v};`),
    ...Object.entries(font).map(([k, v]) => `    --sf-font-${k}: ${v};`),
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
