-- WealthyStep Policy Document Vault & Client Management Schema
-- Database: PostgreSQL (Supabase)

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    dob DATE NOT NULL,
    policy_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for client identity verification (case-insensitive email matching)
CREATE INDEX IF NOT EXISTS idx_clients_verification 
    ON clients (mobile, LOWER(email), dob);

-- 2. Documents Table (Metadata for PDFs stored in Backblaze B2)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_key TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);

-- 3. OTP Requests Table (Stores hashed OTPs and attempt counters)
CREATE TABLE IF NOT EXISTS otp_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- normalized identifier (e.g. mobile:email)
    otp_hash TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_otp_requests_lookup 
    ON otp_requests(identifier, created_at DESC);

-- 4. Verified Client Sessions Table (Short-lived temporary auth tokens)
CREATE TABLE IF NOT EXISTS verified_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_verified_sessions_token 
    ON verified_sessions(token_hash, expires_at);

-- 5. Audit Logs Table (Tracks administrative and client document operations)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor TEXT NOT NULL, -- e.g., admin email, 'client:{id}', 'system'
    action TEXT NOT NULL, -- e.g., 'CLIENT_CREATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED'
    target_type TEXT NOT NULL, -- 'client', 'document', 'auth', etc.
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
    ON audit_logs(created_at DESC);

-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 7. Explicit RLS Policies
-- Allow service role full access (Backend Server API Routes)
CREATE POLICY "Allow service_role full access to clients" ON clients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access to documents" ON documents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access to otp_requests" ON otp_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access to verified_sessions" ON verified_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access to audit_logs" ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow authenticated admin users full access
CREATE POLICY "Allow authenticated full access to clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to documents" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to otp_requests" ON otp_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to verified_sessions" ON verified_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to audit_logs" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Automated Database Storage Retention Function
-- Purges audit logs, expired OTP requests, and expired verified sessions.
CREATE OR REPLACE FUNCTION ws_cleanup_old_logs(retention_days integer DEFAULT 30)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF retention_days = 0 THEN
        DELETE FROM audit_logs;
        DELETE FROM otp_requests;
        DELETE FROM verified_sessions;
    ELSE
        -- 1. Delete audit logs older than retention period
        DELETE FROM audit_logs 
        WHERE created_at < (now() - (retention_days || ' days')::interval);

        -- 2. Delete expired or consumed OTP requests
        DELETE FROM otp_requests 
        WHERE expires_at < now() OR verified = true OR created_at < (now() - interval '2 days');

        -- 3. Delete expired verified session tokens
        DELETE FROM verified_sessions 
        WHERE expires_at < now() OR created_at < (now() - interval '2 days');
    END IF;
END;
$$;



