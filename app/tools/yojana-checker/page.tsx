import SchemeFinder from '@/components/SchemeFinder';

export const metadata = {
  title: 'Government Scheme Eligibility Checker | Jan Seva Kendra',
  description: 'Check your eligibility for PM Kisan, UP Scholarship, E-Shram, Ayushman Card, and 50+ government schemes in 10 seconds.',
};

export default function YojanaCheckerPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <SchemeFinder />
    </main>
  );
}
