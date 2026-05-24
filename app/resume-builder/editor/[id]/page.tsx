import ResumeEditor from '@/components/resume-builder/ResumeEditor';

export default function ResumeEditorPage({ params }: { params: { id: string } }) {
  return <ResumeEditor resumeId={params.id} />;
}
