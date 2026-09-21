import { createClient } from "@supabase/supabase-js";

const SUPABASE_PROJECT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cfovajnpjxawuctmnwuy.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3Zham5wanhhd3VjdG1ud3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjIwMzksImV4cCI6MjEwNTUzODAzOX0.izrau1RvtbZLtQ1wII0ga90Krubkvo4ccMEeBIMz28o";

export const supabaseBrowser = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

