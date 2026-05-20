import React from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  GlobeIcon,
  RocketIcon,
  RotateCcwIcon,
  SaveIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { publicSiteOrigin } from '../lib/appMode';
import { setPublicDomain } from '../lib/siteApi';
import { getStoredToken } from '../lib/authStorage';

const CARD = 'rgba(255,255,255,0.06)';
const BORDER = 'rgba(255,255,255,0.1)';

function fmt(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function SiteDashboardPanel() {
  const {
    siteMeta,
    siteTraffic,
    publishSite,
    unpublishSite,
    touchDraftSaved,
    builderPages,
    patchSiteMeta
  } = useStore();
  const [domainInput, setDomainInput] = useState(siteMeta.domain);
  const [domainSaved, setDomainSaved] = useState(false);

  useEffect(() => {
    setDomainInput(siteMeta.domain);
  }, [siteMeta.domain]);
  const publicOrigin = publicSiteOrigin();
  const home = builderPages.find((p) => p.isHome);
  const livePath = home ? `/p/${home.slug}` : '/p/home';
  const liveShopUrl = siteMeta.domain?.trim()
    ? `https://${siteMeta.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`
    : publicOrigin;

  const saveDomain = async () => {
    const token = getStoredToken();
    const value = domainInput.trim();
    patchSiteMeta({ domain: value });
    if (token) {
      try {
        await setPublicDomain(token, value);
        setDomainSaved(true);
        setTimeout(() => setDomainSaved(false), 2500);
      } catch {
        /* local meta still updated */
      }
    }
  };

  return (
    <div className="space-y-6 text-white p-4 lg:p-6 max-w-xl">
      <div>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em]">
          Dashboard
        </p>
        <h2 className="font-anton text-2xl mt-1">{siteMeta.websiteName}</h2>
      </div>

      <div
        className="rounded-2xl border p-5 space-y-3"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
          Public shop domain (customers)
        </p>
        <input
          type="text"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          placeholder="shop.yourdomain.com"
          className="w-full rounded-lg border px-3 py-2 font-mono text-xs text-white bg-black/30 outline-none"
          style={{ borderColor: BORDER }}
        />
        <button
          type="button"
          onClick={() => void saveDomain()}
          className="font-mono text-[10px] uppercase tracking-widest text-white px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: domainSaved ? '#22c55e' : '#7a0449' }}
        >
          {domainSaved ? 'Saved' : 'Save domain'}
        </button>
        <p className="font-mono text-xs text-white/50 break-all">
          Live URL after publish: {liveShopUrl}
        </p>
        <p className="font-mono text-[10px] text-white/35">
          Preview below uses {publicOrigin} (your public build). Studio stays on
          a separate owner-only domain.
        </p>
      </div>

      <div
        className="rounded-2xl border p-5 space-y-3"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Live status
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
              siteMeta.publishStatus === 'published'
                ? 'bg-emerald-500/25 text-emerald-300'
                : 'bg-amber-500/20 text-amber-200'
            }`}
          >
            {siteMeta.publishStatus === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="font-mono text-xs text-white/55">
          Last draft save: {fmt(siteMeta.lastDraftSavedAt)}
        </p>
        <p className="font-mono text-xs text-white/55">
          Last publish: {fmt(siteMeta.lastPublishedAt)}
        </p>
      </div>

      <div
        className="rounded-2xl border p-5 space-y-2"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/45 mb-2">
          Traffic (this browser)
        </p>
        <p className="font-mono text-sm">
          Visitors today (sessions):{' '}
          <span className="text-white">{siteTraffic.viewsToday}</span>
        </p>
        <p className="font-mono text-sm">
          Total page views:{' '}
          <span className="text-white">{siteTraffic.totalPageViews}</span>
        </p>
        <p className="font-mono text-xs text-white/45">
          Mobile / desktop views: {siteTraffic.mobileViews} /{' '}
          {siteTraffic.desktopViews}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => touchDraftSaved()}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ borderColor: BORDER, backgroundColor: 'rgba(0,0,0,0.25)' }}
        >
          <SaveIcon className="w-4 h-4" />
          Mark draft saved
        </button>
        <a
          href={`${publicOrigin}${livePath}?studioDraft=1&studioParent=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white"
          style={{ borderColor: BORDER, backgroundColor: 'rgba(0,0,0,0.25)' }}
        >
          <EyeIcon className="w-4 h-4" />
          Preview draft
        </a>
        <a
          href={`${publicOrigin}${livePath}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white"
          style={{ borderColor: BORDER, backgroundColor: 'rgba(0,0,0,0.25)' }}
        >
          <GlobeIcon className="w-4 h-4" />
          View live page
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {siteMeta.publishStatus === 'published' ? (
          <button
            type="button"
            onClick={() => unpublishSite()}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-amber-200"
            style={{ borderColor: BORDER, backgroundColor: 'rgba(0,0,0,0.25)' }}
          >
            <RotateCcwIcon className="w-4 h-4" />
            Unpublish
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => publishSite()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white bg-[#9E055F]"
        >
          <RocketIcon className="w-4 h-4" />
          Publish to live
        </button>
      </div>
    </div>
  );
}
