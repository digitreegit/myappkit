/**
 * export-tokens-studio.ts
 * figma/tokens/{tokens,light,dark}.json  ->  figma/tokens/tokens-studio.json
 *
 * 우리 토큰을 Tokens Studio(Figma 플러그인) import 포맷으로 변환한다.
 * 플러그인에서 import 후 "Export to Figma Variables" 하면
 * Figma Variables(컬렉션 + Light/Dark 모드)가 자동 생성된다.  (MCP 호출 0)
 *
 * 외부 의존성 없음. 실행: `npm run export:figma`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKENS_DIR = resolve(ROOT, "figma/tokens");

type Json = Record<string, any>;
const readJson = (p: string): Json => JSON.parse(readFileSync(p, "utf8"));

/** $메타 키 제거 + DTCG 리프($value)를 문자열로 펼친 plain 중첩 객체로 정규화. */
function normalize(node: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (typeof v === "string") out[k] = v;
    else if (v && typeof v === "object" && "$value" in v) out[k] = String(v.$value);
    else if (v && typeof v === "object") out[k] = normalize(v as Json);
  }
  return out;
}

/** 중첩 plain 객체의 모든 리프(string)를 Tokens Studio 리프 {value,type} 로 변환. */
function toStudio(node: Json, type: string): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string") out[k] = { value: v, type };
    else if (v && typeof v === "object") out[k] = toStudio(v, type);
  }
  return out;
}

function main() {
  const prim = normalize(readJson(resolve(TOKENS_DIR, "tokens.json")));
  const light = normalize(readJson(resolve(TOKENS_DIR, "light.json")));
  const dark = normalize(readJson(resolve(TOKENS_DIR, "dark.json")));

  // primitive 세트: 타입별로 매핑 (색/반경/간격/폰트크기/폰트패밀리)
  const primitives: Json = {};
  if (prim.color) primitives.color = toStudio(prim.color, "color");
  if (prim.radius) primitives.radius = toStudio(prim.radius, "borderRadius");
  if (prim.spacing) primitives.spacing = toStudio(prim.spacing, "spacing");
  if (prim.fontSize) primitives.fontSize = toStudio(prim.fontSize, "fontSizes");
  if (prim.fontFamily) primitives.fontFamily = toStudio(prim.fontFamily, "fontFamilies");

  // semantic 세트: color 그룹만 (값은 {color.neutral.900} 형태의 alias 유지)
  const lightSet = { color: toStudio(light.color ?? {}, "color") };
  const darkSet = { color: toStudio(dark.color ?? {}, "color") };

  const studio = {
    primitives,
    light: lightSet,
    dark: darkSet,
    $themes: [],
    $metadata: { tokenSetOrder: ["primitives", "light", "dark"] },
  };

  const outPath = resolve(TOKENS_DIR, "tokens-studio.json");
  writeFileSync(outPath, JSON.stringify(studio, null, 2) + "\n");

  const count = (o: Json): number =>
    Object.values(o).reduce(
      (n: number, v: any) => n + (v && "value" in v ? 1 : v && typeof v === "object" ? count(v) : 0),
      0,
    );
  console.warn(
    `✔ Tokens Studio export 완료 — primitives:${count(primitives)}, light:${count(lightSet)}, dark:${count(darkSet)} → figma/tokens/tokens-studio.json`,
  );
}

main();
