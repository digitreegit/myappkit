/** 지정 ms 만큼 대기. */
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** 값을 [min, max] 범위로 제한. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** 배열을 key 기준으로 그룹핑. */
export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

/** 객체에서 일부 키만 선택. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

/** 객체에서 일부 키 제외. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const set = new Set(keys as (keyof T)[]);
  const out = {} as Omit<T, K>;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    if (!set.has(k)) (out as any)[k] = obj[k];
  }
  return out;
}

/** 비어있는지 확인 (null/undefined/빈문자열/빈배열/빈객체). */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/** crypto 기반 UUID (구형 환경 fallback 포함). */
export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Promise 결과를 [error, data] 튜플로. async/await try-catch 제거용. */
export async function tryCatch<T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> {
  try {
    return [null, await promise];
  } catch (err) {
    return [err instanceof Error ? err : new Error(String(err)), null];
  }
}
