"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { COOKIE_CATEGORIES } from '@/lib/cookie-consent/consent-config';
import { CookiePreferences } from '@/lib/cookie-consent/consent-types';
import { CookieCategoryCard } from './CookieCategoryCard';

export function CookiePreferencesModal() {
  const { 
    isPreferencesModalOpen, 
    closePreferencesModal, 
    consentState, 
    saveCustomPreferences,
    acceptAll,
    rejectOptional
  } = useCookieConsent();

  // Local state for toggles before saving
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(consentState.preferences);

  // Sync local state when modal opens
  useEffect(() => {
    if (isPreferencesModalOpen) {
      setLocalPreferences(consentState.preferences);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreferencesModalOpen, consentState.preferences]);

  if (!isPreferencesModalOpen) return null;

  const handleToggle = (id: string, enabled: boolean) => {
    if (id === 'necessary') return; // Cannot toggle necessary
    setLocalPreferences(prev => ({
      ...prev,
      [id]: enabled
    }));
  };

  const handleSave = () => {
    saveCustomPreferences(localPreferences);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="cookie-modal-title"
        className="w-full max-w-2xl bg-[#fcfcfc] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 sm:py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-lime" />
            </div>
            <div>
              <h2 id="cookie-modal-title" className="text-[18px] font-bold text-navy tracking-tight leading-tight">
                Privacy Preferences
              </h2>
              <p className="text-[12px] text-gray-500 font-medium">Manage your cookie settings</p>
            </div>
          </div>
          <button 
            onClick={closePreferencesModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-navy transition-colors"
            aria-label="Close preferences modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <p className="text-[14px] text-gray-600 mb-6 leading-relaxed">
            We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.
          </p>

          <div className="space-y-1">
            {COOKIE_CATEGORIES.map((category) => (
              <CookieCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                required={category.required}
                enabled={localPreferences[category.id as keyof CookiePreferences]}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:px-6 sm:py-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={rejectOptional}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-navy/20 text-[13px] font-bold text-navy hover:bg-navy/5 transition-colors text-center"
          >
            Reject Optional
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-transparent bg-gray-100 text-[13px] font-bold text-navy hover:bg-gray-200 transition-colors text-center"
            >
              Save Preferences
            </button>
            <button
              onClick={acceptAll}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-cta-green text-[13px] font-bold text-white hover:bg-lime hover:text-navy transition-colors shadow-sm text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
