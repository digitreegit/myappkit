/**
 * import-tokens-studio.ts  (export-tokens-studio.ts 의 역방향)
 * figma/tokens/tokens-studio.json  ->  figma/tokens/{tokens,light,dark}.json
 *
 * Tokens Studio(Figma 플러그인)가 GitHub 로 push 한 tokens-studio.json 을
 * 빌드 입력(3개 파일)으로 되돌린다. 그 뒤 build-tokens.ts 가 theme 를 재생성한다.
 *
 * 안전장치: 기존 파일에 deep-merge 하므로 Tokens Studio 가 다루지 않는 키
 * (예: primitive 의 shadow)는 보존된다. 외부 의존성 없음.
 *
 *   npm run import:figma   (tokens-studio.json 이 없으면 조용히 통과)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKENS_DIR = resolve(ROOT, "figma/tokens");

type Json = Record<string, any>;
const readJson = (p: string): Json => JSON.parse(readFileSync(p, "utf8"));

/** Tokens Studio 리프 {value,type} (또는 DTCG $value) 를 plain 값으로 펼친다. */
function fromStudio(node: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && ("value" in v || "$value" in v)) {
      out[k] = String((v as Json).value ?? (v as Json).$value);
    } else if (v && typeof v === "object") {
      out[k] = fromStudio(v);
    }
  }
  return out;
}

/** override 의 리프를 base 에 덮어쓰되, base 에만 있는 키는 보존(deep-merge). */
function deepMerge(base: Json, override: Json): Json {
  const out: Json = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object") {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const writeJson = (p: string, obj: Json) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");

function main() {
  const studioPath = resolve(TOKENS_DIR, "tokens-studio.json");
  if (!existsSync(studioPath)) {
    console.warn("· tokens-studio.json 없음 — import 건너뜀 (직접 편집 모드)");
    return;
  }
  const studio = readJson(studioPath);

  // 1) primitives -> tokens.json (기존 파일에 merge: shadow 등 비-Studio 키 보존)
  const prims = fromStudio(studio.primitives ?? {});
  const tokensPath = resolve(TOKENS_DIR, "tokens.json");
  const baseTokens = existsSync(tokensPath) ? readJson(tokensPath) : {};
  writeJson(tokensPath, deepMerge(baseTokens, prims));

  // 2) light/dark -> 각 파일의 color 그룹 (alias 문자열 유지)
  for (const set of ["light", "dark"] as const) {
    const color = fromStudio((studio[set] ?? {}).color ?? {});
    const filePath = resolve(TOKENS_DIR, `${set}.json`);
    const base = existsSync(filePath) ? readJson(filePath) : { color: {} };
    base.color = deepMerge(base.color ?? {}, color);
    writeJson(filePath, base);
  }

  console.warn("✔ Tokens Studio import 완료 — tokens.json / light.json / dark.json 갱신");
}

main();
