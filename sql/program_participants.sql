-- ============================================================================
-- Financial Freedom Awareness Program - Participant Submissions Schema
-- Table: program_participants
-- Database: PostgreSQL (Supabase)
-- ============================================================================

CREATE TABLE IF NOT EXISTS program_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    age INTEGER NOT NULL,
    occupation TEXT NOT NULL CHECK (occupation IN ('Salaried', 'Business', 'Others')),
    interested_in TEXT[] NOT NULL DEFAULT '{}'::text[],
    consent_given BOOLEAN NOT NULL DEFAULT true,
    consent_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN (
        'New', 
        'Contacted', 
        'Interested', 
        'Not Interested', 
        'Call Evening', 
        'Call Tomorrow', 
        'Call Weekend', 
        'Follow Up', 
        'Converted', 
        'Closed'
    )),
    notes TEXT DEFAULT '',
    source TEXT DEFAULT 'Awareness Program',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes for search & filtering
CREATE INDEX IF NOT EXISTS idx_program_participants_created_at 
    ON program_participants(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_program_participants_status 
    ON program_participants(status);

CREATE INDEX IF NOT EXISTS idx_program_participants_email 
    ON program_participants(LOWER(email));

CREATE INDEX IF NOT EXISTS idx_program_participants_mobile 
    ON program_participants(mobile);

CREATE INDEX IF NOT EXISTS idx_program_participants_occupation 
    ON program_participants(occupation);

-- Enable Row Level Security (RLS)
ALTER TABLE program_participants ENABLE ROW LEVEL SECURITY;

-- Explicit RLS Policies
-- Service Role (Backend Next.js API Routes)
DROP POLICY IF EXISTS "Allow service_role full access to program_participants" ON program_participants;
CREATE POLICY "Allow service_role full access to program_participants" 
    ON program_participants FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated Admin Users
DROP POLICY IF EXISTS "Allow authenticated full access to program_participants" ON program_participants;
CREATE POLICY "Allow authenticated full access to program_participants" 
    ON program_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);
