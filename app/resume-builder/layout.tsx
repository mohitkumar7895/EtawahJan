import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Resume Builder | Free Professional CV Maker – Jan Seva Kendra',
  description:
    'Create, customize, and download professional resumes with 20+ templates, AI summary, ATS checker, and PDF export. Free resume builder by Jan Seva Kendra.',
  openGraph: {
    title: 'AI Resume Builder | Jan Seva Kendra',
    url: 'https://www.jan-seva.site/resume-builder',
  },
};

export default function ResumeBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
