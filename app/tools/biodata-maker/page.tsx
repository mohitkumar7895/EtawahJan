import BiodataMaker from '@/components/BiodataMaker';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Maker | Create HD Shadi Biodata | Jan Seva Kendra',
  description: 'Create a beautiful marriage biodata in 2 minutes for free. Customize with themes, upload photos, and download an HD PDF for printing or WhatsApp sharing.',
  keywords: 'marriage biodata maker, shadi biodata online, create biodata for marriage, hindi biodata, free biodata maker, wedding biodata, biodata format',
};

export default function BiodataMakerPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <BiodataMaker />
    </div>
  );
}
