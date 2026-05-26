import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { getSeoToolBySlug, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const PhotoResizerClient = dynamic(() => import('@/components/photo-resizer/PhotoResizerClient'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Photo Resizer loading…" />,
});

const TOOL = getSeoToolBySlug('photo-resizer')!;

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

export default function PhotoResizerPage() {
  return (
    <>
      <ToolJsonLd tool={TOOL} />
      <PhotoResizerClient />
    </>
  );
}
