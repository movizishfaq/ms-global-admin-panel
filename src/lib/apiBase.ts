function normalizeApiBase(raw: string): string {
  let base = raw.trim().replace(/\/$/, '');
  if (base.endsWith('/health')) {
    base = base.slice(0, -'/health'.length).replace(/\/$/, '');
  }
  if (!/^https?:\/\//i.test(base)) return '';
  return base;
}

const BUILD_TIME_BASE = (import.meta.env.VITE_API_URL as string | undefined)
  ? normalizeApiBase(import.meta.env.VITE_API_URL as string)
  : '';

const SESSION_KEY = 'ms-global-api-base';

/** API origin from build env, studio iframe ?apiBase=, or session (preview). */
export function getApiBase(): string {
  if (BUILD_TIME_BASE) return BUILD_TIME_BASE;
  if (typeof window !== 'undefined') {
    const fromQuery = new URLSearchParams(window.location.search).get('apiBase');
    if (fromQuery) {
      return normalizeApiBase(decodeURIComponent(fromQuery));
    }
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) return normalizeApiBase(stored);
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
    sessionStorage.setItem(SESSION_KEY, normalizeApiBase(decodeURIComponent(raw)));
  } catch {
    /* ignore */
  }
}

export function apiBaseConfigured(): boolean {
  return getApiBase().length > 0;
}

export function missingApiBaseMessage(): string {
  return 'Set VITE_API_URL to your API host (ms-global-server on Vercel), e.g. https://ms-global-server.vercel.app — not the shop or studio URL.';
}

/** True if API URL looks like a static frontend deploy (common misconfiguration). */
export function apiBaseLooksLikeFrontend(): boolean {
  const base = getApiBase().toLowerCase();
  if (!base) return false;
  return (
    base.includes('ms-global-zeta') ||
    base.includes('ms-global-admin-panel') ||
    base.includes('ms-global-admin-pannel')
  );
}
