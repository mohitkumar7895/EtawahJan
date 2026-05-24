'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Vacancy {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: 'Vacancies' | 'Results' | 'Admit Cards';
  shortDescription?: string;
  startDate?: string;
  lastDate?: string;
  totalPosts?: string;
  sourceType?: 'admin' | 'scraped';
  isNew?: boolean;
  createdAt?: string;
}

interface JobPortalViewProps {
  initialCategory?: 'Vacancies' | 'Results' | 'Admit Cards' | 'All';
  showHero?: boolean;
}

export default function JobPortalView({ 
  initialCategory = 'All', 
  showHero = false 
}: JobPortalViewProps) {
  
  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'Vacancies' | 'Results' | 'Admit Cards' | 'All'>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/vacancies';
      const params = new URLSearchParams();
      
      if (category !== 'All') {
        params.append('category', category);
      }
      if (!search.trim()) {
        params.append('limit', '15');
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setJobs(data || []);
    } catch (err: any) {
      console.error('Error loading job portal data:', err);
      setError('Could not load jobs at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    // Debounce search slightly to avoid excessive API requests
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category, search, fetchJobs]);

  // Map category to CSS colors for tags
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Results':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100';
      case 'Admit Cards':
        return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100';
    }
  };

  const getRoutePrefix = (cat: string) => {
    switch (cat) {
      case 'Results':
        return 'result';
      case 'Admit Cards':
        return 'admit-card';
      default:
        return 'vacancy';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner Section if requested */}
      {showHero && (
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white uppercase tracking-wider mb-4 animate-bounce">
              Live Updates
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              Sarkari Job Portal
            </h1>
            <p className="text-slate-350 text-base sm:text-xl max-w-2xl mx-auto mb-4 font-light">
              SarkariExam.com se auto-sync — har 6 घंटे में latest 15 updates per category.
            </p>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Vacancy: form & last date · Admit Card: hall ticket · Result: scorecard & merit
            </p>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Search & Filter bar container */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search jobs, results, eligibility, board names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm sm:text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap p-1.5 bg-slate-50 border border-slate-200 rounded-2xl gap-1">
              {(['All', 'Vacancies', 'Results', 'Admit Cards'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                    category === cat
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? '🔥 View All' : cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="h-8 bg-slate-200 rounded-xl"></div>
                  <div className="h-8 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-xl mx-auto my-12 shadow-sm">
            <span className="text-red-500 text-3xl block mb-2">⚠️</span>
            <h3 className="font-bold text-red-800 text-lg">Connection Error</h3>
            <p className="text-red-650 mt-1 text-sm">{error}</p>
            <button 
              onClick={fetchJobs}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 py-16 px-4 text-center max-w-xl mx-auto my-8 shadow-sm">
            <span className="text-slate-300 text-6xl block mb-4">🔍</span>
            <h3 className="font-bold text-slate-800 text-xl">No Updates Found</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              We could not find any job posts matching your criteria. Try adjusting your category or check your search spelling.
            </p>
            {(search || category !== initialCategory) && (
              <button
                onClick={() => { setSearch(''); setCategory(initialCategory); }}
                className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* Job Listings Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {jobs.map((job) => {
              const routePrefix = getRoutePrefix(job.category);
              return (
                <article 
                  key={job.id || job._id} 
                  className="group relative bg-white rounded-3xl border border-slate-150 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Header Tags */}
                    <div className="flex justify-between items-center mb-4 gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyles(job.category)}`}>
                        {job.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {job.isNew && (
                          <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[10px] font-extrabold uppercase tracking-wider animate-pulse shadow-sm">
                            NEW
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                          job.sourceType === 'scraped' 
                            ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                        }`}>
                          {job.sourceType === 'scraped' ? 'Auto-Scraped' : 'Verified'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                      {job.shortDescription || 'Click view details to read qualifications, eligibility criteria, required documents, and apply online.'}
                    </p>
                  </div>

                  {/* Date Grid */}
                  <div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs mb-4">
                      <div>
                        <span className="block text-slate-400 uppercase font-semibold text-[9px] tracking-wider">
                          {job.category === 'Results'
                            ? 'Result'
                            : job.category === 'Admit Cards'
                              ? 'Admit'
                              : 'Start'}
                        </span>
                        <span className="font-bold text-slate-700 truncate block mt-0.5">
                          {job.category === 'Results'
                            ? 'Declared'
                            : job.startDate || 'Available'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase font-semibold text-[9px] tracking-wider">
                          {job.category === 'Results'
                            ? 'Check'
                            : job.category === 'Admit Cards'
                              ? 'Exam Date'
                              : 'Last Date'}
                        </span>
                        <span className="font-bold text-red-500 truncate block mt-0.5">
                          {job.lastDate || 'See Details'}
                        </span>
                      </div>
                    </div>

                    {/* View Details Link Button */}
                    <Link
                      href={`/${routePrefix}/${job.slug}`}
                      className="block w-full text-center py-3 bg-slate-50 hover:bg-gradient-to-r hover:from-orange-600 hover:to-amber-500 hover:text-white border border-slate-200 hover:border-transparent text-slate-700 font-bold rounded-2xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-300 uppercase tracking-wide"
                    >
                      Apply / View Details
                    </Link>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
