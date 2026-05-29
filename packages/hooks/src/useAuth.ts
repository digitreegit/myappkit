import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  email?: string;
}

/**
 * 인증 상태를 구독하는 훅. @skyface/api 의 createAuth() 결과를 주입받습니다.
 * (hooks 패키지가 api 에 의존하지 않도록 의존성을 역전했습니다.)
 *
 *   const auth = createAuth(supabase);      // 앱에서 1회 생성
 *   const { user, loading } = useAuth(auth);
 */
export interface AuthLike {
  getUser: () => Promise<{ data: { user: AuthUser | null } }>;
  onAuthStateChange: (cb: (event: string, session: { user: AuthUser | null } | null) => void) => () => void;
}

export function useAuth(auth: AuthLike) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setLoading(false);
    });
    const unsubscribe = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth]);

  return { user, loading, isAuthenticated: !!user } as const;
}
