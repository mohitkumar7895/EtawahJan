'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, Loader2, MessageCircle, Send, Image, Video, Phone, Clock, User, Search, Paperclip, Download, X } from 'lucide-react';
import { getVacancies, createVacancy, updateVacancy, deleteVacancy, type Vacancy, getAdmins, createAdmin, deleteAdmin, type Admin, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, type Announcement, getAllChats, getChat, sendMessage, uploadChatFile, deleteChat, type Chat } from '@/lib/api';

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
  
  const [activeTab, setActiveTab] = useState<'vacancies' | 'admins' | 'announcements' | 'chats'>('vacancies');
  
  // Chat state
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatFileInput, setChatFileInput] = useState<HTMLInputElement | null>(null);
  const [chatPollingInterval, setChatPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAuthed) {
      loadVacanciesFromAPI();
      loadAdminsFromAPI();
      loadAnnouncementsFromAPI();
      if (activeTab === 'chats') {
        loadChatsFromAPI();
      }
    }
  }, [isAuthed, activeTab]);
  
  // Poll for new chats when on chats tab
  useEffect(() => {
    if (isAuthed && activeTab === 'chats') {
      loadChatsFromAPI();
      const interval = setInterval(() => {
        loadChatsFromAPI();
        if (selectedChat?.userPhone) {
          loadSelectedChat();
        }
      }, 2000);
      setChatPollingInterval(interval);
      return () => {
        clearInterval(interval);
        setChatPollingInterval(null);
      };
    }
  }, [isAuthed, activeTab, selectedChat?.userPhone]);

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

  // Chat handlers
  const loadChatsFromAPI = async () => {
    try {
      const data = await getAllChats();
      setChats(data);
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const loadSelectedChat = async () => {
    if (!selectedChat?.userPhone) return;
    try {
      const chatData = await getChat(selectedChat.userPhone);
      setSelectedChat(chatData);
    } catch (err) {
      console.error('Error loading selected chat:', err);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    try {
      const fullChat = await getChat(chat.userPhone);
      setSelectedChat(fullChat);
    } catch (err) {
      console.error('Error loading chat:', err);
      setError('Failed to load chat');
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedChat?.userPhone || loading) return;

    setLoading(true);
    setError(null);

    try {
      await sendMessage(selectedChat.userPhone, 'admin', chatMessage.trim(), 'text');
      setChatMessage('');
      await loadSelectedChat();
      await loadChatsFromAPI();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat?.userPhone || loading) return;

    const fileName = file.name.toLowerCase();
    const isValidFile = 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type === 'application/pdf' || 
      fileName.endsWith('.pdf');

    if (!isValidFile) {
      setError('Please select an image, video, or PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await uploadChatFile(file, selectedChat.userPhone, 'admin');
      await loadSelectedChat();
      await loadChatsFromAPI();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
      if (chatFileInput) {
        chatFileInput.value = '';
      }
    }
  };

  const formatTime = (timestamp: Date | string | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image');
    }
  };

  const handleDeleteChat = async (chatId: string, userPhone: string) => {
    if (!confirm(`Are you sure you want to delete the entire chat with ${userPhone}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteChat(chatId);
      
      // If deleted chat was selected, clear selection
      if (selectedChat?.id === chatId || selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
      
      // Reload chats list
      await loadChatsFromAPI();
    } catch (err: any) {
      setError(err.message || 'Failed to delete chat');
      console.error('Error deleting chat:', err);
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
            {/* Tabs Navigation - Mobile Responsive */}
            <div className="mb-3 sm:mb-6 border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-2 sm:space-x-4 md:space-x-8 min-w-max sm:min-w-0">
                <button
                  onClick={() => setActiveTab('vacancies')}
                  className={`px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'vacancies'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vacancies
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'announcements'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'admins'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'chats'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chat Support
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

            {/* Chat Support Tab */}
            {activeTab === 'chats' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6" style={{ minHeight: '600px' }}>
                {/* Chat List - Enhanced Design */}
                <div className={`lg:col-span-1 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 ${selectedChat ? 'hidden lg:flex' : 'flex'}`} style={{ maxHeight: '80vh' }}>
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5" />
                      <h3 className="font-bold text-base">Customer Chats</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-100">
                      <Phone className="w-3 h-3" />
                      <span>7895094129, 9193898182</span>
                    </div>
                    {chats.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-400/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-100">Total Chats</span>
                          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">{chats.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto bg-white">
                    {chats.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="bg-gray-100 rounded-full p-6 mb-4">
                          <MessageCircle className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">No chats yet</p>
                        <p className="text-xs text-gray-500">Customer chats will appear here</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {chats.map((chat) => {
                          const isSelected = selectedChat?.userPhone === chat.userPhone;
                          const lastMessage = chat.lastMessage;
                          const isRecent = chat.lastMessageAt && new Date(chat.lastMessageAt).getTime() > Date.now() - 3600000; // Last hour
                          
                          return (
                            <button
                              key={chat.id || chat._id}
                              onClick={() => handleSelectChat(chat)}
                              className={`w-full p-4 text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-sm' 
                                  : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  isSelected 
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md' 
                                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                }`}>
                                  <Phone className="w-5 h-5" />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-sm text-gray-900 truncate">
                                      {chat.userPhone}
                                    </div>
                                    {isRecent && !isSelected && (
                                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    )}
                                  </div>
                                  
                                  {lastMessage && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 mb-1">
                                      {lastMessage.type === 'text' ? (
                                        <span className="truncate">{lastMessage.content}</span>
                                      ) : lastMessage.type === 'image' ? (
                                        <span className="flex items-center gap-1 text-blue-600">
                                          <Image className="w-3 h-3" />
                                          <span>Image</span>
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-purple-600">
                                          <Video className="w-3 h-3" />
                                          <span>Video</span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTime(chat.lastMessageAt)}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-medium">{chat.messageCount || 0} msgs</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat View - Enhanced Design */}
                <div className={`lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 ${selectedChat ? 'flex' : 'hidden lg:flex'}`} style={{ maxHeight: '80vh' }}>
                  {selectedChat ? (
                    <>
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedChat(null)}
                            className="lg:hidden text-white hover:bg-white/20 active:bg-white/30 rounded-full p-1.5 transition-colors flex-shrink-0"
                            aria-label="Back to chats"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base">{selectedChat.userPhone}</h3>
                            <p className="text-xs text-blue-100 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Customer Chat
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-blue-100">Total Messages</div>
                              <div className="text-sm font-bold">{selectedChat.messages?.length || 0}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteChat(selectedChat.id || selectedChat._id || '', selectedChat.userPhone)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 rounded-lg transition-colors flex-shrink-0"
                              aria-label="Delete chat"
                              title="Delete this chat"
                              disabled={loading}
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                        {selectedChat.messages && selectedChat.messages.length > 0 ? (
                          <div className="space-y-4">
                            {selectedChat.messages.map((msg, index) => {
                              const isAdmin = msg.sender === 'admin';
                              const prevMsg = index > 0 ? selectedChat.messages[index - 1] : null;
                              const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;
                              
                              return (
                                <div
                                  key={index}
                                  className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                >
                                  {!isAdmin && showAvatar && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                  
                                  <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    <div
                                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                        isAdmin
                                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                      }`}
                                    >
                                      {msg.type === 'text' ? (
                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                      ) : msg.type === 'image' ? (
                                        <div className="rounded-lg overflow-hidden relative group">
                                          <img
                                            src={msg.content}
                                            alt="Shared image"
                                            className="max-w-full h-auto rounded-lg"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                            }}
                                          />
                                          <button
                                            onClick={() => handleDownloadImage(msg.content)}
                                            className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                            aria-label="Download image"
                                            title="Download image"
                                          >
                                            <Download className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : msg.type === 'video' ? (
                                        <video
                                          src={msg.content}
                                          controls
                                          className="max-w-full h-auto rounded-lg"
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                      ) : msg.type === 'pdf' ? (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2 text-sm">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                            <span>PDF Document</span>
                                          </div>
                                          <a
                                            href={msg.content}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
                                          >
                                            <Download className="w-4 h-4" />
                                            View/Download PDF
                                          </a>
                                        </div>
                                      ) : null}
                                    </div>
                                    <p
                                      className={`text-xs mt-1 px-1 ${
                                        isAdmin ? 'text-gray-500' : 'text-gray-500'
                                      }`}
                                    >
                                      {formatTime(msg.timestamp)}
                                    </p>
                                  </div>
                                  
                                  {isAdmin && showAvatar && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="bg-gray-100 rounded-full p-6 mb-4">
                              <MessageCircle className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium">No messages yet</p>
                            <p className="text-xs mt-1">Start the conversation!</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Error Message */}
                      {error && (
                        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                          <p className="text-sm text-red-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {error}
                          </p>
                        </div>
                      )}
                      
                      {/* Input Area */}
                      <div className="border-t border-gray-200 p-4 bg-white">
                        <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={(el) => setChatFileInput(el)}
                            onChange={handleChatFileUpload}
                            accept="image/*,video/*,application/pdf,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => chatFileInput?.click()}
                            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                            aria-label="Upload image, video, or PDF"
                            disabled={loading}
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                            disabled={loading}
                          />
                          <button
                            type="submit"
                            disabled={!chatMessage.trim() || loading}
                            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 shadow-lg disabled:shadow-none"
                            aria-label="Send message"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                          <MessageCircle className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-base font-semibold text-gray-700 mb-1">Select a chat</p>
                        <p className="text-sm text-gray-500">Choose a customer chat from the list to view messages</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}



