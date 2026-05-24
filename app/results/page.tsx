import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobPortalView from '@/components/JobPortalView';

export default function Results() {
  return (
    <>
      <Header />
      <JobPortalView initialCategory="Results" showHero={true} />
      <Footer />
    </>
  );
}
