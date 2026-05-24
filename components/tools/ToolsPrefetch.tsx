'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DIGITAL_TOOLS } from './toolsData';

/** Prefetch tool routes when browser is idle so clicks feel instant. */
export default function ToolsPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const prefetchAll = () => {
      for (const tool of DIGITAL_TOOLS) {
        try {
          router.prefetch(tool.link);
        } catch {
          /* ignore */
        }
      }
    };

    if (typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(prefetchAll, { timeout: 2500 });
      return () => cancelIdleCallback(idleId);
    }

    const timerId = setTimeout(prefetchAll, 500);
    return () => clearTimeout(timerId);
  }, [router]);

  return null;
}
