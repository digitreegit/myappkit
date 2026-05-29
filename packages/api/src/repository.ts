import type { SupabaseClient } from "@supabase/supabase-js";
import { createCrud } from "./crud";

/**
 * Supabase 테이블을 @skyface/query 의 Repository 인터페이스로 노출하는 어댑터.
 * { data, error } 응답을 풀어서 에러 시 throw 합니다 (react-query 와 호환).
 *
 *   const repo = createRepository<Note>(supabase, "notes");
 *   const notes = createResourceHooks("notes", repo);
 */
export function createRepository<T extends { id: string }, NewT = Omit<T, "id">>(
  supabase: SupabaseClient,
  table: string,
) {
  const crud = createCrud<T & Record<string, any>>(supabase, table);
  const unwrap = <R>(res: { data: R; error: { message: string } | null }): R => {
    if (res.error) throw new Error(res.error.message);
    return res.data;
  };

  return {
    async list(): Promise<T[]> {
      return unwrap(await crud.list({ orderBy: "created_at", ascending: false })) as T[];
    },
    async getById(id: string): Promise<T | null> {
      const res = await crud.getById(id);
      if (res.error) return null;
      return res.data as T;
    },
    async create(values: NewT): Promise<T> {
      const rows = unwrap(await crud.insert(values as any)) as T[];
      return rows[0] as T;
    },
    async update(id: string, values: Partial<T>): Promise<T> {
      const rows = unwrap(await crud.update(id, values as any)) as T[];
      return rows[0] as T;
    },
    async remove(id: string): Promise<void> {
      const { error } = await crud.remove(id);
      if (error) throw new Error(error.message);
    },
  };
}
