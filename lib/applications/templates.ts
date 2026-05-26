import type { ApplicationTemplate, ApplicationCategory } from './types';
import { SARKARI_TEMPLATES } from './templates-sarkari';
import { SCHOOL_TEMPLATES } from './templates-school';
import { BANK_TEMPLATES } from './templates-bank';
import { OFFICE_TEMPLATES } from './templates-office';
import { ELECTRICITY_TEMPLATES } from './templates-electricity';
import { PROPERTY_TEMPLATES } from './templates-property';
import { MISC_TEMPLATES } from './templates-misc';

/**
 * The master list of every application template the tool ships with.
 * Order is intentional — high-frequency Sarkari + Bijli requests first
 * so the default grid render leads with daily-use letters.
 */
export const ALL_TEMPLATES: ApplicationTemplate[] = [
  ...SARKARI_TEMPLATES,
  ...ELECTRICITY_TEMPLATES,
  ...SCHOOL_TEMPLATES,
  ...BANK_TEMPLATES,
  ...OFFICE_TEMPLATES,
  ...PROPERTY_TEMPLATES,
  ...MISC_TEMPLATES,
];

export const CATEGORY_META: Record<
  ApplicationCategory,
  { label: string; labelHi: string; emoji: string; accent: string }
> = {
  sarkari: {
    label: 'Sarkari',
    labelHi: 'सरकारी',
    emoji: '🏛️',
    accent: 'from-orange-500 to-red-500',
  },
  electricity: {
    label: 'Bijli Vibhag',
    labelHi: 'बिजली विभाग',
    emoji: '⚡',
    accent: 'from-yellow-400 to-amber-500',
  },
  school: {
    label: 'School / College',
    labelHi: 'शिक्षा',
    emoji: '🏫',
    accent: 'from-indigo-500 to-blue-500',
  },
  bank: {
    label: 'Bank',
    labelHi: 'बैंक',
    emoji: '🏦',
    accent: 'from-emerald-500 to-teal-500',
  },
  office: {
    label: 'Office / Naukri',
    labelHi: 'ऑफिस',
    emoji: '💼',
    accent: 'from-violet-500 to-purple-500',
  },
  property: {
    label: 'Property / Utility',
    labelHi: 'प्रॉपर्टी',
    emoji: '🏠',
    accent: 'from-amber-500 to-yellow-500',
  },
  misc: {
    label: 'Other / Misc',
    labelHi: 'अन्य',
    emoji: '📄',
    accent: 'from-slate-500 to-zinc-600',
  },
};

export const ORDERED_CATEGORIES: ApplicationCategory[] = [
  'sarkari',
  'electricity',
  'school',
  'bank',
  'office',
  'property',
  'misc',
];

export function getTemplateBySlug(slug: string): ApplicationTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.slug === slug);
}

/**
 * Lightweight client-side fuzzy search — matches against title (EN+HI),
 * description, keywords AND category labels so users can type
 * "leave", "chhutti", "TC", "school", "बैंक", "bijli" — all work.
 */
export function searchTemplates(query: string): ApplicationTemplate[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_TEMPLATES;
  return ALL_TEMPLATES.filter((t) => {
    const haystack = [
      t.titleEn,
      t.titleHi,
      t.description,
      t.category,
      ...t.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
