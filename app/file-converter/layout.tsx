import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ConverterThemeProvider } from '@/components/converter/ConverterThemeProvider';
import ConverterNav from '@/components/converter/ConverterNav';
import ConverterFooter from '@/components/converter/ConverterFooter';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { getSeoToolBySlug, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const TOOL = getSeoToolBySlug('file-converter')!;

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

export default function FileConverterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConverterThemeProvider>
      {/* Hub-level structured data; individual /file-converter/[toolId]
          pages also emit their own narrower JSON-LD. */}
      <ToolJsonLd tool={TOOL} />
      <ConverterNav />
      <main>{children}</main>
      <ConverterFooter />
      <Toaster position="top-center" richColors closeButton />
    </ConverterThemeProvider>
  );
}
