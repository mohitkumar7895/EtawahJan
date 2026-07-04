import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteBuildServiceLanding from '@/components/WebsiteBuildServiceLanding'
import type { Metadata } from 'next'
import { getAllBuildServiceParams, getBuildServiceBySlug } from '@/lib/seo/website-build-services'

interface PageProps {
  params: { service: string }
}

export async function generateStaticParams() {
  return getAllBuildServiceParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const svc = getBuildServiceBySlug(params.service)
  return {
    title: svc ? `${svc.name} India | ${svc.headline}` : 'Build Website',
    description: svc?.description || 'Website development India',
    keywords: svc?.keywords || ['website banwana'],
    alternates: { canonical: `https://www.jan-seva.site/build-website/${params.service}` },
  }
}

export default function BuildWebsitePage({ params }: PageProps) {
  const svc = getBuildServiceBySlug(params.service)
  if (!svc) {
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
      <WebsiteBuildServiceLanding service={svc} />
      <Footer />
    </>
  )
}
