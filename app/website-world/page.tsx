import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Globe2, MapPin, ArrowRight } from 'lucide-react'
import {
  WORLD_COUNTRIES,
  WORLD_REGION_LABELS,
  WORLD_SITEMAP_STATS,
  getCountriesByRegion,
  type WorldRegion,
} from '@/lib/seo/world-locations'

export const metadata: Metadata = {
  title: '#1 Website Development Worldwide | USA, Russia, UK, UAE & 65 Countries — Free Quote',
  description: `Professional website development for ${WORLD_SITEMAP_STATS.countries} countries, ${WORLD_SITEMAP_STATS.cities}+ cities. Business websites, e-commerce, mobile apps — affordable, SEO-ready. WhatsApp 7895094129. Get more customers from Google.`,
  keywords: [
    'website development USA',
    'website development Russia',
    'web design UK',
    'software company Dubai',
    'affordable website development worldwide',
    'hire web developer India for USA',
    'custom software international',
    'website development Canada Australia',
  ],
  alternates: { canonical: 'https://www.jan-seva.site/website-world' },
  openGraph: {
    title: 'Global Website Development — 55+ Countries',
    url: 'https://www.jan-seva.site/website-world',
  },
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

export default function WebsiteWorldHubPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold mb-4">
              <Globe2 className="h-4 w-4" /> {WORLD_SITEMAP_STATS.countries} Countries · {WORLD_SITEMAP_STATS.cities}+ Cities
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              #1 Website Development{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300">
                Worldwide
              </span>
            </h1>
            <p className="text-lg text-violet-200 max-w-2xl mx-auto mb-8">
              USA, Russia, UK, Canada, UAE, Germany, Australia & {WORLD_SITEMAP_STATS.countries} countries — professional
              websites, e-commerce, apps & software. Affordable · SEO-ready · More customers from Google.
              WhatsApp <strong>7895094129</strong> — free quote in 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/build-website" className="rounded-xl bg-yellow-400 text-slate-900 font-black px-6 py-3 hover:bg-yellow-300">
                Build Your Website →
              </Link>
              <Link href="/global-website-sitemap" className="rounded-xl border border-white/30 font-bold px-6 py-3 hover:bg-white/10">
                Full Global Sitemap
              </Link>
              <Link href="/website-sitemap" className="rounded-xl border border-white/30 font-bold px-6 py-3 hover:bg-white/10">
                India Sitemap
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white/5">
          <div className="container mx-auto max-w-6xl space-y-12">
            {REGIONS.map((region) => {
              const countries = getCountriesByRegion(region)
              if (countries.length === 0) return null
              return (
                <div key={region}>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-yellow-300" />
                    {WORLD_REGION_LABELS[region]}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countries.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/website-world/${c.slug}`}
                        className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-violet-400/50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-violet-300">{c.code}</span>
                            <h3 className="text-lg font-black">{c.name}</h3>
                            <p className="text-xs text-violet-200 mt-1">{c.cities.length} cities</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-violet-400 group-hover:translate-x-1 transition" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
