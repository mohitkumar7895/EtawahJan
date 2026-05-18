import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServicesPageComponent from '@/components/ServicesPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra Services | PAN, Ration Card, Certificates Near Etawah',
  description: 'All services at Jan Seva Kendra near me: PAN card apply, income certificate, birth certificate, caste certificate, ration card, Ayushman card. Same day work, official process. Etawah, Bharthana. Call 9193898182.',
  keywords: [
    'jan seva kendra services', 'pan card apply online', 'income certificate up',
    'ration card online apply', 'birth certificate up', 'ayushman card kaise banaye',
    'csc center services list', 'jan seva kendra near me', 'Etawah csc center',
    'best jan seva kendra bharthana', 'online form filling near me'
  ],
  openGraph: {
    title: 'Services | Jan Seva Kendra Etawah – PAN, Certificates',
    description: 'PAN, ration card, certificates—same day. Call or visit Jan Seva Kendra, Bharthana.',
    url: 'https://www.jan-seva.site/services',
  },
}

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Government & Private Services at Jan Seva Kendra",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jan Seva Kendra",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Mandi Trihaa, Bidhuna Road",
        "addressLocality": "Bharthana",
        "addressRegion": "UP",
        "postalCode": "206241",
        "addressCountry": "IN"
      },
      "telephone": "+919193898182"
    },
    "description": "Apply for PAN Card, Ration Card, Income Certificate, Birth Certificate, Driving License, and IT services like Website and App Development in Etawah.",
    "serviceType": ["Government Service", "IT Service", "Document Service"],
    "areaServed": {
      "@type": "City",
      "name": "Etawah"
    }
  };

  return (
    <>
      {/* JSON-LD Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header />
      <ServicesPageComponent />
      <Footer />
    </>
  )
}
