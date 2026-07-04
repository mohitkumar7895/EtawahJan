import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteIndustryLanding from '@/components/WebsiteIndustryLanding'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllIndustryParams, getIndustryBySlug } from '@/lib/seo/website-industries'

interface PageProps {
  params: { industry: string }
}

export async function generateStaticParams() {
  return getAllIndustryParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ind = getIndustryBySlug(params.industry)
  const name = ind?.name || params.industry
  return {
    title: `${name} Website Development India | ${name} Website Banwana`,
    description: `Professional ${name.toLowerCase()} website development across all India. Mobile-friendly, WhatsApp leads, SEO. Affordable packages. WhatsApp 7895094129 | Call 9193898182.`,
    keywords: ind?.keywords || [`${name} website`, 'website banwana India'],
    alternates: { canonical: `https://www.jan-seva.site/website-for/${params.industry}` },
  }
}

export default function WebsiteForIndustryPage({ params }: PageProps) {
  const ind = getIndustryBySlug(params.industry)
  if (!ind) {
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
      <WebsiteIndustryLanding industry={ind} />
      <div className="container mx-auto px-4 py-6 max-w-5xl text-center">
        <Link href="/website-sitemap" className="text-sm font-bold text-indigo-600 hover:underline">
          ← All India website sitemap
        </Link>
      </div>
      <Footer />
    </>
  )
}
