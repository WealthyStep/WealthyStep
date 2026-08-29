"use client";

import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const { 
    isBannerVisible, 
    hasInitialized, 
    acceptAll, 
    rejectOptional, 
    openPreferencesModal 
  } = useCookieConsent();

  if (!hasInitialized || !isBannerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-5 sm:p-6 pointer-events-auto flex flex-col lg:flex-row gap-6 items-start lg:items-center animate-in slide-in-from-bottom-10 duration-500 ease-out">
          
          {/* Content */}
          <div className="flex-1 flex gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-lime/10 items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-lime" />
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[18px] font-bold text-navy tracking-tight mb-2">
                Your Privacy Matters
              </h2>
              <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed max-w-3xl">
                We use necessary cookies to keep Wealthy Step secure and functioning properly. With your permission, we may also use optional cookies to understand website usage and improve your experience. You can read more in our{' '}
                <Link href="/privacy-policy" className="text-lime font-semibold hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={openPreferencesModal}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-bold text-navy hover:bg-gray-50 rounded-full transition-colors whitespace-nowrap"
            >
              Manage Preferences
            </button>
            <button
              onClick={rejectOptional}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-bold text-navy border border-navy/20 hover:bg-navy/5 rounded-full transition-colors whitespace-nowrap"
            >
              Reject Optional
            </button>
            <button
              onClick={acceptAll}
              className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-bold text-white bg-cta-green hover:bg-lime hover:text-navy rounded-full transition-colors shadow-sm whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
