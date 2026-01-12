import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPageComponent from '@/components/BlogPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Jan Seva Kendra',
  description: 'Read informative articles about government services, document services, schemes, and tips from Jan Seva Kendra Etawah. Stay updated with latest news and guides.',
  keywords: [
    'Jan Seva Kendra Blog',
    'Government Services Blog',
    'Document Services Guide',
    'Government Schemes Information',
    'Etawah Services Blog',
    'CSC Services Blog',
    'Aadhaar Card Guide',
    'PAN Card Information',
    'Voter ID Guide',
    'सरकारी सेवाएं ब्लॉग',
    'दस्तावेज सेवाएं गाइड'
  ],
  openGraph: {
    title: 'Blog - Jan Seva Kendra',
    description: 'Read informative articles about government services, document services, schemes, and tips from Jan Seva Kendra Etawah.',
    type: 'website',
    url: 'https://www.jan-seva.site/blog',
  },
  alternates: {
    canonical: 'https://www.jan-seva.site/blog',
  },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <BlogPageComponent />
      <Footer />
    </>
  );
}


