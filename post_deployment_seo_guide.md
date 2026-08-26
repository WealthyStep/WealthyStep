# Wealthy Step — Post-Deployment SEO & Analytics Guide

This guide outlines the exact step-by-step process you must follow immediately after deploying your website to production (e.g., on Vercel, Netlify, or AWS). Following these steps ensures you can track every visitor, monitor your Google rankings, and ensure search engines crawl your site correctly.

---

## Phase 1: Google Analytics 4 (GA4) Configuration
*Goal: Track user behavior, traffic sources, and interactions (like WhatsApp clicks).*

### Step 1: Create a GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/) and sign in with your business Google account.
2. Click **Admin** (the gear icon bottom left) > **Create Property**.
3. Name it "Wealthy Step", select your timezone (India) and currency (INR).
4. Select your industry (Financial) and business size.
5. Choose your business objectives (e.g., Generate Leads, Examine user behavior).
6. Click **Web** as your platform for data collection.
7. Enter your website URL (`https://wealthystep.com`) and stream name ("Wealthy Step Web Stream").
8. Click **Create Stream**.

### Step 2: Get Your Measurement ID
1. Once the stream is created, you will see a **Measurement ID** at the top right. It looks like this: `G-XXXXXXXXXX`.
2. Copy this ID.

### Step 3: Inject the ID into Your Hosting Provider (Vercel)
*Since the code is already built to handle this, you just need to provide the ID to the server.*
1. Log in to your hosting provider (e.g., Vercel).
2. Go to your **Wealthy Step** project > **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (Paste your copied ID here).
4. Click **Save** and **Redeploy** your website so the variable is injected into the live code.

---

## Phase 2: Google Search Console (GSC) Setup
*Goal: Monitor your organic search performance, fix indexing errors, and see exactly what keywords people are typing to find you.*

### Step 1: Verify Domain Ownership
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Choose the **Domain** property type (Left box) and enter `wealthystep.com`.
4. Google will give you a **TXT Record** (a string of text).
5. Go to the website where you bought your domain (e.g., GoDaddy, Namecheap, Cloudflare).
6. Open the **DNS Settings** for your domain and add a new record:
   - **Type**: TXT
   - **Name/Host**: `@`
   - **Value**: Paste the TXT record from Google.
7. Go back to Search Console and click **Verify**. *(Note: DNS changes can take a few minutes to an hour to propagate).*

### Step 2: Submit Your XML Sitemap
*This tells Google exactly which pages exist on your site.*
1. In the left menu of Google Search Console, click **Sitemaps**.
2. Under "Add a new sitemap", type `sitemap.xml`.
3. Click **Submit**. 
4. Google will process it and should display a status of "Success" along with the number of discovered URLs (approx 20 URLs for your site right now).

---

## Phase 3: Bing Webmaster Tools (Optional but Recommended)
*Goal: Capture traffic from Microsoft Bing and Yahoo.*
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/about).
2. Sign in and click **Import from Google Search Console**.
3. This will instantly copy your verified domain and sitemap over to Bing without needing any extra DNS setup!

---

## Phase 4: Google Business Profile (Local SEO)
*Goal: Appear on Google Maps and the "Local Pack" for searches like "Mutual Fund Distributor near me".*

1. Go to [Google Business Profile](https://www.google.com/business/).
2. Click **Manage Now** and enter your business name ("Wealthy Step").
3. Choose your business type. (If you have a physical office clients visit, choose "Local Store". If you operate fully remotely, choose "Service Business").
4. Enter your exact, verified business address.
5. Add your phone number and website URL (`https://wealthystep.com`).
6. **Verification**: Google will likely send a postcard with a PIN to your address or ask for a video verification of your office/workspace to prove it's a real business.
7. Once verified, fill out your profile completely (add your logo, working hours, and a description mentioning you are an AMFI Registered Mutual Fund Distributor).

---

## Phase 5: Testing Your Tracking (Day 1 Checklist)

Once everything above is done, perform these tests:

- [ ] **Test Analytics**: Open your website on your phone. Then, open Google Analytics on your computer and go to **Reports > Realtime**. You should see "1 User" (which is you) active on the site.
- [ ] **Test WhatsApp Clicks**: In Google Analytics, go to **Admin > Events**. The code we wrote automatically tracks outbound link clicks. When users click your WhatsApp button, it should register as an event.
- [ ] **Test Indexing**: Go to Google.com and search for `site:wealthystep.com`. This will show you exactly which pages Google has successfully indexed and added to its search engine. (It usually takes 3-7 days after submitting the sitemap for pages to start appearing here).
