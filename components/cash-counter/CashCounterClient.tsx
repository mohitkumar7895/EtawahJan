'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Copy,
  Eraser,
  Eye,
  EyeOff,
  FileDown,
  Loader2,
  Minus,
  Plus,
  Share2,
  Sparkles,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import {
  formatIndianRupees,
  toIndianWordsEn,
  toIndianWordsHi,
} from './numberToWords';
import { generateCashCountPdf } from './generatePdf';

// ────────────────────────────────────────────────────────────────────────────
// Denominations — NOTES ONLY (no coins)
// ────────────────────────────────────────────────────────────────────────────

interface Denomination {
  value: number;
  label: string;            // e.g. "₹500"
  short: string;            // e.g. "500"
  // Tailwind classes mapped to the actual RBI note colour palette.
  // Each "theme" controls the card background gradient, text color, and the
  // big denomination chip on the left side of the card.
  bg: string;
  ring: string;
  chip: string;
  text: string;
  hint?: string;
}

const NOTES: Denomination[] = [
  {
    value: 500,
    label: '₹500',
    short: '500',
    bg: 'from-stone-100 to-stone-50',
    ring: 'ring-stone-300',
    chip: 'bg-stone-600 text-white',
    text: 'text-stone-700',
  },
  {
    value: 200,
    label: '₹200',
    short: '200',
    bg: 'from-yellow-100 to-amber-50',
    ring: 'ring-yellow-300',
    chip: 'bg-yellow-500 text-white',
    text: 'text-yellow-800',
  },
  {
    value: 100,
    label: '₹100',
    short: '100',
    bg: 'from-violet-100 to-purple-50',
    ring: 'ring-violet-300',
    chip: 'bg-violet-500 text-white',
    text: 'text-violet-800',
  },
  {
    value: 50,
    label: '₹50',
    short: '50',
    bg: 'from-cyan-100 to-sky-50',
    ring: 'ring-cyan-300',
    chip: 'bg-cyan-500 text-white',
    text: 'text-cyan-800',
  },
  {
    value: 20,
    label: '₹20',
    short: '20',
    bg: 'from-lime-100 to-green-50',
    ring: 'ring-lime-300',
    chip: 'bg-lime-600 text-white',
    text: 'text-lime-800',
  },
  {
    value: 10,
    label: '₹10',
    short: '10',
    bg: 'from-amber-100 to-orange-50',
    ring: 'ring-amber-300',
    chip: 'bg-amber-700 text-white',
    text: 'text-amber-800',
  },
  {
    value: 2000,
    label: '₹2000',
    short: '2000',
    bg: 'from-fuchsia-100 to-pink-50',
    ring: 'ring-fuchsia-300',
    chip: 'bg-fuchsia-600 text-white',
    text: 'text-fuchsia-800',
    hint: 'RBI ne wapas le liya — bank mein deposit kar dein',
  },
];

const STORAGE_KEY = 'jansevakendra-cash-counter-v2';
const SHOW_TOTAL_KEY = 'jansevakendra-cash-counter-show-total-v2';

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function CashCounterClient() {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [showTotal, setShowTotal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  // Restore on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setCounts(parsed);
      }
      const showRaw = localStorage.getItem(SHOW_TOTAL_KEY);
      if (showRaw === '1') setShowTotal(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch {
      /* ignore */
    }
  }, [counts]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOW_TOTAL_KEY, showTotal ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [showTotal]);

  const setCount = (value: number, next: number) => {
    setCounts((prev) => {
      const safe = Math.max(0, Math.min(999_999, Math.floor(next || 0)));
      if (safe === 0) {
        const { [value]: _omit, ...rest } = prev;
        void _omit;
        return rest;
      }
      return { ...prev, [value]: safe };
    });
  };

  const inc = (value: number) => setCount(value, (counts[value] || 0) + 1);
  const dec = (value: number) => setCount(value, (counts[value] || 0) - 1);

  const resetAll = () => {
    if (Object.keys(counts).length === 0) return;
    if (confirm('Sab values clear kar dein?')) setCounts({});
  };

  // ─── Totals
  const rows = useMemo(
    () =>
      NOTES.map((d) => {
        const qty = counts[d.value] || 0;
        return { ...d, qty, subtotal: qty * d.value };
      }),
    [counts]
  );

  const total = useMemo(
    () => rows.reduce((s, r) => s + r.subtotal, 0),
    [rows]
  );
  const totalPieces = useMemo(
    () => rows.reduce((s, r) => s + r.qty, 0),
    [rows]
  );
  const filledRows = rows.filter((r) => r.qty > 0).length;
  const hasAny = total > 0;

  // ─── Sharing
  const buildText = () => {
    const lines: string[] = [];
    lines.push('💰 Cash Count — Jan Seva Kendra');
    lines.push('────────────────────────────');
    for (const r of rows) {
      if (!r.qty) continue;
      lines.push(
        `${r.label.padEnd(8, ' ')} × ${String(r.qty).padStart(4, ' ')}  =  ₹${formatIndianRupees(r.subtotal)}`
      );
    }
    lines.push('────────────────────────────');
    lines.push(`Total Notes : ${totalPieces}`);
    lines.push(`Total Amount: ₹${formatIndianRupees(total)}`);
    lines.push(`In words    : ${toIndianWordsEn(total)} Rupees Only`);
    lines.push(`Shabdon mein: ${toIndianWordsHi(total)} Rupaye`);
    lines.push('');
    lines.push('Counted on jan-seva.site/cash-counter');
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert(buildText());
    }
  };

  const handleShare = async () => {
    const text = buildText();
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: 'Cash Count', text });
        return;
      } catch {
        /* fall through */
      }
    }
    handleCopy();
  };

  const handleDownloadPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const bytes = await generateCashCountPdf({
        rows: rows.map(({ value, label, qty, subtotal }) => ({
          value,
          label,
          qty,
          subtotal,
        })),
        total,
        totalPieces,
      });
      // pdf-lib returns Uint8Array; wrap in a fresh ArrayBuffer-backed
      // Uint8Array slice so the Blob constructor type-checks cleanly.
      const blob = new Blob([bytes.slice().buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const stamp = new Date()
        .toISOString()
        .replace(/[:T]/g, '-')
        .slice(0, 16);
      const filename = `cash-count-${stamp}.pdf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Give the browser a moment to start the download before revoking.
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(
        'PDF banane mein dikkat aayi. Page reload karke dobara try karein, ya Copy button se text copy kar lein.'
      );
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ─── Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white px-4 py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_50%)]" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-emerald-100 hover:text-white text-sm font-semibold mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>

          <div className="flex justify-center mb-3">
            <Image
              src="/jan-seva-logo-1.png"
              alt="Arpit Jan Seva Kendra"
              width={64}
              height={64}
              priority
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-lg"
            />
          </div>

          <div className="text-center space-y-3">
            <span className="bg-emerald-500/30 text-emerald-50 border border-emerald-300/40 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Free · Private · No Login
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Cash &amp; Note Counter
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto">
              ₹500, ₹200, ₹100, ₹50… har note ki ginti daalo. Total chhipa rahega
              jab tak tum khud na dekhna chaaho — perfect for shopkeepers, CSC
              operators aur bank ke liye.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Main */}
      <section className="px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Status strip */}
          <div className="bg-white rounded-2xl border border-slate-200 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                  Currency Notes
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {filledRows > 0
                    ? `${filledRows} denominations · ${totalPieces} notes counted`
                    : 'Niche denomination ke saamne ginti daalo'}
                </p>
              </div>
            </div>
            {hasAny && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl px-3 py-1.5 transition active:scale-95"
              >
                <Eraser className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Note grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {rows.map((r) => (
              <NoteCard
                key={r.value}
                row={r}
                onChange={(n) => setCount(r.value, n)}
                onInc={() => inc(r.value)}
                onDec={() => dec(r.value)}
              />
            ))}
          </div>

          {/* Show-total toggle */}
          <ShowTotalToggle value={showTotal} onChange={setShowTotal} />

          {/* Total card / hidden state */}
          {showTotal ? (
            <TotalCard
              hasAny={hasAny}
              total={total}
              totalPieces={totalPieces}
              lang={lang}
              setLang={setLang}
              copied={copied}
              pdfBusy={pdfBusy}
              onCopy={handleCopy}
              onShare={handleShare}
              onDownloadPdf={handleDownloadPdf}
              onReset={resetAll}
            />
          ) : (
            <HiddenTotalCard
              filledRows={filledRows}
              totalPieces={totalPieces}
              onShow={() => setShowTotal(true)}
            />
          )}

          {/* Detailed breakdown — only when total is visible AND there is any */}
          {showTotal && hasAny && <BreakdownTable rows={rows} totalPieces={totalPieces} total={total} />}

          {/* Help */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h2 className="font-extrabold text-slate-800 mb-3">Kaise use karein?</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600">
              <li>Har note ke saamne kitne note hain wo number daalo.</li>
              <li>+/− buttons se ek-ek count add/remove kar sakte ho.</li>
              <li>
                <strong>“Total dekhna hai?”</strong> checkbox on karoge tabhi grand
                total dikhega — privacy ke liye safe.
              </li>
              <li>
                <strong>“Download PDF Receipt”</strong> click karke proper A4 receipt
                download kar sakte ho — WhatsApp/email pe share karne layak.
              </li>
              <li>Page refresh karo phir bhi tumhari ginti save rahegi (auto-save).</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

interface NoteRow extends Denomination {
  qty: number;
  subtotal: number;
}

function NoteCard({
  row,
  onChange,
  onInc,
  onDec,
}: {
  row: NoteRow;
  onChange: (n: number) => void;
  onInc: () => void;
  onDec: () => void;
}) {
  const active = row.qty > 0;
  return (
    <div
      className={`relative bg-gradient-to-br ${row.bg} rounded-2xl border-2 transition shadow-sm hover:shadow-md ${
        active
          ? 'border-emerald-400 ring-2 ring-emerald-200'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-stretch gap-4">
        {/* Big denomination chip — looks like a mini banknote */}
        <div
          className={`shrink-0 ${row.chip} rounded-xl px-3 sm:px-4 py-3 flex flex-col items-center justify-center min-w-[88px] sm:min-w-[104px] shadow-inner relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
            ₹
          </span>
          <span className="text-2xl sm:text-3xl font-black leading-none tabular-nums">
            {row.short}
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-80 mt-0.5">
            Note
          </span>
        </div>

        {/* Right side: counter + subtotal */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={`text-xs font-bold ${row.text}`}>{row.label} ke note</p>
              {row.hint && (
                <p className="text-[10px] text-amber-700 leading-tight mt-0.5">
                  {row.hint}
                </p>
              )}
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                active
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white/60 text-slate-500 border-slate-200'
              }`}
            >
              {active ? `× ${row.qty}` : '× 0'}
            </span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDec}
              disabled={!row.qty}
              aria-label={`Decrease ${row.label}`}
              className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 flex items-center justify-center text-slate-700 transition shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={999999}
              value={row.qty || ''}
              placeholder="0"
              onChange={(e) => onChange(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              aria-label={`Number of ${row.label} notes`}
              className="flex-1 h-10 rounded-xl border-2 border-white/80 bg-white/90 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 px-3 text-center font-extrabold text-base tabular-nums outline-none transition shadow-sm"
            />

            <button
              type="button"
              onClick={onInc}
              aria-label={`Increase ${row.label}`}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowTotalToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`relative flex items-center justify-between gap-4 cursor-pointer rounded-2xl border-2 p-4 sm:p-5 shadow-sm transition ${
        value
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`p-2.5 rounded-xl border ${
            value
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {value ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
            Total dekhna hai?
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Privacy ke liye total tab tak chhipa rahega jab tak tum yahan
            check na karo.
          </p>
        </div>
      </div>

      {/* Switch */}
      <div className="shrink-0 flex items-center gap-2">
        <span
          className={`text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline ${
            value ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          {value ? 'On' : 'Off'}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
            value ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Hidden actual checkbox for forms / a11y */}
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        tabIndex={-1}
      />
    </label>
  );
}

function HiddenTotalCard({
  filledRows,
  totalPieces,
  onShow,
}: {
  filledRows: number;
  totalPieces: number;
  onShow: () => void;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 sm:py-10 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mb-4">
        <EyeOff className="w-7 h-7" />
      </div>
      <h2 className="font-extrabold text-slate-800 text-lg sm:text-xl">
        Total chhipa hua hai
      </h2>
      <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
        {filledRows > 0
          ? `${filledRows} denominations · ${totalPieces} notes counted. Total dekhne ke liye toggle on karo.`
          : 'Pehle upar denominations mein ginti daalo, fir “Total dekhna hai?” on karo.'}
      </p>
      <button
        onClick={onShow}
        disabled={filledRows === 0}
        className="mt-5 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm transition active:scale-95"
      >
        <Eye className="w-4 h-4" /> Total dekhao
      </button>
    </div>
  );
}

function TotalCard({
  hasAny,
  total,
  totalPieces,
  lang,
  setLang,
  copied,
  pdfBusy,
  onCopy,
  onShare,
  onDownloadPdf,
  onReset,
}: {
  hasAny: boolean;
  total: number;
  totalPieces: number;
  lang: 'en' | 'hi';
  setLang: (l: 'en' | 'hi') => void;
  copied: boolean;
  pdfBusy: boolean;
  onCopy: () => void;
  onShare: () => void;
  onDownloadPdf: () => void;
  onReset: () => void;
}) {
  return (
    <div
      id="cash-counter-total"
      className={`relative overflow-hidden rounded-3xl border-2 shadow-xl transition-colors ${
        hasAny
          ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      {hasAny && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
      )}
      <div className="relative p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                hasAny
                  ? 'bg-white/15 border border-white/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  hasAny ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                Grand Total · Kul Rakam
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  hasAny ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {totalPieces} notes counted
              </p>
            </div>
          </div>

          {/* Lang toggle */}
          <div
            className={`inline-flex rounded-full text-[11px] font-bold p-1 ${
              hasAny
                ? 'bg-white/15 border border-white/25'
                : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {(['hi', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-full transition ${
                  lang === l
                    ? hasAny
                      ? 'bg-white text-emerald-800'
                      : 'bg-white shadow text-slate-900'
                    : hasAny
                    ? 'text-emerald-50'
                    : 'text-slate-500'
                }`}
              >
                {l === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p
            className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${
              hasAny ? '' : 'text-slate-300'
            }`}
          >
            ₹{formatIndianRupees(total)}
          </p>
          <p
            className={`mt-3 text-sm sm:text-base font-medium leading-relaxed ${
              hasAny ? 'text-emerald-50' : 'text-slate-400'
            }`}
          >
            {hasAny ? (
              lang === 'hi' ? (
                <>
                  <span className="opacity-80">शब्दों में:</span>{' '}
                  <span className="font-bold">
                    {toIndianWordsHi(total)} Rupaye Maatra
                  </span>
                </>
              ) : (
                <>
                  <span className="opacity-80">In words:</span>{' '}
                  <span className="font-bold">
                    {toIndianWordsEn(total)} Rupees Only
                  </span>
                </>
              )
            ) : (
              'Abhi tak koi note count nahi hua.'
            )}
          </p>
        </div>

        {/* Primary action: Download PDF (big, prominent) */}
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={pdfBusy || !hasAny}
          className={`mt-1 w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-md transition active:scale-[0.99] ${
            hasAny
              ? 'bg-white text-emerald-700 hover:bg-emerald-50'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          } disabled:opacity-70 disabled:cursor-wait`}
        >
          {pdfBusy ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              PDF banaya ja raha hai…
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              Download PDF Receipt
            </>
          )}
        </button>

        {/* Secondary actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <ActionButton onClick={onCopy} dark={hasAny}>
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy text
              </>
            )}
          </ActionButton>
          <ActionButton onClick={onShare} dark={hasAny}>
            <Share2 className="w-4 h-4" /> Share
          </ActionButton>
          <ActionButton onClick={onReset} dark={hasAny} danger>
            <Eraser className="w-4 h-4" /> Reset
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function BreakdownTable({
  rows,
  totalPieces,
  total,
}: {
  rows: NoteRow[];
  totalPieces: number;
  total: number;
}) {
  return (
    <div
      id="cash-counter-breakdown"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-extrabold text-slate-800">Detailed Breakdown</h2>
        <span className="text-xs text-slate-500">
          {new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-5 py-3 font-bold">Denomination</th>
              <th className="px-5 py-3 font-bold text-right">Notes</th>
              <th className="px-5 py-3 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((r) => r.qty > 0)
              .map((r) => (
                <tr key={r.value} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-semibold text-slate-700 flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-sm ${r.chip.split(' ')[0]}`}
                    />
                    {r.label}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.qty}</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums">
                    ₹{formatIndianRupees(r.subtotal)}
                  </td>
                </tr>
              ))}
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="px-5 py-3 font-extrabold text-slate-900">Total</td>
              <td className="px-5 py-3 text-right font-extrabold tabular-nums">
                {totalPieces}
              </td>
              <td className="px-5 py-3 text-right font-extrabold tabular-nums text-emerald-700">
                ₹{formatIndianRupees(total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  dark,
  danger,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  dark?: boolean;
  danger?: boolean;
  ariaLabel?: string;
}) {
  const base =
    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95';
  const cls = danger
    ? dark
      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-50 border border-red-300/40'
      : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
    : dark
    ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200';
  return (
    <button onClick={onClick} aria-label={ariaLabel} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}

