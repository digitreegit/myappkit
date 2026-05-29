import { useEffect, useState } from "react";

/** 값이 delay(ms) 동안 안정될 때까지 갱신을 지연. 검색 입력 등에 사용. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
