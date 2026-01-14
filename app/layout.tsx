import type { Metadata, Viewport } from 'next'
import './globals.css'
import ChatSupport from '@/components/ChatSupport'
import VisitorTracker from '@/components/VisitorTracker'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jan-seva.site/'),
  title: {
    default: 'Jan Seva Kendra | Best Service Center in Etawah, UP | Government & Private Services',
    template: '%s | Jan Seva Kendra'
  },
  description: 'Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services. Aadhaar Card, PAN Card, Voter ID, Ration Card, Bill Payment, GST Registration, PM Kisan, Ujjwala Yojana and more. Located at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah. Call 9193898182, 7895094129.',
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
    'CSC Center Bharthana',
    'Government Services Etawah',
    'Aadhaar Card Etawah',
    'PAN Card Etawah',
    'Voter ID Etawah',
    'Ration Card Etawah',
    'Bill Payment Etawah',
    'GST Registration Etawah',
    'PM Kisan Registration',
    'Ujjwala Yojana',
    'Service Center Etawah',
    'सेवा केंद्र इटावा',
    'जन सेवा केंद्र',
    'जन सेवा केंद्र इटावा',
    'जन सेवा केंद्र भरथाना',
    'CSC Bharthana',
    'Online Services Etawah',
    'Document Services UP',
    'Government Schemes Etawah',
    'Private Services Etawah',
    'Etawah Service Center',
    'Bharthana Service Center',
    'Best CSC Center Etawah',
    'Top Service Center Etawah'
  ],
  authors: [{ name: 'Jan Seva Kendra' }],
  creator: 'Jan Seva Kendra',
  publisher: 'Jan Seva Kendra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.jan-seva.site/',
    siteName: 'Jan Seva Kendra',
    title: 'Jan Seva Kendra | Best Service Center in Etawah, UP | Government & Private Services',
    description: 'Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services. Aadhaar Card, PAN Card, Voter ID, Ration Card, Bill Payment, GST Registration and more. Located at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah.',
    images: [
      {
        url: 'https://www.jan-seva.site/jan-seva-logo-1.png',
        width: 1200,
        height: 630,
        alt: 'Jan Seva Kendra - Service Center Etawah',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jan Seva Kendra | Best Service Center in Etawah, UP',
    description: 'Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services. Aadhaar, PAN, Voter ID, Bill Payment, GST Registration and more.',
    images: ['https://www.jan-seva.site/jan-seva-logo-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/jan-seva-logo-1.png', sizes: '32x32', type: 'image/png' },
      { url: '/jan-seva-logo-1.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/jan-seva-logo-1.png',
    apple: [
      { url: '/jan-seva-logo-1.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'google-site-verification': '2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <head>
        <meta name="google-site-verification" content="2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw" />
        <link rel="icon" type="image/png" sizes="32x32" href="/jan-seva-logo-1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/jan-seva-logo-1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/jan-seva-logo-1.png" />
        <link rel="canonical" href="https://www.jan-seva.site/" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Etawah" />
        <meta name="geo.position" content="26.7855;79.0290" />
        <meta name="ICBM" content="26.7855, 79.0290" />
        <meta name="language" content="Hindi, English" />
        <meta name="contact" content="arpitcsc1707@gmail.com" />
        <meta name="telephone" content="+9193898182, +917895094129" />
        <meta name="address" content="Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, Uttar Pradesh" />
        <meta name="author" content="Jan Seva Kendra" />
        <meta name="copyright" content="Jan Seva Kendra" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.jan-seva.site/#organization",
              "name": "Jan Seva Kendra",
              "alternateName": ["जन सेवा केंद्र", "Jan Seva Kendra Etawah", "Jan Seva Kendra Bharthana"],
              "image": "https://www.jan-seva.site/jan-seva-logo-1.png",
              "logo": "https://www.jan-seva.site/jan-seva-logo-1.png",
              "description": "Jan Seva Kendra - #1 Service Center in Etawah, UP. Complete solution for all government and private services. Aadhaar Card, PAN Card, Voter ID, Ration Card, Bill Payment, GST Registration, PM Kisan, Ujjwala Yojana and more.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mandi Trihaa, Bidhuna Road",
                "addressLocality": "Bharthana",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "206241",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.7855",
                "longitude": "79.0290"
              },
              "url": "https://www.jan-seva.site/",
              "telephone": ["+9193898182", "+917895094129"],
              "email": "arpitcsc1707@gmail.com",
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "19:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Sunday",
                  "opens": "10:00",
                  "closes": "17:00"
                }
              ],
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Etawah"
                },
                {
                  "@type": "City",
                  "name": "Bharthana"
                },
                {
                  "@type": "State",
                  "name": "Uttar Pradesh"
                }
              ],
              "serviceType": [
                "Government Services",
                "Private Services",
                "Document Services",
                "Bill Payment",
                "GST Registration",
                "Aadhaar Services",
                "PAN Card Services",
                "Voter ID Services",
                "Ration Card Services",
                "CSC Services",
                "Online Services"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              },
              "sameAs": []
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {children}
        <ChatSupport />
        <VisitorTracker />
      </body>
    </html>
  )
}







