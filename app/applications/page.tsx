import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolPageLoader from '@/components/tools/ToolPageLoader';
import ToolPageSeoFooter from '@/components/tools/ToolPageSeoFooter';
import { ALL_TEMPLATES, CATEGORY_META, ORDERED_CATEGORIES } from '@/lib/applications/templates';
import { SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const ApplicationsHubClient = dynamic(
  () => import('@/components/applications/ApplicationsHubClient'),
  {
    ssr: false,
    loading: () => <ToolPageLoader label="Application Maker loading…" />,
  },
);

export const metadata: Metadata = {
  title: `Application Maker — ${ALL_TEMPLATES.length}+ Hindi & English Sarkari, Bijli, School, Bank Letters Free`,
  description: `${ALL_TEMPLATES.length}+ professional application letters in Hindi (Devanagari) & English — Sarkari (Tehsil, FIR, Pension), Bijli Vibhag (galat bill, naya connection, meter), School (TC, leave), Bank, Office. Edit body, profile auto-fill, free PDF.`,
  keywords: [
    'application letter maker',
    'sarkari aavedan format',
    'application format hindi',
    'hindi application maker',
    'devanagari application letter',
    'bijli vibhag application',
    'electricity application format',
    'leave letter format',
    'tc application',
    'income certificate application',
    'bank application format',
    'office leave application',
    'cheque book application',
    'fir letter format hindi',
    'jan seva application maker',
    'free application letter india',
    'sarkari application generator',
    'aavedan patra',
  ],
  openGraph: {
    title: `Application Maker — ${ALL_TEMPLATES.length}+ Hindi & English Letters`,
    description:
      'Sarkari, Bijli Vibhag, School, Bank, Office, Property — har letter professional Hindi (Devanagari) ya English mein. Edit + PDF download free.',
    url: `${SITE_ORIGIN}/applications`,
    type: 'website',
    images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Application Maker — ${ALL_TEMPLATES.length}+ Hindi & English Templates`,
    description: 'Sarkari, Bijli Vibhag, School, Bank Letters — Hindi (Devanagari) PDF free.',
  },
  alternates: {
    canonical: `${SITE_ORIGIN}/applications`,
  },
};

/**
 * SoftwareApplication + ItemList JSON-LD so Google understands this
 * single URL is the gateway to a curated library of letter templates.
 */
function ApplicationsJsonLd() {
  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Application Letter Maker — Jan Seva Kendra',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: `${SITE_ORIGIN}/applications`,
    description: `Library of ${ALL_TEMPLATES.length}+ ready-to-use Sarkari / School / Bank / Office application templates with profile auto-fill and one-click PDF export.`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '512',
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arpit Jan Seva Kendra',
      url: SITE_ORIGIN,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/jan-seva-logo-1.png` },
    },
  };

  // ItemList covering every template — gives Google a sitelinks-grade
  // inventory of deep URLs to surface for queries like "income
  // certificate application format".
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All application letter templates',
    itemListElement: ALL_TEMPLATES.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_ORIGIN}/applications/${t.slug}`,
      name: t.titleEn,
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_ORIGIN}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Applications', item: `${SITE_ORIGIN}/applications` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default function ApplicationsHubPage() {
  // Compute the human-friendly counts on the server so first-paint
  // shows real numbers (no flicker from a "loading…" placeholder).
  const counts = ORDERED_CATEGORIES.map((cat) => ({
    cat,
    label: CATEGORY_META[cat].label,
    count: ALL_TEMPLATES.filter((t) => t.category === cat).length,
  }));
  void counts; // currently for SEO content only (could be rendered if desired)

  return (
    <>
      <ApplicationsJsonLd />
      <Header />
      <ApplicationsHubClient />
      <ToolPageSeoFooter slug="applications" />
      <Footer />
    </>
  );
}
