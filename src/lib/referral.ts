export const REFERRAL_STORAGE_KEY = 'ms-global-referral-code';

export function captureReferralFromUrl(): void {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref?.trim()) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, ref.trim().toLowerCase());
    }
  } catch {
    /* ignore */
  }
}

export function getStoredReferralCode(): string | undefined {
  try {
    const v = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return v?.trim() || undefined;
  } catch {
    return undefined;
  }
}

export function clearStoredReferralCode(): void {
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
