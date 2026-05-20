export type AppMode = 'storefront' | 'studio';

/** Storefront = public shop. Studio = owner-only website editor (separate domain). */
export function getAppMode(): AppMode {
  const forced = import.meta.env.VITE_APP_MODE as string | undefined;
  if (forced === 'studio' || forced === 'storefront') return forced;

  const studioHosts = (
    import.meta.env.VITE_STUDIO_HOSTS as string | undefined
  )?.split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean) ?? ['studio.localhost', 'localhost:5174'];

  if (typeof window !== 'undefined') {
    const host = window.location.host.toLowerCase();
    if (studioHosts.some((h) => host === h)) return 'studio';
  }
  return 'storefront';
}

export function isStudioMode(): boolean {
  return getAppMode() === 'studio';
}

export function isStorefrontMode(): boolean {
  return getAppMode() === 'storefront';
}

export function publicSiteOrigin(): string {
  const url =
    import.meta.env.VITE_PUBLIC_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '');
  return String(url).replace(/\/$/, '');
}

export function studioSiteOrigin(): string {
  const url =
    import.meta.env.VITE_STUDIO_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '');
  return String(url).replace(/\/$/, '');
}
