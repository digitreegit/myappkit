import { uuid } from "@skyface/utils";
import type { Repository } from "./types";

/**
 * localStorage 기반 Repository. 백엔드 없이 즉시 동작하는 데모/프로토타이핑용.
 * 실제 배포 시 @skyface/api 의 createRepository(Supabase) 로 교체하면
 * 화면 코드는 한 줄도 바꾸지 않아도 됩니다.
 */
export function createLocalRepository<T extends { id: string; created_at?: string }>(
  storageKey: string,
): Repository<T> {
  const read = (): T[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as T[];
    } catch {
      return [];
    }
  };
  const write = (rows: T[]) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(rows));
    }
  };
  const delay = <R>(value: R) => new Promise<R>((r) => setTimeout(() => r(value), 150));

  return {
    list: () => delay(read().sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))),
    getById: (id) => delay(read().find((r) => r.id === id) ?? null),
    create: (values) => {
      const row = {
        ...(values as object),
        id: uuid(),
        created_at: new Date().toISOString(),
      } as T;
      write([row, ...read()]);
      return delay(row);
    },
    update: (id, values) => {
      const rows = read();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return Promise.reject(new Error("not found"));
      const updated = { ...rows[idx], ...values } as T;
      rows[idx] = updated;
      write(rows);
      return delay(updated);
    },
    remove: (id) => {
      write(read().filter((r) => r.id !== id));
      return delay(undefined);
    },
  };
}
