/**
 * sync-figma-tokens.ts
 * figma/tokens/*.json 을 검증하고, 문제 없으면 토큰을 다시 빌드한다.
 *
 * 동작:
 *  1) 원격 소스(TOKENS_REMOTE_URL 환경변수)가 있으면 받아와 figma/tokens 에 저장 (선택)
 *  2) light/dark 의 모든 alias 가 primitive 에서 해석되는지 검증
 *  3) build-tokens 실행
 *
 *   npm run sync:tokens
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKENS_DIR = resolve(ROOT, "figma/tokens");

type Json = Record<string, any>;
const readJson = (p: string): Json => JSON.parse(readFileSync(p, "utf8"));

/** DTCG($value) 와 단순 문자열 리프를 모두 지원하는 플래트너. */
function flatten(obj: Json, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object" && "$value" in v) out[key] = String(v.$value);
    else if (v && typeof v === "object") Object.assign(out, flatten(v, key));
  }
  return out;
}

async function maybeFetchRemote() {
  const url = process.env.TOKENS_REMOTE_URL;
  if (!url) return;
  console.warn(`↓ 원격 토큰 동기화: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`원격 토큰 가져오기 실패: ${res.status}`);
  const text = await res.text();
  writeFileSync(resolve(TOKENS_DIR, "tokens.json"), text);
  console.warn("  → tokens.json 갱신");
}

function validate() {
  const primitives = flatten(readJson(resolve(TOKENS_DIR, "tokens.json")));
  const errors: string[] = [];

  for (const file of ["light.json", "dark.json"]) {
    const set = flatten(readJson(resolve(TOKENS_DIR, file)));
    for (const [key, value] of Object.entries(set)) {
      const m = /^\{([^}]+)\}$/.exec(value);
      if (!m?.[1]) {
        errors.push(`${file}: ${key} 값 "${value}" 이 alias({...}) 형식이 아님`);
        continue;
      }
      if (!(m[1] in primitives)) {
        errors.push(`${file}: ${key} 의 alias {${m[1]}} 를 primitive 에서 찾을 수 없음`);
      }
    }
  }

  if (errors.length) {
    console.error("❌ 토큰 검증 실패:");
    errors.forEach((e) => console.error("  - " + e));
    process.exit(1);
  }
  console.warn("✔ 토큰 검증 통과");
}

async function main() {
  await maybeFetchRemote();
  validate();
  const r = spawnSync("npx", ["tsx", resolve(__dirname, "build-tokens.ts")], { stdio: "inherit" });
  process.exit(r.status ?? 0);
}

main();
