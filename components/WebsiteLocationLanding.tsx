import WebsiteLongSeoContent from './WebsiteLongSeoContent'
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

type WebsiteLocationLandingProps = {
  stateName: string
  stateSlug: string
  districtName?: string
  districtSlug?: string
}

const baseUrl = 'https://www.jan-seva.site'
const whatsappHref = 'https://wa.me/917895094129'

export default function WebsiteLocationLanding({
  stateName,
  stateSlug,
  districtName,
  districtSlug,
}: WebsiteLocationLandingProps) {
  const locationLabel = districtName ? `${districtName}, ${stateName}` : stateName
  const pagePath = districtSlug
    ? `/website/${stateSlug}/${districtSlug}`
    : `/website/${stateSlug}`
  const waText = encodeURIComponent(
    `Hello, I need website/software development in ${locationLabel}. Please share quote.`
  )

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Jan Seva Kendra Website Development ${locationLabel}`,
    description: `Website development, software, mobile app, logo and digital marketing services for businesses in ${locationLabel}, India.`,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: locationLabel,
    },
    url: `${baseUrl}${pagePath}`,
    telephone: ['+919193898182', '+917895094129'],
    serviceType: [
      'Website Development',
      'Custom Software Development',
      'Mobile App Development',
      'SEO Services',
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Website banwane wala ${locationLabel} mein kaun best hai?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Jan Seva Kendra ${locationLabel} ke businesses ke liye affordable business website, e-commerce website, custom software aur mobile app banata hai. Call 9193898182 ya WhatsApp 7895094129.`,
        },
      },
      {
        '@type': 'Question',
        name: `Software development company in ${locationLabel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Billing software, school management, booking system, admin panel aur business automation — ${locationLabel} se poore India mein delivery. Free consultation available.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-blue-100 mb-4">
            <MapPin className="h-3.5 w-3.5" />
            {locationLabel}, India
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            Website & Software Development in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-emerald-300">
              {locationLabel}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-3xl mb-6 leading-relaxed">
            {locationLabel} ke shops, coaching, schools, offices aur startups ke liye professional website,
            custom software, mobile app aur SEO. All India delivery — local business ko online customers dilwayein.
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
              href="/digital-services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10 transition"
            >
              All Digital Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe2, title: 'Business Website', desc: 'Shop, coaching, company site' },
              { icon: Code2, title: 'Custom Software', desc: 'Billing, CRM, management' },
              { icon: MonitorSmartphone, title: 'Mobile App', desc: 'Android business apps' },
              { icon: Search, title: 'SEO & Marketing', desc: 'Google ranking & leads' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <item.icon className="h-6 w-6 text-yellow-300 mb-2" />
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-blue-100 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
            {locationLabel} ke liye kya banate hain?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Business / Company Website',
              'E-commerce Online Store',
              'Coaching & School Website',
              'Hospital / Clinic Website',
              'Restaurant & Hotel Website',
              'Billing & Inventory Software',
              'School Management Software',
              'Booking & Appointment System',
              'Logo, Banner & Social Media Design',
              'Video Editing & YouTube Reels',
              'Game & Learning App Development',
              'WhatsApp Lead & CRM Automation',
            ].map((service) => (
              <div key={service} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800">{service}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
            <div className="flex items-start gap-3">
              <Rocket className="h-8 w-8 text-yellow-300 shrink-0" />
              <div>
                <h3 className="text-xl font-black mb-2">
                  {districtName ? `${districtName} business` : `${stateName} businesses`} — online customers paaiye
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                  Aaj hi WhatsApp karein — requirement bataiye, free quote milega. Fast delivery, mobile-friendly
                  design, Hindi + English content, affordable pricing for {locationLabel}.
                </p>
                <a
                  href={`${whatsappHref}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-50 transition"
                >
                  Start Project on WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link href="/website-sitemap" className="font-bold text-indigo-600 hover:underline">
              ← All India Website Sitemap
            </Link>
            {!districtName && (
              <Link href={`/website/${stateSlug}`} className="font-bold text-indigo-600 hover:underline">
                {stateName} districts →
              </Link>
            )}
            {districtName && (
              <Link href={`/website/${stateSlug}`} className="font-bold text-indigo-600 hover:underline">
                ← All districts in {stateName}
              </Link>
            )}
          </div>
        </div>
      </section>

      <WebsiteLongSeoContent
        stateName={stateName}
        stateSlug={stateSlug}
        districtName={districtName}
        districtSlug={districtSlug}
      />
    </>
  )
}
