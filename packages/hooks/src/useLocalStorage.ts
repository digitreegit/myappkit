import { useCallback, useEffect, useState } from "react";

/** localStorage 와 동기화되는 상태. SSR 안전. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            /* quota 등 무시 */
          }
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    setStored(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [stored, setValue] as const;
}
