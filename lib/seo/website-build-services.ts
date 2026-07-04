export type WebsiteBuildService = {
  slug: string
  name: string
  hindi: string
  headline: string
  description: string
  keywords: string[]
  includes: string[]
  idealFor: string[]
  process: string[]
  faqs: { q: string; a: string }[]
}

export const WEBSITE_BUILD_SERVICES: WebsiteBuildService[] = [
  {
    slug: 'business-website',
    name: 'Business Website',
    hindi: 'बिज़नेस वेबसाइट',
    headline: 'Apne business ke liye professional website banvaiye',
    description: 'Company, shop, office, firm — kisi bhi business ke liye fast, mobile-friendly, Google-ready website. Poore India me delivery.',
    keywords: ['business website banwana', 'company website India', 'professional website development'],
    includes: ['5-15 pages', 'Mobile responsive design', 'Contact & WhatsApp form', 'Google Maps', 'SEO setup', 'Free 1 month support'],
    idealFor: ['Shops', 'Offices', 'Consultants', 'Local businesses', 'Service providers'],
    process: ['WhatsApp par requirement bhejein', 'Free quote & design idea', 'Development 5-15 days', 'Review & launch', 'Google indexing help'],
    faqs: [
      { q: 'Business website ki cost kya hai?', a: 'Basic se premium tak packages — WhatsApp par apna budget batayein, quote same day.' },
      { q: 'Domain aur hosting aap dete hain?', a: 'Haan — full package me domain + hosting setup kar sakte hain.' },
    ],
  },
  {
    slug: 'ecommerce-website',
    name: 'E-commerce Website',
    hindi: 'ई-कॉमर्स वेबसाइट',
    headline: 'Online store banvaiye — poore India me bechein',
    description: 'Product catalog, shopping cart, online payment, order management — complete online dukan.',
    keywords: ['ecommerce website banwana', 'online store India', 'ecommerce development affordable'],
    includes: ['Unlimited products', 'Cart & checkout', 'Razorpay/UPI payment', 'Order admin panel', 'COD option', 'Mobile shopping experience'],
    idealFor: ['Retailers', 'Manufacturers', 'Handicraft sellers', 'Fashion brands', 'Electronics shops'],
    process: ['Products list share karein', 'Store design approve karein', 'Payment gateway setup', 'Testing & training', 'Go live + marketing tips'],
    faqs: [
      { q: 'Amazon/Flipkart ke saath apni website kyun?', a: 'Apni website par margin zyada, customer data aapka, brand aapka.' },
      { q: 'Kitne products add kar sakte hain?', a: 'Unlimited — admin panel se khud manage karein.' },
    ],
  },
  {
    slug: 'company-corporate-website',
    name: 'Company & Corporate Website',
    hindi: 'कंपनी वेबसाइट',
    headline: 'Corporate website jo clients ko impress kare',
    description: 'Professional company profile, services, team, careers, investor info — enterprise look.',
    keywords: ['corporate website development', 'company profile website', 'enterprise website India'],
    includes: ['Premium design', 'About & leadership', 'Services & case studies', 'Careers page', 'Client login optional', 'Multi-branch locations'],
    idealFor: ['IT companies', 'Consulting firms', 'Exporters', 'NGOs', 'Large shops'],
    process: ['Brand discussion', 'Wireframe & content', 'Design approval', 'Development', 'Launch & SEO'],
    faqs: [
      { q: 'Corporate website kitne din me ready?', a: 'Typically 2-4 weeks depending on pages and features.' },
      { q: 'Multi-language website possible?', a: 'Haan — Hindi, English, regional languages.' },
    ],
  },
  {
    slug: 'portfolio-website',
    name: 'Portfolio Website',
    hindi: 'पोर्टफोलियो वेबसाइट',
    headline: 'Apna kaam dikhane wali portfolio website',
    description: 'Photographers, designers, freelancers, artists — apna best work showcase karein.',
    keywords: ['portfolio website banwana', 'personal website India', 'freelancer portfolio'],
    includes: ['Gallery showcase', 'About & skills', 'Client testimonials', 'Contact form', 'Social links', 'Fast image loading'],
    idealFor: ['Photographers', 'Designers', 'Freelancers', 'Artists', 'Consultants'],
    process: ['Work samples share', 'Style choose karein', 'Gallery setup', 'Launch', 'Share on social media'],
    faqs: [
      { q: 'Portfolio website sasti padti hai?', a: 'Haan — freelancer packages affordable hain.' },
      { q: 'Instagram photos sync ho sakti hain?', a: 'Haan — Instagram feed embed kar sakte hain.' },
    ],
  },
  {
    slug: 'billing-software',
    name: 'Billing & Inventory Software',
    hindi: 'बिलिंग सॉफ्टवेयर',
    headline: 'Dukan ke liye billing software — GST bill, stock, report',
    description: 'Custom billing software with inventory, GST invoices, customer ledger, daily reports.',
    keywords: ['billing software banwana', 'inventory software India', 'GST billing software custom'],
    includes: ['GST invoice print', 'Stock in/out', 'Customer database', 'Daily sales report', 'Barcode optional', 'Multi-user login'],
    idealFor: ['Kirana stores', 'Wholesalers', 'Electronics shops', 'Pharmacies', 'Distributors'],
    process: ['Shop workflow samjhein', 'Software design', 'Development & testing', 'Training', 'Support'],
    faqs: [
      { q: 'Existing billing data migrate hoga?', a: 'Haan — Excel ya purane software se data import help.' },
      { q: 'Offline billing possible hai?', a: 'Haan — internet na ho tab bhi bill print options.' },
    ],
  },
  {
    slug: 'school-management-software',
    name: 'School Management Software',
    hindi: 'स्कूल मैनेजमेंट सॉफ्टवेयर',
    headline: 'School ke liye complete management system',
    description: 'Admission, attendance, fee, exams, results, parent SMS — ek software me sab.',
    keywords: ['school management software India', 'school ERP banwana', 'education software development'],
    includes: ['Student records', 'Fee management', 'Attendance', 'Exam & results', 'Parent portal', 'Staff management'],
    idealFor: ['Schools', 'Colleges', 'Coaching chains', 'Training institutes'],
    process: ['School needs discuss', 'Module planning', 'Development', 'Staff training', 'Academic year go-live'],
    faqs: [
      { q: 'Mobile app bhi milega parents ke liye?', a: 'Haan — parent app optional add kar sakte hain.' },
      { q: 'Kitne students support karega?', a: '100 se 10,000+ students — scalable system.' },
    ],
  },
  {
    slug: 'android-mobile-app',
    name: 'Android Mobile App',
    hindi: 'एंड्रॉइड ऐप',
    headline: 'Android app banvaiye — business ko mobile me laiye',
    description: 'Business app, booking app, delivery app, learning app — Play Store ready.',
    keywords: ['android app development India', 'mobile app banwana', 'business app developer'],
    includes: ['Native/hybrid app', 'Play Store publish help', 'Push notifications', 'Payment integration', 'Admin panel', 'Maintenance support'],
    idealFor: ['Delivery businesses', 'Booking services', 'E-commerce', 'Coaching', 'Startups'],
    process: ['App idea discuss', 'UI design', 'Development', 'Testing', 'Play Store launch'],
    faqs: [
      { q: 'Android app kitne din me banega?', a: 'Simple app 3-4 hafte, complex app 2-3 mahine.' },
      { q: 'Play Store account help milegi?', a: 'Haan — publish process me full guidance.' },
    ],
  },
  {
    slug: 'logo-branding-design',
    name: 'Logo & Branding Design',
    hindi: 'लोगो और ब्रांडिंग',
    headline: 'Professional logo, visiting card, banner design',
    description: 'Brand identity — logo, color palette, social media kit, print designs.',
    keywords: ['logo design India', 'logo banwana', 'branding design affordable'],
    includes: ['3 logo concepts', 'Final files PNG/SVG', 'Visiting card design', 'Social media templates', 'Brand color guide', 'Revision rounds'],
    idealFor: ['New businesses', 'Rebranding', 'Shops', 'Startups', 'Events'],
    process: ['Brand brief', 'Concept designs', 'Revisions', 'Final delivery', 'Use on website'],
    faqs: [
      { q: 'Logo kitne din me milega?', a: 'Usually 3-5 working days with revisions.' },
      { q: 'Kya website ke saath logo package hai?', a: 'Haan — website + logo combo discount available.' },
    ],
  },
  {
    slug: 'seo-google-ranking',
    name: 'SEO & Google Ranking',
    hindi: 'एसईओ और गूगल रैंकिंग',
    headline: 'Google par top aaiye — customers khud dhundh kar aayen',
    description: 'Website SEO, Google Business Profile, local ranking, content strategy — leads badhao.',
    keywords: ['SEO service India', 'Google ranking website', 'local SEO business'],
    includes: ['On-page SEO', 'Google Search Console setup', 'Keyword research', 'Content suggestions', 'Local SEO pages', 'Monthly report optional'],
    idealFor: ['Local businesses', 'Coaching', 'Clinics', 'Shops', 'Service companies'],
    process: ['Website audit', 'Keyword plan', 'On-page fixes', 'Content add', 'Track rankings'],
    faqs: [
      { q: 'SEO se kitne din me result?', a: 'Usually 1-3 mahine me improvement dikhta hai.' },
      { q: 'Kya aap website bhi banate hain SEO ke saath?', a: 'Haan — SEO-ready website best results deti hai.' },
    ],
  },
  {
    slug: 'whatsapp-lead-system',
    name: 'WhatsApp Lead System',
    hindi: 'व्हाट्सऐप लीड सिस्टम',
    headline: 'Website se seedha WhatsApp par leads — automatic',
    description: 'WhatsApp button, auto-reply, lead forms, CRM tracking — koi customer miss na ho.',
    keywords: ['WhatsApp business website', 'lead generation website', 'WhatsApp CRM India'],
    includes: ['WhatsApp click-to-chat', 'Lead capture forms', 'Auto welcome message', 'Lead notification', 'Simple CRM dashboard', 'Follow-up reminders'],
    idealFor: ['Shops', 'Coaching', 'Real estate', 'Services', 'Freelancers'],
    process: ['Current process samjhein', 'WhatsApp API setup', 'Website integration', 'Test leads', 'Go live'],
    faqs: [
      { q: 'Har enquiry mujhe phone par alert milega?', a: 'Haan — WhatsApp + email notification setup.' },
      { q: 'Kya existing website par add kar sakte hain?', a: 'Haan — purani website me bhi integrate karte hain.' },
    ],
  },
  {
    slug: 'landing-page-ads',
    name: 'Landing Page for Ads',
    hindi: 'लैंडिंग पेज',
    headline: 'Facebook/Google ads ke liye high-converting landing page',
    description: 'Single focused page jo ad click karne wale ko turant convert kare — form ya WhatsApp.',
    keywords: ['landing page design India', 'ad landing page', 'conversion page development'],
    includes: ['Single page design', 'Fast loading', 'Mobile first', 'Lead form', 'Tracking pixels', 'A/B test ready'],
    idealFor: ['Ad campaigns', 'Product launches', 'Coaching admissions', 'Event registrations'],
    process: ['Ad campaign goal', 'Copy + design', 'Fast build 2-5 days', 'Pixel setup', 'Launch with ads'],
    faqs: [
      { q: 'Landing page alag website se chahiye?', a: 'Haan — focused page zyada convert karti hai.' },
      { q: 'Facebook pixel setup included?', a: 'Haan — Meta & Google tracking setup.' },
    ],
  },
  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    hindi: 'वेबसाइट रीडिज़ाइन',
    headline: 'Purani website ko naya, fast aur modern banao',
    description: 'Slow, outdated website? Redesign karke speed, design aur leads sab badhao.',
    keywords: ['website redesign India', 'website upgrade', 'old website makeover'],
    includes: ['Modern UI design', 'Speed optimization', 'Mobile fix', 'SEO improvement', 'Content update', 'SSL security'],
    idealFor: ['Old websites', 'Low traffic sites', 'Non-mobile sites', 'Rebranding businesses'],
    process: ['Current site review', 'New design proposal', 'Migration', 'Testing', 'Relaunch'],
    faqs: [
      { q: 'Kya purana content safe rahega?', a: 'Haan — content migrate karte hain, kuch improve bhi.' },
      { q: 'Google ranking gir to nahi jayegi?', a: 'Proper redirect se ranking maintain hoti hai.' },
    ],
  },
]

export function getBuildServiceBySlug(slug: string) {
  return WEBSITE_BUILD_SERVICES.find((s) => s.slug === slug)
}

export function getAllBuildServiceParams() {
  return WEBSITE_BUILD_SERVICES.map((s) => ({ service: s.slug }))
}
