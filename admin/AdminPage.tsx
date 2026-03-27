'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, Loader2, MessageCircle, Send, Image, Video, Phone, Clock, User, Search, Paperclip, Download, X, CreditCard, IndianRupee, CheckCircle, XCircle, Eye, Globe, Monitor, Smartphone, Tablet, BookOpen, Database } from 'lucide-react';
import JanSevaDataModule from '@/components/admin/JanSevaDataModule';
import { resolveAnnouncementMedia, videoMimeTypeForUrl } from '@/lib/announcementMedia';
import { getVacancies, createVacancy, updateVacancy, deleteVacancy, type Vacancy, getAdmins, createAdmin, deleteAdmin, type Admin, getAllChats, getChat, sendMessage, uploadChatFile, deleteChat, type Chat, getAllPayments, type Payment, getVisitors, type Visitor, type VisitorStats, getGovernmentLinks, createGovernmentLink, updateGovernmentLink, deleteGovernmentLink, type GovernmentLink, createNotification, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadAnnouncementMedia, type Announcement, getBlogs, getBlog, createBlog, updateBlog, deleteBlog, uploadBlogImage, type Blog } from '@/lib/api';

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

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [announcementMediaBusy, setAnnouncementMediaBusy] = useState(false);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  
  const [activeTab, setActiveTab] = useState<
    'vacancies' | 'announcements' | 'admins' | 'chats' | 'payments' | 'visitors' | 'government-links' | 'blogs' | 'jan-seva-data'
  >('vacancies');
  
  // Payment state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState({ total: 0, totalAmount: 0 });
  
  // Chat state
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatFileInput, setChatFileInput] = useState<HTMLInputElement | null>(null);
  const [chatPollingInterval, setChatPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Visitor state
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<Visitor[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ total: 0, active: 0, today: 0 });
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  // Government Links state
  const [governmentLinks, setGovernmentLinks] = useState<GovernmentLink[]>([]);
  const [linkForm, setLinkForm] = useState({ name: '', url: '', icon: '🔗', description: '', category: 'General', order: 0 });
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // Blog state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Government Services',
    tags: '',
    author: 'Jan Seva Kendra',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    isPublished: false,
  });
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string>('');

  useEffect(() => {
    if (isAuthed) {
      loadVacanciesFromAPI();
      loadAdminsFromAPI();
      if (activeTab === 'chats') {
        loadChatsFromAPI();
      }
      if (activeTab === 'payments') {
        loadPaymentsFromAPI();
      }
      if (activeTab === 'visitors') {
        loadVisitorsFromAPI();
      }
      if (activeTab === 'government-links') {
        loadGovernmentLinksFromAPI();
      }
      if (activeTab === 'announcements') {
        loadAnnouncementsFromAPI();
      }
      if (activeTab === 'blogs') {
        loadBlogsFromAPI();
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

  // Poll for visitors when on visitors tab - Real-time updates
  useEffect(() => {
    if (isAuthed && activeTab === 'visitors') {
      loadVisitorsFromAPI();
      // Refresh every 2 seconds for real-time tracking
      const interval = setInterval(() => {
        loadVisitorsFromAPI();
      }, 2000); // Refresh every 2 seconds for live updates
      return () => {
        clearInterval(interval);
      };
    }
  }, [isAuthed, activeTab]);

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

  // Announcements functions
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
    setAnnouncementForm({ ...announcementForm, [e.target.name]: e.target.value });
  };

  const handleAnnouncementFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAnnouncementMediaBusy(true);
    setError(null);
    try {
      const { fileUrl, mediaType } = await uploadAnnouncementMedia(file);
      if (mediaType === 'video') {
        setAnnouncementForm((f) => ({ ...f, videoUrl: fileUrl, imageUrl: '' }));
      } else {
        setAnnouncementForm((f) => ({ ...f, imageUrl: fileUrl, videoUrl: '' }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setAnnouncementMediaBusy(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!announcementForm.title.trim()) {
      alert('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trimmedImage = announcementForm.imageUrl.trim();
      const trimmedVideo = announcementForm.videoUrl.trim();
      const basePayload = {
        title: announcementForm.title.trim(),
        description: announcementForm.description.trim() || undefined,
        link: announcementForm.link.trim() || undefined,
        imageUrl: trimmedImage,
        videoUrl: trimmedVideo,
      };

      if (editingAnnouncementId) {
        await updateAnnouncement(editingAnnouncementId, basePayload);
      } else {
        await createAnnouncement({
          ...basePayload,
          imageUrl: trimmedImage || undefined,
          videoUrl: trimmedVideo || undefined,
        });
        // Notification will be created automatically in the API route
        window.dispatchEvent(new CustomEvent('janseva:notifications:updated'));
      }

      await loadAnnouncementsFromAPI();
      setAnnouncementForm({ title: '', description: '', link: '', imageUrl: '', videoUrl: '' });
      setEditingAnnouncementId(null);
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
      link: a.link || '',
      imageUrl: a.imageUrl || '',
      videoUrl: a.videoUrl || '',
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
      if (editingAnnouncementId === id) {
        setEditingAnnouncementId(null);
        setAnnouncementForm({ title: '', description: '', link: '', imageUrl: '', videoUrl: '' });
      }
    } catch (err) {
      setError('Failed to delete announcement');
      console.error('Error deleting announcement:', err);
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
        // Notification will be created automatically in the API route
        // Dispatch event to update notifications
        window.dispatchEvent(new CustomEvent('janseva:notifications:updated'));
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

  // Chat handlers
  const loadChatsFromAPI = async () => {
    try {
      const data = await getAllChats();
      setChats(data);
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const loadPaymentsFromAPI = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data);
      
      // Calculate stats
      const successfulPayments = data.filter((p: Payment) => p.status === 'success');
      const totalAmount = successfulPayments.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);
      setPaymentStats({
        total: data.length,
        totalAmount: totalAmount,
      });
    } catch (err) {
      console.error('Error loading payments:', err);
      setPayments([]);
    }
  };

  const loadVisitorsFromAPI = async () => {
    try {
      const data = await getVisitors();
      if (data.success) {
        setActiveVisitors(data.activeVisitors || []);
        setVisitors(data.allVisitors || []);
        setVisitorStats(data.stats || { total: 0, active: 0, today: 0 });
        setLastUpdateTime(new Date());
        setIsLive(true);
      }
    } catch (err) {
      console.error('Error loading visitors:', err);
      setActiveVisitors([]);
      setVisitors([]);
      setVisitorStats({ total: 0, active: 0, today: 0 });
      setIsLive(false);
    }
  };

  // Helper function to check if visitor is new (arrived in last 1 minute)
  const isNewVisitor = (visitor: Visitor) => {
    if (!visitor.firstVisit) return false;
    try {
      const firstVisit = new Date(visitor.firstVisit);
      const now = new Date();
      const diffInSeconds = (now.getTime() - firstVisit.getTime()) / 1000;
      return diffInSeconds < 60; // New if arrived in last 60 seconds
    } catch (error) {
      return false;
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

  // Government Links functions
  const loadGovernmentLinksFromAPI = async () => {
    try {
      const links = await getGovernmentLinks(false);
      setGovernmentLinks(links);
    } catch (err) {
      console.error('Error loading government links:', err);
      setGovernmentLinks([]);
    }
  };

  const handleSubmitLink = async () => {
    if (!linkForm.name.trim() || !linkForm.url.trim()) {
      setError('Name and URL are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingLinkId) {
        await updateGovernmentLink(editingLinkId, linkForm);
      } else {
        await createGovernmentLink(linkForm);
      }
      await loadGovernmentLinksFromAPI();
      setLinkForm({ name: '', url: '', icon: '🔗', description: '', category: 'General', order: 0 });
      setEditingLinkId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save government link');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLink = (link: GovernmentLink) => {
    setLinkForm({
      name: link.name,
      url: link.url,
      icon: link.icon || '🔗',
      description: link.description || '',
      category: link.category || 'General',
      order: link.order || 0,
    });
    setEditingLinkId(link.id || link._id || null);
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this government link?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteGovernmentLink(id);
      await loadGovernmentLinksFromAPI();
      if (editingLinkId === id) {
        setEditingLinkId(null);
        setLinkForm({ name: '', url: '', icon: '🔗', description: '', category: 'General', order: 0 });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete government link');
    } finally {
      setLoading(false);
    }
  };

  // Blog functions
  const loadBlogsFromAPI = async () => {
    try {
      const data = await getBlogs({ limit: 100, published: false });
      setBlogs(data.blogs);
    } catch (err) {
      console.error('Error loading blogs:', err);
      setBlogs([]);
    }
  };

  const handleSubmitBlog = async () => {
    if (!blogForm.title.trim() || !blogForm.slug.trim() || !blogForm.excerpt.trim() || !blogForm.content.trim()) {
      setError('Title, Slug, Excerpt, and Content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload image first if a new file is selected
      let imageUrl = blogForm.featuredImage.trim() || undefined;
      if (blogImageFile) {
        imageUrl = await uploadBlogImage(blogImageFile);
      }

      const blogData = {
        title: blogForm.title.trim(),
        slug: blogForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        excerpt: blogForm.excerpt.trim(),
        content: blogForm.content.trim(),
        featuredImage: imageUrl,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t),
        author: blogForm.author.trim() || 'Jan Seva Kendra',
        metaTitle: blogForm.metaTitle.trim() || blogForm.title.trim(),
        metaDescription: blogForm.metaDescription.trim() || blogForm.excerpt.trim().substring(0, 160),
        keywords: blogForm.keywords.split(',').map(k => k.trim()).filter(k => k),
        isPublished: blogForm.isPublished,
      };

      if (editingBlogSlug) {
        await updateBlog(editingBlogSlug, blogData);
      } else {
        await createBlog(blogData);
      }
      await loadBlogsFromAPI();
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        category: 'Government Services',
        tags: '',
        author: 'Jan Seva Kendra',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        isPublished: false,
      });
      setBlogImageFile(null);
      setBlogImagePreview('');
      setEditingBlogSlug(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = async (slug: string) => {
    try {
      const blog = await getBlog(slug);
      setBlogForm({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage || '',
        category: blog.category,
        tags: blog.tags?.join(', ') || '',
        author: blog.author || 'Jan Seva Kendra',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        keywords: blog.keywords?.join(', ') || '',
        isPublished: blog.isPublished || false,
      });
      // Clear image file state when editing (existing image will show from featuredImage)
      setBlogImageFile(null);
      setBlogImagePreview('');
      setEditingBlogSlug(slug);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog');
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteBlog(slug);
      await loadBlogsFromAPI();
      if (editingBlogSlug === slug) {
        setEditingBlogSlug(null);
        setBlogForm({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          category: 'Government Services',
          tags: '',
          author: 'Jan Seva Kendra',
          metaTitle: '',
          metaDescription: '',
          keywords: '',
          isPublished: false,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/90">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-zinc-900 tracking-tight truncate">Admin</h1>
            <p className="text-[11px] text-zinc-500 hidden sm:block truncate">Jan Seva Kendra · Control panel</p>
          </div>
          {isAuthed ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-3 md:px-4 py-6 sm:py-8 md:py-10 max-w-[1600px]">
        {!isAuthed ? (
          <div className="max-w-[400px] mx-auto rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-zinc-900 text-center tracking-tight mb-1">Sign in</h2>
            <p className="text-xs text-zinc-500 text-center mb-6">Use your admin credentials</p>
            <div className="space-y-4">
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Username"
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
              />
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
              />
              <div className="pt-1">
                <button
                  onClick={handleLogin}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs — neutral chrome */}
            <div className="mb-5 sm:mb-6 border-b border-zinc-200/80 overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
              <nav className="flex gap-0.5 sm:gap-1 min-w-max pb-px">
                <button
                  onClick={() => setActiveTab('vacancies')}
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap rounded-t-md ${
                    activeTab === 'vacancies'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  Vacancies
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'announcements'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'admins'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'payments'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Payments</span>
                  <span className="xs:hidden">Pay</span>
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'chats'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Chat Support</span>
                  <span className="sm:hidden">Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('visitors')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'visitors'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Visitors</span>
                  <span className="sm:hidden">Visit</span>
                </button>
                <button
                  onClick={() => setActiveTab('government-links')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'government-links'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Gov Links</span>
                  <span className="sm:hidden">Links</span>
                </button>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'blogs'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Blog</span>
                </button>
                <button
                  onClick={() => setActiveTab('jan-seva-data')}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                    activeTab === 'jan-seva-data'
                      ? 'border-zinc-900 text-zinc-900 bg-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                  }`}
                >
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Jan Seva Data</span>
                  <span className="sm:hidden">Data</span>
                </button>
              </nav>
            </div>

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">Total Payments</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900">{paymentStats.total}</p>
                      </div>
                      <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                          <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 inline" />
                          {paymentStats.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 sm:p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">Successful</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                          {payments.filter((p) => p.status === 'success').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                      Payment History
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    {payments.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center">
                        <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No payments yet</p>
                        <p className="text-sm text-gray-500">Payment records will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {payments.map((payment) => (
                                <tr key={payment.id || payment._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-mono text-gray-900">
                                      {payment.razorpayPaymentId.substring(0, 20)}...
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Order: {payment.razorpayOrderId.substring(0, 15)}...
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-base font-bold text-gray-900">
                                      <IndianRupee className="w-4 h-4" />
                                      {payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {payment.status === 'success' ? (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        <CheckCircle className="w-4 h-4" />
                                        Success
                                      </span>
                                    ) : payment.status === 'failed' ? (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                        <XCircle className="w-4 h-4" />
                                        Failed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                        <Clock className="w-4 h-4" />
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">
                                      {payment.customerName || 'N/A'}
                                    </div>
                                    {payment.customerPhone && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {payment.customerPhone}
                                      </div>
                                    )}
                                    {payment.customerEmail && (
                                      <div className="text-xs text-gray-500">
                                        {payment.customerEmail}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">
                                      {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {new Date(payment.paymentDate).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 p-3">
                          {payments.map((payment) => (
                            <div key={payment.id || payment._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {payment.status === 'success' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3" />
                                        Success
                                      </span>
                                    ) : payment.status === 'failed' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                        <XCircle className="w-3 h-3" />
                                        Failed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                        <Clock className="w-3 h-3" />
                                        Pending
                                      </span>
                                    )}
                                    <div className="flex items-center gap-1 text-base font-bold text-gray-900">
                                      <IndianRupee className="w-4 h-4" />
                                      {payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                  <div className="text-xs font-mono text-gray-600 mb-1">
                                    {payment.razorpayPaymentId.substring(0, 24)}...
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                {payment.customerName && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-700">{payment.customerName}</span>
                                  </div>
                                )}
                                {payment.customerPhone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-700">{payment.customerPhone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700">
                                    {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })} at {new Date(payment.paymentDate).toLocaleTimeString('en-IN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vacancies Tab */}
            {activeTab === 'vacancies' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl">Add / Edit Vacancy</h3>
                <div className="space-y-3 sm:space-y-4">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                  <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag (Result/Notification)" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input name="vacancies" value={form.vacancies} onChange={handleChange} placeholder="Vacancies" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <input name="link" value={form.link} onChange={handleChange} placeholder="Link (optional)" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                  <textarea name="info" value={form.info} onChange={handleChange} placeholder="Short info" rows={4} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button 
                      onClick={handleAdd} 
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
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
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl">Existing Vacancies</h3>
                  {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
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
                  <div className="space-y-3 sm:space-y-4">
                    {vacancies.map((v) => (
                      <div key={v.id || v._id} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base md:text-lg mb-2 text-gray-900 break-words">{v.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600 mb-2 flex flex-wrap gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded">{v.tag}</span>
                            <span>{v.vacancies ?? '-'} vacancies</span>
                            <span>{v.date ?? '-'}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-700 mb-2 break-words">{v.info}</div>
                          {v.link && (
                            <a href={v.link} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 break-all inline-flex items-center gap-1">
                              <span>🔗</span> Open link
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-gray-100">
                          <button 
                            onClick={() => handleEdit(v.id || v._id || '')} 
                            disabled={loading}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                          >
                            <Edit className="w-4 h-4"/> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(v.id || v._id || '')} 
                            disabled={loading}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/> Delete
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

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                    <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl">Add / Edit Announcement</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <input 
                        name="title" 
                        value={announcementForm.title} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Title *" 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                      />
                      <textarea 
                        name="description" 
                        value={announcementForm.description} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Description" 
                        rows={4} 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                      />
                      <input 
                        name="link" 
                        value={announcementForm.link} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Link (optional)" 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                      />

                      <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <p className="text-xs font-medium text-gray-700">Photo or video (optional)</p>
                        <p className="text-xs text-gray-500">
                          Stored on ImageKit (HTTPS URLs — works on production). Image up to 5MB · Video up to ~95MB per your plan. Use .mp4/.mov if type is missing. Set IMAGEKIT_PRIVATE_KEY in server env.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm cursor-pointer hover:bg-gray-50">
                            <Image className="w-4 h-4 text-gray-600" />
                            <span>Upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={loading || announcementMediaBusy}
                              onChange={handleAnnouncementFileUpload}
                            />
                          </label>
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm cursor-pointer hover:bg-gray-50">
                            <Video className="w-4 h-4 text-gray-600" />
                            <span>Upload video</span>
                            <input
                              type="file"
                              accept="video/*,.mp4,.webm,.mov,.mkv"
                              className="hidden"
                              disabled={loading || announcementMediaBusy}
                              onChange={handleAnnouncementFileUpload}
                            />
                          </label>
                          {(announcementForm.imageUrl || announcementForm.videoUrl) && (
                            <button
                              type="button"
                              onClick={() => setAnnouncementForm((f) => ({ ...f, imageUrl: '', videoUrl: '' }))}
                              disabled={loading || announcementMediaBusy}
                              className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              Remove media
                            </button>
                          )}
                        </div>
                        {announcementMediaBusy && (
                          <p className="text-xs text-blue-600 inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
                          </p>
                        )}
                        {(() => {
                          const { videoSrc, imageSrc } = resolveAnnouncementMedia(announcementForm);
                          if (!videoSrc && !imageSrc) return null;
                          return (
                          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-black/5 aspect-video max-h-48 flex items-center justify-center">
                            {videoSrc ? (
                              <video
                                key={videoSrc}
                                className="w-full h-full max-h-48 object-contain"
                                controls
                                playsInline
                              >
                                <source src={videoSrc} type={videoMimeTypeForUrl(videoSrc)} />
                              </video>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageSrc!}
                                alt="Announcement preview"
                                className="w-full h-full max-h-48 object-contain"
                              />
                            )}
                          </div>
                          );
                        })()}
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        <button 
                          onClick={handleAddAnnouncement} 
                          disabled={loading}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          <span>{editingAnnouncementId ? 'Update' : 'Add'}</span>
                        </button>

                        {editingAnnouncementId && (
                          <button 
                            onClick={() => {
                              setEditingAnnouncementId(null);
                              setAnnouncementForm({ title: '', description: '', link: '', imageUrl: '', videoUrl: '' });
                            }} 
                            disabled={loading}
                            className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 order-1 lg:order-2">
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-base sm:text-lg md:text-xl">Existing Announcements</h3>
                      {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
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
                      <div className="space-y-3 sm:space-y-4">
                        {announcements.map((a) => (
                          <div key={a.id || a._id} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              {(() => {
                                const { videoSrc, imageSrc } = resolveAnnouncementMedia(a);
                                if (!videoSrc && !imageSrc) return null;
                                return (
                                <div className="mb-3 rounded-md overflow-hidden border border-gray-200 aspect-video max-h-40 bg-gray-100">
                                  {videoSrc ? (
                                    <video
                                      key={videoSrc}
                                      className="w-full h-full object-contain max-h-40"
                                      controls
                                      playsInline
                                    >
                                      <source src={videoSrc} type={videoMimeTypeForUrl(videoSrc)} />
                                    </video>
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={imageSrc!} alt="" className="w-full h-full object-cover max-h-40" />
                                  )}
                                </div>
                                );
                              })()}
                              <div className="font-semibold text-sm sm:text-base md:text-lg mb-2 text-gray-900 break-words">{a.title}</div>
                              {a.description && (
                                <div className="text-xs sm:text-sm text-gray-700 mb-2 break-words">{a.description}</div>
                              )}
                              {a.link && (
                                <a href={a.link} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 break-all inline-flex items-center gap-1">
                                  <span>🔗</span> Open link
                                </a>
                              )}
                              <div className="text-xs text-gray-500 mt-2">
                                Created: {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-gray-100">
                              <button 
                                onClick={() => handleEditAnnouncement(a.id || a._id || '')} 
                                disabled={loading}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                              >
                                <Edit className="w-4 h-4"/> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteAnnouncement(a.id || a._id || '')} 
                                disabled={loading}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4"/> Delete
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
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                  <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl">Add Admin</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <input 
                      value={adminForm.username} 
                      onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} 
                      placeholder="Username *" 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <input 
                      value={adminForm.password} 
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                      placeholder="Password *" 
                      type="password" 
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <button 
                      onClick={handleAddAdmin} 
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      <span>Add Admin</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base sm:text-lg md:text-xl">Existing Admins</h3>
                    {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
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
                    <div className="space-y-3 sm:space-y-4">
                      {admins.map((a) => (
                        <div key={a.id || a._id} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-1">{a.username}</div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              Created: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAdmin(a.id || a._id || '')} 
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Visitors Tab */}
            {activeTab === 'visitors' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Visitors</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900">{visitorStats.total}</p>
                      </div>
                      <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">Active Now</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900">{visitorStats.active}</p>
                      </div>
                      <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 sm:p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">Today</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-900">{visitorStats.today}</p>
                      </div>
                      <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Real-time Status Indicator */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {isLive ? '🟢 Live Tracking Active' : '🔴 Connection Lost'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {lastUpdateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Active Visitors */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                        Live Active Visitors ({activeVisitors.length})
                      </h3>
                      {activeVisitors.length > 0 && (
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {activeVisitors.filter(v => isNewVisitor(v)).length} new
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {activeVisitors.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center">
                        <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No active visitors</p>
                        <p className="text-sm text-gray-500">Active visitors will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name/Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Browser/OS</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Page</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Activity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {activeVisitors.map((visitor) => {
                                const isNew = isNewVisitor(visitor);
                                return (
                                <tr key={visitor.sessionId} className={`hover:bg-gray-50 transition-colors ${isNew ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                                  <td className="px-4 py-3">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="text-sm font-semibold text-gray-900">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 truncate max-w-xs">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-400 italic">Not provided</div>
                                    )}
                                    {isNew && (
                                      <div className="mt-1">
                                        <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                          <span>🆕</span>
                                          <span>New</span>
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {visitor.device === 'Mobile' ? (
                                        <Smartphone className="w-4 h-4 text-gray-600" />
                                      ) : visitor.device === 'Tablet' ? (
                                        <Tablet className="w-4 h-4 text-gray-600" />
                                      ) : (
                                        <Monitor className="w-4 h-4 text-gray-600" />
                                      )}
                                      <span className="text-sm text-gray-900">{visitor.device || 'Desktop'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">{visitor.browser || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{visitor.os || 'Unknown'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 font-mono truncate max-w-xs">{visitor.page || '/'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">
                                      {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">{visitor.ipAddress}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {visitor.lastActivity ? (
                                      <>
                                        <div className="text-sm text-gray-900">
                                          {new Date(visitor.lastActivity).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(visitor.lastActivity).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-xs text-gray-400">N/A</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                      {visitor.visitCount || 1}
                                    </span>
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 p-3">
                          {activeVisitors.map((visitor) => {
                            const isNew = isNewVisitor(visitor);
                            return (
                            <div key={visitor.sessionId} className={`bg-white border rounded-lg p-4 shadow-sm ${isNew ? 'border-yellow-400 border-l-4 bg-yellow-50' : 'border-gray-200'}`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {visitor.device === 'Mobile' ? (
                                    <Smartphone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  ) : visitor.device === 'Tablet' ? (
                                    <Tablet className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="font-semibold text-sm text-gray-900 truncate">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 truncate">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-semibold text-sm text-gray-900">{visitor.device || 'Desktop'}</div>
                                    )}
                                    <div className="text-xs text-gray-500">{visitor.browser || 'Unknown'} • {visitor.os || 'Unknown'}</div>
                                  </div>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0 ml-2">
                                  Active
                                </span>
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 font-mono truncate">{visitor.page || '/'}</span>
                                </div>
                                {visitor.city || visitor.country ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">📍</span>
                                    <span className="text-xs text-gray-700">
                                      {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                                    </span>
                                  </div>
                                ) : null}
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700">
                                    {visitor.lastActivity ? (
                                      new Date(visitor.lastActivity).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    ) : (
                                      'N/A'
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Visits:</span>
                                  <span className="text-xs font-semibold text-gray-900">{visitor.visitCount || 1}</span>
                                </div>
                              </div>
                              {isNew && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                  <span>🆕</span>
                                  <span>New Visitor (Just arrived)</span>
                                </div>
                              )}
                            </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* All Visitors (Recent) */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      Recent Visitors ({visitors.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    {visitors.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center">
                        <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-1">No visitors yet</p>
                        <p className="text-sm text-gray-500">Visitor records will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name/Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Browser/OS</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Page</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">First Visit</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {visitors.slice(0, 50).map((visitor) => (
                                <tr key={visitor.sessionId} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="text-sm font-semibold text-gray-900">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 truncate max-w-xs">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-400 italic">Not provided</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {visitor.device === 'Mobile' ? (
                                        <Smartphone className="w-4 h-4 text-gray-600" />
                                      ) : visitor.device === 'Tablet' ? (
                                        <Tablet className="w-4 h-4 text-gray-600" />
                                      ) : (
                                        <Monitor className="w-4 h-4 text-gray-600" />
                                      )}
                                      <span className="text-sm text-gray-900">{visitor.device || 'Desktop'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">{visitor.browser || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{visitor.os || 'Unknown'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 font-mono truncate max-w-xs">{visitor.page || '/'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {visitor.firstVisit ? (
                                      <>
                                        <div className="text-sm text-gray-900">
                                          {new Date(visitor.firstVisit).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(visitor.firstVisit).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-xs text-gray-400">N/A</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {visitor.isActive ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                      {visitor.visitCount || 1}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 p-3">
                          {visitors.slice(0, 20).map((visitor) => (
                            <div key={visitor.sessionId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {visitor.device === 'Mobile' ? (
                                    <Smartphone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  ) : visitor.device === 'Tablet' ? (
                                    <Tablet className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="font-semibold text-sm text-gray-900 truncate">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 truncate">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-semibold text-sm text-gray-900">{visitor.device || 'Desktop'}</div>
                                    )}
                                    <div className="text-xs text-gray-500">{visitor.browser || 'Unknown'} • {visitor.os || 'Unknown'}</div>
                                  </div>
                                </div>
                                {visitor.isActive ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0 ml-2">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex-shrink-0 ml-2">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 font-mono truncate">{visitor.page || '/'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700">
                                    {visitor.firstVisit ? (
                                      new Date(visitor.firstVisit).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    ) : (
                                      'N/A'
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Visits:</span>
                                  <span className="text-xs font-semibold text-gray-900">{visitor.visitCount || 1}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Support Tab */}
            {activeTab === 'chats' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6" style={{ minHeight: '500px' }}>
                {/* Chat List - Enhanced Design */}
                <div className={`lg:col-span-1 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col border-2 border-gray-200 ${selectedChat ? 'hidden lg:flex' : 'flex'}`} style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5" />
                      <h3 className="font-bold text-base">Customer Chats</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-100">
                      <Phone className="w-3 h-3" />
                      <span>9193898182, 7895094129</span>
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
                <div className={`lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border-2 border-gray-200 ${selectedChat ? 'flex' : 'hidden lg:flex'}`} style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={msg.content}
                                            alt="Shared image"
                                            className="max-w-full h-auto rounded-lg"
                                            loading="lazy"
                                            onError={(e) => {
                                              const img = e.target as HTMLImageElement;
                                              // Prevent infinite loop - if already a data URI or placeholder, hide the image
                                              if (img.src.startsWith('data:') || img.dataset.errorHandled === 'true') {
                                                img.style.display = 'none';
                                                return;
                                              }
                                              // Mark as handled to prevent multiple retries
                                              img.dataset.errorHandled = 'true';
                                              // Set placeholder data URI
                                              img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
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

            {/* Government Links Tab */}
            {activeTab === 'government-links' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                    {editingLinkId ? 'Edit Government Link' : 'Add New Government Link'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={linkForm.name}
                        onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                        placeholder="e.g., Aadhaar Official"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                      <input
                        type="url"
                        value={linkForm.url}
                        onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                      <input
                        type="text"
                        value={linkForm.icon}
                        onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                        placeholder="🔗"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={linkForm.category}
                        onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value })}
                        placeholder="General"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={linkForm.description}
                        onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                        placeholder="Optional description"
                        rows={2}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order (for sorting)</label>
                      <input
                        type="number"
                        value={linkForm.order}
                        onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleSubmitLink}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : editingLinkId ? 'Update' : 'Add'} Link
                    </button>
                    {editingLinkId && (
                      <button
                        onClick={() => {
                          setEditingLinkId(null);
                          setLinkForm({ name: '', url: '', icon: '🔗', description: '', category: 'General', order: 0 });
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Links List */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-lg sm:text-xl font-bold">Government Links ({governmentLinks.length})</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    {governmentLinks.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No government links added yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {governmentLinks.map((link) => (
                          <div
                            key={link.id || link._id}
                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-2xl">{link.icon || '🔗'}</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">{link.name}</h4>
                                  {link.category && (
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                      {link.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 truncate block mb-2"
                            >
                              {link.url}
                            </a>
                            {link.description && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{link.description}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEditLink(link)}
                                className="flex-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition"
                              >
                                <Edit className="w-3 h-3 inline mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLink(link.id || link._id || '')}
                                className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 transition"
                              >
                                <Trash2 className="w-3 h-3" />
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

            {/* Blog Tab */}
            {activeTab === 'blogs' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {editingBlogSlug ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                        <input
                          type="text"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="Blog Title"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Slug * (URL-friendly)</label>
                        <input
                          type="text"
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          placeholder="blog-post-slug"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt * (Short description, max 300 chars)</label>
                      <textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Short description of the blog post..."
                        rows={3}
                        maxLength={300}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">{blogForm.excerpt.length}/300</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Content * (HTML supported)</label>
                      <textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="<p>Your blog content here...</p>"
                        rows={10}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Government Services">Government Services</option>
                          <option value="Document Services">Document Services</option>
                          <option value="Schemes & Benefits">Schemes & Benefits</option>
                          <option value="Tips & Guides">Tips & Guides</option>
                          <option value="News & Updates">News & Updates</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file type
                              if (!file.type.startsWith('image/')) {
                                setError('Please select an image file');
                                return;
                              }
                              // Validate file size (5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                setError('Image size must be less than 5MB');
                                return;
                              }
                              setBlogImageFile(file);
                              // Create preview
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBlogImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                        {blogImagePreview && (
                          <div className="mt-2">
                            <img 
                              src={blogImagePreview} 
                              alt="Preview" 
                              className="max-w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBlogImageFile(null);
                                setBlogImagePreview('');
                                setBlogForm({ ...blogForm, featuredImage: '' });
                              }}
                              className="mt-1 text-xs text-red-600 hover:text-red-700"
                            >
                              Remove image
                            </button>
                          </div>
                        )}
                        {blogForm.featuredImage && !blogImagePreview && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Current image:</p>
                            <img 
                              src={blogForm.featuredImage} 
                              alt="Current" 
                              className="max-w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                          placeholder="Aadhaar, PAN Card, Documents"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                        <input
                          type="text"
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          placeholder="Jan Seva Kendra"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title (SEO)</label>
                      <input
                        type="text"
                        value={blogForm.metaTitle}
                        onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                        placeholder="Leave empty to use title"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description (SEO, max 160 chars)</label>
                      <textarea
                        value={blogForm.metaDescription}
                        onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })}
                        placeholder="Leave empty to use excerpt"
                        rows={2}
                        maxLength={160}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">{blogForm.metaDescription.length}/160</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords (SEO, comma-separated)</label>
                      <input
                        type="text"
                        value={blogForm.keywords}
                        onChange={(e) => setBlogForm({ ...blogForm, keywords: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={blogForm.isPublished}
                        onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700">
                        Publish immediately
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitBlog}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {editingBlogSlug ? 'Update Blog' : 'Create Blog'}
                      </button>
                      {editingBlogSlug && (
                        <button
                          onClick={() => {
                            setEditingBlogSlug(null);
                            setBlogForm({
                              title: '',
                              slug: '',
                              excerpt: '',
                              content: '',
                              featuredImage: '',
                              category: 'Government Services',
                              tags: '',
                              author: 'Jan Seva Kendra',
                              metaTitle: '',
                              metaDescription: '',
                              keywords: '',
                              isPublished: false,
                            });
                            setBlogImageFile(null);
                            setBlogImagePreview('');
                          }}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blog List */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">All Blog Posts ({blogs.length})</h2>
                  {blogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No blog posts yet. Create your first blog post above!</p>
                  ) : (
                    <div className="space-y-3">
                      {blogs.map((blog) => (
                        <div
                          key={blog.id || blog._id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900">{blog.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {blog.isPublished ? 'Published' : 'Draft'}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  {blog.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.excerpt}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Slug: /blog/{blog.slug}</span>
                                {blog.views && <span>Views: {blog.views}</span>}
                                {blog.readingTime && <span>Reading: {blog.readingTime} min</span>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleEditBlog(blog.slug)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.slug)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jan-seva-data' && <JanSevaDataModule />}
          </div>
        )}
      </main>
    </div>
  );
}



