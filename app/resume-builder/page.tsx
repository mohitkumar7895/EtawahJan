import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, Sparkles, Download, LayoutTemplate, Shield, Zap } from 'lucide-react';
import { RESUME_TEMPLATES } from '@/lib/resume-builder/templates';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import { getSeoToolBySlug, SITE_ORIGIN } from '@/lib/seo/tools-catalog';

const TOOL = getSeoToolBySlug('resume-builder')!;

export const metadata: Metadata = {
  title: TOOL.title,
  description: TOOL.description,
  keywords: TOOL.keywords,
  openGraph: {
    title: TOOL.title,
    description: TOOL.description,
    url: `${SITE_ORIGIN}${TOOL.path}`,
    type: 'website',
    images: [{ url: `${SITE_ORIGIN}/jan-seva-logo-1.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TOOL.title,
    description: TOOL.description,
  },
  alternates: {
    canonical: `${SITE_ORIGIN}${TOOL.path}`,
  },
};

export default function ResumeBuilderLandingPage() {
  return (
    <>
      <ToolJsonLd tool={TOOL} />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white">
        <section className="relative overflow-hidden px-4 py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI-Powered Resume Builder
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Build a premium resume in minutes
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              20+ professional templates, live preview, AI writing help, ATS score, and A4 PDF download — free on Jan Seva Kendra.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/resume-builder/register"
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold shadow-lg shadow-blue-500/30 hover:brightness-110"
              >
                Start Free — Create Resume
              </Link>
              <Link
                href="/resume-builder/login"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:bg-white/20"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: LayoutTemplate, title: '20+ Templates', desc: 'Modern, ATS, corporate, creative & more' },
            { icon: Sparkles, title: 'AI Assistant', desc: 'Summary, skills & ATS optimization' },
            { icon: Download, title: 'PDF Export', desc: 'Print-ready A4 high quality' },
            { icon: Zap, title: 'Auto Save', desc: 'Never lose your progress' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <Icon className="mb-3 h-8 w-8 text-blue-300" />
              <h3 className="font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-6 text-center text-2xl font-bold">Premium templates</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {RESUME_TEMPLATES.map((t) => (
              <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <div className={`mx-auto mb-2 h-12 w-full rounded-lg bg-gradient-to-r ${t.previewGradient}`} />
                <p className="text-xs font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-black/20 py-10 text-center text-sm text-slate-400">
          <Briefcase className="mx-auto mb-2 h-8 w-8 text-blue-400" />
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Your data is saved securely to your account
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
