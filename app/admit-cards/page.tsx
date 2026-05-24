import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobPortalView from '@/components/JobPortalView';

export default function AdmitCards() {
  return (
    <>
      <Header />
      <JobPortalView initialCategory="Admit Cards" showHero={true} />
      <Footer />
    </>
  );
}
