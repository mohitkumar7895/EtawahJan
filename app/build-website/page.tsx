import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { ArrowRight, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Build Website — All Services & Industries | Jan Seva Kendra India',
  description: 'Choose website type: business, ecommerce, billing software, mobile app, SEO. 15 industries, 12 services. All India. WhatsApp 7895094129.',
  alternates: { canonical: 'https://www.jan-seva.site/build-website' },
}

export default function BuildWebsiteHubPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Kya Banwana Hai? — Website Services</h1>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Har type ki website aur software — seedha page choose karein, WhatsApp par quote lein.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {WEBSITE_BUILD_SERVICES.map((svc) => (
              <Link
                key={svc.slug}
                href={`/build-website/${svc.slug}`}
                className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition group"
              >
                <div>
                  <p className="font-black text-slate-900">{svc.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{svc.hindi}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
              </Link>
            ))}
          </div>
          <h2 className="text-2xl font-black mb-4">Industry-wise</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {WEBSITE_INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/website-for/${ind.slug}`}
                className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-100"
              >
                {ind.name}
              </Link>
            ))}
          </div>
          <a
            href="https://wa.me/917895094129?text=Hello,%20mujhe%20website%20banwana%20hai."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-black text-white"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp Quote
          </a>
        </div>
      </div>
      <Footer />
    </>
  )
}
