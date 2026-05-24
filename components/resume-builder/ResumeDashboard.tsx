'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  FileText,
  LogOut,
  Sparkles,
  LayoutTemplate,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { RbButton, RbInput, cn } from './ui';
import { getTemplateById } from '@/lib/resume-builder/templates';
import {
  JANSEVA_FEATURED_TEMPLATES,
  JANSEVA_LOGO_SRC,
  JANSEVA_BRAND_LINE,
  JANSEVA_OWNER_LINE,
  type IndianTemplateId,
} from '@/lib/resume-builder/janseva-templates';

interface ResumeRow {
  id: string;
  title: string;
  templateId: string;
  completionPercent: number;
  atsScore: number;
  updatedAt: string;
}

export default function ResumeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const me = await fetch('/api/resume-builder/auth/me');
    if (!me.ok) {
      router.push('/resume-builder/login');
      return;
    }
    const meData = await me.json();
    setUser(meData.user);

    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    const res = await fetch(`/api/resume-builder/resumes${params}`);
    const data = await res.json();
    setResumes(data.resumes || []);
    setLoading(false);
  }, [q, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const createResume = async (templateId: IndianTemplateId = 'janseva-classic') => {
    setCreating(true);
    try {
      const res = await fetch('/api/resume-builder/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'My Resume', templateId }),
      });
      const data = await res.json();
      if (data.resume?.id) router.push(`/resume-builder/editor/${data.resume.id}`);
    } finally {
      setCreating(false);
    }
  };

  const duplicate = async (id: string) => {
    await fetch(`/api/resume-builder/resumes/${id}/duplicate`, { method: 'POST' });
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    await fetch(`/api/resume-builder/resumes/${id}`, { method: 'DELETE' });
    void load();
  };

  const logout = async () => {
    await fetch('/api/resume-builder/auth/logout', { method: 'POST' });
    router.push('/resume-builder');
  };

  const avgCompletion = resumes.length
    ? Math.round(resumes.reduce((a, r) => a + r.completionPercent, 0) / resumes.length)
    : 0;
  const avgAts = resumes.length
    ? Math.round(resumes.reduce((a, r) => a + r.atsScore, 0) / resumes.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(139,92,246,0.15),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={JANSEVA_LOGO_SRC} alt="" className="w-11 h-11 object-contain" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400">{JANSEVA_BRAND_LINE}</p>
                <p className="text-sm font-semibold text-slate-300">{JANSEVA_OWNER_LINE}</p>
              </div>
            </div>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hello, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RbButton onClick={() => createResume('janseva-classic')} disabled={creating}>
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'New Resume'}
            </RbButton>
            <RbButton variant="ghost" className="!text-slate-300" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </RbButton>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-slate-900/60 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white">Jan Seva CSC Resume Templates</h2>
          <p className="text-sm text-slate-400 mt-1">
            Aapke diye gaye format jaisa — logo, border, Career Objective, Education, Personal Details &amp; Declaration.
            Fully editable.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {JANSEVA_FEATURED_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                disabled={creating}
                onClick={() => createResume(tpl.id)}
                className="rounded-xl border border-white/15 bg-white/5 p-4 text-left hover:border-blue-400/50 hover:bg-white/10 transition-all"
              >
                <div className={cn('h-14 rounded-lg bg-gradient-to-br mb-3', tpl.previewGradient)} />
                <p className="font-bold text-white text-sm">{tpl.name}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.description}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-blue-300">+ Create &amp; Edit</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total resumes', value: resumes.length, icon: FileText, color: 'from-blue-500/20 to-blue-600/5' },
            { label: 'Avg completion', value: `${avgCompletion}%`, icon: Sparkles, color: 'from-emerald-500/20 to-emerald-600/5' },
            { label: 'Avg ATS score', value: `${avgAts}%`, icon: LayoutTemplate, color: 'from-violet-500/20 to-violet-600/5' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className={cn('rounded-2xl border border-white/10 bg-gradient-to-br p-5 backdrop-blur', color)}
            >
              <Icon className="w-5 h-5 text-blue-300 mb-3" />
              <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-500" />
            <RbInput
              className="!pl-10 !bg-white/5 !border-white/15 !text-white !rounded-xl"
              placeholder="Search resumes by title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void load()}
            />
          </div>
          <RbButton variant="secondary" onClick={() => void load()}>
            Search
          </RbButton>
        </div>

        <div className="mt-6 space-y-3">
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400 animate-pulse">
              Loading your resumes...
            </div>
          )}

          {!loading && resumes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-500 mb-4" />
              <h2 className="text-xl font-bold">No resumes yet</h2>
              <p className="text-slate-400 mt-2 text-sm">Create your first professional CV in under 2 minutes.</p>
              <RbButton className="mt-6" onClick={() => createResume('janseva-classic')}>
                <Plus className="w-4 h-4" /> Start building
              </RbButton>
            </div>
          )}

          {resumes.map((r) => {
            const tpl = getTemplateById(r.templateId);
            return (
              <div
                key={r.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 hover:border-blue-500/40 hover:bg-white/[0.07] transition-all duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0 flex-1">
                    <div className={cn('w-14 h-16 rounded-lg bg-gradient-to-br shrink-0', tpl.previewGradient)} />
                    <div className="min-w-0">
                      <Link
                        href={`/resume-builder/editor/${r.id}`}
                        className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors truncate block"
                      >
                        {r.title}
                      </Link>
                      <p className="text-sm text-slate-400 mt-0.5">{tpl.name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[120px]">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Completion</span>
                            <span>{r.completionPercent}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${r.completionPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>ATS</span>
                            <span>{r.atsScore}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-violet-500 transition-all duration-500"
                              style={{ width: `${r.atsScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/resume-builder/editor/${r.id}`}>
                      <RbButton>
                        Edit <ArrowRight className="w-4 h-4" />
                      </RbButton>
                    </Link>
                    <RbButton variant="secondary" onClick={() => duplicate(r.id)} aria-label="Duplicate">
                      <Copy className="w-4 h-4" />
                    </RbButton>
                    <RbButton variant="ghost" className="!text-red-400" onClick={() => remove(r.id)} aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </RbButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center">
          <Link href="/resume-builder" className="text-sm text-slate-500 hover:text-white transition">
            ← Back to Resume Builder home
          </Link>
        </p>
      </div>
    </div>
  );
}
