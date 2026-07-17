/** Shared high-converting SEO copy for website lead pages (India + Global). */

export const WHATSAPP = '7895094129'
export const WHATSAPP_LINK = 'https://wa.me/917895094129'
export const PHONE = '9193898182'

export function globalCountryMeta(countryName: string) {
  return {
    title: `#1 Website Development ${countryName} | Custom Web Design, Apps & Software — Free Quote`,
    description: `Top-rated website development company for ${countryName}. Business websites, e-commerce, mobile apps & custom software — 50–70% cheaper than local agencies. English support, fast delivery. WhatsApp ${WHATSAPP} · Free quote in 24hrs.`,
    keywords: [
      `website development ${countryName}`,
      `web design ${countryName}`,
      `best website developer ${countryName}`,
      `custom software ${countryName}`,
      `ecommerce website ${countryName}`,
      `mobile app development ${countryName}`,
      `affordable website ${countryName}`,
      `hire web developer ${countryName}`,
      `website company ${countryName}`,
      `professional website ${countryName}`,
    ],
  }
}

export function globalCityMeta(cityName: string, countryName: string) {
  const label = `${cityName}, ${countryName}`
  return {
    title: `Best Website Developer ${label} | Web Design & Software Company — Free Quote`,
    description: `Looking for website development in ${label}? We build business sites, e-commerce stores & mobile apps for ${cityName} businesses. Remote delivery, affordable pricing. WhatsApp ${WHATSAPP} today.`,
    keywords: [
      `website development ${cityName}`,
      `web design ${cityName}`,
      `website developer ${cityName} ${countryName}`,
      `software company ${cityName}`,
      `business website ${cityName}`,
      `ecommerce ${cityName}`,
      `mobile app developer ${cityName}`,
      `cheap website ${cityName}`,
    ],
  }
}

export function indiaStateMeta(stateName: string) {
  return {
    title: `Website Banwana ${stateName} | #1 Software Company ${stateName} — Free Quote`,
    description: `${stateName} me best website development company — business website, e-commerce, billing software, mobile app. All districts covered. WhatsApp ${WHATSAPP} | Call ${PHONE}. Same day free quote.`,
    keywords: [
      `website banwana ${stateName}`,
      `website development ${stateName}`,
      `software company ${stateName}`,
      `web developer ${stateName}`,
      `business website ${stateName}`,
      `mobile app ${stateName}`,
      `website banwane wala ${stateName}`,
    ],
  }
}

export function indiaDistrictMeta(districtName: string, stateName: string) {
  const label = `${districtName}, ${stateName}`
  return {
    title: `Website Development ${label} | Web Design ${districtName} — Jan Seva Kendra`,
    description: `${label} me website & software banwana? Business site, e-commerce, app — affordable price, WhatsApp leads, Google SEO. WhatsApp ${WHATSAPP}. Free consultation.`,
    keywords: [
      `website development ${districtName}`,
      `website banwana ${districtName}`,
      `software company ${districtName}`,
      `web developer ${districtName}`,
      `website developer near me ${districtName}`,
    ],
  }
}

export function industryWorldMeta(industryName: string, countryName: string) {
  return {
    title: `#1 ${industryName} Website Development ${countryName} | ${industryName} Web Design — Free Quote`,
    description: `Top ${industryName.toLowerCase()} website development in ${countryName}. Professional design, WhatsApp leads, Google SEO, e-commerce ready. Save 50–70% vs local agencies. WhatsApp ${WHATSAPP} — free quote in 24hrs.`,
    keywords: [
      `${industryName} website ${countryName}`,
      `${industryName} website development ${countryName}`,
      `${industryName} web design ${countryName}`,
      `${industryName.toLowerCase()} website developer ${countryName}`,
      `best ${industryName.toLowerCase()} website ${countryName}`,
      `${industryName} website company ${countryName}`,
    ],
  }
}

export const GLOBAL_TRUST_POINTS = [
  '65+ countries served — USA, Russia, UK, UAE, Canada, Australia, Europe, Asia',
  'Save 50–70% vs local agencies — same professional quality',
  '5–14 day delivery for business websites · 2–8 weeks for apps & software',
  'Mobile-first design · WhatsApp lead buttons · Google SEO built-in',
  'English + Hindi support · Video calls · Milestone payments',
  '1000+ digital projects delivered · CSC + IT company since years',
]

export const GLOBAL_PROCESS_STEPS = [
  { step: '1', title: 'WhatsApp your requirement', text: 'Tell us your business type, pages needed, and budget. Reply within hours.' },
  { step: '2', title: 'Free custom quote', text: 'Transparent pricing — no hidden fees. Choose package that fits.' },
  { step: '3', title: 'Design & development', text: 'We share preview links. You approve before final delivery.' },
  { step: '4', title: 'Launch + SEO setup', text: 'Website live with Google sitemap, speed optimization & lead forms.' },
  { step: '5', title: 'Support after launch', text: 'Minor edits included. Long-term maintenance available.' },
]

export function getGlobalFaqs(location: string, countryName: string) {
  return [
    {
      q: `Who is the best website developer in ${location}?`,
      a: `Jan Seva Kendra is a top-rated remote website development team serving ${location} and ${countryName}. We specialize in business websites, e-commerce, mobile apps and custom software at affordable India-based pricing with English support. WhatsApp ${WHATSAPP} for a free quote.`,
    },
    {
      q: `How much does a website cost in ${location}?`,
      a: `A professional 5-page business website starts at very affordable rates compared to ${countryName} local agencies. E-commerce and custom software are quoted based on features. Message WhatsApp ${WHATSAPP} with your requirements — free custom quote within 24 hours for ${location}.`,
    },
    {
      q: `Can I hire you if I live in ${countryName}?`,
      a: `Absolutely. We work with ${countryName} clients 100% remotely via WhatsApp, email and Zoom/Google Meet. Time zone friendly communication. Many ${countryName} businesses choose us to save cost without sacrificing quality.`,
    },
    {
      q: `Do you build e-commerce websites for ${location}?`,
      a: `Yes — full online stores with product catalog, cart, payment integration, order notifications and mobile-friendly design. Perfect for retail, fashion, electronics and local ${location} businesses going online.`,
    },
    {
      q: `How long does website development take for ${location}?`,
      a: `Standard business website: 5–14 days. E-commerce: 2–4 weeks. Mobile app or custom software: 2–8 weeks. Rush delivery available — mention "urgent" on WhatsApp.`,
    },
    {
      q: `Will my ${location} website rank on Google?`,
      a: `Every website includes SEO fundamentals: optimized titles, meta descriptions, fast loading, mobile responsive design, sitemap submission and local keywords for ${location}. Advanced SEO packages available for competitive markets in ${countryName}.`,
    },
    {
      q: `Do you make mobile apps for ${countryName} businesses?`,
      a: `Yes — Android and iOS apps for booking, delivery, e-commerce, services and business dashboards. Often bundled with website for ${location} clients at discounted combo pricing.`,
    },
    {
      q: `What payment methods do ${countryName} clients use?`,
      a: `Bank transfer, international wire, PayPal-friendly invoicing, UPI (for India clients), milestone payments — 50% to start, 50% on delivery. Official invoice provided for ${countryName} businesses.`,
    },
    {
      q: `Why choose Jan Seva Kendra over a ${countryName} local agency?`,
      a: `Same professional design and functionality at 50–70% lower cost. Faster turnaround. Direct WhatsApp communication with developers — no middlemen. Proven track record across USA, Russia, UK, UAE and 65+ countries.`,
    },
    {
      q: `How do I start my website project in ${location}?`,
      a: `WhatsApp ${WHATSAPP} or call ${PHONE}. Write: business name, what you need (website/app/software), and city (${location}). We respond quickly with quote and timeline.`,
    },
  ]
}

export function getIndiaFaqs(location: string, stateName: string) {
  return [
    {
      q: `${location} me sabse acha website developer kaun hai?`,
      a: `Jan Seva Kendra ${location} ke businesses ke liye professional website, e-commerce, mobile app aur billing software banata hai. Affordable price, WhatsApp leads, Google SEO — WhatsApp ${WHATSAPP} par free quote lein.`,
    },
    {
      q: `${location} me website banwane ki cost kitni hai?`,
      a: `Basic business website se lekar e-commerce tak packages alag hain. Chhoti dukan se bade company tak sab ke liye plan hai. WhatsApp ${WHATSAPP} par business type aur budget bhejein — ${location} ke liye free customized quote.`,
    },
    {
      q: `Kya ${stateName} ke bahar se bhi website banwa sakte hain?`,
      a: `Haan — hum poore India aur 65+ countries me delivery karte hain. ${location} se ho ya kahi bhi — video call, WhatsApp se poora project manage hota hai.`,
    },
    {
      q: `Website Google par ${location} me kaise dikhegi?`,
      a: `Har website me SEO setup: page titles, descriptions, mobile speed, sitemap. "${location} website development" jaise local keywords target hote hain. Extra SEO package bhi available.`,
    },
    {
      q: `E-commerce website ${location} ke liye banate hain?`,
      a: `Haan — product catalog, cart, Razorpay/UPI payment, order WhatsApp notification, mobile-friendly design. Online dukan ${location} se poore India me bech sakte hain.`,
    },
    {
      q: `Kitne din me website ready hogi?`,
      a: `Simple 5-page website: 5–10 din. E-commerce: 2–4 hafte. Mobile app ya software: 2–6 hafte. Urgent ke liye WhatsApp par "urgent" likhein.`,
    },
    {
      q: `Software aur website dono ek saath?`,
      a: `Haan — billing software + website, school website + management app, shop website + inventory — combo me discount.`,
    },
    {
      q: `Payment kaise hogi?`,
      a: `50% advance, 50% delivery par. UPI, bank transfer. Proper invoice/bill milega.`,
    },
    {
      q: `Mobile app bhi banate hain ${location} ke liye?`,
      a: `Haan — Android/iOS app delivery, booking, e-commerce, services ke liye. Website ke saath combo package me sasta.`,
    },
    {
      q: `Abhi kaise start karein?`,
      a: `WhatsApp ${WHATSAPP} ya call ${PHONE}. Business name, kya chahiye (website/app), aur location (${location}) likh kar bhejein.`,
    },
  ]
}

export const TOP_GLOBAL_SEARCHES = [
  { q: 'hire web developer affordable', href: '/website-world/united-states' },
  { q: 'website development company USA', href: '/website-world/united-states' },
  { q: 'web design Russia', href: '/website-world/russia' },
  { q: 'website developer UK London', href: '/website-world/united-kingdom/london' },
  { q: 'ecommerce website Dubai', href: '/website-world/united-arab-emirates/dubai' },
  { q: 'custom software development Canada', href: '/website-world/canada' },
  { q: 'mobile app development Australia', href: '/website-world/australia' },
  { q: 'cheap website development India for USA', href: '/build-website' },
]

export const TOP_INDIA_SEARCHES = [
  { q: 'website banwana near me', href: '/build-website' },
  { q: 'website development Delhi', href: '/website/delhi/new-delhi' },
  { q: 'website company Mumbai', href: '/website/maharashtra/mumbai-city' },
  { q: 'software banwana Lucknow', href: '/website/uttar-pradesh/lucknow' },
  { q: 'business website Bangalore', href: '/website/karnataka/bengaluru-urban' },
  { q: 'ecommerce website banwana', href: '/build-website/ecommerce-website' },
  { q: 'coaching website banwana', href: '/website-for/coaching-institute' },
]
