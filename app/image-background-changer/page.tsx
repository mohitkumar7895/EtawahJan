import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';

const ImageBackgroundClient = dynamic(() => import('@/components/image-background/ImageBackgroundClient'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Background Changer loading…" />,
});

export default function ImageBackgroundChangerPage() {
  return <ImageBackgroundClient />;
}
