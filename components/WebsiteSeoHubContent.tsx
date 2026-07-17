import Link from 'next/link'
import { Globe2, MapPin, MessageCircle, Phone, Star, TrendingUp } from 'lucide-react'
import {
  GLOBAL_PROCESS_STEPS,
  GLOBAL_TRUST_POINTS,
  PHONE,
  TOP_GLOBAL_SEARCHES,
  TOP_INDIA_SEARCHES,
  WHATSAPP,
  WHATSAPP_LINK,
} from '@/lib/seo/website-seo-copy'
import { WORLD_SITEMAP_STATS } from '@/lib/seo/world-locations'
import { WEBSITE_SITEMAP_STATS } from '@/lib/seo/india-locations'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

export default function WebsiteSeoHubContent() {
  const wa = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    'Hello, I want to build a website for my business. Please send free quote and timeline.'
  )}`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is the best website development company in India and worldwide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Jan Seva Kendra builds professional websites, e-commerce stores, mobile apps and custom software for India (${WEBSITE_SITEMAP_STATS.districts}+ cities) and 65+ countries including USA, Russia, UK, UAE. WhatsApp ${WHATSAPP} for free quote.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a business website cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Affordable packages from basic 5-page business sites to full e-commerce. India clients save vs big agencies; international clients save 50–70% vs local developers. WhatsApp for custom quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work with USA, Russia and UK clients?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — remote delivery worldwide. Dedicated SEO pages for ${WORLD_SITEMAP_STATS.cities}+ global cities. English support, milestone payments.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="bg-white py-14 px-4 border-t border-slate-200">
        <div className="container mx-auto max-w-5xl space-y-12">
          <article>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              #1 Website Development Company — India + USA + Russia + 65 Countries
            </h2>
            <div className="text-slate-700 space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Jan Seva Kendra</strong> aapke business ke liye professional website, e-commerce store,
                mobile app aur custom software banata hai — chahe aap <strong>India</strong> me ho (780+ cities) ya{' '}
                <strong>USA, Russia, UK, UAE, Canada, Australia</strong> me. Hum affordable price par top-quality
                digital products deliver karte hain jisse aapke <strong>customers badhte hain</strong> aur Google par
                rank milta hai.
              </p>
              <p>
                Aaj kal har customer pehle Google par search karta hai — &quot;website development near me&quot;,
                &quot;best web designer&quot;, &quot;software company&quot;. Agar aapki website nahi hai, to har din
                leads haath se nikal jaati hain. Hum yeh fix karte hain: mobile-friendly design, WhatsApp enquiry
                button, fast loading speed, aur SEO jo Google top results me laane me madad karta hai.
              </p>
              <p>
                <strong>Kyun choose karein?</strong> Local agencies mehenge hote hain. Hum India-based expert team hain
                — international clients ko 50–70% bachat, Indian clients ko best value. Direct developer se baat,
                koi agent nahi, koi chhupi fees nahi.
              </p>
            </div>
          </article>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOBAL_TRUST_POINTS.map((point) => (
              <div key={point} className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <Star className="h-5 w-5 text-yellow-500 shrink-0" />
                <span className="text-slate-800 font-medium">{point}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              How we build your website — 5 simple steps
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {GLOBAL_PROCESS_STEPS.map((s) => (
                <div key={s.step} className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                  <span className="text-2xl font-black text-indigo-600">{s.step}</span>
                  <h4 className="font-bold text-slate-900 mt-2 text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-violet-600" /> Global searches we rank for
              </h3>
              <div className="flex flex-wrap gap-2">
                {TOP_GLOBAL_SEARCHES.map((s) => (
                  <Link key={s.q} href={s.href} className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-800 hover:bg-violet-200">
                    {s.q}
                  </Link>
                ))}
              </div>
              <Link href="/website-world" className="inline-block mt-3 text-sm font-bold text-violet-700 hover:underline">
                All {WORLD_SITEMAP_STATS.countries} countries →
              </Link>
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" /> India searches we rank for
              </h3>
              <div className="flex flex-wrap gap-2">
                {TOP_INDIA_SEARCHES.map((s) => (
                  <Link key={s.q} href={s.href} className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-200">
                    {s.q}
                  </Link>
                ))}
              </div>
              <Link href="/website-sitemap" className="inline-block mt-3 text-sm font-bold text-indigo-700 hover:underline">
                All India {WEBSITE_SITEMAP_STATS.districts}+ districts →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 mb-4">Services — kya banate hain?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {WEBSITE_BUILD_SERVICES.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/build-website/${svc.slug}`}
                  className="rounded-xl border p-4 hover:border-indigo-300 hover:shadow-md transition"
                >
                  <p className="font-black text-slate-900">{svc.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{svc.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white p-8 text-center">
            <p className="text-2xl font-black mb-2">Ready to get more customers online?</p>
            <p className="text-violet-200 text-sm mb-6">Free quote · No obligation · Reply within hours</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-black hover:bg-green-600">
                <MessageCircle className="h-5 w-5" /> WhatsApp {WHATSAPP}
              </a>
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-slate-900 px-8 py-4 font-black">
                <Phone className="h-5 w-5" /> Call {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
