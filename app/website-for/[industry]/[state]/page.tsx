import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteIndustryLanding from '@/components/WebsiteIndustryLanding'
import type { Metadata } from 'next'
import { getAllIndustryStateParams, getIndustryBySlug } from '@/lib/seo/website-industries'
import { getStateBySlug, INDIA_STATES } from '@/lib/seo/india-locations'

interface PageProps {
  params: { industry: string; state: string }
}

export async function generateStaticParams() {
  return getAllIndustryStateParams(INDIA_STATES)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ind = getIndustryBySlug(params.industry)
  const st = getStateBySlug(params.state)
  const name = ind?.name || params.industry
  const stateName = st?.name || params.state
  return {
    title: `${name} Website ${stateName} | ${name} Website Development ${stateName} India`,
    description: `${name} website development in ${stateName}, India. Professional design, WhatsApp leads, SEO. All districts covered. Call 9193898182 | WhatsApp 7895094129.`,
    keywords: [
      `${name} website ${stateName}`,
      `website banwana ${stateName}`,
      `${name} website development ${stateName}`,
    ],
    alternates: {
      canonical: `https://www.jan-seva.site/website-for/${params.industry}/${params.state}`,
    },
  }
}

export default function WebsiteForIndustryStatePage({ params }: PageProps) {
  const ind = getIndustryBySlug(params.industry)
  const st = getStateBySlug(params.state)
  if (!ind || !st) {
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
      <WebsiteIndustryLanding industry={ind} state={st} />
      <Footer />
    </>
  )
}
