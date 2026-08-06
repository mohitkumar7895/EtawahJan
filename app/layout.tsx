import type { Metadata, Viewport } from 'next'
import './globals.css'
import ChatSupport from '@/components/ChatSupport'
import VisitorTracker from '@/components/VisitorTracker'
import SarkariTicker from '@/components/SarkariTicker'
import QuickLeadWidget from '@/components/QuickLeadWidget'
import TopOfferBanner from '@/components/TopOfferBanner'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import SocialProofPopup from '@/components/SocialProofPopup'
import VideoBubble from '@/components/VideoBubble'
import SpinWheelWidget from '@/components/SpinWheelWidget'

// ============================================================
// ALL 75 UP DISTRICTS COVERED — MAX SEO POWER
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jan-seva.site/'),
  title: {
    default: '#1 Website Development India & Worldwide | Jan Seva Kendra — Web Design, Apps & Software',
    template: '%s | Jan Seva Kendra'
  },
  description: 'Top website development company — India 780+ cities + USA, Russia, UK, UAE, 65 countries. Business website, e-commerce, mobile app, custom software. CSC Etawah + premium IT. WhatsApp 7895094129 — free quote in 24hrs. Customers badhao!',
  keywords: [
    // PRIMARY — HIGH VOLUME
    'jan seva kendra near me',
    'csc center near me',
    'common service centre near me',
    'government services near me',
    'jan seva kendra',
    'csc center',

    // ETAWAH + BHARTHANA CORE
    'jan seva kendra Etawah',
    'jan seva kendra Bharthana',
    'csc center Etawah',
    'csc center Bharthana',
    'CSC Etawah',
    'CSC Bharthana',
    'jan seva kendra Etawah contact number',
    'jan seva kendra Bharthana contact number',
    'best csc center Etawah',
    'same day service Etawah',

    // IT & SOFTWARE SERVICES — BUSINESS GROWTH
    'website development company Etawah',
    'app development company near me',
    'game development services',
    'custom software development Etawah',
    'website developer near me',
    'ecommerce website design',
    'mobile app maker Etawah',
    'software development services',
    'website development services',
    'business website builder',
    'game developer in UP',
    'IT agency Etawah',

    // IT & SOFTWARE SERVICES — FULL UP TARGETING
    'website development company in UP',
    'best software company in Uttar Pradesh',
    'mobile app developer UP',
    'game development agency UP',
    'software developer in UP',
    'website maker in UP',
    'IT company Lucknow',
    'website development company Kanpur',
    'app developer Agra',
    'software company Noida',
    'website builder Ghaziabad',
    'IT services in Meerut',
    'website developer Varanasi',
    'software agency Prayagraj',
    'website development company Gorakhpur',
    'mobile app development company Bareilly',
    'software development company Aligarh',
    'web design company Moradabad',
    'ecommerce website developer Saharanpur',
    'game development company Jhansi',
    'custom software developer Mathura',
    'IT agency Firozabad',
    'website maker Ayodhya',
    'app developer Shahjahanpur',
    'software company Muzaffarnagar',
    'website development company UP',
    'app development company UP',
    'software development company UP',
    'game development company UP',
    'online business website UP',
    'startup app developer UP',
    'top IT company in Uttar Pradesh',
    'best website designer in UP',

    // IT & SOFTWARE SERVICES — PAN INDIA
    'website development company in India',
    'best software company in India',
    'mobile app development India',
    'game development agency India',
    'top IT company in India',
    'affordable website builder India',
    'custom software developer India',
    'app developer Delhi',
    'website maker Mumbai',
    'software company Bangalore',
    'app development Pune',
    'IT services Hyderabad',
    'ecommerce website developer India',
    'startup website development India',
    'low cost website design India',

    // IT & SOFTWARE SERVICES — GLOBAL & OUTSOURCING
    'hire dedicated developers India',
    'affordable website development USA',
    'outsource mobile app development India',
    'software development company USA',
    'offshore software development India',
    'cheap website developer UK',
    'custom game development services global',
    'top app developers Dubai',
    'website design company Canada',
    'mobile app maker Australia',
    'IT outsourcing company India',
    'freelance website developer India',
    'remote software team India',

    // INDUSTRY-SPECIFIC SOFTWARE & APPS (HIGH INTENT/CONVERSION)
    'school management software UP',
    'school management system India',
    'hospital management software India',
    'clinic management app developer',
    'restaurant billing software UP',
    'ecommerce app developer India',
    'real estate website builder India',
    'grocery delivery app developer',
    'gym management software',
    'salon booking app development',
    'pharmacy billing software UP',
    'custom CRM software developer',
    'business ERP software India',
    
    // HIGH-INTENT / CONVERSION KEYWORDS (NEW ADDITIONS TO GET MORE CLIENTS)
    'affordable ecommerce website developers',
    'shopify experts in india',
    'wordpress developers near me',
    'best software development agency for startups',
    'hire nextjs developers india',
    'cheap app development company',
    'SEO services for small business',
    'digital marketing agency in UP',
    'billing software for retail shop',
    'lead generation website design',
    'website redesign services',
    'B2B web development company',
    'portfolio website builder',

    // SERVICES — HIGH SEARCH
    'pan card apply near me',
    'pan card apply Etawah',
    'pan card online apply UP',
    'income certificate apply near me',
    'income certificate Etawah',
    'aay praman patra online UP',
    'birth certificate online near me',
    'birth certificate Etawah',
    'janam praman patra online UP',
    'caste certificate online UP',
    'jati praman patra online',
    'ration card apply near me',
    'ration card Etawah',
    'ration card correction UP',
    'ayushman card apply near me',
    'ayushman bharat card Etawah',
    'voter id card apply near me',
    'voter id correction Etawah',
    'domicile certificate UP',
    'niwas praman patra online',
    'driving license apply UP',
    'passport apply near me',
    'gst registration near me',
    'udyam registration UP',
    'pm kisan registration',
    'e shram card apply UP',
    'labour card apply UP',
    'scholarship form UP',
    'UP scholarship online',
    'bijli bill payment online',
    'electricity bill Etawah',

    // ALL 75 UP DISTRICTS — MASSIVE COVERAGE
    'jan seva kendra Agra',
    'jan seva kendra Aligarh',
    'jan seva kendra Ambedkar Nagar',
    'jan seva kendra Amethi',
    'jan seva kendra Amroha',
    'jan seva kendra Auraiya',
    'jan seva kendra Azamgarh',
    'jan seva kendra Baghpat',
    'jan seva kendra Bahraich',
    'jan seva kendra Ballia',
    'jan seva kendra Balrampur',
    'jan seva kendra Banda',
    'jan seva kendra Barabanki',
    'jan seva kendra Bareilly',
    'jan seva kendra Basti',
    'jan seva kendra Bhadohi',
    'jan seva kendra Bijnor',
    'jan seva kendra Budaun',
    'jan seva kendra Bulandshahr',
    'jan seva kendra Chandauli',
    'jan seva kendra Chitrakoot',
    'jan seva kendra Deoria',
    'jan seva kendra Etah',
    'jan seva kendra Etawah',
    'jan seva kendra Farrukhabad',
    'jan seva kendra Fatehpur',
    'jan seva kendra Firozabad',
    'jan seva kendra Gautam Buddha Nagar',
    'jan seva kendra Ghaziabad',
    'jan seva kendra Ghazipur',
    'jan seva kendra Gonda',
    'jan seva kendra Gorakhpur',
    'jan seva kendra Hamirpur',
    'jan seva kendra Hapur',
    'jan seva kendra Hardoi',
    'jan seva kendra Hathras',
    'jan seva kendra Jalaun',
    'jan seva kendra Jaunpur',
    'jan seva kendra Jhansi',
    'jan seva kendra Kannauj',
    'jan seva kendra Kanpur Dehat',
    'jan seva kendra Kanpur Nagar',
    'jan seva kendra Kasganj',
    'jan seva kendra Kaushambi',
    'jan seva kendra Kheri',
    'jan seva kendra Kushinagar',
    'jan seva kendra Lalitpur',
    'jan seva kendra Lucknow',
    'jan seva kendra Maharajganj',
    'jan seva kendra Mahoba',
    'jan seva kendra Mainpuri',
    'jan seva kendra Mathura',
    'jan seva kendra Mau',
    'jan seva kendra Meerut',
    'jan seva kendra Mirzapur',
    'jan seva kendra Moradabad',
    'jan seva kendra Muzaffarnagar',
    'jan seva kendra Pilibhit',
    'jan seva kendra Pratapgarh',
    'jan seva kendra Prayagraj',
    'jan seva kendra Raebareli',
    'jan seva kendra Rampur',
    'jan seva kendra Saharanpur',
    'jan seva kendra Sambhal',
    'jan seva kendra Sant Kabir Nagar',
    'jan seva kendra Shahjahanpur',
    'jan seva kendra Shamli',
    'jan seva kendra Shrawasti',
    'jan seva kendra Siddharthnagar',
    'jan seva kendra Sitapur',
    'jan seva kendra Sonbhadra',
    'jan seva kendra Sultanpur',
    'jan seva kendra Unnao',
    'jan seva kendra Varanasi',

    // CSC ALL DISTRICTS
    'csc center Agra', 'csc center Aligarh', 'csc center Lucknow', 'csc center Kanpur',
    'csc center Mathura', 'csc center Firozabad', 'csc center Mainpuri', 'csc center Auraiya',
    'csc center Jalaun', 'csc center Jhansi', 'csc center Farrukhabad', 'csc center Kannauj',
    'csc center Varanasi', 'csc center Prayagraj', 'csc center Gorakhpur', 'csc center Meerut',
    'csc center Ghaziabad', 'csc center Noida', 'csc center Bareilly', 'csc center Moradabad',

    // HINDI KEYWORDS — MASSIVE LOCAL SEARCH
    'जन सेवा केंद्र नजदीक',
    'जन सेवा केंद्र इटावा',
    'जन सेवा केंद्र भरथाना',
    'सीएससी सेंटर इटावा',
    'पैन कार्ड आवेदन',
    'पैन कार्ड इटावा',
    'आय प्रमाण पत्र ऑनलाइन',
    'जाति प्रमाण पत्र ऑनलाइन',
    'जन्म प्रमाण पत्र ऑनलाइन',
    'राशन कार्ड आवेदन',
    'राशन कार्ड इटावा',
    'आयुष्मान कार्ड बनाना',
    'ई श्रम कार्ड UP',
    'उत्तर प्रदेश जन सेवा केंद्र',
    'सरकारी काम ऑनलाइन इटावा',
    'प्रमाण पत्र ऑनलाइन UP',
    'जन सेवा केंद्र उत्तर प्रदेश',

    // LONG TAIL
    'how to apply pan card in Etawah UP',
    'income certificate same day Etawah',
    'csc center Bidhuna Road Bharthana',
    'government document service Etawah',
    'Jan Seva Kendra Mandi Trihaa Bharthana',
    'CSC VLE Etawah UP',
    'online government work Etawah',
    'certificate apply online UP same day',
    'Jan Seva Kendra 9193898182',
  ],
  authors: [{ name: 'Jan Seva Kendra', url: 'https://www.jan-seva.site/' }],
  creator: 'Jan Seva Kendra',
  publisher: 'Jan Seva Kendra',
  category: 'Government Services',
  classification: 'Government Services, CSC Center, Document Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.jan-seva.site/',
    languages: {
      'hi-IN': 'https://www.jan-seva.site/',
      'en-IN': 'https://www.jan-seva.site/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_IN'],
    url: 'https://www.jan-seva.site/',
    siteName: 'Jan Seva Kendra - CSC Center Etawah',
    title: 'Jan Seva Kendra Near Me | CSC Center Etawah Bharthana | PAN Ration Card Same Day',
    description: 'UP ka sabse trusted Jan Seva Kendra. Etawah, Bharthana, Agra, Kanpur, Lucknow aur poore UP mein service. PAN card, income certificate, ration card, Ayushman card — same day help. Call 9193898182. Mandi Trihaa, Bidhuna Road, Bharthana.',
    images: [
      {
        url: 'https://www.jan-seva.site/jan-seva-logo-1.png',
        width: 1200,
        height: 630,
        alt: 'Jan Seva Kendra CSC Center Etawah Bharthana UP - PAN Certificate Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jan Seva Kendra Near Me | CSC Etawah | Same Day PAN Ration Card',
    description: 'UP ka #1 Jan Seva Kendra. Etawah, Bharthana, Agra, Kanpur. PAN, certificates same day. Call: 9193898182 | WA: 7895094129',
    images: ['https://www.jan-seva.site/jan-seva-logo-1.png'],
    site: '@JanSevaKendra',
    creator: '@JanSevaKendra',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/jan-seva-logo-1.png', sizes: '32x32', type: 'image/png' },
      { url: '/jan-seva-logo-1.png', sizes: '16x16', type: 'image/png' },
      { url: '/jan-seva-logo-1.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/jan-seva-logo-1.png',
    apple: [
      { url: '/jan-seva-logo-1.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: '2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw',
    yandex: 'yandex_verification_placeholder', // placeholder for future
    yahoo: 'yahoo_verification_placeholder',
    other: {
      me: ['arpitcsc1707@gmail.com'],
    },
  },
  other: {
    'google-site-verification': '2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw',
    'revisit-after': '3 days',
    'rating': 'general',
    'language': 'Hindi, English',
    'contact': 'arpitcsc1707@gmail.com',
    'telephone': '+919193898182, +917895094129',
    'address': 'Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, Uttar Pradesh 206241',
    'geo.region': 'IN-UP',
    'geo.placename': 'Etawah, Uttar Pradesh',
    'geo.position': '26.7855;79.0290',
    'ICBM': '26.7855, 79.0290',
    'DC.title': 'Jan Seva Kendra - CSC Center Etawah UP',
    'DC.subject': 'Government Services, CSC Center, PAN Card, Certificates',
    'DC.description': 'Jan Seva Kendra CSC Center near Etawah, Bharthana. All government services same day.',
    'DC.creator': 'Jan Seva Kendra',
    'DC.language': 'hi',
    'msapplication-TileColor': '#1a56db',
    'theme-color': '#1a56db',
    'msvalidate.01': 'BING_VERIFICATION_PLACEHOLDER', // Add Bing Master Tag here later
    'y_key': 'YAHOO_VERIFICATION_PLACEHOLDER',
    'monetag': '6fdddedeb4975f2b45942428e1a854e8',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a56db',
}

// ============================================================
// SCHEMA.ORG — FULL STRUCTURED DATA FOR GOOGLE
// ============================================================

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentOffice",
  "@id": "https://www.jan-seva.site/#localbusiness",
  "name": "Jan Seva Kendra",
  "alternateName": [
    "जन सेवा केंद्र",
    "Jan Seva Kendra Etawah",
    "Jan Seva Kendra Bharthana",
    "CSC Center Etawah",
    "Common Service Centre Etawah",
    "जन सेवा केंद्र इटावा",
    "जन सेवा केंद्र भरथाना"
  ],
  "image": [
    "https://www.jan-seva.site/jan-seva-logo-1.png"
  ],
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.jan-seva.site/jan-seva-logo-1.png",
    "width": 512,
    "height": 512
  },
  "description": "Jan Seva Kendra — Government authorized CSC (Common Service Centre) near Etawah, Bharthana, Uttar Pradesh. We provide same-day PAN card apply, income certificate, birth certificate, caste certificate, ration card, Ayushman card, voter ID, e-Shram card, driving license, and 100+ government & private services. Official process, trusted service, no agent required.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Mandi Trihaa, Bidhuna Road",
    "addressLocality": "Bharthana",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "206241",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "26.7855",
    "longitude": "79.0290"
  },
  "hasMap": "https://maps.google.com/?q=Mandi+Trihaa+Bidhuna+Road+Bharthana+Etawah+UP",
  "url": "https://www.jan-seva.site/",
  "telephone": ["+919193898182", "+917895094129"],
  "email": "arpitcsc1707@gmail.com",
  "priceRange": "₹ - ₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, UPI, Online Transfer",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:00",
      "closes": "17:00"
    }
  ],
  "areaServed": [
    // MAIN SERVICE AREA
    { "@type": "City", "name": "Etawah" },
    { "@type": "City", "name": "Bharthana" },
    // ALL 75 UP DISTRICTS
    { "@type": "City", "name": "Agra" },
    { "@type": "City", "name": "Aligarh" },
    { "@type": "City", "name": "Ambedkar Nagar" },
    { "@type": "City", "name": "Amethi" },
    { "@type": "City", "name": "Amroha" },
    { "@type": "City", "name": "Auraiya" },
    { "@type": "City", "name": "Azamgarh" },
    { "@type": "City", "name": "Baghpat" },
    { "@type": "City", "name": "Bahraich" },
    { "@type": "City", "name": "Ballia" },
    { "@type": "City", "name": "Balrampur" },
    { "@type": "City", "name": "Banda" },
    { "@type": "City", "name": "Barabanki" },
    { "@type": "City", "name": "Bareilly" },
    { "@type": "City", "name": "Basti" },
    { "@type": "City", "name": "Bhadohi" },
    { "@type": "City", "name": "Bijnor" },
    { "@type": "City", "name": "Budaun" },
    { "@type": "City", "name": "Bulandshahr" },
    { "@type": "City", "name": "Chandauli" },
    { "@type": "City", "name": "Chitrakoot" },
    { "@type": "City", "name": "Deoria" },
    { "@type": "City", "name": "Etah" },
    { "@type": "City", "name": "Farrukhabad" },
    { "@type": "City", "name": "Fatehpur" },
    { "@type": "City", "name": "Firozabad" },
    { "@type": "City", "name": "Gautam Buddha Nagar" },
    { "@type": "City", "name": "Ghaziabad" },
    { "@type": "City", "name": "Ghazipur" },
    { "@type": "City", "name": "Gonda" },
    { "@type": "City", "name": "Gorakhpur" },
    { "@type": "City", "name": "Hamirpur" },
    { "@type": "City", "name": "Hapur" },
    { "@type": "City", "name": "Hardoi" },
    { "@type": "City", "name": "Hathras" },
    { "@type": "City", "name": "Jalaun" },
    { "@type": "City", "name": "Jaunpur" },
    { "@type": "City", "name": "Jhansi" },
    { "@type": "City", "name": "Kannauj" },
    { "@type": "City", "name": "Kanpur Dehat" },
    { "@type": "City", "name": "Kanpur Nagar" },
    { "@type": "City", "name": "Kasganj" },
    { "@type": "City", "name": "Kaushambi" },
    { "@type": "City", "name": "Lakhimpur Kheri" },
    { "@type": "City", "name": "Kushinagar" },
    { "@type": "City", "name": "Lalitpur" },
    { "@type": "City", "name": "Lucknow" },
    { "@type": "City", "name": "Maharajganj" },
    { "@type": "City", "name": "Mahoba" },
    { "@type": "City", "name": "Mainpuri" },
    { "@type": "City", "name": "Mathura" },
    { "@type": "City", "name": "Mau" },
    { "@type": "City", "name": "Meerut" },
    { "@type": "City", "name": "Mirzapur" },
    { "@type": "City", "name": "Moradabad" },
    { "@type": "City", "name": "Muzaffarnagar" },
    { "@type": "City", "name": "Pilibhit" },
    { "@type": "City", "name": "Pratapgarh" },
    { "@type": "City", "name": "Prayagraj" },
    { "@type": "City", "name": "Raebareli" },
    { "@type": "City", "name": "Rampur" },
    { "@type": "City", "name": "Saharanpur" },
    { "@type": "City", "name": "Sambhal" },
    { "@type": "City", "name": "Sant Kabir Nagar" },
    { "@type": "City", "name": "Shahjahanpur" },
    { "@type": "City", "name": "Shamli" },
    { "@type": "City", "name": "Shrawasti" },
    { "@type": "City", "name": "Siddharthnagar" },
    { "@type": "City", "name": "Sitapur" },
    { "@type": "City", "name": "Sonbhadra" },
    { "@type": "City", "name": "Sultanpur" },
    { "@type": "City", "name": "Unnao" },
    { "@type": "City", "name": "Varanasi" },
    { "@type": "State", "name": "Uttar Pradesh" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Government & Document Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Website & Mobile App Development",
          "description": "Professional website design, e-commerce, Android & iOS mobile app development services."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Software & Game Development",
          "description": "Custom software for business growth, billing software, and interactive game development."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "PAN Card Apply / Correction",
          "description": "New PAN card apply, lost PAN reprint, name/DOB correction"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Income Certificate (Aay Praman Patra)",
          "description": "Income certificate online apply, same day processing UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Caste Certificate (Jati Praman Patra)",
          "description": "SC/ST/OBC caste certificate online apply UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Birth Certificate (Janam Praman Patra)",
          "description": "Birth certificate apply online, corrections, same day service"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Ration Card Apply / Correction",
          "description": "New ration card apply, correction, name add/remove, transfer UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Ayushman Bharat Card",
          "description": "Ayushman card apply, PM-JAY health card Etawah UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Voter ID Card",
          "description": "New voter ID apply, correction, duplicate voter card UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Domicile Certificate (Niwas Praman Patra)",
          "description": "Domicile/residence certificate online apply UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "e-Shram Card",
          "description": "e-Shram card registration for unorganized workers UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "GST Registration",
          "description": "GST number registration for business UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Driving License Apply",
          "description": "Learner license, driving license apply, renewal UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "UP Scholarship Form",
          "description": "Pre-matric and post-matric scholarship form fill UP"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "PM Kisan Registration",
          "description": "PM Kisan Samman Nidhi registration and correction"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Ramesh Kumar" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Bahut accha service mila. PAN card aur income certificate same day ban gaya. Highly recommended Jan Seva Kendra Etawah."
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Sunita Devi" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Ration card ka kaam ek hi din mein ho gaya. Bahut helpful staff. Best CSC center Bharthana."
    }
  ],
  "sameAs": [
    "https://www.jan-seva.site/"
  ]
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Jan Seva Kendra Etawah ka contact number kya hai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jan Seva Kendra Etawah ka contact number hai: 9193898182 aur 7895094129. WhatsApp pe bhi contact kar sakte hain."
      }
    },
    {
      "@type": "Question",
      "name": "Jan Seva Kendra Bharthana kahan hai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jan Seva Kendra Bharthana, Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, Uttar Pradesh 206241 mein sthit hai."
      }
    },
    {
      "@type": "Question",
      "name": "PAN card apply karne mein kitna time lagta hai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Naya PAN card apply karne par 7-10 working days mein ghar pahunch jaata hai. Jan Seva Kendra par instant e-PAN bhi milta hai."
      }
    },
    {
      "@type": "Question",
      "name": "Jan Seva Kendra ka time kya hai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jan Seva Kendra Monday se Saturday subah 9 baje se shaam 7 baje tak aur Sunday 10 baje se 5 baje tak khula rehta hai."
      }
    },
    {
      "@type": "Question",
      "name": "Income certificate, caste certificate online kaise banega?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jan Seva Kendra par aayein ya call karein — income certificate, caste certificate, birth certificate, domicile certificate sab online apply hota hai aur same day processing milti hai."
      }
    },
    {
      "@type": "Question",
      "name": "Ayushman card kaise apply karein?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ayushman Bharat card ke liye Jan Seva Kendra par aayein. Ration card saath laayen. Call: 9193898182."
      }
    }
  ]
}

const itCompanySchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.jan-seva.site/#itcompany",
  "name": "Jan Seva Kendra - IT & Web Solutions",
  "image": "https://www.jan-seva.site/jan-seva-logo-1.png",
  "description": "Premium Website Development, Custom Software, and Mobile App Development company serving clients across India and globally. We build e-commerce stores, CRMs, School Management Systems, and business websites to help you get more customers.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Mandi Trihaa, Bidhuna Road",
    "addressLocality": "Bharthana",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "206241",
    "addressCountry": "IN"
  },
  "telephone": ["+919193898182", "+917895094129"],
  "email": "arpitcsc1707@gmail.com",
  "priceRange": "₹₹",
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "Russia" },
    { "@type": "Country", "name": "Canada" },
    { "@type": "Country", "name": "Australia" }
  ],
  "knowsAbout": ["Web Development", "Mobile App Development", "E-commerce Development", "Custom Software", "Digital Marketing", "SEO"],
  "url": "https://www.jan-seva.site/"
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.jan-seva.site/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://www.jan-seva.site/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Contact",
      "item": "https://www.jan-seva.site/contact"
    }
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.jan-seva.site/#website",
  "url": "https://www.jan-seva.site/",
  "name": "Jan Seva Kendra",
  "description": "Jan Seva Kendra - CSC Center Etawah UP. PAN, Certificates, all government services.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.jan-seva.site/?s={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <head>
        {/* Google Verification */}
        <meta name="google-site-verification" content="2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/jan-seva-logo-1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/jan-seva-logo-1.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/jan-seva-logo-1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/jan-seva-logo-1.png" />
        <link rel="shortcut icon" href="/jan-seva-logo-1.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.jan-seva.site/" />

        {/* Geo Tags — Critical for Local SEO */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Etawah, Uttar Pradesh, India" />
        <meta name="geo.position" content="26.7855;79.0290" />
        <meta name="ICBM" content="26.7855, 79.0290" />

        {/* Business Info */}
        <meta name="language" content="Hindi, English" />
        <meta name="contact" content="arpitcsc1707@gmail.com" />
        <meta name="telephone" content="+919193898182, +917895094129" />
        <meta name="address" content="Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, Uttar Pradesh 206241" />
        <meta name="author" content="Jan Seva Kendra" />
        <meta name="copyright" content="Jan Seva Kendra" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        <meta name="theme-color" content="#1a56db" />
        <meta name="msapplication-TileColor" content="#1a56db" />

        {/* Preconnect for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="google-site-verification=2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw" href="https://www.google.com/webmasters/tools/verification?hl=en&siteUrl=https://www.jan-seva.site/" />

        {/* === SCHEMA.ORG — STRUCTURED DATA === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itCompanySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Monetag Ad Script */}
        <script src="https://quge5.com/88/tag.min.js" data-zone="267555" async data-cfasync="false"></script>
      </head>
      <body className="min-h-screen bg-white text-zinc-900 antialiased relative">
        <TopOfferBanner />
        <SarkariTicker />
        {children}
        <ChatSupport />
        <QuickLeadWidget />
        <FloatingWhatsApp />
        <VisitorTracker />
        <ExitIntentPopup />
        <SocialProofPopup />
        <VideoBubble />
        <SpinWheelWidget />
      </body>
    </html>
  )
}