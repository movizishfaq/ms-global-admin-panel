import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const BORDER = 'rgba(255,255,255,0.1)';
const CARD = 'rgba(255,255,255,0.06)';

export function SitePagesPanel({
  onEditPage
}: {
  onEditPage: (pageId: string) => void;
}) {
  const {
    builderPages,
    addBuilderPage,
    deleteBuilderPage,
    patchBuilderPage,
    setHomeBuilderPage
  } = useStore();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  return (
    <div className="space-y-6 text-white p-4 lg:p-6 max-w-xl">
      <div>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em]">
          Pages
        </p>
        <h2 className="font-anton text-2xl mt-1">Site pages</h2>
      </div>

      <form
        className="rounded-2xl border p-4 space-y-3"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
        onSubmit={(e) => {
          e.preventDefault();
          addBuilderPage(name, slug || name);
          setName('');
          setSlug('');
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
          Add page
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-lg border px-3 py-2 font-mono text-sm bg-black/30 border-white/15 text-white"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (optional)"
          className="w-full rounded-lg border px-3 py-2 font-mono text-sm bg-black/30 border-white/15 text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#9E055F] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest"
        >
          Add page
        </button>
      </form>

      <ul className="space-y-2">
        {builderPages.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border p-4 flex flex-col gap-3"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-anton text-lg flex items-center gap-2">
                  {p.name}
                  {p.isHome ? (
                    <HomeIcon className="w-4 h-4 text-amber-300 shrink-0" title="Home" />
                  ) : null}
                </p>
                <p className="font-mono text-[10px] text-white/40 mt-1">
                  /p/{p.slug}
                  {p.hidden ? ' · hidden' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 shrink-0">
                <button
                  type="button"
                  title="Edit in builder"
                  onClick={() => onEditPage(p.id)}
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/5"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {!p.isHome ? (
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => deleteBuilderPage(p.id)}
                    className="p-2 rounded-lg border border-white/10 hover:bg-red-500/20"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[9px] uppercase text-white/35">
                  SEO title
                </span>
                <input
                  value={p.seoTitle}
                  onChange={(e) =>
                    patchBuilderPage(p.id, { seoTitle: e.target.value })
                  }
                  className="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs bg-black/30 border-white/15"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[9px] uppercase text-white/35">
                  Meta description
                </span>
                <textarea
                  value={p.metaDescription}
                  onChange={(e) =>
                    patchBuilderPage(p.id, {
                      metaDescription: e.target.value
                    })
                  }
                  rows={2}
                  className="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs bg-black/30 border-white/15"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {!p.isHome ? (
                <button
                  type="button"
                  onClick={() => setHomeBuilderPage(p.id)}
                  className="font-mono text-[10px] uppercase tracking-widest text-amber-200/90 hover:text-amber-100"
                >
                  Set as homepage (CMS)
                </button>
              ) : null}
              <label className="inline-flex items-center gap-2 font-mono text-[10px] text-white/55 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.hidden}
                  onChange={(e) =>
                    patchBuilderPage(p.id, { hidden: e.target.checked })
                  }
                />
                Hide page
              </label>
              <Link
                to={`/p/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#FF0000]/90"
              >
                Open /p/{p.slug}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
