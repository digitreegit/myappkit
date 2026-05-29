import { createLocalRepository, createResourceHooks } from "@skyface/query";

export interface Note {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

// 데모: localStorage 기반. 백엔드 연결 시 아래 한 줄만 교체하면 됨:
//   import { createRepository } from "@skyface/api";
//   const repo = createRepository<Note>(supabase, "notes");
const repo = createLocalRepository<Note>("skyface.notes");

export const notes = createResourceHooks<Note, { title: string; body: string }>("notes", repo);
