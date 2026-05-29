# 패턴: 인증 (Supabase Auth)

`@skyface/api` + `@skyface/ui`(AuthForm) + `@skyface/utils`(검증) 조합.

## 1) 로그인 화면 (web)

```tsx
import { useState } from "react";
import { AuthForm, type AuthFormValues } from "@skyface/ui";
import { loginSchema, formatZodErrors } from "@skyface/utils";
import { auth } from "../lib/supabase";

export function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: AuthFormValues) {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) return setErrors(formatZodErrors(parsed.error));

    setLoading(true);
    const { error } = await auth.signInWithPassword(values.email, values.password);
    setLoading(false);
    if (error) setErrors({ password: error.message });
    else window.location.href = "/dashboard";
  }

  return <AuthForm mode="login" errors={errors} isLoading={loading} onSubmit={onSubmit} />;
}
```

## 2) 세션 가드 훅

```tsx
import { useEffect, useState } from "react";
import { auth } from "../lib/supabase";

export function useUser() {
  const [user, setUser] = useState<null | { id: string; email?: string }>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    auth.getUser().then(({ data }) => {
      setUser(data.user as any);
      setLoading(false);
    });
    return auth.onAuthStateChange((_e, session) => setUser((session?.user as any) ?? null));
  }, []);
  return { user, loading };
}
```

## 3) Next.js 보호 라우트 (middleware)

```ts
// middleware.ts — 세션 쿠키 검사 후 미인증 시 /login 으로
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has("sb-access-token");
  if (!hasSession && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
```

## 체크리스트
- [ ] `.env` 에 SUPABASE_URL / ANON_KEY 설정
- [ ] OAuth 사용 시 Supabase 대시보드에서 Redirect URL 등록
- [ ] 로그아웃 버튼에서 `auth.signOut()` 호출 후 리다이렉트
