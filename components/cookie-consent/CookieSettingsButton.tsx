"use client";

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { ChevronRight } from 'lucide-react';

export function CookieSettingsButton() {
  const { openPreferencesModal } = useCookieConsent();

  return (
    <button 
      onClick={openPreferencesModal}
      className="flex items-center justify-between w-full hover:text-lime transition-colors group"
      aria-label="Open Cookie Settings"
    >
      Cookie Settings
      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
