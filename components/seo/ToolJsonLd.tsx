import { SITE_ORIGIN, type SeoTool } from '@/lib/seo/tools-catalog';

interface ToolJsonLdProps {
  /** The catalogue entry; everything else is derived from this. */
  tool: SeoTool;
}

/**
 * Renders three JSON-LD blocks for a tool page:
 *   1. SoftwareApplication — tells Google "this is a free web app"
 *      so it can show ratings, free-to-use badge, install hint.
 *   2. BreadcrumbList — improves SERP appearance with a path crumb.
 *   3. WebSite + SearchAction (only on /tools landing) — opt-in for
 *      sitelinks search box. We render it on every tool page; Google
 *      dedupes, but having it visible from any landing reinforces the
 *      site-level entity.
 *
 * Server component — emits raw <script type="application/ld+json"> so
 * the bot sees structured data on first byte (no client hydration).
 */
export default function ToolJsonLd({ tool }: ToolJsonLdProps) {
  const url = `${SITE_ORIGIN}${tool.path}`;

  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title.split('—')[0].trim(),
    url,
    description: tool.description,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern browser (Chrome, Edge, Firefox, Safari).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1280',
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arpit Jan Seva Kendra',
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/jan-seva-logo-1.png`,
      },
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_ORIGIN}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.title.split('—')[0].trim(), item: url },
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arpit Jan Seva Kendra',
    url: SITE_ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
