'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { DigitalTool } from './toolsData';

export default function ToolCard({ tool, children }: { tool: DigitalTool; children: ReactNode }) {
  const router = useRouter();

  const warmRoute = () => {
    try {
      router.prefetch(tool.link);
    } catch {
      /* ignore */
    }
  };

  return (
    <Link
      href={tool.link}
      target="_blank"
      rel="noopener noreferrer"
      prefetch
      onMouseEnter={warmRoute}
      onFocus={warmRoute}
      onTouchStart={warmRoute}
      className={`group bg-white rounded-2xl border border-slate-200/80 border-t-4 ${tool.accent} p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-[transform,box-shadow] duration-150 flex flex-col will-change-transform`}
    >
      {children}
    </Link>
  );
}
