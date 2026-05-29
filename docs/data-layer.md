# 데이터 레이어 (@skyface/query)

react-query + **Repository 추상화**로 데이터 접근을 표준화합니다. 백엔드(Supabase/REST/로컬)를 바꿔도 화면 코드는 그대로입니다.

## 구조

```text
화면  →  notes.useList() / useCreate() / useUpdate() / useRemove()
         (createResourceHooks 가 react-query 캐시·무효화 자동 처리)
              │
              ▼
         Repository<T>  ─┬─ createLocalRepository(key)         # localStorage (데모/오프라인)
                         └─ createRepository(supabase, table)  # Supabase (@skyface/api)
```

## 새 리소스 추가 (3줄)

```ts
import { createLocalRepository, createResourceHooks } from "@skyface/query";
interface Todo { id: string; title: string; done: boolean; created_at: string }
export const todos = createResourceHooks("todos",
  createLocalRepository<Todo>("app.todos"));
```

화면에서:

```tsx
const { data, isLoading, isError } = todos.useList();
const create = todos.useCreate();
const remove = todos.useRemove();
create.mutate({ title: "할 일", done: false });
```

## 로컬 → Supabase 전환
repo 생성 한 줄만 교체. 화면 코드 변경 없음.

```ts
import { createRepository } from "@skyface/api";
import { supabase } from "./supabase";
export const todos = createResourceHooks("todos",
  createRepository<Todo>(supabase, "todos"));
```

## 규칙
- 컴포넌트는 직접 fetch/supabase 호출하지 않고 **리소스 훅**만 사용.
- 로딩/에러/빈 상태는 `LoadingState` / `EmptyState`(@skyface/ui)로 표준화.
- 낙관적 업데이트가 필요하면 react-query `onMutate` 사용 (snippets/supabase-crud.md 참고).

## 실제 사용 예시
- `apps/notes` — **로컬(localStorage)** repo 전체 예시 (목록·검색·생성/편집·삭제·상태·토스트).
- `apps/bookmarks` — **실제 Supabase** 연결 예시. 동일 화면 코드, repo 한 줄만 다름.

## Supabase 연결 체크리스트 (apps/bookmarks 기준)
1. **테이블 + RLS**: `supabase/migrations/*.sql` 로 버전 관리.
   - `user_id uuid not null default auth.uid()` + 4개 정책(select/insert/update/delete)을
     `(select auth.uid()) = user_id` 로 본인 행만 접근.
2. **환경변수**: `apps/<app>/.env.local` (git 무시)에
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`(publishable key) 설정.
3. **세션**: RLS 가 `auth.uid()` 기준이므로 **로그인 필수**.
   - 데모는 익명 로그인 사용 → Supabase 대시보드 → Authentication → Sign In / Providers →
     **Anonymous sign-ins** 켜기 (1회). 실서비스는 `AuthForm`(@skyface/ui)으로 이메일 로그인.
4. **폴백**: `.env.local` 이 없으면 자동으로 로컬 repo 로 동작 (오프라인 데모 가능).
