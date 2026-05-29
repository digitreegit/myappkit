# react-web 템플릿 (Vite + React + TS + Tailwind)

`@skyface/*` 라이브러리를 그대로 소비하는 SPA 스타터입니다.

## 이 템플릿으로 새 앱 만들기

```bash
npm run create-app -- --template react-web --name my-app
cd apps/my-app
npm install      # 루트에서 한 번 했다면 생략 가능
npm run dev
```

## 핵심 포인트
- `src/index.css` 에서 `@skyface/theme/variables.css` 를 import → 토큰 색이 적용됨.
- `tailwind.config.js` 가 `@skyface/config/tailwind` preset 사용.
- `App.tsx` 는 `AuthForm`, `useToggle`, `loginSchema` 사용 예시 + 다크모드 토글.

## 환경변수
`.env` 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가 후 `@skyface/api` 사용.
