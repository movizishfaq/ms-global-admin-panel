import React from 'react';
import { MousePointerClickIcon } from 'lucide-react';
import { useStudioPreviewMode } from '../../hooks/useStudioPreviewMode';
import { postStudioSelect } from '../../lib/studioBridge';
import type { StudioNavId } from '../../admin/SiteStudioLayout';

/**
 * Floating control shown only in studio preview. Click sends the parent editor
 * to the matching inspector tab (does not steal clicks from links/buttons below).
 */
export function StudioSelectBar({
  panel,
  label,
  block,
  anchor = 'top'
}: {
  panel: StudioNavId;
  label: string;
  block?: string;
  /** `above` = chip sits just above this block (for thin bars). */
  anchor?: 'top' | 'above';
}) {
  const studio = useStudioPreviewMode();
  if (!studio) return null;
  const pos =
    anchor === 'above'
      ? 'left-0 right-0 bottom-full z-[80] flex justify-center pb-1 pointer-events-none'
      : 'left-0 right-0 top-0 z-[80] flex justify-center pt-1 pointer-events-none';
  return (
    <div className={`absolute ${pos}`}>
      <button
        type="button"
        className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-amber-400/90 bg-zinc-950/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-200 shadow-lg backdrop-blur-sm hover:bg-amber-500/25 hover:text-white transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          postStudioSelect(panel, block);
        }}
      >
        <MousePointerClickIcon className="w-3.5 h-3.5 shrink-0" aria-hidden />
        {label}
      </button>
    </div>
  );
}
