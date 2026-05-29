import { useCallback, useState } from "react";

/**
 * 비동기 제출의 loading/error 상태를 표준화하는 훅.
 *
 *   const { submit, isSubmitting, error } = useFormSubmit(async (values) => {
 *     await api.save(values);
 *   });
 *   <form onSubmit={(e) => { e.preventDefault(); submit(values); }} />
 */
export function useFormSubmit<Args extends unknown[]>(
  handler: (...args: Args) => Promise<void>,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (...args: Args) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await handler(...args);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handler],
  );

  return { submit, isSubmitting, error, setError } as const;
}
