import { createSupabaseClient, type SupabaseClient } from "@skyface/api";

// Vite 환경변수 (vite/client 타입에 의존하지 않도록 안전 캐스팅)
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {};
const url = env.VITE_SUPABASE_URL ?? "";
const anonKey = env.VITE_SUPABASE_ANON_KEY ?? "";

/** .env.local 에 URL/KEY 가 모두 있으면 Supabase 모드, 없으면 로컬 모드로 폴백. */
export const isSupabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createSupabaseClient({ url, anonKey })
  : null;
