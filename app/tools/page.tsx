import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolsShowcase from '@/components/tools/ToolsShowcase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Tools | Arpit Jan Seva Kendra Etawah',
  description:
    'Free online tools — Photo Resizer, PDF Editor, File Converter, Background Changer. Arpit Jan Seva Kendra, Bharthana.',
  openGraph: {
    title: 'Digital Tools | Jan Seva Kendra',
    url: 'https://www.jan-seva.site/tools',
  },
};

export default function ToolsLandingPage() {
  return (
    <>
      <Header />
      <ToolsShowcase />
      <Footer />
    </>
  );
}
