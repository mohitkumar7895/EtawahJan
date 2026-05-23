import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Photo Background Online Free | Sarkari Photo Background Changer',
  description:
    'Free online photo background changer for SSC, UP Police, NEET & UPSSSC forms. Upload photo, auto-remove background, apply official white/grey/blue colors & download instantly.',
  keywords: [
    'change photo background online',
    'remove background free',
    'sarkari photo background white',
    'ssc photo background changer',
    'up police photo background',
    'passport photo background',
    'photo background remover hindi',
    'jan seva kendra photo editor',
  ],
  openGraph: {
    title: 'Free Sarkari Photo Background Changer | Jan Seva Kendra',
    description:
      'Upload your photo, remove background automatically, and replace with official white, grey or blue for government exam forms.',
    url: 'https://www.jan-seva.site/image-background-changer',
  },
};

export default function ImageBackgroundChangerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
