import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickLinks from '@/components/QuickLinks';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Important Government Links | Jan Seva Kendra',
  description:
    'Official government portals — PAN, Voter ID, PM Kisan, Ayushman, UP portals, CSC, DigiLocker, and more. Useful links curated by Jan Seva Kendra Etawah.',
  openGraph: {
    title: 'Important Government Links | Jan Seva Kendra',
    description: 'Official government portals and useful quick links.',
    type: 'website',
  },
};

export default function GovernmentLinksPage() {
  return (
    <>
      <Header />
      <QuickLinks />
      <Footer />
    </>
  );
}
