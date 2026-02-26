/**
 * GDPR-style cookie consent.
 * Necessary cookies (auth/session) are always used; optional (analytics, etc.) only with consent.
 */

export type ConsentLevel = 'necessary' | 'all' | null;

const STORAGE_KEY = 'cookie_consent';
const COOKIE_NAME = 'cookie_consent';
const COOKIE_MAX_AGE_DAYS = 365;

export function getStoredConsent(): ConsentLevel {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'all' || raw === 'necessary') return raw;
    return null;
  } catch {
    return null;
  }
}

export function setConsent(level: ConsentLevel): void {
  if (typeof window === 'undefined') return;
  try {
    const value = level ?? 'necessary';
    localStorage.setItem(STORAGE_KEY, value);
    document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60};SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function hasAnsweredConsent(): boolean {
  return getStoredConsent() !== null;
}

export function acceptsOptionalCookies(): boolean {
  return getStoredConsent() === 'all';
}
