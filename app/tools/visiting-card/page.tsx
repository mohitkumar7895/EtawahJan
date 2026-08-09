import VisitingCardMaker from '@/components/VisitingCardMaker';

export const metadata = {
  title: 'Free Business Visiting Card Maker | Jan Seva Kendra',
  description: 'Create and download high-quality HD visiting cards for your business for free. Custom templates and simple editor.',
};

export default function VisitingCardPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <VisitingCardMaker />
    </main>
  );
}
