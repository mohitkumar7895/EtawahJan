import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteGlobalLanding from '@/components/WebsiteGlobalLanding'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getCountryBySlug, getAllWorldCountryParams } from '@/lib/seo/world-locations'
import { globalCountryMeta } from '@/lib/seo/website-seo-copy'

interface PageProps {
  params: { country: string }
}

export async function generateStaticParams() {
  return getAllWorldCountryParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = getCountryBySlug(params.country)
  const countryName = c?.name || params.country
  const meta = globalCountryMeta(countryName)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `https://www.jan-seva.site/website-world/${params.country}` },
    openGraph: { title: meta.title, description: meta.description, url: `https://www.jan-seva.site/website-world/${params.country}` },
  }
}

export default function WebsiteWorldCountryPage({ params }: PageProps) {
  const c = getCountryBySlug(params.country)
  if (!c) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center">Country not found.</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <WebsiteGlobalLanding countryName={c.name} countrySlug={c.slug} countryCode={c.code} />

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Website Development — Cities in {c.name}
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            {c.cities.length} cities — choose yours for local SEO page & instant WhatsApp quote.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {c.cities.map((ct) => (
              <Link
                key={ct.slug}
                href={`/website-world/${c.slug}/${ct.slug}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-violet-300 hover:bg-violet-50 transition group"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 min-w-0">
                  <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                  <span className="truncate">{ct.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
