'use client';

import { useResumeStore } from '@/store/resume-store';
import { RbButton, RbInput, RbLabel, RbTextarea } from './ui';
import { uid } from '@/lib/resume-builder/types';

export default function SectionEditor({ activeSection }: { activeSection: string }) {
  const { document, updateContent } = useResumeStore();
  const c = document.content;

  const blurHistory = { onBlur: () => updateContent({}, { saveHistory: true }) };

  if (activeSection === 'personal') {
    return (
      <div className="space-y-3">
        <RbLabel>Full name</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.fullName}
          onChange={(e) => updateContent({ personal: { ...c.personal, fullName: e.target.value } })}
          {...blurHistory}
        />
        <RbLabel>Job title</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.jobTitle}
          onChange={(e) => updateContent({ personal: { ...c.personal, jobTitle: e.target.value } })}
          {...blurHistory}
        />
        <RbLabel>Email</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.email}
          onChange={(e) => updateContent({ personal: { ...c.personal, email: e.target.value } })}
          {...blurHistory}
        />
        <RbLabel>Phone</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.phone}
          onChange={(e) => updateContent({ personal: { ...c.personal, phone: e.target.value } })}
          {...blurHistory}
        />
        <RbLabel>Location</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.location}
          onChange={(e) => updateContent({ personal: { ...c.personal, location: e.target.value } })}
          {...blurHistory}
        />
        <RbLabel>Website / Portfolio</RbLabel>
        <RbInput
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.personal.website}
          onChange={(e) => updateContent({ personal: { ...c.personal, website: e.target.value } })}
          {...blurHistory}
        />
      </div>
    );
  }

  if (activeSection === 'summary') {
    return (
      <div>
        <RbLabel>Professional summary</RbLabel>
        <RbTextarea
          rows={7}
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.summary}
          onChange={(e) => updateContent({ summary: e.target.value })}
          onBlur={() => updateContent({}, { saveHistory: true })}
          placeholder="Write 3–4 lines about your experience and goals..."
        />
      </div>
    );
  }

  if (activeSection === 'skills') {
    return (
      <div>
        <RbLabel>Skills (comma separated)</RbLabel>
        <RbTextarea
          rows={4}
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={c.skills.join(', ')}
          onChange={(e) =>
            updateContent({
              skills: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          onBlur={() => updateContent({}, { saveHistory: true })}
        />
      </div>
    );
  }

  if (activeSection === 'experience' || activeSection === 'internships') {
    const key = activeSection === 'internships' ? 'internships' : 'experience';
    const list = c[key];
    return (
      <div className="space-y-3">
        {list.map((exp, idx) => (
          <div key={exp.id} className="rounded-xl border border-white/15 bg-slate-900/40 p-3 space-y-2">
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Job role"
              value={exp.role}
              onChange={(e) => {
                const next = [...list];
                next[idx] = { ...exp, role: e.target.value };
                updateContent({ [key]: next });
              }}
            />
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const next = [...list];
                next[idx] = { ...exp, company: e.target.value };
                updateContent({ [key]: next });
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <RbInput
                className="!bg-slate-950/50 !border-white/15 !text-white"
                placeholder="Start"
                value={exp.startDate}
                onChange={(e) => {
                  const next = [...list];
                  next[idx] = { ...exp, startDate: e.target.value };
                  updateContent({ [key]: next });
                }}
              />
              <RbInput
                className="!bg-slate-950/50 !border-white/15 !text-white"
                placeholder="End"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => {
                  const next = [...list];
                  next[idx] = { ...exp, endDate: e.target.value };
                  updateContent({ [key]: next });
                }}
              />
            </div>
            <RbTextarea
              rows={3}
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="What did you achieve?"
              value={exp.description}
              onChange={(e) => {
                const next = [...list];
                next[idx] = { ...exp, description: e.target.value };
                updateContent({ [key]: next });
              }}
              onBlur={() => updateContent({}, { saveHistory: true })}
            />
          </div>
        ))}
        <RbButton
          variant="secondary"
          onClick={() =>
            updateContent(
              {
                [key]: [
                  ...list,
                  {
                    id: uid(),
                    role: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  },
                ],
              },
              { saveHistory: true }
            )
          }
        >
          + Add {activeSection === 'internships' ? 'internship' : 'job'}
        </RbButton>
      </div>
    );
  }

  if (activeSection === 'education') {
    return (
      <div className="space-y-3">
        {c.education.map((edu, idx) => (
          <div key={edu.id} className="rounded-xl border border-white/15 bg-slate-900/40 p-3 space-y-2">
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => {
                const education = [...c.education];
                education[idx] = { ...edu, degree: e.target.value };
                updateContent({ education });
              }}
            />
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="School / College"
              value={edu.school}
              onChange={(e) => {
                const education = [...c.education];
                education[idx] = { ...edu, school: e.target.value };
                updateContent({ education });
              }}
            />
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Field / Stream"
              value={edu.field}
              onChange={(e) => {
                const education = [...c.education];
                education[idx] = { ...edu, field: e.target.value };
                updateContent({ education });
              }}
            />
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Grade / %"
              value={edu.grade}
              onChange={(e) => {
                const education = [...c.education];
                education[idx] = { ...edu, grade: e.target.value };
                updateContent({ education });
              }}
              onBlur={() => updateContent({}, { saveHistory: true })}
            />
          </div>
        ))}
        <RbButton
          variant="secondary"
          onClick={() =>
            updateContent(
              {
                education: [
                  ...c.education,
                  { id: uid(), school: '', degree: '', field: '', startDate: '', endDate: '', grade: '', description: '' },
                ],
              },
              { saveHistory: true }
            )
          }
        >
          + Add education
        </RbButton>
      </div>
    );
  }

  if (activeSection === 'projects') {
    return (
      <div className="space-y-3">
        {c.projects.map((p, idx) => (
          <div key={p.id} className="rounded-xl border border-white/15 bg-slate-900/40 p-3 space-y-2">
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Project name"
              value={p.name}
              onChange={(e) => {
                const projects = [...c.projects];
                projects[idx] = { ...p, name: e.target.value };
                updateContent({ projects });
              }}
            />
            <RbInput
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Link"
              value={p.link}
              onChange={(e) => {
                const projects = [...c.projects];
                projects[idx] = { ...p, link: e.target.value };
                updateContent({ projects });
              }}
            />
            <RbTextarea
              rows={3}
              className="!bg-slate-950/50 !border-white/15 !text-white"
              placeholder="Description"
              value={p.description}
              onChange={(e) => {
                const projects = [...c.projects];
                projects[idx] = { ...p, description: e.target.value };
                updateContent({ projects });
              }}
              onBlur={() => updateContent({}, { saveHistory: true })}
            />
          </div>
        ))}
        <RbButton
          variant="secondary"
          onClick={() =>
            updateContent(
              { projects: [...c.projects, { id: uid(), name: '', link: '', description: '', technologies: [] }] },
              { saveHistory: true }
            )
          }
        >
          + Add project
        </RbButton>
      </div>
    );
  }

  if (activeSection === 'achievements' || activeSection === 'interests') {
    const key = activeSection;
    const val = c[key].join('\n');
    return (
      <div>
        <RbLabel>One per line</RbLabel>
        <RbTextarea
          rows={6}
          className="!bg-slate-900/50 !border-white/20 !text-white"
          value={val}
          onChange={(e) =>
            updateContent({
              [key]: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
            })
          }
          onBlur={() => updateContent({}, { saveHistory: true })}
        />
      </div>
    );
  }

  if (activeSection === 'social') {
    return (
      <div className="space-y-3">
        {c.social.map((s, idx) => (
          <div key={s.id} className="grid grid-cols-1 gap-2">
            <RbInput
              className="!bg-slate-900/50 !border-white/20 !text-white"
              placeholder="LinkedIn / GitHub"
              value={s.platform}
              onChange={(e) => {
                const social = [...c.social];
                social[idx] = { ...s, platform: e.target.value };
                updateContent({ social });
              }}
            />
            <RbInput
              className="!bg-slate-900/50 !border-white/20 !text-white"
              placeholder="URL"
              value={s.url}
              onChange={(e) => {
                const social = [...c.social];
                social[idx] = { ...s, url: e.target.value };
                updateContent({ social });
              }}
              onBlur={() => updateContent({}, { saveHistory: true })}
            />
          </div>
        ))}
        <RbButton
          variant="secondary"
          onClick={() =>
            updateContent({ social: [...c.social, { id: uid(), platform: '', url: '' }] }, { saveHistory: true })
          }
        >
          + Add link
        </RbButton>
      </div>
    );
  }

  return (
    <p className="text-sm text-slate-400">
      Toggle section ON and fill basic fields. More fields for this section coming soon — use Experience, Education,
      Projects for now.
    </p>
  );
}
