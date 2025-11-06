import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

type Vacancy = {
  id: string;
  title: string;
  tag: string;
  info: string;
  date?: string;
  lastDate?: string;
  vacancies?: number;
  link?: string;
};

const STORAGE_KEY = 'janseva_vacancies';

function loadVacancies(): Vacancy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Vacancy[];
  } catch {
    return [];
  }
}

function saveVacancies(items: Vacancy[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function AdminVacancies({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [form, setForm] = useState({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });

  useEffect(() => {
    if (!open) return;
    setVacancies(loadVacancies());
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    // allow adding vacancies with any field optional
    const item: Vacancy = {
      id: String(Date.now()),
      title: form.title.trim(),
      tag: form.tag.trim(),
      info: form.info.trim(),
      date: form.date || undefined,
      lastDate: form.lastDate || undefined,
      vacancies: form.vacancies ? Number(form.vacancies) : undefined,
      link: form.link || undefined,
    };
    const next = [item, ...vacancies];
    setVacancies(next);
    saveVacancies(next);
  setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });
    // notify other parts of the app
    window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
  };

  const handleDelete = (id: string) => {
    const next = vacancies.filter((v) => v.id !== id);
    setVacancies(next);
    saveVacancies(next);
    // notify other parts of the app
    window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <h3 className="text-lg font-semibold">Admin: Manage Vacancies</h3>
              <p className="text-sm text-gray-600">Add or remove vacancy/result items shown on the site.</p>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title (eg. UPPSC Inspector 2025)" className="px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag (Result/Notification)" className="px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="vacancies" value={form.vacancies} onChange={handleChange} placeholder="Vacancy count (optional)" className="px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (eg. 02 Nov 2025)" className="px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
              </div>
              <input name="link" value={form.link} onChange={handleChange} placeholder="Link (optional)" className="px-3 py-2 border rounded w-full text-gray-900 placeholder-gray-500" />
              <textarea name="info" value={form.info} onChange={handleChange} placeholder="Short info" className="px-3 py-2 border rounded w-full h-20 text-gray-900 placeholder-gray-500" />

              <div className="flex items-center space-x-2">
                <button onClick={handleAdd} className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded">
                  <Plus className="w-4 h-4" />
                  <span>Add Vacancy</span>
                </button>
                <button onClick={() => { setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' }); }} className="px-3 py-2 border rounded">Clear</button>
              </div>
            </div>

            <div className="md:col-span-1">
              <h4 className="text-sm font-semibold mb-2">Existing items</h4>
              <div className="space-y-2 max-h-64 overflow-auto">
                {vacancies.length === 0 && <p className="text-sm text-gray-500">No vacancies added yet.</p>}
                {vacancies.map((v) => (
                  <div key={v.id} className="p-2 bg-gray-50 rounded border flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{v.title}</div>
                      <div className="text-xs text-gray-600">{v.tag} • {v.vacancies ?? '-'} • {v.date ?? '-'} • {v.lastDate ?? '-'}</div>
                      <div className="text-xs text-gray-600">{v.info}</div>
                    </div>
                    <div className="pl-2">
                      <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
