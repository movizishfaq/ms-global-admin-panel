import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useVisitorSite } from '../hooks/useVisitorSite';

/** Syncs builder theme + SEO to the document (CSS variables mirror `index.css` names). */
export function SiteThemeRoot() {
  const site = useVisitorSite();
  const { pathname } = useLocation();
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--primary', site.theme.primary);
    r.style.setProperty('--dark', site.theme.dark);
    r.style.setProperty('--red', site.theme.accent);
    document.body.style.backgroundColor = site.theme.pageBg;
  }, [site.theme]);

  useEffect(() => {
    if (pathname.startsWith('/p/')) return;
    document.title = site.seo.documentTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', site.seo.metaDescription);
  }, [pathname, site.seo.documentTitle, site.seo.metaDescription]);

  return null;
}
