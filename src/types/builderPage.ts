export const BUILDER_BLOCK_TYPES = [
  'text',
  'image',
  'button',
  'section',
  'navbar',
  'footer',
  'form',
  'spacer'
] as const;
export type BuilderBlockType = (typeof BUILDER_BLOCK_TYPES)[number];

export interface BuilderBlock {
  id: string;
  type: BuilderBlockType;
  props: Record<string, unknown>;
  children?: BuilderBlock[];
}

export interface BuilderPage {
  id: string;
  slug: string;
  name: string;
  isHome: boolean;
  hidden: boolean;
  seoTitle: string;
  metaDescription: string;
  draftBlocks: BuilderBlock[];
  /** Null = never published; live uses draft until publish. */
  publishedBlocks: BuilderBlock[] | null;
}

export interface SiteMeta {
  websiteName: string;
  publishStatus: 'draft' | 'published';
  lastDraftSavedAt: string | null;
  lastPublishedAt: string | null;
  /** Placeholder for future domain connect */
  domain: string;
  sslEnabled: boolean;
}

export interface SiteTrafficStats {
  totalPageViews: number;
  /** Incremented on each tracked route view (demo proxy). */
  totalSessions: number;
  viewsToday: number;
  viewsByPath: Record<string, number>;
  mobileViews: number;
  desktopViews: number;
  lastVisitDay: string;
}

export interface MediaBinItem {
  id: string;
  name: string;
  folder: string;
  dataUrl: string;
  createdAt: string;
}

export function newBlockId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultBlock(type: BuilderBlockType): BuilderBlock {
  const id = newBlockId();
  switch (type) {
    case 'text':
      return {
        id,
        type,
        props: { content: 'New text', align: 'left' as const }
      };
    case 'image':
      return {
        id,
        type,
        props: { src: '', alt: 'Image', width: 100 }
      };
    case 'button':
      return {
        id,
        type,
        props: { label: 'BUTTON', href: '/', variant: 'primary' as const }
      };
    case 'section':
      return { id, type, props: { padding: 24 }, children: [] };
    case 'navbar':
      return { id, type, props: { title: 'NAV' } };
    case 'footer':
      return { id, type, props: { note: 'Footer' } };
    case 'form':
      return { id, type, props: { title: 'Contact', fields: 'name,email' } };
    case 'spacer':
      return { id, type, props: { height: 32 } };
    default:
      return { id, type: 'text', props: { content: '' } };
  }
}

export function createDefaultBuilderPages(): BuilderPage[] {
  const homeBlocks: BuilderBlock[] = [
    {
      id: 'blk-hero-text',
      type: 'text',
      props: {
        content: 'Welcome to MS-GLOBAL',
        align: 'center' as const,
        size: 'lg' as const
      }
    },
    {
      id: 'blk-hero-sub',
      type: 'text',
      props: {
        content:
          'Content for this page will appear when published.',
        align: 'center' as const,
        size: 'sm' as const
      }
    },
    {
      id: 'blk-cta',
      type: 'button',
      props: { label: 'SHOP', href: '/shop', variant: 'primary' as const }
    },
    { id: 'blk-sp', type: 'spacer', props: { height: 40 } }
  ];
  return [
    {
      id: 'pg-home',
      slug: 'home',
      name: 'Home (CMS)',
      isHome: true,
      hidden: false,
      seoTitle: 'Home',
      metaDescription: 'Built with MS-Global page builder.',
      draftBlocks: homeBlocks,
      publishedBlocks: null
    },
    {
      id: 'pg-about',
      slug: 'about',
      name: 'About',
      isHome: false,
      hidden: false,
      seoTitle: 'About us',
      metaDescription: 'Learn more about us.',
      draftBlocks: [
        {
          id: 'blk-a1',
          type: 'text',
          props: { content: 'ABOUT', align: 'left' as const, size: 'lg' as const }
        },
        {
          id: 'blk-a2',
          type: 'text',
          props: {
            content: 'Content for this page will appear when published.',
            align: 'left' as const,
            size: 'sm' as const
          }
        }
      ],
      publishedBlocks: null
    }
  ];
}
