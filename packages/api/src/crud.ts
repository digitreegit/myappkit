import type { SupabaseClient } from "@supabase/supabase-js";

export interface ListOptions {
  /** 컬럼 선택 (기본 "*") */
  select?: string;
  /** 정렬 컬럼 */
  orderBy?: string;
  ascending?: boolean;
  /** 페이지네이션 */
  limit?: number;
  offset?: number;
  /** 단순 equality 필터 { column: value } */
  match?: Record<string, unknown>;
}

/**
 * 테이블 단위 타입 안전 CRUD 래퍼.
 * 반복되는 supabase 쿼리 보일러플레이트를 제거합니다.
 *
 *   const todos = createCrud<Todo>(supabase, "todos");
 *   const { data } = await todos.list({ orderBy: "created_at", ascending: false });
 *   await todos.insert({ title: "할 일" });
 */
export function createCrud<Row extends Record<string, any>>(
  supabase: SupabaseClient,
  table: string,
) {
  return {
    async list(options: ListOptions = {}) {
      const { select = "*", orderBy, ascending = true, limit, offset, match } = options;
      let query = supabase.from(table).select(select);
      if (match) query = query.match(match);
      if (orderBy) query = query.order(orderBy, { ascending });
      if (typeof limit === "number") {
        const start = offset ?? 0;
        query = query.range(start, start + limit - 1);
      }
      return query.returns<Row[]>();
    },

    getById(id: string | number, idColumn = "id") {
      return supabase.from(table).select("*").eq(idColumn, id).single<Row>();
    },

    insert(values: Partial<Row> | Partial<Row>[]) {
      return supabase.from(table).insert(values as any).select();
    },

    update(id: string | number, values: Partial<Row>, idColumn = "id") {
      return supabase.from(table).update(values as any).eq(idColumn, id).select();
    },

    remove(id: string | number, idColumn = "id") {
      return supabase.from(table).delete().eq(idColumn, id);
    },
  };
}

export type Crud<Row extends Record<string, any>> = ReturnType<typeof createCrud<Row>>;
