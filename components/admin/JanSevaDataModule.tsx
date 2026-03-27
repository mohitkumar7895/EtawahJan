'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Trash2, Edit2, ChevronLeft, ChevronRight, Zap, Building2, Banknote, Loader2 } from 'lucide-react';
import {
  getElectricityPage,
  createElectricity,
  updateElectricity,
  deleteElectricity,
  getEdistrictPage,
  createEdistrict,
  updateEdistrict,
  deleteEdistrict,
  getWithdrawalPage,
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
  type ElectricityRecord,
  type EdistrictRecord,
  type WithdrawalRecord,
} from '@/lib/janSevaApi';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

type Section = 'electricity' | 'edistrict' | 'withdrawal';

const PAGE_SIZE = 10;

const field =
  'w-full px-3 py-2.5 text-sm border border-zinc-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/[0.08] dark:focus:ring-zinc-100/15 focus:border-zinc-300 dark:focus:border-zinc-500';
const lbl =
  'block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5';
const card =
  'rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-black/20 overflow-hidden transition-colors duration-200';
const cardTitle =
  'flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-b from-zinc-50/90 to-white dark:from-zinc-800/80 dark:to-zinc-900 transition-colors duration-200';
const tableHead =
  'bg-zinc-50/95 dark:bg-zinc-800/90 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400';
const btnPrimary =
  'inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.99] transition shadow-sm';
const btnGhost =
  'inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200';
const iconBtn =
  'inline-flex items-center justify-center p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors';
const iconBtnDanger =
  'inline-flex items-center justify-center p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors';

function toDateInput(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function JanSevaDataModule() {
  const { resolvedTheme } = useAdminTheme();
  const [section, setSection] = useState<Section>('electricity');

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 min-h-[480px] transition-colors duration-200">
      <Toaster position="top-right" richColors={false} closeButton theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
      <aside className="w-full lg:w-52 shrink-0">
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-sm dark:shadow-black/20 space-y-0.5 transition-colors duration-200">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.14em]">
            Modules
          </p>
          <button
            type="button"
            onClick={() => setSection('electricity')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === 'electricity'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Zap className={`w-4 h-4 shrink-0 ${section === 'electricity' ? 'opacity-100' : 'opacity-70'}`} />
            Electricity
          </button>
          <button
            type="button"
            onClick={() => setSection('edistrict')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === 'edistrict'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Building2 className={`w-4 h-4 shrink-0 ${section === 'edistrict' ? 'opacity-100' : 'opacity-70'}`} />
            eDistrict
          </button>
          <button
            type="button"
            onClick={() => setSection('withdrawal')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === 'withdrawal'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Banknote className={`w-4 h-4 shrink-0 ${section === 'withdrawal' ? 'opacity-100' : 'opacity-70'}`} />
            Withdrawal
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {section === 'electricity' && <ElectricityPanel />}
        {section === 'edistrict' && <EdistrictPanel />}
        {section === 'withdrawal' && <WithdrawalPanel />}
      </div>
    </div>
  );
}

function ElectricityPanel() {
  const [rows, setRows] = useState<ElectricityRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: '',
    name: '',
    consumerId: '',
    password: '',
    amount: '',
    baki: '',
    address: '',
    contact: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getElectricityPage(page, PAGE_SIZE);
      setRows(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load electricity data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      date: '',
      name: '',
      consumerId: '',
      password: '',
      amount: '',
      baki: '',
      address: '',
      contact: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.name.trim() || !form.consumerId.trim()) {
      toast.error('Date, name, and consumer ID are required');
      return;
    }
    const payload = {
      date: new Date(form.date).toISOString(),
      name: form.name.trim(),
      consumerId: form.consumerId.trim(),
      password: form.password,
      amount: Number(form.amount) || 0,
      baki: Number(form.baki) || 0,
      address: form.address,
      contact: form.contact,
    };
    try {
      if (editingId) {
        await updateElectricity(editingId, payload);
        toast.success('Electricity record updated');
      } else {
        await createElectricity(payload);
        toast.success('Electricity record added');
      }
      resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const onEdit = (r: ElectricityRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    setEditingId(String(mongoId));
    setForm({
      date: toDateInput(r.date),
      name: r.name,
      consumerId: r.consumerId ?? '',
      password: r.password ?? '',
      amount: String(r.amount ?? ''),
      baki: String(r.baki ?? ''),
      address: r.address ?? '',
      contact: r.contact ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (r: ElectricityRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    if (!window.confirm('Delete this electricity record? This cannot be undone.')) return;
    try {
      await deleteElectricity(String(mongoId));
      toast.success('Record deleted');
      if (editingId === String(mongoId)) resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className={cardTitle}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Electricity</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Add or update consumer records</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={lbl}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Consumer ID</label>
            <input
              required
              value={form.consumerId}
              onChange={(e) => setForm({ ...form, consumerId: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Amount</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Baki</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.baki}
              onChange={(e) => setForm({ ...form, baki: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Contact</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`${field} resize-y min-h-[72px]`}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
            <button type="submit" className={btnPrimary}>
              {editingId ? 'Save changes' : 'Add record'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={btnGhost}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/40">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Registry</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Consumer ID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Baki</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium text-right w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-zinc-500">
                    No records yet. Use the form above to add one.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const key = r.id || r._id || '';
                return (
                  <tr key={key} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600 tabular-nums">{formatDisplayDate(r.date)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{r.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-zinc-600">{r.consumerId}</td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.baki ?? 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.contact || '—'}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className={`${iconBtn} mr-0.5`}
                        aria-label="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className={iconBtnDanger}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

function EdistrictPanel() {
  const [rows, setRows] = useState<EdistrictRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: '',
    subject: '',
    certificateNumber: '',
    name: '',
    mobile: '',
    address: '',
    amount: '',
    jama: '',
    baki: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEdistrictPage(page, PAGE_SIZE);
      setRows(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load eDistrict data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      date: '',
      subject: '',
      certificateNumber: '',
      name: '',
      mobile: '',
      address: '',
      amount: '',
      jama: '',
      baki: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.subject.trim() || !form.name.trim()) {
      toast.error('Date, subject, and name are required');
      return;
    }
    const payload = {
      date: new Date(form.date).toISOString(),
      subject: form.subject.trim(),
      certificateNumber: form.certificateNumber,
      name: form.name.trim(),
      mobile: form.mobile,
      address: form.address,
      amount: Number(form.amount) || 0,
      jama: Number(form.jama) || 0,
      baki: Number(form.baki) || 0,
    };
    try {
      if (editingId) {
        await updateEdistrict(editingId, payload);
        toast.success('eDistrict record updated');
      } else {
        await createEdistrict(payload);
        toast.success('eDistrict record added');
      }
      resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const onEdit = (r: EdistrictRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    setEditingId(String(mongoId));
    setForm({
      date: toDateInput(r.date),
      subject: r.subject,
      certificateNumber: r.certificateNumber ?? '',
      name: r.name,
      mobile: r.mobile ?? '',
      address: r.address ?? '',
      amount: String(r.amount ?? ''),
      jama: String(r.jama ?? ''),
      baki: String(r.baki ?? ''),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (r: EdistrictRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    if (!window.confirm('Delete this eDistrict record? This cannot be undone.')) return;
    try {
      await deleteEdistrict(String(mongoId));
      toast.success('Record deleted');
      if (editingId === String(mongoId)) resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className={cardTitle}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">eDistrict</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Certificate and payment fields</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={lbl}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Subject</label>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Certificate number</label>
            <input
              value={form.certificateNumber}
              onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Mobile</label>
            <input
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Amount</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Jama</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.jama}
              onChange={(e) => setForm({ ...form, jama: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Baki</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.baki}
              onChange={(e) => setForm({ ...form, baki: e.target.value })}
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`${field} resize-y min-h-[72px]`}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
            <button type="submit" className={btnPrimary}>
              {editingId ? 'Save changes' : 'Add record'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={btnGhost}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/40">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Registry</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Jama</th>
                <th className="px-4 py-3 font-medium">Baki</th>
                <th className="px-4 py-3 font-medium text-right w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-zinc-500">
                    No records yet. Use the form above to add one.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const key = r.id || r._id || '';
                return (
                  <tr key={key} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600 tabular-nums">{formatDisplayDate(r.date)}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-zinc-900 dark:text-zinc-100 font-medium" title={r.subject}>
                      {r.subject}
                    </td>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.jama || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.baki || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button type="button" onClick={() => onEdit(r)} className={`${iconBtn} mr-0.5`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => onDelete(r)} className={iconBtnDanger}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

function WithdrawalPanel() {
  const [rows, setRows] = useState<WithdrawalRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: '',
    aadharNumber: '',
    name: '',
    withdrawal: '',
    signature: '',
    mobileNumber: '',
    remains: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWithdrawalPage(page, PAGE_SIZE);
      setRows(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load withdrawal data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      date: '',
      aadharNumber: '',
      name: '',
      withdrawal: '',
      signature: '',
      mobileNumber: '',
      remains: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.aadharNumber.trim() || !form.name.trim()) {
      toast.error('Date, Aadhar, and name are required');
      return;
    }
    const payload = {
      date: new Date(form.date).toISOString(),
      aadharNumber: form.aadharNumber.trim(),
      name: form.name.trim(),
      withdrawal: form.withdrawal,
      remains: Number(form.remains) || 0,
      signature: form.signature,
      mobileNumber: form.mobileNumber,
    };
    try {
      if (editingId) {
        await updateWithdrawal(editingId, payload);
        toast.success('Withdrawal record updated');
      } else {
        await createWithdrawal(payload);
        toast.success('Withdrawal record added');
      }
      resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const onEdit = (r: WithdrawalRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    setEditingId(String(mongoId));
    setForm({
      date: toDateInput(r.date),
      aadharNumber: r.aadharNumber,
      name: r.name,
      withdrawal: r.withdrawal ?? '',
      remains: String(r.remains ?? ''),
      signature: r.signature ?? '',
      mobileNumber: r.mobileNumber ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (r: WithdrawalRecord) => {
    const mongoId = r.id || r._id;
    if (!mongoId) return;
    if (!window.confirm('Delete this withdrawal record? This cannot be undone.')) return;
    try {
      await deleteWithdrawal(String(mongoId));
      toast.success('Record deleted');
      if (editingId === String(mongoId)) resetForm();
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className={cardTitle}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Withdrawal</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Enter withdrawal details and balance remains manually</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={lbl}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Aadhar number</label>
            <input
              required
              value={form.aadharNumber}
              onChange={(e) => setForm({ ...form, aadharNumber: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Withdrawal</label>
            <input
              value={form.withdrawal}
              onChange={(e) => setForm({ ...form, withdrawal: e.target.value })}
              placeholder="Detail or note"
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Remains</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.remains}
              onChange={(e) => setForm({ ...form, remains: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className={lbl}>Mobile number</label>
            <input
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>Signature (reference / name)</label>
            <input
              value={form.signature}
              onChange={(e) => setForm({ ...form, signature: e.target.value })}
              className={field}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
            <button type="submit" className={btnPrimary}>
              {editingId ? 'Save changes' : 'Add record'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={btnGhost}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/40">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Registry</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Aadhar</th>
                <th className="px-4 py-3 font-medium">Withdrawal</th>
                <th className="px-4 py-3 font-medium">Remains</th>
                <th className="px-4 py-3 font-medium text-right w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-sm text-zinc-500">
                    No records yet. Use the form above to add one.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const key = r.id || r._id || '';
                return (
                  <tr key={key} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600 tabular-nums">{formatDisplayDate(r.date)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{r.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-zinc-600">{r.aadharNumber}</td>
                    <td className="px-4 py-3 max-w-[120px] truncate" title={r.withdrawal}>
                      {r.withdrawal || '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums">₹{Number(r.remains || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button type="button" onClick={() => onEdit(r)} className={`${iconBtn} mr-0.5`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => onDelete(r)} className={iconBtnDanger}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
      <p className="text-xs font-medium text-zinc-500 tabular-nums">
        Page <span className="text-zinc-900 dark:text-zinc-100">{page}</span>
        <span className="text-zinc-400 mx-1">/</span>
        {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
