import type { Metadata } from "next";
import { Inter, Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { StructuredData } from "@/components/seo/StructuredData";
import { TickerBar } from "@/components/sections/TickerBar";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

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
  title: "Wealthy Step | Legacy Through Mindful Steps",
  description: "Wealthy Step is an AMFI Registered Mutual Fund Distributor providing goal-based mutual fund investment solutions, insurance, and NRI services.",
  metadataBase: new URL('https://wealthystep.com'),
  openGraph: {
    title: "Wealthy Step | Legacy Through Mindful Steps",
    description: "Wealthy Step is an AMFI Registered Mutual Fund Distributor providing goal-based mutual fund investment solutions, insurance, and NRI services.",
    url: "https://wealthystep.com",
    siteName: "Wealthy Step",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wealthy Step",
    description: "Wealthy Step is an AMFI Registered Mutual Fund Distributor providing goal-based mutual fund investment solutions, insurance, and NRI services.",
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
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-text-body">
        <Navbar />
        <TickerBar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ChatbotWidget />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
