import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Announcements from '@/components/Announcements'
import Reviews from '@/components/Reviews'
import LocalSeoContent from '@/components/LocalSeoContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra Near Me | CSC Center Etawah, Bharthana | Same Day Aadhaar, PAN, Ration Card',
  description: 'Jan Seva Kendra & CSC center near me—Etawah, Bharthana, Agra, Kanpur, Lucknow. Aadhaar update, PAN card apply, income certificate, birth certificate, ration card, Ayushman card. Same day work, official process. Call 9193898182, 7895094129 | WhatsApp Now.',
  keywords: [
    'jan seva kendra near me',
    'csc center near me',
    'jan seva kendra Etawah',
    'aadhar update near me',
    'pan card apply near me',
    'income certificate apply near me',
    'birth certificate online near me',
    'ration card apply',
    'ayushman card apply',
    'government work online near me',
    'Jan Seva Kendra Bharthana',
    'CSC Center Etawah',
    'जन सेवा केंद्र नजदीक',
    'सीएससी सेंटर इटावा',
    'Best Service Center Etawah',
  ],
  openGraph: {
    title: 'Jan Seva Kendra Near Me | CSC Etawah | Same Day Aadhaar, PAN, Certificates',
    description: 'CSC center near Etawah, Bharthana. Aadhaar update, PAN, certificates—same day, official process. Call 9193898182.',
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

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Announcements />
      <Services />
      <Reviews />
      <LocalSeoContent />
      <Footer />
    </>
  )
}
