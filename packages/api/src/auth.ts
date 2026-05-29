import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 인증 헬퍼 묶음. 어떤 화면에서든 동일한 인터페이스로 사용.
 *   const auth = createAuth(supabase);
 *   await auth.signInWithPassword(email, password);
 */
export function createAuth(supabase: SupabaseClient) {
  return {
    signUp: (email: string, password: string) =>
      supabase.auth.signUp({ email, password }),

    signInWithPassword: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),

    signInWithOAuth: (provider: "google" | "github" | "apple" | "kakao") =>
      supabase.auth.signInWithOAuth({ provider }),

    signOut: () => supabase.auth.signOut(),

    getSession: () => supabase.auth.getSession(),

    getUser: () => supabase.auth.getUser(),

    /** 인증 상태 변화 구독. 반환된 unsubscribe 를 cleanup 에서 호출. */
    onAuthStateChange: (callback: Parameters<SupabaseClient["auth"]["onAuthStateChange"]>[0]) => {
      const { data } = supabase.auth.onAuthStateChange(callback);
      return () => data.subscription.unsubscribe();
    },
  };
}

export type Auth = ReturnType<typeof createAuth>;
