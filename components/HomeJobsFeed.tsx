'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Vacancy {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: 'Vacancies' | 'Results' | 'Admit Cards';
  isNew?: boolean;
}

export default function HomeJobsFeed() {
  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Fetch latest 25 items to categorize them
      const response = await fetch('/api/vacancies?limit=30');
      if (response.ok) {
        const data = await response.json();
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Error fetching home jobs feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const vacancies = jobs.filter(j => j.category === 'Vacancies').slice(0, 8);
  const admitCards = jobs.filter(j => j.category === 'Admit Cards').slice(0, 8);
  const results = jobs.filter(j => j.category === 'Results').slice(0, 8);

  // Helper to render columns
  const renderColumn = (title: string, items: Vacancy[], routePrefix: string, href: string, colorClass: string) => {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
        <div>
          {/* Column Header */}
          <div className={`p-4 bg-gradient-to-r ${colorClass} text-white font-bold flex justify-between items-center`}>
            <span className="tracking-wide text-sm sm:text-base">{title}</span>
            <Link href={href} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full border border-white/10 transition-colors">
              View All
            </Link>
          </div>
          
          {/* List items */}
          <div className="divide-y divide-slate-100 p-2 min-h-[360px]">
            {loading ? (
              // Skeleton loading
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-3.5 space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-11/12"></div>
                  <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                </div>
              ))
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 min-h-[300px] flex items-center justify-center">
                No active updates available
              </div>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id || item._id}
                  href={`/${routePrefix}/${item.slug}`}
                  className="block p-3 hover:bg-slate-50 transition-colors rounded-xl text-slate-700 hover:text-orange-600 group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 shrink-0 text-xs">⚡</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                        {item.title}
                      </span>
                      {item.isNew && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[8px] font-extrabold uppercase tracking-wider animate-pulse shadow-sm">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <Link
            href={href}
            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-orange-650 transition-colors"
          >
            Explore all {title.toLowerCase()}
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-slate-50 py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-orange-100 rounded-full">
            Fast Updates
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Latest Jobs, Admit Cards & Results
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Stay ahead with live aggregated government notifications. Fast, verified, and direct.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {renderColumn('Latest Vacancies', vacancies, 'vacancy', '/vacancies', 'from-orange-600 to-amber-500',)}
          {renderColumn('Admit Cards', admitCards, 'admit-card', '/admit-cards', 'from-blue-600 to-indigo-500')}
          {renderColumn('Exam Results', results, 'result', '/results', 'from-emerald-600 to-teal-500')}
        </div>

      </div>
    </section>
  );
}
