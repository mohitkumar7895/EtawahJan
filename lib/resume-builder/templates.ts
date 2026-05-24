import type { ResumeTemplateMeta } from './types';

export const RESUME_TEMPLATES: ResumeTemplateMeta[] = [
  { id: 'modern', name: 'Modern Resume', description: 'Clean two-column professional layout', category: 'modern', previewGradient: 'from-blue-600 to-indigo-700', layout: 'single', isPremium: false },
  { id: 'corporate', name: 'Corporate Resume', description: 'Formal business style', category: 'corporate', previewGradient: 'from-slate-700 to-slate-900', layout: 'single', isPremium: false },
  { id: 'minimal', name: 'Minimal Resume', description: 'Simple typography focused', category: 'modern', previewGradient: 'from-zinc-400 to-zinc-600', layout: 'compact', isPremium: false },
  { id: 'ats', name: 'ATS Resume', description: 'Applicant tracking optimized', category: 'ats', previewGradient: 'from-emerald-600 to-teal-700', layout: 'single', isPremium: false },
  { id: 'executive', name: 'Executive Resume', description: 'Senior leadership profile', category: 'corporate', previewGradient: 'from-amber-700 to-orange-900', layout: 'single', isPremium: true },
  { id: 'fresher', name: 'Fresher Resume', description: 'Students & fresh graduates', category: 'modern', previewGradient: 'from-sky-500 to-blue-600', layout: 'single', isPremium: false },
  { id: 'developer', name: 'Developer Resume', description: 'Tech stack & projects highlight', category: 'modern', previewGradient: 'from-violet-600 to-purple-800', layout: 'sidebar', isPremium: false },
  { id: 'sidebar', name: 'Sidebar Resume', description: 'Left sidebar contact block', category: 'sidebar', previewGradient: 'from-cyan-600 to-blue-800', layout: 'sidebar', isPremium: false },
  { id: 'elegant', name: 'Elegant Resume', description: 'Refined serif accents', category: 'creative', previewGradient: 'from-rose-400 to-pink-600', layout: 'single', isPremium: true },
  { id: 'creative', name: 'Creative Resume', description: 'Bold color blocks', category: 'creative', previewGradient: 'from-fuchsia-500 to-orange-500', layout: 'sidebar', isPremium: true },
  { id: 'startup', name: 'Startup Resume', description: 'Dynamic product-minded', category: 'modern', previewGradient: 'from-lime-500 to-emerald-600', layout: 'single', isPremium: false },
  { id: 'timeline', name: 'Timeline Resume', description: 'Vertical career timeline', category: 'modern', previewGradient: 'from-indigo-500 to-blue-700', layout: 'timeline', isPremium: false },
  { id: 'compact', name: 'Compact Resume', description: 'Dense one-page fit', category: 'ats', previewGradient: 'from-gray-500 to-gray-700', layout: 'compact', isPremium: false },
  { id: 'dark', name: 'Dark Resume', description: 'Dark mode professional', category: 'creative', previewGradient: 'from-slate-900 to-black', layout: 'sidebar', isPremium: true },
  { id: 'luxury', name: 'Luxury Resume', description: 'Premium gold accents', category: 'corporate', previewGradient: 'from-yellow-600 to-amber-900', layout: 'single', isPremium: true },
  { id: 'international', name: 'International CV', description: 'EU-style CV format', category: 'corporate', previewGradient: 'from-blue-800 to-red-700', layout: 'single', isPremium: false },
  { id: 'gradient', name: 'Gradient Resume', description: 'Modern gradient header', category: 'creative', previewGradient: 'from-purple-600 via-pink-500 to-orange-400', layout: 'single', isPremium: false },
  { id: 'white-pro', name: 'White Professional', description: 'Crisp white corporate', category: 'corporate', previewGradient: 'from-slate-100 to-slate-300', layout: 'single', isPremium: false },
  { id: 'designer', name: 'Designer Resume', description: 'Portfolio style layout', category: 'creative', previewGradient: 'from-teal-400 to-indigo-600', layout: 'sidebar', isPremium: true },
  { id: 'one-page', name: 'One Page Resume', description: 'Single page optimized', category: 'ats', previewGradient: 'from-blue-500 to-cyan-600', layout: 'compact', isPremium: false },
  {
    id: 'janseva-classic',
    name: 'Jan Seva Classic',
    description: 'Jan Seva Kendra — traditional bordered CSC resume',
    category: 'corporate',
    previewGradient: 'from-slate-400 to-slate-600',
    layout: 'indian',
    isPremium: false,
  },
  {
    id: 'janseva-formal',
    name: 'Jan Seva Formal',
    description: 'Jan Seva Kendra — blue formal biodata with photo',
    category: 'corporate',
    previewGradient: 'from-blue-600 to-indigo-800',
    layout: 'indian',
    isPremium: false,
  },
  {
    id: 'janseva-biodata',
    name: 'Jan Seva Biodata',
    description: 'Jan Seva Kendra — green academic biodata layout',
    category: 'corporate',
    previewGradient: 'from-emerald-600 to-teal-800',
    layout: 'indian',
    isPremium: false,
  },
];

export function getTemplateById(id: string) {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];
}
