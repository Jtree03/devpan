import { SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = global as unknown as {
  supabase: SupabaseClient | undefined;
};

export const supabase =
  globalForSupabase.supabase ??
  new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

if (process.env.NODE_ENV !== "production")
  globalForSupabase.supabase = supabase;
