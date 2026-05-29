# Figma ↔ Code 토큰 동기화 노트

## 한 줄 요약
Figma(Tokens Studio)가 **디자인 진실의 원천(source of truth)**입니다.
토큰을 바꾸면 → JSON export → `npm run build:tokens` → 코드 테마가 갱신됩니다.

## 동기화 흐름

```text
[Figma + Tokens Studio 플러그인]
        │  ① 토큰 편집 (색/간격/타이포…)
        ▼
[Export → JSON]  ──②──▶  figma/tokens/{tokens,light,dark}.json
        │
        ▼
  npm run build:tokens   ──③──▶  packages/theme/src/tokens.generated.ts
                                  packages/theme/src/variables.css
        │
        ▼
  packages/ui + 모든 앱이 자동 반영
```

## 절차 (수동)
1. Figma에서 [Tokens Studio](https://tokens.studio/) 플러그인 설치.
2. 토큰을 **Primitive / Semantic(light·dark)** 두 계층으로 구성.
3. Export 설정을 "Multiple files"로 두고 `figma/tokens/`에 덮어쓰기.
   - primitive → `tokens.json`
   - light set → `light.json`
   - dark set → `dark.json`
4. `npm run build:tokens` 실행.
5. 변경된 `packages/theme/*` 를 커밋.

## ★ Figma 변경 → 앱 반영 (MCP 없이, GitHub sync) — 검증 완료

전체 루프: **Figma(Tokens Studio)에서 토큰 변경 → GitHub push → CI가 PR 생성 → 리뷰/merge → 앱 반영.**
Figma MCP 호출이 전혀 필요 없어 플랜 한도와 무관합니다.

```text
[Figma + Tokens Studio]  ──push──▶  figma/tokens/tokens-studio.json   (브랜치: tokens/update)
        │
        ▼  GitHub Actions: token-update-pr.yml
  npm run import:figma   (tokens-studio.json → tokens/light/dark.json, shadow 등 보존 merge)
  npm run sync:tokens    (alias 검증 + theme 재생성)
        │
        ▼
  🎨 PR 자동 생성 (bot/token-update)  ──리뷰/merge──▶  packages/ui + 모든 앱 반영
```

### Tokens Studio GitHub sync 설정 (단일 파일 — 권장)
1. Figma에서 Tokens Studio 플러그인 → Settings → **Sync providers** → **GitHub** 추가
2. 입력값:
   - Repository: `digitreegit/myappkit`
   - Branch: `tokens/update` (main 직접 말고 별도 브랜치 — CI 트리거가 main 제외)
   - Token storage location (path): `figma/tokens/tokens-studio.json`
   - File structure: **Single file**
3. Personal Access Token: `digitreegit` 계정의 `repo` 권한 토큰
4. Tokens Studio에서 토큰 편집 후 **Push to GitHub** → `tokens/update` 브랜치에 커밋
5. `.github/workflows/token-update-pr.yml` 가 자동 실행:
   `import:figma` → `sync:tokens` → **PR 생성** → 리뷰 후 merge 하면 앱에 적용
   (Figma 변경이 앱에 즉시 반영되지 않고, 항상 PR 리뷰를 거침)

> **로컬 검증(2026-05):** `tokens-studio.json` 의 light `primary` 를 `{color.neutral.900}` →
> `{color.brand.600}` 로 바꾸고 `npm run sync:figma` 실행 → `--sf-color-primary` 가
> `15 23 42`(#0f172a) → `79 70 229`(#4f46e5) 로 갱신됨을 확인. (이후 원복)

### import / export 스크립트 (양방향, 외부 의존성 0)
- `npm run export:figma` : `figma/tokens/{tokens,light,dark}.json` → `tokens-studio.json` (Figma 로 보낼 seed)
- `npm run import:figma` : `tokens-studio.json` → `figma/tokens/{tokens,light,dark}.json` (Figma 변경 되돌리기, deep-merge 로 `shadow` 등 보존)
- `npm run sync:figma`   : `import:figma` + `build:tokens` (한 방에 적용)

빌더는 **두 포맷을 자동 인식**합니다: 단순(`"primary": "#4f46e5"`) / DTCG(`{ "$value": "#4f46e5", "$type": "color" }`).

### (대안) Multiple files 직접 sync
Tokens Studio "Multiple files" 로 `tokens.json`/`light.json`/`dark.json` 을 직접 쓸 수도 있습니다.
이 경우 set 이름을 파일명과 맞추고(primitive set = `tokens`), `import:figma` 없이 `sync:tokens` 만 돌면 됩니다.
단, Tokens Studio 가 다루지 않는 키(예: `shadow`)는 누락될 수 있으니 단일 파일 경로를 권장합니다.

## 코드 → Figma 변수 (MCP 없이, Tokens Studio import) ★권장

우리 토큰으로 **Figma Variables(Light/Dark 모드 포함)** 를 만드는 가장 확실한 경로.
MCP 호출이 필요 없어 플랜 한도와 무관합니다.

1. `npm run export:figma` → `figma/tokens/tokens-studio.json` 생성
   (primitives / light / dark 세트, semantic 은 `{color.neutral.900}` alias 유지)
2. Figma 에서 **Tokens Studio** 플러그인 실행 → Settings → **Import** → 위 JSON 선택
   - 또는 GitHub sync 로 연결해 자동으로 가져오기
3. 토큰 세트 활성화: `primitives` + (`light` 또는 `dark`)
4. 플러그인의 **Export → Figma Variables** 실행
   - `primitives` = 값, `light`/`dark` = primitives 를 참조하는 semantic
   - light/dark 를 한 컬렉션의 두 모드로 매핑하면 모드 전환까지 동작
5. 토큰이 바뀌면 1~4 반복 (또는 GitHub sync 자동화)

> 토큰 전용 Figma 파일은 이미 생성됨: **Skyface App Kit — Design Tokens**
> (`https://www.figma.com/design/qIp66VulfsG9flSiuem0r7`)

### (선택) Cursor ↔ Figma 라이브 연동 (MCP)
Figma MCP 서버로 Cursor 가 변수를 직접 읽고/쓰는 양방향도 가능하지만, **플랜별 호출 한도**가 있습니다.
- **Starter + View/Collab 시트 = 월 6회** (읽기·쓰기 도구 모두 카운트) → 디자인 시스템 일괄 생성엔 부족.
- 한도 확장: Pro/Org/Enterprise + **Full/Dev 시트** (200~600/일).
- 한도 안에서는 "figma 변수를 figma/tokens 로 동기화해줘" 처럼 요청 가능.
- **한도가 빠듯하면 위의 Tokens Studio import 경로를 사용하세요.**

### 참조한 Figma 파일 & 모노크롬 정렬 (2026-05)
- 참조: [shadcn/ui Design System (Community)](https://www.figma.com/design/tqcXyrrFv1UqnLXPGKODt7/-shadcn-ui---Design-System--Community-)
- 확인 결과: primitive(slate/red 스케일, 타이포)는 우리 `tokens.json` 과 이미 일치.
- 차이는 semantic `primary` 뿐 — shadcn은 **모노크롬(slate)** primary 사용.
- 결정: `light.json`/`dark.json` 의 `primary`/`accent`/`ring`/`input` 을 slate 계열로 정렬해
  shadcn 룩과 일치시킴 (light primary=slate-900, dark primary=slate-50).

## 규칙
- **코드에서 hex 값을 직접 쓰지 않습니다.** 항상 토큰(=Tailwind 클래스/CSS 변수)을 사용.
- 새 semantic 토큰은 light/dark **양쪽 모두** 추가 (한쪽만 추가 금지).
- alias 문법은 `{color.brand.600}` 형태. primitive 경로만 참조.
