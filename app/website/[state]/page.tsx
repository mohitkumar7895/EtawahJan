import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteLocationLanding from '@/components/WebsiteLocationLanding'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import {
  getAllWebsiteStateParams,
  getStateBySlug,
} from '@/lib/seo/india-locations'

interface PageProps {
  params: { state: string }
}

export async function generateStaticParams() {
  return getAllWebsiteStateParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const st = getStateBySlug(params.state)
  const stateName = st?.name || params.state
  const title = `Website Development ${stateName} | Software Company ${stateName} India`
  const description = `Best website development & software company in ${stateName}, India. Business website, e-commerce, mobile app, billing software for all districts of ${stateName}. Call 9193898182 | WhatsApp 7895094129.`

  return {
    title,
    description,
    keywords: [
      `website development ${stateName}`,
      `software company ${stateName}`,
      `website banwana ${stateName}`,
      `web developer ${stateName}`,
      `mobile app development ${stateName}`,
      `business website ${stateName}`,
      `ecommerce website ${stateName}`,
      `custom software ${stateName}`,
      `website developer near me ${stateName}`,
    ],
    alternates: {
      canonical: `https://www.jan-seva.site/website/${params.state}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.jan-seva.site/website/${params.state}`,
    },
  }
}

export default function WebsiteStatePage({ params }: PageProps) {
  const st = getStateBySlug(params.state)
  if (!st) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <p className="text-lg font-semibold text-slate-600">State not found.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <WebsiteLocationLanding stateName={st.name} stateSlug={st.slug} />

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Website & Software — {st.name} Districts
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            {st.districts.length} districts — apna district choose karein, local SEO page se direct quote lein.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {st.districts.map((dist) => (
              <Link
                key={dist.slug}
                href={`/website/${st.slug}/${dist.slug}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 transition group"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 min-w-0">
                  <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="truncate">{dist.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
