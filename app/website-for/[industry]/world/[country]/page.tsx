import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteIndustryLanding from '@/components/WebsiteIndustryLanding'
import type { Metadata } from 'next'
import { getAllIndustryWorldParams, getIndustryBySlug } from '@/lib/seo/website-industries'
import { getCountryBySlug, WORLD_COUNTRIES } from '@/lib/seo/world-locations'
import { industryWorldMeta } from '@/lib/seo/website-seo-copy'

interface PageProps {
  params: { industry: string; country: string }
}

export async function generateStaticParams() {
  return getAllIndustryWorldParams(WORLD_COUNTRIES)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ind = getIndustryBySlug(params.industry)
  const c = getCountryBySlug(params.country)
  const name = ind?.name || params.industry
  const countryName = c?.name || params.country
  const meta = industryWorldMeta(name, countryName)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://www.jan-seva.site/website-for/${params.industry}/world/${params.country}`,
    },
    openGraph: { title: meta.title, description: meta.description },
  }
}

export default function WebsiteForIndustryWorldPage({ params }: PageProps) {
  const ind = getIndustryBySlug(params.industry)
  const c = getCountryBySlug(params.country)
  if (!ind || !c) {
    return (
      <>
        <Header />
        <div className="min-h-[40vh] flex items-center justify-center">Not found</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <WebsiteIndustryLanding industry={ind} country={c} />
      <Footer />
    </>
  )
}
