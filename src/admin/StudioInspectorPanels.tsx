import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { HomeSectionId } from '../types/siteBuilder';
import { sortedVisibleHomeSections } from '../types/siteBuilder';

const BORDER = 'rgba(255,255,255,0.12)';
const CARD = 'rgba(255,255,255,0.05)';

function card() {
  return 'rounded-xl border p-4 mb-4';
}

const SECTION_LABELS: Record<HomeSectionId, string> = {
  marquee: 'Ticker bar',
  hero: 'Hero',
  categories: 'Category pills',
  flashSale: 'Flash sale row',
  todaysForYou: 'Tabs + product grid',
  bestSellingStore: 'Best selling stores',
  quoteBanner: 'Quote banner',
  reviews: 'Reviews',
  footer: 'Footer'
};

export function StudioHomePanel() {
  const store = useStore();
  const { site, updateSite } = store;
  const h = site.home.hero;
  const previewOrder = sortedVisibleHomeSections(site.home.sections);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-anton text-xl text-white">Home & hero</p>
        <p className="font-mono text-[11px] text-white/45 mt-1 leading-relaxed">
          Hero copy and CTAs update on the homepage immediately. Preview order
          (visible blocks): {previewOrder.map((id) => SECTION_LABELS[id]).join(' → ')}
        </p>
      </div>

      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Hero copy
        </p>
        <div className="space-y-2 font-mono text-xs">
          {(
            [
              ['eyebrow', 'Eyebrow', h.eyebrow],
              ['line1', 'Headline line 1', h.line1],
              ['line2Accent', 'Accent line', h.line2Accent],
              ['line3', 'Headline line 3', h.line3],
              ['sub', 'Subheadline', h.sub]
            ] as const
          ).map(([key, label, val]) => (
            <label key={key} className="block">
              <span className="text-white/45 text-[10px] uppercase tracking-widest">
                {label}
              </span>
              <input
                value={val}
                onChange={(e) =>
                  updateSite((s) => ({
                    ...s,
                    home: {
                      ...s.home,
                      hero: { ...s.home.hero, [key]: e.target.value }
                    }
                  }))
                }
                className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
                style={{ borderColor: BORDER }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Calls to action
        </p>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <label className="block col-span-2">
            <span className="text-white/45 text-[10px]">Primary button</span>
            <input
              value={h.primaryCtaLabel}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    hero: { ...s.home.hero, primaryCtaLabel: e.target.value }
                  }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
          <label className="block col-span-2">
            <span className="text-white/45 text-[10px]">Primary URL</span>
            <input
              value={h.primaryCtaHref}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    hero: { ...s.home.hero, primaryCtaHref: e.target.value }
                  }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
          <label className="block col-span-2">
            <span className="text-white/45 text-[10px]">Secondary button</span>
            <input
              value={h.secondaryCtaLabel}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    hero: { ...s.home.hero, secondaryCtaLabel: e.target.value }
                  }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
          <label className="block col-span-2">
            <span className="text-white/45 text-[10px]">Secondary URL</span>
            <input
              value={h.secondaryCtaHref}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    hero: { ...s.home.hero, secondaryCtaHref: e.target.value }
                  }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
        </div>
      </div>

      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Hero image & badges
        </p>
        <label className="block font-mono text-xs mb-2">
          <span className="text-white/45 text-[10px] uppercase">Hero image URL</span>
          <input
            value={h.heroImageUrl}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                home: {
                  ...s.home,
                  hero: { ...s.home.hero, heroImageUrl: e.target.value }
                }
              }))
            }
            placeholder="Empty = default product image"
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
        {(
          [
            ['floatingBadgeTitle', 'Floating card — title', h.floatingBadgeTitle],
            ['floatingBadgePromo', 'Floating card — promo', h.floatingBadgePromo],
            ['floatingPriceCaption', 'Price card — caption', h.floatingPriceCaption],
            ['floatingPrice', 'Price card — amount', h.floatingPrice]
          ] as const
        ).map(([key, label, val]) => (
          <label key={key} className="block font-mono text-xs mb-2">
            <span className="text-white/45 text-[10px]">{label}</span>
            <input
              value={val}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  home: {
                    ...s.home,
                    hero: { ...s.home.hero, [key]: e.target.value }
                  }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
        ))}
      </div>

      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Quote strip
        </p>
        <label className="block font-mono text-xs mb-2">
          <span className="text-white/45 text-[10px]">Heading</span>
          <textarea
            value={site.home.quoteHeading}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                home: { ...s.home, quoteHeading: e.target.value }
              }))
            }
            rows={2}
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
        <label className="block font-mono text-xs mb-2">
          <span className="text-white/45 text-[10px]">Button label</span>
          <input
            value={site.home.quoteCtaLabel}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                home: { ...s.home, quoteCtaLabel: e.target.value }
              }))
            }
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
        <label className="block font-mono text-xs">
          <span className="text-white/45 text-[10px]">Button URL</span>
          <input
            value={site.home.quoteCtaHref}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                home: { ...s.home, quoteCtaHref: e.target.value }
              }))
            }
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
      </div>

      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Ticker (black bar)
        </p>
        <label className="block font-mono text-xs mb-2">
          <span className="text-white/45 text-[10px]">Text (repeats)</span>
          <textarea
            value={site.marquee.text}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                marquee: { ...s.marquee, text: e.target.value }
              }))
            }
            rows={3}
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
        <label className="block font-mono text-xs">
          <span className="text-white/45 text-[10px]">Scroll duration (sec)</span>
          <input
            type="number"
            min={6}
            max={120}
            value={site.marquee.durationSeconds}
            onChange={(e) =>
              updateSite((s) => ({
                ...s,
                marquee: {
                  ...s.marquee,
                  durationSeconds: Number(e.target.value) || 28
                }
              }))
            }
            className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
            style={{ borderColor: BORDER }}
          />
        </label>
      </div>
    </div>
  );
}

export function StudioThemePanel() {
  const { site, updateSite } = useStore();
  const t = site.theme;
  return (
    <div className="space-y-4">
      <p className="font-anton text-xl">Theme & colors</p>
      <p className="font-mono text-[11px] text-white/45">
        Drives the whole storefront via CSS variables (header, shop, cart,
        checkout, home).
      </p>
      {(
        [
          ['primary', 'Brand primary', t.primary],
          ['dark', 'Deep brand', t.dark],
          ['accent', 'Accent / buttons', t.accent],
          ['pageBg', 'Page background', t.pageBg]
        ] as const
      ).map(([key, label, val]) => (
        <label key={key} className={`block ${card()}`} style={{ backgroundColor: CARD, borderColor: BORDER }}>
          <span className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
            {label}
          </span>
          <div className="flex gap-2 mt-2 items-center">
            <input
              type="color"
              value={val.length === 7 ? val : '#9E055F'}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  theme: { ...s.theme, [key]: e.target.value }
                }))
              }
              className="h-10 w-14 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              value={val}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  theme: { ...s.theme, [key]: e.target.value }
                }))
              }
              className="flex-1 rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </div>
        </label>
      ))}
    </div>
  );
}

export function StudioNavPanel() {
  const store = useStore();
  const { site, patchNavItem, moveNavItem, addNavItem, removeNavItem } = store;
  return (
    <div className="space-y-4">
      <p className="font-anton text-xl">Navigation</p>
      <button
        type="button"
        onClick={addNavItem}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white"
        style={{ backgroundColor: '#FF0000' }}
      >
        <PlusIcon className="w-4 h-4" />
        Add link
      </button>
      <div className="space-y-2">
        {site.nav.map((item, idx) => (
          <div
            key={item.id}
            className={card()}
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <div className="flex gap-1 mb-2">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveNavItem(item.id, -1)}
                className="rounded border px-2 py-1 disabled:opacity-30"
                style={{ borderColor: BORDER }}
              >
                <ChevronUpIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={idx === site.nav.length - 1}
                onClick={() => moveNavItem(item.id, 1)}
                className="rounded border px-2 py-1 disabled:opacity-30"
                style={{ borderColor: BORDER }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <label className="ml-auto flex items-center gap-2 font-mono text-[10px] text-white/50">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) =>
                    patchNavItem(item.id, { visible: e.target.checked })
                  }
                />
                Visible
              </label>
            </div>
            <input
              value={item.label}
              onChange={(e) => patchNavItem(item.id, { label: e.target.value })}
              className="w-full rounded-lg border px-2 py-2 font-mono text-xs mb-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
            <input
              value={item.href}
              onChange={(e) => patchNavItem(item.id, { href: e.target.value })}
              className="w-full rounded-lg border px-2 py-2 font-mono text-xs mb-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
            <button
              type="button"
              onClick={() => {
                if (confirm('Remove this nav item?')) removeNavItem(item.id);
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-red-300 flex items-center gap-1"
            >
              <Trash2Icon className="w-3 h-3" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudioSectionsPanel() {
  const { site, toggleHomeSection, moveHomeSection } = useStore();
  const rows = [...site.home.sections].sort((a, b) => a.order - b.order);
  return (
    <div className="space-y-4">
      <p className="font-anton text-xl">Homepage sections</p>
      <p className="font-mono text-[11px] text-white/45">
        Toggle blocks and reorder (order updates the live homepage sequence).
      </p>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{ borderColor: BORDER, backgroundColor: CARD }}
          >
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => moveHomeSection(row.id, -1)}
              className="p-1 rounded border disabled:opacity-30"
              style={{ borderColor: BORDER }}
            >
              <ChevronUpIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={idx === rows.length - 1}
              onClick={() => moveHomeSection(row.id, 1)}
              className="p-1 rounded border disabled:opacity-30"
              style={{ borderColor: BORDER }}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <span className="flex-1 font-mono text-xs text-white">
              {SECTION_LABELS[row.id]}
            </span>
            <label className="flex items-center gap-2 font-mono text-[10px] text-white/50">
              <input
                type="checkbox"
                checked={row.visible}
                onChange={(e) => toggleHomeSection(row.id, e.target.checked)}
              />
              On
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudioSeoPanel() {
  const { site, updateSite } = useStore();
  return (
    <div className="space-y-4">
      <p className="font-anton text-xl">SEO & identity</p>
      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
          Browser title
        </p>
        <input
          value={site.seo.documentTitle}
          onChange={(e) =>
            updateSite((s) => ({
              ...s,
              seo: { ...s.seo, documentTitle: e.target.value }
            }))
          }
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none"
          style={{ borderColor: BORDER }}
        />
      </div>
      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
          Meta description
        </p>
        <textarea
          value={site.seo.metaDescription}
          onChange={(e) =>
            updateSite((s) => ({
              ...s,
              seo: { ...s.seo, metaDescription: e.target.value }
            }))
          }
          rows={4}
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none"
          style={{ borderColor: BORDER }}
        />
      </div>
      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
          Header brand word
        </p>
        <input
          value={site.identity.brandWord}
          onChange={(e) =>
            updateSite((s) => ({
              ...s,
              identity: { ...s.identity, brandWord: e.target.value }
            }))
          }
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none mb-2"
          style={{ borderColor: BORDER }}
        />
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
          Accent character (e.g. dot)
        </p>
        <input
          value={site.identity.brandAccent}
          onChange={(e) =>
            updateSite((s) => ({
              ...s,
              identity: { ...s.identity, brandAccent: e.target.value }
            }))
          }
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none mb-2"
          style={{ borderColor: BORDER }}
        />
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
          Logo image URL (optional)
        </p>
        <input
          value={site.identity.logoUrl}
          onChange={(e) =>
            updateSite((s) => ({
              ...s,
              identity: { ...s.identity, logoUrl: e.target.value }
            }))
          }
          placeholder="https://…"
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none"
          style={{ borderColor: BORDER }}
        />
      </div>
      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
          Footer
        </p>
        {(
          [
            ['brandWord', 'Brand', site.footer.brandWord],
            ['brandAccent', 'Accent', site.footer.brandAccent],
            ['tagline', 'Tagline', site.footer.tagline],
            ['copyright', 'Copyright line', site.footer.copyright]
          ] as const
        ).map(([key, label, val]) => (
          <label key={key} className="block font-mono text-xs mb-2">
            <span className="text-white/45 text-[10px]">{label}</span>
            <input
              value={val}
              onChange={(e) =>
                updateSite((s) => ({
                  ...s,
                  footer: { ...s.footer, [key]: e.target.value }
                }))
              }
              className="mt-1 w-full rounded-lg border px-2 py-2 bg-black/40 text-white outline-none"
              style={{ borderColor: BORDER }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function StudioMediaPanel() {
  const { site, addMediaAsset, removeMediaAsset } = useStore();
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="space-y-4">
      <p className="font-anton text-xl">Media library</p>
      <p className="font-mono text-[11px] text-white/45">
        Reference URLs for campaigns. Product images still live in Catalog.
      </p>
      <div className={card()} style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none mb-2"
          style={{ borderColor: BORDER }}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="w-full rounded-lg border px-2 py-2 font-mono text-xs bg-black/40 text-white outline-none mb-2"
          style={{ borderColor: BORDER }}
        />
        <button
          type="button"
          onClick={() => {
            addMediaAsset(url, label);
            setUrl('');
            setLabel('');
          }}
          className="w-full rounded-lg py-2 font-mono text-xs font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: '#9E055F' }}
        >
          Save asset
        </button>
      </div>
      <div className="space-y-2">
        {site.mediaLibrary.length === 0 ? (
          <p className="font-mono text-xs text-white/35">No saved assets yet.</p>
        ) : (
          site.mediaLibrary.map((m) => (
            <div
              key={m.id}
              className="flex gap-2 items-center rounded-lg border p-2"
              style={{ borderColor: BORDER, backgroundColor: CARD }}
            >
              <img src={m.url} alt="" className="w-12 h-12 rounded object-cover bg-black/30" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-white truncate">{m.label}</p>
                <p className="font-mono text-[10px] text-white/40 truncate">{m.url}</p>
              </div>
              <button
                type="button"
                onClick={() => removeMediaAsset(m.id)}
                className="p-2 text-red-300"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
