import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';

const PhotoResizerClient = dynamic(() => import('@/components/photo-resizer/PhotoResizerClient'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Photo Resizer loading…" />,
});

export const metadata: Metadata = {
  title: 'Sarkari Photo & Signature Resizer | Jan Seva Kendra',
  description:
    'UP Police, SSC, RRB photo & signature 20KB/50KB compress — free online resizer by Jan Seva Kendra Etawah.',
};

export default function PhotoResizerPage() {
  return <PhotoResizerClient />;
}
