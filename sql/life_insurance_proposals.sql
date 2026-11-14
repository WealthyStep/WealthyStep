-- ============================================================================
-- Life Insurance / Term Insurance Proposals Schema
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- 1. Create Table (with all applicant, employment, health, nominee & document fields)
CREATE TABLE IF NOT EXISTS public.life_insurance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Step 1: Insured Person Details
    full_name TEXT NOT NULL,
    proposer_email TEXT NOT NULL,
    proposer_mobile TEXT NOT NULL,
    marital_status TEXT NOT NULL DEFAULT 'Single',
    dob TEXT NOT NULL,
    qualification TEXT NOT NULL DEFAULT 'Graduate',
    height TEXT NOT NULL, -- e.g. "5 ft 10 in"
    weight NUMERIC NOT NULL, -- in Kgs
    mother_full_name TEXT NOT NULL,
    father_full_name TEXT NOT NULL,
    employment_type TEXT NOT NULL DEFAULT 'Salaried Employee', -- 'Salaried Employee' or 'Businessman'
    has_existing_policies BOOLEAN NOT NULL DEFAULT false,
    existing_coverage TEXT DEFAULT '0',
    current_address TEXT NOT NULL,

    -- Step 2: Employment & Income Details
    company_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    company_email TEXT NOT NULL,
    industry TEXT NOT NULL,
    annual_income TEXT NOT NULL,

    -- Step 3: Health Conditions & Habits
    has_pre_existing_illness BOOLEAN NOT NULL DEFAULT false,
    pre_existing_details TEXT DEFAULT '',
    is_smoker BOOLEAN NOT NULL DEFAULT false,
    is_drinker BOOLEAN NOT NULL DEFAULT false,
    chews_tobacco BOOLEAN NOT NULL DEFAULT false,

    -- Step 4: Nominee Details & Nominee Bank Details
    nominee_name TEXT NOT NULL,
    is_nominee_minor BOOLEAN NOT NULL DEFAULT false,
    nominee_relation TEXT NOT NULL,
    nominee_dob TEXT NOT NULL,
    nominee_address_option TEXT NOT NULL DEFAULT 'Same as Insured person address',
    nominee_address TEXT NOT NULL,
    nominee_mobile TEXT NOT NULL,
    nominee_email TEXT NOT NULL,
    nominee_bank_name TEXT NOT NULL,
    nominee_bank_account_name TEXT NOT NULL,
    nominee_bank_ifsc TEXT NOT NULL,
    nominee_bank_account_number TEXT NOT NULL,
    nominee_bank_account_type TEXT NOT NULL DEFAULT 'Savings',

    -- Step 5: Document Uploads & Proposer Bank Details
    aadhar_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    proposer_bank_name TEXT NOT NULL,
    proposer_bank_account_number TEXT NOT NULL,
    proposer_bank_ifsc TEXT NOT NULL,
    proposer_bank_branch TEXT NOT NULL,
    proposer_bank_account_name TEXT NOT NULL,
    
    -- Uploaded Documents (JSONB arrays of { fileName, fileType, fileSize, base64? })
    aadhar_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    pan_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    selfie_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    cheque_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    company_id_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    payslip_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    other_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_notes TEXT DEFAULT '',

    -- Step 6: Consents & Declarations
    consent_contact_accepted BOOLEAN NOT NULL DEFAULT true,
    consent_disclosure_accepted BOOLEAN NOT NULL DEFAULT true,

    -- Admin Management & Follow-ups
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Under Review', 'Medical Scheduled', 'Policy Issued', 'Follow-up Needed', 'Rejected'
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    admin_notes TEXT DEFAULT '',
    followup_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'Life Insurance Portal',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_life_proposals_created_at 
    ON public.life_insurance_proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_life_proposals_status 
    ON public.life_insurance_proposals(status);

CREATE INDEX IF NOT EXISTS idx_life_proposals_pan 
    ON public.life_insurance_proposals(pan_number);

CREATE INDEX IF NOT EXISTS idx_life_proposals_mobile 
    ON public.life_insurance_proposals(proposer_mobile);

CREATE INDEX IF NOT EXISTS idx_life_proposals_email 
    ON public.life_insurance_proposals(LOWER(proposer_email));

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.life_insurance_proposals TO postgres, anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.life_insurance_proposals ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Service role has full access
DROP POLICY IF EXISTS "Service role full access on life_insurance_proposals" ON public.life_insurance_proposals;
CREATE POLICY "Service role full access on life_insurance_proposals"
    ON public.life_insurance_proposals
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
