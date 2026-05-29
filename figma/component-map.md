# Figma 컴포넌트 ↔ 코드 컴포넌트 매핑

Figma의 컴포넌트와 `packages/ui` 의 코드 컴포넌트를 1:1로 매핑합니다.
새 컴포넌트를 만들면 이 표에 **반드시 추가**하세요. (Cursor가 이 표를 참조해 올바른 컴포넌트를 고릅니다.)

## Atoms

| Figma 컴포넌트 | 코드 컴포넌트 | 경로 | 비고 |
| --- | --- | --- | --- |
| Button | `<Button>` | `ui/atoms/Button.tsx` | variant: primary/secondary/ghost/danger |
| Input | `<Input>` | `ui/atoms/Input.tsx` | |
| Text Area | `<TextArea>` | `ui/atoms/TextArea.tsx` | |
| Text | `<Text>` | `ui/atoms/Text.tsx` | variant: h1/h2/h3/body/caption |
| Badge | `<Badge>` | `ui/atoms/Badge.tsx` | tone: neutral/success/warning/danger |
| Spinner | `<Spinner>` | `ui/atoms/Spinner.tsx` | |

## Molecules

| Figma 컴포넌트 | 코드 컴포넌트 | 경로 | 비고 |
| --- | --- | --- | --- |
| Form Field | `<FormField>` | `ui/molecules/FormField.tsx` | label + input + error |
| Card | `<Card>` | `ui/molecules/Card.tsx` | Header/Body/Footer 포함 |
| Modal | `<Modal>` | `ui/molecules/Modal.tsx` | portal, ESC 닫기, useDisclosure 와 함께 |
| Confirm Dialog | `<ConfirmDialog>` | `ui/molecules/ConfirmDialog.tsx` | 확인/취소 2버튼, tone: danger/primary (삭제 확인 등) |
| Search Bar | `<SearchBar>` | `ui/molecules/SearchBar.tsx` | 아이콘 + 지우기 버튼, value/onChange 제어 |
| Page Header | `<PageHeader>` | `ui/molecules/PageHeader.tsx` | title + description + actions |
| Empty State | `<EmptyState>` | `ui/molecules/EmptyState.tsx` | 데이터 없음 |
| Loading State | `<LoadingState>` | `ui/molecules/LoadingState.tsx` | 로딩 스피너 |
| Toast | `useToast()` | `ui/molecules/Toast.tsx` | ToastProvider + useToast |

## Organisms

| Figma 컴포넌트 | 코드 컴포넌트 | 경로 | 비고 |
| --- | --- | --- | --- |
| Auth Form | `<AuthForm>` | `ui/organisms/AuthForm.tsx` | 로그인/회원가입 |

## 매핑 규칙
- Figma 컴포넌트 이름 = 코드 컴포넌트 이름 (PascalCase).
- Figma의 variant property = 코드의 props (예: `variant`, `tone`, `size`).
- 색/간격은 토큰을 그대로 사용 (figma/tokens → @skyface/theme).
