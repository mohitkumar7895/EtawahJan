'use client';

import { useEffect, useState } from 'react';
import type { ResumeDocument } from '@/lib/resume-builder/types';
import { createDefaultResumeDocument } from '@/lib/resume-builder/types';
import ResumeDocumentView from '@/components/resume-builder/ResumeDocument';

export default function ShareResumePage({ params }: { params: { slug: string } }) {
  const [doc, setDoc] = useState<ResumeDocument | null>(null);

  useEffect(() => {
    fetch(`/api/resume-builder/share/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.resume) {
          setDoc({
            ...createDefaultResumeDocument(data.resume.title),
            templateId: data.resume.templateId,
            theme: data.resume.theme,
            sections: data.resume.sections,
            content: data.resume.content,
            completionPercent: 100,
            atsScore: 0,
            version: 1,
          });
        }
      });
  }, [params.slug]);

  if (!doc) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100">Loading resume...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-200 py-10 px-4">
      <ResumeDocumentView document={doc} />
    </div>
  );
}
