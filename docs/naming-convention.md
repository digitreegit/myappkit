# 네이밍 규칙

## 파일 / 폴더
| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 컴포넌트 파일 | PascalCase.tsx | `Button.tsx`, `AuthForm.tsx` |
| hook 파일 | camelCase, `use` 접두 | `useDebounce.ts` |
| 유틸 파일 | camelCase | `format.ts`, `helpers.ts` |
| 폴더 | kebab-case 또는 소문자 | `ui`, `react-web` |
| 패키지 | `@skyface/<영역>` | `@skyface/ui` |
| 앱 | `@app/<name>` | `@app/my-app` |

## 코드 심볼
| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 컴포넌트 | PascalCase | `FormField` |
| 함수/변수 | camelCase | `formatCurrency` |
| 타입/인터페이스 | PascalCase | `ButtonProps` |
| 상수 | UPPER_SNAKE 또는 camelCase | `MAX_RETRY` |
| boolean | is/has/should 접두 | `isLoading`, `hasError` |
| 이벤트 핸들러 | handle 접두 / prop 은 on | `handleSubmit` / `onSubmit` |

## 디자인 토큰
- semantic 은 **용도** 기반: `primary`, `surface`, `danger` (색 이름 X).
- CSS 변수 접두: `--sf-` (color/radius/shadow/font).

## props
- variant 류는 `variant`, `size`, `tone` 같은 일관된 이름.
- 컴포넌트 props 타입은 `<Name>Props` 로 export.

## 커밋 (권장)
`type: 설명` — `feat`, `fix`, `refactor`, `docs`, `chore`, `tokens`.
예: `feat(ui): add Tabs molecule`, `tokens: update brand color`.
