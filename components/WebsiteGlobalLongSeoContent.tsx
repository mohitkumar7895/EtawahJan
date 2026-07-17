import Link from 'next/link'
import { MessageCircle, Phone, CheckCircle, TrendingUp } from 'lucide-react'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'
import {
  getGlobalFaqs,
  GLOBAL_PROCESS_STEPS,
  GLOBAL_TRUST_POINTS,
  PHONE,
  WHATSAPP,
  WHATSAPP_LINK,
} from '@/lib/seo/website-seo-copy'

type Props = {
  countryName: string
  countrySlug: string
  cityName?: string
  citySlug?: string
}

export default function WebsiteGlobalLongSeoContent({
  countryName,
  countrySlug,
  cityName,
  citySlug,
}: Props) {
  const location = cityName ? `${cityName}, ${countryName}` : countryName
  const wa = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    `Hello, I want website/software development in ${location}. Please send free quote.`
  )}`

  const longFaqs = getGlobalFaqs(location, countryName)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: longFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 not-prose mb-6">
              #1 Website Development Company in {location} — Complete Guide 2026
            </h2>

            <div className="text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base not-prose">
              <p>
                Searching for the <strong>best website developer in {location}</strong>? You are in the right place.
                Jan Seva Kendra is a trusted remote web development team serving <strong>{countryName}</strong> and
                65+ countries worldwide. We build high-converting business websites, e-commerce stores, mobile apps
                (Android & iOS), billing software, booking systems and complete SEO — so your business gets{' '}
                <strong>more customers from Google</strong>.
              </p>
              <p>
                Whether you are a startup in <strong>{cityName || countryName}</strong>, a local shop, restaurant,
                clinic, real estate agency, coaching center or enterprise — customers search online before they buy.
                If you are not on page 1 of Google, you lose money every day. Our websites are built to rank, load fast
                on mobile, and turn visitors into WhatsApp leads and phone calls.
              </p>
              <p>
                <strong>Why {countryName} businesses choose us over local agencies:</strong> Same professional quality
                at 50–70% lower cost. Faster delivery. Direct communication with developers on WhatsApp{' '}
                <strong>{WHATSAPP}</strong>. No outsourcing chain, no hidden fees. We have delivered 1000+ websites and
                software projects for clients in USA, Russia, UK, UAE, Canada, Australia, Europe and Asia.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">
                Website & software services in {location}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Business website</strong> — 5–20 pages, services, gallery, contact, WhatsApp button</li>
                <li><strong>E-commerce store</strong> — products, cart, payments, order alerts for {location}</li>
                <li><strong>Mobile app</strong> — Android & iOS for delivery, booking, e-commerce</li>
                <li><strong>Custom software</strong> — billing, CRM, inventory, admin panels, SaaS dashboards</li>
                <li><strong>SEO & Google ranking</strong> — optimized for &quot;website development {location}&quot;</li>
                <li><strong>Logo & branding</strong> — professional identity for {countryName} market</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Our 5-step process for {location} clients
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GLOBAL_PROCESS_STEPS.map((s) => (
                  <div key={s.step} className="rounded-xl bg-white border p-4">
                    <span className="font-black text-indigo-600 text-lg">{s.step}.</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{s.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{s.text}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Why trust Jan Seva Kendra?</h3>
              <div className="space-y-2">
                {GLOBAL_TRUST_POINTS.map((p) => (
                  <div key={p} className="flex gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {p}
                  </div>
                ))}
              </div>

              <p className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm">
                <strong>Start today:</strong> WhatsApp <strong>{WHATSAPP}</strong> with your business name and what you
                need. Example: &quot;I need e-commerce website for my shop in {location}&quot;. Free quote within 24
                hours. Call <strong>{PHONE}</strong> for urgent projects.
              </p>
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-10 mb-3 not-prose">
              {location} — Website Development FAQs (10 Questions)
            </h3>
            <div className="space-y-4 not-prose">
              {longFaqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{f.q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-10 mb-3 not-prose">
              Industries we serve in {countryName}
            </h3>
            <div className="flex flex-wrap gap-2 not-prose mb-8">
              {WEBSITE_INDUSTRIES.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/website-for/${ind.slug}/world/${countrySlug}`}
                  className="rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-800 hover:bg-violet-200"
                >
                  {ind.name} — {countryName}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 not-prose mb-10">
              {WEBSITE_BUILD_SERVICES.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/build-website/${svc.slug}`}
                  className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-200"
                >
                  {svc.name}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-900 text-white p-8 text-center not-prose">
              <p className="font-black text-xl mb-2">Get More Customers in {location} — Free Quote</p>
              <p className="text-sm text-violet-200 mb-4">Join 1000+ businesses worldwide · Reply within hours</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-black hover:bg-green-600">
                  <MessageCircle className="h-5 w-5" /> WhatsApp {WHATSAPP}
                </a>
                <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-slate-900 px-8 py-4 font-black">
                  <Phone className="h-5 w-5" /> Call {PHONE}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
