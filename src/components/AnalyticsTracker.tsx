import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

/** Increments lightweight traffic stats (local demo). Skips /admin routes. */
export function AnalyticsTracker() {
  const { pathname } = useLocation();
  const { recordPageView } = useStore();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (last.current === pathname) return;
    last.current = pathname;
    recordPageView(pathname);
  }, [pathname, recordPageView]);
  return null;
}
