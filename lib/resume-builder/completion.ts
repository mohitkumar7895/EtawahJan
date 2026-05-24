import type { ResumeDocument } from './types';

export function calculateCompletion(doc: ResumeDocument): number {
  const { content: c } = doc;
  let score = 0;
  const weights = [
    [c.personal.fullName, 8],
    [c.personal.email, 6],
    [c.personal.phone, 6],
    [c.personal.jobTitle, 8],
    [c.summary.length > 40, 12],
    [c.skills.length >= 3, 10],
    [c.experience.length >= 1, 18],
    [c.education.length >= 1, 14],
    [c.projects.length >= 1, 8],
    [c.social.length >= 1, 4],
  ] as const;

  for (const [ok, w] of weights) {
    if (ok) score += w;
  }
  if (c.certifications.length) score += 4;
  if (c.languages.length) score += 4;
  return Math.min(100, score);
}

export function estimateAtsScore(doc: ResumeDocument): number {
  const { content: c } = doc;
  let score = 40;
  if (c.summary.length > 80) score += 10;
  if (c.skills.length >= 6) score += 15;
  if (c.experience.length >= 2) score += 15;
  if (c.personal.email && c.personal.phone) score += 10;
  if (doc.templateId === 'ats' || doc.templateId === 'compact' || doc.templateId === 'one-page') score += 10;
  return Math.min(98, score);
}
