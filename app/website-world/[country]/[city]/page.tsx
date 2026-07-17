import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteGlobalLanding from '@/components/WebsiteGlobalLanding'
import type { Metadata } from 'next'
import { getAllWorldCityParams, getCityBySlug } from '@/lib/seo/world-locations'
import { globalCityMeta } from '@/lib/seo/website-seo-copy'

interface PageProps {
  params: { country: string; city: string }
}

export async function generateStaticParams() {
  return getAllWorldCityParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loc = getCityBySlug(params.country, params.city)
  const cityName = loc?.city.name || params.city
  const countryName = loc?.country.name || params.country
  const meta = globalCityMeta(cityName, countryName)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://www.jan-seva.site/website-world/${params.country}/${params.city}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://www.jan-seva.site/website-world/${params.country}/${params.city}`,
    },
  }
}

export default function WebsiteWorldCityPage({ params }: PageProps) {
  const loc = getCityBySlug(params.country, params.city)

  if (!loc) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] flex items-center justify-center">City not found.</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <WebsiteGlobalLanding
        countryName={loc.country.name}
        countrySlug={loc.country.slug}
        countryCode={loc.country.code}
        cityName={loc.city.name}
        citySlug={loc.city.slug}
      />
      <Footer />
    </>
  )
}
