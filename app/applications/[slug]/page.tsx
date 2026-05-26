import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolPageLoader from '@/components/tools/ToolPageLoader';
import {
  ALL_TEMPLATES,
  getTemplateBySlug,
  CATEGORY_META,
} from '@/lib/applications/templates';
import { SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const ApplicationEditorClient = dynamic(
  () => import('@/components/applications/ApplicationEditorClient'),
  {
    ssr: false,
    loading: () => <ToolPageLoader label="Editor loading…" />,
  },
);

type Props = { params: { slug: string } };

export function generateStaticParams() {
  // Pre-render every template page at build time so each one ships
  // instant HTML to bots — direct deep-link indexing for queries
  // like "income certificate application format".
  return ALL_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const t = getTemplateBySlug(params.slug);
  if (!t) return { title: 'Template not found' };

  const url = `${SITE_ORIGIN}/applications/${t.slug}`;
  const title = `${t.titleEn} — Free Format & PDF | Jan Seva Kendra`;
  const description = `${t.titleEn} (${t.titleHi}) ka pre-written format. ${t.description} Apni details bharo, edit karo, PDF download karo — sab free.`;

  return {
    title,
    description,
    keywords: [
      ...t.keywords,
      `${t.titleEn.toLowerCase()} format`,
      `${t.titleEn.toLowerCase()} hindi`,
      `${t.titleEn.toLowerCase()} pdf`,
      'free application format',
      'jan seva kendra',
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

function TemplateJsonLd({ slug }: { slug: string }) {
  const t = getTemplateBySlug(slug);
  if (!t) return null;
  const url = `${SITE_ORIGIN}/applications/${t.slug}`;

  // HowTo schema — eligible for rich SERP cards listing the exact
  // fields the user needs to fill in.
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to write ${t.titleEn}`,
    description: t.description,
    totalTime: 'PT2M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Apni profile bharo (one-time)',
        text: 'Naam, pita, pata, mobile — ek baar bharo aur har application mein auto-fill hoga.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Iss letter ke specific fields bharo',
        text: t.fields.length
          ? `${t.fields.map((f) => f.label).join(', ')} — ye sab fill karo.`
          : 'Bas profile chahiye, koi extra field nahi.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'PDF download karo',
        text: 'Right side preview check karo, fir "PDF Download" dabaayein. A4 letter ready hai.',
      },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_ORIGIN}/tools` },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Applications',
        item: `${SITE_ORIGIN}/applications`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: CATEGORY_META[t.category].label,
        item: `${SITE_ORIGIN}/applications?cat=${t.category}`,
      },
      { '@type': 'ListItem', position: 5, name: t.titleEn, item: url },
    ],
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${t.titleEn} — ${t.titleHi}`,
    description: t.description,
    url,
    mainEntityOfPage: url,
    image: `${SITE_ORIGIN}/jan-seva-logo-1.png`,
    author: { '@type': 'Organization', name: 'Arpit Jan Seva Kendra', url: SITE_ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: 'Arpit Jan Seva Kendra',
      url: SITE_ORIGIN,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/jan-seva-logo-1.png` },
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default function ApplicationTemplatePage({ params }: Props) {
  const t = getTemplateBySlug(params.slug);
  if (!t) notFound();

  return (
    <>
      <TemplateJsonLd slug={params.slug} />
      <Header />
      <ApplicationEditorClient slug={params.slug} />
      <Footer />
    </>
  );
}
