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

## 규칙
- **코드에서 hex 값을 직접 쓰지 않습니다.** 항상 토큰(=Tailwind 클래스/CSS 변수)을 사용.
- 새 semantic 토큰은 light/dark **양쪽 모두** 추가 (한쪽만 추가 금지).
- alias 문법은 `{color.brand.600}` 형태. primitive 경로만 참조.
