import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WebsiteLeadsHomeSection from '@/components/WebsiteLeadsHomeSection'
import WebsiteSeoHubContent from '@/components/WebsiteSeoHubContent'
import Link from 'next/link'
import type { Metadata } from 'next'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '#1 Website Banwana India & Worldwide | Business Website, App & Software — Free Quote',
  description:
    'Best website development company — India 780+ cities + USA, Russia, UK, UAE, 65 countries. Business website, e-commerce, mobile app, billing software. Customers badhao, Google rank pao. WhatsApp 7895094129 — free quote 24hrs.',
  keywords: [
    'website banwana',
    'website development company',
    'best web developer India',
    'website development USA',
    'website development Russia',
    'hire web developer affordable',
    'business website India',
    'ecommerce website banwana',
    'mobile app development',
    'custom software development',
    'website company near me',
    'apni website banvaiye',
    'cheap website development',
    'professional website design',
  ],
  alternates: { canonical: 'https://www.jan-seva.site/build-website' },
  openGraph: {
    title: 'Apni Website Banvaiye — Customers Badhao',
    url: 'https://www.jan-seva.site/build-website',
  },
}

export default function BuildWebsiteHubPage() {
  return (
    <>
      <Header />
      <WebsiteLeadsHomeSection />
      <div className="bg-white py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Detail — Kya Banwana Hai?</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {WEBSITE_BUILD_SERVICES.map((svc) => (
              <Link
                key={svc.slug}
                href={`/build-website/${svc.slug}`}
                className="flex items-center justify-between rounded-2xl border bg-slate-50 p-5 hover:border-indigo-300 hover:shadow-md transition group"
              >
                <div>
                  <p className="font-black text-slate-900">{svc.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{svc.hindi}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
              </Link>
            ))}
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-4">Industry-wise pages</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
        </div>
      </div>
      <WebsiteSeoHubContent />
      <Footer />
    </>
  )
}
