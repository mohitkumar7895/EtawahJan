'use client';

import { memo } from 'react';
import type { ResumeContent, ResumeDocument, ResumeSectionConfig } from '@/lib/resume-builder/types';
import { getTemplateById } from '@/lib/resume-builder/templates';

interface Props {
  document: ResumeDocument;
  className?: string;
  dark?: boolean;
}

function visibleSections(sections: ResumeSectionConfig[]) {
  return [...sections].filter((s) => s.visible && s.type !== 'personal').sort((a, b) => a.order - b.order);
}

function ResumeDocumentView({ document: doc, className = '', dark = false }: Props) {
  const c = doc.content;
  const t = doc.theme;
  const meta = getTemplateById(doc.templateId);
  const layout = meta.layout;

  const isSidebar =
    layout === 'sidebar' ||
    ['developer', 'sidebar', 'dark', 'creative', 'designer'].includes(doc.templateId);
  const isDark = dark || doc.templateId === 'dark' || doc.templateId === 'developer';
  const isCompact = layout === 'compact' || ['compact', 'one-page', 'ats', 'minimal'].includes(doc.templateId);
  const isTimeline = layout === 'timeline' || doc.templateId === 'timeline';
  const isAts = doc.templateId === 'ats' || layout === 'compact';

  const bg = isDark ? '#0f172a' : t.backgroundColor;
  const text = isDark ? '#f1f5f9' : t.textColor;
  const primary = t.primaryColor;
  const accent = t.accentColor;
  const fs = isCompact ? Math.max(11, t.fontSize - 2) : t.fontSize;
  const gap = isCompact ? Math.max(10, t.spacing - 4) : t.spacing;

  const contactLine = [c.personal.email, c.personal.phone, c.personal.location, c.personal.website]
    .filter(Boolean)
    .join('  ·  ');

  const sectionTitle = (title: string) => ({
    fontSize: fs + 1,
    fontWeight: 700 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: isAts ? '#000' : primary,
    borderBottom: isAts ? '1px solid #000' : `2px solid ${primary}33`,
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 0,
  });

  const block = { marginBottom: gap, color: text };

  const renderSection = (section: ResumeSectionConfig) => {
    switch (section.type) {
      case 'summary':
        if (!c.summary.trim()) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Profile')}>Profile Summary</h2>
            <p style={{ margin: 0, fontSize: fs, lineHeight: t.lineHeight, whiteSpace: 'pre-wrap' }}>{c.summary}</p>
          </div>
        );
      case 'skills':
        if (!c.skills.length) return null;
        if (isSidebar) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Skills')}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {c.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: fs - 1,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: `${primary}18`,
                    color: primary,
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      case 'experience':
        if (!c.experience.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Experience')}>Work Experience</h2>
            {c.experience.map((e) => (
              <div
                key={e.id}
                style={{
                  marginBottom: 10,
                  paddingLeft: isTimeline ? 12 : 0,
                  borderLeft: isTimeline ? `3px solid ${accent}` : undefined,
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, fontSize: fs + 1 }}>{e.role || 'Role'}</p>
                <p style={{ margin: '2px 0', fontSize: fs - 1, opacity: 0.9 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </p>
                <p style={{ margin: '2px 0 6px', fontSize: fs - 2, opacity: 0.75 }}>
                  {e.startDate} – {e.current ? 'Present' : e.endDate}
                </p>
                {e.description && (
                  <p style={{ margin: 0, fontSize: fs - 1, lineHeight: t.lineHeight, whiteSpace: 'pre-wrap' }}>
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      case 'education':
        if (!c.education.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Education')}>Education</h2>
            {c.education.map((e) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: fs }}>
                  {[e.degree, e.field].filter(Boolean).join(' — ')}
                </p>
                <p style={{ margin: '2px 0', fontSize: fs - 1 }}>{e.school}</p>
                <p style={{ margin: 0, fontSize: fs - 2, opacity: 0.8 }}>
                  {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                  {e.grade ? ` · ${e.grade}` : ''}
                </p>
                {e.description && (
                  <p style={{ margin: '4px 0 0', fontSize: fs - 1, whiteSpace: 'pre-wrap' }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      case 'projects':
        if (!c.projects.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Projects')}>Projects</h2>
            {c.projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: fs }}>{p.name}</p>
                {p.link && <p style={{ margin: '2px 0', fontSize: fs - 2, color: primary }}>{p.link}</p>}
                {p.technologies?.length > 0 && (
                  <p style={{ margin: '2px 0', fontSize: fs - 2, opacity: 0.85 }}>{p.technologies.join(', ')}</p>
                )}
                {p.description && (
                  <p style={{ margin: '4px 0 0', fontSize: fs - 1, whiteSpace: 'pre-wrap' }}>{p.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      case 'certifications':
        if (!c.certifications.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Certs')}>Certifications</h2>
            {c.certifications.map((cert) => (
              <p key={cert.id} style={{ margin: '0 0 6px', fontSize: fs - 1 }}>
                <strong>{cert.name}</strong>
                {cert.issuer ? ` — ${cert.issuer}` : ''}
                {cert.date ? ` (${cert.date})` : ''}
              </p>
            ))}
          </div>
        );
      case 'languages':
        if (!c.languages.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Lang')}>Languages</h2>
            {c.languages.map((l) => (
              <p key={l.id} style={{ margin: '0 0 4px', fontSize: fs - 1 }}>
                {l.name} — {l.level}
              </p>
            ))}
          </div>
        );
      case 'achievements':
        if (!c.achievements.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Achieve')}>Achievements</h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: fs - 1 }}>
              {c.achievements.map((a, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'internships':
        if (!c.internships.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Intern')}>Internships</h2>
            {c.internships.map((e) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: fs }}>{e.role}</p>
                <p style={{ margin: '2px 0', fontSize: fs - 1 }}>{e.company}</p>
                {e.description && <p style={{ margin: '4px 0 0', fontSize: fs - 1 }}>{e.description}</p>}
              </div>
            ))}
          </div>
        );
      case 'interests':
        if (!c.interests.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Interests')}>Interests</h2>
            <p style={{ margin: 0, fontSize: fs - 1 }}>{c.interests.join(' · ')}</p>
          </div>
        );
      case 'references':
        if (!c.references.length) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Ref')}>References</h2>
            {c.references.map((r) => (
              <p key={r.id} style={{ margin: '0 0 6px', fontSize: fs - 1 }}>
                <strong>{r.name}</strong> — {r.title}, {r.company}
                <br />
                {r.email} {r.phone ? `· ${r.phone}` : ''}
              </p>
            ))}
          </div>
        );
      case 'social':
        if (!c.social.length || isSidebar) return null;
        return (
          <div key={section.id} style={block}>
            <h2 style={sectionTitle('Links')}>Social Links</h2>
            {c.social.map((l) => (
              <p key={l.id} style={{ margin: '0 0 4px', fontSize: fs - 1, color: primary }}>
                {l.platform}: {l.url}
              </p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const sidebarContent = (
    <div
      style={{
        background: isDark ? '#1e293b' : `${primary}14`,
        borderRadius: isAts ? 0 : 8,
        padding: gap,
        color: text,
        height: '100%',
      }}
    >
      <h1 style={{ margin: 0, fontSize: fs + 8, fontWeight: 800, lineHeight: 1.2, color: text }}>
        {c.personal.fullName || 'Your Name'}
      </h1>
      <p style={{ margin: '6px 0 12px', fontSize: fs, fontWeight: 600, color: accent }}>{c.personal.jobTitle}</p>
      {contactLine && <p style={{ margin: '0 0 12px', fontSize: fs - 2, lineHeight: 1.5, opacity: 0.95 }}>{contactLine}</p>}

      {c.skills.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ ...sectionTitle('Skills'), fontSize: fs - 1 }}>Skills</p>
          {c.skills.map((s) => (
            <p key={s} style={{ margin: '0 0 3px', fontSize: fs - 1 }}>
              • {s}
            </p>
          ))}
        </div>
      )}

      {c.social.length > 0 && (
        <div>
          <p style={{ ...sectionTitle('Links'), fontSize: fs - 1 }}>Links</p>
          {c.social.map((l) => (
            <p key={l.id} style={{ margin: '0 0 4px', fontSize: fs - 2, wordBreak: 'break-all' }}>
              {l.platform}
              <br />
              <span style={{ opacity: 0.85 }}>{l.url}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const headerBlock = (
    <div
      style={{
        marginBottom: gap,
        padding: gap,
        borderRadius: isAts ? 0 : 10,
        background:
          doc.templateId === 'gradient'
            ? `linear-gradient(135deg, ${primary}, ${accent})`
            : isAts
              ? 'transparent'
              : primary,
        color: isAts ? text : '#ffffff',
        borderBottom: isAts ? '2px solid #000' : undefined,
      }}
    >
      <h1 style={{ margin: 0, fontSize: fs + 10, fontWeight: 800, lineHeight: 1.15 }}>{c.personal.fullName || 'Your Name'}</h1>
      <p style={{ margin: '6px 0 0', fontSize: fs + 1, fontWeight: 600, opacity: 0.95 }}>{c.personal.jobTitle}</p>
      {contactLine && (
        <p style={{ margin: '10px 0 0', fontSize: fs - 1, lineHeight: 1.6, opacity: 0.92 }}>{contactLine}</p>
      )}
    </div>
  );

  const mainBody = visibleSections(doc.sections).map(renderSection);

  return (
    <div
      id="resume-print-root"
      className={className}
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: bg,
        color: text,
        fontFamily: t.fontFamily,
        fontSize: fs,
        lineHeight: t.lineHeight,
        padding: `${gap}px`,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        transition: 'background 0.25s ease, color 0.25s ease',
      }}
    >
      {isSidebar ? (
        <div style={{ display: 'grid', gridTemplateColumns: '32% 1fr', gap: gap }}>
          {sidebarContent}
          <div>{mainBody}</div>
        </div>
      ) : (
        <>
          {headerBlock}
          {mainBody}
        </>
      )}
    </div>
  );
}

export default memo(ResumeDocumentView, (prev, next) => {
  const a = prev.document;
  const b = next.document;
  return (
    a.templateId === b.templateId &&
    a.theme === b.theme &&
    a.sections === b.sections &&
    a.content === b.content &&
    prev.dark === next.dark &&
    prev.className === next.className
  );
});
