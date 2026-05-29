/**
 * create-new-app.ts
 * templates/<template> 를 apps/<name> 으로 복제해 새 앱을 만든다.
 *
 *   npm run create-app                                  # 대화형
 *   npm run create-app -- --template react-web --name my-app
 */
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TEMPLATES_DIR = resolve(ROOT, "templates");
const APPS_DIR = resolve(ROOT, "apps");

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a?.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1]?.startsWith("--") ? "" : (argv[++i] ?? "");
      out[key] = val;
    }
  }
  return out;
}

function listTemplates(): string[] {
  return readdirSync(TEMPLATES_DIR).filter((d) => statSync(resolve(TEMPLATES_DIR, d)).isDirectory());
}

function isValidName(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(name);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const templates = listTemplates();

  let template = args.template;
  let name = args.name;

  const interactive = !template || !name;
  const rl = interactive ? createInterface({ input: stdin, output: stdout }) : null;

  if (rl) {
    if (!template) {
      template = (await rl.question(`템플릿 선택 [${templates.join(" | ")}]: `)).trim();
    }
    if (!name) {
      name = (await rl.question("앱 이름 (kebab-case, 예: habit-tracker): ")).trim();
    }
    rl.close();
  }

  if (!templates.includes(template!)) {
    console.error(`❌ 템플릿 '${template}' 없음. 사용 가능: ${templates.join(", ")}`);
    process.exit(1);
  }
  if (!name || !isValidName(name)) {
    console.error("❌ 앱 이름은 소문자/숫자/하이픈만 가능합니다 (예: my-app).");
    process.exit(1);
  }

  const dest = resolve(APPS_DIR, name);
  if (existsSync(dest)) {
    console.error(`❌ 이미 존재: apps/${name}`);
    process.exit(1);
  }

  // 복제 (node_modules / 빌드 산출물 제외)
  const skip = new Set(["node_modules", "dist", ".next", "build", ".turbo"]);
  cpSync(resolve(TEMPLATES_DIR, template!), dest, {
    recursive: true,
    filter: (src) => {
      const base = src.split("/").pop()!;
      return !skip.has(base);
    },
  });

  // package.json name 치환
  const pkgPath = resolve(dest, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = `@app/${name}`;
  pkg.private = true;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  console.warn(`\n✔ 생성 완료: apps/${name}  (template: ${template})\n`);
  console.warn("다음 단계:");
  console.warn("  npm install");
  console.warn(`  npm run dev -w @app/${name}\n`);
}

main();
