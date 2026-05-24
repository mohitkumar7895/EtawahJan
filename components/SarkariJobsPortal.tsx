'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  FileCheck,
  Trophy,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import JobMetaChips from '@/components/JobMetaChips';
import type { JobMeta } from '@/lib/jobDisplay';

interface JobItem extends JobMeta {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  isNew?: boolean;
  liveOnly?: boolean;
  officialLink?: string;
  sourceUrl?: string;
}

type TabKey = 'all' | 'vacancies' | 'admit' | 'results';

const TABS: { key: TabKey; label: string; category?: JobItem['category']; icon: typeof Briefcase }[] = [
  { key: 'all', label: 'सभी', icon: Sparkles },
  { key: 'vacancies', label: 'Vacancy', category: 'Vacancies', icon: Briefcase },
  { key: 'admit', label: 'Admit Card', category: 'Admit Cards', icon: FileCheck },
  { key: 'results', label: 'Result', category: 'Results', icon: Trophy },
];

function tabFromParam(param: string | null): TabKey {
  if (param === 'vacancies' || param === 'admit' || param === 'results' || param === 'all') {
    return param;
  }
  return 'all';
}

export default function SarkariJobsPortal({ defaultTab = 'all' }: { defaultTab?: TabKey }) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>(
    tabFromParam(searchParams.get('tab')) || defaultTab
  );
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(tabFromParam(searchParams.get('tab')) || defaultTab);
  }, [searchParams, defaultTab]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const tab = TABS.find((t) => t.key === activeTab);
        const params = new URLSearchParams();
        if (tab?.category) params.set('category', tab.category);
        if (search.trim()) params.set('search', search.trim());
        else params.set('limit', '15');
        // Default API: only isNew items (latest SarkariExam cycle)

        const res = await fetch(`/api/vacancies?${params}`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [activeTab, search]);

  const getJobHref = (job: JobItem) => {
    if (job.liveOnly && (job.officialLink || job.sourceUrl)) {
      return job.officialLink || job.sourceUrl || '#';
    }
    if (job.category === 'Results') return `/result/${job.slug}`;
    if (job.category === 'Admit Cards') return `/admit-card/${job.slug}`;
    return `/vacancy/${job.slug}`;
  };

  const isExternalJob = (job: JobItem) =>
    !!(job.liveOnly && (job.officialLink || job.sourceUrl));

  const setTab = (key: TabKey) => {
    setActiveTab(key);
    const url = key === 'all' ? '/vacancies' : `/vacancies?tab=${key}`;
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <section className="relative overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_35%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Jan Seva Kendra · Sarkari Updates
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Government Jobs Portal
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Sirf naye update dikhte hain — purani list nahi. SarkariExam se har 6 ghante auto sync.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, board, post..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
            Abhi naya update nahi. Agla refresh har 6 ghante par automatic hoga.
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => {
              const href = getJobHref(job);
              const external = isExternalJob(job);
              const rowClass =
                'group flex items-center gap-4 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all';
              const row = (
                <>
                  <div
                    className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 ${
                      job.category === 'Results'
                        ? 'bg-emerald-50 text-emerald-600'
                        : job.category === 'Admit Cards'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {job.category === 'Results' ? (
                      <Trophy className="w-6 h-6" />
                    ) : job.category === 'Admit Cards' ? (
                      <FileCheck className="w-6 h-6" />
                    ) : (
                      <Briefcase className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {job.category}
                      </span>
                      {job.isNew && (
                        <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                      {job.title}
                    </h2>
                    <JobMetaChips job={job} compact />
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 shrink-0 transition-colors" />
                </>
              );
              return (
                <li key={job._id || job.id || job.slug}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                      {row}
                    </a>
                  ) : (
                    <Link href={href} className={rowClass}>
                      {row}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          Latest 15 updates per category · Auto refresh every 6 hours
        </p>
      </main>
    </div>
  );
}
