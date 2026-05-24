'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ConverterTool } from '@/lib/converter/types';
import ToolIcon from './ToolIcon';

export default function ToolsGrid({
  tools,
  compact = false,
}: {
  tools: ConverterTool[];
  compact?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className={`grid gap-4 ${
        compact
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}
    >
      {tools.map((tool, i) => (
        <div
          key={tool.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <Link
            href={`/file-converter/${tool.id}`}
            prefetch
            onMouseEnter={() => router.prefetch(`/file-converter/${tool.id}`)}
            className="group block h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:border-rose-200/80 hover:-translate-y-0.5 active:scale-[0.99] transition-[transform,box-shadow] duration-150 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-rose-500/40"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
            >
              <ToolIcon name={tool.icon} className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-rose-500 transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
            {tool.popular && (
              <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
