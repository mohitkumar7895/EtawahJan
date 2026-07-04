'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ArrowRight, Globe } from 'lucide-react'
import type { StateLocation } from '@/lib/seo/india-locations'

type IndiaWebsiteSitemapClientProps = {
  states: StateLocation[]
}

export default function IndiaWebsiteSitemapClient({ states }: IndiaWebsiteSitemapClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeState, setActiveState] = useState<string>('all')

  const filteredStates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return states
      .filter((st) => activeState === 'all' || st.slug === activeState)
      .map((st) => {
        const districts = st.districts.filter(
          (d) =>
            !q ||
            d.name.toLowerCase().includes(q) ||
            st.name.toLowerCase().includes(q)
        )
        return { ...st, districts }
      })
      .filter((st) => st.districts.length > 0)
  }, [states, searchQuery, activeState])

  const totalDistricts = filteredStates.reduce((n, s) => n + s.districts.length, 0)

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label htmlFor="india-search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search State or District
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="india-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mumbai, Lucknow, Delhi, Jaipur..."
                className="w-full px-5 py-3.5 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="state-filter" className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by State
            </label>
            <select
              id="state-filter"
              value={activeState}
              onChange={(e) => setActiveState(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All States & UTs</option>
              {states.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name} ({st.districts.length})
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredStates.length} states · {totalDistricts} district website pages
        </p>
      </div>

      {filteredStates.map((st) => (
        <div
          key={st.slug}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 scroll-mt-24"
          id={`state-${st.slug}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                {st.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{st.districts.length} districts</p>
            </div>
            <Link
              href={`/website/${st.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:underline"
            >
              {st.name} state page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {st.districts.map((dist) => (
              <Link
                key={dist.slug}
                href={`/website/${st.slug}/${dist.slug}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/80 hover:bg-indigo-50 hover:border-indigo-200 transition group"
              >
                <span className="flex items-center gap-2 min-w-0 text-sm font-semibold text-gray-800">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{dist.name}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
