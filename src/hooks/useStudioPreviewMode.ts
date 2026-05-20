import { useEffect, useState } from 'react';

/** True only inside the owner studio preview iframe (not on the public shop). */
export function useStudioPreviewMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const inIframe = window.parent !== window;
    const params = new URLSearchParams(window.location.search);
    const studioPreview =
      params.get('siteStudio') === '1' && !!params.get('studioParent')?.trim();
    setOn(inIframe && studioPreview);
  }, []);
  return on;
}
