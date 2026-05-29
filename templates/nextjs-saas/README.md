# nextjs-saas 템플릿 (Next.js 14 App Router + Tailwind)

SaaS 시작점. 인증(Supabase), 디자인 시스템, 컴포넌트가 연결되어 있습니다.

## 새 앱 만들기

```bash
npm run create-app -- --template nextjs-saas --name my-saas
cd apps/my-saas && npm install && npm run dev
```

## 핵심
- `next.config.mjs` 의 `transpilePackages` 로 `@skyface/*` TS 소스를 트랜스파일.
- `app/globals.css` 에서 토큰 CSS 변수 import.
- `lib/supabase.ts` 에 클라이언트/auth 준비됨 (`NEXT_PUBLIC_SUPABASE_*` 필요).

## 다음 단계
- `app/(auth)/login/page.tsx` 에 `<AuthForm>` 배치
- `middleware.ts` 로 보호 라우트 (snippets/auth.md 참고)
- 구독/결제는 snippets/subscription.md 참고
