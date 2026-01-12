import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Announcements from '@/components/Announcements'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra | Best Service Center in Etawah, UP | Government & Private Services',
  description: 'Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services. Aadhaar Card, PAN Card, Voter ID, Ration Card, Bill Payment, GST Registration, PM Kisan, Ujjwala Yojana and more. Located at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah. Call 7895094129, 9193898182.',
  keywords: [
    'Jan Seva Kendra',
    'Jan Seva Kendra Etawah',
    'Jan Seva Kendra Bharthana',
    'Jan Seva Kendra UP',
    'Jan Seva Kendra Etawah UP',
    'Jan Seva Kendra near me',
    'Jan Seva Kendra Etawah contact',
    'Jan Seva Kendra phone number',
    'CSC Center Etawah',
    'Government Services Etawah',
    'Aadhaar Card Etawah',
    'PAN Card Etawah',
    'Voter ID Etawah',
    'Service Center Etawah',
    'जन सेवा केंद्र',
    'जन सेवा केंद्र इटावा',
    'Best Service Center Etawah'
  ],
  openGraph: {
    title: 'Jan Seva Kendra | Best Service Center in Etawah, UP',
    description: 'Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services.',
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
      <Footer />
    </>
  )
}
