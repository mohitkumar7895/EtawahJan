import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Phone,
} from 'lucide-react'
import type { WebsiteIndustry } from '@/lib/seo/website-industries'
import type { StateLocation } from '@/lib/seo/india-locations'
import type { WorldCountry } from '@/lib/seo/world-locations'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

const WHATSAPP = 'https://wa.me/917895094129'

type Props = {
  industry: WebsiteIndustry
  state?: StateLocation
  country?: WorldCountry
}

export default function WebsiteIndustryLanding({ industry, state, country }: Props) {
  const location = country
    ? country.name
    : state
      ? `${state.name}, India`
      : 'All India'
  const waText = encodeURIComponent(
    `Hello, I need ${industry.name} website in ${location}. Please share quote and timeline.`
  )

  return (
    <>
      <section className="py-12 sm:py-16 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-3">
            {industry.hindi} · {location}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            {industry.name} Website Development
            {country ? ` in ${country.name}` : state ? ` in ${state.name}` : ' — All India'}
          </h1>
          <p className="text-lg text-violet-100 mb-2 font-semibold">{industry.tagline}</p>
          <p className="text-base text-slate-300 max-w-3xl mb-8 leading-relaxed">
            Jan Seva Kendra builds professional {industry.name.toLowerCase()} websites —
            mobile-friendly, WhatsApp leads, Google SEO ready.{' '}
            {country
              ? `Serving ${country.name} & worldwide clients remotely.`
              : state
                ? `${state.name} ke business owners ke liye affordable pricing.`
                : 'Poore India & 55+ countries ke business owners ke liye affordable pricing.'}{' '}
            WhatsApp today for free quote.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-black hover:bg-green-600 transition"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Quote
            </a>
            <a href="tel:9193898182" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-black text-slate-900">
              <Phone className="h-5 w-5" /> 9193898182
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Website me kya-kya milega?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {industry.features.map((f) => (
                <div key={f} className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-800">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Fayde — customers kaise badhenge?</h2>
            <ul className="space-y-3">
              {industry.benefits.map((b) => (
                <li key={b} className="text-slate-700 leading-relaxed pl-4 border-l-4 border-indigo-500">
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 sm:p-8 border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-4">Long answer — {industry.name} ko website kyun chahiye?</h2>
            <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
              <p>
                Aaj kal {industry.name.toLowerCase()} ka customer pehle Google par search karta hai. Agar aapki website
                nahi hai to wo competitor ke paas chala jata hai. Ek professional website se aap 24 ghante open rehte
                hain — raat ko bhi enquiry WhatsApp par aa sakti hai.
              </p>
              <p>
                Hum {location} ke liye {industry.name.toLowerCase()} specialized pages banate hain: fast loading,
                mobile-first design, Hindi + English content, aur WhatsApp button jo seedha lead banata hai. SEO setup
                se &quot;{industry.name.toLowerCase()} near me&quot; jaise searches me aap dikhenge.
              </p>
              <p>
                Package me usually 5-15 pages, contact forms, photo gallery, services list, aur Google Maps shamil hota
                hai. Advanced features jaise online payment, booking system, ya admin panel bhi add kar sakte hain.
                Budget batayein — hum uske hisaab se best solution suggest karenge.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">FAQ</h2>
            <div className="space-y-4">
              {industry.faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {state && (
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-4">{state.name} — top districts</h2>
              <div className="flex flex-wrap gap-2">
                {state.districts.slice(0, 20).map((d) => (
                  <Link
                    key={d.slug}
                    href={`/website/${state.slug}/${d.slug}`}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
                  >
                    {d.name}
                  </Link>
                ))}
                {state.districts.length > 20 && (
                  <Link href={`/website/${state.slug}`} className="text-xs font-bold text-indigo-600 hover:underline px-2">
                    +{state.districts.length - 20} more →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-black text-slate-900 mb-3">Related services</h2>
            <div className="flex flex-wrap gap-2">
              {WEBSITE_BUILD_SERVICES.slice(0, 6).map((s) => (
                <Link
                  key={s.slug}
                  href={`/build-website/${s.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:border-indigo-400"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-bold">
            <Link href={`/website-for/${industry.slug}`} className="text-indigo-600 hover:underline">
              All India {industry.name} page
            </Link>
            <Link href="/website-sitemap" className="text-indigo-600 hover:underline">
              All India sitemap →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
