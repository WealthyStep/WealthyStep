"use client";

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { ConsentState, CookiePreferences } from '@/lib/cookie-consent/consent-types';
import { INITIAL_CONSENT_STATE, DEFAULT_PREFERENCES, CONSENT_VERSION } from '@/lib/cookie-consent/consent-config';
import { getStoredConsent, saveConsent } from '@/lib/cookie-consent/consent-storage';

interface CookieConsentContextType {
  consentState: ConsentState;
  isBannerVisible: boolean;
  isPreferencesModalOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveCustomPreferences: (preferences: CookiePreferences) => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  hasInitialized: boolean;
}

export const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentState>(INITIAL_CONSENT_STATE);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Load state from local storage on mount
    const stored = getStoredConsent();
    setConsentState(stored);
    
    // Show banner if no custom choice has been made
    if (!stored.isCustomized) {
      setIsBannerVisible(true);
    }
    
    setHasInitialized(true);
  }, []);

  const handleUpdateConsent = (newPreferences: CookiePreferences) => {
    const newState: ConsentState = {
      version: CONSENT_VERSION,
      isCustomized: true,
      preferences: newPreferences,
      updatedAt: new Date().toISOString(),
    };
    
    setConsentState(newState);
    saveConsent(newState);
    setIsBannerVisible(false);
    setIsPreferencesModalOpen(false);
  };

  const acceptAll = () => {
    handleUpdateConsent({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  };

  const rejectOptional = () => {
    handleUpdateConsent({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  };

  const saveCustomPreferences = (preferences: CookiePreferences) => {
    handleUpdateConsent(preferences);
  };

  const openPreferencesModal = () => {
    setIsPreferencesModalOpen(true);
  };

  const closePreferencesModal = () => {
    setIsPreferencesModalOpen(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        isBannerVisible,
        isPreferencesModalOpen,
        acceptAll,
        rejectOptional,
        saveCustomPreferences,
        openPreferencesModal,
        closePreferencesModal,
        hasInitialized,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}
