import { CookieCategory, CookiePreferences, ConsentState } from './consent-types';

export const CONSENT_STORAGE_KEY = 'wealthystep_cookie_consent';
export const CONSENT_VERSION = '1.0';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
};

export const INITIAL_CONSENT_STATE: ConsentState = {
  version: CONSENT_VERSION,
  isCustomized: false,
  preferences: DEFAULT_PREFERENCES,
  updatedAt: new Date().toISOString(),
};

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary Cookies',
    description: 'These cookies are required for the website to function securely and cannot be switched off. They include essential preferences and basic functionality.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with the website. This data is collected anonymously and helps us improve the user experience.',
    required: false,
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'Allow the website to remember choices you make and provide enhanced, more personalized features.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to track visitors across websites to display relevant advertisements. (We do not currently load external marketing trackers without consent).',
    required: false,
  },
];
