'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DIGITAL_TOOLS } from './toolsData';

/** Prefetch tool routes when browser is idle so clicks feel instant. */
export default function ToolsPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const links = DIGITAL_TOOLS.map((t) => t.link);

    const prefetchAll = () => {
      for (const href of links) {
        try {
          router.prefetch(href);
        } catch {
          /* ignore */
        }
      }
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetchAll, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(prefetchAll, 500);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
