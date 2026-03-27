'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Link as LinkIcon, Loader2 } from 'lucide-react';

type GovLinkItem = {
  id?: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category?: string;
  order?: number;
};

/** Shown if API is empty or fails — top 3 essentials only */
const FALLBACK_LINKS: GovLinkItem[] = [
  { name: 'Aadhaar Official', url: 'https://uidai.gov.in/', icon: '🔐' },
  { name: 'PAN Card (NSDL)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', icon: '💳' },
  { name: 'Voter ID (NVSP)', url: 'https://www.nvsp.in/', icon: '🗳️' },
];

/** Public page par sirf itne links dikhenge (order ke baad) */
const MAX_PUBLIC_GOV_LINKS = 3;

function sortLinks(a: GovLinkItem, b: GovLinkItem) {
  const oa = a.order ?? 0;
  const ob = b.order ?? 0;
  if (oa !== ob) return oa - ob;
  return a.name.localeCompare(b.name);
}

export default function QuickLinks() {
  const [links, setLinks] = useState<GovLinkItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/government-links?active=true', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.links) && data.links.length > 0) {
          const mapped: GovLinkItem[] = data.links.map(
            (L: { id?: string; name: string; url: string; icon?: string; description?: string; category?: string; order?: number }) => ({
              id: L.id,
              name: L.name,
              url: L.url,
              icon: L.icon || '🔗',
              description: L.description,
              category: L.category,
              order: L.order,
            }),
          );
          setLinks(mapped.sort(sortLinks));
        } else if (!cancelled) {
          setLinks(FALLBACK_LINKS);
        }
      } catch {
        if (!cancelled) setLinks(FALLBACK_LINKS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayLinks = (links ?? FALLBACK_LINKS).slice(0, MAX_PUBLIC_GOV_LINKS);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-blue-100 dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-black/40">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <LinkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" aria-hidden />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-zinc-100">
                Important Government Links
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-zinc-400">
              महत्वपूर्ण सरकारी लिंक - Official Government Portals
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-zinc-400">
              <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mb-3" aria-hidden />
              <p className="text-sm">लोड हो रहा है…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {displayLinks.map((link, index) => (
                <a
                  key={link.id || `${link.url}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white border-2 border-blue-100 rounded-lg hover:border-blue-400 hover:shadow-lg transition transform hover:scale-[1.02] group dark:from-zinc-800/80 dark:to-zinc-900 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:shadow-blue-950/30"
                >
                  <span className="text-2xl sm:text-3xl flex-shrink-0 leading-none" aria-hidden>
                    {link.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {link.name}
                    </h3>
                    {link.description ? (
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 line-clamp-2">{link.description}</p>
                    ) : null}
                    {link.category && link.category !== 'General' ? (
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wide text-blue-600/80 dark:text-blue-400/90">
                        {link.category}
                      </span>
                    ) : null}
                  </div>
                  <ExternalLink
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex-shrink-0 mt-0.5"
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/60">
            <p className="text-sm sm:text-base text-gray-700 dark:text-zinc-300 text-center">
              <strong>Note:</strong> These are official government portals. Always verify the URL before entering any personal information.
              <br />
              <span className="text-gray-600 dark:text-zinc-400">ये आधिकारिक सरकारी पोर्टल हैं। कोई भी व्यक्तिगत जानकारी दर्ज करने से पहले URL को हमेशा सत्यापित करें।</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
