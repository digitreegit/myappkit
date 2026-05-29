import { useEffect, useState } from "react";
import { QueryProvider } from "@skyface/query";
import { LoadingState, Text, ToastProvider } from "@skyface/ui";
import { useToggle } from "@skyface/hooks";
import { BookmarksPage } from "./features/bookmarks/BookmarksPage";
import { isSupabaseEnabled, supabase } from "./lib/supabase";

type SessionStatus = "ready" | "loading" | "error";

export function App() {
  const [dark, { toggle }] = useToggle(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  // Supabase 모드면 익명 세션을 먼저 확보(RLS 가 auth.uid() 기준이므로 필수)
  const [status, setStatus] = useState<SessionStatus>(isSupabaseEnabled ? "loading" : "ready");

  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return;
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (active) setStatus("error");
          return;
        }
      }
      if (active) setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <QueryProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            {status === "loading" ? (
              <div className="mx-auto max-w-2xl px-4 py-10">
                <LoadingState message="세션을 준비하는 중…" />
              </div>
            ) : status === "error" ? (
              <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <Text variant="h3">익명 로그인이 꺼져 있어요</Text>
                <Text variant="body" className="mt-2 block text-muted">
                  Supabase 대시보드 → Authentication → Sign In / Providers →
                  “Anonymous sign-ins” 를 켠 뒤 새로고침하세요.
                </Text>
              </div>
            ) : (
              <BookmarksPage dark={dark} onToggleTheme={toggle} />
            )}
          </div>
        </ToastProvider>
      </QueryProvider>
    </div>
  );
}
