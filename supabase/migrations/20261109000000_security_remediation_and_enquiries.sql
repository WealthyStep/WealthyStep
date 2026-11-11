-- ==============================================================================
-- WEALTHY STEP — COMPREHENSIVE SECURITY REMEDIATION & SCHEMA MIGRATION
-- Migration: 20261109000000_security_remediation_and_enquiries.sql
-- Description: Enforces strict Row Level Security (RLS) across all tables,
-- eliminates anonymous public read/write exposure, creates the enquiries table
-- for persistent contact desk submissions, and establishes the program_participants
-- table for financial freedom seminar registrations.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE INITIALIZATION (If not present)
-- ------------------------------------------------------------------------------

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: enquiries (Contact Desk & Inquiries)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    source TEXT DEFAULT 'Website Contact',
    status TEXT DEFAULT 'New',
    email_status TEXT DEFAULT 'pending',
    email_error TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive schema updates if enquiries already existed with partial schema
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS email_status TEXT DEFAULT 'pending';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS email_error TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Table: program_participants (Financial Freedom Awareness Seminar Attendees)
CREATE TABLE IF NOT EXISTS public.program_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    age INTEGER,
    occupation TEXT,
    interested_in TEXT[] DEFAULT '{}',
    consent_given BOOLEAN DEFAULT true,
    consent_text TEXT,
    session_date TEXT,
    status TEXT DEFAULT 'New',
    notes TEXT,
    source TEXT DEFAULT 'Financial Freedom Awareness Program',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive schema updates if program_participants already existed
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS session_date TEXT;
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.program_participants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ------------------------------------------------------------------------------

ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.otp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.verified_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.program_participants ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. DROP INSECURE OR PERMISSIVE POLICIES
-- ------------------------------------------------------------------------------

-- Drop any public/anon read or write policies on clients
DROP POLICY IF EXISTS "Public clients read" ON public.clients;
DROP POLICY IF EXISTS "Anon clients read" ON public.clients;
DROP POLICY IF EXISTS "Allow anon read" ON public.clients;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Allow public select" ON public.clients;

-- Drop any public/anon read or write policies on documents
DROP POLICY IF EXISTS "Public documents read" ON public.documents;
DROP POLICY IF EXISTS "Anon documents read" ON public.documents;
DROP POLICY IF EXISTS "Allow anon read" ON public.documents;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.documents;

-- Drop any public/anon read or write policies on audit_logs
DROP POLICY IF EXISTS "Public audit read" ON public.audit_logs;
DROP POLICY IF EXISTS "Anon audit read" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow anon read" ON public.audit_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.audit_logs;

-- Drop any public/anon read or write policies on otp_requests
DROP POLICY IF EXISTS "Public otp read" ON public.otp_requests;
DROP POLICY IF EXISTS "Anon otp read" ON public.otp_requests;
DROP POLICY IF EXISTS "Allow anon read" ON public.otp_requests;

-- Drop any public/anon read or write policies on verified_sessions
DROP POLICY IF EXISTS "Public sessions read" ON public.verified_sessions;
DROP POLICY IF EXISTS "Anon sessions read" ON public.verified_sessions;
DROP POLICY IF EXISTS "Allow anon read" ON public.verified_sessions;

-- ------------------------------------------------------------------------------
-- 4. STRICT LEAST-PRIVILEGE ACCESS POLICIES
-- ------------------------------------------------------------------------------

-- Service Role has full administrative authority over all operational tables
-- (All legitimate Next.js server-side backend operations run via service_role)
DO $$
BEGIN
    -- clients
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Service Role full access on clients') THEN
        CREATE POLICY "Service Role full access on clients" ON public.clients FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- documents
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Service Role full access on documents') THEN
        CREATE POLICY "Service Role full access on documents" ON public.documents FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- audit_logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Service Role full access on audit_logs') THEN
        CREATE POLICY "Service Role full access on audit_logs" ON public.audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- otp_requests
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'otp_requests' AND policyname = 'Service Role full access on otp_requests') THEN
        CREATE POLICY "Service Role full access on otp_requests" ON public.otp_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- verified_sessions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'verified_sessions' AND policyname = 'Service Role full access on verified_sessions') THEN
        CREATE POLICY "Service Role full access on verified_sessions" ON public.verified_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- enquiries
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enquiries' AND policyname = 'Service Role full access on enquiries') THEN
        CREATE POLICY "Service Role full access on enquiries" ON public.enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;

    -- program_participants
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'program_participants' AND policyname = 'Service Role full access on program_participants') THEN
        CREATE POLICY "Service Role full access on program_participants" ON public.program_participants FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Explicitly Revoke Unauthenticated Anonymous Access from Sensitive Tables
REVOKE ALL ON public.clients FROM anon;
REVOKE ALL ON public.documents FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;
REVOKE ALL ON public.otp_requests FROM anon;
REVOKE ALL ON public.verified_sessions FROM anon;
REVOKE ALL ON public.enquiries FROM anon;
REVOKE ALL ON public.program_participants FROM anon;

-- Explicitly Revoke Authenticated Role Access from Sensitive Tables
-- (All legitimate application operations are mediated server-side via Next.js service_role)
REVOKE ALL ON public.clients FROM authenticated;
REVOKE ALL ON public.documents FROM authenticated;
REVOKE ALL ON public.audit_logs FROM authenticated;
REVOKE ALL ON public.otp_requests FROM authenticated;
REVOKE ALL ON public.verified_sessions FROM authenticated;
REVOKE ALL ON public.enquiries FROM authenticated;
REVOKE ALL ON public.program_participants FROM authenticated;

-- Protect Future Tables from Insecure Default Privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated;

-- Explicitly Grant Needed Permissions to Authenticated and Service Roles
GRANT ALL ON public.clients TO service_role;
GRANT ALL ON public.documents TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.otp_requests TO service_role;
GRANT ALL ON public.verified_sessions TO service_role;
GRANT ALL ON public.enquiries TO service_role;
GRANT ALL ON public.program_participants TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ------------------------------------------------------------------------------
-- 5. PERFORMANCE AND SEARCH INDEXES
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_clients_mobile ON public.clients(mobile);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_otp_requests_identifier ON public.otp_requests(identifier);
CREATE INDEX IF NOT EXISTS idx_verified_sessions_token ON public.verified_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_ref_id ON public.enquiries(ref_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_program_participants_created_at ON public.program_participants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_participants_mobile ON public.program_participants(mobile);
CREATE INDEX IF NOT EXISTS idx_program_participants_status ON public.program_participants(status);

