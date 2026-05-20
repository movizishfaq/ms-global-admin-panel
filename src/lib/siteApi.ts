import type { SiteDraftBundle } from './siteSnapshot';
import { getStoredToken } from './authStorage';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined)
    }
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
  } & T;
  if (!res.ok) {
    throw new Error(data.error?.message ?? res.statusText ?? 'Request failed');
  }
  return data;
}

export interface PublicSiteResponse {
  publishStatus: 'draft' | 'published';
  publicDomain: string;
  payload: SiteDraftBundle | null;
}

export function fetchPublicSite(): Promise<PublicSiteResponse> {
  return request<PublicSiteResponse>('/api/site/public');
}

export function fetchStudioSite(token: string): Promise<{
  publicDomain: string;
  draft: SiteDraftBundle;
  published: SiteDraftBundle | null;
}> {
  return request('/api/site/studio', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function saveStudioDraft(
  token: string,
  draft: SiteDraftBundle
): Promise<{ ok: boolean }> {
  return request('/api/site/studio/draft', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ draft })
  });
}

export function publishStudioSite(token: string): Promise<{
  ok: boolean;
  publicDomain: string;
}> {
  return request('/api/site/studio/publish', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function setPublicDomain(
  token: string,
  publicDomain: string
): Promise<{ publicDomain: string }> {
  return request('/api/site/studio/domain', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ publicDomain })
  });
}

export function saveStudioDraftFromStore(
  draft: SiteDraftBundle
): Promise<{ ok: boolean } | null> {
  const token = getStoredToken();
  if (!token) return Promise.resolve(null);
  return saveStudioDraft(token, draft);
}
