'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  FileDown,
  FileType2,
  RefreshCw,
  Save,
  ChevronDown,
  Check,
  AlertCircle,
  Pencil,
  Eye,
} from 'lucide-react';
import { CATEGORY_META, getTemplateBySlug } from '@/lib/applications/templates';
import { loadProfile, saveProfile } from '@/lib/applications/profile';
import { renderLetter, letterWithEditedBody } from '@/lib/applications/renderer';
import type { RenderedLetter } from '@/lib/applications/renderer';
import type { CitizenProfile, ApplicationField, Language } from '@/lib/applications/types';
import { downloadApplicationPdf, downloadApplicationWord } from './generateApplicationPdf';

const PDF_TARGET_ID = 'application-pdf-target';

interface Props {
  slug: string;
}

interface ProfileFieldConfig {
  id: keyof CitizenProfile;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'date';
  hint?: string;
}

const PROFILE_GROUPS: { title: string; fields: ProfileFieldConfig[] }[] = [
  {
    title: 'Personal',
    fields: [
      { id: 'fullName', label: 'Poora Naam', hint: 'jaise — "Mohit Kumar"' },
      { id: 'fatherName', label: 'Pita ka naam' },
      { id: 'motherName', label: 'Maa ka naam' },
      { id: 'spouseName', label: 'Pati / Patni ka naam' },
      { id: 'dob', label: 'Janma tareekh', type: 'date' },
      { id: 'aadhaarLast4', label: 'Aadhaar last 4 digit', hint: 'sirf last 4 number, privacy ke liye' },
      { id: 'panNumber', label: 'PAN Number' },
    ],
  },
  {
    title: 'Sampark (Contact)',
    fields: [
      { id: 'mobile', label: 'Mobile Number', type: 'tel' },
      { id: 'altMobile', label: 'Alternate mobile', type: 'tel' },
      { id: 'email', label: 'Email', type: 'email' },
    ],
  },
  {
    title: 'Pata (Address)',
    fields: [
      { id: 'address', label: 'Pata (House / Mohalla)', hint: 'jaise — "123, Mandi Trihaa"' },
      { id: 'village', label: 'Gaon / Mohalla' },
      { id: 'post', label: 'Post' },
      { id: 'tehsil', label: 'Tehsil', hint: 'jaise — "Bharthana"' },
      { id: 'district', label: 'Zila', hint: 'jaise — "Etawah"' },
      { id: 'state', label: 'Rajya', hint: 'jaise — "Uttar Pradesh"' },
      { id: 'pincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Naukri / Padhai / Bank (optional)',
    fields: [
      { id: 'occupation', label: 'Naukri / Pesha' },
      { id: 'schoolName', label: 'School / College' },
      { id: 'className', label: 'Class' },
      { id: 'rollNumber', label: 'Roll number' },
      { id: 'bankName', label: 'Bank ka naam' },
      { id: 'bankBranch', label: 'Bank ki shakha' },
      { id: 'accountNumber', label: 'Khaata sankhya' },
    ],
  },
];

export default function ApplicationEditorClient({ slug }: Props) {
  const template = useMemo(() => getTemplateBySlug(slug), [slug]);

  const [profile, setProfile] = useState<CitizenProfile>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [profileSaved, setProfileSaved] = useState<'idle' | 'saved'>('idle');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [wordBusy, setWordBusy] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  /** Hindi by default — Indian audience, full Devanagari output. */
  const [language, setLanguage] = useState<Language>('hi');

  /**
   * When the user manually edits the rendered prose we keep that text
   * in `editedBody`. It is cleared whenever language or any underlying
   * field changes so the auto-rendered version takes over again — that
   * way an unsuspecting user is never confused by "stale" custom text.
   */
  const [editedBody, setEditedBody] = useState<string | null>(null);
  const [bodyMode, setBodyMode] = useState<'preview' | 'edit'>('preview');

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    if (Object.keys(p).filter((k) => p[k as keyof CitizenProfile]).length < 3) {
      setProfileExpanded(true);
    }
  }, []);

  useEffect(() => {
    if (!template) return;
    const initial: Record<string, string> = {};
    for (const f of template.fields) {
      if (f.default) initial[f.id] = f.default;
    }
    setFieldValues(initial);
  }, [template]);

  // Whenever the underlying inputs change, discard any manual edits —
  // otherwise the user's previous typo lives forever and silently
  // overrides the rest of the form.
  useEffect(() => {
    setEditedBody(null);
    setBodyMode('preview');
  }, [template, language]);

  if (!template) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Template not found
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Iss slug ka koi application template nahi hai.
          </p>
          <Link
            href="/applications"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 font-semibold text-white shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Wapas applications par
          </Link>
        </div>
      </main>
    );
  }

  const meta = CATEGORY_META[template.category];

  // Auto-rendered letter using the latest profile + form values.
  const autoRendered = renderLetter(template, { profile, fieldValues, language });
  // Final rendered letter — if the user has hand-edited the body,
  // splice their text in but keep the structured pieces intact.
  const rendered =
    editedBody !== null ? letterWithEditedBody(autoRendered, editedBody) : autoRendered;

  const handleProfileChange = (key: keyof CitizenProfile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setProfileSaved('idle');
  };

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues((f) => ({ ...f, [id]: value }));
    // The body has changed structurally; drop any manual edits.
    setEditedBody(null);
  };

  const handleSaveProfile = () => {
    saveProfile(profile);
    setProfileSaved('saved');
    setTimeout(() => setProfileSaved('idle'), 2200);
  };

  const handleCopy = async () => {
    const text = composePlainText(rendered, language);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleDownloadPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);

    // Always export in preview mode so the snapshot captures the
    // formatted letter, not the inline edit textarea.
    const wasEditing = bodyMode === 'edit';
    if (wasEditing) setBodyMode('preview');

    try {
      saveProfile(profile);

      // Wait for React to flush the mode flip + browser paint.
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      );

      const stamp = new Date()
        .toISOString()
        .replace(/[:T]/g, '-')
        .slice(0, 16);
      const safeSlug = template.slug.replace(/[^a-z0-9-]/gi, '_');

      await downloadApplicationPdf({
        elementId: PDF_TARGET_ID,
        fileName: `${safeSlug}-${language}-${stamp}`,
        title: template.titleEn,
        author: rendered.signatureLines[0] || 'Applicant',
      });
    } catch (err) {
      console.error(err);
      alert(
        language === 'hi'
          ? 'PDF बनाने में समस्या हुई। कृपया दोबारा प्रयास करें।'
          : 'Could not generate PDF. Please retry.',
      );
    } finally {
      setPdfBusy(false);
    }
  };

  const handleDownloadWord = () => {
    if (wordBusy) return;
    setWordBusy(true);
    try {
      saveProfile(profile);

      const stamp = new Date()
        .toISOString()
        .replace(/[:T]/g, '-')
        .slice(0, 16);
      const safeSlug = template.slug.replace(/[^a-z0-9-]/gi, '_');

      downloadApplicationWord({
        letter: rendered,
        fileName: `${safeSlug}-${language}-${stamp}`,
        title: template.titleEn,
        author: rendered.signatureLines[0] || 'Applicant',
      });
    } catch (err) {
      console.error(err);
      alert(
        language === 'hi'
          ? 'Word file बनाने में समस्या हुई।'
          : 'Could not generate Word file.',
      );
    } finally {
      // Word download is synchronous — but a brief busy state gives
      // visual feedback for the click.
      setTimeout(() => setWordBusy(false), 600);
    }
  };

  const subjectLabel = language === 'hi' ? 'विषय: ' : 'Subject: ';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            All templates
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language toggle */}
            <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-2 text-sm font-bold transition ${
                  language === 'hi'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-inner'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                aria-pressed={language === 'hi'}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 text-sm font-bold transition ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-inner'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                aria-pressed={language === 'en'}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copyState === 'copied' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={wordBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50 disabled:opacity-60 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300"
              title={language === 'hi' ? 'MS Word file (.doc) — editable' : 'MS Word (.doc) — editable'}
            >
              <FileType2 className="h-4 w-4" />
              {wordBusy
                ? language === 'hi'
                  ? 'बन रहा है…'
                  : 'Generating…'
                : 'Word (.doc)'}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfBusy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-orange-500/30 hover:brightness-110 disabled:opacity-60"
            >
              <FileDown className="h-4 w-4" />
              {pdfBusy
                ? language === 'hi'
                  ? 'बन रही है…'
                  : 'Generating…'
                : language === 'hi'
                ? 'PDF डाउनलोड'
                : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Title */}
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-6">
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {meta.emoji} {meta.label}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl dark:text-white">
          {language === 'hi' ? template.titleHi : template.titleEn}
        </h1>
        <p className="mt-1 text-base font-semibold text-slate-500 dark:text-slate-400">
          {language === 'hi' ? template.titleEn : template.titleHi}
        </p>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          {template.description}
        </p>
      </section>

      {/* Two-column workspace */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 pt-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          {/* Profile (collapsible) */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setProfileExpanded((v) => !v)}
              className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 text-left dark:border-slate-800"
            >
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Meri Details (auto-fill)
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Ek baar bharo — har application mein automatic aa jayegi
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform ${
                  profileExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            {profileExpanded && (
              <div className="space-y-5 p-5">
                {PROFILE_GROUPS.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {group.title}
                    </h3>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.fields.map((f) => (
                        <FieldInput
                          key={f.id as string}
                          label={f.label}
                          type={f.type ?? 'text'}
                          hint={f.hint}
                          value={(profile[f.id] as string) ?? ''}
                          onChange={(v) => handleProfileChange(f.id, v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                >
                  {profileSaved === 'saved' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save profile
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Template-specific fields */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Application Details
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Iss letter ke liye specific jaankari
              </p>
            </div>
            {template.fields.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Iss letter ke liye sirf profile details chahiye. Bilkul ready hai!
              </p>
            ) : (
              <div className="space-y-3 p-5">
                {template.fields.map((f) => (
                  <FieldInput
                    key={f.id}
                    label={f.label}
                    hint={f.hint}
                    type={f.type === 'textarea' ? 'text' : f.type}
                    multiline={f.type === 'textarea'}
                    rows={f.rows}
                    required={f.required}
                    value={fieldValues[f.id] ?? ''}
                    onChange={(v) => handleFieldChange(f.id, v)}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const initial: Record<string, string> = {};
              for (const f of template.fields) if (f.default) initial[f.id] = f.default;
              setFieldValues(initial);
              setEditedBody(null);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Application details reset
          </button>
        </div>

        {/* RIGHT: Live preview + body editor */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {bodyMode === 'edit'
                  ? language === 'hi'
                    ? 'Body Edit करें'
                    : 'Edit Body'
                  : language === 'hi'
                  ? 'लाइव प्रीव्यू'
                  : 'Live preview'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-400">A4 letter format</span>
                <button
                  type="button"
                  onClick={() => setBodyMode((m) => (m === 'edit' ? 'preview' : 'edit'))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {bodyMode === 'edit' ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </>
                  ) : (
                    <>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit text
                    </>
                  )}
                </button>
              </div>
            </div>

            <article
              id={PDF_TARGET_ID}
              className={`prose prose-sm max-w-none bg-white p-6 text-slate-800 sm:p-8 dark:bg-slate-900 dark:prose-invert dark:text-slate-200 ${
                language === 'hi' ? 'font-[450]' : ''
              }`}
              style={
                language === 'hi'
                  ? {
                      fontFamily:
                        '"Noto Sans Devanagari","Hind","Mangal","Nirmala UI",system-ui,sans-serif',
                    }
                  : undefined
              }
            >
              {/* No brand letterhead, no top date — applications go
                  directly to "Sewa mein," like a clean handwritten
                  letter. The date is appended at the signature block. */}
              <div className="mb-4">
                {rendered.recipientLines.map((line, i) => (
                  <p key={i} className={`m-0 ${i === 1 ? 'font-bold' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>

              {rendered.subjectLine && (
                <p className="mb-4 font-bold">
                  <span className="font-bold">{subjectLabel}</span>
                  {rendered.subjectLine}
                </p>
              )}

              {bodyMode === 'edit' ? (
                <>
                  <textarea
                    value={rendered.bodyText}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={Math.max(12, rendered.bodyText.split('\n').length + 2)}
                    className="w-full rounded-xl border border-orange-300 bg-orange-50/30 p-4 text-[15px] leading-relaxed text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-orange-500/40 dark:bg-orange-500/5 dark:text-slate-100"
                    style={
                      language === 'hi'
                        ? {
                            fontFamily:
                              '"Noto Sans Devanagari","Hind","Mangal","Nirmala UI",system-ui,sans-serif',
                          }
                        : undefined
                    }
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="m-0 text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'hi'
                        ? 'जो भी आप यहाँ टाइप करेंगे वही PDF में जाएगा।'
                        : 'Whatever you type here is exactly what the PDF will contain.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditedBody(null)}
                      className="text-[11px] font-semibold text-orange-600 hover:underline dark:text-orange-400"
                    >
                      {language === 'hi' ? 'मूल टेम्पलेट पर रीसेट' : 'Reset to template'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 leading-relaxed">
                  {rendered.bodyParagraphs.map((para, i) => (
                    <p key={i} className="m-0 whitespace-pre-wrap">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <p className="m-0">{rendered.closing}</p>
                <div className="mt-10 text-sm">
                  {rendered.signatureLines.map((s, i) => (
                    <p key={i} className="m-0 font-medium">
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <strong>
              {language === 'hi' ? 'सुझाव — ' : 'Tip — '}
            </strong>
            {language === 'hi' ? (
              <>
                <span className="font-semibold">PDF</span> को सीधा प्रिंट कीजिए, या{' '}
                <span className="font-semibold">Word (.doc)</span> डाउनलोड करके MS Word /
                Google Docs में और बदलाव कीजिए। &quot;Edit text&quot; से पहले ही पूरी body अपनी
                मर्ज़ी से लिख सकते हैं।
              </>
            ) : (
              <>
                Download as <span className="font-semibold">PDF</span> for printing, or as{' '}
                <span className="font-semibold">Word (.doc)</span> to keep editing in MS Word
                / Google Docs. Click &quot;Edit text&quot; to tweak any sentence first.
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

interface FieldInputProps {
  label: string;
  hint?: string;
  type?: ApplicationField['type'];
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}

function FieldInput({
  label,
  hint,
  type = 'text',
  multiline = false,
  rows = 3,
  required,
  value,
  onChange,
}: FieldInputProps) {
  const baseClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={baseClass}
          placeholder={hint}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          placeholder={hint}
        />
      )}
      {hint && !multiline && (
        <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>
      )}
    </label>
  );
}

function composePlainText(letter: RenderedLetter, language: Language): string {
  const dateLabel = language === 'hi' ? 'दिनांक' : 'Date';
  const subjectLabel = language === 'hi' ? 'विषय' : 'Subject';
  const parts: string[] = [];
  parts.push(`${dateLabel}: ${letter.date}`, '');
  parts.push(...letter.recipientLines, '');
  if (letter.subjectLine) parts.push(`${subjectLabel}: ${letter.subjectLine}`, '');
  parts.push(...letter.bodyParagraphs.flatMap((p) => [p, '']));
  parts.push(letter.closing, '');
  parts.push(...letter.signatureLines);
  return parts.join('\n');
}
