import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import FAQComponent from '@/components/FAQ';

export default function FAQPage() {
  return (
    <>
      <Header />
      <FAQComponent />
      <Footer />
    </>
  );
}

