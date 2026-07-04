import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BadgeCheck,
  Brush,
  Code2,
  Film,
  Gamepad2,
  Globe2,
  Laptop,
  Megaphone,
  MonitorSmartphone,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from 'lucide-react'

const baseUrl = 'https://www.jan-seva.site'
const phoneNumber = '9193898182'
const whatsappNumber = '9193898182'
const whatsappHrefNumber = '9193898182'

export const metadata: Metadata = {
  title: 'Website, Software, Game, Logo & Video Editing Services in UP India',
  description:
    'Jan Seva Kendra provides website development, software development, logo design, video editing, game development, mobile app, graphics, SEO and digital marketing services for Etawah, Uttar Pradesh and all India customers. Call 9193898182 or WhatsApp 9193898182.',
  keywords: [
    'website development company in UP',
    'website developer Etawah',
    'software development company Uttar Pradesh',
    'logo design service India',
    'video editing service UP',
    'game development service India',
    'mobile app development company UP',
    'digital marketing service Etawah',
    'business website banwana hai',
    'software banwane ke liye',
    'game banwane ke liye',
    'logo banwane ke liye',
    'video editing karwana hai',
    'affordable website development India',
    'custom software development India',
    'ecommerce website design',
    'school management software',
    'billing software developer',
    'Jan Seva Kendra digital services',
  ],
  alternates: {
    canonical: `${baseUrl}/digital-services`,
  },
  openGraph: {
    title: 'Digital Services | Website, Software, Logo, Video Editing & Game Development',
    description:
      'Professional digital work for UP and all India: business websites, custom software, logo design, video editing, apps, games, SEO and marketing.',
    url: `${baseUrl}/digital-services`,
    type: 'website',
    images: [`${baseUrl}/jan-seva-logo-1.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website, Software, Logo, Video Editing & Game Development',
    description:
      'Get website, software, game, logo, video editing, app and digital marketing work from Jan Seva Kendra.',
    images: [`${baseUrl}/jan-seva-logo-1.png`],
  },
}

const digitalServices = [
  {
    title: 'Website Development',
    hindi: 'Business Website / E-commerce Website',
    description: 'Fast, mobile-friendly websites for shops, coaching, schools, offices, startups and local businesses.',
    icon: Globe2,
  },
  {
    title: 'Software Development',
    hindi: 'Custom Software / Billing / Management System',
    description: 'Business software, admin panels, booking systems, school management, billing and reporting dashboards.',
    icon: Code2,
  },
  {
    title: 'Mobile App Development',
    hindi: 'Android App / Business App',
    description: 'Modern mobile apps for customer booking, services, delivery, business operations and online platforms.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Logo & Graphic Design',
    hindi: 'Logo, Poster, Banner, Social Media Design',
    description: 'Brand logo, visiting card, banner, poster, festival creatives and social media post design.',
    icon: Brush,
  },
  {
    title: 'Video Editing',
    hindi: 'Reels, YouTube, Business Promo Video',
    description: 'Short reels, YouTube videos, shop promos, product videos, ads and professional editing work.',
    icon: Video,
  },
  {
    title: 'Game Development',
    hindi: '2D Game / Mobile Game / Learning Game',
    description: 'Simple games, quiz games, learning games, promotional games and custom interactive experiences.',
    icon: Gamepad2,
  },
  {
    title: 'SEO & Digital Marketing',
    hindi: 'Google Ranking / Social Media Promotion',
    description: 'SEO pages, Google visibility, local business promotion, content planning and lead generation support.',
    icon: Search,
  },
  {
    title: 'Business Automation',
    hindi: 'Online Form, CRM, WhatsApp Lead System',
    description: 'Automate customer leads, forms, service tracking, reminders, reports and online workflows.',
    icon: Rocket,
  },
]

const industries = [
  'Shop & Retail Business',
  'School, Coaching & Institute',
  'Doctor, Clinic & Hospital',
  'Restaurant, Cafe & Hotel',
  'Real Estate & Property Dealer',
  'Transport & Travel Business',
  'Gym, Salon & Local Services',
  'Startup, YouTube & Creator Brand',
]

const locations = [
  'Etawah',
  'Bharthana',
  'Auraiya',
  'Mainpuri',
  'Kanpur',
  'Agra',
  'Lucknow',
  'Noida',
  'Ghaziabad',
  'Delhi NCR',
  'Uttar Pradesh',
  'All India',
]

export default function DigitalServicesPage() {
  const digitalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/digital-services#digital-services`,
    name: 'Jan Seva Kendra Digital Services',
    url: `${baseUrl}/digital-services`,
    logo: `${baseUrl}/jan-seva-logo-1.png`,
    image: `${baseUrl}/jan-seva-logo-1.png`,
    telephone: ['+919193898182', '+917895094129'],
    email: 'arpitcsc1707@gmail.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mandi Trihaa, Bidhuna Road',
      addressLocality: 'Bharthana',
      addressRegion: 'Uttar Pradesh',
      postalCode: '206241',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'State', name: 'Uttar Pradesh' },
      { '@type': 'Country', name: 'India' },
    ],
    description:
      'Website development, software development, mobile app development, logo design, graphic design, video editing, game development, SEO and digital marketing services for UP and all India customers.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Work Services',
      itemListElement: digitalServices.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(digitalServiceSchema) }}
      />
      <Header />
      <main className="bg-slate-950 text-white">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#2563eb_0,#0f172a_38%,#020617_100%)] px-4 py-16 sm:px-6 lg:py-24">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-cyan-400 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-fuchsia-500 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Digital Work for UP & All India
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Website, Software, Logo, Video Editing aur Game Development
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
                Jan Seva Kendra par ab government services ke saath professional digital kaam bhi hota hai. Business website, custom software, mobile app, logo, poster, video editing, game, SEO aur online promotion ke liye direct contact karein.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-300"
                >
                  <Phone className="h-5 w-5" />
                  Call: {phoneNumber}
                </a>
                <a
                  href={`https://wa.me/${whatsappHrefNumber}?text=Hello%20Jan%20Seva%20Kendra,%20mujhe%20website/software/logo/video/game%20ka%20digital%20work%20karwana%20hai.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
                >
                  WhatsApp: {whatsappNumber} / {phoneNumber}
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {['UP + India Clients', 'Mobile Friendly', 'SEO Ready', 'Affordable Price'].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-center font-bold text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Digital Agency Services</p>
                    <h2 className="text-2xl font-black">Online Growth Package</h2>
                  </div>
                  <Laptop className="h-10 w-10 text-cyan-300" />
                </div>
                <div className="space-y-3">
                  {['Website + SEO Setup', 'Logo + Brand Design', 'Software + Admin Panel', 'Video + Social Media Ads'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                      <BadgeCheck className="h-5 w-5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold text-slate-100">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-xl bg-blue-500/20 p-4 text-sm leading-6 text-blue-100">
                  Local business ko online lane ke liye website, Google ranking, WhatsApp leads aur digital branding ek jagah.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 text-slate-900 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="font-bold uppercase tracking-widest text-blue-600">Our Digital Services</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Har tarah ka digital kaam ek jagah</h2>
              <p className="mt-4 text-slate-600">
                Website banwani ho, software chahiye, logo design, video editing, game ya app development, sab ke liye professional support.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {digitalServices.map((service) => {
                const Icon = service.icon
                return (
                  <article
                    key={service.title}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-blue-600 p-3 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-950">{service.title}</h3>
                    <p className="mt-1 text-sm font-bold text-blue-700">{service.hindi}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-100 px-4 py-14 text-slate-900 sm:px-6 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-orange-500" />
                <h2 className="text-2xl font-black sm:text-3xl">Kin businesses ke liye?</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-slate-800">
                    <Star className="h-4 w-4 flex-shrink-0 text-orange-500" />
                    {industry}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-green-300" />
                <h2 className="text-2xl font-black sm:text-3xl">Kyun humse kaam karvayein?</h2>
              </div>
              <div className="space-y-4">
                {[
                  'Mobile-friendly aur fast loading design.',
                  'SEO-ready pages jisse Google par ranking me help mile.',
                  'Hindi + English content support for Indian customers.',
                  `Direct phone ${phoneNumber} and WhatsApp ${whatsappNumber} support with clear pricing.`,
                  'Local Etawah team, all India digital delivery.',
                ].map((point) => (
                  <div key={point} className="flex gap-3 rounded-xl bg-white/10 p-4">
                    <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-300" />
                    <p className="text-sm leading-6 text-slate-100">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 text-slate-900 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950 p-6 text-white shadow-2xl sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <Film className="mb-4 h-10 w-10 text-yellow-300" />
                  <h2 className="text-3xl font-black sm:text-4xl">
                    UP aur India ke customers ke liye digital project ready karwayein
                  </h2>
                  <p className="mt-4 max-w-3xl text-blue-100">
                    Website, software, logo, video editing, game, app ya digital marketing ka kaam start karne ke liye project details WhatsApp par bhejein. Hamari team requirement samajh kar best solution suggest karegi.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`https://wa.me/${whatsappHrefNumber}?text=Hello,%20mujhe%20digital%20project%20ke%20liye%20quotation%20chahiye.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-black text-white transition hover:bg-green-600"
                    >
                      WhatsApp: {whatsappNumber} / {phoneNumber}
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <h3 className="mb-4 text-xl font-black">Service Area Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <span key={location} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-800">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 px-4 py-14 text-white sm:px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-black mb-4">Poore India se website customers — 780+ city pages</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
              Har state, har district ke liye alag SEO page. Coaching, shop, hospital, restaurant — 15 industries.
              Business website, ecommerce, software — 12 service types. Sab kuch add kiya gaya hai leads ke liye.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/website-sitemap"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 font-black hover:bg-indigo-600 transition"
              >
                All India Website Sitemap →
              </Link>
              <Link
                href="/build-website"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-900 hover:bg-yellow-300 transition"
              >
                Kya Banwana Hai? — Services
              </Link>
              <a
                href="https://wa.me/9193898182?text=Hello,%20mujhe%20website%20banwana%20hai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3 font-black hover:bg-green-600 transition"
              >
                WhatsApp Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
