import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { getSeoToolBySlug, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const PdfEditorApp = dynamic(() => import('@/components/pdf-editor/PdfEditorApp'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  ),
});

const TOOL = getSeoToolBySlug('pdf-editor')!;

export const metadata: Metadata = {
  title: TOOL.title,
  description: TOOL.description,
  keywords: TOOL.keywords,
  openGraph: {
    title: TOOL.title,
    description: TOOL.description,
    url: `${SITE_ORIGIN}${TOOL.path}`,
    type: 'website',
    images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TOOL.title,
    description: TOOL.description,
  },
  alternates: {
    canonical: `${SITE_ORIGIN}${TOOL.path}`,
  },
};

export default function PdfEditorPage() {
  return (
    <>
      <ToolJsonLd tool={TOOL} />
      <Header />
      <main className="min-h-screen bg-slate-50">
        <PdfEditorApp />
      </main>
      <Footer />
    </>
  );
}
