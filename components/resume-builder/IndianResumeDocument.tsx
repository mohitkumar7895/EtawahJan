'use client';

import type { ResumeDocument } from '@/lib/resume-builder/types';
import type { IndianTemplateId } from '@/lib/resume-builder/janseva-templates';

interface Props {
  document: ResumeDocument;
  className?: string;
}

const STAR_COLORS = ['#eab308', '#dc2626', '#2563eb', '#16a34a'];

function formatEducationLine(degree: string, school: string, endDate: string, grade: string) {
  let line = degree;
  if (school) line += ` From ${school}`;
  if (endDate) line += ` in ${endDate}`;
  if (grade) line += ` (${grade})`;
  return line.trim();
}

export default function IndianResumeDocument({ document: doc, className = '' }: Props) {
  const c = doc.content;
  const p = c.personal;
  const variant = doc.templateId as IndianTemplateId;
  const t = doc.theme;
  const fs = t.fontSize;
  const pad = 14;

  const isClassic = variant === 'janseva-classic';
  const isFormal = variant === 'janseva-formal';
  const isBiodata = variant === 'janseva-biodata';

  const sectionBg = isClassic ? '#d9d9d9' : isFormal ? '#bfdbfe' : '#bbf7d0';
  const sectionColor = isFormal ? '#1e3a8a' : isBiodata ? '#14532d' : '#111827';
  const outerBorder = isClassic ? '4px double #000' : isFormal ? '2px solid #1e40af' : '2px solid #166534';

  const sectionBar = (title: string, width = '78%') => (
    <div
      style={{
        width,
        background: sectionBg,
        padding: '5px 10px',
        marginTop: 14,
        marginBottom: 8,
        fontWeight: 700,
        fontSize: fs + 1,
        textDecoration: 'underline',
        textTransform: 'uppercase',
        color: sectionColor,
        letterSpacing: '0.02em',
      }}
    >
      {title}
    </div>
  );

  const personalRows = (
    [
      ['Father Name', p.fatherName || ''],
      ['Date of Birth', p.dateOfBirth || ''],
      ['Gender', p.gender || ''],
      ['Religion', p.religion || ''],
      ['Nationality', p.nationality || ''],
      ['Marital Status', p.maritalStatus || ''],
      ['Languages Know', c.languages.length ? c.languages.map((l) => l.name).join(', ') : ''],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const photoBox = (
    <div
      style={{
        width: 118,
        height: 138,
        border: '2px solid #000',
        flexShrink: 0,
        overflow: 'hidden',
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {p.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', padding: 8 }}>Photo</span>
      )}
    </div>
  );

  const contactBlock = (
    <div style={{ flex: 1, fontSize: fs, lineHeight: 1.55 }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: fs + 2 }}>{p.fullName || 'Your Name'}</p>
      {p.phone && (
        <p style={{ margin: '0 0 4px' }}>
          <strong>Contact No.</strong> {p.phone}
        </p>
      )}
      {p.email && (
        <p style={{ margin: '0 0 4px' }}>
          <strong>Gmail</strong>{' '}
          <span style={{ color: '#2563eb', textDecoration: 'underline' }}>{p.email}</span>
        </p>
      )}
      {p.location && (
        <p style={{ margin: '0 0 4px' }}>
          <strong>Address</strong> {p.location}
        </p>
      )}
    </div>
  );

  return (
    <div
      id="resume-print-root"
      className={className}
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#fff',
        color: t.textColor,
        fontFamily: t.fontFamily,
        fontSize: fs,
        lineHeight: t.lineHeight,
        padding: pad,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        border: outerBorder,
        boxSizing: 'border-box',
      }}
    >
      {sectionBar('RESUME', '78%')}

      {/* Header: contact + photo */}
      <div
        style={{
          display: 'flex',
          flexDirection: isBiodata ? 'row-reverse' : 'row',
          gap: 16,
          alignItems: 'flex-start',
          marginTop: 4,
        }}
      >
        {contactBlock}
        {photoBox}
      </div>

      {/* Career objective */}
      {c.summary.trim() && (
        <>
          {sectionBar('CAREER OBJECTIVE')}
          <p style={{ margin: 0, textAlign: 'justify', fontSize: fs, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
            {c.summary}
          </p>
        </>
      )}

      {/* Education */}
      {c.education.length > 0 && (
        <>
          {sectionBar('EDUCATIONAL QUALIFICATION')}
          <div style={{ paddingLeft: 4 }}>
            {c.education.map((e, i) => (
              <p key={e.id} style={{ margin: '0 0 8px', display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: fs }}>
                <span style={{ color: STAR_COLORS[i % STAR_COLORS.length], fontSize: fs + 4, lineHeight: 1.2 }} aria-hidden>
                  ✦
                </span>
                <span>
                  {formatEducationLine(
                    [e.degree, e.field].filter(Boolean).join(' ').trim(),
                    e.school,
                    e.endDate || e.startDate,
                    e.grade
                  ) || [e.degree, e.school].filter(Boolean).join(' — ')}
                  {e.description && (
                    <>
                      <br />
                      <span style={{ fontSize: fs - 1 }}>{e.description}</span>
                    </>
                  )}
                </span>
              </p>
            ))}
          </div>
        </>
      )}

      {/* Personal details table */}
      {personalRows.length > 0 && (
        <>
          {sectionBar('PERSONAL DETAILS')}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs }}>
            <tbody>
              {personalRows.map(([label, value]) => (
                <tr key={label}>
                  <td style={{ width: '38%', padding: '3px 0', fontWeight: 600, verticalAlign: 'top' }}>{label}</td>
                  <td style={{ width: '6%', textAlign: 'center', verticalAlign: 'top' }}>-</td>
                  <td style={{ padding: '3px 0', verticalAlign: 'top' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Optional experience for Indian template if visible */}
      {c.experience.length > 0 && doc.sections.some((s) => s.type === 'experience' && s.visible) && (
        <>
          {sectionBar('WORK EXPERIENCE')}
          {c.experience.map((e) => (
            <p key={e.id} style={{ margin: '0 0 8px', fontSize: fs }}>
              <strong>{e.role}</strong> — {e.company} ({e.startDate} – {e.current ? 'Present' : e.endDate})
              {e.description && (
                <>
                  <br />
                  {e.description}
                </>
              )}
            </p>
          ))}
        </>
      )}

      {/* Declaration */}
      <div style={{ marginTop: 20 }}>
        <p
          style={{
            margin: '0 0 10px',
            fontWeight: 700,
            textDecoration: 'underline',
            textTransform: 'uppercase',
            fontSize: fs + 1,
          }}
        >
          DECLARATION
        </p>
        <p style={{ margin: '0 0 24px', fontSize: fs, textAlign: 'justify', lineHeight: 1.5 }}>
          I hereby declare that all the information furnished above is true and correct to the best of my Knowledge and
          belief.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs }}>
          <div>
            <p style={{ margin: '0 0 6px' }}>Date {p.declarationDate || '.........'}</p>
            <p style={{ margin: 0 }}>Place {p.declarationPlace || p.location?.split(',')[0] || '.........'}</p>
          </div>
          <p style={{ margin: 0, fontWeight: 600, alignSelf: 'flex-end' }}>({p.fullName || 'Your Name'})</p>
        </div>
      </div>
    </div>
  );
}
