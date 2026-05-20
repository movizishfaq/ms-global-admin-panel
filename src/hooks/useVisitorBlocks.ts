import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { BuilderBlock, BuilderPage } from '../types/builderPage';

export function useForceBuilderDraft(): boolean {
  const { search } = useLocation();
  return useMemo(() => {
    const qp = new URLSearchParams(search);
    return (
      qp.get('studioDraft') === '1' ||
      (typeof window !== 'undefined' && window.parent !== window)
    );
  }, [search]);
}

export function visitorBlocksForPage(
  page: BuilderPage,
  publishStatus: 'draft' | 'published',
  hasPublishedSite: boolean,
  forceDraft: boolean
): BuilderBlock[] {
  if (forceDraft) return page.draftBlocks;
  if (publishStatus === 'published' && hasPublishedSite) {
    return page.publishedBlocks ?? page.draftBlocks;
  }
  return page.draftBlocks;
}

export function useVisitorBlocks(
  page: BuilderPage | undefined
): BuilderBlock[] {
  const { siteMeta, publishedSite } = useStore();
  const forceDraft = useForceBuilderDraft();
  return useMemo(() => {
    if (!page) return [];
    return visitorBlocksForPage(
      page,
      siteMeta.publishStatus,
      publishedSite != null,
      forceDraft
    );
  }, [page, siteMeta.publishStatus, publishedSite, forceDraft]);
}
