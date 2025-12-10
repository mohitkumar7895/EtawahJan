import type { Metadata, Viewport } from 'next'
import './globals.css'
import Head from 'next/head'
import ChatSupport from '@/components/ChatSupport'



export const metadata: Metadata = {
  title: 'Jan Seva Kendra - Arpit Porwal',
  description: 'All Government & Private Services Under One Roof',
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
    <html lang="en">
      <Head>
        <meta name="google-site-verification" content="2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw" />

      </Head>
      <body className="min-h-screen bg-white">
        {children}
        <ChatSupport />
      </body>
      
    </html>
  )
}







