import { notFound } from 'next/navigation';
import { CONVERTER_TOOLS, getToolById } from '@/lib/converter/tools';
import dynamic from 'next/dynamic';
import ToolPageLoader from '@/components/tools/ToolPageLoader';

const ToolWorkspace = dynamic(() => import('@/components/converter/ToolWorkspace'), {
  ssr: false,
  loading: () => <ToolPageLoader label="Preparing converter…" />,
});
import type { Metadata } from 'next';

type Props = { params: { toolId: string } };

export function generateStaticParams() {
  return CONVERTER_TOOLS.map((t) => ({ toolId: t.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolById(params.toolId);
  if (!tool) return { title: 'Tool not found' };
  return {
    title: `${tool.name} — Free Online Converter`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolById(params.toolId);
  if (!tool) notFound();

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6">
      <ToolWorkspace tool={tool} />
    </div>
  );
}
