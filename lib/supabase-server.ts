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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3Zham5wanhhd3VjdG1ud3V5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTk2MjAzOSwiZXhwIjoyMTA1NTM4MDM5fQ.hgDcAnEokWE9TU9MnPyiPOaffUXMiGOMmD1PGfLhxs8";

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
