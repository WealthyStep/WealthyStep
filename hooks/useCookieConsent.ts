"use client";

import { useContext } from 'react';
import { CookieConsentContext } from '@/components/cookie-consent/CookieConsentProvider';

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  
  return context;
}
