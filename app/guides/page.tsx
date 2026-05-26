import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { SEO_TOOLS, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

export const metadata: Metadata = {
  title: 'Tool Guides — How to Use Free Online Tools | Jan Seva Kendra',
  description:
    'Step-by-step guides for every Jan Seva Kendra tool — Cash Counter, Photo Resizer, PDF Editor, File Converter, Background Changer, Resume Builder. Hindi + English.',
  keywords: [
    'free online tools guide',
    'photo resize kaise karein',
    'cash counter use kaise karein',
    'pdf editor tutorial',
    'sarkari photo resizer guide',
    'jan seva kendra tools guide',
    'how to use file converter',
    'resume builder tutorial india',
  ],
  openGraph: {
    title: 'Tool Guides — Free Online Tools by Jan Seva Kendra',
    description:
      'Har tool ka detailed step-by-step guide — beginner friendly, Hindi + English.',
    url: `${SITE_ORIGIN}/guides`,
    type: 'website',
    images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
  },
  alternates: {
    canonical: `${SITE_ORIGIN}/guides`,
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  document: 'Document Tools',
  finance: 'Finance & Cash',
  career: 'Career & Resume',
  utility: 'All-in-One',
};

const ACCENTS: Record<string, string> = {
  pdf: 'from-rose-500 to-orange-500',
  image: 'from-emerald-500 to-teal-500',
  finance: 'from-amber-500 to-yellow-500',
  career: 'from-indigo-500 to-blue-600',
  utility: 'from-slate-500 to-zinc-600',
  document: 'from-purple-500 to-fuchsia-500',
};

export default function GuidesHubPage() {
  // Skip the /tools landing in the guides list — its guide is meta and
  // adds no separate value over the per-tool guides below.
  const guides = SEO_TOOLS.filter((t) => t.slug !== 'tools');

  // CollectionPage JSON-LD so the hub itself can rank as a curated list.
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tool Guides',
    url: `${SITE_ORIGIN}/guides`,
    hasPart: guides.map((g) => ({
      '@type': 'HowTo',
      name: g.title.split('—')[0].trim(),
      url: `${SITE_ORIGIN}/guides/${g.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <section className="relative overflow-hidden px-4 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-rose-600 backdrop-blur dark:border-rose-500/30 dark:bg-slate-900/60">
              <BookOpen className="h-4 w-4" />
              Step-by-step Tool Guides
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Har tool ka{' '}
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                detailed guide
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Beginner se expert tak — Cash Counter, Photo Resizer, PDF Editor, File Converter aur Resume Builder ka complete walkthrough. Hindi + English mein.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => {
              const accent = ACCENTS[g.category] ?? 'from-slate-500 to-zinc-600';
              const heading = g.title.split('—')[0].trim();
              return (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {CATEGORY_LABELS[g.category] ?? g.category}
                  </span>
                  <h2 className="mt-4 text-lg font-bold leading-tight text-slate-900 dark:text-white">
                    {heading}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                    {g.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Read guide</span>
                    <ArrowRight className="h-4 w-4 text-rose-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-14 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-8 text-center dark:border-rose-500/20 dark:from-rose-500/10 dark:to-orange-500/10">
            <Sparkles className="mx-auto h-8 w-8 text-rose-500" />
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              Sab tools ek jagah
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-300">
              Har tool free, no sign-up, no ads. Browser mein hi sab kuch — mobile aur desktop dono pe.
            </p>
            <Link
              href="/tools"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 hover:brightness-110"
            >
              Open All Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
