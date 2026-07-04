import Link from 'next/link'
import { CheckCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react'
import type { WebsiteBuildService } from '@/lib/seo/website-build-services'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { INDIA_STATES } from '@/lib/seo/india-locations'

const WHATSAPP = 'https://wa.me/917895094129'

export default function WebsiteBuildServiceLanding({ service }: { service: WebsiteBuildService }) {
  const waText = encodeURIComponent(
    `Hello, I need ${service.name} for my business. Please share price and timeline.`
  )

  return (
    <>
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-950 to-indigo-950 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">{service.hindi}</p>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">{service.headline}</h1>
          <p className="text-lg text-blue-100 max-w-3xl mb-8 leading-relaxed">{service.description}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-black hover:bg-green-600 transition"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp — Free Quote
            </a>
            <a href="tel:9193898182" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-black text-slate-900">
              <Phone className="h-5 w-5" /> Call Now
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-4">Package me kya shamil hai</h2>
              <ul className="space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-4">Kiske liye best hai?</h2>
              <div className="flex flex-wrap gap-2">
                {service.idealFor.map((item) => (
                  <span key={item} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Kaise banega — step by step</h2>
            <ol className="space-y-3">
              {service.process.map((step, i) => (
                <li key={step} className="flex gap-3 text-slate-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-black mb-4">Detail me — {service.name} kyun zaroori hai?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{service.description}</p>
            <p className="text-slate-700 leading-relaxed">
              Jan Seva Kendra poore India me {service.name.toLowerCase()} deliver karta hai — Etawah se lekar Delhi,
              Mumbai, Bangalore tak. Aap WhatsApp par apni requirement bhejein: business type, kitne pages chahiye,
              koi reference website, aur budget range. Hum same day ya next day quote dete hain. Payment flexible —
              advance ke baad kaam start, delivery ke baad balance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">FAQ</h2>
            {service.faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border p-5">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-black mb-3">Industry-wise pages</h2>
            <div className="flex flex-wrap gap-2">
              {WEBSITE_INDUSTRIES.slice(0, 8).map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/website-for/${ind.slug}`}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  {ind.name} →
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black mb-3">Top states — local pages</h2>
            <div className="flex flex-wrap gap-2">
              {INDIA_STATES.slice(0, 12).map((st) => (
                <Link
                  key={st.slug}
                  href={`/website/${st.slug}`}
                  className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
                >
                  {st.name}
                </Link>
              ))}
              <Link href="/website-sitemap" className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                All India <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
