export type WebsiteIndustry = {
  slug: string
  name: string
  hindi: string
  tagline: string
  keywords: string[]
  features: string[]
  benefits: string[]
  faqs: { q: string; a: string }[]
}

export const WEBSITE_INDUSTRIES: WebsiteIndustry[] = [
  {
    slug: 'coaching-institute',
    name: 'Coaching Institute',
    hindi: 'कोचिंग संस्थान',
    tagline: 'Admission forms, courses, results, fee structure — sab online',
    keywords: ['coaching website', 'coaching institute website design', 'tuition website banwana'],
    features: ['Course listing & batches', 'Online admission form', 'Faculty & results page', 'Fee structure & payment info', 'Gallery & testimonials', 'WhatsApp enquiry button', 'SEO for local coaching'],
    benefits: ['Parents Google par search karein to aapka institute dikhe', '24/7 admission enquiries WhatsApp par', 'Professional look se trust badhta hai'],
    faqs: [
      { q: 'Coaching ke liye website kitne din me ban jati hai?', a: 'Basic coaching website 5-10 din, advanced admission + payment integration 2-4 hafte.' },
      { q: 'Kya Hindi + English dono content hoga?', a: 'Haan, aapke students aur parents ke liye dono languages me content.' },
    ],
  },
  {
    slug: 'school-college',
    name: 'School & College',
    hindi: 'स्कूल और कॉलेज',
    tagline: 'School website with notice board, admission, gallery',
    keywords: ['school website development', 'college website banwana', 'school management website'],
    features: ['Notice board & events', 'Admission enquiry form', 'Principal message & about', 'Photo gallery', 'Staff & facilities page', 'Download forms section', 'Mobile-friendly design'],
    benefits: ['Parents online information dekhein', 'Admission season me zyada leads', 'School ki branding strong ho'],
    faqs: [
      { q: 'School website me kya-kya pages hote hain?', a: 'Home, About, Admission, Academics, Gallery, Contact, Notice Board — aur jo aap chahein.' },
      { q: 'Kya school management software bhi banate hain?', a: 'Haan — attendance, fee record, student data ke liye custom software.' },
    ],
  },
  {
    slug: 'hospital-clinic',
    name: 'Hospital & Clinic',
    hindi: 'अस्पताल और क्लिनिक',
    tagline: 'Doctor profile, appointment booking, services list',
    keywords: ['hospital website', 'clinic website design', 'doctor website banwana'],
    features: ['Doctor profiles & specializations', 'Appointment booking form', 'Services & treatment list', 'Emergency contact highlight', 'Patient testimonials', 'Health blog section', 'Google Maps integration'],
    benefits: ['Patients online appointment book karein', 'Local SEO se clinic dikhe', 'Trust aur credibility badhe'],
    faqs: [
      { q: 'Clinic website se patients kaise milenge?', a: 'Google par "doctor near me" search me aapka clinic rank karega + WhatsApp appointment.' },
      { q: 'HIPAA level security chahiye?', a: 'Basic patient forms secure hote hain; advanced requirements discuss kar sakte hain.' },
    ],
  },
  {
    slug: 'restaurant-hotel',
    name: 'Restaurant & Hotel',
    hindi: 'रेस्टोरेंट और होटल',
    tagline: 'Menu, table booking, photos, online orders',
    keywords: ['restaurant website', 'hotel website design', 'food business website'],
    features: ['Digital menu with photos', 'Table reservation form', 'Gallery & ambience photos', 'Location & timing', 'Special offers section', 'Swiggy/Zomato links', 'WhatsApp order button'],
    benefits: ['Customers menu pehle se dekhein', 'Walk-in aur delivery dono badhe', 'Festival offers promote karein'],
    faqs: [
      { q: 'Restaurant website me online payment ho sakta hai?', a: 'Haan — Razorpay, PhonePe, UPI integration available.' },
      { q: 'Hotel booking system bhi banate hain?', a: 'Haan — room availability, booking form, admin panel.' },
    ],
  },
  {
    slug: 'retail-shop',
    name: 'Retail Shop & Store',
    hindi: 'दुकान और स्टोर',
    tagline: 'Dukan ko online store banao — poore India me bechein',
    keywords: ['shop website', 'dukan website banwana', 'retail store website India'],
    features: ['Product catalog with photos', 'WhatsApp order button', 'Category-wise products', 'Offer & discount banners', 'Shop address & timing', 'E-commerce optional', 'SEO local shop ranking'],
    benefits: ['Sirf local nahi — online customers poore India se', 'WhatsApp par direct orders', 'Professional dukan image'],
    faqs: [
      { q: 'Chhoti dukan ke liye website kitne ki padti hai?', a: 'Affordable packages — basic shop website se start, budget batayein hum quote denge.' },
      { q: 'Kya product photos aap add karenge?', a: 'Aap photos bhejein, hum website par professional layout me lagayenge.' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate & Property',
    hindi: 'रियल एस्टेट',
    tagline: 'Property listing, photos, enquiry forms',
    keywords: ['real estate website', 'property dealer website', 'builder website development'],
    features: ['Property listings with filters', 'Photo gallery & virtual tour', 'Enquiry & callback forms', 'Agent profiles', 'Location-wise projects', 'Mortgage calculator optional', 'Lead capture to WhatsApp'],
    benefits: ['Buyers online properties dekhein', 'Har property par enquiry track karein', 'Broker ya builder professional dikhe'],
    faqs: [
      { q: 'Property listing website me kitni properties add ho sakti hain?', a: 'Unlimited — admin panel se aap khud add/update kar sakte hain.' },
      { q: 'Kya Google par property search me rank hoga?', a: 'SEO setup se local property searches me visibility badhti hai.' },
    ],
  },
  {
    slug: 'manufacturing-factory',
    name: 'Manufacturing & Factory',
    hindi: 'फैक्टरी और उद्योग',
    tagline: 'B2B website — products, catalogue, export enquiry',
    keywords: ['manufacturing website', 'factory website India', 'industrial company website'],
    features: ['Product catalogue & specs', 'B2B enquiry forms', 'Certifications & quality page', 'Export & dealer network', 'Machinery & capacity info', 'Multi-language optional', 'PDF catalogue download'],
    benefits: ['Dealers aur buyers India/global se contact karein', 'Catalogue hamesha online available', 'Trade fair se pehle professional web presence'],
    faqs: [
      { q: 'Factory ke liye B2B website kyun zaroori hai?', a: 'Buyers pehle Google par supplier dhundhte hain — bina website trust kam milta hai.' },
      { q: 'Product catalogue PDF bhi banate hain?', a: 'Haan — website + downloadable catalogue dono.' },
    ],
  },
  {
    slug: 'lawyer-ca',
    name: 'Lawyer, CA & Consultant',
    hindi: 'वकील, CA और कंसल्टेंट',
    tagline: 'Professional portfolio, services, appointment booking',
    keywords: ['lawyer website', 'CA website design', 'consultant website India'],
    features: ['Professional bio & credentials', 'Practice areas / services', 'Case studies or client types', 'Blog for legal/tax updates', 'Appointment booking', 'Secure contact forms', 'Trust-building design'],
    benefits: ['Clients online credibility check karein', 'Referrals badhein professional site se', 'Articles se Google traffic'],
    faqs: [
      { q: 'Advocate ke liye website legal hai?', a: 'Haan — Bar Council guidelines ke hisaab se professional information share kar sakte hain.' },
      { q: 'CA firm ke liye client portal ban sakta hai?', a: 'Haan — document upload, status tracking wala client portal.' },
    ],
  },
  {
    slug: 'travel-agency',
    name: 'Travel Agency & Tours',
    hindi: 'ट्रैवल एजेंसी',
    tagline: 'Tour packages, booking, destination photos',
    keywords: ['travel agency website', 'tour package website', 'travel website banwana'],
    features: ['Tour packages with pricing', 'Destination galleries', 'Booking enquiry form', 'Customer reviews', 'Seasonal offers', 'Blog travel tips', 'WhatsApp trip planning'],
    benefits: ['Tourists packages compare karein online', 'Season me enquiries badhein', 'Instagram + website combo se leads'],
    faqs: [
      { q: 'Travel website me payment integration ho sakta hai?', a: 'Haan — advance booking ke liye online payment setup.' },
      { q: 'Kya hum packages khud update kar sakte hain?', a: 'Admin panel se aap packages, rates, photos update karenge.' },
    ],
  },
  {
    slug: 'gym-fitness',
    name: 'Gym & Fitness Center',
    hindi: 'जिम और फिटनेस',
    tagline: 'Membership plans, trainers, class schedule',
    keywords: ['gym website', 'fitness center website', 'yoga studio website'],
    features: ['Membership plans & pricing', 'Trainer profiles', 'Class schedule', 'Before/after gallery', 'Free trial enquiry', 'Supplement shop optional', 'Social media integration'],
    benefits: ['New members online plan dekhein', 'Trial enquiries WhatsApp par', 'Gym ki premium image'],
    faqs: [
      { q: 'Gym website se membership badhti hai?', a: 'Haan — local search + Instagram link se enquiries badhti hain.' },
      { q: 'Online membership payment?', a: 'Razorpay/UPI se membership fee collect kar sakte hain.' },
    ],
  },
  {
    slug: 'wedding-event',
    name: 'Wedding & Event Planner',
    hindi: 'शादी और इवेंट',
    tagline: 'Portfolio, packages, booking — shaadi season ke liye ready',
    keywords: ['wedding planner website', 'event management website', 'photographer website'],
    features: ['Wedding portfolio gallery', 'Package pricing', 'Event enquiry form', 'Vendor services list', 'Testimonials & reviews', 'Instagram feed embed', 'Seasonal offer banners'],
    benefits: ['Couples pehle se kaam dekhein', 'Shaadi season me zyada bookings', 'Photographer/videographer portfolio showcase'],
    faqs: [
      { q: 'Wedding planner website me video gallery ho sakti hai?', a: 'Haan — photos + YouTube/video highlights embed.' },
      { q: 'Event booking calendar chahiye?', a: 'Date availability aur booking request form add kar sakte hain.' },
    ],
  },
  {
    slug: 'ecommerce-online-store',
    name: 'E-commerce Online Store',
    hindi: 'ई-कॉमर्स ऑनलाइन स्टोर',
    tagline: 'Poore India me bechein — payment, cart, delivery',
    keywords: ['ecommerce website India', 'online store banwana', 'ecommerce website development'],
    features: ['Product cart & checkout', 'Razorpay / UPI payment', 'Order management admin', 'COD option', 'Category & search filters', 'Customer accounts', 'Shipping integration'],
    benefits: ['24/7 sales without shop timing', 'India-wide customers', 'WhatsApp + website combo sales'],
    faqs: [
      { q: 'E-commerce website kitne product support karegi?', a: '100 se 10,000+ products — scalable platform.' },
      { q: 'Kya Shiprocket / Delhivery integrate hota hai?', a: 'Haan — shipping partners integration possible hai.' },
    ],
  },
  {
    slug: 'startup-saas',
    name: 'Startup & SaaS',
    hindi: 'स्टार्टअप',
    tagline: 'Investor-ready website + product landing pages',
    keywords: ['startup website', 'saas landing page', 'tech startup website India'],
    features: ['Modern landing page design', 'Feature highlights & pricing', 'Demo request forms', 'Investor pitch section', 'Blog & changelog', 'API docs page optional', 'Fast performance & SEO'],
    benefits: ['Investors aur customers ko professional first impression', 'Product launch ke liye ready', 'Scalable as startup grows'],
    faqs: [
      { q: 'Startup MVP website kitne din me?', a: 'Landing page 3-7 din; full product site 2-4 hafte.' },
      { q: 'Kya aap MVP software bhi banate hain?', a: 'Haan — web app, admin panel, user dashboard sab.' },
    ],
  },
  {
    slug: 'agriculture-farmer',
    name: 'Agriculture & Agri Business',
    hindi: 'कृषि व्यवसाय',
    tagline: 'Seeds, fertilizer, equipment — kisan aur dealer dono ke liye',
    keywords: ['agriculture website', 'farmer business website', 'agri company website India'],
    features: ['Product catalogue agri inputs', 'Dealer locator', 'Crop advisory blog', 'Bulk order enquiry', 'Hindi content priority', 'Weather info widget optional', 'WhatsApp kisan support'],
    benefits: ['Dealers aur farmers online order enquiry', 'Mandi se aage digital presence', 'Government scheme info share'],
    faqs: [
      { q: 'Kisan ke liye simple Hindi website ban sakti hai?', a: 'Haan — easy navigation, bade buttons, WhatsApp first design.' },
      { q: 'Agri ecommerce possible hai?', a: 'Haan — seeds, fertilizer online catalogue with enquiry.' },
    ],
  },
  {
    slug: 'construction-builder',
    name: 'Construction & Builder',
    hindi: 'निर्माण और बिल्डर',
    tagline: 'Projects, ongoing sites, booking enquiry',
    keywords: ['construction company website', 'builder website India', 'contractor website'],
    features: ['Ongoing & completed projects', 'Project photo galleries', 'Floor plans & brochures', 'Site visit booking', 'Builder credentials', 'EMI calculator optional', 'Lead forms per project'],
    benefits: ['Home buyers projects online dekhein', 'Site visit enquiries badhein', 'RERA compliance info display'],
    faqs: [
      { q: 'Builder website me 3D walkthrough ho sakta hai?', a: 'Video embed aur photo tours — full 3D partner se possible.' },
      { q: 'Kitne projects ek site par dikha sakte hain?', a: 'Unlimited projects admin panel se manage.' },
    ],
  },
]

export function getIndustryBySlug(slug: string) {
  return WEBSITE_INDUSTRIES.find((i) => i.slug === slug)
}

export function getAllIndustryParams() {
  return WEBSITE_INDUSTRIES.map((i) => ({ industry: i.slug }))
}

export function getAllIndustryStateParams(states: { slug: string }[]) {
  const params: { industry: string; state: string }[] = []
  for (const ind of WEBSITE_INDUSTRIES) {
    for (const st of states) {
      params.push({ industry: ind.slug, state: st.slug })
    }
  }
  return params
}
