'use client';

import { Search, Zap, Shield, Layers } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CONVERTER_TOOLS,
  POPULAR_TOOLS,
} from '@/lib/converter/tools';
import ToolsGrid from '@/components/converter/ToolsGrid';
import ConverterBrandLogo from '@/components/converter/ConverterBrandLogo';

export default function FileConverterHomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'pdf' | 'image' | 'utility'>('all');

  const filtered = useMemo(() => {
    let list = CONVERTER_TOOLS;
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.includes(q)
      );
    }
    return list;
  }, [query, category]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-transparent to-transparent dark:from-rose-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 text-center">
          <ConverterBrandLogo size="xl" centered linkHome className="mb-6 mx-auto animate-fade-in" />
          <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 px-4 py-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-4 animate-fade-in">
            Bharthana, Etawah · Free for everyone
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] animate-fade-in-up">
            Every file tool you need.
            <span className="block bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              One powerful workspace.
            </span>
          </h1>
          <p className="mt-5 text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto animate-fade-in">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Arpit Jan Seva Kendra</span>{' '}
            par PDF aur images — convert, merge, split, compress, watermark, protect. Batch jobs aur
            ZIP download — sab bilkul free.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools… PDF to JPG, Merge PDF…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {[
              { icon: Zap, title: 'Fast engine', desc: 'Worker queues & parallel processing' },
              { icon: Shield, title: 'Secure', desc: 'Auto cleanup · validated uploads' },
              { icon: Layers, title: 'Batch ready', desc: 'Multi-file & ZIP downloads' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:bg-slate-900/80 dark:border-slate-800"
              >
                <Icon className="w-6 h-6 text-rose-500 mb-2" />
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <h2 className="text-xl font-extrabold mb-4">Popular tools</h2>
        <ToolsGrid tools={POPULAR_TOOLS} compact />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pdf', 'image', 'utility'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${
                category === cat
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {cat === 'all' ? 'All tools' : cat}
            </button>
          ))}
        </div>
        <ToolsGrid tools={filtered} />
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No tools match your search.</p>
        )}
      </section>
    </>
  );
}
