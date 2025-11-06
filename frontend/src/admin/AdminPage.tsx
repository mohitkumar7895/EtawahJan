import { useEffect, useState } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';

type Vacancy = {
  id: string;
  title: string;
  tag: string;
  info?: string;
  date?: string;
  lastDate?: string;
  vacancies?: number;
  link?: string;
};

const STORAGE_KEY = 'janseva_vacancies';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

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

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  // initialize vacancies from storage to avoid overwriting stored items on mount
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => loadVacancies());
  const [form, setForm] = useState({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  // vacancies are initialized lazily above; no need to load on mount which could
  // cause a save-effect race that overwrites existing stored vacancies.

  useEffect(() => {
    // update localStorage when vacancies change
    saveVacancies(vacancies);
    // notify other parts of the app
    window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
  }, [vacancies]);

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setIsAuthed(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    setUser('');
    setPass('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    // allow adding vacancies with any fields optional
      const item: Vacancy = {
      id: editingId ?? String(Date.now()),
      title: form.title.trim(),
      tag: form.tag.trim(),
      info: form.info.trim(),
      date: form.date || undefined,
      lastDate: form.lastDate || undefined,
      vacancies: form.vacancies ? Number(form.vacancies) : undefined,
      link: form.link || undefined,
    };

    if (editingId) {
      setVacancies((s) => s.map((v) => (v.id === editingId ? item : v)));
      setEditingId(null);
    } else {
      setVacancies((s) => [item, ...s]);
    }

    setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });
  };

  const handleEdit = (id: string) => {
    const v = vacancies.find((x) => x.id === id);
    if (!v) return;
    setEditingId(id);
    setForm({ title: v.title || '', tag: v.tag || '', info: v.info || '', date: v.date || '', lastDate: v.lastDate || '', vacancies: v.vacancies ? String(v.vacancies) : '', link: v.link || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setVacancies((s) => s.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel — Vacancies</h1>
          {isAuthed ? (
            <div className="flex items-center space-x-3">
              <button onClick={handleLogout} className="px-3 py-2 bg-red-600 text-white rounded">Logout</button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isAuthed ? (
          <div className="max-w-md mx-auto bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
            <div className="space-y-3">
              <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
              <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
              <div className="flex items-center justify-end">
                <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-2">Add / Edit Vacancy</h3>
                <div className="space-y-2">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                  <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag (Result/Notification)" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                  <div className="grid grid-cols-2 gap-2">
                    <input name="vacancies" value={form.vacancies} onChange={handleChange} placeholder="Vacancies" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                  </div>
                  <input name="link" value={form.link} onChange={handleChange} placeholder="Link (optional)" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                  <textarea name="info" value={form.info} onChange={handleChange} placeholder="Short info" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />

                  <div className="flex items-center space-x-2">
                    <button onClick={handleAdd} className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded">
                      <Plus className="w-4 h-4" />
                      <span>{editingId ? 'Update' : 'Add'}</span>
                    </button>

                    {editingId && (
                      <button onClick={() => { setEditingId(null); setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' }); }} className="px-3 py-2 border rounded">Cancel Edit</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-3">Existing Vacancies</h3>
                {vacancies.length === 0 ? (
                  <p className="text-sm text-gray-500">No vacancies yet.</p>
                ) : (
                  <div className="space-y-3">
                    {vacancies.map((v) => (
                      <div key={v.id} className="p-3 border rounded flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{v.title}</div>
                          <div className="text-sm text-gray-600">{v.tag} • {v.vacancies ?? '-'} • {v.date ?? '-'}</div>
                          <div className="text-sm text-gray-600">{v.info}</div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(v.id)} className="px-2 py-1 border rounded text-sm inline-flex items-center"><Edit className="w-4 h-4 mr-1"/> Edit</button>
                            <button onClick={() => handleDelete(v.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm inline-flex items-center"><Trash2 className="w-4 h-4 mr-1"/> Delete</button>
                          </div>
                          {v.link && (
                            <a href={v.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open link</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
