import { createLocalRepository, createResourceHooks, type Repository } from "@skyface/query";
import { createRepository } from "@skyface/api";
import { isSupabaseEnabled, supabase } from "./supabase";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tag: string;
  created_at: string;
}

// ⬇️ 백엔드 전환은 이 한 줄. .env.local 의 Supabase 값이 있으면 실제 DB,
//    없으면 localStorage 로 폴백 — 화면 코드는 동일하게 동작합니다.
const repo: Repository<Bookmark> =
  isSupabaseEnabled && supabase
    ? createRepository<Bookmark>(supabase, "bookmarks")
    : createLocalRepository<Bookmark>("skyface.bookmarks");

export const bookmarks = createResourceHooks<
  Bookmark,
  { title: string; url: string; tag: string }
>("bookmarks", repo);
