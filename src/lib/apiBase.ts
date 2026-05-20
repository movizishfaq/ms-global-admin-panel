const BUILD_TIME_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const SESSION_KEY = 'ms-global-api-base';

/** API origin from build env, studio iframe ?apiBase=, or session (preview). */
export function getApiBase(): string {
  if (BUILD_TIME_BASE) return BUILD_TIME_BASE;
  if (typeof window !== 'undefined') {
    const fromQuery = new URLSearchParams(window.location.search).get('apiBase');
    if (fromQuery) {
      return decodeURIComponent(fromQuery).replace(/\/$/, '');
    }
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) return stored.replace(/\/$/, '');
    } catch {
      /* ignore */
    }
  }
  return '';
}

/** Persist ?apiBase= from Site Studio preview iframe for in-preview sign-in. */
export function persistApiBaseFromQuery(): void {
  if (typeof window === 'undefined' || BUILD_TIME_BASE) return;
  const raw = new URLSearchParams(window.location.search).get('apiBase');
  if (!raw) return;
  try {
    sessionStorage.setItem(SESSION_KEY, decodeURIComponent(raw).replace(/\/$/, ''));
  } catch {
    /* ignore */
  }
}

export function apiBaseConfigured(): boolean {
  return getApiBase().length > 0;
}

export function missingApiBaseMessage(): string {
  return 'API URL is not configured. Set VITE_API_URL on Vercel (shop + studio) to your ms-global-server URL.';
}
