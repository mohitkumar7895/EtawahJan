import { notFound } from 'next/navigation';
import { CONVERTER_TOOLS, getToolById } from '@/lib/converter/tools';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';
import { SITE_ORIGIN } from '@/lib/seo/tools-catalog';
import type { Metadata } from 'next';

const ToolWorkspace = dynamic(() => import('@/components/converter/ToolWorkspace'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Preparing converter…" />,
});

type Props = { params: { toolId: string } };

export function generateStaticParams() {
  return CONVERTER_TOOLS.map((t) => ({ toolId: t.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolById(params.toolId);
  if (!tool) return { title: 'Tool not found' };

  const url = `${SITE_ORIGIN}/file-converter/${tool.id}`;
  // Each sub-tool gets its own SERP target — title carries the head
  // keyword first ("PDF to JPG"), then a free/online qualifier.
  const title = `${tool.name} — Free Online Converter | Jan Seva Kendra`;
  const description = `${tool.description} 100% free, no sign-up, batch ready, instant download. Use ${tool.name} on any device.`;

  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} free`,
      `${tool.name.toLowerCase()} online`,
      `${tool.name.toLowerCase()} india`,
      'free file converter',
      'jan seva kendra',
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Per-sub-tool SoftwareApplication JSON-LD. Renders inline so Googlebot
 * sees the structured data on the very first byte of HTML.
 */
function SubToolJsonLd({ name, description, slug }: { name: string; description: string; slug: string }) {
  const url = `${SITE_ORIGIN}/file-converter/${slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '420',
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arpit Jan Seva Kendra',
      url: SITE_ORIGIN,
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_ORIGIN}/tools` },
      { '@type': 'ListItem', position: 3, name: 'File Converter', item: `${SITE_ORIGIN}/file-converter` },
      { '@type': 'ListItem', position: 4, name, item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default function ToolPage({ params }: Props) {
  const tool = getToolById(params.toolId);
  if (!tool) notFound();

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6">
      <SubToolJsonLd name={tool.name} description={tool.description} slug={tool.id} />
      <ToolWorkspace tool={tool} />
    </div>
  );
}
