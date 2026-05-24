'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import JobMetaChips from '@/components/JobMetaChips';
import type { JobMeta } from '@/lib/jobDisplay';

interface Vacancy extends JobMeta {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  isNew?: boolean;
  liveOnly?: boolean;
  officialLink?: string;
  sourceUrl?: string;
}

interface HomeFeed {
  vacancies: Vacancy[];
  admitCards: Vacancy[];
  results: Vacancy[];
}

const HOME_LIMIT = 5;
const REFRESH_MS = 6 * 60 * 60 * 1000;

export default function HomeJobsFeed() {
  const [feed, setFeed] = useState<HomeFeed>({ vacancies: [], admitCards: [], results: [] });
  const [loading, setLoading] = useState(true);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      fetch('/api/vacancies?feed=home')
        .then((r) => r.json())
        .then((data) => {
          setFeed({
            vacancies: (data.vacancies || []).slice(0, HOME_LIMIT),
            admitCards: (data.admitCards || []).slice(0, HOME_LIMIT),
            results: (data.results || []).slice(0, HOME_LIMIT),
          });
          if (data.lastSyncAt) setLastSyncAt(data.lastSyncAt);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const renderColumn = (
    title: string,
    items: Vacancy[],
    routePrefix: string,
    viewAllTab: string,
    colorClass: string
  ) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className={`px-4 py-3 bg-gradient-to-r ${colorClass} text-white flex justify-between items-center`}>
        <span className="font-bold text-sm">{title}</span>
        <Link
          href={`/vacancies?tab=${viewAllTab}`}
          className="text-[11px] font-bold bg-white/25 hover:bg-white/40 px-2.5 py-1 rounded-full transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="divide-y divide-slate-100 flex-1">
        {loading ? (
          Array.from({ length: HOME_LIMIT }).map((_, i) => (
            <div key={i} className="p-3 animate-pulse h-16 bg-slate-50" />
          ))
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-xs text-slate-400">
            Abhi naya update nahi. Agla refresh har 6 ghante par.
          </p>
        ) : (
          items.map((item) => {
            const external = item.liveOnly && (item.officialLink || item.sourceUrl);
            const href = external || `/${routePrefix}/${item.slug}`;
            const LinkTag = external ? 'a' : Link;
            const linkProps = external
              ? { href, target: '_blank', rel: 'noopener noreferrer' }
              : { href };
            return (
            <LinkTag
              key={item.id || item._id || item.slug}
              {...linkProps}
              className="block px-4 py-3 hover:bg-orange-50/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                {item.isNew && (
                  <span className="shrink-0 mt-0.5 px-1 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded uppercase">
                    New
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <JobMetaChips job={item} compact />
                </div>
              </div>
            </LinkTag>
          );
          })
        )}
      </div>
    </div>
  );

  return (
    <section className="bg-slate-50 py-10 sm:py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sarkari Updates</h2>
          <p className="text-slate-500 text-sm mt-1">
            Live SarkariExam updates — har 6 ghante refresh
            {lastSyncAt ? (
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Last sync: {new Date(lastSyncAt).toLocaleString('hi-IN')}
              </span>
            ) : null}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderColumn('Vacancy', feed.vacancies, 'vacancy', 'vacancies', 'from-orange-600 to-amber-500')}
          {renderColumn('Admit Card', feed.admitCards, 'admit-card', 'admit', 'from-blue-600 to-indigo-500')}
          {renderColumn('Result', feed.results, 'result', 'results', 'from-emerald-600 to-teal-500')}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/vacancies"
            className="inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg transition-colors"
          >
            सभी Vacancy, Admit & Result देखें
          </Link>
        </div>
      </div>
    </section>
  );
}
