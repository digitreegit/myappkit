import { useCallback, useState } from "react";

/** boolean 토글. setTrue/setFalse 헬퍼 포함. */
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse, set: setValue }] as const;
}
