import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StateSitemapClient from '@/components/StateSitemapClient'
import { Map, Globe } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'State-Wise Sitemap | Local Jan Seva Kendra Directory UP',
  description: 'Explore Jan Seva Kendra and CSC center services across all 75 districts of Uttar Pradesh. Complete local government services directory.',
  keywords: [
    'jan seva kendra UP', 'csc center Uttar Pradesh', 'jan seva kendra Agra', 
    'csc center Lucknow', 'jan seva kendra Kanpur', 'jan seva kendra Noida',
    'UP csc directory', 'uttar pradesh sitemap', 'district wise csc list'
  ],
  openGraph: {
    title: 'State-Wise Sitemap | Jan Seva Kendra UP',
    url: 'https://www.jan-seva.site/state-sitemap',
  },
}

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

export default function StateSitemapPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50/30">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              
              {/* Header section */}
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-3">
                  <Map className="w-3.5 h-3.5" /> State-Wise Directory
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  State-Wise Sitemap
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  उत्तर प्रदेश के सभी 75 जिलों के लिए हमारे स्थानीय सेवा पोर्टलों की पूरी सूची। अपना जिला चुनें और तुरंत ऑनलाइन आवेदन करें।
                </p>
              </div>

              {/* StateSitemapClient filters & lists districts alphabetically */}
              <StateSitemapClient districts={UP_DISTRICTS} />

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
