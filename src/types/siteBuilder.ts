export type HomeSectionId =
  | 'marquee'
  | 'hero'
  | 'categories'
  | 'flashSale'
  | 'todaysForYou'
  | 'bestSellingStore'
  | 'quoteBanner'
  | 'reviews'
  | 'footer';

export interface HomeSectionConfig {
  id: HomeSectionId;
  visible: boolean;
  order: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface HeroCopy {
  eyebrow: string;
  line1: string;
  line2Accent: string;
  line3: string;
  sub: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  /** Empty = use bundled default image on Home */
  heroImageUrl: string;
  floatingBadgeTitle: string;
  floatingBadgePromo: string;
  floatingPriceCaption: string;
  floatingPrice: string;
}

export interface SiteBuilderState {
  theme: {
    primary: string;
    dark: string;
    accent: string;
    pageBg: string;
  };
  identity: {
    brandWord: string;
    brandAccent: string;
    /** Optional; empty uses theme default logo asset in header. */
    logoUrl: string;
  };
  nav: NavItem[];
  marquee: {
    text: string;
    durationSeconds: number;
  };
  home: {
    sections: HomeSectionConfig[];
    hero: HeroCopy;
    quoteHeading: string;
    quoteCtaLabel: string;
    quoteCtaHref: string;
  };
  footer: {
    brandWord: string;
    brandAccent: string;
    tagline: string;
    copyright: string;
  };
  seo: {
    documentTitle: string;
    metaDescription: string;
  };
  mediaLibrary: { id: string; url: string; label: string }[];
}

export const DEFAULT_HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'marquee', visible: true, order: 0 },
  { id: 'hero', visible: true, order: 1 },
  { id: 'categories', visible: true, order: 2 },
  { id: 'flashSale', visible: true, order: 3 },
  { id: 'todaysForYou', visible: true, order: 4 },
  { id: 'bestSellingStore', visible: true, order: 5 },
  { id: 'quoteBanner', visible: true, order: 6 },
  { id: 'reviews', visible: true, order: 7 },
  { id: 'footer', visible: true, order: 8 }
];

export const DEFAULT_NAV: NavItem[] = [
  { id: '1', label: 'HOME', href: '/', visible: true },
  { id: '2', label: 'SHOP', href: '/shop', visible: true },
  { id: '3', label: 'ABOUT', href: '/about', visible: true },
  { id: '4', label: 'CONTACT', href: '/contact', visible: true },
  { id: '5', label: 'JOIN US', href: '/join', visible: true }
];

export const DEFAULT_SITE: SiteBuilderState = {
  theme: {
    primary: '#9E055F',
    dark: '#7a0449',
    accent: '#FF0000',
    pageBg: '#9E055F'
  },
  identity: {
    brandWord: 'MS-GLOBAL',
    brandAccent: '.',
    logoUrl: ''
  },
  nav: DEFAULT_NAV,
  marquee: {
    text:
      'MS-GLOBAL ★ PREMIUM LADIES OIL & BEAUTY ★ FREE SHIPPING ON ORDERS OVER Rp200.000 ★ SHOP ROSE HIP FACE OIL & MORE ★ MS-GLOBAL ★ PREMIUM LADIES OIL & BEAUTY ★ FREE SHIPPING ON ORDERS OVER Rp200.000 ★',
    durationSeconds: 28
  },
  home: {
    sections: DEFAULT_HOME_SECTIONS,
    hero: {
      eyebrow: '#Big Beauty Sale',
      line1: "LET'S GLOW",
      line2Accent: 'BEYOND',
      line3: 'BOUNDARIES',
      sub: 'Premium Ladies Oil & Beauty Products — crafted for your glow journey.',
      primaryCtaLabel: 'SHOP NOW',
      primaryCtaHref: '/shop',
      secondaryCtaLabel: 'JOIN US',
      secondaryCtaHref: '/join',
      heroImageUrl: '',
      floatingBadgeTitle: 'Best Seller',
      floatingBadgePromo: '50% OFF',
      floatingPriceCaption: 'Starting from',
      floatingPrice: 'Rp75.000'
    },
    quoteHeading: `"Let's Glow Beyond Boundaries"`,
    quoteCtaLabel: 'JOIN WITH US →',
    quoteCtaHref: '/join'
  },
  footer: {
    brandWord: 'MS-GLOBAL',
    brandAccent: '.',
    tagline: `"Let's Glow Beyond Boundaries"`,
    copyright: '© MS-GLOBAL. All rights reserved.'
  },
  seo: {
    documentTitle: 'MS-GLOBAL | Glow Beyond',
    metaDescription:
      'Premium ladies oil and beauty products — shop MS-GLOBAL for serums, oils, and skincare.'
  },
  mediaLibrary: []
};

export function sortedVisibleHomeSections(
  sections: HomeSectionConfig[]
): HomeSectionId[] {
  return [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.id);
}
