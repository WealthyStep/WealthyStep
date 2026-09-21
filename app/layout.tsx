import type { Metadata } from "next";
import { Inter, Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import { GlobalStructuredData } from "@/components/seo/json-ld";
import { TickerBar } from "@/components/sections/TickerBar";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { CookieConsentProvider } from "@/components/cookie-consent/CookieConsentProvider";
import { CookieBanner } from "@/components/cookie-consent/CookieBanner";
import { CookiePreferencesModal } from "@/components/cookie-consent/CookiePreferencesModal";
import { SITE_CONFIG } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.defaultTitle,
  description: SITE_CONFIG.defaultDescription,
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - AMFI Registered Mutual Fund Distributor`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    images: [`${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}`],
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* hreflang: Signal to Google that primary audience is English-speaking India */}
        <link rel="alternate" hrefLang="en-IN" href={SITE_CONFIG.siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={SITE_CONFIG.siteUrl} />
        <GlobalStructuredData />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-text-body">
        <CookieConsentProvider>
          <Navbar />
          <TickerBar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <WhatsAppButton />
          <ChatbotWidget />
          <GoogleAnalytics />
          <CookieBanner />
          <CookiePreferencesModal />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
