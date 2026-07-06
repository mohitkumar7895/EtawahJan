import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Phone, CheckCircle, Clock, Shield, Award, ArrowRight, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import {
  AADHAAR_ADDRESS_CORRECTION,
  isEtawahDistrict,
} from '@/lib/etawah-only-services'

const UP_DISTRICTS = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh',
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 
  'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr',
  'Chandauli', 'Chitrakoot',
  'Deoria',
  'Etah', 'Etawah',
  'Farrukhabad', 'Fatehpur', 'Firozabad',
  'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
  'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
  'Jalaun', 'Jaunpur', 'Jhansi',
  'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
  'Lalitpur', 'Lucknow',
  'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 
  'Moradabad', 'Muzaffarnagar',
  'Pilibhit', 'Pratapgarh', 'Prayagraj',
  'Raebareli', 'Rampur',
  'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shrawasti', 
  'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
  'Unnao',
  'Varanasi'
]

interface PageProps {
  params: {
    district: string
  }
}

export async function generateStaticParams() {
  return UP_DISTRICTS.map((d) => ({
    district: d.toLowerCase(),
  }))
}

function capitalizeDistrict(district: string): string {
  // Find matching district in list to preserve correct capitalization (e.g. Gautam Buddha Nagar)
  const match = UP_DISTRICTS.find(d => d.toLowerCase() === district.toLowerCase())
  if (match) return match
  return district.charAt(0).toUpperCase() + district.slice(1)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const districtName = capitalizeDistrict(params.district)
  const isEtawah = isEtawahDistrict(params.district)
  const aadhaarKeyword = isEtawah ? 'aadhaar address correction' : 'pan card apply'
  return {
    title: `Jan Seva Kendra ${districtName} | CSC Center Near Me in ${districtName}`,
    description: isEtawah
      ? `Government authorized Jan Seva Kendra in Etawah, Uttar Pradesh. Aadhaar address correction, PAN card, income/domicile/death certificates, banking — official process.`
      : `Government authorized Jan Seva Kendra and CSC center in ${districtName}, Uttar Pradesh. PAN card, caste/birth certificates, ration card, and government schemes in ${districtName}.`,
    keywords: [
      `jan seva kendra ${districtName}`,
      `csc center ${districtName}`,
      `${aadhaarKeyword} ${districtName}`,
      `pan card apply ${districtName}`,
      `common service centre ${districtName}`,
      `government office ${districtName}`,
      `jan seva kendra near me in ${districtName}`
    ],
    openGraph: {
      title: `Jan Seva Kendra ${districtName} | CSC Center UP`,
      description: isEtawah
        ? `Authorized CSC center in Etawah. Aadhaar address correction, certificates, banking — same day official process.`
        : `Authorized CSC center and Jan Seva Kendra services in ${districtName}, UP. PAN, certificates help with official process.`,
      url: `https://www.jan-seva.site/district/${params.district.toLowerCase()}`,
    }
  }
}

export default function DistrictPage({ params }: PageProps) {
  const districtName = capitalizeDistrict(params.district)
  const isEtawah = isEtawahDistrict(params.district)

  const heroDescription = isEtawah
    ? `${districtName} के सभी निवासियों के लिए सरकारी और निजी ऑनलाइन डिजिटल सेवाएं। Aadhaar address correction, PAN card, income/domicile/death certificates, banking—official process, fast help, no agent required.`
    : `${districtName} के सभी निवासियों के लिए सरकारी और निजी ऑनलाइन डिजिटल सेवाएं। PAN card, caste/birth certificates, ration card, government schemes—official process, fast help, no agent required. (Aadhaar, banking, income, domicile, death certificates — केवल इटावा केंद्र पर।)`

  const districtServices = isEtawah
    ? [
        { title: AADHAAR_ADDRESS_CORRECTION, desc: 'Aadhaar address correction only — name/photo/mobile updates not offered here.' },
        { title: 'PAN Card Apply & Corrections', desc: 'New PAN card applications, reprints, and name/DOB updates.' },
        { title: 'Official Certificates', desc: 'Income, domicile (nivas), death (martu), caste, and birth certificates.' },
        { title: 'Banking & Money Transfer', desc: 'Banking services, AEPS, and remittance at Etawah center.' },
        { title: 'Ration & Voter Card', desc: 'Family details updating, online registration, and printing.' },
        { title: 'Government Schemes', desc: 'Scholarships, PM Kisan registration, and Ujjwala applications.' },
        { title: 'IT & Software Solutions', desc: 'Premium website, app, and custom software development.' },
      ]
    : [
        { title: 'PAN Card Apply & Corrections', desc: 'New PAN card applications, reprints, and name/DOB updates.' },
        { title: 'Official Certificates', desc: 'Caste certificate, birth certificate, and marriage certificate.' },
        { title: 'Ration & Voter Card', desc: 'Family details updating, online registration, and printing.' },
        { title: 'Government Schemes', desc: 'Scholarships, PM Kisan registration, and Ujjwala applications.' },
        { title: 'IT & Software Solutions', desc: 'Premium website, app, and custom software development.' },
      ]

  const schemaDescription = isEtawah
    ? `Government authorized CSC and Jan Seva Kendra in Etawah. Aadhaar address correction, PAN, income/domicile/death certificates, banking.`
    : `Government authorized CSC and Jan Seva Kendra services in ${districtName}, Uttar Pradesh. PAN card, caste/birth certificates, ration card, schemes.`

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOffice",
    "@id": `https://www.jan-seva.site/district/${params.district.toLowerCase()}#localbusiness`,
    "name": `Jan Seva Kendra ${districtName}`,
    "alternateName": [
      `जन सेवा केंद्र ${districtName}`,
      `CSC Center ${districtName}`,
      `Common Service Centre ${districtName}`
    ],
    "description": schemaDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": districtName,
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "url": `https://www.jan-seva.site/district/${params.district.toLowerCase()}`,
    "telephone": ["+919193898182", "+917895094129"],
    "priceRange": "₹ - ₹₹",
    "areaServed": {
      "@type": "City",
      "name": districtName
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Jan Seva Kendra near me in ${districtName} kahan hai?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Jan Seva Kendra aur CSC center services ${districtName} ke sabhi nagrik online access kar sakte hain. Contact Number 9193898182 par call ya WhatsApp karke apni online query submit kar sakte hain.`
        }
      },
      {
        "@type": "Question",
        "name": isEtawah
          ? `${districtName} mein Aadhaar address correction kaise karein?`
          : `${districtName} mein PAN card apply kaise karein?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isEtawah
            ? `Etawah ke nagrik Aadhaar address correction ke liye hamare portal ya helpline 9193898182 par contact kar sakte hain. Sirf address correction — name/photo/mobile update yahan nahi hota.`
            : `${districtName} ke nagrik PAN card, caste/birth certificates ke liye hamare portal ya helpline 9193898182 par digital document submission dwara apply kar sakte hain. Aadhaar, banking, income, domicile, death certificates keval Etawah center par uplabdh hain.`
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50/30">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* Dynamic Local Hero Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600/10 w-64 h-64 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                <div className="relative">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {districtName}, Uttar Pradesh
                  </span>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                    Jan Seva Kendra {districtName} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      CSC Center & Digital Services
                    </span>
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl">
                    {heroDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="tel:9193898182"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition duration-150 shadow-md shadow-blue-200 text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4" /> Call Now: 9193898182
                    </a>
                    <a 
                      href="https://wa.me/7895094129"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition duration-150 shadow-md shadow-green-200 text-sm sm:text-base"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp: 7895094129 / 9193898182
                    </a>
                  </div>
                </div>
              </div>

              {/* Localized Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
                <div className="flex items-center gap-3 bg-blue-50/60 backdrop-blur rounded-2xl p-4 sm:p-5 border border-blue-100/50">
                  <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block text-sm sm:text-base">Same Day Work</span>
                    <span className="text-xs sm:text-sm text-gray-500">Fast application process</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-50/60 backdrop-blur rounded-2xl p-4 sm:p-5 border border-green-100/50">
                  <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block text-sm sm:text-base">Official CSC</span>
                    <span className="text-xs sm:text-sm text-gray-500">Government processes</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-indigo-50/60 backdrop-blur rounded-2xl p-4 sm:p-5 border border-indigo-100/50">
                  <Award className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block text-sm sm:text-base">100% Reliable</span>
                    <span className="text-xs sm:text-sm text-gray-500">Secure documents check</span>
                  </div>
                </div>
              </div>

              {/* District Specific Services List */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 mb-10 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Services Available in {districtName} / {districtName} में उपलब्ध डिजिटल सेवाएं
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {districtServices.map((svc) => (
                    <div key={svc.title} className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-800 block text-sm sm:text-base">{svc.title}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{svc.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {!isEtawah && (
                  <p className="mt-6 text-xs sm:text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <strong>नोट:</strong> Aadhaar address correction, Banking, Income (Aay), Domicile (Nivas), Death (Martu) certificate — ये सेवाएं केवल <strong>इटावा</strong> जन सेवा केंद्र पर उपलब्ध हैं, {districtName} में नहीं।
                  </p>
                )}

                <div className="mt-8 text-center">
                  <Link 
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold hover:underline transition text-sm sm:text-base"
                  >
                    Explore all services in details / सभी सेवाओं की जानकारी <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Dynamic Local FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  Frequently Asked Questions / अक्सर पूछे जाने वाले सवाल
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                      Q1. How to reach Jan Seva Kendra in {districtName}?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed pl-2 sm:pl-4 border-l-2 border-blue-500">
                      {districtName} के नागरिक सभी सीएससी ऑनलाइन सेवाएं प्राप्त करने के लिए हमारे हेल्पलाइन नंबर 9193898182 पर संपर्क कर सकते हैं या दस्तावेज़ ऑनलाइन सबमिट कर सकते हैं।
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                      {isEtawah
                        ? `Q2. What documents are needed for Income or Domicile certificate in ${districtName}?`
                        : `Q2. What documents are needed for Caste certificate in ${districtName}?`}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed pl-2 sm:pl-4 border-l-2 border-blue-500">
                      {isEtawah
                        ? 'आय, निवास (domicile) या मृत्यु प्रमाण पत्र के लिए आधार कार्ड, स्वप्रमाणित घोषणा पत्र, संस्तुति और पासपोर्ट साइज फोटो की आवश्यकता होती है।'
                        : 'जाति प्रमाण पत्र के लिए आधार कार्ड, पता प्रमाण, माता-पिता का जाति प्रमाणपत्र और स्कूल लीविंग सर्टिफिकेट की आवश्यकता होती है। आय/निवास/मृत्यु प्रमाण पत्र केवल इटावा केंद्र पर बनते हैं।'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                      Q3. Is same-day digital signature certificate validation available in {districtName}?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed pl-2 sm:pl-4 border-l-2 border-blue-500">
                      हाँ, हम डिजिटल सिग्नेचर सर्टिफिकेट (DSC) सेवाएं प्रदान करते हैं, जिसमें दस्तावेज़ सत्यापन के बाद उसी दिन प्रक्रिया शुरू की जाती है।
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to state directory link */}
              <div className="text-center">
                <Link 
                  href="/state-sitemap"
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold transition text-sm sm:text-base"
                >
                  ← Back to State-Wise Sitemap / राज्य-वार साइटमैप पर वापस जाएं
                </Link>
              </div>

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
