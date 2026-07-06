import Link from 'next/link';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import {
  MAIN_TOOL_LINKS,
  POPULAR_TOOL_SEARCHES,
  SEO_TOOLS,
  FILE_CONVERTER_SUB_TOOLS,
} from '@/lib/seo/tools-catalog';

const CATEGORY_HEADINGS: Record<string, string> = {
  pdf: 'PDF Tools — Edit, Convert, Merge',
  image: 'Photo & Image Tools',
  document: 'Application & Document Tools',
  finance: 'Cash & Finance Tools',
  career: 'Resume & Career Tools',
  utility: 'All-in-One Hub',
};

export default function ToolsSeoContent() {
  const toolsExcludingHub = SEO_TOOLS.filter((t) => t.slug !== 'tools');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: toolsExcludingHub[0]?.faqs.slice(0, 4).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })) ?? [],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="bg-white border-t border-slate-200 py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">
          {/* Popular searches */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              <Search className="h-7 w-7 text-blue-600" />
              Popular searches — seedha tool kholo
            </h2>
            <p className="text-slate-600 mb-6 text-sm sm:text-base leading-relaxed">
              Google par sabse zyada search hone wale queries — photo 20KB, PDF merge, cash counter, resume builder,
              Hindi application letter. Sab free, koi login nahi.
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOOL_SEARCHES.map((item) => (
                <Link
                  key={`${item.path}-${item.query}`}
                  href={item.path}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-800 hover:bg-blue-100 hover:border-blue-300 transition"
                >
                  {item.query}
                </Link>
              ))}
            </div>
          </div>

          {/* All main tools by category */}
          <div>
            <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-slate-900 mb-6">
              <Sparkles className="h-7 w-7 text-indigo-600" />
              Saare free tools — category wise
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(CATEGORY_HEADINGS).map(([cat, heading]) => {
                const items = MAIN_TOOL_LINKS.filter((t) => t.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                    <h3 className="font-bold text-slate-900 mb-3">{heading}</h3>
                    <ul className="space-y-2">
                      {items.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={t.path}
                            className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            {t.label}
                          </Link>
                          {' · '}
                          <Link
                            href={`/guides/${t.slug}`}
                            className="text-xs text-slate-500 hover:text-rose-600"
                          >
                            Guide
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File converter sub-tools */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
              File Converter — {FILE_CONVERTER_SUB_TOOLS.length} sub-tools
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              PDF to JPG, merge PDF, compress PDF, JPG to PDF, watermark, protect — har converter ka apna SEO page hai.
            </p>
            <div className="flex flex-wrap gap-2">
              {FILE_CONVERTER_SUB_TOOLS.map((t) => (
                <Link
                  key={t.slug}
                  href={t.path}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-rose-300 hover:text-rose-700 transition"
                >
                  {t.title.split('—')[0].trim()}
                </Link>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/tools-sitemap" className="text-sm font-bold text-indigo-600 hover:underline">
                Complete tools sitemap →
              </Link>
            </p>
          </div>

          {/* Long-form SEO copy */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-xl font-black text-slate-900">
              Jan Seva Kendra Free Online Tools — India ke liye banaya gaya
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Chahe aap sarkari exam ke liye <strong>photo 20KB</strong> compress karna ho, dukan mein{' '}
              <strong>note counter</strong> chahiye, ya office mein <strong>PDF edit</strong> karna ho — humne sab
              tools ek jagah free rakhe hain. Koi app install nahi, koi payment nahi. Mobile aur computer dono pe
              chalega. Etawah, Bharthana se banaya — poora India use kar sakta hai.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-6">Kaun kaun use karta hai?</h3>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>CSC / Jan Seva Kendra operators — customer ka photo, PDF, application same counter pe</li>
              <li>Sarkari exam students — SSC, RRB, UP Police, Banking photo & signature size</li>
              <li>Shopkeepers & kirana — daily cash note ginti aur PDF receipt</li>
              <li>Job seekers — free resume builder + ATS check</li>
              <li>Office & college — PDF merge, edit, Hindi application letters</li>
            </ul>
          </article>

          {/* Guides CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-6 sm:p-8 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-yellow-300 mb-3" />
            <h2 className="text-xl sm:text-2xl font-black mb-2">Step-by-step guides — Hindi + English</h2>
            <p className="text-blue-100 text-sm max-w-xl mx-auto mb-5">
              Har tool ka detailed tutorial — kaise use karein, documents kya chahiye, FAQs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/guides"
                className="rounded-xl bg-yellow-400 text-slate-900 font-black px-6 py-3 text-sm hover:bg-yellow-300 transition"
              >
                All Tool Guides
              </Link>
              <Link
                href="/tools-sitemap"
                className="rounded-xl border border-white/30 font-bold px-6 py-3 text-sm hover:bg-white/10 transition"
              >
                Tools Sitemap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
