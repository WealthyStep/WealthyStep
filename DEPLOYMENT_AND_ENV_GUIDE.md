# 🚀 WealthyStep — Complete Client Deployment & Environment Keys Guide

This comprehensive, step-by-step handbook guides you through creating your own free-tier accounts, generating all necessary API keys, configuring cloud services, and deploying the **WealthyStep** platform with 100% data ownership.

---

## 📋 Table of Contents
1. [Architecture & 100% Free-Tier Overview](#1-architecture--100-free-tier-overview)
2. [Master Environment Keys Checklist](#2-master-environment-keys-checklist)
3. [Step 1: Supabase Setup (Database & Authentication)](#3-step-1-supabase-setup-database--authentication)
4. [Step 2: Backblaze B2 Setup (PDF Storage Vault)](#4-step-2-backblaze-b2-setup-pdf-storage-vault)
5. [Step 3: Brevo Setup (OTP & Email Delivery)](#5-step-3-brevo-setup-otp--email-delivery)
6. [Step 4: Security Pepper & Analytics](#6-step-4-security-pepper--analytics)
7. [Step 5: One-Click Production Deployment on Vercel](#7-step-5-one-click-production-deployment-on-vercel)
8. [Step 6: Post-Deployment Health Check](#8-step-6-post-deployment-health-check)

---

## 1. Architecture & 100% Free-Tier Overview

WealthyStep is engineered to operate seamlessly within industry-standard **Zero-Cost Free Tiers**:

| Service | Purpose | Free Tier Capacity | Monthly Cost |
| :--- | :--- | :--- | :---: |
| **Supabase** | PostgreSQL DB & Admin Auth | 500 MB Database + 50,000 Auth Users | **$0.00 / free** |
| **Backblaze B2** | S3 Policy Document Vault | 10 GB Storage (~10,000 PDF Bonds) | **$0.00 / free** |
| **Brevo** | OTP & Lead Notifications | 300 Free Emails / Day (9,000 / month) | **$0.00 / free** |
| **Vercel** | Next.js Serverless Hosting | 100 GB Bandwidth + SSL | **$0.00 / free** |

---

## 2. Master Environment Keys Checklist

Keep this checklist handy. You will populate these values during the setup steps below:

```env
# ==========================================
# 1. SUPABASE CREDENTIALS (DB & AUTH)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# 2. BACKBLAZE B2 (S3-COMPATIBLE STORAGE)
# ==========================================
B2_ENDPOINT=s3.us-east-005.backblazeb2.com
B2_REGION=us-east-005
B2_KEY_ID=005xxxxxxxxxxxxxxxxxx00000001
B2_APPLICATION_KEY=K005xxxxxxxxxxxxxxxxxxxxxxxxxxx
B2_BUCKET_NAME=wealthystep-vault-yourname

# ==========================================
# 3. BREVO TRANSACTIONAL EMAIL & OTP
# ==========================================
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=your-verified-email@domain.com
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-login-email@domain.com
SMTP_PASSWORD=your-brevo-smtp-key
EMAIL_TO=your-admin-inbox@domain.com
EMAIL_FROM=your-verified-email@domain.com

# ==========================================
# 4. SECURITY & ANALYTICS
# ==========================================
OTP_PEPPER=generate-a-secure-64-character-random-secret
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 3. Step 1: Supabase Setup (Database & Authentication)

Supabase provides the PostgreSQL database that stores client profiles, document metadata, OTP tokens, and administrative audit logs.

### 3.1. Create Supabase Account & Project
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (Sign in with GitHub or Email).
2. Click **New Project** in your dashboard.
3. Fill in the project details:
   - **Name:** `WealthyStep-Production`
   - **Database Password:** Click *Generate a password* and **save it safely**.
   - **Region:** Select the region closest to your target users (e.g., *South Asia (Mumbai)* or *East US*).
   - **Pricing Plan:** Select **Free ($0/month)**.
4. Click **Create new project** and wait ~2 minutes for the database to provision.

---

### 3.2. Run the Database SQL Schema
1. In your Supabase project dashboard, click on the **SQL Editor** icon (`>_`) in the left navigation sidebar.
2. Click **New Query** (or **+** icon).
3. Open the file [`sql/schema.sql`](file:///d:/Projects/wealthystep/sql/schema.sql) in your codebase, copy its entire content, and paste it into the Supabase SQL Editor.
4. Click **Run** (green button at bottom right).
5. Ensure the result displays: `Success. No rows returned`.

*(This creates the `clients`, `documents`, `otp_requests`, `verified_sessions`, `audit_logs` tables and security indexes).*

---

### 3.3. Collect Supabase Environment Keys
1. In the left sidebar, click on **Project Settings** (gear icon ⚙️) at the bottom.
2. Click on the **API** tab under *Configuration*.
3. Copy the following keys into your checklist:

| Variable Name | Location in Supabase UI |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`) |
| `SUPABASE_URL` | Same as **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API Keys** → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project API Keys** → `service_role` `secret` key *(Click Reveal)* |

> ⚠️ **IMPORTANT:** Never share or commit the `SUPABASE_SERVICE_ROLE_KEY` to public repositories. It bypasses Row-Level Security and is only used on the server side.

---

### 3.4. Create the First Admin Account in Supabase Auth
1. In the left sidebar, click on **Authentication** (person icon 👤) → **Users**.
2. Click **Add User** → **Create User**.
3. Enter:
   - **Email:** e.g., `admin@wealthystep.com` (your chosen admin email)
   - **Password:** A strong, secure password
   - Check **Auto Confirm User?** (toggle on)
4. Click **Create User**. You will use this email and password to log in to `/admin/login`.

---

## 4. Step 2: Backblaze B2 Setup (PDF Storage Vault)

Backblaze B2 provides enterprise-grade, S3-compatible cloud storage with **10 GB permanently free storage**.

### 4.1. Create Backblaze Account
1. Go to [https://www.backblaze.com/b2/cloud-storage.html](https://www.backblaze.com/b2/cloud-storage.html) and sign up for a free account.
2. Verify your email address and log in to the Backblaze Web Console.

---

### 4.2. Create a Private Storage Bucket
1. In the left sidebar under **B2 Cloud Storage**, click **Buckets**.
2. Click **Create a Bucket**.
3. Enter the following settings:
   - **Bucket Unique Name:** e.g. `wealthystep-vault-yourname` *(must be globally unique, lowercase, no spaces)*.
   - **Files in Bucket are:** Select **Private** 🔒 *(Critical for client document privacy)*.
   - **Default Encryption:** Disabled (or SSE-B2).
   - **Object Lock:** Disabled.
4. Click **Create a Bucket**.
5. Once created, note down your **Bucket Name** and **Endpoint**:
   - In the bucket details card, look for **Endpoint** (e.g., `s3.us-east-005.backblazeb2.com`).
   - Extract the **Region** from the endpoint: e.g. `us-east-005`.

| Variable Name | Value Example |
| :--- | :--- |
| `B2_BUCKET_NAME` | `wealthystep-vault-yourname` |
| `B2_ENDPOINT` | `s3.us-east-005.backblazeb2.com` *(Do NOT prefix with `https://`)* |
| `B2_REGION` | `us-east-005` |

---

### 4.3. Generate Backblaze Application Keys
1. In the left sidebar under **B2 Cloud Storage**, click **Application Keys**.
2. Scroll down to **Application Keys** and click **Add a New Application Key**.
3. Enter key details:
   - **Name of Key:** `wealthystep-app-key`
   - **Allow access to Bucket(s):** Select your newly created bucket (or *All*).
   - **Type of Access:** Select **Read and Write**.
   - **File name prefix:** Leave blank (allows full access).
   - **Duration:** Leave blank (no expiration).
4. Click **Create New Key**.
5. **Immediately copy both values** (they are only shown once):

| Variable Name | Backblaze Label |
| :--- | :--- |
| `B2_KEY_ID` | `keyID` (e.g. `005a1b2c3d4e5f60000000001`) |
| `B2_APPLICATION_KEY` | `applicationKey` (e.g. `K005abc123...`) |

---

### 4.4. Configure CORS for Secure PDF In-Browser Viewing
1. In the left sidebar under **Buckets**, find your bucket and click **Bucket Settings** or **CORS Rules**.
2. Set CORS configuration to allow GET requests from your production domain (or choose *Share everything* if managed via S3 API):
```json
[
  {
    "corsRuleName": "AllowSecurePDFViewing",
    "allowedOrigins": ["*"],
    "allowedHeaders": ["*"],
    "allowedOperations": ["s3_head", "s3_get"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 5. Step 3: Brevo Setup (OTP & Email Delivery)

Brevo (formerly Sendinblue) provides **300 free emails per day** for delivering OTP login verification codes to clients and chatbot lead inquiry notifications to admins.

### 5.1. Create Brevo Account & Verify Sender
1. Go to [https://www.brevo.com](https://www.brevo.com) and sign up for a free account.
2. In the Brevo dashboard, click your profile icon (top right) → **Senders, Domains & Dedicated IPs**.
3. Under **Senders**, click **Add a sender**.
4. Enter:
   - **From Name:** `WealthyStep Team`
   - **From Email:** e.g., `contact@yourdomain.com` or your Gmail/business email.
5. Check your inbox and click the verification link sent by Brevo.

---

### 5.2. Generate Brevo API Key
1. Click your profile icon (top right) → **SMTP & API**.
2. Under the **API Keys** tab, click **Generate a new API key**.
3. Name it `WealthyStep API Key` and click **Generate**.
4. Copy the generated key:

| Variable Name | Value |
| :--- | :--- |
| `BREVO_API_KEY` | `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `BREVO_SENDER_EMAIL` | The verified email address from step 5.1 |

---

### 5.3. Get Brevo SMTP Credentials
1. Still on the **SMTP & API** page, click on the **SMTP** tab.
2. You will find your SMTP settings:

| Variable Name | Brevo Setting |
| :--- | :--- |
| `SMTP_HOST` | `smtp-relay.brevo.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | Your Brevo Login Email |
| `SMTP_PASSWORD` | Click *Generate a new SMTP key* and copy it |
| `EMAIL_TO` | The email where client chatbot leads should be delivered |
| `EMAIL_FROM` | The verified sender email |

---

## 6. Step 4: Security Pepper & Analytics

### 6.1. Generate `OTP_PEPPER`
The `OTP_PEPPER` is a high-entropy secret string used to cryptographically salt and hash OTP tokens before storing them in Supabase, preventing rainbow table attacks.

Run this command in any terminal to generate a secure 64-character random string:
```bash
# In PowerShell (Windows):
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Or in Linux / macOS / Git Bash:
openssl rand -base64 48
```
Set the result as your `OTP_PEPPER`.

---

### 6.2. Google Analytics 4 (Optional)
1. Go to [https://analytics.google.com](https://analytics.google.com).
2. Create a Property for your domain and create a **Web Data Stream**.
3. Copy the **Measurement ID** (e.g., `G-XXXXXXXXXX`).
4. Set: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.

---

## 7. Step 5: One-Click Production Deployment on Vercel

Vercel provides automated CI/CD, global CDN caching, zero-config Next.js serverless functions, and free automatic SSL certificates.

### 7.1. Push Code to GitHub / GitLab
Ensure your code is pushed to your private GitHub repository.

---

### 7.2. Import Project in Vercel
1. Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your `wealthystep` GitHub repository and click **Import**.

---

### 7.3. Configure Environment Variables in Vercel
Before clicking Deploy, expand the **Environment Variables** section in the Vercel project configuration screen.

Add each variable from your checklist:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-login-email@domain.com
SMTP_PASSWORD=your-brevo-smtp-key
EMAIL_TO=your-admin-inbox@domain.com
EMAIL_FROM=your-verified-email@domain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
B2_ENDPOINT=s3.us-east-005.backblazeb2.com
B2_REGION=us-east-005
B2_KEY_ID=005xxxxxxxxxxxxxxxxxx00000001
B2_APPLICATION_KEY=K005xxxxxxxxxxxxxxxxxxxxxxxxxxx
B2_BUCKET_NAME=wealthystep-vault-yourname
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=your-verified-email@domain.com
OTP_PEPPER=your-secure-generated-pepper-string
```

> 💡 **Tip:** You can also copy all lines at once and paste them into Vercel's bulk key-value input box.

---

### 7.4. Deploy!
1. Click **Deploy**.
2. Vercel will build the Next.js application, optimize assets, and deploy to a production URL (e.g., `https://wealthystep.vercel.app`).
3. Under **Project Settings** → **Domains**, you can connect your custom domain (e.g., `wealthystep.in` or `wealthystep.com`) with automated DNS and SSL.

---

## 8. Step 6: Post-Deployment Health Check

Verify all systems are 100% operational:

1. **Admin Login Test:**
   - Navigate to `https://your-domain.com/admin/login`.
   - Log in using the Supabase Auth user created in Step 3.4.
   - Verify the 4 storage metric cards (Registered Clients, Policy Documents, Backblaze B2, Supabase DB) load.
2. **Client Registration Test:**
   - Click **+ Register New Client**.
   - Enter name, 10-digit mobile, unique email, and DOB using the calendar.
   - Confirm the client appears in the vault list and "Registered Clients" increments.
3. **Multi-PDF Upload Test:**
   - Open the client's **Document Vault**.
   - Drag & drop a PDF policy document (e.g. LIC bond).
   - Confirm upload succeeds and Backblaze B2 storage metrics update in real-time.
4. **Client Portal OTP Verification Test:**
   - In an Incognito window, go to `https://your-domain.com/policy-download`.
   - Enter the test client's Mobile, Email, and DOB.
   - Click **Verify Identity & Send OTP**.
   - Check the client's email inbox for the 6-digit OTP from Brevo.
   - Enter OTP and confirm access to preview & download the policy PDF.

---

🎉 **Congratulations! Your WealthyStep platform is now fully deployed, secure, and production-ready with zero hosting costs.**
