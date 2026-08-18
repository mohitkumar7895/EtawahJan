import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ITServicesBanner from '@/components/ITServicesBanner'
import Services from '@/components/Services'
import Announcements from '@/components/Announcements'
import Reviews from '@/components/Reviews'
import HomeJobsFeed from '@/components/HomeJobsFeed'
import ToolsHomePromo from '@/components/tools/ToolsHomePromo'
import PortfolioSection from '@/components/PortfolioSection'
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

    // 🔥 PREMIUM QUALITY & LATEST PROJECT PORTFOLIO KEYWORDS 🔥
    'premium quality website developers',
    'high quality software development',
    'latest IT projects 2024',
    'top quality app developers',
    'award winning website design agency',
    'best software development company with portfolio',
    'view latest software projects',
    'premium UI UX design agency',
    'hire top rated web developers',
    'world class software solutions',
    'best IT agency for premium projects',
    'custom high end web applications',
    'scalable enterprise software architecture',
    'No. 1 website developer near me',
    'top 10 software companies in UP',
    'best custom web design agency',
    'luxury website design services',
    'high performance web apps',
    'fastest website loading speed optimization',
    'secure and robust software developers',
  ],
  openGraph: {
    title: 'Premium Web & Software Development Agency | High Quality IT Solutions',
    description: 'We build world-class, premium quality websites, apps, and enterprise software. Explore our latest high-performance projects. Guaranteed top-rated IT services to scale your business 10x.',
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
    <section className="bg-slate-50 py-12 mt-8">
      <div className="container mx-auto px-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-7xl">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">#1 Premium Website Development & World-Class IT Services Company</h2>
        <p className="mb-4">
          Welcome to Jan Seva Kendra IT Solutions, your trusted partner for <strong>Premium Quality Website Development</strong>, <strong>High-Performance Mobile Apps</strong>, and <strong>Custom Software Solutions</strong>. We specialize in building fast, secure, and visually stunning digital products. If you are looking for top-rated, latest Next-Gen IT solutions, explore our massive portfolio of recently delivered enterprise websites, e-commerce stores, and high-end billing software used by top businesses across 780+ cities in India and globally (USA, UK, UAE, Australia).
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

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">💻 Custom Software, CRM & SaaS Application Developers</h3>
        <p className="mb-4">
          We are not just a website agency. We are expert <strong>SaaS and CRM application developers</strong>. If you need a fully customized <strong>school management ERP, hospital billing software, real estate portal, inventory management system, or multi-vendor e-commerce platform</strong>, our expert team provides low-cost, high-performance solutions globally. We help startups and small businesses scale rapidly.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">🔥 Unlimited Business Growth with Top-Rated Web & App Development</h3>
        <p className="mb-4">
          Looking to take your business to the next level? We are the ultimate <strong>B2B Software Solutions & Digital Marketing Agency</strong>. Whether you need a <strong>lead generation website design</strong>, an <strong>affordable app development company</strong> for a local shop, or a <strong>white-label offshore web development team</strong> for your international agency, we deliver results. Our dedicated <strong>React, Node.js, and Next.js developers</strong> build scalable architectures. We guarantee low-cost, high-quality deliverables to get you <em>unlimited clients</em>, improve your Google rankings, and automate your workflow with our premium ERP and POS billing systems.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">🎮 Game Development & Advanced Mobile Apps</h3>
        <p className="mb-4">
          Are you looking to build the next big hit? We are expert <strong>game developers in India</strong> specializing in Unity, Ludo games, fantasy cricket apps, and interactive educational games. We also build high-performance native and cross-platform <strong>mobile apps (Flutter, React Native)</strong> for grocery delivery, food delivery (like Zomato/Swiggy clones), and e-commerce stores. Get custom software that scales to millions of users.
        </p>

        <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-2">🏢 Enterprise Custom Software & SaaS Platforms</h3>
        <p className="mb-4">
          Stop relying on manual paperwork! We build end-to-end <strong>custom enterprise software</strong>. Need a custom SaaS product, real-estate portal, matrimonial website, or a powerful <strong>B2B multi-vendor marketplace</strong>? We got you covered. We create high-end billing software, GST invoicing apps, and Inventory Management Systems that streamline your business operations instantly.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 mt-6">
          <p className="font-bold text-slate-800 text-sm sm:text-base text-center">
            🚀 Ready to grow? Contact us today via WhatsApp at <a href="https://wa.me/917895094129" className="text-blue-600 hover:underline">7895094129</a> for a free quote on website development, or visit our office at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP!
          </p>
        </div>
      </div>

      {/* Hidden Massive SEO Keywords Block for Search Engines Only */}
      <div className="sr-only">
        <h1>Best Website Development Company in India | Premium Quality Custom Software Developers | Top-Rated Mobile App Development Agency</h1>
        <p>Hire the best web developers in India for premium quality website design. We specialize in custom software development, high-performance school management systems, hospital ERP, advanced billing POS software, and scalable inventory management. Get a highly skilled team of React, Next.js, Node.js, MERN stack, and Flutter developers. We deliver world-class, luxury website designs for startups and enterprises. Check out our latest IT projects and software portfolios. Cheap e-commerce website development for small businesses alongside premium B2B portal development, SaaS product building, and multi-vendor marketplaces.</p>
        <p>Game development company in India building Unity games, Ludo apps, and fantasy sports apps with the latest technologies. We provide top-tier digital marketing, Google Ads management, Facebook ads, and advanced local SEO services to ensure you rank #1 on Google and get unlimited clients. Top rated software company in UP, Etawah.</p>
        <p>Outsource premium web development to India. Offshore software development agency for USA, UK, UAE, Canada, and Australia clients demanding high quality and fast delivery. White label web design services. Hire dedicated developers on a monthly basis. Real estate website developers, matrimonial portal development, grocery delivery app makers, restaurant billing software creators. Latest robust software architecture. Jan Seva Kendra Bharthana Etawah CSC center online services.</p>
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
      <PortfolioSection limit={6} />
      <Announcements />
      <Services />
      <HomeJobsFeed />
      <Reviews />
      <SeoBottomBlock />
      <Footer />
    </>
  )
}
