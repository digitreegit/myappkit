-- notes 테이블 + RLS (사용자별 격리)
-- apps/notes 가 사용. 익명/이메일 로그인 모두 auth.uid() 로 행을 소유합니다.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

-- 정책: 본인 소유(user_id = auth.uid()) 행만 접근. (select auth.uid()) 로 initplan 캐싱.
create policy "select own notes" on public.notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own notes" on public.notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own notes" on public.notes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own notes" on public.notes
  for delete to authenticated using ((select auth.uid()) = user_id);

create index if not exists notes_user_created_idx on public.notes (user_id, created_at desc);
