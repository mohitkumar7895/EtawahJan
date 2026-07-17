import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CopyBlock from '@/components/growth/CopyBlock'
import {
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  MessageCircle,
} from 'lucide-react'
import {
  GROWTH_GUIDES,
  getGrowthGuideBySlug,
  SITE_URL,
  SITEMAP_URL,
  WHATSAPP_LINK,
} from '@/lib/seo/growth-guides'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return GROWTH_GUIDES.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGrowthGuideBySlug(params.slug)
  if (!guide) return { title: 'Guide not found' }

  return {
    title: `${guide.title} | Jan Seva Kendra`,
    description: guide.description,
    alternates: { canonical: `${SITE_URL}/grow/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}/grow/${guide.slug}`,
      type: 'article',
    },
  }
}

function renderStepContent(content: string) {
  return content.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className={line.trim() === '' ? 'h-2' : 'text-slate-600 dark:text-slate-300 leading-relaxed'}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="font-bold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    )
  })
}

export default function GrowGuidePage({ params }: Props) {
  const guide = getGrowthGuideBySlug(params.slug)
  if (!guide) notFound()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    step:
      guide.steps?.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.content.replace(/\*\*/g, ''),
      })) ?? [],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <nav className="mx-auto max-w-4xl px-4 pt-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li>
              <Link href="/grow" className="hover:text-indigo-600">
                Growth Guides
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li className="font-semibold text-slate-700 dark:text-slate-200">{guide.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-4xl px-4 py-10 pb-20">
          <header className="mb-10">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              {guide.category === 'seo' ? 'Google SEO Guide' : 'Social Media Templates'}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl dark:text-white">
              {guide.title}
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{guide.description}</p>

            {guide.category === 'seo' && (
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-500"
                >
                  Open Search Console
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={SITEMAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                >
                  View sitemap.xml
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </header>

          {/* SEO steps */}
          {guide.steps && guide.steps.length > 0 && (
            <section className="mb-12 space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Step-by-step</h2>
              {guide.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                      <div className="mt-2 space-y-1">{renderStepContent(step.content)}</div>
                      {step.tip && (
                        <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm dark:bg-amber-500/10 dark:border-amber-500/20">
                          <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                          <p className="text-amber-900 dark:text-amber-100">
                            <strong>Tip:</strong> {step.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Social templates */}
          {guide.templates && guide.templates.length > 0 && (
            <section className="mb-12 space-y-8">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Copy-paste templates
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Har template par <strong>Copy post</strong> dabayein — phir Facebook, Instagram, WhatsApp
                status, ya YouTube description me paste karein. Site link already included hai.
              </p>
              {guide.templates.map((t) => (
                <div key={t.id}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {t.platform}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white">{t.title}</h3>
                  </div>
                  <CopyBlock text={t.text} hashtags={t.hashtags} />
                </div>
              ))}
            </section>
          )}

          {/* Checklist */}
          {guide.checklist && guide.checklist.length > 0 && (
            <section className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Checklist — tick karein jab ho jaye
              </h2>
              <ul className="space-y-2">
                {guide.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-emerald-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                FAQs
              </h2>
              <div className="space-y-3">
                {guide.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <summary className="cursor-pointer list-none font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center justify-between gap-4">
                        {f.q}
                        <ChevronRight className="h-4 w-4 text-indigo-500 transition-transform group-open:rotate-90" />
                      </span>
                    </summary>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-emerald-50 p-8 text-center dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-emerald-500/10">
            <MessageCircle className="mx-auto h-9 w-9 text-indigo-600" />
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              Website customer chahiye?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-300">
              Khud website banwana ho to WhatsApp par baat karein — free quote same day.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500"
              >
                WhatsApp 7895094129
              </a>
              <Link
                href="/build-website"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500"
              >
                Website Services
              </Link>
              <Link
                href="/grow"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                All guides
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
