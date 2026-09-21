"use client";

import React from "react";
import Script from "next/script";
import { useCookieConsent } from "@/hooks/useCookieConsent";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Optimized Google Analytics 4 (GA4) Tracking Component
 * - Uses next/script with strategy="afterInteractive" for non-blocking script loading.
 * - Safely resolves NEXT_PUBLIC_GA_MEASUREMENT_ID without throwing if missing.
 * - Respects user cookie consent preferences for analytics cookies.
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { consentState, hasInitialized } = useCookieConsent();

  // Fail-safe: If measurement ID is missing, return null safely
  if (!gaId) {
    return null;
  }

  // Cookie Consent check: Only load tracking scripts if user has consented to analytics cookies
  if (hasInitialized && !consentState.preferences.analytics) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

export default GoogleAnalytics;
