import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ConverterThemeProvider } from '@/components/converter/ConverterThemeProvider';
import ConverterNav from '@/components/converter/ConverterNav';
import ConverterFooter from '@/components/converter/ConverterFooter';

export const metadata: Metadata = {
  title: 'Free File Converter | Arpit Jan Seva Kendra Etawah',
  description:
    'Arpit Jan Seva Kendra — free online file converter. PDF, Word, Excel, JPG: merge, split, compress, OCR. Batch jobs, fast & secure. Bharthana, Etawah.',
  keywords: [
    'pdf to jpg',
    'merge pdf',
    'compress pdf',
    'word to pdf',
    'jpg to pdf',
    'online file converter',
    'free pdf tools',
  ],
};

export default function FileConverterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConverterThemeProvider>
      <ConverterNav />
      <main>{children}</main>
      <ConverterFooter />
      <Toaster position="top-center" richColors closeButton />
    </ConverterThemeProvider>
  );
}
