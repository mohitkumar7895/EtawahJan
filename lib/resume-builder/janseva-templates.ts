import type { ResumeDocument, ResumeSectionConfig, ResumeThemeSettings } from './types';
import { createDefaultResumeDocument } from './types';
import { applyTemplatePreset } from './template-presets';

export const JANSEVA_LOGO_SRC = '/jan-seva-logo-1.png';
export const JANSEVA_BRAND_LINE = 'Jan Seva Kendra';
export const JANSEVA_OWNER_LINE = 'Arpit Porwal';

export const INDIAN_TEMPLATE_IDS = ['janseva-classic', 'janseva-formal', 'janseva-biodata'] as const;
export type IndianTemplateId = (typeof INDIAN_TEMPLATE_IDS)[number];

export function isIndianTemplate(templateId: string): templateId is IndianTemplateId {
  return (INDIAN_TEMPLATE_IDS as readonly string[]).includes(templateId);
}

export const JANSEVA_DEFAULT_SECTIONS: ResumeSectionConfig[] = [
  { id: 'personal', type: 'personal', label: 'Personal Info', visible: true, order: 0 },
  { id: 'summary', type: 'summary', label: 'Career Objective', visible: true, order: 1 },
  { id: 'education', type: 'education', label: 'Education', visible: true, order: 2 },
  { id: 'languages', type: 'languages', label: 'Languages', visible: true, order: 3 },
  { id: 'experience', type: 'experience', label: 'Experience', visible: false, order: 4 },
  { id: 'skills', type: 'skills', label: 'Skills', visible: false, order: 5 },
  { id: 'projects', type: 'projects', label: 'Projects', visible: false, order: 6 },
  { id: 'certifications', type: 'certifications', label: 'Certifications', visible: false, order: 7 },
  { id: 'achievements', type: 'achievements', label: 'Achievements', visible: false, order: 8 },
  { id: 'internships', type: 'internships', label: 'Internships', visible: false, order: 9 },
  { id: 'interests', type: 'interests', label: 'Interests', visible: false, order: 10 },
  { id: 'references', type: 'references', label: 'References', visible: false, order: 11 },
  { id: 'social', type: 'social', label: 'Social Links', visible: false, order: 12 },
];

export function createJanSevaResumeDocument(
  title = 'My Resume',
  templateId: IndianTemplateId = 'janseva-classic'
): ResumeDocument {
  const doc = createDefaultResumeDocument(title);
  doc.templateId = templateId;
  doc.sections = JANSEVA_DEFAULT_SECTIONS.map((s) => ({ ...s }));
  doc.theme = applyTemplatePreset(templateId, doc.theme);
  return doc;
}

export const JANSEVA_FEATURED_TEMPLATES: {
  id: IndianTemplateId;
  name: string;
  description: string;
  previewGradient: string;
}[] = [
  {
    id: 'janseva-classic',
    name: 'Jan Seva Classic',
    description: 'Traditional bordered resume — CSC / government style',
    previewGradient: 'from-slate-300 to-slate-500',
  },
  {
    id: 'janseva-formal',
    name: 'Jan Seva Formal',
    description: 'Blue header bars with photo — professional biodata',
    previewGradient: 'from-blue-600 to-blue-900',
  },
  {
    id: 'janseva-biodata',
    name: 'Jan Seva Biodata',
    description: 'Green academic style with left photo layout',
    previewGradient: 'from-emerald-600 to-teal-800',
  },
];
