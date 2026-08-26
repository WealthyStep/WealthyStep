# Wealthy Step — Modern Mutual Fund Distribution Platform

![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

**Wealthy Step** is a premium, high-performance web application built for an AMFI Registered Mutual Fund Distributor (ARN-322891). It provides clients with goal-based mutual fund investment solutions, comprehensive insurance planning, NRI services, and interactive financial calculators.

The platform is designed with a heavy emphasis on **Performance (Core Web Vitals)**, **SEO**, **Security**, and **Conversion Rate Optimization (CRO)**.

---

## 🚀 Key Features

* **Intelligent Chatbot & Lead Generation:** A custom NLP-driven chatbot (`ChatbotWidget`) that handles user intents, answers FAQs, and seamlessly transitions into a Zod-validated Lead Capture Form.
* **Interactive Goal Calculators:** 10+ dynamic financial calculators (SIP, Step-up SIP, Lumpsum, Retirement, Education, etc.) built with Recharts, dynamically lazy-loaded for peak performance.
* **Secure Backend API Routes:** Serverless Next.js API routes (`/api/chatbot/submit`) that validate incoming payloads with `zod` and securely dispatch HTML-templated emails via Nodemailer.
* **Enterprise-grade Security:** Configured with strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options, and XSS Protection headers in `next.config.ts`.
* **Deep SEO Optimization:** 
  - Dynamic `sitemap.ts` mapping both static pages and CMS-driven articles.
  - JSON-LD Structured Data (`LocalBusiness` / `FinancialService`) for Local SEO dominance.
  - Strict accessibility and `rel="noopener noreferrer"` external linking policies.
* **Flawless Performance:** 100% Server Components by default. Dynamic imports for heavy libraries (like Recharts). Highly optimized static asset caching and `next/image` lazy-loading.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Framer Motion (Animations)
* **Forms & Validation:** React Hook Form + Zod
* **Charts:** Recharts (Dynamically imported)
* **Icons:** Lucide React
* **Email:** Nodemailer (SMTP)
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
wealthystep/
├── app/                  # Next.js App Router (Pages, API Routes, Layouts, Sitemap)
│   ├── api/              # Serverless backend functions (e.g., /api/chatbot/submit)
│   ├── goal-calculators/ # Financial calculator pages
│   ├── knowledge/        # Dynamic blog/knowledge center routes
│   └── globals.css       # Global Tailwind styling
├── components/           # Reusable React components
│   ├── chatbot/          # Chatbot logic, UI, and lead flow forms
│   ├── forms/            # Standard contact forms (ContactForm.tsx)
│   ├── hero/             # Hero sections for various pages
│   ├── layout/           # Navbar, Footer, and structural components
│   ├── sections/         # Informational page sections
│   └── seo/              # StructuredData.tsx and Breadcrumbs.tsx
├── lib/                  # Utilities, mock CMS, and validators
│   ├── chatbot/          # NLP logic, intents, and Zod schemas
│   └── data/             # Static content and blog data
├── public/               # Static assets (Images, Icons, PDFs, manifest)
└── next.config.ts        # Next.js configuration and Security Headers
```

---

## ⚙️ Environment Variables

To run the application locally or deploy it to Vercel, you must configure the following environment variables in a `.env.local` file (or in your Vercel Project Settings). **Do not commit your `.env.local` file.**

```env
# Email SMTP Configuration (For Contact/Chatbot Forms)
SMTP_HOST=smtp.gmail.com            # e.g., smtp.gmail.com
SMTP_PORT=465                       # 465 for SSL, 587 for TLS
SMTP_SECURE=true                    # true for 465, false for 587
SMTP_USER=your-email@gmail.com      # Your sending email address
SMTP_PASSWORD=your-app-password     # App-specific password (not standard password)
EMAIL_FROM=your-email@gmail.com     # From address on outgoing emails
EMAIL_TO=receiving-email@gmail.com  # Address where leads will be sent
```

*(Note: See `.env.example` for a template).*

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Copy `.env.example` to `.env.local` and populate it with your SMTP credentials.

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Run a Production Build locally (for testing):**
   ```bash
   npm run build
   npm run start
   ```

---

## 🚢 Deployment (Vercel)

This project is fully optimized for **Vercel** deployment. 

1. Push your code to a GitHub repository.
2. Import the repository into your Vercel Dashboard.
3. In the Vercel project settings, navigate to **Environment Variables** and paste the variables from your `.env.local` file.
4. Click **Deploy**. Vercel will automatically detect Next.js and build the application. The API routes will be provisioned as serverless functions automatically.

---

## 🛡️ License & Compliance

* **AMFI ARN:** 322891
* This application complies with strict SEO, security, and financial web standards. Mutual fund investments are subject to market risks; all standard disclaimers are mapped appropriately in the footer and Risk Factors page.

