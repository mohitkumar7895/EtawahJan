import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getSeoToolBySlug, MAIN_TOOL_LINKS, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

interface ToolPageSeoFooterProps {
  slug: string;
}

/**
 * Server-rendered SEO block for individual tool pages.
 * Gives crawlers indexable text + internal links even when the
 * tool UI itself is client-only.
 */
export default function ToolPageSeoFooter({ slug }: ToolPageSeoFooterProps) {
  const tool = getSeoToolBySlug(slug);
  if (!tool) return null;

  const heading = tool.title.split('—')[0].trim();
  const related = MAIN_TOOL_LINKS.filter((t) => t.slug !== slug && t.category === tool.category).slice(0, 3);
  const otherPopular = MAIN_TOOL_LINKS.filter((t) => t.slug !== slug && t.category !== tool.category).slice(0, 4);

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            About {heading} — Free Online Tool
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{tool.description}</p>
          <p className="mt-3 text-sm text-slate-500">
            Keywords: {tool.keywords.slice(0, 8).join(' · ')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/guides/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition"
          >
            <BookOpen className="h-4 w-4" />
            {heading} — Step-by-step Guide
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            All Free Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tools-sitemap"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Tools Sitemap
          </Link>
        </div>

        {(related.length > 0 || otherPopular.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-6">
            {related.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Related tools</h3>
                <ul className="space-y-1.5">
                  {related.map((t) => (
                    <li key={t.slug}>
                      <Link href={t.path} className="text-sm font-semibold text-blue-700 hover:underline">
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {otherPopular.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Popular tools</h3>
                <ul className="space-y-1.5">
                  {otherPopular.map((t) => (
                    <li key={t.slug}>
                      <Link href={t.path} className="text-sm font-semibold text-blue-700 hover:underline">
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400">
          {heading} · {SITE_ORIGIN}{tool.path} · Jan Seva Kendra Etawah · 100% free · no sign-up
        </p>
      </div>
    </section>
  );
}
