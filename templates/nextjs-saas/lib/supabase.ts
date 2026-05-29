import { createSupabaseClient, createAuth } from "@skyface/api";

export const supabase = createSupabaseClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

export const auth = createAuth(supabase);
