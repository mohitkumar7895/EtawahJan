import VisitingCardMaker from '@/components/VisitingCardMaker';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Business Visiting Card Maker | HD Business Card Generator | Jan Seva Kendra',
  description: 'Design and download professional HD business visiting cards for free. Easy-to-use editor, multiple templates, instant PDF download for printing.',
  keywords: 'visiting card maker, free business card generator, create visiting card online, business card maker free, visiting card format, hd visiting card maker, print business card online, online visiting card creator, dukaan visiting card',
  alternates: {
    canonical: 'https://jan-seva.site/tools/visiting-card',
  },
  openGraph: {
    title: 'Free Business Visiting Card Maker | HD Business Cards',
    description: 'Design and download professional HD business visiting cards for free. Easy-to-use editor, instant PDF download.',
    url: 'https://jan-seva.site/tools/visiting-card',
    siteName: 'Website Agency / Jan Seva Kendra',
    images: [
      {
        url: 'https://jan-seva.site/og-visiting-card.png',
        width: 1200,
        height: 630,
        alt: 'Business Visiting Card Maker',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Business Visiting Card Maker',
    description: 'Design and download professional HD business visiting cards for free. Easy-to-use editor, instant PDF download.',
  }
};

export default function VisitingCardPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <VisitingCardMaker />
    </main>
  );
}
