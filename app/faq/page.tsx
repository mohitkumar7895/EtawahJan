import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQComponent from '@/components/FAQ';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Jan Seva Kendra Near Me – Aadhaar, PAN, Ration Card, Certificates Etawah',
  description: 'Jan Seva Kendra near me FAQ: Where is CSC center Etawah? Aadhaar update same day? PAN card apply, income certificate, ration card, Ayushman card. Call 9193898182, WhatsApp now.',
  openGraph: {
    title: 'FAQ | Jan Seva Kendra Etawah – Aadhaar, PAN, Certificates',
    url: 'https://www.jan-seva.site/faq',
  },
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <FAQComponent />
      <Footer />
    </>
  );
}

