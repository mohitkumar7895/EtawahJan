import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';

const CashCounterClient = dynamic(
  () => import('@/components/cash-counter/CashCounterClient'),
  {
    ssr: false,
    loading: () => <ToolPageLoader label="Cash Counter loading…" />,
  }
);

export const metadata: Metadata = {
  title: 'Cash & Note Counter — Kitne paise hain? | Jan Seva Kendra',
  description:
    'Free online cash counter — ₹500, ₹200, ₹100, ₹50, ₹20, ₹10 notes aur ₹1/₹2/₹5 sikke ki ginti daalo, total ₹ aur shabdon mein turant. Shopkeepers, CSC operators, bank ke liye.',
  keywords: [
    'cash counter online',
    'note counter india',
    'paise count karne wala tool',
    'rupee note counter',
    'currency counter india',
    'shopkeeper cash calculator',
    'jan seva kendra tools',
    'rupees counter',
    'denominations calculator',
  ],
  openGraph: {
    title: 'Cash & Note Counter — ₹ Total Calculator',
    description:
      '₹500, ₹200, ₹100, ₹50… har note aur sikke ka total turant. Hindi + English shabdon mein bhi.',
    url: 'https://www.jan-seva.site/cash-counter',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.jan-seva.site/cash-counter',
  },
};

export default function CashCounterPage() {
  return <CashCounterClient />;
}
