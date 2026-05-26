import type { ApplicationTemplate, CitizenProfile, Language } from './types';

/**
 * Combine all the variable sources into one flat lookup table that
 * the renderer can probe with `{{key}}` substitution.
 *
 * Resolution priority (highest first):
 *   1. Form-field values entered in the editor (`fieldValues`)
 *   2. Citizen profile (`profile`)
 *   3. Computed defaults (`date`, fallback profile pieces)
 *
 * Unknown variables are REPLACED WITH A BLANK so the final letter
 * never leaks "{{leaveFrom}}" placeholders into the printed PDF.
 */
export interface RenderInput {
  profile: CitizenProfile;
  fieldValues: Record<string, string>;
  /** Language for the rendered letter — defaults to Hindi. */
  language?: Language;
}

export function buildVariableMap(
  input: RenderInput,
  language: Language
): Record<string, string> {
  const { profile, fieldValues } = input;

  // Localised "today" — May 26, 2026 in English, 26 मई 2026 in Hindi.
  const today = new Date().toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-IN',
    { day: '2-digit', month: 'long', year: 'numeric' }
  );

  const safe = (value: unknown): string => {
    if (value === undefined || value === null) return '';
    return String(value).trim();
  };

  const map: Record<string, string> = {
    fullName: safe(profile.fullName),
    name: safe(profile.fullName),
    fatherName: safe(profile.fatherName),
    motherName: safe(profile.motherName),
    spouseName: safe(profile.spouseName),
    gender: safe(profile.gender),
    dob: safe(profile.dob),
    aadhaarLast4: safe(profile.aadhaarLast4),
    panNumber: safe(profile.panNumber),
    mobile: safe(profile.mobile),
    altMobile: safe(profile.altMobile),
    email: safe(profile.email),
    address: safe(profile.address),
    village: safe(profile.village),
    post: safe(profile.post),
    tehsil: safe(profile.tehsil),
    district: safe(profile.district),
    state: safe(profile.state),
    pincode: safe(profile.pincode),
    occupation: safe(profile.occupation),
    schoolName: safe(profile.schoolName),
    className: safe(profile.className),
    rollNumber: safe(profile.rollNumber),
    bankName: safe(profile.bankName),
    bankBranch: safe(profile.bankBranch),
    accountNumber: safe(profile.accountNumber),

    date: today,
  };

  for (const key of Object.keys(fieldValues)) {
    map[key] = safe(fieldValues[key]);
  }

  return map;
}

/**
 * Substitute every `{{var}}` in `input` using the lookup table.
 * Unknown vars become an empty string.
 */
export function substitute(input: string, vars: Record<string, string>): string {
  return input.replace(/\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g, (_, key) => {
    const value = vars[key];
    return value === undefined ? '' : value;
  });
}

export interface RenderedLetter {
  /** Active language for this rendered letter. */
  language: Language;
  recipientLines: string[];
  subjectLine: string;
  /** Whole body text in one piece — easy for the inline editor. */
  bodyText: string;
  /** Same body broken into paragraphs (for read-only preview / PDF). */
  bodyParagraphs: string[];
  closing: string;
  signatureLines: string[];
  date: string;
}

const DEFAULT_CLOSING: Record<Language, string> = {
  en: 'Yours faithfully,',
  hi: 'आपका विश्वासी / विश्वासिनी,',
};

const SIGNATURE_LABELS: Record<Language, { mobile: string; aadhaar: string }> = {
  en: { mobile: 'Mobile', aadhaar: 'Aadhaar' },
  hi: { mobile: 'मोबाइल', aadhaar: 'आधार' },
};

/**
 * Render the full letter using the template + filled values. The
 * caller may override the language; defaults to Hindi (Devanagari).
 */
export function renderLetter(
  template: ApplicationTemplate,
  input: RenderInput
): RenderedLetter {
  const language: Language = input.language ?? 'hi';
  const vars = buildVariableMap(input, language);

  for (const field of template.fields) {
    if (!vars[field.id] && field.default) {
      vars[field.id] = field.default;
    }
  }

  const recipientLines = template.recipientLines[language]
    .map((l) => substitute(l, vars).trim())
    .filter(Boolean);

  const subjectLine = substitute(template.subject[language], vars).trim();

  const bodyText = substitute(template.body[language], vars);

  const bodyParagraphs = bodyText
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const closingTemplate = template.closing?.[language];
  const closing = (closingTemplate || DEFAULT_CLOSING[language]).trim();

  const labels = SIGNATURE_LABELS[language];
  const signatureLines = [
    vars.fullName,
    vars.address,
    vars.mobile ? `${labels.mobile}: ${vars.mobile}` : '',
    vars.aadhaarLast4 ? `${labels.aadhaar}: XXXX-XXXX-${vars.aadhaarLast4}` : '',
  ].filter(Boolean);

  return {
    language,
    recipientLines,
    subjectLine,
    bodyText,
    bodyParagraphs,
    closing,
    signatureLines,
    date: vars.date,
  };
}

/**
 * Re-build a RenderedLetter from a (possibly user-edited) body string,
 * keeping recipient/subject/closing intact. Used when the user clicks
 * "Edit body" in the editor and tweaks the prose before downloading.
 */
export function letterWithEditedBody(
  base: RenderedLetter,
  newBodyText: string
): RenderedLetter {
  const bodyParagraphs = newBodyText
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return {
    ...base,
    bodyText: newBodyText,
    bodyParagraphs,
  };
}
