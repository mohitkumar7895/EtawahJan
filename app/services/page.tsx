import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServicesPageComponent from '@/components/ServicesPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra Services | Aadhaar, PAN, Ration Card, Certificates Near Etawah',
  description: 'All services at Jan Seva Kendra near me: Aadhaar update, PAN card apply, income certificate, birth certificate, caste certificate, ration card, Ayushman card. Same day work, official process. Etawah, Bharthana. Call 9193898182.',
  openGraph: {
    title: 'Services | Jan Seva Kendra Etawah – Aadhaar, PAN, Certificates',
    description: 'Aadhaar, PAN, ration card, certificates—same day. Call or visit Jan Seva Kendra, Bharthana.',
    url: 'https://www.jan-seva.site/services',
  },
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServicesPageComponent />
      <Footer />
    </>
  )
}
