import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';

const ResumeEditor = dynamic(() => import('@/components/resume-builder/ResumeEditor'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Opening editor…" />,
});

export default function ResumeEditorPage({ params }: { params: { id: string } }) {
  return <ResumeEditor resumeId={params.id} />;
}
