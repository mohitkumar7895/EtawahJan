import { sanitizeJobFields, type SanitizedJobFields } from './sanitizeJobFields';

export type JobCategory = 'Vacancies' | 'Results' | 'Admit Cards';

export interface JobMeta {
  category: JobCategory | string;
  title?: string;
  startDate?: string;
  lastDate?: string;
  ageLimit?: string;
  totalPosts?: string;
  qualification?: string;
  requiredDocuments?: string;
}

export const CALLBACK_PHONES = '9193898182, 7895094129';

export const CALLBACK_LINE = `जानकारी के लिए Callback — Call ${CALLBACK_PHONES}`;

export function getSanitizedJob(job: JobMeta): SanitizedJobFields {
  return sanitizeJobFields({
    ...job,
    category: String(job.category),
  });
}

/** Compact list view (home / portal) */
export function getJobMetaRows(job: JobMeta): { label: string; value: string }[] {
  const s = getSanitizedJob(job);
  const cat = job.category as JobCategory;

  if (cat === 'Vacancies') {
    return [
      { label: 'आवेदन शुरू', value: s.startDate },
      { label: 'अंतिम तिथि', value: s.lastDate },
      { label: 'आयु सीमा', value: s.ageLimit },
      { label: 'पद', value: s.totalPosts },
    ];
  }
  if (cat === 'Admit Cards') {
    return [
      { label: 'स्थिति', value: 'Admit Card' },
      { label: 'परीक्षा / तिथि', value: s.lastDate },
    ];
  }
  return [
    { label: 'परिणाम', value: s.lastDate },
    { label: 'स्थिति', value: 'घोषित' },
  ];
}
