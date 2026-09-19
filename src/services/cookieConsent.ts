import { setConsent, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { analytics } from '@/config/firebase';

export type CookieConsentStatus = 'accepted' | 'declined';

const CONSENT_STORAGE_KEY = 'depudados_cookie_consent';

export const getStoredCookieConsent = (): CookieConsentStatus | null => {
  const storedValue = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (storedValue === 'accepted' || storedValue === 'declined') {
    return storedValue;
  }
  return null;
};

export const applyCookieConsent = (status: CookieConsentStatus): void => {
  const isGranted = status === 'accepted';

  try {
    setConsent({
      analytics_storage: isGranted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    if (analytics) {
      setAnalyticsCollectionEnabled(analytics, isGranted);
    }
  } catch (error) {
    console.warn('Não foi possível configurar o consentimento no Firebase Analytics:', error);
  }
};

export const saveCookieConsent = (status: CookieConsentStatus): void => {
  localStorage.setItem(CONSENT_STORAGE_KEY, status);
  applyCookieConsent(status);
};

export const initCookieConsent = (): void => {
  const currentConsent = getStoredCookieConsent();

  if (currentConsent) {
    applyCookieConsent(currentConsent);
  } else {
    // Por padrão (LGPD / Privacy by default), manter analíticos desabilitados até decisão explícita
    applyCookieConsent('declined');
  }
};
