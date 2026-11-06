import { createClient } from "@supabase/supabase-js";

// Ensure this client is only instantiated on the server
if (typeof window !== "undefined") {
  throw new Error("supabase-server cannot be used on the client side");
}

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cfovajnpjxawuctmnwuy.supabase.co";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-key-for-build";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === "production") {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not configured in server environment.");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
