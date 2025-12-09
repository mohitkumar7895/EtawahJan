'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { getVacancies, createVacancy, updateVacancy, deleteVacancy, type Vacancy, getAdmins, createAdmin, deleteAdmin, type Admin, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, type Announcement } from '@/lib/api';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'adminmohit1234';

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [form, setForm] = useState({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', description: '', isActive: true });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'vacancies' | 'admins' | 'announcements'>('vacancies');

  useEffect(() => {
    if (isAuthed) {
      loadVacanciesFromAPI();
      loadAdminsFromAPI();
      loadAnnouncementsFromAPI();
    }
  }, [isAuthed]);

  const loadVacanciesFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVacancies();
      setVacancies(data);
      window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
    } catch (err) {
      setError('Failed to load vacancies. Please try again.');
      console.error('Error loading vacancies:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAdd = async () => {
    if (!form.title.trim() || !form.tag.trim()) {
      alert('Title and Tag are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const vacancyData = {
        title: form.title.trim(),
        tag: form.tag.trim(),
        info: form.info.trim() || undefined,
        date: form.date || undefined,
        lastDate: form.lastDate || undefined,
        vacancies: form.vacancies ? Number(form.vacancies) : undefined,
        link: form.link || undefined,
      };

      if (editingId) {
        await updateVacancy(editingId, vacancyData);
      } else {
        await createVacancy(vacancyData);
      }

      await loadVacanciesFromAPI();
      setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' });
      setEditingId(null);
      
      window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
    } catch (err: any) {
      const errorMsg = err?.message || (editingId ? 'Failed to update vacancy' : 'Failed to create vacancy');
      
      if (errorMsg.includes('Database') || errorMsg.includes('MongoDB') || errorMsg.includes('connection')) {
        setError(`Database Error: ${errorMsg}. Please check MONGODB_URI in your .env file.`);
      } else {
        setError(errorMsg);
      }
      console.error('Error saving vacancy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const v = vacancies.find((x) => (x.id || x._id) === id);
    if (!v) return;
    setEditingId(id);
    setForm({ title: v.title || '', tag: v.tag || '', info: v.info || '', date: v.date || '', lastDate: v.lastDate || '', vacancies: v.vacancies ? String(v.vacancies) : '', link: v.link || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteVacancy(id);
      await loadVacanciesFromAPI();
      
      window.dispatchEvent(new CustomEvent('janseva:vacancies:updated'));
    } catch (err) {
      setError('Failed to delete vacancy');
      console.error('Error deleting vacancy:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminsFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      setError('Failed to load admins. Please try again.');
      console.error('Error loading admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!adminForm.username.trim() || !adminForm.password.trim()) {
      alert('Username and Password are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createAdmin({
        username: adminForm.username.trim(),
        password: adminForm.password.trim(),
      });

      await loadAdminsFromAPI();
      setAdminForm({ username: '', password: '' });
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to create admin';
      setError(errorMsg);
      console.error('Error creating admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteAdmin(id);
      await loadAdminsFromAPI();
    } catch (err) {
      setError('Failed to delete admin');
      console.error('Error deleting admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Announcements handlers
  const loadAnnouncementsFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to load announcements. Please try again.');
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setAnnouncementForm({
      ...announcementForm,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAddAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.description.trim()) {
      alert('Title and Description are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const announcementData = {
        title: announcementForm.title.trim(),
        description: announcementForm.description.trim(),
        isActive: announcementForm.isActive,
      };

      if (editingAnnouncementId) {
        await updateAnnouncement(editingAnnouncementId, announcementData);
      } else {
        await createAnnouncement(announcementData);
      }

      await loadAnnouncementsFromAPI();
      setAnnouncementForm({ title: '', description: '', isActive: true });
      setEditingAnnouncementId(null);
      
      // Dispatch event to refresh home page announcements
      window.dispatchEvent(new CustomEvent('janseva:announcements:updated'));
    } catch (err: any) {
      const errorMsg = err?.message || (editingAnnouncementId ? 'Failed to update announcement' : 'Failed to create announcement');
      setError(errorMsg);
      console.error('Error saving announcement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnouncement = (id: string) => {
    const a = announcements.find((x) => (x.id || x._id) === id);
    if (!a) return;
    setEditingAnnouncementId(id);
    setAnnouncementForm({ 
      title: a.title || '', 
      description: a.description || '', 
      isActive: a.isActive !== undefined ? a.isActive : true 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteAnnouncement(id);
      await loadAnnouncementsFromAPI();
      
      // Dispatch event to refresh home page announcements
      window.dispatchEvent(new CustomEvent('janseva:announcements:updated'));
    } catch (err) {
      setError('Failed to delete announcement');
      console.error('Error deleting announcement:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold">Admin Panel</h1>
          {isAuthed ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button onClick={handleLogout} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white rounded text-sm sm:text-base">Logout</button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {!isAuthed ? (
          <div className="max-w-md mx-auto bg-white rounded shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Admin Login</h2>
            <div className="space-y-3">
              <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
              <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
              <div className="flex items-center justify-end">
                <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base">Login</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs Navigation */}
            <div className="mb-4 sm:mb-6 border-b border-gray-200">
              <nav className="flex space-x-4 sm:space-x-8">
                <button
                  onClick={() => setActiveTab('vacancies')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                    activeTab === 'vacancies'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vacancies
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                    activeTab === 'announcements'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                    activeTab === 'admins'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admins
                </button>
              </nav>
            </div>

            {/* Vacancies Tab */}
            {activeTab === 'vacancies' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded shadow p-3 sm:p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Add / Edit Vacancy</h3>
                <div className="space-y-2">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
                  <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag (Result/Notification)" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
                  <div className="grid grid-cols-2 gap-2">
                    <input name="vacancies" value={form.vacancies} onChange={handleChange} placeholder="Vacancies" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
                  </div>
                  <input name="link" value={form.link} onChange={handleChange} placeholder="Link (optional)" className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" />
                  <textarea name="info" value={form.info} onChange={handleChange} placeholder="Short info" rows={3} className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500 resize-none" />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      onClick={handleAdd} 
                      disabled={loading}
                      className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50 text-sm sm:text-base"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>{editingId ? 'Update' : 'Add'}</span>
                    </button>

                    {editingId && (
                      <button 
                        onClick={() => { 
                          setEditingId(null); 
                          setForm({ title: '', tag: '', info: '', date: '', lastDate: '', vacancies: '', link: '' }); 
                        }} 
                        disabled={loading}
                        className="px-3 py-2 border rounded disabled:opacity-50 text-sm sm:text-base"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded shadow p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm sm:text-base">Existing Vacancies</h3>
                  {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </div>
                {error && (
                  <div className="mb-3 p-2 bg-red-100 text-red-700 text-xs sm:text-sm rounded">
                    {error}
                  </div>
                )}
                {loading && vacancies.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading vacancies...</p>
                ) : vacancies.length === 0 ? (
                  <p className="text-sm text-gray-500">No vacancies yet.</p>
                ) : (
                  <div className="space-y-3">
                    {vacancies.map((v) => (
                      <div key={v.id || v._id} className="p-3 border rounded flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base mb-1">{v.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">{v.tag} • {v.vacancies ?? '-'} • {v.date ?? '-'}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{v.info}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          <div className="flex space-x-2 w-full sm:w-auto">
                            <button 
                              onClick={() => handleEdit(v.id || v._id || '')} 
                              disabled={loading}
                              className="flex-1 sm:flex-none px-2 py-1 border rounded text-xs sm:text-sm inline-flex items-center justify-center disabled:opacity-50"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(v.id || v._id || '')} 
                              disabled={loading}
                              className="flex-1 sm:flex-none px-2 py-1 bg-red-600 text-white rounded text-xs sm:text-sm inline-flex items-center justify-center disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Delete
                            </button>
                          </div>
                          {v.link && (
                            <a href={v.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 break-all sm:break-normal">Open link</a>
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

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded shadow p-3 sm:p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Add / Edit Announcement</h3>
                  <div className="space-y-2">
                    <input 
                      name="title" 
                      value={announcementForm.title} 
                      onChange={handleAnnouncementChange} 
                      placeholder="Title *" 
                      className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" 
                    />
                    <textarea 
                      name="description" 
                      value={announcementForm.description} 
                      onChange={handleAnnouncementChange} 
                      placeholder="Description *" 
                      rows={4} 
                      className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500 resize-none" 
                    />
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={announcementForm.isActive}
                        onChange={handleAnnouncementChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm sm:text-base text-gray-700">Active (visible on home page)</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <button 
                        onClick={handleAddAnnouncement} 
                        disabled={loading}
                        className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50 text-sm sm:text-base"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>{editingAnnouncementId ? 'Update' : 'Add'}</span>
                      </button>

                      {editingAnnouncementId && (
                        <button 
                          onClick={() => { 
                            setEditingAnnouncementId(null); 
                            setAnnouncementForm({ title: '', description: '', isActive: true }); 
                          }} 
                          disabled={loading}
                          className="px-3 py-2 border rounded disabled:opacity-50 text-sm sm:text-base"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded shadow p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm sm:text-base">Existing Announcements</h3>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  </div>
                  {error && (
                    <div className="mb-3 p-2 bg-red-100 text-red-700 text-xs sm:text-sm rounded">
                      {error}
                    </div>
                  )}
                  {loading && announcements.length === 0 ? (
                    <p className="text-sm text-gray-500">Loading announcements...</p>
                  ) : announcements.length === 0 ? (
                    <p className="text-sm text-gray-500">No announcements yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {announcements.map((a) => (
                        <div key={a.id || a._id} className="p-3 border rounded flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-sm sm:text-base">{a.title}</div>
                              {a.isActive ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Active</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">Inactive</span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mb-1">{a.description}</div>
                            <div className="text-xs text-gray-500">
                              Created: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>

                          <div className="flex space-x-2 w-full sm:w-auto">
                            <button 
                              onClick={() => handleEditAnnouncement(a.id || a._id || '')} 
                              disabled={loading}
                              className="flex-1 sm:flex-none px-2 py-1 border rounded text-xs sm:text-sm inline-flex items-center justify-center disabled:opacity-50"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteAnnouncement(a.id || a._id || '')} 
                              disabled={loading}
                              className="flex-1 sm:flex-none px-2 py-1 bg-red-600 text-white rounded text-xs sm:text-sm inline-flex items-center justify-center disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded shadow p-3 sm:p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Add Admin</h3>
                  <div className="space-y-2">
                    <input 
                      value={adminForm.username} 
                      onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} 
                      placeholder="Username *" 
                      className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" 
                    />
                    <input 
                      value={adminForm.password} 
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                      placeholder="Password *" 
                      type="password" 
                      className="w-full px-3 py-2 border rounded text-sm sm:text-base text-gray-900 placeholder-gray-500" 
                    />
                    <button 
                      onClick={handleAddAdmin} 
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50 text-sm sm:text-base"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Add Admin</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded shadow p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm sm:text-base">Existing Admins</h3>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  </div>
                  {error && (
                    <div className="mb-3 p-2 bg-red-100 text-red-700 text-xs sm:text-sm rounded">
                      {error}
                    </div>
                  )}
                  {loading && admins.length === 0 ? (
                    <p className="text-sm text-gray-500">Loading admins...</p>
                  ) : admins.length === 0 ? (
                    <p className="text-sm text-gray-500">No admins yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {admins.map((a) => (
                        <div key={a.id || a._id} className="p-3 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-sm sm:text-base">{a.username}</div>
                            <div className="text-xs text-gray-500">
                              Created: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAdmin(a.id || a._id || '')} 
                            disabled={loading}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs sm:text-sm inline-flex items-center justify-center disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}



