import type { Metadata, Viewport } from 'next'
import './globals.css'
import ChatSupport from '@/components/ChatSupport'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra',
  description: 'All Government & Private Services Under One Roof',
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
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw" />
        <link rel="icon" type="image/png" sizes="32x32" href="/jan-seva-logo-1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/jan-seva-logo-1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/jan-seva-logo-1.png" />
      </head>
      <body className="min-h-screen bg-white">
        {children}
        <ChatSupport />
      </body>
    </html>
  )
}







