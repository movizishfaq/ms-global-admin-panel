import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { STUDIO_MSG_SOURCE } from '../lib/studioBridge';
import { publicSiteOrigin } from '../lib/appMode';
import {
  BarChart3Icon,
  ExternalLinkIcon,
  FileStackIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  MonitorIcon,
  PaletteIcon,
  PanelLeftIcon,
  PercentIcon,
  ReceiptIcon,
  RefreshCwIcon,
  SettingsIcon,
  SmartphoneIcon,
  StoreIcon,
  TabletIcon,
  TruckIcon,
  NavigationIcon,
  ImageIcon,
  LayersIcon,
  LayoutGrid,
  PenLine,
  SearchIcon,
  type LucideIcon
} from 'lucide-react';

const BG = '#0a0710';
const BORDER = 'rgba(255,255,255,0.08)';
const RAIL = '#0e0816';

export type StudioDevice = 'desktop' | 'tablet' | 'mobile';

export type StudioNavId =
  | 'site-dashboard'
  | 'site-pages'
  | 'block-editor'
  | 'home-editor'
  | 'theme'
  | 'navigation'
  | 'sections'
  | 'seo'
  | 'media'
  | 'overview'
  | 'products'
  | 'pricing'
  | 'billing'
  | 'orders'
  | 'analytics'
  | 'settings';

type NavEntry = {
  id: StudioNavId;
  label: string;
  icon: LucideIcon;
};

const GROUPS: { title: string; items: NavEntry[] }[] = [
  {
    title: 'Website',
    items: [
      { id: 'site-dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'site-pages', label: 'Pages', icon: FileStackIcon },
      { id: 'block-editor', label: 'Page editor', icon: PenLine }
    ]
  },
  {
    title: 'Site builder',
    items: [
      { id: 'home-editor', label: 'Home & hero', icon: LayoutTemplateIcon },
      { id: 'theme', label: 'Theme & colors', icon: PaletteIcon },
      { id: 'navigation', label: 'Menus', icon: NavigationIcon },
      { id: 'sections', label: 'Home sections', icon: LayersIcon },
      { id: 'seo', label: 'SEO & identity', icon: SearchIcon },
      { id: 'media', label: 'Media library', icon: ImageIcon }
    ]
  },
  {
    title: 'Store',
    items: [
      { id: 'overview', label: 'Overview', icon: PanelLeftIcon },
      { id: 'products', label: 'Catalog', icon: StoreIcon },
      { id: 'pricing', label: 'Pricing & tax', icon: PercentIcon },
      { id: 'billing', label: 'Shipping & pay', icon: TruckIcon },
      { id: 'orders', label: 'Orders', icon: ReceiptIcon },
      { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
      { id: 'settings', label: 'Access & bar', icon: SettingsIcon }
    ]
  }
];

function deviceWidth(d: StudioDevice) {
  if (d === 'mobile') return 390;
  if (d === 'tablet') return 820;
  return 1280;
}

const STUDIO_PANEL_KEYS = new Set<StudioNavId>([
  'site-dashboard',
  'site-pages',
  'block-editor',
  'home-editor',
  'theme',
  'navigation',
  'sections',
  'seo',
  'media',
  'overview',
  'products',
  'pricing',
  'billing',
  'orders',
  'analytics',
  'settings'
]);

export function SiteStudioLayout({
  panel,
  onPanel,
  rightPanel,
  onLock,
  previewPath = '/'
}: {
  panel: StudioNavId;
  onPanel: (id: StudioNavId) => void;
  rightPanel: React.ReactNode;
  onLock: () => void;
  /** Path inside the site preview iframe */
  previewPath?: string;
}) {
  const [device, setDevice] = useState<StudioDevice>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const publicOrigin = useMemo(() => publicSiteOrigin(), []);
  const studioOrigin = useMemo(
    () => (typeof window !== 'undefined' ? window.location.origin : ''),
    []
  );
  const apiBase = (import.meta.env.VITE_API_URL as string | undefined)
    ?.trim()
    .replace(/\/$/, '')
    .replace(/\/health$/i, '');
  const apiQuery = apiBase ? `&apiBase=${encodeURIComponent(apiBase)}` : '';
  const src = `${publicOrigin}${previewPath}?siteStudio=1&studioDraft=1&studioParent=${encodeURIComponent(studioOrigin)}${apiQuery}&r=${iframeKey}`;

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const allowed = [window.location.origin, publicOrigin].filter(Boolean);
      if (!allowed.includes(ev.origin)) return;
      const d = ev.data as { source?: string; panel?: string } | null;
      if (!d || d.source !== STUDIO_MSG_SOURCE) return;
      if (typeof d.panel === 'string' && STUDIO_PANEL_KEYS.has(d.panel as StudioNavId)) {
        onPanel(d.panel as StudioNavId);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onPanel]);

  return (
    <div
      className="h-[100dvh] flex flex-col lg:flex-row text-white overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Left rail */}
      <aside
        className="hidden lg:flex w-[260px] shrink-0 flex-col border-r overflow-y-auto"
        style={{ borderColor: BORDER, backgroundColor: RAIL }}
      >
        <div className="p-5 border-b" style={{ borderColor: BORDER }}>
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.25em]">
            MS-Global
          </p>
          <h1 className="font-anton text-2xl mt-1 leading-none">Site Studio</h1>
          <p className="font-mono text-[11px] text-white/45 mt-2 leading-snug">
            Click the amber “select” chips on the preview to jump the inspector.
            Saves in this browser only.
          </p>
        </div>
        <div className="flex-1 py-3 px-2 space-y-6">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="px-2 font-mono text-[10px] text-white/35 uppercase tracking-widest mb-2">
                {g.title}
              </p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const active = panel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onPanel(item.id)}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-widest transition-colors"
                      style={{
                        backgroundColor: active
                          ? 'rgba(158,5,95,0.45)'
                          : 'transparent',
                        color: active ? '#fff' : 'rgba(255,255,255,0.6)'
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t space-y-1" style={{ borderColor: BORDER }}>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-[11px] text-white/50 hover:text-white hover:bg-white/5"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            Open site new tab
          </Link>
          <button
            type="button"
            onClick={onLock}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-[11px] text-white/50 hover:text-white hover:bg-white/5"
          >
            <LogOutIcon className="w-4 h-4" />
            Lock studio
          </button>
        </div>
      </aside>

      {/* Center — preview */}
      <div
        className="flex-1 flex flex-col min-h-0 min-w-0 border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: BORDER, backgroundColor: '#050308' }}
      >
        <div
          className="flex flex-wrap items-center gap-2 px-3 py-2 border-b shrink-0"
          style={{ borderColor: BORDER, backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest hidden sm:inline">
            Canvas
          </span>
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
            {(
              [
                ['desktop', MonitorIcon],
                ['tablet', TabletIcon],
                ['mobile', SmartphoneIcon]
              ] as const
            ).map(([d, Icon]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className="px-2.5 py-1.5"
                style={{
                  backgroundColor: device === d ? 'rgba(158,5,95,0.5)' : 'transparent'
                }}
                title={d}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderColor: BORDER }}
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            Reload preview
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
          >
            Exit
          </Link>
        </div>
        <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
          <iframe
            key={iframeKey}
            title="Site preview"
            src={src}
            className="rounded-lg border shadow-2xl bg-white max-w-full transition-[width] duration-300"
            style={{
              borderColor: BORDER,
              width: deviceWidth(device),
              height: 'calc(100dvh - 140px)',
              minHeight: 560
            }}
          />
        </div>
      </div>

      {/* Mobile nav strip */}
      <div
        className="lg:hidden flex gap-1 overflow-x-auto px-2 py-2 border-b shrink-0"
        style={{ borderColor: BORDER, backgroundColor: RAIL }}
      >
        {GROUPS.flatMap((g) => g.items).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPanel(item.id)}
            className="shrink-0 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border"
            style={{
              borderColor: panel === item.id ? '#fff' : BORDER,
              backgroundColor:
                panel === item.id ? 'rgba(158,5,95,0.45)' : 'transparent'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right inspector */}
      <aside
        className="w-full lg:w-[400px] xl:w-[440px] shrink-0 overflow-y-auto max-h-[45vh] lg:max-h-none lg:h-[100dvh] border-t lg:border-t-0"
        style={{ borderColor: BORDER, backgroundColor: '#0c0812' }}
      >
        <div
          className="sticky top-0 z-10 px-4 py-3 border-b font-mono text-[10px] uppercase tracking-widest text-white/40"
          style={{ borderColor: BORDER, backgroundColor: '#0c0812' }}
        >
          Inspector
        </div>
        <div className="p-4 pb-20">{rightPanel}</div>
      </aside>
    </div>
  );
}
