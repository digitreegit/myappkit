import { QueryProvider } from "@skyface/query";
import { ToastProvider } from "@skyface/ui";
import { useToggle } from "@skyface/hooks";
import { BookmarksPage } from "./features/bookmarks/BookmarksPage";

export function App() {
  const [dark, { toggle }] = useToggle(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  return (
    <div className={dark ? "dark" : ""}>
      <QueryProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            <BookmarksPage dark={dark} onToggleTheme={toggle} />
          </div>
        </ToastProvider>
      </QueryProvider>
    </div>
  );
}
