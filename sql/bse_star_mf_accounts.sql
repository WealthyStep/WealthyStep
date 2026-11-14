-- ============================================================================
-- BSE Star Mutual Fund Account Creation Details Schema
-- Database: PostgreSQL (Supabase)
-- ============================================================================

-- 1. Create Table (with all required applicant, KYC, bank & nominee fields)
CREATE TABLE IF NOT EXISTS public.bse_star_mf_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Step 1: Personal Details
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    dob TEXT NOT NULL,
    place_of_birth TEXT NOT NULL,
    occupation TEXT NOT NULL,
    present_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    marital_status TEXT NOT NULL DEFAULT 'Single',
    marriage_date TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',

    -- Step 2: KYC Details & Documents
    is_kyc_done TEXT NOT NULL DEFAULT 'No', -- 'Yes', 'No', "Don't Know"
    aadhar_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    aadhar_files JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { fileName, fileType, fileSize, fileUrl, base64? }
    pan_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Step 3: Bank Details & Documents
    bank_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    bank_name TEXT NOT NULL,
    bank_branch TEXT NOT NULL,
    bank_address TEXT DEFAULT '',
    account_number TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'Savings', -- 'Savings', 'Current', 'Others'
    bank_city TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    micr_code TEXT DEFAULT '',
    ifsc_code TEXT NOT NULL,

    -- Step 4: Nominee Details & Client Note
    nominees_count INTEGER NOT NULL DEFAULT 1,
    nominees JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of nominee objects
    client_note TEXT DEFAULT '',

    -- Step 5: Declarations & Security
    declaration_accepted BOOLEAN NOT NULL DEFAULT true,

    -- Admin Management, Status & Follow-ups
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Under Review', 'KYC Pending', 'Account Created', 'Follow-up Needed', 'Rejected'
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    admin_notes TEXT DEFAULT '',
    followup_notes JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, text, createdAt, author }
    source TEXT DEFAULT 'BSE Star MF Form',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bse_star_mf_created_at 
    ON public.bse_star_mf_accounts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bse_star_mf_status 
    ON public.bse_star_mf_accounts(status);

CREATE INDEX IF NOT EXISTS idx_bse_star_mf_pan 
    ON public.bse_star_mf_accounts(pan_number);

CREATE INDEX IF NOT EXISTS idx_bse_star_mf_mobile 
    ON public.bse_star_mf_accounts(mobile);

CREATE INDEX IF NOT EXISTS idx_bse_star_mf_email 
    ON public.bse_star_mf_accounts(LOWER(email));

CREATE INDEX IF NOT EXISTS idx_bse_star_mf_account_num 
    ON public.bse_star_mf_accounts(account_number);

-- 3. Grant Permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.bse_star_mf_accounts TO postgres, anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bse_star_mf_accounts ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Service role has full access
DROP POLICY IF EXISTS "Service role full access on bse_star_mf_accounts" ON public.bse_star_mf_accounts;
CREATE POLICY "Service role full access on bse_star_mf_accounts"
    ON public.bse_star_mf_accounts
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
