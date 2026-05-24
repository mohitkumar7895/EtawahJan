'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  Wand2,
  Save,
  LayoutTemplate,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
import ResumeDocumentView from './ResumeDocument';
import ExportPdfButton from './ExportPdfButton';
import SectionEditor from './SectionEditor';
import { RbButton, RbCard, RbInput, RbLabel, cn } from './ui';
import { getTemplateById, RESUME_TEMPLATES } from '@/lib/resume-builder/templates';

export default function ResumeEditor({ resumeId }: { resumeId: string }) {
  const {
    document,
    activeSection,
    zoom,
    sidebarOpen,
    previewMode,
    darkPreview,
    isDirty,
    lastSavedAt,
    loadDocument,
    setActiveSection,
    setZoom,
    toggleSidebar,
    setPreviewMode,
    setDarkPreview,
    reorderSections,
    setSections,
    updateTheme,
    setTemplate,
    updateContent,
    patchDocument,
    undo,
    redo,
    markSaved,
  } = useResumeStore();

  const [aiLoading, setAiLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<{ score: number; suggestions: string[] } | null>(null);
  const [tab, setTab] = useState<'edit' | 'templates' | 'customize' | 'ai'>('edit');
  const [templateApplied, setTemplateApplied] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/resume-builder/resumes/${resumeId}`);
    const data = await res.json();
    if (data.resume) {
      loadDocument(
        {
          title: data.resume.title,
          templateId: data.resume.templateId,
          theme: data.resume.theme,
          sections: data.resume.sections,
          content: data.resume.content,
          completionPercent: data.resume.completionPercent,
          atsScore: data.resume.atsScore,
          version: data.resume.version,
        },
        resumeId
      );
    }
  }, [resumeId, loadDocument]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    const state = useResumeStore.getState();
    const res = await fetch(`/api/resume-builder/resumes/${resumeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...state.document, isPublic: false }),
    });
    if (res.ok) markSaved();
  }, [resumeId, markSaved]);

  useEffect(() => {
    if (!isDirty) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(), 2800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [isDirty, document, save]);

  const moveSection = (index: number, direction: -1 | 1) => {
    const items = [...document.sections].sort((a, b) => a.order - b.order);
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    reorderSections(items.map((s, i) => ({ ...s, order: i })));
  };

  const toggleSectionVisible = (sectionId: string) => {
    const sections = document.sections.map((s) =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    setSections(sections);
  };

  const applyTemplate = (templateId: string) => {
    setTemplate(templateId);
    setTemplateApplied(templateId);
    setTab('edit');
    window.setTimeout(() => setTemplateApplied(null), 2000);
  };

  const c = document.content;
  const activeTpl = getTemplateById(document.templateId);

  const resumeText = useMemo(() => JSON.stringify(c), [c]);

  const runAiSummary = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/resume-builder/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: c.personal.jobTitle,
          skills: c.skills,
          experience: c.experience.map((e) => e.description).join(' '),
        }),
      });
      const data = await res.json();
      if (data.summary) updateContent({ summary: data.summary }, { saveHistory: true });
    } finally {
      setAiLoading(false);
    }
  };

  const runAiSkills = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/resume-builder/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: c.personal.jobTitle || 'Professional', summary: c.summary }),
      });
      const data = await res.json();
      if (data.skills) updateContent({ skills: [...new Set([...c.skills, ...data.skills])] }, { saveHistory: true });
    } finally {
      setAiLoading(false);
    }
  };

  const runAts = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/resume-builder/ai/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setAtsResult(data);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_40%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <Link href="/resume-builder/dashboard" className="text-sm text-slate-400 hover:text-white shrink-0">
              ← Dashboard
            </Link>
            <RbInput
              className="max-w-[200px] sm:max-w-[260px] !bg-white/5 !border-white/15 !text-white !rounded-xl"
              value={document.title}
              onChange={(e) => patchDocument({ title: e.target.value })}
              onBlur={(e) => patchDocument({ title: e.target.value }, { saveHistory: true })}
            />
            <span className="hidden sm:inline rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs text-emerald-300 font-medium">
              {document.completionPercent}% · ATS {document.atsScore}%
            </span>
            <span className="hidden md:inline rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
              {activeTpl.name}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={undo} className="rounded-lg p-2 hover:bg-white/10 text-slate-300" aria-label="Undo">
              <Undo2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={redo} className="rounded-lg p-2 hover:bg-white/10 text-slate-300" aria-label="Redo">
              <Redo2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setZoom(zoom - 10)} className="rounded-lg p-2 hover:bg-white/10 text-slate-300">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 w-8 text-center">{zoom}%</span>
            <button type="button" onClick={() => setZoom(zoom + 10)} className="rounded-lg p-2 hover:bg-white/10 text-slate-300">
              <ZoomIn className="w-4 h-4" />
            </button>
            <RbButton variant="ghost" className="!text-slate-300" onClick={toggleSidebar}>
              <PanelLeft className="w-4 h-4" />
            </RbButton>
            <RbButton variant="secondary" onClick={() => void save()}>
              <Save className="w-4 h-4" />
              {isDirty ? 'Save' : 'Saved'}
            </RbButton>
            <ExportPdfButton title={document.title} />
          </div>
        </div>
        {lastSavedAt && (
          <p className="pb-2 text-center text-[10px] text-slate-600">
            Auto-saved {new Date(lastSavedAt).toLocaleTimeString()}
          </p>
        )}
      </header>

      <div className="relative mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[minmax(280px,340px)_1fr]">
        {sidebarOpen && (
          <aside className="space-y-3 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-1">
            <div className="flex gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
              {(['edit', 'templates', 'customize', 'ai'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex-1 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-semibold capitalize transition-colors',
                    tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'edit' && (
              <>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 px-1">Sections</p>
                <div className="space-y-1">
                  {[...document.sections]
                    .sort((a, b) => a.order - b.order)
                    .map((s, index) => (
                      <div
                        key={s.id}
                        className={cn(
                          'flex items-center gap-1 rounded-xl border transition-colors',
                          activeSection === s.id
                            ? 'border-blue-500/50 bg-blue-600/15'
                            : 'border-transparent bg-white/[0.04]'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveSection(String(s.id))}
                          className={cn(
                            'flex-1 rounded-lg px-3 py-2.5 text-left text-sm truncate',
                            activeSection === s.id ? 'text-white font-semibold' : 'text-slate-300'
                          )}
                        >
                          {s.label}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSectionVisible(String(s.id))}
                          className={cn(
                            'text-[10px] font-bold px-2 py-1 rounded-lg mr-1',
                            s.visible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-500'
                          )}
                        >
                          {s.visible ? 'ON' : 'OFF'}
                        </button>
                        <button type="button" onClick={() => moveSection(index, -1)} className="p-1 hover:bg-white/10 rounded text-slate-400" aria-label="Move up">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveSection(index, 1)} className="p-1 hover:bg-white/10 rounded text-slate-400 mr-1" aria-label="Move down">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>

                <RbCard className="!bg-white/[0.04] !text-white border-white/10 !rounded-2xl">
                  <p className="text-xs text-slate-500 mb-3">
                    Fill details — preview updates live on the right.
                  </p>
                  <SectionEditor activeSection={activeSection} />
                </RbCard>
              </>
            )}

            {tab === 'templates' && (
              <div>
                <p className="text-xs text-slate-400 mb-3 px-1">Tap a template — colors & layout update instantly.</p>
                <div className="grid grid-cols-2 gap-2 max-h-[58vh] overflow-y-auto pr-1">
                  {RESUME_TEMPLATES.map((t) => {
                    const active = document.templateId === t.id;
                    const justApplied = templateApplied === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => applyTemplate(t.id)}
                        className={cn(
                          'relative rounded-xl border p-2.5 text-left text-xs transition-all duration-200',
                          active
                            ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/40 scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                        )}
                      >
                        {justApplied && (
                          <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            <Check className="w-3 h-3" /> Applied
                          </span>
                        )}
                        <div className={cn('mb-2 h-12 rounded-lg bg-gradient-to-br', t.previewGradient)} />
                        <p className="font-semibold text-white leading-tight">{t.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{t.layout}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'customize' && (
              <RbCard className="space-y-4 !bg-white/[0.04] border-white/10 !rounded-2xl">
                <RbLabel>Primary color</RbLabel>
                <input
                  type="color"
                  value={document.theme.primaryColor}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  onPointerUp={() => updateTheme({}, { saveHistory: true })}
                  className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                />
                <RbLabel>Font size ({document.theme.fontSize}px)</RbLabel>
                <input
                  type="range"
                  min={11}
                  max={18}
                  value={document.theme.fontSize}
                  onChange={(e) => updateTheme({ fontSize: Number(e.target.value) })}
                  onPointerUp={() => updateTheme({}, { saveHistory: true })}
                  className="w-full accent-blue-500"
                />
                <RbLabel>Spacing ({document.theme.spacing}px)</RbLabel>
                <input
                  type="range"
                  min={10}
                  max={28}
                  value={document.theme.spacing}
                  onChange={(e) => updateTheme({ spacing: Number(e.target.value) })}
                  onPointerUp={() => updateTheme({}, { saveHistory: true })}
                  className="w-full accent-blue-500"
                />
                <div className="flex gap-2">
                  <RbButton
                    variant={previewMode === 'desktop' ? 'primary' : 'secondary'}
                    className="flex-1"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    Desktop
                  </RbButton>
                  <RbButton
                    variant={previewMode === 'mobile' ? 'primary' : 'secondary'}
                    className="flex-1"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    Mobile
                  </RbButton>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded accent-blue-500"
                    checked={darkPreview}
                    onChange={(e) => setDarkPreview(e.target.checked)}
                  />
                  Dark preview mode
                </label>
              </RbCard>
            )}

            {tab === 'ai' && (
              <RbCard className="space-y-3 !bg-white/[0.04] border-white/10 !rounded-2xl">
                <RbButton onClick={runAiSummary} disabled={aiLoading} className="w-full justify-center">
                  <Sparkles className="w-4 h-4" /> AI Summary
                </RbButton>
                <RbButton variant="secondary" onClick={runAiSkills} disabled={aiLoading} className="w-full justify-center">
                  <Wand2 className="w-4 h-4" /> AI Skills
                </RbButton>
                <RbButton variant="secondary" onClick={runAts} disabled={aiLoading} className="w-full justify-center">
                  <LayoutTemplate className="w-4 h-4" /> ATS Check
                </RbButton>
                {atsResult && (
                  <div className="rounded-xl bg-slate-950/60 border border-white/10 p-3 text-sm">
                    <p className="font-bold text-emerald-400">ATS Score: {atsResult.score}%</p>
                    <ul className="mt-2 list-disc pl-4 text-slate-400 space-y-1">
                      {atsResult.suggestions.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </RbCard>
            )}
          </aside>
        )}

        <main className="flex justify-center overflow-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-8 min-h-[70vh]">
          <div
            className={cn('transition-transform duration-200 ease-out', previewMode === 'mobile' && 'max-w-[390px] w-full')}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <ResumeDocumentView
              key={`${document.templateId}-${document.theme.primaryColor}-${document.theme.fontSize}`}
              document={document}
              dark={darkPreview}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
