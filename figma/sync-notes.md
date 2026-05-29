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

## 절차 (자동 / 선택)
- Tokens Studio의 GitHub sync 기능으로 `figma/tokens/`에 자동 PR을 올리면,
  `.github/workflows/token-update-pr.yml` 이 토큰 빌드 후 결과를 PR에 포함합니다.

## 실제 연동 설정 (Tokens Studio → GitHub)

빌더는 **두 가지 포맷을 자동 인식**합니다:
- 단순: `"primary": "#4f46e5"`
- Tokens Studio/DTCG: `"primary": { "$value": "#4f46e5", "$type": "color" }`

→ Tokens Studio가 내보내는 그대로 `figma/tokens/`에 넣으면 됩니다. 변환 작업 불필요.

### Tokens Studio GitHub sync 설정
1. Figma에서 Tokens Studio 플러그인 → Settings → **Sync providers** → **GitHub** 추가
2. 입력값:
   - Repository: `digitreegit/myappkit`
   - Branch: `tokens/update` (main 직접 말고 별도 브랜치 권장)
   - Token storage location (path): `figma/tokens`
   - File structure: **Multiple files** (set별로 `tokens.json`/`light.json`/`dark.json` 생성)
3. Personal Access Token: `digitreegit` 계정의 `repo` 권한 토큰
4. Tokens Studio에서 **Push to GitHub** → `tokens/update` 브랜치에 커밋됨
5. `.github/workflows/token-update-pr.yml` 가 자동으로 토큰 빌드 후 **PR 생성** → 리뷰 후 merge
   (Figma 변경이 앱에 즉시 반영되지 않고, 항상 PR 리뷰를 거침)

### (선택) Cursor ↔ Figma 라이브 연동
Figma MCP 서버를 연결하면 Cursor가 Figma 변수를 직접 읽거나, 우리 토큰으로 Figma 디자인 시스템을 생성하는 양방향 작업이 가능합니다.
- Cursor: Settings → MCP → Figma 서버(플러그인) 활성화
- 활성화 후 "figma 변수를 figma/tokens 로 동기화해줘" 같이 요청 가능
- 현재 워크스페이스 Figma MCP **연결됨** (`use_figma`/`get_variable_defs` 사용 가능).

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
