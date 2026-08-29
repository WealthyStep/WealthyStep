import { ConsentState } from './consent-types';
import { CONSENT_STORAGE_KEY, INITIAL_CONSENT_STATE, CONSENT_VERSION } from './consent-config';

export function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') {
    return INITIAL_CONSENT_STATE;
  }

  try {
    const item = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!item) return INITIAL_CONSENT_STATE;

    const parsed = JSON.parse(item) as Partial<ConsentState>;
    
    // Check for version mismatch or missing data to enforce re-consent
    if (!parsed || parsed.version !== CONSENT_VERSION || !parsed.preferences) {
      return INITIAL_CONSENT_STATE;
    }

    return parsed as ConsentState;
  } catch (error) {
    console.error('Failed to parse cookie consent from local storage', error);
    return INITIAL_CONSENT_STATE;
  }
}

export function saveConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;

  try {
    const stateToSave = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save cookie consent to local storage', error);
  }
}
