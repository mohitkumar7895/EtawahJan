import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users,
  HelpCircle,
} from 'lucide-react';
import {
  SEO_TOOLS,
  getSeoToolBySlug,
  SITE_ORIGIN,
  type SeoTool,
} from '@/lib/seo/tools-catalog';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  // Pre-render every guide at build time — guides are a fixed set
  // tied to the catalogue, so SSG gives us instant page loads + the
  // strongest possible crawl signal (200 OK with full HTML).
  return SEO_TOOLS.filter((t) => t.slug !== 'tools').map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getSeoToolBySlug(params.slug);
  if (!tool || tool.slug === 'tools') return { title: 'Guide not found' };

  const heading = tool.title.split('—')[0].trim();
  const url = `${SITE_ORIGIN}/guides/${tool.slug}`;
  const guideTitle = `${heading} — Step-by-Step Guide & FAQs | Jan Seva Kendra`;
  const guideDesc = `Learn how to use ${heading} on Jan Seva Kendra — ${tool.description}`;

  return {
    title: guideTitle,
    description: guideDesc,
    keywords: [
      ...tool.keywords,
      `${heading.toLowerCase()} kaise karein`,
      `${heading.toLowerCase()} tutorial`,
      `${heading.toLowerCase()} guide`,
    ],
    openGraph: {
      title: guideTitle,
      description: guideDesc,
      url,
      type: 'article',
      images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guideTitle,
      description: guideDesc,
    },
    alternates: { canonical: url },
  };
}

function GuideJsonLd({ tool }: { tool: SeoTool }) {
  const heading = tool.title.split('—')[0].trim();
  const guideUrl = `${SITE_ORIGIN}/guides/${tool.slug}`;
  const toolUrl = `${SITE_ORIGIN}${tool.path}`;

  // HowTo schema — eligible for rich SERP cards with the steps.
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${heading}`,
    description: tool.description,
    totalTime: 'PT2M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
    step: tool.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${guideUrl}#step-${i + 1}`,
    })),
    tool: [{ '@type': 'HowToTool', name: heading }],
  };

  // FAQPage schema — eligible for the expandable FAQ block in SERPs.
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Article wrapper so the page is a first-class indexable document.
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${heading} — Step-by-Step Guide`,
    description: tool.description,
    url: guideUrl,
    mainEntityOfPage: guideUrl,
    image: `${SITE_ORIGIN}/jan-seva-logo-1.png`,
    author: { '@type': 'Organization', name: 'Arpit Jan Seva Kendra', url: SITE_ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: 'Arpit Jan Seva Kendra',
      url: SITE_ORIGIN,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/jan-seva-logo-1.png` },
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    about: { '@type': 'SoftwareApplication', name: heading, url: toolUrl },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_ORIGIN}/guides` },
      { '@type': 'ListItem', position: 3, name: heading, item: guideUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default function GuidePage({ params }: Props) {
  const tool = getSeoToolBySlug(params.slug);
  if (!tool || tool.slug === 'tools') notFound();

  const heading = tool.title.split('—')[0].trim();
  const toolHref = tool.path;

  // Find related guides (other tools in the same category — keeps users
  // and crawlers moving across the cluster).
  const related = SEO_TOOLS.filter(
    (t) => t.slug !== tool.slug && t.slug !== 'tools' && t.category === tool.category
  ).slice(0, 3);

  return (
    <>
      <GuideJsonLd tool={tool} />
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* Breadcrumb */}
        <nav
          className="mx-auto max-w-4xl px-4 pt-6 text-sm text-slate-500 dark:text-slate-400"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-rose-600">Home</Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li>
              <Link href="/guides" className="hover:text-rose-600">Guides</Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li className="font-semibold text-slate-700 dark:text-slate-200">{heading}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-4xl px-4 py-10">
          {/* Hero */}
          <header className="mb-10">
            <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              Step-by-step guide
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl dark:text-white">
              {heading}
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{tool.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={toolHref}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-rose-500/30 hover:brightness-110"
              >
                Open {heading}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                All guides
              </Link>
            </div>
          </header>

          {/* Audience */}
          {tool.audience.length > 0 && (
            <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <Users className="h-4 w-4 text-rose-500" />
                Who is this for?
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tool.audience.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Steps */}
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              <Sparkles className="h-5 w-5 text-rose-500" />
              How to use {heading}
            </h2>
            <ol className="space-y-5">
              {tool.steps.map((step, i) => (
                <li
                  key={step.name}
                  id={`step-${i + 1}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 font-bold text-white shadow">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.name}</h3>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{step.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="mb-12 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-8 text-center dark:border-rose-500/20 dark:from-rose-500/10 dark:to-orange-500/10">
            <CheckCircle2 className="mx-auto h-9 w-9 text-rose-500" />
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              Ready to use {heading}?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-300">
              Free, no sign-up, browser mein hi chalega — mobile aur desktop dono pe.
            </p>
            <Link
              href={toolHref}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/30 hover:brightness-110"
            >
              Open {heading}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              <HelpCircle className="h-5 w-5 text-rose-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {tool.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-slate-900 marker:hidden dark:text-white">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <ChevronRight className="h-4 w-4 text-rose-500 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related guides */}
          {related.length > 0 && (
            <section className="border-t border-slate-200 pt-10 dark:border-slate-800">
              <h2 className="mb-6 text-xl font-extrabold text-slate-900 dark:text-white">
                Related guides
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-rose-500/50"
                  >
                    <h3 className="font-bold text-slate-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400">
                      {r.title.split('—')[0].trim()}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">
                      {r.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
