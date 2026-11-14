-- ============================================================================
-- Health Insurance - Personal Details & Proposals Schema
-- Project Reference: cfovajnpjxawuctmnwuy
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- 1. Create Table (with all required fields)
CREATE TABLE IF NOT EXISTS public.health_insurance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Proposer Details
    proposer_name TEXT NOT NULL,
    proposer_pan TEXT NOT NULL,
    proposer_dob TEXT NOT NULL,
    proposer_aadhar TEXT DEFAULT '',
    proposer_mobile TEXT NOT NULL,
    proposer_email TEXT NOT NULL,
    proposer_address TEXT NOT NULL,
    employment_status TEXT NOT NULL DEFAULT 'Salaried Employee (PF credit)',
    corporate_email TEXT DEFAULT '',
    policy_type TEXT NOT NULL DEFAULT 'New Policy',

    -- Covered Members
    adults_count INTEGER NOT NULL DEFAULT 1,
    kids_count INTEGER NOT NULL DEFAULT 0,
    relation_adult_2 TEXT DEFAULT '',
    relation_kids TEXT DEFAULT '',
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    insured_email TEXT NOT NULL,
    insured_mobile TEXT NOT NULL,

    -- Medical & Lifestyle History
    has_pre_existing_illness BOOLEAN NOT NULL DEFAULT false,
    pre_existing_details TEXT DEFAULT '',
    has_tobacco_alcohol_habits BOOLEAN NOT NULL DEFAULT false,
    habits_details TEXT DEFAULT '',
    current_address TEXT NOT NULL,

    -- Nominee & Bank Details
    nominee_name TEXT NOT NULL,
    nominee_dob TEXT NOT NULL,
    nominee_relation TEXT DEFAULT '',
    nominee_address TEXT NOT NULL,
    nominee_mobile TEXT NOT NULL,
    nominee_email TEXT NOT NULL,
    nominee_bank_name TEXT NOT NULL,
    nominee_bank_account_name TEXT NOT NULL,
    nominee_bank_ifsc TEXT NOT NULL,
    nominee_bank_account_number TEXT NOT NULL,
    nominee_bank_account_type TEXT NOT NULL DEFAULT 'Savings',

    -- Consent & Declarations
    consent_contact_accepted BOOLEAN NOT NULL DEFAULT true,
    consent_disclosure_accepted BOOLEAN NOT NULL DEFAULT true,

    -- Admin Management & Follow-ups
    status TEXT NOT NULL DEFAULT 'New', -- New, Contacted, In Review, Quotation Sent, Policy Issued, Rejected, Closed
    priority TEXT NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Urgent
    notes TEXT DEFAULT '',
    followup_notes JSONB DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'Health Insurance Portal',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_health_proposals_created_at 
    ON public.health_insurance_proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_health_proposals_status 
    ON public.health_insurance_proposals(status);

CREATE INDEX IF NOT EXISTS idx_health_proposals_pan 
    ON public.health_insurance_proposals(proposer_pan);

CREATE INDEX IF NOT EXISTS idx_health_proposals_mobile 
    ON public.health_insurance_proposals(proposer_mobile);

CREATE INDEX IF NOT EXISTS idx_health_proposals_email 
    ON public.health_insurance_proposals(LOWER(proposer_email));

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.health_insurance_proposals TO postgres, anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.health_insurance_proposals ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Service role has full access
DROP POLICY IF EXISTS "Service role full access on health_insurance_proposals" ON public.health_insurance_proposals;
CREATE POLICY "Service role full access on health_insurance_proposals"
    ON public.health_insurance_proposals
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
