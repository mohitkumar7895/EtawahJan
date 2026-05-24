const GARBAGE_PATTERNS = [
  /important\s+dates?/i,
  /important\s+question/i,
  /\bQ\.\s*When\b/i,
  /\bFAQ\b/i,
  /click\s+here/i,
  /sarkariexam\.com/i,
  /apply\s+online\s+for/i,
  /will\s+be\s+start/i,
  /^see\s+(details|official)/i,
];

const DATE_REGEX =
  /(\d{1,2}[\s\-/.]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-/.]\s*\d{2,4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi;

const AGE_REGEX =
  /(?:minimum|min\.?|उम्र)[:\s]*(\d{2})\s*(?:to|-|–|से)\s*(\d{2})|(\d{2})\s*(?:to|-|–)\s*(\d{2})\s*(?:years?|वर्ष)|(?:age|आयु)[:\s]*(\d{2})\s*[-–]\s*(\d{2})/i;

const POSTS_REGEX = /(\d{1,3}(?:,\d{3})*|\d+)\s*(?:posts?|vacancy|vacancies|पद)/i;

function isGarbage(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return true;
  if (t.length > 120) return true;
  return GARBAGE_PATTERNS.some((p) => p.test(t));
}

/** Pull a clean date string from messy scraped text */
export function extractDateFromText(raw?: string): string {
  if (!raw?.trim() || isGarbage(raw)) return '';
  const matches = raw.match(DATE_REGEX);
  if (matches?.[0]) return matches[0].replace(/\s+/g, ' ').trim();
  const labelMatch = raw.match(/(?:start|last|closing|open)[^:]*:\s*([^?\n]+)/i);
  if (labelMatch?.[1] && !isGarbage(labelMatch[1])) {
    const inner = labelMatch[1].trim().slice(0, 40);
    if (inner.length >= 4) return inner;
  }
  if (!isGarbage(raw) && raw.length <= 35) return raw.trim();
  return '';
}

export function extractAgeFromText(raw?: string): string {
  if (!raw?.trim() || isGarbage(raw)) return '';
  const m = raw.match(AGE_REGEX);
  if (m) {
    const a = m[1] || m[3] || m[5];
    const b = m[2] || m[4] || m[6];
    if (a && b) return `${a} – ${b} years`;
  }
  if (/as per rules?/i.test(raw)) return 'नियमानुसार';
  if (!isGarbage(raw) && raw.length <= 50 && /\d/.test(raw)) {
    return raw.replace(/\s+/g, ' ').trim();
  }
  return '';
}

export function extractPostsFromText(raw?: string): string {
  if (!raw?.trim() || isGarbage(raw)) return '';
  const m = raw.match(POSTS_REGEX);
  if (m) return m[1].replace(/,/g, '') + (m[2] ? ` ${m[2]}` : ' posts');
  const num = raw.match(/^(\d{1,3}(?:,\d{3})*|\d+)$/);
  if (num) return num[1];
  if (!isGarbage(raw) && raw.length <= 30) return raw.trim();
  return '';
}

export function cleanQualification(raw?: string): string {
  if (!raw?.trim() || isGarbage(raw)) return '';
  let t = raw.replace(/\s+/g, ' ').trim();
  if (t.length > 500) t = t.slice(0, 500) + '…';
  return t;
}

export function cleanDocuments(raw?: string): string[] {
  if (!raw?.trim() || isGarbage(raw)) return defaultDocuments();

  const parts = raw
    .split(/[,;•|\n]/)
    .map((s) => s.replace(/^[\d.)\s-]+/, '').trim())
    .filter((s) => s.length > 2 && s.length < 80 && !isGarbage(s));

  if (parts.length >= 2) return parts.slice(0, 12);
  if (parts.length === 1 && parts[0].length > 10) return parts;
  return defaultDocuments();
}

export function defaultDocuments(): string[] {
  return [
    'Aadhaar Card',
    'Photo & Signature (scan)',
    'Educational certificates',
    'Category certificate (if applicable)',
    'ID proof',
  ];
}

export interface SanitizedJobFields {
  startDate: string;
  lastDate: string;
  ageLimit: string;
  totalPosts: string;
  qualification: string;
  documents: string[];
}

export function sanitizeJobFields(input: {
  startDate?: string;
  lastDate?: string;
  ageLimit?: string;
  totalPosts?: string;
  qualification?: string;
  requiredDocuments?: string;
  title?: string;
  category?: string;
}): SanitizedJobFields {
  let startDate = extractDateFromText(input.startDate);
  let lastDate = extractDateFromText(input.lastDate);
  let ageLimit = extractAgeFromText(input.ageLimit);
  let totalPosts = extractPostsFromText(input.totalPosts);

  const blob = [input.startDate, input.lastDate, input.ageLimit, input.qualification].join(' ');
  if (!startDate) {
    const allDates = blob.match(DATE_REGEX);
    if (allDates && allDates.length >= 1) startDate = allDates[0].replace(/\s+/g, ' ').trim();
    if (allDates && allDates.length >= 2) lastDate = allDates[allDates.length - 1].replace(/\s+/g, ' ').trim();
  }
  if (!lastDate && input.lastDate) {
    const d = extractDateFromText(input.lastDate);
    if (d) lastDate = d;
  }
  if (!ageLimit) ageLimit = extractAgeFromText(blob);
  if (!totalPosts) totalPosts = extractPostsFromText(blob) || extractPostsFromText(input.title);

  const qualification = cleanQualification(input.qualification);
  const documents = cleanDocuments(input.requiredDocuments);

  const cat = input.category;
  if (cat === 'Results') {
    return {
      startDate: startDate || '—',
      lastDate: lastDate || 'Result declared',
      ageLimit: '—',
      totalPosts: '—',
      qualification: qualification || 'Merit list / scorecard website par dekhein',
      documents: ['Roll number', 'Date of birth', 'Registration ID'],
    };
  }
  if (cat === 'Admit Cards') {
    return {
      startDate: startDate || 'Available',
      lastDate: lastDate || 'Download karein',
      ageLimit: '—',
      totalPosts: '—',
      qualification: qualification || 'Registration number se login karein',
      documents: ['Registration no.', 'Password / DOB', 'Photo ID'],
    };
  }

  return {
    startDate: startDate || 'जल्द उपलब्ध',
    lastDate: lastDate || 'Notification dekhein',
    ageLimit: ageLimit || 'नियमानुसार (18–40 आम)',
    totalPosts: totalPosts || 'विभिन्न',
    qualification: qualification || '10th / 12th / Graduate — post ke hisaab se',
    documents,
  };
}
