import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SarkariJobsPortal from '@/components/SarkariJobsPortal';

function PortalFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-[#f4f6fb]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
    </div>
  );
}

export default function VacanciesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<PortalFallback />}>
        <SarkariJobsPortal />
      </Suspense>
      <Footer />
    </>
  );
}
