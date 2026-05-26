import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolsShowcase from '@/components/tools/ToolsShowcase';
import ToolsPrefetch from '@/components/tools/ToolsPrefetch';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import type { Metadata } from 'next';
import { getSeoToolBySlug, SEO_TOOLS, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const TOOL = getSeoToolBySlug('tools')!;

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

/**
 * ItemList JSON-LD listing every tool — gives Google a clean inventory
 * to source sitelinks from when users search the brand name.
 */
function ToolsItemListJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Digital Tools by Jan Seva Kendra',
    itemListElement: SEO_TOOLS.filter((t) => t.slug !== 'tools').map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_ORIGIN}${t.path}`,
      name: t.title.split('—')[0].trim(),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ToolsLandingPage() {
  return (
    <>
      <ToolJsonLd tool={TOOL} />
      <ToolsItemListJsonLd />
      <Header />
      <ToolsPrefetch />
      <ToolsShowcase />
      <Footer />
    </>
  );
}
