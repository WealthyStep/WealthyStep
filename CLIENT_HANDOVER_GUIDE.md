# Wealthy Step — Client Handover & Setup Guide

![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)

Welcome to the **Wealthy Step** repository! This is a premium, high-performance web application built for an AMFI Registered Mutual Fund Distributor.

This guide is designed to be a complete, step-by-step, zero-confusion tutorial for clients or new developers taking over the repository to get the website running locally and deployed to production.

---

## Step 1: Prerequisites

Before you can run this website on your computer, you need to have two things installed:

1. **Node.js**: The environment that runs the code. 
   - Download and install the latest "LTS" version from [nodejs.org](https://nodejs.org/).
2. **Git**: To clone (download) the repository.
   - Download from [git-scm.com](https://git-scm.com/).

---

## Step 2: Download the Project

Open your computer's terminal (Command Prompt, PowerShell, or Mac Terminal) and run:

```bash
git clone https://github.com/YOUR_USERNAME/wealthystep.git
cd wealthystep
```
*(Replace `YOUR_USERNAME` with the actual GitHub username where the repository is hosted).*

---

## Step 3: Install Dependencies

Once you are inside the `wealthystep` folder, tell Node.js to download all the required packages (like Next.js, React, and Tailwind) by running:

```bash
npm install
```

---

## Step 4: Set Up Environment Variables

The website relies on environment variables to send emails (from contact forms and the chatbot) and track analytics.

1. In the root folder of the project, create a new file named exactly `.env.local`
2. Open `.env.local` in your code editor and paste the following template:

```env
# ----------------------------------------------------
# 1. EMAIL CONFIGURATION (For Contact Forms & Chatbot)
# ----------------------------------------------------
# We use Gmail SMTP in this example. If using Gmail, you MUST use an "App Password", not your normal password.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=receiving-email@gmail.com

# ----------------------------------------------------
# 2. GOOGLE ANALYTICS
# ----------------------------------------------------
# Your GA4 Measurement ID (Starts with 'G-')
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**CRITICAL:** Never commit the `.env.local` file to GitHub. It contains secret passwords.

---

## Step 5: Run the Website Locally (Development Mode)

Now that everything is installed and configured, start the local server:

```bash
npm run dev
```

- Open your web browser and go to: **[http://localhost:3000](http://localhost:3000)**
- You will see the live website! Every time you save a code change, the browser will automatically refresh.

---

## Step 6: Testing a Production Build

Before deploying the website to the internet, you should always verify that the "Production Build" succeeds. This catches TypeScript errors and broken links.

Stop the development server (`Ctrl + C`) and run:

```bash
npm run build
```

If it says `✓ Compiled successfully`, your code is 100% healthy and ready for production!

---

## Step 7: How to Deploy to Vercel (Production)

The absolute best and easiest place to host a Next.js website is **Vercel** (the creators of Next.js). 

1. Go to [Vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New Project**.
3. Import the `wealthystep` repository from your GitHub.
4. **Important:** In the Vercel deployment settings, look for the **"Environment Variables"** section. You must copy/paste all the variables from your `.env.local` file into Vercel here.
5. Click **Deploy**.

Vercel will now automatically build and host your website. 
Better yet, every time you run `git push origin main` to update your GitHub code, Vercel will automatically detect the update and deploy the new version to your live website in seconds!

---

## Folder Structure Guide

If you need to edit the code, here is where to look:

- `app/globals.css`: Where global fonts and Tailwind configurations live.
- `app/page.tsx`: The main Homepage content.
- `components/layout/Navbar.tsx`: The top navigation bar.
- `components/layout/Footer.tsx`: The bottom footer.
- `components/cookie-consent/`: The Premium Cookie Consent system.
- `components/chatbot/`: The intelligent floating chatbot logic.
- `lib/chatbot/validators.ts`: If you ever need to add new "Insurance types" to the chatbot dropdowns, edit them here.
