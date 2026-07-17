import Header from '@/components/Header'
import Footer from '@/components/Footer'
import IndiaWebsiteSitemapClient from '@/components/IndiaWebsiteSitemapClient'
import Link from 'next/link'
import { Globe, Map } from 'lucide-react'
import type { Metadata } from 'next'
import { INDIA_STATES, WEBSITE_SITEMAP_STATS } from '@/lib/seo/india-locations'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

export const metadata: Metadata = {
  title: 'All India Website Sitemap | Every State & District — Jan Seva Kendra',
  description: `Website development sitemap for all India — ${WEBSITE_SITEMAP_STATS.states} states, ${WEBSITE_SITEMAP_STATS.districts}+ districts. Find website & software services in your city. Business website, app, software.`,
  keywords: [
    'website development India',
    'software company all India',
    'website sitemap India',
    'website banwana',
    'web developer near me',
    'business website all states',
    'website development UP Maharashtra Delhi',
    'all district website developer',
  ],
  alternates: {
    canonical: 'https://www.jan-seva.site/website-sitemap',
  },
  openGraph: {
    title: 'All India Website & Software Sitemap',
    url: 'https://www.jan-seva.site/website-sitemap',
  },
}

export default function WebsiteSitemapPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/40 to-blue-50/30">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-3">
                  <Map className="w-3.5 h-3.5" /> All India Coverage
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  All India Website Sitemap
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  {WEBSITE_SITEMAP_STATS.states} states & UTs · {WEBSITE_SITEMAP_STATS.districts}+ districts —
                  har jagah website, software aur mobile app development ke liye local SEO pages.
                  Apna state/district choose karein, WhatsApp par free quote lein.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['Website', 'Software', 'Mobile App', 'SEO'].map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-900 text-white text-xs font-bold px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <IndiaWebsiteSitemapClient states={INDIA_STATES} />

              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-8">
                  <h2 className="text-xl font-black text-gray-900 mb-4">By Business Type (15 industries)</h2>
                  <div className="flex flex-wrap gap-2">
                    {WEBSITE_INDUSTRIES.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/website-for/${ind.slug}`}
                        className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-800 hover:bg-violet-100"
                      >
                        {ind.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-8">
                  <h2 className="text-xl font-black text-gray-900 mb-4">By Service (12 types)</h2>
                  <div className="flex flex-wrap gap-2">
                    {WEBSITE_BUILD_SERVICES.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={`/build-website/${svc.slug}`}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100"
                      >
                        {svc.name}
                      </Link>
                    ))}
                  </div>
                  <Link href="/build-website" className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
                    All build services hub →
                  </Link>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-800 p-6 sm:p-8 text-white text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="text-lg font-black mb-2">Poore India se customers — online delivery</h3>
                <p className="text-sm text-indigo-100 max-w-2xl mx-auto mb-4">
                  Chahe aap Delhi, Mumbai, Lucknow, Chennai ya kisi bhi district se hon — hum aapki website aur
                  software banate hain. Call 9193898182 | WhatsApp 7895094129
                </p>
                <a
                  href="https://wa.me/917895094129?text=Hello,%20mujhe%20website%20banwana%20hai."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-black hover:bg-green-600 transition"
                >
                  WhatsApp for Free Quote
                </a>
              </div>

              <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-800 to-purple-900 p-6 sm:p-8 text-white">
                <Globe className="w-8 h-8 mb-3 text-yellow-300" />
                <h3 className="text-xl font-black mb-2">🌍 Worldwide — USA, Russia, UK, UAE & 55+ Countries</h3>
                <p className="text-sm text-violet-100 mb-4">
                  Website customers poore duniya se — America, Russia, Europe, Middle East, Asia, Africa.
                  Har country & city ka SEO page ready hai.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/website-world" className="rounded-xl bg-yellow-400 text-slate-900 font-black px-5 py-2.5 text-sm hover:bg-yellow-300">
                    Website World Hub →
                  </Link>
                  <Link href="/global-website-sitemap" className="rounded-xl border border-white/30 font-bold px-5 py-2.5 text-sm hover:bg-white/10">
                    Global Sitemap (400+ cities)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
