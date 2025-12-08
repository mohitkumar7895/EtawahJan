import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jan Seva Kendra - Arpit Porwal',
  description: 'All Government & Private Services Under One Roof',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  )
}




