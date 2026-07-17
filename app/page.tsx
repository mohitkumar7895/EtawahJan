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
  title: '#1 Website Development India & Worldwide | Jan Seva Kendra — CSC + IT Company',
  description:
    'Best website development company — India 780+ cities + USA, Russia, UK, UAE, 65 countries. Business website, e-commerce, mobile app, custom software. CSC Etawah + premium IT. WhatsApp 7895094129 — free quote, customers badhao!',
  keywords: [
    'website development company',
    'website banwana',
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
    'ecommerce website banwana',
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
  ],
  openGraph: {
    title: '#1 Website Development — India + USA + Russia + 65 Countries | Jan Seva Kendra',
    description: 'Professional websites, apps & software. 780+ India cities + worldwide. WhatsApp 7895094129 for free quote.',
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
