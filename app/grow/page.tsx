import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, Search, Share2, TrendingUp } from 'lucide-react'
import { GROWTH_GUIDES, SITE_URL } from '@/lib/seo/growth-guides'

export const metadata: Metadata = {
  title: 'Google SEO & Social Media Guides — Customers Badhao | Jan Seva Kendra',
  description:
    'Google Search Console setup step-by-step + ready social media post templates. Apni website Google top par lao, backlinks banao, zyada customers pao. Free guides.',
  keywords: [
    'google search console setup hindi',
    'website google me kaise add karein',
    'sitemap submit google',
    'social media post templates business',
    'backlink kaise banaye',
    'website promotion facebook instagram',
  ],
  alternates: { canonical: `${SITE_URL}/grow` },
  openGraph: {
    title: 'SEO & Social Media Growth Guides | Jan Seva Kendra',
    description: 'Search Console setup + copy-paste social posts for more customers.',
    url: `${SITE_URL}/grow`,
  },
}

const ICONS = {
  search: Search,
  share: Share2,
} as const

export default function GrowHubPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-900/60">
              <TrendingUp className="h-4 w-4" />
              Business Growth Guides
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Google Top +{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Zyada Customers
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Step-by-step Google Search Console setup aur ready-made social media posts — copy karein,
              site ka link share karein, backlinks banao. Hindi + English.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 space-y-6">
          {GROWTH_GUIDES.map((guide) => {
            const Icon = ICONS[guide.icon as keyof typeof ICONS] ?? TrendingUp
            return (
              <Link
                key={guide.slug}
                href={`/grow/${guide.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {guide.category === 'seo' ? 'Google SEO' : 'Social Media'}
                    </span>
                    <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{guide.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      Guide kholein
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="text-slate-700 dark:text-slate-200">
              Pehle{' '}
              <Link href="/grow/google-search-console" className="font-bold text-indigo-600 hover:underline">
                Search Console setup
              </Link>{' '}
              karein, phir{' '}
              <Link href="/grow/social-media-templates" className="font-bold text-indigo-600 hover:underline">
                social posts
              </Link>{' '}
              share karein — dono saath me best results dete hain.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
