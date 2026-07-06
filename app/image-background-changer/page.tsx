import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import ToolPageSeoFooter from '@/components/tools/ToolPageSeoFooter';
import { getSeoToolBySlug, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const ImageBackgroundClient = dynamic(() => import('@/components/image-background/ImageBackgroundClient'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Background Changer loading…" />,
});

const TOOL = getSeoToolBySlug('image-background-changer')!;

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

export default function ImageBackgroundChangerPage() {
  return (
    <>
      <ToolJsonLd tool={TOOL} />
      <ImageBackgroundClient />
      <ToolPageSeoFooter slug="image-background-changer" />
    </>
  );
}
