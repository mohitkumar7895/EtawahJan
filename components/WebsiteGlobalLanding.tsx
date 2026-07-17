import WebsiteGlobalLongSeoContent from './WebsiteGlobalLongSeoContent'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Code2,
  Globe2,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  Rocket,
  Search,
} from 'lucide-react'

type WebsiteGlobalLandingProps = {
  countryName: string
  countrySlug: string
  countryCode: string
  cityName?: string
  citySlug?: string
}

const baseUrl = 'https://www.jan-seva.site'
const whatsappHref = 'https://wa.me/917895094129'

export default function WebsiteGlobalLanding({
  countryName,
  countrySlug,
  countryCode,
  cityName,
  citySlug,
}: WebsiteGlobalLandingProps) {
  const locationLabel = cityName ? `${cityName}, ${countryName}` : countryName
  const pagePath = citySlug
    ? `/website-world/${countrySlug}/${citySlug}`
    : `/website-world/${countrySlug}`
  const waText = encodeURIComponent(
    `Hello, I need website/software development in ${locationLabel}. Please share quote and timeline.`
  )

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Jan Seva Kendra Website Development — ${locationLabel}`,
    description: `Affordable website development, custom software, mobile apps, e-commerce and SEO for businesses in ${locationLabel}. Remote delivery worldwide.`,
    areaServed: {
      '@type': 'Country',
      name: countryName,
    },
    url: `${baseUrl}${pagePath}`,
    telephone: ['+919193898182', '+917895094129'],
    serviceType: [
      'Website Development',
      'Custom Software Development',
      'Mobile App Development',
      'E-Commerce Development',
      'SEO Services',
    ],
    priceRange: '$$',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Who builds websites for businesses in ${locationLabel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Jan Seva Kendra builds professional business websites, e-commerce stores, mobile apps and custom software for ${locationLabel} clients. Remote delivery via WhatsApp +7895094129 and video calls.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does a website cost in ${locationLabel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Packages start from affordable business sites to full e-commerce. WhatsApp your requirements to 7895094129 for a free custom quote for ${locationLabel}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do you work with ${countryName} clients remotely?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — we serve ${countryName} and 55+ countries worldwide. English communication, secure payments, milestone delivery.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-violet-100 mb-4">
            <Globe2 className="h-3.5 w-3.5" />
            {locationLabel} · {countryCode} · Worldwide Delivery
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            #1 Website & Software Development in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-emerald-300">
              {locationLabel}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-violet-100 max-w-3xl mb-6 leading-relaxed">
            Top-rated web development for {locationLabel} businesses — professional websites, e-commerce stores,
            mobile apps & custom software. Save 50–70% vs local agencies. More Google customers · WhatsApp leads ·
            Fast delivery. Trusted in USA, Russia, UK, UAE & 65+ countries.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href={`${whatsappHref}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-black hover:bg-green-600 transition"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Quote — 7895094129
            </a>
            <a
              href="tel:9193898182"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 font-black text-slate-900 hover:bg-yellow-300 transition"
            >
              <Phone className="h-5 w-5" />
              Call 9193898182
            </a>
            <Link
              href="/build-website"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10 transition"
            >
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: MonitorSmartphone, label: 'Business Website' },
              { icon: Code2, label: 'Custom Software' },
              { icon: Rocket, label: 'Mobile Apps' },
              { icon: Search, label: 'SEO & Google' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur"
              >
                <Icon className="h-6 w-6 mx-auto text-yellow-300 mb-1" />
                <span className="text-xs font-bold text-blue-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Why {locationLabel} businesses choose Jan Seva Kendra
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              `Affordable rates vs local ${countryName} agencies — same quality, lower cost`,
              'English + Hindi support — clear communication on WhatsApp & video call',
              'Fast delivery: business websites in 5–14 days, apps in 2–6 weeks',
              'WhatsApp lead buttons, Google SEO, mobile-first design included',
              'E-commerce, booking systems, billing software, admin panels',
              'Serving USA, Russia, UK, Canada, UAE, Europe, Asia & Africa',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-slate-700">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WebsiteGlobalLongSeoContent
        countryName={countryName}
        countrySlug={countrySlug}
        cityName={cityName}
        citySlug={citySlug}
      />
    </>
  )
}
