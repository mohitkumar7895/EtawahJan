import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  FILE_CONVERTER_SUB_TOOLS,
  MAIN_TOOL_LINKS,
  POPULAR_TOOL_SEARCHES,
  SITE_ORIGIN,
} from '@/lib/seo/tools-catalog';
import { ALL_TEMPLATES, CATEGORY_META, ORDERED_CATEGORIES } from '@/lib/applications/templates';

export const metadata: Metadata = {
  title: 'All Free Tools Sitemap — Photo Resizer, PDF, Cash Counter, 21 Converters | Jan Seva',
  description:
    'Complete list of Jan Seva Kendra free tools — photo resizer, PDF editor, cash counter, file converter (21 tools), resume builder, application maker (60+ letters). Every tool link for Google & users.',
  keywords: [
    'free tools sitemap',
    'online tools list india',
    'jan seva tools',
    'photo resizer link',
    'pdf tools free',
    'all converter tools',
  ],
  alternates: { canonical: `${SITE_ORIGIN}/tools-sitemap` },
  openGraph: {
    title: 'All Free Tools — Complete Sitemap',
    description: 'Every free tool on Jan Seva Kendra — one page, all links.',
    url: `${SITE_ORIGIN}/tools-sitemap`,
  },
};

export default function ToolsSitemapPage() {
  const appsByCategory = ORDERED_CATEGORIES.map((cat) => ({
    cat,
    label: CATEGORY_META[cat].label,
    templates: ALL_TEMPLATES.filter((t) => t.category === cat),
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Free Tools Sitemap
          </h1>
          <p className="text-slate-600 mb-8">
            Saare tools ek page par — Google indexing aur aapke liye quick access.{' '}
            <Link href="/tools" className="text-blue-600 font-bold hover:underline">
              Tools hub →
            </Link>
            {' · '}
            <Link href="/guides" className="text-rose-600 font-bold hover:underline">
              Guides →
            </Link>
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Main tools ({MAIN_TOOL_LINKS.length})</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {MAIN_TOOL_LINKS.map((t) => (
                <li key={t.slug} className="rounded-lg border bg-white px-4 py-2">
                  <Link href={t.path} className="font-semibold text-blue-700 hover:underline">
                    {t.label}
                  </Link>
                  <span className="text-slate-400 mx-2">|</span>
                  <Link href={`/guides/${t.slug}`} className="text-xs text-rose-600 hover:underline">
                    Guide
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              File converter sub-tools ({FILE_CONVERTER_SUB_TOOLS.length})
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {FILE_CONVERTER_SUB_TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link href={t.path} className="text-blue-700 hover:underline font-medium">
                    {t.title.split('—')[0].trim()}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Application letters ({ALL_TEMPLATES.length})
            </h2>
            {appsByCategory.map(({ cat, label, templates }) =>
              templates.length > 0 ? (
                <div key={cat} className="mb-6">
                  <h3 className="font-bold text-slate-800 mb-2">{label}</h3>
                  <ul className="grid sm:grid-cols-2 gap-1 text-sm">
                    {templates.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/applications/${t.slug}`}
                          className="text-blue-700 hover:underline"
                        >
                          {t.titleEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Popular searches</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOOL_SEARCHES.map((item) => (
                <Link
                  key={item.path + item.query}
                  href={item.path}
                  className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300"
                >
                  {item.query}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
