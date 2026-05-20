/** postMessage contract between preview (iframe) and Site Studio parent */
export const STUDIO_MSG_SOURCE = 'ms-global-studio-v1' as const;

export type StudioSelectPayload = {
  source: typeof STUDIO_MSG_SOURCE;
  /** Right-hand inspector panel to open */
  panel: string;
  /** Optional hint for future deep-linking in the inspector */
  block?: string;
};

function studioParentOrigin(): string {
  if (typeof window === 'undefined') return '';
  const fromQuery = new URLSearchParams(window.location.search).get(
    'studioParent'
  );
  return fromQuery?.trim() || window.location.origin;
}

export function postStudioSelect(panel: string, block?: string) {
  if (typeof window === 'undefined' || window.parent === window) return;
  const payload: StudioSelectPayload = {
    source: STUDIO_MSG_SOURCE,
    panel,
    block
  };
  window.parent.postMessage(payload, studioParentOrigin());
}
