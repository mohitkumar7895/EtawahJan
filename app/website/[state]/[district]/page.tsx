import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteLocationLanding from '@/components/WebsiteLocationLanding'
import type { Metadata } from 'next'
import {
  getAllWebsiteDistrictParams,
  getDistrictBySlug,
} from '@/lib/seo/india-locations'

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
  const label = `${districtName}, ${stateName}`

  const title = `Website Development ${label} | Software ${districtName}`
  const description = `Website & software development in ${label}, India. Business website, e-commerce, mobile app, billing software for ${districtName}. Affordable pricing. WhatsApp 7895094129 | Call 9193898182.`

  return {
    title,
    description,
    keywords: [
      `website development ${districtName}`,
      `website banwana ${districtName}`,
      `software company ${districtName}`,
      `web developer ${districtName} ${stateName}`,
      `business website ${districtName}`,
      `mobile app ${districtName}`,
      `website developer near me ${districtName}`,
      `custom software ${districtName}`,
    ],
    alternates: {
      canonical: `https://www.jan-seva.site/website/${params.state}/${params.district}`,
    },
    openGraph: {
      title,
      description,
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
