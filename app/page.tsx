import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ITServicesBanner from '@/components/ITServicesBanner'
import Services from '@/components/Services'
import Announcements from '@/components/Announcements'
import Reviews from '@/components/Reviews'
import HomeJobsFeed from '@/components/HomeJobsFeed'
import ToolsHomePromo from '@/components/tools/ToolsHomePromo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '#1 Website Development — Get More Customers, Rank Top on Google',
  description:
    'Serving India (780+ cities) & 65+ countries (USA, UK, UAE, Russia). We build business websites, e-commerce, billing software, mobile apps & SEO. WhatsApp your requirements for a free same-day quote. Affordable · Professional · Google-ready.',
  keywords: [
    'website development company',
    'create website',
    'best web developer India',
    'website development USA',
    'website development Russia',
    'hire web developer affordable',
    'business website development',
    'mobile app development company',
    'custom software development India',
    'jan seva kendra near me',
    'csc center near me',
    'website development company Etawah',
    'create ecommerce website',
    'professional website design',
    'cheap website development worldwide',
    'pan card apply near me',
    'income certificate apply near me',
    'birth certificate online near me',
    'ration card apply',
    'ayushman card apply',
    'government work online near me',
    'Jan Seva Kendra Bharthana',
    'CSC Center Etawah',
    'free photo resizer 20kb',
    'pdf editor online free india',
    'cash counter online free',
    'merge pdf online free',
    'free online tools india',
    'jan seva free tools',
    'application letter maker hindi',
    'resume builder free pdf',
    'जन सेवा केंद्र नजदीक',
    'सीएससी सेंटर इटावा',
    'Best Service Center Etawah',

    // NEW HIGH-INTENT WEB DEV KEYWORDS TO GET CLIENTS
    'web development agency for small business',
    'shopify website designers near me',
    'wordpress developers in india',
    'low cost ecommerce website development',
    'custom CRM development services',
    'hospital management software development',
    'school management system software developers',
    'hire dedicated react developers',
    'nextjs developers in UP',
    'best software agency for startups',
    'digital marketing and SEO services',
    'business growth solutions UP',
    'affordable app development for local business',
    'B2B software solutions India',

    // EXTREME LONG-TAIL & CONVERSATIONAL KEYWORDS (HINGLISH + ENGLISH) - MAXIMUM INTENT
    'build a website for my business',
    'how to make an app for a shop',
    'how much does it cost to build an online store',
    'website developer near me with price',
    'custom software development cost',
    'how to get more customers online in UP',
    'best billing software for small shop',
    'how to take my business online',
    'website builder contact number',
    'website agency phone number UP',
    'urgent pan card 1 din me kaise banaye',
    'tatkal aay praman patra UP',
    'ration card me naya naam kaise jode',
    'urgent income certificate Etawah',
    'website maker in low budget',
    'app developer hiring process',

    // 🔥 HIGH-INTENT INTERNATIONAL OFFSHORE & OUTSOURCING KEYWORDS (USA, UK, UAE, GLOBAL) 🔥
    'outsource web development to india',
    'hire offshore react developers india',
    'hire offshore nextjs developers',
    'custom web development company USA',
    'best offshore web development agency',
    'affordable ecommerce development UK',
    'cheap app developers in india for USA clients',
    'shopify experts india for global clients',
    'white label web development agency india',
    'remote web developers for hire UAE',
    'B2B offshore software development India',
    'hire dedicated software development team india',
    'custom CRM developers USA',
    'outsource mobile app development',
    'low cost high quality web design agency',
    'freelance web development agency global',
    'best IT outsourcing company in India',

    // DIGITAL MARKETING, GMB, & ADS KEYWORDS
    'GMB profile creation service',
    'google my business setup expert',
    'google maps business listing service',
    'local seo and gmb optimization',
    'google ads management agency',
    'facebook ads expert near me',
    'digital marketing agency in Etawah',
    'lead generation services India',
    'social media marketing agency UP',
  ],
  openGraph: {
    title: 'Get More Customers! #1 Website & Software Agency | Jan Seva Kendra',
    description: 'Stop losing customers. We build websites, e-commerce, apps, and software to grow your business 10x. Call/WhatsApp 7895094129 for a free demo.',
    type: 'website',
    url: 'https://www.jan-seva.site/',
    images: ['https://www.jan-seva.site/jan-seva-logo-1.png'],
  },
  alternates: {
    canonical: 'https://www.jan-seva.site/',
  },
  other: {
    'google-site-verification': '2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw',
  },
}

function SeoBottomBlock() {
  return (
    <section className="bg-slate-50 py-12 border-t border-slate-200 mt-8">
      <div className="container mx-auto px-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-7xl">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">#1 Website Development & IT Services Company in India</h2>
        <p className="mb-4">
          Welcome to Jan Seva Kendra IT Solutions, your trusted partner for premium, affordable <strong>Website Development</strong>, <strong>Mobile App Development</strong>, and <strong>Custom Software Solutions</strong>. We specialize in building responsive, SEO-optimized business websites, e-commerce stores, and billing software for small and medium businesses across all 780+ cities in India (including UP, Etawah, Agra, Lucknow, Kanpur, and Noida). We also serve international clients globally in the USA, UK, UAE, Canada, Australia, and Russia.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">Grow Your Business — Create a Website Today</h3>
        <p className="mb-4">
          If you are looking to <em>build a website for your business</em>, you need a digital agency that understands growth. We build fast, beautiful websites that rank on top of Google. Whether you need a simple portfolio, a complex <strong>school management system</strong>, hospital CRM, real-estate portal, or a robust <strong>e-commerce app</strong>, our team of expert React & Next.js developers delivers the best results to help you get more customers.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">🚀 Digital Marketing, Google Ads & GMB Optimization</h3>
        <p className="mb-4">
          Struggling to get local customers? We provide premium <strong>Google My Business (GMB) Profile Creation</strong> and Local SEO services to rank your shop or clinic #1 on Google Maps. We also run highly profitable <strong>Google Ads and Facebook Ads</strong> campaigns to generate high-quality leads for your business. Let us handle your digital marketing while you focus on sales!
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">🌐 Offshore Web Development & IT Outsourcing (USA, UK, UAE, Global)</h3>
        <p className="mb-4">
          Looking to <strong>outsource web development to India</strong>? We are a premium <strong>offshore software development agency</strong> serving clients in the <strong>USA, UK, Canada, Australia, and the UAE (Dubai)</strong>. You can <em>hire dedicated React and Next.js developers</em> at highly affordable offshore rates without compromising on Silicon Valley-level quality. We provide <strong>White Label Web Development</strong> for international agencies, custom CRM solutions, and robust B2B enterprise software globally.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">Local CSC & Document Services (Jan Seva Kendra Etawah)</h3>
        <p className="mb-4">
          Apart from premium IT services, we operate as a highly trusted <strong>CSC Center in Etawah</strong> (Bharthana). We provide urgent PAN Card applications, Income Certificates (Aay Praman Patra), Caste Certificates, Birth Certificates, Ration Card corrections, e-Shram cards, and Ayushman Cards on the exact same day.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 mt-6">
          <p className="font-bold text-slate-800 text-sm sm:text-base text-center">
            🚀 Ready to grow? Contact us today via WhatsApp at <a href="https://wa.me/917895094129" className="text-blue-600 hover:underline">7895094129</a> for a free quote on website development, or visit our office at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP!
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Custom Billing & Business Software",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Windows, macOS, Web",
    "description": "High-quality custom software, CRM, and billing systems for small and medium businesses. Get more customers with our solutions.",
    "offers": {
      "@type": "Offer",
      "price": "4999",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "120"
    }
  };

  const webDevServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Website Development & App Development",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jan Seva Kendra IT Agency"
    },
    "description": "Premium E-commerce and Business Website Development services to grow your business online and get 10x customers. Specialized in offshore web development and IT outsourcing.",
    "areaServed": [
      { "@type": "Country", "name": "India" },
      { "@type": "State", "name": "Uttar Pradesh" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "Country", "name": "Australia" },
      { "@type": "Country", "name": "Canada" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web & IT Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Business Website Design"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-Commerce App Development"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webDevServiceSchema) }}
      />
      <Header />
      <Hero />
      <ToolsHomePromo />
      <ITServicesBanner />
      <Announcements />
      <Services />
      <HomeJobsFeed />
      <Reviews />
      <SeoBottomBlock />
      <Footer />
    </>
  )
}
