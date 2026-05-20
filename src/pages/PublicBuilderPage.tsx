import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BlockRenderer } from '../components/builder/BlockRenderer';
import { useVisitorBlocks } from '../hooks/useVisitorBlocks';

export function PublicBuilderPage() {
  const { slug } = useParams<{ slug: string }>();
  const { builderPages } = useStore();
  const page = useMemo(
    () => builderPages.find((p) => p.slug === slug),
    [builderPages, slug]
  );
  const blocks = useVisitorBlocks(page);

  useEffect(() => {
    if (!page || page.hidden) return;
    document.title = page.seoTitle || page.name;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', page.metaDescription || '');
    return () => {
      /* SiteThemeRoot will restore on next navigation */
    };
  }, [page]);

  if (!slug || !page) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6 text-white">
        <p className="font-mono text-sm text-white/60">Page not found.</p>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-[#FF0000]">
          Home
        </Link>
      </div>
    );
  }

  if (page.hidden) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6 text-white">
        <p className="font-mono text-sm text-white/60">This page is hidden.</p>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-[#FF0000]">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full py-16 px-6"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <div className="max-w-3xl mx-auto">
        <BlockRenderer blocks={blocks} />
      </div>
    </div>
  );
}
