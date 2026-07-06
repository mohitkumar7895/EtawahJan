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
  title: 'Jan Seva Kendra Near Me | CSC Center Etawah | Website & App Development',
  description: 'Jan Seva Kendra & CSC center near me—Etawah, Bharthana. PAN card, certificates. Premium IT Services: Website Development, Mobile Apps, Games, Custom Software. Grow your business 10x! Call 9193898182 | WhatsApp 7895094129.',
  keywords: [
    'jan seva kendra near me',
    'csc center near me',
    'jan seva kendra Etawah',
    'website development company in UP',
    'best software company Uttar Pradesh',
    'mobile app developer UP',
    'game development agency UP',
    'IT company Lucknow Kanpur Agra',
    'website development company Etawah',
    'app development near me',
    'game development services',
    'custom software builder Etawah',
    'website development company in India',
    'best software company in India',
    'outsource mobile app development India',
    'affordable website development USA',
    'hire dedicated developers India',
    'IT outsourcing company India',
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
  ],
  openGraph: {
    title: 'Jan Seva Kendra Near Me | CSC Etawah | Website & App Development',
    description: 'CSC center near Etawah. PAN, certificates. Premium Website, App, Game, & Software Development. Call 9193898182.',
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
      <ToolsHomePromo />
      <ITServicesBanner />
      <Announcements />
      <Services />
      <HomeJobsFeed />
      <Reviews />
      <Footer />
    </>
  )
}
