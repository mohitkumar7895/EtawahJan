import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteLocationLanding from '@/components/WebsiteLocationLanding'
import type { Metadata } from 'next'
import {
  getAllWebsiteDistrictParams,
  getDistrictBySlug,
} from '@/lib/seo/india-locations'
import { indiaDistrictMeta } from '@/lib/seo/website-seo-copy'

interface PageProps {
  params: { state: string; district: string }
}

export async function generateStaticParams() {
  return getAllWebsiteDistrictParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loc = getDistrictBySlug(params.state, params.district)
  const districtName = loc?.district.name || params.district
  const stateName = loc?.state.name || params.state
  const meta = indiaDistrictMeta(districtName, stateName)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://www.jan-seva.site/website/${params.state}/${params.district}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://www.jan-seva.site/website/${params.state}/${params.district}`,
    },
  }
}

export default function WebsiteDistrictPage({ params }: PageProps) {
  const loc = getDistrictBySlug(params.state, params.district)

  if (!loc) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <p className="text-lg font-semibold text-slate-600">Location not found.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <WebsiteLocationLanding
        stateName={loc.state.name}
        stateSlug={loc.state.slug}
        districtName={loc.district.name}
        districtSlug={loc.district.slug}
      />
      <Footer />
    </>
  )
}
