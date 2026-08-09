import BiodataMaker from '@/components/BiodataMaker';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Maker | Online Shadi Biodata Format | Jan Seva Kendra',
  description: 'Create a beautiful, premium marriage biodata in just 2 minutes. Customize with multiple themes, layouts, upload photos, and download an HD PDF for printing or WhatsApp sharing.',
  keywords: 'marriage biodata maker, shadi biodata online, create biodata for marriage, hindi biodata, free biodata maker, wedding biodata, biodata format, matrimonial biodata, best biodata maker for marriage, marriage biodata format pdf download, marriage biodata online generator',
  alternates: {
    canonical: 'https://jan-seva.site/tools/biodata-maker',
  },
  openGraph: {
    title: 'Free Marriage Biodata Maker | HD Shadi Biodata Format',
    description: 'Create a beautiful, premium marriage biodata in just 2 minutes. Multiple themes, layouts, and instant HD PDF download for WhatsApp & Printing.',
    url: 'https://jan-seva.site/tools/biodata-maker',
    siteName: 'Website Agency / Jan Seva Kendra',
    images: [
      {
        url: 'https://jan-seva.site/og-biodata.png',
        width: 1200,
        height: 630,
        alt: 'Marriage Biodata Maker',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Marriage Biodata Maker',
    description: 'Create a beautiful, premium marriage biodata in just 2 minutes. Multiple themes, layouts, and instant HD PDF download.',
  }
};

export default function BiodataMakerPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <BiodataMaker />
    </div>
  );
}
