import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { SiteBuilderState } from '../types/siteBuilder';

/**
 * Site config shown to visitors. Draft preview in Site Studio iframe or
 * `?studioDraft=1` uses the editable draft; published uses frozen snapshot.
 */
export function useVisitorSite(): SiteBuilderState {
  const store = useStore();
  const { search } = useLocation();
  return useMemo(() => {
    const qp = new URLSearchParams(search);
    const forceDraft =
      qp.get('studioDraft') === '1' ||
      (typeof window !== 'undefined' && window.parent !== window);
    if (forceDraft) return store.site;
    if (
      store.siteMeta.publishStatus === 'published' &&
      store.publishedSite
    ) {
      return store.publishedSite;
    }
    return store.site;
  }, [
    search,
    store.site,
    store.publishedSite,
    store.siteMeta.publishStatus
  ]);
}
