import Link from 'next/link'
import { MessageCircle, Phone, CheckCircle, TrendingUp } from 'lucide-react'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'
import {
  getIndiaFaqs,
  GLOBAL_PROCESS_STEPS,
  PHONE,
  WHATSAPP,
  WHATSAPP_LINK,
} from '@/lib/seo/website-seo-copy'

type Props = {
  stateName: string
  stateSlug: string
  districtName?: string
  districtSlug?: string
}

export default function WebsiteLongSeoContent({
  stateName,
  stateSlug,
  districtName,
  districtSlug,
}: Props) {
  const location = districtName ? `${districtName}, ${stateName}` : stateName
  const wa = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    `Hello, mujhe ${location} ke liye website/software chahiye. Free quote bhejein.`
  )}`

  const longFaqs = getIndiaFaqs(location, stateName)

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
              {location} Me #1 Website Banwana & Software Company — Poori Guide
            </h2>

            <div className="text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base not-prose">
              <p>
                Kya aap <strong>{location}</strong> me rehte hain aur apne business ke liye <strong>website banwana</strong>{' '}
                chahte hain? Jan Seva Kendra aapke liye best digital partner hai — professional website design, mobile
                app, billing software, e-commerce store aur Google SEO. Hum sirf ek page nahi banate; poora online
                business setup karte hain taaki aapke <strong>customers badhein</strong> aur Google par top par aayein.
              </p>
              <p>
                <strong>{districtName || stateName}</strong> ke coaching institutes, schools, clinics, restaurants,
                shops, real estate dealers, manufacturers — sab ko aaj website chahiye. Customer pehle Google par
                &quot;website development {districtName || stateName} near me&quot; search karta hai. Bina website aap
                invisible ho jaate hain — roz leads haath se jaati hain.
              </p>
              <p>
                <strong>Kyun Jan Seva Kendra?</strong> Affordable price, fast delivery (5–10 din me basic website),
                WhatsApp lead button har site par, mobile-friendly design, aur local SEO jo &quot;website banwana{' '}
                {location}&quot; search me rank karaye. India ke 780+ cities aur USA, Russia, UK me bhi clients hain.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">
                {location} ke liye popular services
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Business website — 5–15 pages, WhatsApp button, contact form</li>
                <li>E-commerce — online dukan, Razorpay/UPI, product catalog</li>
                <li>Coaching / school website — admission form, courses, results</li>
                <li>Clinic website — doctor profile, appointment booking</li>
                <li>Billing & GST software — dukan, warehouse, office ke liye</li>
                <li>Android/iOS mobile app — delivery, booking, services</li>
                <li>Google SEO — {stateName} local keywords target</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Website banne ka process — 5 steps
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GLOBAL_PROCESS_STEPS.map((s) => (
                  <div key={s.step} className="rounded-xl bg-white border p-4">
                    <span className="font-black text-indigo-600">{s.step}.</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{s.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{s.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                {[
                  '780+ India cities + 65 countries worldwide delivery',
                  'Same day free quote on WhatsApp',
                  '50% advance, 50% delivery — transparent pricing',
                  'Video call support — face-to-face meeting not required',
                  '1000+ websites & software projects delivered',
                ].map((p) => (
                  <div key={p} className="flex gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {p}
                  </div>
                ))}
              </div>

              <p className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm">
                <strong>Aaj hi shuru karein:</strong> WhatsApp <strong>{WHATSAPP}</strong> par likhein — business name,
                kya banwana hai (website/app/software), location ({location}). 24 ghante me jawab. Call{' '}
                <strong>{PHONE}</strong>.
              </p>
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-10 mb-4 not-prose">
              {location} — Website & Software FAQs
            </h3>
            <div className="space-y-4 not-prose">
              {longFaqs.map((faq) => (
                <div key={faq.q} className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">{faq.q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="not-prose mt-10 grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-black text-slate-900 mb-3">Industry pages — {stateName}</h3>
                <div className="flex flex-wrap gap-2">
                  {WEBSITE_INDUSTRIES.map((ind) => (
                    <Link
                      key={ind.slug}
                      href={districtSlug ? `/website-for/${ind.slug}/${stateSlug}` : `/website-for/${ind.slug}`}
                      className="rounded-lg bg-white border px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 mb-3">Service pages</h3>
                <div className="flex flex-wrap gap-2">
                  {WEBSITE_BUILD_SERVICES.map((svc) => (
                    <Link
                      key={svc.slug}
                      href={`/build-website/${svc.slug}`}
                      className="rounded-lg bg-white border px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50"
                    >
                      {svc.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="not-prose mt-10 flex flex-col sm:flex-row gap-3 justify-center p-8 rounded-2xl bg-indigo-600 text-white text-center">
              <div className="flex-1">
                <p className="font-black text-lg">{location} — Customers Badhao, Aaj Hi WhatsApp Karein</p>
                <p className="text-indigo-200 text-sm mt-1">Free quote · Professional website · Google SEO</p>
              </div>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-black hover:bg-green-600">
                <MessageCircle className="h-5 w-5" /> WhatsApp {WHATSAPP}
              </a>
              <a href={`tel:${PHONE}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-900">
                <Phone className="h-5 w-5" /> Call
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
