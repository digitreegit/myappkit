# 디자인 시스템

## 계층 (single source of truth)

```text
Figma (Tokens Studio)
   └─ figma/tokens/*.json        ← 디자인 토큰 원본
         └─ @skyface/theme        ← 생성된 토큰 (TS + CSS 변수)
               └─ @skyface/config/tailwind  ← Tailwind preset (토큰 → 클래스)
                     └─ @skyface/ui          ← 컴포넌트 (클래스 사용)
                           └─ apps/*          ← 실제 앱
```

## 토큰 종류

| 종류 | 예 | 코드 사용 |
| --- | --- | --- |
| Primitive 색 | `color.brand.600` | 직접 사용 X (semantic 통해서만) |
| Semantic 색 | `primary`, `background`, `foreground`, `border`, `muted`, `danger`… | `bg-primary`, `text-foreground` |
| Radius | `sm/md/lg/xl` | `rounded-md`, `rounded-lg` |
| Shadow | `md/lg` | `shadow-sf`, `shadow-sf-lg` |
| Font | `sans` | `font-sans` |

## 다크모드
`<html>` 또는 최상위 컨테이너에 `dark` 클래스를 붙이면 CSS 변수가 dark 값으로 교체됩니다.
컴포넌트는 별도 분기 없이 `bg-surface`, `text-foreground` 만 쓰면 자동 대응됩니다.

## 색 추가 절차
1. `figma/tokens/tokens.json` 에 primitive 추가 (필요 시).
2. `figma/tokens/light.json` **과** `dark.json` 양쪽에 semantic 추가.
3. `@skyface/config/tailwind/preset.cjs` 의 `colors` 에 매핑 추가.
4. `npm run build:tokens`.

## 원칙
- 컴포넌트/앱 코드에 **hex 값 직접 입력 금지**.
- semantic 토큰 이름은 "용도"로 짓는다 (`primary`, `danger`) — "색 이름"(`indigo`)으로 짓지 않는다.
- light/dark 는 항상 쌍으로 관리.
