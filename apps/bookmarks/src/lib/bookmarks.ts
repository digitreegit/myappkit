import { createLocalRepository, createResourceHooks } from "@skyface/query";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tag: string;
  created_at: string;
}

// 데모: localStorage 기반. 백엔드 연결 시 아래 한 줄만 교체하면 됨:
//   import { createRepository } from "@skyface/api";
//   const repo = createRepository<Bookmark>(supabase, "bookmarks");
const repo = createLocalRepository<Bookmark>("skyface.bookmarks");

export const bookmarks = createResourceHooks<
  Bookmark,
  { title: string; url: string; tag: string }
>("bookmarks", repo);
