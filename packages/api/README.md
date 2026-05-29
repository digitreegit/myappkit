# @skyface/api

Supabase를 얇게 감싼 래퍼. 클라이언트 생성 / 인증 / CRUD 보일러플레이트를 제거합니다.

## 설정

```ts
// app/lib/supabase.ts
import { createSupabaseClient, createAuth, createCrud } from "@skyface/api";

export const supabase = createSupabaseClient({
  url: import.meta.env.VITE_SUPABASE_URL,      // next/expo 접두사는 docs 참고
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const auth = createAuth(supabase);
```

## 인증

```ts
await auth.signInWithPassword(email, password);
await auth.signOut();
const unsub = auth.onAuthStateChange((event, session) => { /* ... */ });
```

## CRUD

```ts
interface Todo { id: string; title: string; done: boolean; created_at: string }
const todos = createCrud<Todo>(supabase, "todos");

const { data } = await todos.list({ orderBy: "created_at", ascending: false, limit: 20 });
await todos.insert({ title: "할 일", done: false });
await todos.update(id, { done: true });
await todos.remove(id);
```

> 타입 생성: `supabase gen types typescript` 결과를 `createSupabaseClient<Database>` 제네릭에 넣으면 전체 쿼리가 타입 안전해집니다.
