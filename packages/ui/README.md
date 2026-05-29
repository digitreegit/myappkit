# @skyface/ui

Atomic Design 기반 React 컴포넌트. Tailwind preset(`@skyface/config/tailwind`) + 디자인 토큰을 사용합니다.

```text
atoms      → Button, Input, Text, Badge, Spinner
molecules  → FormField, Card(Header/Body/Footer)
organisms  → AuthForm
```

## 사용 전제
1. 앱에 Tailwind preset 적용 (`@skyface/config/tailwind`).
2. 앱 CSS에서 `@import "@skyface/theme/variables.css";`.
3. Tailwind `content` 에 `../../packages/ui/src/**/*.{ts,tsx}` 포함.

## 예시

```tsx
import { Button, Card, CardBody, FormField, AuthForm } from "@skyface/ui";

<Button variant="primary" size="lg" isLoading>저장</Button>
<FormField label="이메일" error={errors.email} />
```

## 새 컴포넌트 추가 규칙
- 어느 계층인지 정하고 해당 폴더에 추가 (atoms/molecules/organisms).
- 색/간격/반경은 토큰 클래스만 사용 (`bg-primary`, `rounded-md` 등). **하드코딩 hex 금지.**
- variant 가 여러 개면 `class-variance-authority(cva)` 사용.
- `figma/component-map.md` 표에 매핑 추가.
- `forwardRef` + `displayName` 으로 ref 전달 지원 (입력류).
