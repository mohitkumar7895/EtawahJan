import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FileText, MapPin, Globe, ArrowRight, Shield, Award, Users, Phone, HelpCircle, Briefcase, Info, List, Link2 } from 'lucide-react'
import type { Metadata } from 'next'
import { connectDB, isDBConnected } from '@/lib/db'
import SitemapLink from '@/models/SitemapLink'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sitemap | Explore All Pages & Services',
  description: 'Complete HTML sitemap of Jan Seva Kendra. Find government schemes, document services, and premium IT services across UP easily.',
  openGraph: {
    title: 'Sitemap | Jan Seva Kendra',
    url: 'https://www.jan-seva.site/sitemap',
  },
}

export default async function HTMLSitemapPage() {
  // Fetch custom admin sitemaps dynamically from database
  let customSitemaps: any[] = []
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL
      if (mongoUri && mongoUri.trim() !== '') {
        await connectDB()
      }
    }
    if (isDBConnected()) {
      customSitemaps = await SitemapLink.find({ isActive: true }).sort({ createdAt: -1 }).lean() as any[]
    }
  } catch (err) {
    console.error("Error loading custom links for sitemap page:", err)
  }

  const mainLinks = [
    { name: 'Home / मुख्य पृष्ठ', href: '/' },
    { name: 'About Us / हमारे बारे में', href: '/about' },
    { name: 'Services / हमारी सेवाएं', href: '/services' },
    { name: 'Track Application / आवेदन स्थिति', href: '/track' },
    { name: 'FAQ / अक्सर पूछे जाने वाले सवाल', href: '/faq' },
    { name: 'Contact Us / संपर्क करें', href: '/contact' },
    { name: 'Sarkari Vacancies / सरकारी नौकरियाँ', href: '/vacancies' },
    { name: 'Government Links / महत्वपूर्ण सरकारी लिंक्स', href: '/government-links' },
    { name: 'Blog & News / ब्लॉग और समाचार', href: '/blog' },
  ]

  const serviceCategories = [
    {
      title: 'Document Services / दस्तावेज सेवाएं',
      services: ['PAN Card', 'Voter ID Card', 'Ration Card', 'Ration Card Update', 'Passport Services', 'E-Shram Card', 'Digital Signature Certificate'],
    },
    {
      title: 'Certificates / प्रमाण पत्र',
      services: ['Birth Certificate', 'Birth Certificate Correction', 'Death Certificate', 'Death Certificate Correction', 'Marriage Certificate', 'Income Certificate', 'Caste Certificate', 'Domicile Certificate'],
    },
    {
      title: 'IT & Software Services / आईटी सेवाएं',
      services: ['Website Development', 'Mobile App Development', 'Game Development', 'Graphic Design', 'Custom Software'],
    },
    {
      title: 'Government Schemes / सरकारी योजनाएं',
      services: ['PM Awas Yojana', 'Ujjwala Yojana', 'PM Kisan Registration', 'Kisan Credit Card', 'PM Mudra Loan', 'Scholarship Applications'],
    },
    {
      title: 'Utility & Pension / बिल और पेंशन',
      services: ['Electricity Bill Payment', 'Light Connection (Jhatpat)', 'Old Age Pension', 'Widow Pension', 'Disability Pension', 'Payment Withdrawal (AEPS)'],
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50/30">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              
              {/* Header section */}
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3">
                  <Globe className="w-3.5 h-3.5" /> HTML Sitemap Directory
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Website Sitemap
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  हमारी सभी सेवाओं, महत्वपूर्ण लिंक्स और शहर-वार साइटमैप को आसानी से एक्सेस करने के लिए नीचे दिए गए लिंक्स का उपयोग करें।
                </p>
              </div>

              {/* Sitemap Index Quick Links */}
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-600" /> Sitemap Quick Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link 
                    href="/sitemap" 
                    className="flex items-center justify-between p-4 rounded-xl bg-blue-50/60 border border-blue-100 hover:bg-blue-50 hover:border-blue-300 transition group"
                  >
                    <div>
                      <span className="font-bold text-blue-900 text-sm sm:text-base block">HTML Sitemap</span>
                      <span className="text-xs text-blue-600">All pages & services index</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
                  </Link>

                  <Link 
                    href="/state-sitemap" 
                    className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300 transition group"
                  >
                    <div>
                      <span className="font-bold text-indigo-900 text-sm sm:text-base block">State Sitemap</span>
                      <span className="text-xs text-indigo-600">All 75 UP Districts directory</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
                  </Link>

                  <a 
                    href="/sitemap.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300 transition group"
                  >
                    <div>
                      <span className="font-bold text-emerald-900 text-sm sm:text-base block">XML Sitemap</span>
                      <span className="text-xs text-emerald-600">For Google Search Console</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
                  </a>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Column 1: Main Pages */}
                <div className="md:col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 flex flex-col h-fit">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" /> Main Pages
                  </h2>
                  <ul className="space-y-4">
                    {mainLinks.map((link, idx) => (
                      <li key={idx}>
                        <Link 
                          href={link.href}
                          className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 hover:translate-x-1 transition duration-150"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Columns 2-3: Services & Admin-Defined Links */}
                <div className="md:col-span-2 space-y-6 sm:space-y-8">
                  
                  {/* Admin-Created Custom Sitemap Links */}
                  {customSitemaps.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-blue-100 flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-blue-600" /> Custom Links / महत्वपूर्ण लिंक्स (Admin)
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {customSitemaps.map((link: any, idx: number) => {
                          // Format URL in case of relative paths
                          let displayUrl = link.url;
                          const isAbsolute = displayUrl.startsWith('http://') || displayUrl.startsWith('https://');
                          
                          return (
                            <a 
                              key={idx}
                              href={displayUrl}
                              target={isAbsolute ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="flex flex-col p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition duration-150 group"
                            >
                              <span className="font-bold text-blue-900 text-sm sm:text-base group-hover:text-blue-700 transition">
                                {link.title}
                              </span>
                              {link.description && (
                                <span className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                  {link.description}
                                </span>
                              )}
                              <span className="text-[10px] font-semibold text-blue-600 mt-2 flex items-center gap-1">
                                {isAbsolute ? 'External Link ↗' : 'Internal Link →'}
                              </span>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Categorized Services */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" /> Categorized Services
                    </h2>
                    <div className="space-y-6">
                      {serviceCategories.map((cat, idx) => (
                        <div key={idx} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                          <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                            {cat.title}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            {cat.services.map((service, sIdx) => (
                              <Link 
                                href="/services" 
                                key={sIdx}
                                className="flex items-center gap-2 py-1 text-gray-600 hover:text-blue-600 hover:translate-x-0.5 transition duration-150"
                              >
                                <span className="text-blue-500">✓</span>
                                <span>{service}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Help CTA Block */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2 justify-center sm:justify-start">
                      <Phone className="w-5 h-5" /> Need Assistance? / सहायता चाहिए?
                    </h3>
                    <p className="text-blue-100 text-sm mb-4 leading-relaxed text-center sm:text-left">
                      अगर आपको कोई भी सर्विस नहीं मिल रही है, तो आप हमारी सहायता टीम से सीधे संपर्क कर सकते हैं। हम आपकी तुरंत सहायता करेंगे।
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center sm:justify-start">
                      <a 
                        href="tel:9193898182"
                        className="bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm w-full sm:w-auto text-center"
                      >
                        Call: 9193898182
                      </a>
                      <a 
                        href="https://wa.me/9193898182"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
                      >
                        💬 WhatsApp Now
                      </a>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
