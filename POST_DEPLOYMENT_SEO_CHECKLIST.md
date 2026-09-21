# Wealthy Step — Post-Deployment Technical SEO & Indexation Master Checklist

**Domain:** `https://www.wealthystep.com`  
**Application Architecture:** Next.js 16 App Router (Turbopack SSG / Prerendered)  
**Target Search Engine Metrics:** PageSpeed Score 90+, 100% Valid Schema, 0 Duplicate Content Errors  

---

## 1. Automated CLI / Live `curl` Verification Commands

Run these terminal commands against the live production deployment to verify SSL enforcement, HTTP-to-HTTPS redirection, strict trailing slash normalization, `robots.txt` directives, and XML sitemap delivery.

### A. HTTP to HTTPS & Non-WWW Redirection
```bash
# 1. Test HTTP to HTTPS redirection (Should return HTTP 301 / 308 to https://)
curl -I -s -L "http://wealthystep.com" | grep -E "HTTP/|Location:"

# 2. Test Root Domain to WWW Redirection
curl -I -s -L "https://wealthystep.com" | grep -E "HTTP/|Location:"
```
*Expected Result:* Clean redirect to `https://www.wealthystep.com/` with zero redirect loops.

---

### B. Trailing Slash Normalization (Eliminating Duplicate Content)
```bash
# 1. Test Non-Trailing Slash URL (Must return 308 Permanent Redirect)
curl -I -s "https://www.wealthystep.com/about" | grep -E "HTTP/|Location:"

# 2. Test Canonical Trailing Slash URL (Must return 200 OK)
curl -I -s "https://www.wealthystep.com/about/" | grep -E "HTTP/|canonical"
```
*Expected Result:*
- `/about` -> `Location: /about/` (HTTP 308)
- `/about/` -> `HTTP/2 200` with `<link rel="canonical" href="https://www.wealthystep.com/about/" />`

---

### C. Live Robots.txt Crawler Validation
```bash
# Fetch live robots.txt
curl -s "https://www.wealthystep.com/robots.txt"
```
*Verification Checklist:*
- [ ] `User-agent: *` is present.
- [ ] `Allow: /` is present.
- [ ] `Disallow: /api/`, `/admin/`, `/private/`, `/wp-admin/`, `/wp-includes/`, `/wp-json/`, `/category/`, `/tag/`, `/feed/`, `/*.php$` are configured.
- [ ] `Sitemap: https://www.wealthystep.com/sitemap.xml` is explicitly defined at the bottom.

---

### D. Dynamic XML Sitemap Validation
```bash
# 1. Fetch XML Sitemap HTTP status and content type
curl -I -s "https://www.wealthystep.com/sitemap.xml" | grep -E "HTTP/|content-type:"

# 2. Verify all URLs in sitemap output HTTPS production URLs with trailing slashes
curl -s "https://www.wealthystep.com/sitemap.xml" | grep -o '<loc>[^<]*</loc>'
```
*Verification Checklist:*
- [ ] Content-Type is `application/xml` or `text/xml`.
- [ ] Zero instances of `http://`, `localhost`, or dev URLs exist.
- [ ] Every static route (`/about/`, `/investments/`, `/insurance/`, etc.) ends with a strict trailing slash `/`.
- [ ] All dynamic blogs (`/blogs/[slug]/`) and knowledge articles (`/knowledge/[slug]/`) are included.

---

### E. Legacy WordPress Redirect Matrix Testing
```bash
# 1. Test legacy WP about page
curl -I -s "https://www.wealthystep.com/about-us/" | grep -E "HTTP/|Location:"

# 2. Test legacy WP uploads wildcard redirect
curl -I -s "https://www.wealthystep.com/wp-content/uploads/sample.jpg" | grep -E "HTTP/|Location:"

# 3. Test legacy RSS feed redirect
curl -I -s "https://www.wealthystep.com/feed/" | grep -E "HTTP/|Location:"
```
*Expected Result:*
- `/about-us/` -> `Location: /about/` (301)
- `/wp-content/uploads/sample.jpg` -> `Location: /images/sample.jpg` (301)
- `/feed/` -> `Location: /` (301)

---

## 2. Google Search Console (GSC) Setup & Indexation Workflow

### Step 1: DNS Domain Property Verification
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Select **Add Property** -> Choose **Domain** (`wealthystep.com`).
3. Copy the provided `google-site-verification` TXT token.
4. Add the TXT record to your DNS provider (Cloudflare / Hostinger / Route53 / GoDaddy):
   - **Type:** `TXT`
   - **Name / Host:** `@` or `wealthystep.com`
   - **Value:** `google-site-verification=XXXXXXXXXXXXXXXXXXXX`
   - **TTL:** `Auto` or `300s`
5. Click **Verify** in Search Console.

---

### Step 2: Sitemap Submission
1. In GSC, click **Sitemaps** in the left sidebar under *Indexing*.
2. In the *Add a new sitemap* input, enter:
   ```text
   sitemap.xml
   ```
3. Click **Submit**.
4. Confirm the status turns green with status **Success** and the discovered URL count matches the total routes (`~20+ pages`).

---

### Step 3: URL Inspection & Priority Fast-Track Indexing
For high-priority landing pages, manually request indexing to bypass standard crawl queuing:
1. Open the **URL Inspection** search bar at the top of GSC.
2. Inspect the core target URLs:
   - `https://www.wealthystep.com/`
   - `https://www.wealthystep.com/about/`
   - `https://www.wealthystep.com/investments/`
   - `https://www.wealthystep.com/insurance/`
   - `https://www.wealthystep.com/goal-calculators/`
   - `https://www.wealthystep.com/nri-services/`
   - `https://www.wealthystep.com/knowledge/`
   - `https://www.wealthystep.com/blogs/`
   - `https://www.wealthystep.com/contact/`
3. Click **Test Live URL** -> Confirm "URL is available to Google".
4. Click **Request Indexing**.

---

## 3. Schema.org & Google Rich Results Validation

Validate structured data markup using Google's official testing suites:

### Testing Tools
- **Google Rich Results Test:** [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **Schema.org Validator:** [https://validator.schema.org/](https://validator.schema.org/)

### Schemas to Confirm:
| Page / Route | Target Schemas | Expected Status |
| :--- | :--- | :--- |
| `https://www.wealthystep.com/` | `Organization`, `Corporation`, `FinancialService`, `WebSite` | **Valid (0 Errors, 0 Warnings)** |
| `https://www.wealthystep.com/goal-calculators/` | `SoftwareApplication` / `WebApplication`, `BreadcrumbList` | **Valid (0 Errors, 0 Warnings)** |
| `https://www.wealthystep.com/blogs/[slug]/` | `BlogPosting`, `BreadcrumbList` | **Valid (0 Errors, 0 Warnings)** |
| `https://www.wealthystep.com/knowledge/[slug]/` | `Article`, `BreadcrumbList` | **Valid (0 Errors, 0 Warnings)** |

*Key Items to Verify:*
- [ ] Organization `legalName` is `LTM Ventures India LLP`.
- [ ] AMFI identifier `ARN-322891` is recognized.
- [ ] Slogan and customer care contact points (`+91-9000929666`) are present.
- [ ] All Schema URLs are absolute HTTPS URLs with trailing slashes.

---

## 4. Core Web Vitals (CWV) & PageSpeed Performance Thresholds

Test live URLs using [Google PageSpeed Insights](https://pagespeed.web.dev/) and Chrome DevTools Lighthouse:

| Metric | Target Standard | Optimization Implemented |
| :--- | :--- | :--- |
| **Performance Score** | **90+ / 100** | Next.js 16 Turbopack SSG, Minified Tailwind CSS, Brotli compression |
| **Largest Contentful Paint (LCP)** | **< 2.5s** | Instant hero image preloading with `priority`, responsive `sizes`, no lazy loading |
| **Cumulative Layout Shift (CLS)** | **0.00** | Explicit pixel bounds on all image containers via Tailwind aspect ratios |
| **Interaction to Next Paint (INP)** | **< 200ms** | Debounced calculator state updates, passive scroll listeners |
| **First Contentful Paint (FCP)** | **< 1.0s** | Zero render-blocking scripts, `afterInteractive` GA4 loading |

---

## 5. Post-Deployment Verification Summary Table

| Check Item | Command / Tool | Pass Criteria | Verified |
| :--- | :--- | :--- | :---: |
| **SSL Enforcement** | `curl -I http://domain` | 301 / 308 to `https://` | [ ] |
| **Trailing Slash** | `curl -I https://domain/about` | 308 Redirect to `/about/` | [ ] |
| **Robots.txt** | `curl https://domain/robots.txt` | Points to sitemap, disallows `/admin/`, `/wp-admin/` | [ ] |
| **Sitemap.xml** | `curl https://domain/sitemap.xml` | Valid XML, production HTTPS domain, all routes | [ ] |
| **Google Search Console** | GSC DNS Record | Verified property, sitemap submitted | [ ] |
| **Schema Validation** | Rich Results Test | 0 errors for Organization, SoftwareApp, Articles | [ ] |
| **Core Web Vitals** | PageSpeed Insights | Mobile Performance > 90, CLS = 0.00 | [ ] |
| **GA4 Tracking** | Network Tab / Real-Time | Events firing with `gtag('config')` | [ ] |

---

*Generated by Wealthy Step SEO Engineering Team.*
