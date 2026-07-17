import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Globe2 } from 'lucide-react'
import {
  WORLD_COUNTRIES,
  WORLD_REGION_LABELS,
  WORLD_SITEMAP_STATS,
  getCountriesByRegion,
  type WorldRegion,
} from '@/lib/seo/world-locations'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'

export const metadata: Metadata = {
  title: `Global Website Sitemap | ${WORLD_SITEMAP_STATS.countries} Countries · ${WORLD_SITEMAP_STATS.cities}+ Cities`,
  description: `Website development sitemap worldwide — USA, Russia, UK, UAE, Canada, Australia, Europe, Asia, Africa. ${WORLD_SITEMAP_STATS.cities}+ city pages for web design & software leads.`,
  keywords: [
    'website development USA sitemap',
    'website development Russia',
    'global web design sitemap',
    'website developer worldwide',
    'software company international',
  ],
  alternates: { canonical: 'https://www.jan-seva.site/global-website-sitemap' },
}

const REGIONS: WorldRegion[] = [
  'north-america',
  'europe',
  'asia',
  'middle-east',
  'africa',
  'oceania',
  'south-america',
]

export default function GlobalWebsiteSitemapPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/40 to-indigo-50/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 mb-3">
              <Globe2 className="w-3.5 h-3.5" /> Worldwide Coverage
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Global Website Development Sitemap
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {WORLD_SITEMAP_STATS.countries} countries · {WORLD_SITEMAP_STATS.cities}+ cities — USA, Russia, UK,
              Canada, UAE, Germany, Australia & more. Har country/city ka dedicated SEO page.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/website-world" className="rounded-full bg-violet-600 text-white text-xs font-bold px-4 py-2">
                Website World Hub →
              </Link>
              <Link href="/website-sitemap" className="rounded-full bg-indigo-600 text-white text-xs font-bold px-4 py-2">
                India Sitemap →
              </Link>
              <Link href="/build-website" className="rounded-full bg-slate-900 text-white text-xs font-bold px-4 py-2">
                Build Website →
              </Link>
            </div>
          </div>

          {REGIONS.map((region) => {
            const countries = getCountriesByRegion(region)
            if (!countries.length) return null
            return (
              <section key={region} className="mb-12 bg-white rounded-2xl shadow border p-6 sm:p-8">
                <h2 className="text-xl font-black text-gray-900 mb-6">{WORLD_REGION_LABELS[region]}</h2>
                <div className="space-y-8">
                  {countries.map((c) => (
                    <div key={c.slug}>
                      <Link
                        href={`/website-world/${c.slug}`}
                        className="text-lg font-black text-violet-700 hover:underline"
                      >
                        {c.name} ({c.code})
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.cities.map((ct) => (
                          <Link
                            key={ct.slug}
                            href={`/website-world/${c.slug}/${ct.slug}`}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                          >
                            {ct.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {WEBSITE_INDUSTRIES.slice(0, 5).map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/website-for/${ind.slug}/world/${c.slug}`}
                            className="text-[10px] font-bold text-violet-600 hover:underline"
                          >
                            {ind.name}
                          </Link>
                        ))}
                        <span className="text-[10px] text-gray-400">+more industries</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}
