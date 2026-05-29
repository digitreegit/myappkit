import { QueryProvider } from "@skyface/query";
import { AuthGate, ToastProvider } from "@skyface/ui";
import { createAuth } from "@skyface/api";
import { useToggle } from "@skyface/hooks";
import { BookmarksPage } from "./features/bookmarks/BookmarksPage";
import { isSupabaseEnabled, supabase } from "./lib/supabase";

// Supabase 모드면 이메일 로그인 게이트, 아니면(로컬 모드) 바로 화면.
const auth = supabase ? createAuth(supabase) : null;

export function App() {
  const [dark, { toggle }] = useToggle(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  return (
    <div className={dark ? "dark" : ""}>
      <QueryProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            {isSupabaseEnabled && auth ? (
              <AuthGate auth={auth}>
                {({ user, signOut }) => (
                  <BookmarksPage
                    dark={dark}
                    onToggleTheme={toggle}
                    userEmail={user.email}
                    onSignOut={signOut}
                  />
                )}
              </AuthGate>
            ) : (
              <BookmarksPage dark={dark} onToggleTheme={toggle} />
            )}
          </div>
        </ToastProvider>
      </QueryProvider>
    </div>
  );
}
