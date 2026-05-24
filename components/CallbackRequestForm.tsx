'use client';

import { useState } from 'react';
import { Phone, User, Loader2, CheckCircle } from 'lucide-react';
import { CALLBACK_PHONES } from '@/lib/jobDisplay';

interface Props {
  jobTitle?: string;
  jobSlug?: string;
  category?: string;
  source?: string;
  compact?: boolean;
}

export default function CallbackRequestForm({
  jobTitle = '',
  jobSlug = '',
  category = '',
  source = 'website',
  compact = false,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, jobTitle, jobSlug, category, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setDone(true);
      setName('');
      setPhone('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error — dubara try karein');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={`flex items-center gap-2 text-emerald-700 ${compact ? 'text-xs p-2' : 'p-4 bg-emerald-50 rounded-xl'}`}>
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span className="font-semibold text-sm">Request mil gayi — hum call karenge!</span>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'p-5 rounded-2xl bg-blue-50 border border-blue-100'}>
      {!compact && (
        <>
          <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            जानकारी के लिए Callback
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Form भरें — hum aapko call karenge. Direct: {CALLBACK_PHONES}
          </p>
        </>
      )}

      <form onSubmit={submit} className={`space-y-2 ${compact ? '' : 'mt-2'}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="आपका नाम"
              className="w-full pl-8 pr-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="relative flex-1">
            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile"
              className="w-full pl-8 pr-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        {error && <p className="text-[10px] text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
          Callback मांगें
        </button>
      </form>
    </div>
  );
}
