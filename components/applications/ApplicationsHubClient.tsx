'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Sparkles, ArrowRight } from 'lucide-react';
import {
  ALL_TEMPLATES,
  CATEGORY_META,
  ORDERED_CATEGORIES,
  searchTemplates,
} from '@/lib/applications/templates';
import type { ApplicationCategory } from '@/lib/applications/types';

type Filter = 'all' | ApplicationCategory;

export default function ApplicationsHubClient() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    let list = query.trim() ? searchTemplates(query) : ALL_TEMPLATES;
    if (filter !== 'all') list = list.filter((t) => t.category === filter);
    return list;
  }, [query, filter]);

  // Per-category counts for the filter chips so users see at a
  // glance how many templates each category holds.
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ALL_TEMPLATES.length };
    for (const cat of ORDERED_CATEGORIES) {
      c[cat] = ALL_TEMPLATES.filter((t) => t.category === cat).length;
    }
    return c;
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(249,115,22,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-1.5 text-sm font-semibold text-orange-600 backdrop-blur dark:border-orange-500/30 dark:bg-slate-900/70">
            <Sparkles className="h-4 w-4" />
            {ALL_TEMPLATES.length}+ Daily-Use Application Letters
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Application{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              ek click mein
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Sarkari, bijli vibhag, school, bank, office, property — har zaroori application
            professional <strong>हिंदी</strong> या English mein. Details ek baar bharo,
            edit karo, PDF download — bilkul free.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search… 'leave', 'TC', 'income', 'cheque book', बैंक…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base shadow-lg shadow-orange-500/5 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category filter chips */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            sub={String(counts.all)}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          {ORDERED_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={`${CATEGORY_META[cat].emoji} ${CATEGORY_META[cat].label}`}
              sub={String(counts[cat] ?? 0)}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              accent={CATEGORY_META[cat].accent}
            />
          ))}
        </div>
      </section>

      {/* Cards grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Kuch nahi mila
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Doosra keyword try karo, jaise — &quot;leave&quot;, &quot;TC&quot;, &quot;income&quot;, ya &quot;noc&quot;.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((t) => {
              const meta = CATEGORY_META[t.category];
              return (
                <Link
                  key={t.slug}
                  href={`/applications/${t.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/40"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.accent}`} />
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {meta.emoji} {meta.label}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-tight text-slate-900 dark:text-white">
                    {t.titleEn}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t.titleHi}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
                    {t.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                      Use template
                    </span>
                    <ArrowRight className="h-4 w-4 text-orange-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

interface FilterChipProps {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}

function FilterChip({ label, sub, active, onClick, accent }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? `border-transparent bg-gradient-to-r ${accent ?? 'from-orange-500 to-red-500'} text-white shadow-md`
          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-2 text-[11px] font-bold ${
          active
            ? 'bg-white/25 text-white'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        {sub}
      </span>
    </button>
  );
}
