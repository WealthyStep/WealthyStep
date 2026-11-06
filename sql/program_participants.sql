-- ============================================================================
-- Financial Freedom Awareness Program - Participant Submissions Schema
-- Project Reference: cfovajnpjxawuctmnwuy
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- 1. Create Table (with all required fields)
CREATE TABLE IF NOT EXISTS public.program_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    age INTEGER NOT NULL,
    occupation TEXT NOT NULL DEFAULT 'Salaried',
    interested_in TEXT[] NOT NULL DEFAULT '{}'::text[],
    consent_given BOOLEAN NOT NULL DEFAULT true,
    consent_text TEXT NOT NULL,
    session_date TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'New',
    notes TEXT DEFAULT '',
    source TEXT DEFAULT 'Financial Freedom Awareness Program',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Ensure all columns exist (safe upgrade if table was previously created)
ALTER TABLE public.program_participants 
    ADD COLUMN IF NOT EXISTS session_date TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New',
    ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Financial Freedom Awareness Program',
    ADD COLUMN IF NOT EXISTS ip_address TEXT,
    ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 3. Performance Indexes for Admin Search & Filtering
CREATE INDEX IF NOT EXISTS idx_program_participants_created_at 
    ON public.program_participants(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_program_participants_status 
    ON public.program_participants(status);

CREATE INDEX IF NOT EXISTS idx_program_participants_email 
    ON public.program_participants(LOWER(email));

CREATE INDEX IF NOT EXISTS idx_program_participants_mobile 
    ON public.program_participants(mobile);

CREATE INDEX IF NOT EXISTS idx_program_participants_occupation 
    ON public.program_participants(occupation);

-- 4. CRITICAL: Grant Schema & Table Permissions to Supabase Roles
-- (Without these grants, PostgREST hides the table from the schema cache -> PGRST205)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.program_participants TO postgres, anon, authenticated, service_role;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.program_participants ENABLE ROW LEVEL SECURITY;

-- 6. Explicit RLS Policies
DROP POLICY IF EXISTS "Allow service_role full access to program_participants" ON public.program_participants;
CREATE POLICY "Allow service_role full access to program_participants" 
    ON public.program_participants FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to program_participants" ON public.program_participants;
CREATE POLICY "Allow authenticated full access to program_participants" 
    ON public.program_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Force Supabase PostgREST to Instantly Refresh Its Schema Cache
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 8. Verification: Confirm table is ready
SELECT count(*) AS total_registered_participants FROM public.program_participants;
