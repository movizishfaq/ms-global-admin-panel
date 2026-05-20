import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { INITIAL_CATALOG } from '../data/initialCatalog';
import type {
  CatalogProduct,
  OrderRecord,
  PaymentMethodKey,
  PaymentToggles
} from '../types/commerce';
import {
  DEFAULT_SITE,
  type HomeSectionId,
  type NavItem,
  type SiteBuilderState
} from '../types/siteBuilder';
import {
  createDefaultBuilderPages,
  type BuilderBlock,
  type BuilderPage,
  type MediaBinItem,
  type SiteMeta,
  type SiteTrafficStats
} from '../types/builderPage';
import type { SiteDraftBundle } from '../lib/siteSnapshot';
import { isStudioMode } from '../lib/appMode';

export type { SiteDraftBundle };

const STORAGE_KEY = 'ms-global-store-v2';

function cloneJson<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

const DEFAULT_SITE_META: SiteMeta = {
  websiteName: 'MS-GLOBAL',
  publishStatus: 'draft',
  lastDraftSavedAt: null,
  lastPublishedAt: null,
  domain: '',
  sslEnabled: true
};

const DEFAULT_SITE_TRAFFIC: SiteTrafficStats = {
  totalPageViews: 0,
  totalSessions: 0,
  viewsToday: 0,
  viewsByPath: {},
  mobileViews: 0,
  desktopViews: 0,
  lastVisitDay: ''
};

function mergeSiteMeta(raw: unknown): SiteMeta {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SITE_META };
  return { ...DEFAULT_SITE_META, ...(raw as Partial<SiteMeta>) };
}

function mergeTraffic(raw: unknown): SiteTrafficStats {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SITE_TRAFFIC };
  const p = raw as Partial<SiteTrafficStats>;
  return {
    ...DEFAULT_SITE_TRAFFIC,
    ...p,
    viewsByPath:
      p.viewsByPath && typeof p.viewsByPath === 'object'
        ? { ...p.viewsByPath }
        : { ...DEFAULT_SITE_TRAFFIC.viewsByPath }
  };
}

function mergeBuilderPages(raw: unknown): BuilderPage[] {
  const d = createDefaultBuilderPages();
  if (!Array.isArray(raw) || raw.length === 0) return d;
  return raw as BuilderPage[];
}

function mergeMediaBin(raw: unknown): MediaBinItem[] {
  if (!Array.isArray(raw)) return [];
  return raw as MediaBinItem[];
}

function mergeSite(raw: unknown): SiteBuilderState {
  const d = DEFAULT_SITE;
  if (!raw || typeof raw !== 'object') {
    return {
      ...d,
      nav: [...d.nav],
      home: {
        ...d.home,
        sections: [...d.home.sections],
        hero: { ...d.home.hero }
      },
      mediaLibrary: [...d.mediaLibrary]
    };
  }
  const p = raw as Partial<SiteBuilderState>;
  const nav =
    Array.isArray(p.nav) && p.nav.length > 0 ? [...p.nav] : [...d.nav];
  const sections =
    Array.isArray(p.home?.sections) && (p.home!.sections!.length ?? 0) >= 3
      ? [...p.home!.sections!]
      : [...d.home.sections];
  return {
    ...d,
    ...p,
    theme: { ...d.theme, ...p.theme },
    identity: { ...d.identity, ...p.identity },
    nav,
    marquee: { ...d.marquee, ...p.marquee },
    home: {
      ...d.home,
      ...p.home,
      sections,
      hero: { ...d.home.hero, ...p.home?.hero }
    },
    footer: { ...d.footer, ...p.footer },
    seo: { ...d.seo, ...p.seo },
    mediaLibrary: Array.isArray(p.mediaLibrary) ? [...p.mediaLibrary] : []
  };
}

export interface StoreSnapshot {
  products: CatalogProduct[];
  taxRatePercent: number;
  shippingFlatRp: number;
  freeShippingOverRp: number;
  paymentEnabled: PaymentToggles;
  orders: OrderRecord[];
  announcementLine: string;
  /** Plain text PIN for admin gate (persisted). Empty = unlocked until set in Settings. */
  adminPin: string;
  /** Optional global promo: 0–50 (%). Applied to subtotal before tax. */
  promoPercent: number;
  /** Wix-style site / homepage / theme config (persisted). */
  site: SiteBuilderState;
  /** Frozen public snapshot when published; null = live follows `site`. */
  publishedSite: SiteBuilderState | null;
  siteMeta: SiteMeta;
  builderPages: BuilderPage[];
  siteTraffic: SiteTrafficStats;
  mediaBin: MediaBinItem[];
}

const DEFAULT_SNAPSHOT: StoreSnapshot = {
  products: INITIAL_CATALOG,
  taxRatePercent: 11,
  shippingFlatRp: 15_000,
  freeShippingOverRp: 200_000,
  paymentEnabled: { cod: true, card: true, jazzcash: true },
  orders: [],
  announcementLine:
    'MS-GLOBAL — Premium ladies oil & beauty. Free shipping on orders over Rp200.000.',
  adminPin: '',
  promoPercent: 0,
  site: mergeSite(null),
  publishedSite: null,
  siteMeta: { ...DEFAULT_SITE_META },
  builderPages: createDefaultBuilderPages(),
  siteTraffic: { ...DEFAULT_SITE_TRAFFIC },
  mediaBin: []
};

function loadSnapshot(): StoreSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SNAPSHOT, products: [...INITIAL_CATALOG] };
    const p = JSON.parse(raw) as Partial<StoreSnapshot>;
    return {
      ...DEFAULT_SNAPSHOT,
      ...p,
      products: Array.isArray(p.products) ? p.products : [...INITIAL_CATALOG],
      paymentEnabled: {
        ...DEFAULT_SNAPSHOT.paymentEnabled,
        ...(p.paymentEnabled ?? {})
      },
      orders: Array.isArray(p.orders) ? p.orders : [],
      site: mergeSite(p.site),
      publishedSite: p.publishedSite ? mergeSite(p.publishedSite) : null,
      siteMeta: mergeSiteMeta(p.siteMeta),
      builderPages: mergeBuilderPages(p.builderPages),
      siteTraffic: mergeTraffic(p.siteTraffic),
      mediaBin: mergeMediaBin(p.mediaBin)
    };
  } catch {
    return { ...DEFAULT_SNAPSHOT, products: [...INITIAL_CATALOG] };
  }
}

interface StoreContextValue extends StoreSnapshot {
  setTaxRatePercent: (n: number) => void;
  setShippingFlatRp: (n: number) => void;
  setFreeShippingOverRp: (n: number) => void;
  setPaymentEnabled: (patch: Partial<PaymentToggles>) => void;
  setAnnouncementLine: (s: string) => void;
  setAdminPin: (s: string) => void;
  setPromoPercent: (n: number) => void;
  upsertProduct: (p: CatalogProduct) => void;
  removeProduct: (id: string) => void;
  setProductActive: (id: string, active: boolean) => void;
  recordOrder: (
    o: Pick<
      OrderRecord,
      | 'customerName'
      | 'customerEmail'
      | 'paymentMethod'
      | 'items'
      | 'subtotalRp'
      | 'taxRp'
      | 'shippingRp'
      | 'totalRp'
    > & { id?: string; createdAt?: string }
  ) => void;
  resetStore: () => void;
  /** Full site builder / theme / homepage state update. */
  updateSite: (fn: (prev: SiteBuilderState) => SiteBuilderState) => void;
  moveNavItem: (id: string, dir: -1 | 1) => void;
  patchNavItem: (id: string, patch: Partial<NavItem>) => void;
  addNavItem: () => void;
  removeNavItem: (id: string) => void;
  moveHomeSection: (id: HomeSectionId, dir: -1 | 1) => void;
  toggleHomeSection: (id: HomeSectionId, visible: boolean) => void;
  addMediaAsset: (url: string, label: string) => void;
  removeMediaAsset: (id: string) => void;
  touchDraftSaved: () => void;
  publishSite: () => void;
  unpublishSite: () => void;
  setWebsiteName: (name: string) => void;
  patchSiteMeta: (patch: Partial<SiteMeta>) => void;
  recordPageView: (path: string) => void;
  updatePageDraftBlocks: (pageId: string, blocks: BuilderBlock[]) => void;
  addBuilderPage: (name: string, slug: string) => void;
  deleteBuilderPage: (id: string) => void;
  patchBuilderPage: (id: string, patch: Partial<BuilderPage>) => void;
  setHomeBuilderPage: (id: string) => void;
  addMediaBinItem: (item: Omit<MediaBinItem, 'id' | 'createdAt'>) => void;
  removeMediaBinItem: (id: string) => void;
  /** Apply site data loaded from the API (public or studio). */
  hydrateSiteBundle: (bundle: Partial<SiteDraftBundle>) => void;
  /** Revenue & counts derived from `orders`. */
  analytics: {
    totalRevenueRp: number;
    orderCount: number;
    averageOrderRp: number;
    last30DaysRevenueRp: number;
    unitsSoldByProductId: Record<string, number>;
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

function computeAnalytics(orders: OrderRecord[]) {
  const totalRevenueRp = orders.reduce((s, o) => s + o.totalRp, 0);
  const orderCount = orders.length;
  const averageOrderRp =
    orderCount > 0 ? Math.round(totalRevenueRp / orderCount) : 0;
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const last30DaysRevenueRp = orders
    .filter((o) => new Date(o.createdAt).getTime() >= cutoff)
    .reduce((s, o) => s + o.totalRp, 0);
  const unitsSoldByProductId: Record<string, number> = {};
  for (const o of orders) {
    for (const line of o.items) {
      unitsSoldByProductId[line.productId] =
        (unitsSoldByProductId[line.productId] ?? 0) + line.quantity;
    }
  }
  return {
    totalRevenueRp,
    orderCount,
    averageOrderRp,
    last30DaysRevenueRp,
    unitsSoldByProductId
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<StoreSnapshot>(() => loadSnapshot());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  }, [snap]);

  const analytics = useMemo(() => computeAnalytics(snap.orders), [snap.orders]);

  const setTaxRatePercent = useCallback((n: number) => {
    setSnap((s) => ({
      ...s,
      taxRatePercent: Math.min(100, Math.max(0, n))
    }));
  }, []);

  const setShippingFlatRp = useCallback((n: number) => {
    setSnap((s) => ({ ...s, shippingFlatRp: Math.max(0, n) }));
  }, []);

  const setFreeShippingOverRp = useCallback((n: number) => {
    setSnap((s) => ({ ...s, freeShippingOverRp: Math.max(0, n) }));
  }, []);

  const setPaymentEnabled = useCallback((patch: Partial<PaymentToggles>) => {
    setSnap((s) => ({
      ...s,
      paymentEnabled: { ...s.paymentEnabled, ...patch }
    }));
  }, []);

  const setAnnouncementLine = useCallback((announcementLine: string) => {
    setSnap((s) => ({ ...s, announcementLine }));
  }, []);

  const setAdminPin = useCallback((adminPin: string) => {
    setSnap((s) => ({ ...s, adminPin }));
  }, []);

  const setPromoPercent = useCallback((n: number) => {
    setSnap((s) => ({
      ...s,
      promoPercent: Math.min(50, Math.max(0, n))
    }));
  }, []);

  const upsertProduct = useCallback((p: CatalogProduct) => {
    setSnap((s) => {
      const idx = s.products.findIndex((x) => x.id === p.id);
      const products =
        idx === -1
          ? [...s.products, p]
          : s.products.map((x, i) => (i === idx ? p : x));
      return { ...s, products };
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      products: s.products.filter((x) => x.id !== id)
    }));
  }, []);

  const setProductActive = useCallback((id: string, active: boolean) => {
    setSnap((s) => ({
      ...s,
      products: s.products.map((x) =>
        x.id === id ? { ...x, active } : x
      )
    }));
  }, []);

  const recordOrder = useCallback(
    (
      o: Pick<
        OrderRecord,
        | 'customerName'
        | 'customerEmail'
        | 'paymentMethod'
        | 'items'
        | 'subtotalRp'
        | 'taxRp'
        | 'shippingRp'
        | 'totalRp'
      > & { id?: string; createdAt?: string }
    ) => {
      const id = o.id ?? `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
      const createdAt = o.createdAt ?? new Date().toISOString();
      const row: OrderRecord = {
        id,
        createdAt,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        paymentMethod: o.paymentMethod,
        items: o.items,
        subtotalRp: o.subtotalRp,
        taxRp: o.taxRp,
        shippingRp: o.shippingRp,
        totalRp: o.totalRp
      };
      setSnap((s) => ({ ...s, orders: [row, ...s.orders] }));
    },
    []
  );

  const updateSite = useCallback(
    (fn: (prev: SiteBuilderState) => SiteBuilderState) => {
      setSnap((s) => ({ ...s, site: fn(s.site) }));
    },
    []
  );

  const moveNavItem = useCallback((id: string, dir: -1 | 1) => {
    updateSite((site) => {
      const idx = site.nav.findIndex((n) => n.id === id);
      if (idx < 0) return site;
      const j = idx + dir;
      if (j < 0 || j >= site.nav.length) return site;
      const nav = [...site.nav];
      [nav[idx], nav[j]] = [nav[j], nav[idx]];
      return { ...site, nav };
    });
  }, [updateSite]);

  const patchNavItem = useCallback(
    (id: string, patch: Partial<NavItem>) => {
      updateSite((site) => ({
        ...site,
        nav: site.nav.map((n) => (n.id === id ? { ...n, ...patch } : n))
      }));
    },
    [updateSite]
  );

  const addNavItem = useCallback(() => {
    updateSite((site) => ({
      ...site,
      nav: [
        ...site.nav,
        {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `nav-${Date.now()}`,
          label: 'NEW LINK',
          href: '/',
          visible: true
        }
      ]
    }));
  }, [updateSite]);

  const removeNavItem = useCallback(
    (id: string) => {
      updateSite((site) => ({
        ...site,
        nav: site.nav.filter((n) => n.id !== id)
      }));
    },
    [updateSite]
  );

  const moveHomeSection = useCallback(
    (id: HomeSectionId, dir: -1 | 1) => {
      updateSite((site) => {
        const sections = [...site.home.sections];
        const idx = sections.findIndex((s) => s.id === id);
        if (idx < 0) return site;
        const cur = sections[idx].order;
        const swapIdx = sections.findIndex((s) => s.order === cur + dir);
        if (swapIdx < 0) return site;
        const a = sections[idx].order;
        const b = sections[swapIdx].order;
        sections[idx] = { ...sections[idx], order: b };
        sections[swapIdx] = { ...sections[swapIdx], order: a };
        return { ...site, home: { ...site.home, sections } };
      });
    },
    [updateSite]
  );

  const toggleHomeSection = useCallback(
    (id: HomeSectionId, visible: boolean) => {
      updateSite((site) => ({
        ...site,
        home: {
          ...site.home,
          sections: site.home.sections.map((s) =>
            s.id === id ? { ...s, visible } : s
          )
        }
      }));
    },
    [updateSite]
  );

  const addMediaAsset = useCallback(
    (url: string, label: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      updateSite((site) => ({
        ...site,
        mediaLibrary: [
          {
            id:
              typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `m-${Date.now()}`,
            url: trimmed,
            label: label.trim() || 'Asset'
          },
          ...site.mediaLibrary
        ]
      }));
    },
    [updateSite]
  );

  const removeMediaAsset = useCallback(
    (id: string) => {
      updateSite((site) => ({
        ...site,
        mediaLibrary: site.mediaLibrary.filter((m) => m.id !== id)
      }));
    },
    [updateSite]
  );

  const touchDraftSaved = useCallback(() => {
    setSnap((s) => ({
      ...s,
      siteMeta: {
        ...s.siteMeta,
        lastDraftSavedAt: new Date().toISOString()
      }
    }));
  }, []);

  const hydrateSiteBundle = useCallback((bundle: Partial<SiteDraftBundle>) => {
    setSnap((s) => ({
      ...s,
      ...(bundle.site ? { site: mergeSite(bundle.site) } : {}),
      ...(bundle.publishedSite !== undefined
        ? {
            publishedSite: bundle.publishedSite
              ? mergeSite(bundle.publishedSite)
              : null
          }
        : {}),
      ...(bundle.siteMeta ? { siteMeta: mergeSiteMeta(bundle.siteMeta) } : {}),
      ...(bundle.builderPages
        ? { builderPages: mergeBuilderPages(bundle.builderPages) }
        : {}),
      ...(bundle.announcementLine !== undefined
        ? { announcementLine: bundle.announcementLine }
        : {})
    }));
  }, []);

  const publishSite = useCallback(() => {
    setSnap((s) => {
      const publishedSite = cloneJson(s.site);
      const builderPages = s.builderPages.map((p) => ({
        ...p,
        publishedBlocks: cloneJson(p.draftBlocks)
      }));
      return {
        ...s,
        publishedSite,
        builderPages,
        siteMeta: {
          ...s.siteMeta,
          publishStatus: 'published',
          lastPublishedAt: new Date().toISOString()
        }
      };
    });
    if (isStudioMode()) {
      window.dispatchEvent(new Event('ms-global-site-publish'));
    }
  }, []);

  const unpublishSite = useCallback(() => {
    setSnap((s) => ({
      ...s,
      publishedSite: null,
      siteMeta: { ...s.siteMeta, publishStatus: 'draft' }
    }));
  }, []);

  const setWebsiteName = useCallback((websiteName: string) => {
    setSnap((s) => ({
      ...s,
      siteMeta: { ...s.siteMeta, websiteName }
    }));
  }, []);

  const patchSiteMeta = useCallback((patch: Partial<SiteMeta>) => {
    setSnap((s) => ({
      ...s,
      siteMeta: { ...s.siteMeta, ...patch }
    }));
  }, []);

  const recordPageView = useCallback((path: string) => {
    const day = new Date().toISOString().slice(0, 10);
    const mobile =
      typeof window !== 'undefined' && window.innerWidth < 768;
    setSnap((s) => {
      const st = s.siteTraffic;
      const viewsByPath = {
        ...st.viewsByPath,
        [path]: (st.viewsByPath[path] ?? 0) + 1
      };
      const sameDay = st.lastVisitDay === day;
      return {
        ...s,
        siteTraffic: {
          ...st,
          totalPageViews: st.totalPageViews + 1,
          totalSessions: st.totalSessions + 1,
          viewsToday: sameDay ? st.viewsToday + 1 : 1,
          viewsByPath,
          mobileViews: st.mobileViews + (mobile ? 1 : 0),
          desktopViews: st.desktopViews + (mobile ? 0 : 1),
          lastVisitDay: day
        }
      };
    });
  }, []);

  const updatePageDraftBlocks = useCallback(
    (pageId: string, blocks: BuilderBlock[]) => {
      setSnap((s) => ({
        ...s,
        builderPages: s.builderPages.map((p) =>
          p.id === pageId ? { ...p, draftBlocks: blocks } : p
        )
      }));
    },
    []
  );

  const addBuilderPage = useCallback((name: string, slug: string) => {
    const clean = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!clean) return;
    setSnap((s) => ({
      ...s,
      builderPages: [
        ...s.builderPages,
        {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `pg-${Date.now()}`,
          slug: clean,
          name: name.trim() || clean,
          isHome: false,
          hidden: false,
          seoTitle: name.trim() || clean,
          metaDescription: '',
          draftBlocks: [],
          publishedBlocks: null
        }
      ]
    }));
  }, []);

  const deleteBuilderPage = useCallback((id: string) => {
    setSnap((s) => {
      const target = s.builderPages.find((p) => p.id === id);
      if (!target || target.isHome) return s;
      return {
        ...s,
        builderPages: s.builderPages.filter((p) => p.id !== id)
      };
    });
  }, []);

  const patchBuilderPage = useCallback(
    (id: string, patch: Partial<BuilderPage>) => {
      setSnap((s) => ({
        ...s,
        builderPages: s.builderPages.map((p) =>
          p.id === id ? { ...p, ...patch } : p
        )
      }));
    },
    []
  );

  const setHomeBuilderPage = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      builderPages: s.builderPages.map((p) => ({
        ...p,
        isHome: p.id === id
      }))
    }));
  }, []);

  const addMediaBinItem = useCallback(
    (item: Omit<MediaBinItem, 'id' | 'createdAt'>) => {
      const row: MediaBinItem = {
        ...item,
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `media-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setSnap((s) => ({ ...s, mediaBin: [row, ...s.mediaBin] }));
    },
    []
  );

  const removeMediaBinItem = useCallback((id: string) => {
    setSnap((s) => ({
      ...s,
      mediaBin: s.mediaBin.filter((m) => m.id !== id)
    }));
  }, []);

  const resetStore = useCallback(() => {
    setSnap({
      ...DEFAULT_SNAPSHOT,
      products: [...INITIAL_CATALOG],
      orders: [],
      site: mergeSite(null),
      publishedSite: null,
      siteMeta: { ...DEFAULT_SITE_META },
      builderPages: createDefaultBuilderPages(),
      siteTraffic: { ...DEFAULT_SITE_TRAFFIC },
      mediaBin: []
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...snap,
      setTaxRatePercent,
      setShippingFlatRp,
      setFreeShippingOverRp,
      setPaymentEnabled,
      setAnnouncementLine,
      setAdminPin,
      setPromoPercent,
      upsertProduct,
      removeProduct,
      setProductActive,
      recordOrder,
      resetStore,
      updateSite,
      moveNavItem,
      patchNavItem,
      addNavItem,
      removeNavItem,
      moveHomeSection,
      toggleHomeSection,
      addMediaAsset,
      removeMediaAsset,
      touchDraftSaved,
      publishSite,
      unpublishSite,
      setWebsiteName,
      patchSiteMeta,
      recordPageView,
      updatePageDraftBlocks,
      addBuilderPage,
      deleteBuilderPage,
      patchBuilderPage,
      setHomeBuilderPage,
      addMediaBinItem,
      removeMediaBinItem,
      hydrateSiteBundle,
      analytics
    }),
    [
      snap,
      analytics,
      setTaxRatePercent,
      setShippingFlatRp,
      setFreeShippingOverRp,
      setPaymentEnabled,
      setAnnouncementLine,
      setAdminPin,
      setPromoPercent,
      upsertProduct,
      removeProduct,
      setProductActive,
      recordOrder,
      resetStore,
      updateSite,
      moveNavItem,
      patchNavItem,
      addNavItem,
      removeNavItem,
      moveHomeSection,
      toggleHomeSection,
      addMediaAsset,
      removeMediaAsset,
      touchDraftSaved,
      publishSite,
      unpublishSite,
      setWebsiteName,
      patchSiteMeta,
      recordPageView,
      updatePageDraftBlocks,
      addBuilderPage,
      deleteBuilderPage,
      patchBuilderPage,
      setHomeBuilderPage,
      addMediaBinItem,
      removeMediaBinItem,
      hydrateSiteBundle
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const v = useContext(StoreContext);
  if (!v) throw new Error('useStore must be used within StoreProvider');
  return v;
}

export const PAYMENT_LABELS: Record<
  PaymentMethodKey,
  { title: string; subtitle: string }
> = {
  cod: {
    title: 'Cash on Delivery (COD)',
    subtitle: 'Pay when your order arrives'
  },
  card: {
    title: 'Card Payment (Stripe)',
    subtitle: 'Visa, Mastercard, Amex'
  },
  jazzcash: {
    title: 'JazzCash / EasyPaisa',
    subtitle: 'Mobile wallet payment'
  }
};
