import type { JobMeta } from './jobDisplay';
import { CALLBACK_LINE, getSanitizedJob } from './jobDisplay';

export type Category = 'Vacancies' | 'Results' | 'Admit Cards';

export function internalJobLink(category: Category, slug: string): string {
  if (category === 'Results') return `/result/${slug}`;
  if (category === 'Admit Cards') return `/admit-card/${slug}`;
  return `/vacancy/${slug}`;
}

export function buildShortNotification(job: JobMeta & { title: string }): {
  title: string;
  message: string;
} {
  const prefix =
    job.category === 'Results'
      ? 'Result'
      : job.category === 'Admit Cards'
        ? 'Admit Card'
        : 'Vacancy';

  const s = getSanitizedJob(job);
  const lines: string[] = [];

  if (job.category === 'Vacancies') {
    lines.push(`शुरू: ${s.startDate}`);
    lines.push(`अंतिम तिथि: ${s.lastDate}`);
    lines.push(`आयु: ${s.ageLimit}`);
    lines.push(`पद: ${s.totalPosts}`);
  } else if (job.category === 'Admit Cards') {
    lines.push(`तिथि: ${s.lastDate}`);
  } else {
    lines.push(`परिणाम: ${s.lastDate}`);
  }

  if (lines.length === 0) lines.push('Nayi update — details dekhein');
  lines.push(CALLBACK_LINE);

  const titleText = job.title.slice(0, 65) + (job.title.length > 65 ? '…' : '');

  return {
    title: `${prefix}: ${titleText}`,
    message: lines.join('\n'),
  };
}
