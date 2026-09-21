# Wealthy Step Policy Vault & Admin Management Setup Guide

This guide explains how to configure **Supabase**, **Backblaze B2**, and **Brevo** for the secure policy document vault on **wealthystep.com**.

All services used are on **100% free forever tiers** with **zero credit card requirement**.

---

## 1. Supabase Setup (Postgres DB & Admin Auth)

### Step 1.1: Create a Free Project
1. Go to [supabase.com](https://supabase.com) and sign in (GitHub or email).
2. Click **"New project"**, choose a project name (e.g. `wealthystep-vault`), set a strong database password, and select region (e.g., `South Asia (Mumbai)`).

### Step 1.2: Run the Database Schema
1. In your Supabase dashboard, click **SQL Editor** from the left navigation.
2. Click **"New query"**.
3. Copy the entire contents of [`sql/schema.sql`](file:///d:/Projects/wealthystep/sql/schema.sql) and paste it into the query editor.
4. Click **Run**. This will create the `clients`, `documents`, `otp_requests`, `verified_sessions`, and `audit_logs` tables with Row Level Security (RLS) enabled.

### Step 1.3: Create Your Admin Account & Disable Public Signups
1. In the Supabase dashboard, navigate to **Authentication** > **Users**.
2. Click **"Add user"** > **"Create user"**.
3. Enter your administrative email (e.g., `admin@wealthystep.com`) and a secure password.
4. Go to **Authentication** > **Providers** > **Email**, and ensure **"Enable Signups"** is **DISABLED / UNCHECKED**. (This ensures only you can create admin users; public visitors cannot sign up).

### Step 1.4: Retrieve API Keys
1. Go to **Project Settings** > **API**.
2. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
   - **Project API Keys (`anon` `public`)** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys (`service_role` `secret`)** -> `SUPABASE_SERVICE_ROLE_KEY` *(Never expose this key in public client bundles)*

---

## 2. Backblaze B2 Storage Setup (Policy PDF Vault)

Backblaze B2 provides **10 GB free forever storage** with an S3-compatible API and no credit card required.

### Step 2.1: Create a B2 Account & Bucket
1. Sign up at [backblaze.com/b2](https://www.backblaze.com/b2/cloud-storage.html).
2. Go to **B2 Cloud Storage** > **Buckets** > **"Create a Bucket"**.
3. Bucket Name: `wealthystep-policy-vault` (must be globally unique).
4. Files in Bucket: Select **Private** (Crucial: files should never be public).
5. Encryption: **Disabled** (we use pre-signed cryptographic URLs).
6. Click **"Create a Bucket"**.

### Step 2.2: Note Your S3 Endpoint
1. On your bucket details page, locate the **S3 Endpoint** (e.g., `s3.us-east-005.backblazeb2.com`).
2. Set:
   - `B2_ENDPOINT=s3.us-east-005.backblazeb2.com`
   - `B2_REGION=us-east-005` (the middle portion of your endpoint)
   - `B2_BUCKET_NAME=wealthystep-policy-vault`

### Step 2.3: Generate Application Keys
1. Go to **Account** > **Application Keys** > **"Add a New Application Key"**.
2. Key Name: `wealthystep-app-key`.
3. Allow access to Bucket(s): Select your bucket `wealthystep-policy-vault`.
4. Type of Access: **Read and Write**.
5. Click **"Create New Key"**.
6. Immediately copy:
   - **`keyID`** -> `B2_KEY_ID`
   - **`applicationKey`** -> `B2_APPLICATION_KEY`

---

## 3. Brevo Transactional Email (OTP Delivery)

Brevo provides **300 free emails per day** forever with no credit card required.

### Step 3.1: Create Brevo Account & Verify Sender
1. Sign up at [brevo.com](https://www.brevo.com).
2. Go to **Senders, Domains & Dedicated IPs** > **Senders** > **"Add a sender"**.
3. Add your sender email (e.g. `noreply@wealthystep.com` or `info@wealthystep.com`) and verify it via the confirmation link sent to your inbox.
4. Set `BREVO_SENDER_EMAIL=your-verified-email@wealthystep.com`.

### Step 3.2: Generate API Key
1. Click your profile avatar (top right) > **SMTP & API**.
2. In the **API Keys** tab, click **"Generate a new API key"**.
3. Name: `WealthyStep-OTP`.
4. Copy the key value -> `BREVO_API_KEY`.

---

## 4. Environment Variables Checklist (.env.local)

Add these keys to `.env.local` (and into your deployment provider like Vercel / Cloudflare / Netlify environment variables):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backblaze B2
B2_ENDPOINT=s3.us-east-005.backblazeb2.com
B2_REGION=us-east-005
B2_KEY_ID=005xxxxxxxxxxxxxxxxxx00000001
B2_APPLICATION_KEY=K005xxxxxxxxxxxxxxxxxxxxxxxxxxx
B2_BUCKET_NAME=wealthystep-policy-vault

# Brevo
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=noreply@wealthystep.com

# OTP Security Pepper
OTP_PEPPER=a-long-random-string-used-to-salt-otp-hashes
```

---

## 5. Security & Maintenance Verification

- **Keepalive Automation**: The GitHub Action at [`.github/workflows/keepalive.yml`](file:///d:/Projects/wealthystep/.github/workflows/keepalive.yml) runs daily at 06:00 UTC to ping `https://wealthystep.com/api/health`, preventing Supabase's free tier from auto-pausing.
- **Client Portal**: Accessible at `/policy-download`.
- **Admin Dashboard**: Accessible at `/admin/login` and `/admin/dashboard`.
