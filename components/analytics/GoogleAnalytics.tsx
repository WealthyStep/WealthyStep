"use client";

import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const { consentState, hasInitialized } = useCookieConsent();

  if (!measurementId || !hasInitialized) return null;

  // Only render tracking scripts if the user has consented to analytics cookies
  if (!consentState.preferences.analytics) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
