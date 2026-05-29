import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "../lib/cn";

type ToastTone = "neutral" | "success" | "warning" | "danger";
interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** 앱 루트를 감싸세요. 그 안에서 useToast() 로 토스트를 띄웁니다. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "neutral") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  const toneClass: Record<ToastTone, string> = {
    neutral: "bg-foreground text-background",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "min-w-56 rounded-md px-4 py-3 text-sm shadow-sf-lg",
              toneClass[t.tone],
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** 토스트 트리거. ToastProvider 하위에서만 사용. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast 는 <ToastProvider> 안에서만 사용할 수 있습니다.");
  return ctx;
}
