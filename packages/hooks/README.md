# @skyface/hooks

프레임워크 비종속 React hooks.

| Hook | 용도 |
| --- | --- |
| `useDebounce(value, delay)` | 검색/입력 디바운스 |
| `useDisclosure(initial)` | 모달/드로어 open/close/toggle |
| `useLocalStorage(key, init)` | localStorage 동기화 상태 (SSR 안전) |
| `useMediaQuery(query)` | 반응형 분기 |
| `useToggle(initial)` | boolean 토글 |
| `usePrevious(value)` | 직전 값 |
| `useAuth(auth)` | 인증 상태 구독 (@skyface/api 의 auth 주입) |
| `useFormSubmit(handler)` | 비동기 제출 loading/error 표준화 |

```tsx
const { isOpen, open, close } = useDisclosure();
const query = useDebounce(input, 300);
const isDesktop = useMediaQuery("(min-width: 768px)");
```
