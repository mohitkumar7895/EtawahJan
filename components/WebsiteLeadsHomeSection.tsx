import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Globe2,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from 'lucide-react'
import { INDIA_STATES } from '@/lib/seo/india-locations'
import { WEBSITE_INDUSTRIES } from '@/lib/seo/website-industries'
import { WEBSITE_BUILD_SERVICES } from '@/lib/seo/website-build-services'

const TOP_CITIES = [
  { label: 'Delhi', href: '/website/delhi/new-delhi' },
  { label: 'Mumbai', href: '/website/maharashtra/mumbai-city' },
  { label: 'Bangalore', href: '/website/karnataka/bengaluru-urban' },
  { label: 'Hyderabad', href: '/website/telangana/hyderabad' },
  { label: 'Chennai', href: '/website/tamil-nadu/chennai' },
  { label: 'Kolkata', href: '/website/west-bengal/kolkata' },
  { label: 'Pune', href: '/website/maharashtra/pune' },
  { label: 'Lucknow', href: '/website/uttar-pradesh/lucknow' },
  { label: 'Jaipur', href: '/website/rajasthan/jaipur' },
  { label: 'Ahmedabad', href: '/website/gujarat/ahmedabad' },
  { label: 'Kanpur', href: '/website/uttar-pradesh/kanpur-nagar' },
  { label: 'Etawah', href: '/website/uttar-pradesh/etawah' },
]

export default function WebsiteLeadsHomeSection() {
  const wa = `https://wa.me/917895094129?text=${encodeURIComponent(
    'Hello, mujhe apne business ke liye website banwana hai. Free quote chahiye.'
  )}`

  return (
    <section className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-14 sm:py-20 border-y border-white/10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-xs font-bold text-yellow-300 mb-4">
            <Sparkles className="h-4 w-4" />
            All India Website & Software — Get More Customers Online
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            Apni Website Banvaiye —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-300">
              Customers Badhao
            </span>
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Chahe aap {INDIA_STATES.length} states me se kahi bhi hon — hum business website, e-commerce store,
            billing software, mobile app aur SEO banate hain. WhatsApp par requirement bhejein, same day free quote.
            Koi form nahi — seedha baat, seedha kaam.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 text-base font-black hover:bg-green-600 transition shadow-xl shadow-green-500/30"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp — Website Quote (7895094129)
          </a>
          <a
            href="tel:9193898182"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 text-base font-black text-slate-900 hover:bg-yellow-300 transition"
          >
            <Phone className="h-5 w-5" />
            Call 9193898182
          </a>
          <Link
            href="/website-sitemap"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 font-bold hover:bg-white/10 transition"
          >
            <Globe2 className="h-5 w-5" />
            All India Cities
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Popular Cities
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20 transition"
                >
                  {city.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-black mb-4">Business Type — Website</h3>
            <div className="space-y-2">
              {WEBSITE_INDUSTRIES.slice(0, 8).map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/website-for/${ind.slug}`}
                  className="flex items-center justify-between text-sm font-semibold text-blue-100 hover:text-white group"
                >
                  <span>{ind.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
              <Link href="/website-for/coaching-institute" className="text-xs font-bold text-yellow-300 hover:underline">
                + {WEBSITE_INDUSTRIES.length} industries →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-black mb-4">Kya Banwana Hai?</h3>
            <div className="space-y-2">
              {WEBSITE_BUILD_SERVICES.slice(0, 8).map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/build-website/${svc.slug}`}
                  className="flex items-center justify-between text-sm font-semibold text-blue-100 hover:text-white group"
                >
                  <span>{svc.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-400/30 p-6 sm:p-8">
          <h3 className="text-xl font-black mb-4 text-center">Website banwane ka simple process</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'WhatsApp par idea bhejein',
              'Free quote same day',
              'Design + development',
              'Launch — customers aana shuru',
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3 rounded-xl bg-black/20 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-slate-900">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold leading-snug">{step}</span>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm text-blue-100">
            {[
              'Mobile-friendly — phone par perfect dikhe',
              'WhatsApp button — seedha enquiry',
              'Google SEO — search me dikhe',
              'Hindi + English content',
              'Affordable packages — chhoti dukan se bada business',
              'All India delivery — location koi bhi ho',
            ].map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <Link
              href="/digital-services"
              className="inline-flex items-center gap-2 font-black text-yellow-300 hover:text-yellow-200 transition"
            >
              Saari digital services dekhein <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-blue-200/80 flex items-center justify-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Serving all {INDIA_STATES.length} states & UTs · 780+ district pages · WhatsApp 7895094129
        </p>
      </div>
    </section>
  )
}
