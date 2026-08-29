export type ConsentStatus = 'granted' | 'denied';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface ConsentState {
  version: string;
  isCustomized: boolean; // True if the user has made a choice (accept all, reject optional, or custom)
  preferences: CookiePreferences;
  updatedAt: string; // ISO date string
}

export interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  required: boolean;
}
