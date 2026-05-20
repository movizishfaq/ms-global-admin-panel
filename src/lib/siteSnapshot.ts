import type { BuilderPage, SiteMeta } from '../types/builderPage';
import type { SiteBuilderState } from '../types/siteBuilder';

/** Payload stored in MongoDB for draft / published site. */
export interface SiteDraftBundle {
  site: SiteBuilderState;
  publishedSite: SiteBuilderState | null;
  siteMeta: SiteMeta;
  builderPages: BuilderPage[];
  announcementLine?: string;
}

export function buildSiteDraftBundle(snap: {
  site: SiteBuilderState;
  publishedSite: SiteBuilderState | null;
  siteMeta: SiteMeta;
  builderPages: BuilderPage[];
  announcementLine: string;
}): SiteDraftBundle {
  return {
    site: snap.site,
    publishedSite: snap.publishedSite,
    siteMeta: snap.siteMeta,
    builderPages: snap.builderPages,
    announcementLine: snap.announcementLine
  };
}
