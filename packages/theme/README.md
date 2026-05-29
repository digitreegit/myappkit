# @skyface/theme

`figma/tokens/*.json` 에서 **자동 생성**되는 디자인 토큰입니다.

- `src/tokens.generated.ts` — 토큰 값 (TS, 직접 수정 금지)
- `src/variables.css` — CSS 변수 (:root + .dark)

## 재생성

```bash
npm run build:tokens   # 루트에서
```

## 웹에서 사용

```ts
// 앱 진입 CSS (예: src/index.css) 맨 위에서 변수 로드
import "@skyface/theme/variables.css";
```

그러면 Tailwind preset의 `bg-primary`, `text-foreground`, `border-border` 등이 동작합니다.

## React Native / JS 런타임에서 사용

```ts
import { getColor } from "@skyface/theme";
const primary = getColor("primary", "dark"); // "#6366f1"
```
