import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PdfEditorApp = dynamic(() => import('@/components/pdf-editor/PdfEditorApp'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Free Online PDF Editor & Signer | Edit PDF Text Like Adobe Acrobat',
  description:
    'Upload any PDF and edit text by clicking — add signature, highlight, whiteout, OCR for scanned PDFs, and export with layout preserved. Free Jan Seva Kendra tool.',
  keywords: [
    'online pdf editor',
    'edit pdf text free',
    'pdf signer online',
    'adobe acrobat alternative',
    'pdf ocr online',
    'jan seva pdf editor',
  ],
};

export default function PdfEditorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <PdfEditorApp />
      </main>
      <Footer />
    </>
  );
}
