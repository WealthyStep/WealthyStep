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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-5 pointer-events-none flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-[#180D45] rounded-[16px] shadow-[0_20px_50px_-12px_rgba(24,13,69,0.3)] border border-white/10 p-4 sm:p-5 pointer-events-auto flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center animate-in slide-in-from-bottom-12 duration-700 ease-out">
          
          {/* Content */}
          <div className="flex-1 flex gap-3 sm:gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-lime/10 items-center justify-center shrink-0 border border-lime/20 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-lime" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[15px] font-bold text-white tracking-tight mb-1">
                Your Privacy Matters
              </h2>
              <p className="text-[12px] text-white/70 leading-relaxed max-w-2xl">
                We use cookies to keep Wealthy Step secure and improve your experience. You can read more in our{' '}
                <Link href="/privacy-policy" className="text-lime hover:text-white transition-colors underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
            <button
              onClick={openPreferencesModal}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-bold text-white/60 hover:text-white rounded-full transition-colors whitespace-nowrap"
            >
              Preferences
            </button>
            <button
              onClick={rejectOptional}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-bold text-white border border-white/20 hover:bg-white/10 rounded-full transition-all whitespace-nowrap"
            >
              Reject Optional
            </button>
            <button
              onClick={acceptAll}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-bold text-navy bg-lime hover:bg-[#95cf4c] rounded-full transition-all shadow-[0_4px_14px_0_rgba(131,193,32,0.2)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
