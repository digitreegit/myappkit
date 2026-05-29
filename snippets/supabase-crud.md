# 패턴: Supabase CRUD

`@skyface/api` 의 `createCrud` 로 반복 쿼리를 제거합니다.

## 기본

```ts
import { createCrud } from "@skyface/api";
import { supabase } from "@/lib/supabase";

interface Todo {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  created_at: string;
}

export const todoApi = createCrud<Todo>(supabase, "todos");
```

## 목록 + 정렬 + 필터 + 페이지네이션

```ts
const { data, error } = await todoApi.list({
  match: { user_id: userId, done: false },
  orderBy: "created_at",
  ascending: false,
  limit: 20,
  offset: 0,
});
```

## 단건 / 생성 / 수정 / 삭제

```ts
const { data: one } = await todoApi.getById(id);
await todoApi.insert({ user_id: userId, title: "할 일", done: false });
await todoApi.update(id, { done: true });
await todoApi.remove(id);
```

## React 목록 + 낙관적 업데이트

```tsx
import { useEffect, useState } from "react";
import { tryCatch } from "@skyface/utils";

function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    todoApi.list({ match: { user_id: userId }, orderBy: "created_at" })
      .then(({ data }) => setTodos(data ?? []));
  }, [userId]);

  async function toggle(todo: Todo) {
    setTodos((t) => t.map((x) => (x.id === todo.id ? { ...x, done: !x.done } : x))); // 낙관적
    const [err] = await tryCatch(todoApi.update(todo.id, { done: !todo.done }));
    if (err) setTodos((t) => t.map((x) => (x.id === todo.id ? todo : x))); // 롤백
  }

  return { todos, toggle };
}
```

## RLS 정책 (필수)
```sql
alter table todos enable row level security;
create policy "own rows" on todos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
