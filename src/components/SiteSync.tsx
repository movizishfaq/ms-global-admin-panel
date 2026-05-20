import { useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { useStore } from '../context/StoreContext';
import { isStorefrontMode, isStudioMode } from '../lib/appMode';
import { getStoredToken } from '../lib/authStorage';
import {
  fetchPublicSite,
  fetchStudioSite,
  publishStudioSite,
  saveStudioDraft
} from '../lib/siteApi';
import { buildSiteDraftBundle, type SiteDraftBundle } from '../lib/siteSnapshot';

const PUBLISH_EVENT = 'ms-global-site-publish';

/** Loads published site on the shop domain; syncs draft to MongoDB on the studio domain. */
export function SiteSync() {
  const store = useStore();
  const { user, authLoading } = useAuth();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSave = useRef(true);

  useEffect(() => {
    if (!isStorefrontMode()) return;
    fetchPublicSite()
      .then((res) => {
        if (res.publicDomain) {
          store.patchSiteMeta({ domain: res.publicDomain });
        }
        if (res.payload) {
          store.hydrateSiteBundle(res.payload);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isStudioMode() || authLoading) return;
    const token = getStoredToken();
    if (!token || user?.role !== 'admin') return;

    fetchStudioSite(token)
      .then((res) => {
        const draft = res.draft as SiteDraftBundle;
        if (draft && Object.keys(draft).length > 0) {
          store.hydrateSiteBundle(draft);
        }
        if (res.publicDomain) {
          store.patchSiteMeta({ domain: res.publicDomain });
        }
        skipSave.current = true;
        setTimeout(() => {
          skipSave.current = false;
        }, 500);
      })
      .catch(() => {
        skipSave.current = false;
      });
  }, [authLoading, user?.id, user?.role]);

  useEffect(() => {
    if (!isStudioMode() || user?.role !== 'admin') return;

    const onPublish = async () => {
      const token = getStoredToken();
      if (!token) return;
      const draft = buildSiteDraftBundle(store);
      try {
        await saveStudioDraft(token, draft);
        await publishStudioSite(token);
      } catch {
        /* local publish still applied */
      }
    };
    window.addEventListener(PUBLISH_EVENT, onPublish);
    return () => window.removeEventListener(PUBLISH_EVENT, onPublish);
  }, [store, user?.role]);

  useEffect(() => {
    if (!isStudioMode() || user?.role !== 'admin') return;
    if (skipSave.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const token = getStoredToken();
      if (!token) return;
      saveStudioDraft(token, buildSiteDraftBundle(store)).catch(() => {});
    }, 2500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [
    store.site,
    store.publishedSite,
    store.siteMeta,
    store.builderPages,
    store.announcementLine,
    user?.role
  ]);

  return null;
}

export function requestSitePublishToServer() {
  window.dispatchEvent(new Event(PUBLISH_EVENT));
}
