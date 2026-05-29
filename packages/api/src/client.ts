import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Supabase 클라이언트 팩토리.
 * 제네릭 Database 타입을 넘기면 모든 쿼리가 타입 안전해집니다.
 *
 * 환경변수는 프레임워크별 접두사를 고려해 호출 측에서 주입하세요:
 *   web(Vite)  : import.meta.env.VITE_SUPABASE_URL
 *   next       : process.env.NEXT_PUBLIC_SUPABASE_URL
 *   expo(RN)   : process.env.EXPO_PUBLIC_SUPABASE_URL
 */
export function createSupabaseClient<Database = any>(
  config: SupabaseConfig,
): SupabaseClient<Database> {
  if (!config.url || !config.anonKey) {
    throw new Error(
      "[@skyface/api] SUPABASE url/anonKey 가 비어 있습니다. .env 를 확인하세요.",
    );
  }
  return createClient<Database>(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export type { SupabaseClient };
