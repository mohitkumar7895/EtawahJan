'use client';

import { useCallback, useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Trash2,
  Edit,
  Plus,
  Loader2,
  MessageCircle,
  Send,
  Image as ImageIcon,
  Video,
  Phone,
  Clock,
  User,
  Search,
  Paperclip,
  Download,
  X,
  CreditCard,
  IndianRupee,
  CheckCircle,
  XCircle,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  BookOpen,
  Database,
  Menu,
  LayoutDashboard,
  Zap,
  Briefcase,
  Megaphone,
  Shield,
  Users,
  Link2,
  LogOut,
  FileText,
} from 'lucide-react';
import NextImage from 'next/image';
import JanSevaDataModule from '@/components/admin/JanSevaDataModule';
import { AdminThemeToggle } from '@/components/admin/AdminThemeToggle';
import CardContainer from '@/components/admin/CardContainer';
import InputField from '@/components/admin/InputField';
import TextAreaField from '@/components/admin/TextAreaField';
import {
  adminFileInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
  adminSelectClass,
} from '@/lib/admin-form-styles';
import { resolveAnnouncementMedia, videoMimeTypeForUrl } from '@/lib/announcementMedia';
import { getVacancies, createVacancy, updateVacancy, deleteVacancy, type Vacancy, getAdmins, createAdmin, deleteAdmin, type Admin, getAllChats, getChat, sendMessage, uploadChatFile, deleteChat, type Chat, getAllPayments, type Payment, getVisitors, type Visitor, type VisitorStats, getGovernmentLinks, createGovernmentLink, updateGovernmentLink, deleteGovernmentLink, type GovernmentLink, createNotification, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadAnnouncementMedia, type Announcement, getBlogs, getBlog, createBlog, updateBlog, deleteBlog, uploadBlogImage, type Blog, getSitemapData, type SitemapPayload, type SitemapUrl, getCustomSitemapLinks, createCustomSitemapLink, updateCustomSitemapLink, deleteCustomSitemapLink, type CustomSitemapLink, getAdminApplications, updateAdminApplication, type ServiceApplication } from '@/lib/api';
import { getElectricityPage, getEdistrictPage, getWithdrawalPage } from '@/lib/janSevaApi';
import DashboardCharts from '@/components/DashboardCharts';

const ADMIN_LOGO_SRC = '/jan-seva-logo-1.png';

function AdminBrandLogo({
  className,
  size = 40,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <NextImage
      src={ADMIN_LOGO_SRC}
      alt="Jan Seva Kendra"
      width={size}
      height={size}
      className={className ?? 'h-auto w-auto object-contain'}
      priority={priority}
    />
  );
}

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'adminmohit1234';

type AdminTab =
  | 'dashboard'
  | 'vacancies'
  | 'announcements'
  | 'admins'
  | 'chats'
  | 'payments'
  | 'visitors'
  | 'government-links'
  | 'blogs'
  | 'jan-seva-data'
  | 'seo-sitemap'
  | 'applications'
  | 'theme-settings';

type DashboardSnapshot = {
  vacancies: number;
  announcements: number;
  admins: number;
  chats: number;
  payments: number;
  paymentSuccessAmount: number;
  visitorsTotal: number;
  visitorsActive: number;
  visitorsToday: number;
  governmentLinks: number;
  blogs: number;
  electricity: number;
  edistrict: number;
  withdrawal: number;
};

import { Palette } from 'lucide-react';

const ADMIN_NAV: { id: AdminTab; label: string; description: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview & counts', icon: LayoutDashboard },
  { id: 'applications', label: 'Service Forms', description: 'User submissions & Excel', icon: FileText },
  { id: 'vacancies', label: 'Vacancies', description: 'Job listings & results', icon: Briefcase },
  { id: 'announcements', label: 'Announcements', description: 'News & media', icon: Megaphone },
  { id: 'admins', label: 'Administrators', description: 'Access control', icon: Shield },
  { id: 'payments', label: 'Payments', description: 'Transactions & stats', icon: CreditCard },
  { id: 'chats', label: 'Chat support', description: 'Customer messages', icon: MessageCircle },
  { id: 'visitors', label: 'Live visitors', description: 'Analytics & presence', icon: Users },
  { id: 'government-links', label: 'Gov links', description: 'Public quick links', icon: Link2 },
  { id: 'blogs', label: 'Blog', description: 'Posts & SEO', icon: BookOpen },
  { id: 'jan-seva-data', label: 'Jan Seva data', description: 'Registry modules', icon: Database },
  { id: 'seo-sitemap', label: 'Sitemap & SEO', description: 'Google indexing & URLs', icon: Globe },
  { id: 'theme-settings', label: 'Theme Settings', description: 'Global colors', icon: Palette },
];

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  // Persist session across refreshes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedAuth = localStorage.getItem('etawah_admin_authed');
      if (cachedAuth === 'true') {
        setIsAuthed(true);
      }
    }
  }, []);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [form, setForm] = useState({
    title: '',
    tag: '',
    info: '',
    date: '',
    lastDate: '',
    vacancies: '',
    link: '',
    // New rich fields
    category: 'Vacancies',
    shortDescription: '',
    fullDescription: '',
    startDate: '',
    ageLimit: '',
    totalPosts: '',
    qualification: '',
    requiredDocuments: '',
    officialLink: '',
    thumbnail: '',
  });
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
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardSnapshot | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setTab = (id: AdminTab) => {
    setActiveTab(id);
    setMobileNavOpen(false);
  };

  const currentNav = ADMIN_NAV.find((n) => n.id === activeTab);
  
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

  // Sitemap & SEO state
  const [sitemapData, setSitemapData] = useState<SitemapPayload | null>(null);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapSearch, setSitemapSearch] = useState('');
  const [selectedSitemapUrl, setSelectedSitemapUrl] = useState<SitemapUrl | null>(null);
  const [customSitemapLinks, setCustomSitemapLinks] = useState<CustomSitemapLink[]>([]);
  const [customSitemapLoading, setCustomSitemapLoading] = useState(false);
  const [editingCustomSitemapLink, setEditingCustomSitemapLink] = useState<CustomSitemapLink | null>(null);
  const [customSitemapForm, setCustomSitemapForm] = useState({
    url: '',
    title: '',
    description: '',
    changeFrequency: 'weekly',
    priority: 0.5,
    isActive: true,
  });

  // Service Applications state
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsFilter, setApplicationsFilter] = useState<'all' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [applicationsStatusFilter, setApplicationsStatusFilter] = useState<string>('all');
  const [applicationsTypeFilter, setApplicationsTypeFilter] = useState<'all' | 'callbacks' | 'services'>('all');
  const [editingApplication, setEditingApplication] = useState<ServiceApplication | null>(null);
  const [appUpdateLoading, setAppUpdateLoading] = useState(false);
  const [appForm, setAppForm] = useState({ status: 'pending', remarks: '', adminNotes: '' });

  const loadDashboardStats = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const [
        vacancies,
        announcements,
        admins,
        chats,
        paymentsList,
        visitorPayload,
        govLinks,
        blogPayload,
        elec,
        edis,
        withd,
      ] = await Promise.all([
        getVacancies().then((a) => a.length).catch(() => 0),
        getAnnouncements().then((a) => a.length).catch(() => 0),
        getAdmins().then((a) => a.length).catch(() => 0),
        getAllChats().then((a) => a.length).catch(() => 0),
        getAllPayments().catch(() => [] as Payment[]),
        getVisitors().catch(() => ({
          success: false,
          activeVisitors: [] as Visitor[],
          allVisitors: [] as Visitor[],
          stats: { total: 0, active: 0, today: 0 },
        })),
        getGovernmentLinks(false).then((a) => a.length).catch(() => 0),
        getBlogs({ page: 1, limit: 1 }).catch(() => ({ blogs: [] as Blog[], pagination: { total: 0 } })),
        getElectricityPage(1, 1).then((r) => r.total).catch(() => 0),
        getEdistrictPage(1, 1).then((r) => r.total).catch(() => 0),
        getWithdrawalPage(1, 1).then((r) => r.total).catch(() => 0),
      ]);

      const successfulPayments = paymentsList.filter((p) => p.status === 'success');
      const paymentSuccessAmount = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const blogTotal =
        blogPayload.pagination && typeof blogPayload.pagination.total === 'number'
          ? blogPayload.pagination.total
          : blogPayload.blogs.length;

      setDashboardStats({
        vacancies,
        announcements,
        admins,
        chats,
        payments: paymentsList.length,
        paymentSuccessAmount,
        visitorsTotal: visitorPayload.stats?.total ?? visitorPayload.allVisitors?.length ?? 0,
        visitorsActive: visitorPayload.stats?.active ?? visitorPayload.activeVisitors?.length ?? 0,
        visitorsToday: visitorPayload.stats?.today ?? 0,
        governmentLinks: govLinks,
        blogs: blogTotal,
        electricity: elec,
        edistrict: edis,
        withdrawal: withd,
      });
    } catch (e) {
      console.error('Dashboard stats error:', e);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthed || activeTab !== 'dashboard') return;
    void loadDashboardStats();
  }, [isAuthed, activeTab, loadDashboardStats]);

  useEffect(() => {
    if (isAuthed) {
      if (activeTab !== 'dashboard') {
        loadVacanciesFromAPI();
      }
      if (activeTab !== 'dashboard') {
        loadAdminsFromAPI();
      }
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
      if (activeTab === 'seo-sitemap') {
        loadSitemapFromAPI();
      }
    }
  }, [isAuthed, activeTab]);

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('etawah_admin_authed', 'true');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    setUser('');
    setPass('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('etawah_admin_authed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    // Map to tags and links for backward compatibility
    const finalTag = form.tag.trim() || (form.category === 'Results' ? 'Result' : form.category === 'Admit Cards' ? 'Admit Card' : 'Vacancy');
    const finalLink = form.officialLink.trim() || form.link.trim() || '';

    try {
      const vacancyData = {
        title: form.title.trim(),
        tag: finalTag,
        info: form.shortDescription.trim() || form.info.trim() || '',
        date: form.startDate || form.date || '',
        lastDate: form.lastDate || '',
        vacancies: form.vacancies ? Number(form.vacancies) : undefined,
        link: finalLink,
        
        // Rich government portal fields
        category: form.category,
        shortDescription: form.shortDescription.trim() || form.info.trim() || '',
        fullDescription: form.fullDescription.trim() || form.shortDescription.trim() || form.info.trim() || '',
        startDate: form.startDate || form.date || '',
        ageLimit: form.ageLimit || 'As per Rules',
        totalPosts: form.totalPosts || form.vacancies || 'Various',
        qualification: form.qualification || 'See Details',
        requiredDocuments: form.requiredDocuments || 'Photograph, Signature, ID Proof, Marksheets',
        officialLink: finalLink,
        thumbnail: form.thumbnail || '',
        sourceType: 'admin'
      };

      if (editingId) {
        await updateVacancy(editingId, vacancyData);
      } else {
        await createVacancy(vacancyData);
        window.dispatchEvent(new CustomEvent('janseva:notifications:updated'));
      }

      await loadVacanciesFromAPI();
      setForm({
        title: '',
        tag: '',
        info: '',
        date: '',
        lastDate: '',
        vacancies: '',
        link: '',
        category: 'Vacancies',
        shortDescription: '',
        fullDescription: '',
        startDate: '',
        ageLimit: '',
        totalPosts: '',
        qualification: '',
        requiredDocuments: '',
        officialLink: '',
        thumbnail: '',
      });
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
    const v = vacancies.find((x) => (x.id || x._id) === id) as any;
    if (!v) return;
    setEditingId(id);
    
    // Auto map dynamic fields on edit
    const mappedCategory = v.category || (v.tag?.toLowerCase().includes('result') ? 'Results' : v.tag?.toLowerCase().includes('admit') ? 'Admit Cards' : 'Vacancies');

    setForm({
      title: v.title || '',
      tag: v.tag || '',
      info: v.info || v.shortDescription || '',
      date: v.date || v.startDate || '',
      lastDate: v.lastDate || '',
      vacancies: v.vacancies ? String(v.vacancies) : '',
      link: v.link || v.officialLink || '',
      category: mappedCategory,
      shortDescription: v.shortDescription || v.info || '',
      fullDescription: v.fullDescription || v.info || '',
      startDate: v.startDate || v.date || '',
      ageLimit: v.ageLimit || 'As per Rules',
      totalPosts: v.totalPosts || (v.vacancies ? String(v.vacancies) : 'Various'),
      qualification: v.qualification || 'See Details',
      requiredDocuments: v.requiredDocuments || 'Photograph, Signature, ID Proof, Marksheets',
      officialLink: v.officialLink || v.link || '',
      thumbnail: v.thumbnail || '',
    });
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

  const loadSelectedChat = useCallback(async () => {
    if (!selectedChat?.userPhone) return;
    try {
      const chatData = await getChat(selectedChat.userPhone);
      setSelectedChat(chatData);
    } catch (err) {
      console.error('Error loading selected chat:', err);
    }
  }, [selectedChat?.userPhone]);

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
  }, [isAuthed, activeTab, selectedChat?.userPhone, loadSelectedChat]);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  const getUrlMetadata = (url: string) => {
    const isBlog = url.includes('/blog/');
    if (isBlog) {
      const slug = url.split('/blog/')[1] || '';
      const blog = blogs.find(b => b.slug === slug);
      if (blog) {
        return {
          title: blog.metaTitle || blog.title || 'Jan Seva Kendra Blog Post',
          description: blog.metaDescription || blog.excerpt || 'Read this post on our official Jan Seva Kendra blog portal.',
          displayUrl: `jan-seva.site › blog › ${slug}`,
          category: 'Blog Post',
        };
      }
      return {
        title: 'Blog Post | Jan Seva Kendra',
        description: 'Read the latest post from Jan Seva Kendra official blog.',
        displayUrl: `jan-seva.site › blog › ${slug}`,
        category: 'Blog Post',
      };
    }

    const path = url.replace('https://www.jan-seva.site', '');
    switch (path) {
      case '/':
      case '':
        return {
          title: 'Jan Seva Kendra Near Me | CSC Center Etawah Bharthana | Website & App Development',
          description: 'Jan Seva Kendra & CSC Center near me — Etawah, Bharthana. PAN card apply, income certificate, ration card. We also provide premium IT services: Website Development, Mobile App Development, Game Development, and Custom Software to grow your business. Call: 9193898182 | WhatsApp: 7895094129. Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP 206241.',
          displayUrl: 'https://www.jan-seva.site',
          category: 'Homepage',
        };
      case '/about':
        return {
          title: 'About Us | Jan Seva Kendra - CSC Center UP',
          description: 'Government authorized CSC Etawah Bharthana. Trusted digital helper for the citizens of Uttar Pradesh. Complete list of online government services under one roof.',
          displayUrl: 'https://www.jan-seva.site › about',
          category: 'Static Page',
        };
      case '/services':
        return {
          title: 'Our Services | Jan Seva Kendra - CSC Center UP',
          description: 'Apply Aadhaar, PAN, Domicile, Income, Caste, Birth, Ayushman & Voter cards online. Same day processing. We also develop professional business websites and custom software.',
          displayUrl: 'https://www.jan-seva.site › services',
          category: 'Static Page',
        };
      case '/contact':
        return {
          title: 'Contact Us | Jan Seva Kendra - CSC Center UP',
          description: 'Contact Jan Seva Kendra in Bharthana, Etawah. Call 9193898182 or WhatsApp 7895094129 for fast online processing, Aadhaar correction, and premium software development inquiries.',
          displayUrl: 'https://www.jan-seva.site › contact',
          category: 'Static Page',
        };
      case '/vacancies':
        return {
          title: 'Government Job Vacancies & Results | Jan Seva Kendra',
          description: 'Latest government job announcements, vacancies, exams, admit cards, and online application details. Fast and accurate details updated daily.',
          displayUrl: 'https://www.jan-seva.site › vacancies',
          category: 'Static Page',
        };
      case '/blog':
        return {
          title: 'Official Blog & Technical SEO | Jan Seva Kendra',
          description: 'Latest news, updates, government schemes, and step-by-step guides on applying for PAN, Aadhaar, Ration Cards, and digital empowerment in Uttar Pradesh.',
          displayUrl: 'https://www.jan-seva.site › blog',
          category: 'Static Page',
        };
      case '/announcements':
        return {
          title: 'Announcements & Media | Jan Seva Kendra',
          description: 'Live announcements, breaking government news, circulars, and media updates for the citizens of Bharthana and Etawah UP.',
          displayUrl: 'https://www.jan-seva.site › announcements',
          category: 'Static Page',
        };
      case '/faq':
        return {
          title: 'Frequently Asked Questions (FAQ) | Jan Seva Kendra',
          description: 'Got questions? Get answers about online applications, PAN processing time, Aadhaar updates near you, fees, and government service guidelines.',
          displayUrl: 'https://www.jan-seva.site › faq',
          category: 'Static Page',
        };
      case '/government-links':
        return {
          title: 'Official Government Portal Links | Jan Seva Kendra',
          description: 'Quick access to official government websites: Aadhaar UIDAI, PAN NSDL/UTI, eDistrict, UP Scholarship, and PM Kisan portal. Verified secure links.',
          displayUrl: 'https://www.jan-seva.site › government-links',
          category: 'Static Page',
        };
      default:
        return {
          title: 'Jan Seva Kendra - CSC Center UP',
          description: 'Government schemes, PAN Card, Aadhaar Card, Ration Card, eDistrict UP, and premium custom website/software development services in Bharthana & Etawah.',
          displayUrl: `https://www.jan-seva.site${path}`,
          category: 'Sitemap Link',
        };
    }
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

  const loadSitemapFromAPI = async () => {
    setSitemapLoading(true);
    setError(null);
    try {
      const [sitemapDataPayload, customLinksPayload] = await Promise.all([
        getSitemapData(),
        getCustomSitemapLinks(),
      ]);
      setSitemapData(sitemapDataPayload);
      setCustomSitemapLinks(customLinksPayload);
      if (sitemapDataPayload.urls.length > 0) {
        setSelectedSitemapUrl(sitemapDataPayload.urls[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sitemap data');
    } finally {
      setSitemapLoading(false);
    }
  };

  const handleSubmitCustomSitemapLink = async () => {
    if (!customSitemapForm.url.trim() || !customSitemapForm.title.trim()) {
      setError('URL and Title are required');
      return;
    }

    setCustomSitemapLoading(true);
    setError(null);

    try {
      if (editingCustomSitemapLink?.id) {
        await updateCustomSitemapLink(editingCustomSitemapLink.id, customSitemapForm);
      } else {
        await createCustomSitemapLink(customSitemapForm);
      }
      
      await loadSitemapFromAPI();
      
      setCustomSitemapForm({
        url: '',
        title: '',
        description: '',
        changeFrequency: 'weekly',
        priority: 0.5,
        isActive: true,
      });
      setEditingCustomSitemapLink(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save custom sitemap link');
    } finally {
      setCustomSitemapLoading(false);
    }
  };

  const handleEditCustomSitemapLink = (link: CustomSitemapLink) => {
    setCustomSitemapForm({
      url: link.url,
      title: link.title,
      description: link.description || '',
      changeFrequency: link.changeFrequency || 'weekly',
      priority: link.priority !== undefined ? link.priority : 0.5,
      isActive: link.isActive !== undefined ? link.isActive : true,
    });
    setEditingCustomSitemapLink(link);
  };

  const handleDeleteCustomSitemapLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom sitemap link?')) {
      return;
    }

    setCustomSitemapLoading(true);
    setError(null);

    try {
      await deleteCustomSitemapLink(id);
      await loadSitemapFromAPI();
      if (editingCustomSitemapLink?.id === id) {
        setEditingCustomSitemapLink(null);
        setCustomSitemapForm({
          url: '',
          title: '',
          description: '',
          changeFrequency: 'weekly',
          priority: 0.5,
          isActive: true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete custom sitemap link');
    } finally {
      setCustomSitemapLoading(false);
    }
  };

  // Service Applications operations
  const loadApplicationsFromAPI = useCallback(
    async (dateFilter = applicationsFilter, statusFilter = applicationsStatusFilter) => {
      setApplicationsLoading(true);
      setError(null);
      try {
        const data = await getAdminApplications(dateFilter, statusFilter);
        setApplications(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load applications');
        setApplications([]);
      } finally {
        setApplicationsLoading(false);
      }
    },
    [applicationsFilter, applicationsStatusFilter]
  );

  // Load applications when tab or filters change
  useEffect(() => {
    if (isAuthed && activeTab === 'applications') {
      loadApplicationsFromAPI();
    }
  }, [isAuthed, activeTab, applicationsFilter, applicationsStatusFilter, loadApplicationsFromAPI]);

  const handleUpdateApplicationStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;
    setAppUpdateLoading(true);
    setError(null);
    try {
      await updateAdminApplication(editingApplication.id, appForm);
      await loadApplicationsFromAPI();
      setEditingApplication(null);
      setAppForm({ status: 'pending', remarks: '', adminNotes: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to update application status');
    } finally {
      setAppUpdateLoading(false);
    }
  };

  const handleEditApplicationClick = (app: ServiceApplication) => {
    setEditingApplication(app);
    setAppForm({
      status: app.status,
      remarks: app.remarks || '',
      adminNotes: app.adminNotes || '',
    });
  };

  const handleDownloadExcel = () => {
    if (applications.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = [
      'Tracking ID',
      'Applicant Name',
      'Mobile Number',
      'Email Address',
      'Service Type',
      'Status',
      'Submission Date',
      'Complete Address',
      'Remarks',
      'Admin Notes',
    ];

    const rows = applications.map((app) => [
      app.trackingId,
      `"${app.name.replace(/"/g, '""')}"`,
      `"${app.mobile}"`,
      `"${(app.email || '').replace(/"/g, '""')}"`,
      `"${app.service_type.replace(/"/g, '""')}"`,
      app.status.toUpperCase(),
      new Date(app.submittedAt).toLocaleString('en-IN'),
      `"${app.address.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(app.remarks || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(app.adminNotes || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
    ]);

    const csvContent = 
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `jan_seva_applications_${applicationsFilter}_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <>
        {!isAuthed ? (
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-indigo-50/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/25 transition-colors duration-200">
            <header className="shrink-0 border-b border-zinc-200/70 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
                  <AdminBrandLogo size={44} className="h-9 w-9 object-contain" priority />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Jan Seva Kendra</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Secure admin console</p>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200/90 dark:border-zinc-700/90 bg-white/95 dark:bg-zinc-900/95 p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors duration-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
              <AdminBrandLogo size={72} className="h-16 w-16 object-contain" priority />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 text-center tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-8">Sign in with your administrator credentials</p>
            <div className="space-y-4">
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
              />
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
              />
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                >
                  Continue to dashboard
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-screen w-full bg-zinc-100/90 text-zinc-900 transition-colors duration-200 ease-out dark:bg-zinc-950 dark:text-zinc-100">
            <button
              type="button"
              aria-label="Close menu"
              className={`fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-[2px] transition-opacity md:hidden ${
                mobileNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setMobileNavOpen(false)}
            />
            <aside
              className={`fixed left-0 top-0 z-50 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-zinc-200/90 bg-white shadow-2xl shadow-zinc-900/10 transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40 md:static md:z-0 md:max-w-none md:translate-x-0 md:shadow-none ${
                mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
              }`}
            >
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200/80 px-4 dark:border-zinc-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
                  <AdminBrandLogo size={36} className="h-8 w-8 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">Jan Seva Kendra</p>
                  <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">Admin console</p>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-3">
                {ADMIN_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active
                          ? 'bg-indigo-50 text-indigo-950 shadow-sm ring-1 ring-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-50 dark:ring-indigo-800/60'
                          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                            : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">{item.label}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500 dark:text-zinc-500">{item.description}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className="mt-auto shrink-0 space-y-3 border-t border-zinc-200/80 p-4 dark:border-zinc-800">
                <div className="flex justify-center">
                  <AdminThemeToggle />
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Log out
                </button>
              </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200/90 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex rounded-xl border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm hover:bg-zinc-50 md:hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    onClick={() => setMobileNavOpen(true)}
                    aria-label="Open navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700 sm:h-9 sm:w-9">
                    <AdminBrandLogo size={32} className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Jan Seva Kendra</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {currentNav?.label ?? 'Dashboard'}
                    </p>
                  </div>
                </div>
                {loading ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden />
                ) : null}
              </header>
              <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                {error ? (
                  <div
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                    role="alert"
                  >
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                    <span>{error}</span>
                  </div>
                ) : null}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h2>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      Totals across modules. Open a section by tapping a card.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void loadDashboardStats()}
                    disabled={dashboardLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {dashboardLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : null}
                    Refresh counts
                  </button>
                </div>

                {dashboardLoading && !dashboardStats ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between gap-2">
                          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                          <div className="h-6 w-6 rounded bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>
                        <div className="mt-3 h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : dashboardStats ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => setTab('vacancies')}
                      className="group text-left rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-violet-100/90 p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-violet-950/30 dark:hover:border-indigo-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-indigo-800 dark:text-indigo-200">Vacancies</p>
                        <Briefcase className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-indigo-950 dark:text-indigo-50">
                        {dashboardStats.vacancies}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('blogs')}
                      className="group text-left rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-100/90 p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-amber-900/50 dark:from-amber-950/40 dark:to-orange-950/30 dark:hover:border-amber-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Blog posts</p>
                        <BookOpen className="h-7 w-7 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-amber-950 dark:text-amber-50">
                        {dashboardStats.blogs}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('payments')}
                      className="group text-left rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-100/90 p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-teal-950/30 dark:hover:border-emerald-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">Payments</p>
                        <CreditCard className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-950 dark:text-emerald-50">
                        {dashboardStats.payments}
                      </p>
                      <p className="mt-1 text-xs text-emerald-800/90 dark:text-emerald-300/90">
                        Successful total:{' '}
                        <span className="inline-flex items-center gap-0.5 font-medium">
                          <IndianRupee className="h-3 w-3" aria-hidden />
                          {dashboardStats.paymentSuccessAmount.toLocaleString('en-IN')}
                        </span>
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('chats')}
                      className="group text-left rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-cyan-100/90 p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-sky-900/50 dark:from-sky-950/40 dark:to-cyan-950/30 dark:hover:border-sky-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-sky-900 dark:text-sky-200">Chat threads</p>
                        <MessageCircle className="h-7 w-7 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-sky-950 dark:text-sky-50">
                        {dashboardStats.chats}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('announcements')}
                      className="group text-left rounded-xl border border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50 to-pink-100/90 p-4 shadow-sm transition hover:border-fuchsia-300 hover:shadow-md dark:border-fuchsia-900/50 dark:from-fuchsia-950/40 dark:to-pink-950/30 dark:hover:border-fuchsia-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-fuchsia-900 dark:text-fuchsia-200">Announcements</p>
                        <Megaphone className="h-7 w-7 shrink-0 text-fuchsia-600 dark:text-fuchsia-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-fuchsia-950 dark:text-fuchsia-50">
                        {dashboardStats.announcements}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('visitors')}
                      className="group text-left rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-slate-100/90 p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-950/30 dark:hover:border-blue-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-200">Visitors (all time)</p>
                        <Users className="h-7 w-7 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-blue-950 dark:text-blue-50">
                        {dashboardStats.visitorsTotal}
                      </p>
                      <p className="mt-1 text-xs text-blue-800/90 dark:text-blue-300/90">
                        Live: {dashboardStats.visitorsActive} · Today: {dashboardStats.visitorsToday}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('government-links')}
                      className="group text-left rounded-xl border border-lime-200/80 bg-gradient-to-br from-lime-50 to-emerald-100/80 p-4 shadow-sm transition hover:border-lime-300 hover:shadow-md dark:border-lime-900/50 dark:from-lime-950/35 dark:to-emerald-950/30 dark:hover:border-lime-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-lime-900 dark:text-lime-200">Gov links</p>
                        <Link2 className="h-7 w-7 shrink-0 text-lime-700 dark:text-lime-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-lime-950 dark:text-lime-50">
                        {dashboardStats.governmentLinks}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('admins')}
                      className="group text-left rounded-xl border border-zinc-300/80 bg-gradient-to-br from-zinc-100 to-zinc-200/90 p-4 shadow-sm transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-600 dark:from-zinc-800/80 dark:to-zinc-900/80 dark:hover:border-zinc-500"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Administrators</p>
                        <Shield className="h-7 w-7 shrink-0 text-zinc-600 dark:text-zinc-400" aria-hidden />
                      </div>
                      <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                        {dashboardStats.admins}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('jan-seva-data')}
                      className="group text-left rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-purple-100/90 p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-violet-900/50 dark:from-violet-950/40 dark:to-purple-950/30 sm:col-span-2 lg:col-span-3 xl:col-span-4 dark:hover:border-violet-800"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-violet-900 dark:text-violet-200">Jan Seva registry</p>
                          <Database className="h-6 w-6 text-violet-600 dark:text-violet-400" aria-hidden />
                        </div>
                        <div className="flex w-full flex-wrap gap-4 sm:w-auto sm:justify-end">
                          <div className="flex items-baseline gap-2">
                            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                            <span className="text-xs text-violet-800 dark:text-violet-300">Electricity</span>
                            <span className="text-xl font-bold tabular-nums text-violet-950 dark:text-violet-50">
                              {dashboardStats.electricity}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <Globe className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden />
                            <span className="text-xs text-violet-800 dark:text-violet-300">eDistrict</span>
                            <span className="text-xl font-bold tabular-nums text-violet-950 dark:text-violet-50">
                              {dashboardStats.edistrict}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                            <span className="text-xs text-violet-800 dark:text-violet-300">Withdrawal</span>
                            <span className="text-xl font-bold tabular-nums text-violet-950 dark:text-violet-50">
                              {dashboardStats.withdrawal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                  <DashboardCharts stats={dashboardStats} />
                  </>
                ) : (
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                    Could not load overview. Use Refresh to try again.
                  </p>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-lg p-4 sm:p-6 border border-green-200 dark:border-green-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">Total Payments</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">{paymentStats.total}</p>
                      </div>
                      <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                          <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 inline" />
                          {paymentStats.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 rounded-lg p-4 sm:p-6 border border-purple-200 dark:border-purple-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">Successful</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">
                          {payments.filter((p) => p.status === 'success').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg dark:shadow-black/30 border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
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
                        <p className="text-gray-600 dark:text-zinc-400 font-medium mb-1">No payments yet</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">Payment records will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Payment ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                              {payments.map((payment) => (
                                <tr key={payment.id || payment._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors duration-200">
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-mono text-gray-900 dark:text-zinc-100">
                                      {payment.razorpayPaymentId.substring(0, 20)}...
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                                      Order: {payment.razorpayOrderId.substring(0, 15)}...
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-base font-bold text-gray-900 dark:text-zinc-100">
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
                                    <div className="text-sm text-gray-900 dark:text-zinc-100">
                                      {payment.customerName || 'N/A'}
                                    </div>
                                    {payment.customerPhone && (
                                      <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                                        {payment.customerPhone}
                                      </div>
                                    )}
                                    {payment.customerEmail && (
                                      <div className="text-xs text-gray-500 dark:text-zinc-500">
                                        {payment.customerEmail}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100">
                                      {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
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
                            <div key={payment.id || payment._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 shadow-sm dark:shadow-black/20 transition-colors duration-200">
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
                                    <div className="flex items-center gap-1 text-base font-bold text-gray-900 dark:text-zinc-100">
                                      <IndianRupee className="w-4 h-4" />
                                      {payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                  <div className="text-xs font-mono text-gray-600 dark:text-zinc-400 mb-1">
                                    {payment.razorpayPaymentId.substring(0, 24)}...
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                {payment.customerName && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-700 dark:text-zinc-300">{payment.customerName}</span>
                                  </div>
                                )}
                                {payment.customerPhone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-700 dark:text-zinc-300">{payment.customerPhone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 dark:text-zinc-300">
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
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Add / Edit Post</h3>
                <div className="space-y-3 sm:space-y-4">
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Portal Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200"
                    >
                      <option value="Vacancies">Vacancies (Latest Jobs)</option>
                      <option value="Results">Results (Exams Decycled)</option>
                      <option value="Admit Cards">Admit Cards (Hall Tickets)</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title / Designation</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. SSC CGL Online Form 2026" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Date Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Start Date</label>
                      <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="e.g. 24-05-2026" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Last Date</label>
                      <input name="lastDate" value={form.lastDate} onChange={handleChange} placeholder="e.g. 24-06-2026" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                    </div>
                  </div>

                  {/* Vacancy / Age limit Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Posts</label>
                      <input name="totalPosts" value={form.totalPosts} onChange={handleChange} placeholder="e.g. 12236 Posts" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Age Limit</label>
                      <input name="ageLimit" value={form.ageLimit} onChange={handleChange} placeholder="e.g. 18-30 Years" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                    </div>
                  </div>

                  {/* Official link & Thumbnail */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Official Apply Link</label>
                    <input name="officialLink" value={form.officialLink} onChange={handleChange} placeholder="https://ssc.gov.in/" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Thumbnail Image URL</label>
                    <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="e.g. https://... or leave blank" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Short description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Short Summary / Description</label>
                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief one-line summary..." rows={2} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qualification & Eligibility</label>
                    <textarea name="qualification" value={form.qualification} onChange={handleChange} placeholder="Post-wise required educational qualifications..." rows={2} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Required Documents */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Required Documents</label>
                    <textarea name="requiredDocuments" value={form.requiredDocuments} onChange={handleChange} placeholder="e.g. Passport Size Photo, Signature scan copy, Identity Proof..." rows={2} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Detailed Notification Details</label>
                    <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} placeholder="Full details containing tables, posts, dates, how to apply..." rows={5} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" />
                  </div>

                  {/* Hidden inputs for backward-compatibility bindings */}
                  <input type="hidden" name="tag" value={form.tag} />
                  <input type="hidden" name="vacancies" value={form.vacancies} />
                  <input type="hidden" name="date" value={form.date} />
                  <input type="hidden" name="link" value={form.link} />
                  <input type="hidden" name="info" value={form.info} />

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
                          setForm({
                            title: '',
                            tag: '',
                            info: '',
                            date: '',
                            lastDate: '',
                            vacancies: '',
                            link: '',
                            category: 'Vacancies',
                            shortDescription: '',
                            fullDescription: '',
                            startDate: '',
                            ageLimit: '',
                            totalPosts: '',
                            qualification: '',
                            requiredDocuments: '',
                            officialLink: '',
                            thumbnail: '',
                          }); 
                        }} 
                        disabled={loading}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg disabled:opacity-50 text-sm sm:text-base font-medium transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Existing Vacancies</h3>
                  {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                </div>
                {error && (
                  <div className="mb-3 p-2 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs sm:text-sm rounded border border-red-200/80 dark:border-red-900/50">
                    {error}
                  </div>
                )}
                {loading && vacancies.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-zinc-500">Loading vacancies...</p>
                ) : vacancies.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-zinc-500">No vacancies yet.</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {vacancies.map((v) => (
                      <div key={v.id || v._id} className="p-3 sm:p-4 border-2 border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-black/30 transition-all flex flex-col gap-3 sm:gap-4 bg-white dark:bg-zinc-900/50">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base md:text-lg mb-2 text-gray-900 dark:text-zinc-100 break-words">{v.title}</div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mb-2 flex flex-wrap gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded">{v.tag}</span>
                            <span>{v.vacancies ?? '-'} vacancies</span>
                            <span>{v.date ?? '-'}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 mb-2 break-words">{v.info}</div>
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
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                    <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Add / Edit Announcement</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <input 
                        name="title" 
                        value={announcementForm.title} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Title *" 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" 
                      />
                      <textarea 
                        name="description" 
                        value={announcementForm.description} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Description" 
                        rows={4} 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" 
                      />
                      <input 
                        name="link" 
                        value={announcementForm.link} 
                        onChange={handleAnnouncementChange} 
                        placeholder="Link (optional)" 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" 
                      />

                      <div className="space-y-2 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 bg-gray-50 dark:bg-zinc-800/50 transition-colors duration-200">
                        <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">Photo or video (optional)</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">
                          Stored on ImageKit (HTTPS URLs — works on production). Image up to 5MB · Video up to ~95MB per your plan. Use .mp4/.mov if type is missing. Set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_PUBLIC_KEY in server env (public key required for video).
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors duration-200">
                            <ImageIcon className="w-4 h-4 text-gray-600 dark:text-zinc-400" aria-hidden />
                            <span>Upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={loading || announcementMediaBusy}
                              onChange={handleAnnouncementFileUpload}
                            />
                          </label>
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 transition-colors duration-200">
                            <Video className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
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
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Existing Announcements</h3>
                      {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                    </div>
                    {error && (
                      <div className="mb-3 p-2 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs sm:text-sm rounded border border-red-200/80 dark:border-red-900/50">
                        {error}
                      </div>
                    )}
                    {loading && announcements.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-zinc-500">Loading announcements...</p>
                    ) : announcements.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-zinc-500">No announcements yet.</p>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {announcements.map((a) => (
                          <div key={a.id || a._id} className="p-3 sm:p-4 border-2 border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-black/30 transition-all flex flex-col gap-3 sm:gap-4 bg-white dark:bg-zinc-900/50">
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
                              <div className="font-semibold text-sm sm:text-base md:text-lg mb-2 text-gray-900 dark:text-zinc-100 break-words">{a.title}</div>
                              {a.description && (
                                <div className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 mb-2 break-words">{a.description}</div>
                              )}
                              {a.link && (
                                <a href={a.link} target="_blank" rel="noreferrer" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 break-all inline-flex items-center gap-1">
                                  <span>🔗</span> Open link
                                </a>
                              )}
                              <div className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
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
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                  <h3 className="font-semibold mb-4 text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Add Admin</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <input 
                      value={adminForm.username} 
                      onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} 
                      placeholder="Username *" 
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" 
                    />
                    <input 
                      value={adminForm.password} 
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                      placeholder="Password *" 
                      type="password" 
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40 transition-colors duration-200" 
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
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 dark:text-zinc-100">Existing Admins</h3>
                    {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  </div>
                  {error && (
                    <div className="mb-3 p-2 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs sm:text-sm rounded border border-red-200/80 dark:border-red-900/50">
                      {error}
                    </div>
                  )}
                  {loading && admins.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-zinc-500">Loading admins...</p>
                  ) : admins.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-zinc-500">No admins yet.</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {admins.map((a) => (
                        <div key={a.id || a._id} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-zinc-100 mb-1">{a.username}</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
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
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Total Visitors</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{visitorStats.total}</p>
                      </div>
                      <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-lg p-4 sm:p-6 border border-green-200 dark:border-green-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium mb-1">Active Now</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">{visitorStats.active}</p>
                      </div>
                      <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 rounded-lg p-4 sm:p-6 border border-purple-200 dark:border-purple-800 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 font-medium mb-1">Today</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">{visitorStats.today}</p>
                      </div>
                      <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Real-time Status Indicator */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 border border-gray-200 dark:border-zinc-700 p-4 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {isLive ? '🟢 Live Tracking Active' : '🔴 Connection Lost'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500">
                      Last updated: {lastUpdateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Active Visitors */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg dark:shadow-black/30 border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
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
                        <p className="text-gray-600 dark:text-zinc-400 font-medium mb-1">No active visitors</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">Active visitors will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Name/Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Device</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Browser/OS</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Page</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Location</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Last Activity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Visits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                              {activeVisitors.map((visitor) => {
                                const isNew = isNewVisitor(visitor);
                                return (
                                <tr key={visitor.sessionId} className={`hover:bg-gray-50 transition-colors ${isNew ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                                  <td className="px-4 py-3">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 dark:text-zinc-400 truncate max-w-xs">{visitor.email}</div>
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
                                        <Smartphone className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      ) : visitor.device === 'Tablet' ? (
                                        <Tablet className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      ) : (
                                        <Monitor className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      )}
                                      <span className="text-sm text-gray-900 dark:text-zinc-100">{visitor.device || 'Desktop'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100">{visitor.browser || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-500">{visitor.os || 'Unknown'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100 font-mono truncate max-w-xs">{visitor.page || '/'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100">
                                      {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-500 font-mono">{visitor.ipAddress}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {visitor.lastActivity ? (
                                      <>
                                        <div className="text-sm text-gray-900 dark:text-zinc-100">
                                          {new Date(visitor.lastActivity).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-zinc-500">
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
                                    <Smartphone className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  ) : visitor.device === 'Tablet' ? (
                                    <Tablet className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 dark:text-zinc-400 truncate">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{visitor.device || 'Desktop'}</div>
                                    )}
                                    <div className="text-xs text-gray-500 dark:text-zinc-500">{visitor.browser || 'Unknown'} • {visitor.os || 'Unknown'}</div>
                                  </div>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0 ml-2">
                                  Active
                                </span>
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 dark:text-zinc-300 font-mono truncate">{visitor.page || '/'}</span>
                                </div>
                                {visitor.city || visitor.country ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">📍</span>
                                    <span className="text-xs text-gray-700 dark:text-zinc-300">
                                      {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown'}
                                    </span>
                                  </div>
                                ) : null}
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 dark:text-zinc-300">
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
                                  <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">{visitor.visitCount || 1}</span>
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
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg dark:shadow-black/30 border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
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
                        <p className="text-gray-600 dark:text-zinc-400 font-medium mb-1">No visitors yet</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">Visitor records will appear here</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Name/Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Device</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Browser/OS</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Page</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">First Visit</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">Visits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                              {visitors.slice(0, 50).map((visitor) => (
                                <tr key={visitor.sessionId} className="hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors duration-200">
                                  <td className="px-4 py-3">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 dark:text-zinc-400 truncate max-w-xs">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-400 italic">Not provided</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {visitor.device === 'Mobile' ? (
                                        <Smartphone className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      ) : visitor.device === 'Tablet' ? (
                                        <Tablet className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      ) : (
                                        <Monitor className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                                      )}
                                      <span className="text-sm text-gray-900 dark:text-zinc-100">{visitor.device || 'Desktop'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100">{visitor.browser || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-500">{visitor.os || 'Unknown'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900 dark:text-zinc-100 font-mono truncate max-w-xs">{visitor.page || '/'}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {visitor.firstVisit ? (
                                      <>
                                        <div className="text-sm text-gray-900 dark:text-zinc-100">
                                          {new Date(visitor.firstVisit).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-zinc-500">
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
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:text-zinc-300">
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
                            <div key={visitor.sessionId} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 shadow-sm dark:shadow-black/20 transition-colors duration-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {visitor.device === 'Mobile' ? (
                                    <Smartphone className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  ) : visitor.device === 'Tablet' ? (
                                    <Tablet className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    {visitor.name || visitor.email ? (
                                      <div>
                                        {visitor.name && (
                                          <div className="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{visitor.name}</div>
                                        )}
                                        {visitor.email && (
                                          <div className="text-xs text-gray-600 dark:text-zinc-400 truncate">{visitor.email}</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{visitor.device || 'Desktop'}</div>
                                    )}
                                    <div className="text-xs text-gray-500 dark:text-zinc-500">{visitor.browser || 'Unknown'} • {visitor.os || 'Unknown'}</div>
                                  </div>
                                </div>
                                {visitor.isActive ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0 ml-2">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:text-zinc-300 flex-shrink-0 ml-2">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 dark:text-zinc-300 font-mono truncate">{visitor.page || '/'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700 dark:text-zinc-300">
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
                                  <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">{visitor.visitCount || 1}</span>
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
                  <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 transition-colors duration-200">
                    {chats.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="bg-gray-100 rounded-full p-6 mb-4">
                          <MessageCircle className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">No chats yet</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">Customer chats will appear here</p>
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
                                    <div className="font-bold text-sm text-gray-900 dark:text-zinc-100 truncate">
                                      {chat.userPhone}
                                    </div>
                                    {isRecent && !isSelected && (
                                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    )}
                                  </div>
                                  
                                  {lastMessage && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-400 mt-1 mb-1">
                                      {lastMessage.type === 'text' ? (
                                        <span className="truncate">{lastMessage.content}</span>
                                      ) : lastMessage.type === 'image' ? (
                                        <span className="flex items-center gap-1 text-blue-600">
                                          <ImageIcon className="w-3 h-3" aria-hidden />
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
                                  
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
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
                <div className={`lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg dark:shadow-black/30 overflow-hidden flex flex-col border-2 border-gray-200 dark:border-zinc-700 transition-colors duration-200 ${selectedChat ? 'flex' : 'hidden lg:flex'}`} style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                                        isAdmin ? 'text-gray-500 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-500'
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
                          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-zinc-500">
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
                            className="p-2.5 text-gray-600 dark:text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
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
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-zinc-100 transition-all"
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
                        <p className="text-base font-semibold text-gray-700 dark:text-zinc-300 mb-1">Select a chat</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">Choose a customer chat from the list to view messages</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Government Links Tab */}
            {activeTab === 'government-links' && (
              <div className="space-y-4 sm:space-y-6">
                <CardContainer
                  title={editingLinkId ? 'Edit Government Link' : 'Add New Government Link'}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Name *"
                      name="linkName"
                      value={linkForm.name}
                      onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                      placeholder="e.g., Aadhaar Official"
                    />
                    <InputField
                      label="URL *"
                      name="linkUrl"
                      type="url"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                    <InputField
                      label="Icon (Emoji)"
                      name="linkIcon"
                      value={linkForm.icon}
                      onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                      placeholder="🔗"
                    />
                    <InputField
                      label="Category"
                      name="linkCategory"
                      value={linkForm.category}
                      onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value })}
                      placeholder="General"
                    />
                    <TextAreaField
                      label="Description"
                      name="linkDescription"
                      containerClassName="sm:col-span-2"
                      value={linkForm.description}
                      onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                      placeholder="Optional description"
                      rows={2}
                    />
                    <InputField
                      label="Order (for sorting)"
                      name="linkOrder"
                      type="number"
                      value={linkForm.order}
                      onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleSubmitLink}
                      disabled={loading}
                      className={adminPrimaryButtonClass}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : null}
                      <span>
                        {editingLinkId ? 'Update' : 'Add'} Link
                      </span>
                    </button>
                    {editingLinkId ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLinkId(null);
                          setLinkForm({ name: '', url: '', icon: '🔗', description: '', category: 'General', order: 0 });
                        }}
                        className={adminSecondaryButtonClass}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </CardContainer>

                <CardContainer className="overflow-hidden p-0">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-lg sm:text-xl font-bold">
                      Government Links ({governmentLinks.length})
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    {governmentLinks.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-zinc-400">No government links added yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {governmentLinks.map((link) => (
                          <div
                            key={link.id || link._id}
                            className="border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-950/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-2xl shrink-0">{link.icon || '🔗'}</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm truncate">
                                    {link.name}
                                  </h4>
                                  {link.category ? (
                                    <span className="inline-block mt-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                                      {link.category}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block mb-2 transition-colors"
                            >
                              {link.url}
                            </a>
                            {link.description ? (
                              <p className="text-xs text-gray-600 dark:text-zinc-400 mb-3 line-clamp-2">
                                {link.description}
                              </p>
                            ) : null}
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                              <button
                                type="button"
                                onClick={() => handleEditLink(link)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLink(link.id || link._id || '')}
                                className="inline-flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContainer>
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blogs' && (
              <div className="space-y-4 sm:space-y-6">
                <CardContainer
                  title={editingBlogSlug ? 'Edit Blog Post' : 'Create New Blog Post'}
                  icon={<BookOpen className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />}
                >
                  <div className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Title *"
                        name="blogTitle"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="Blog Title"
                      />
                      <InputField
                        label="Slug * (URL-friendly)"
                        name="blogSlug"
                        value={blogForm.slug}
                        onChange={(e) =>
                          setBlogForm({
                            ...blogForm,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                          })
                        }
                        placeholder="blog-post-slug"
                      />
                    </div>
                    <div>
                      <TextAreaField
                        label="Excerpt * (Short description, max 300 chars)"
                        name="blogExcerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Short description of the blog post..."
                        rows={3}
                        maxLength={300}
                      />
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{blogForm.excerpt.length}/300</p>
                    </div>
                    <TextAreaField
                      label="Content * (HTML supported)"
                      name="blogContent"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      placeholder="<p>Your blog content here...</p>"
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="blogCategory" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Category *
                        </label>
                        <select
                          id="blogCategory"
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className={adminSelectClass}
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
                        <label htmlFor="blogFeaturedFile" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Featured Image
                        </label>
                        <input
                          id="blogFeaturedFile"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                setError('Please select an image file');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                setError('Image size must be less than 5MB');
                                return;
                              }
                              setBlogImageFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBlogImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className={adminFileInputClass}
                        />
                        {blogImagePreview ? (
                          <div className="mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blogImagePreview}
                              alt="Preview"
                              className="max-w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-zinc-700"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBlogImageFile(null);
                                setBlogImagePreview('');
                                setBlogForm({ ...blogForm, featuredImage: '' });
                              }}
                              className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                              Remove image
                            </button>
                          </div>
                        ) : null}
                        {blogForm.featuredImage && !blogImagePreview ? (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Current image:</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blogForm.featuredImage}
                              alt="Current"
                              className="max-w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-zinc-700"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Tags (comma-separated)"
                        name="blogTags"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        placeholder="Aadhaar, PAN Card, Documents"
                      />
                      <InputField
                        label="Author"
                        name="blogAuthor"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        placeholder="Jan Seva Kendra"
                      />
                    </div>
                    <InputField
                      label="Meta Title (SEO)"
                      name="blogMetaTitle"
                      value={blogForm.metaTitle}
                      onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                      placeholder="Leave empty to use title"
                    />
                    <div>
                      <TextAreaField
                        label="Meta Description (SEO, max 160 chars)"
                        name="blogMetaDesc"
                        value={blogForm.metaDescription}
                        onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })}
                        placeholder="Leave empty to use excerpt"
                        rows={2}
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{blogForm.metaDescription.length}/160</p>
                    </div>
                    <InputField
                      label="Keywords (SEO, comma-separated)"
                      name="blogKeywords"
                      value={blogForm.keywords}
                      onChange={(e) => setBlogForm({ ...blogForm, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950/50 px-4 py-3">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={blogForm.isPublished}
                        onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                        className="w-4 h-4 shrink-0 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-zinc-900"
                      />
                      <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer">
                        Publish immediately
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSubmitBlog}
                        disabled={loading}
                        className={adminPrimaryButtonClass}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        {editingBlogSlug ? 'Update Blog' : 'Create Blog'}
                      </button>
                      {editingBlogSlug ? (
                        <button
                          type="button"
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
                          className={adminSecondaryButtonClass}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                </CardContainer>

                <CardContainer title={`All Blog Posts (${blogs.length})`}>
                  {blogs.length === 0 ? (
                    <p className="text-gray-500 dark:text-zinc-500 text-center py-8">
                      No blog posts yet. Create your first blog post above!
                    </p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {blogs.map((blog) => (
                        <div
                          key={blog.id || blog._id}
                          className="border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-950/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900 dark:text-zinc-100">{blog.title}</h3>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    blog.isPublished
                                      ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200'
                                  }`}
                                >
                                  {blog.isPublished ? 'Published' : 'Draft'}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 rounded text-xs font-semibold">
                                  {blog.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2 line-clamp-2">{blog.excerpt}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-zinc-500">
                                <span>Slug: /blog/{blog.slug}</span>
                                {blog.views ? <span>Views: {blog.views}</span> : null}
                                {blog.readingTime ? <span>Reading: {blog.readingTime} min</span> : null}
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <a
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleEditBlog(blog.slug)}
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBlog(blog.slug)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
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
                </CardContainer>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      Service Applications (सेवा आवेदन फॉर्म)
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      Manage, filter, search, and export customer service request submissions.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void loadApplicationsFromAPI()}
                      disabled={applicationsLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {applicationsLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : null}
                      Refresh List
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadExcel}
                      disabled={applications.length === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-750 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Excel / CSV Download ({applicationsFilter.toUpperCase()})
                    </button>
                  </div>
                </div>

                {/* Segmented Application Type Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 scrollbar-none overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setApplicationsTypeFilter('all')}
                    className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                      applicationsTypeFilter === 'all'
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    All Submissions (सभी फॉर्म)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicationsTypeFilter('callbacks')}
                    className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 relative whitespace-nowrap ${
                      applicationsTypeFilter === 'callbacks'
                        ? 'border-amber-500 text-amber-500 dark:border-amber-450 dark:text-amber-450'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Phone className="w-4 h-4 text-amber-500" />
                    📞 Callback Requests (कॉल-बैक अनुरोध)
                    {applications.some((a) => (a.service_type.includes('Callback') || a.name.startsWith('Callback Client:')) && a.status === 'pending') && (
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicationsTypeFilter('services')}
                    className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                      applicationsTypeFilter === 'services'
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    📋 Service Forms (सेवा फॉर्म)
                  </button>
                </div>

                {/* Filters Widget Panel */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Time Duration</label>
                      <select
                        value={applicationsFilter}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setApplicationsFilter(val);
                        }}
                        className="rounded-lg border border-zinc-250 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                      >
                        <option value="all">All Time (जब से चालू है)</option>
                        <option value="weekly">Weekly (पिछले 7 दिन)</option>
                        <option value="monthly">Monthly (पिछले 30 दिन)</option>
                        <option value="yearly">Yearly (पिछले 1 साल)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Status Filter</label>
                      <select
                        value={applicationsStatusFilter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setApplicationsStatusFilter(val);
                        }}
                        className="rounded-lg border border-zinc-250 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-255"
                      >
                        <option value="all">All Statuses (सभी)</option>
                        <option value="pending">Pending (लंबित)</option>
                        <option value="in_progress">In Progress (प्रक्रिया में)</option>
                        <option value="completed">Completed (पूर्ण)</option>
                        <option value="rejected">Rejected (अस्वीकृत)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-right text-xs font-semibold text-zinc-450">
                    Total Loaded Records: <b className="text-indigo-600 dark:text-indigo-400 font-bold font-mono text-sm">{applications.length}</b>
                  </div>
                </div>

                {/* Submissions List Container */}
                {applicationsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-105 dark:border-zinc-800 pb-3">
                          <div className="space-y-2 w-1/2">
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                          </div>
                          <div className="h-5 bg-zinc-250 dark:bg-zinc-800 rounded-full w-20"></div>
                        </div>
                        <div className="space-y-2.5 pt-1">
                          <div className="flex justify-between"><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div></div>
                          <div className="flex justify-between"><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div></div>
                          <div className="flex justify-between"><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div></div>
                        </div>
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3 ml-auto mt-4"></div>
                      </div>
                    ))}
                  </div>
                ) : applications.filter((app) => {
                  const isCallback = app.service_type.includes('Callback') || app.name.startsWith('Callback Client:');
                  if (applicationsTypeFilter === 'callbacks') return isCallback;
                  if (applicationsTypeFilter === 'services') return !isCallback;
                  return true;
                }).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-250 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
                    <FileText className="mx-auto h-12 w-12 text-zinc-350 dark:text-zinc-700" />
                    <h3 className="mt-4 text-sm font-bold text-zinc-900 dark:text-zinc-200">No records found</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      No request submissions matched the current filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications
                      .filter((app) => {
                        const isCallback = app.service_type.includes('Callback') || app.name.startsWith('Callback Client:');
                        if (applicationsTypeFilter === 'callbacks') return isCallback;
                        if (applicationsTypeFilter === 'services') return !isCallback;
                        return true;
                      })
                      .map((app) => {
                        const isCallback = app.service_type.includes('Callback') || app.name.startsWith('Callback Client:');
                        return (
                          <div 
                            key={app.id} 
                            className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                              isCallback && app.status === 'pending'
                                ? 'border-amber-300 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/5'
                                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                            }`}
                          >
                            <div>
                              {/* Card Header */}
                              <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-3">
                                <div>
                                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 mt-0.5">{app.name}</h4>
                                  <span className="text-[10px] font-mono font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">ID: {app.trackingId}</span>
                                  {isCallback && app.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1.5 rounded bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 font-extrabold text-[10px] uppercase tracking-wide animate-pulse">
                                      ⚡ URGENT CALLBACK / तुरंत कॉल करें!
                                    </span>
                                  )}
                                </div>
                                <span 
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    app.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/50'
                                      : app.status === 'in_progress'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/50'
                                      : app.status === 'rejected'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/50'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-900/50'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    app.status === 'completed' ? 'bg-emerald-500' : app.status === 'in_progress' ? 'bg-indigo-500' : app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                  }`} />
                                  {app.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>

                              {/* Details List */}
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-zinc-455 font-semibold">Service Requested:</span>
                                  <span className="font-bold text-zinc-805 dark:text-zinc-200">{app.service_type}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-zinc-455 font-semibold">Mobile Number:</span>
                                  <div className="flex items-center gap-2">
                                    <a href={`tel:${app.mobile}`} className="font-bold font-mono text-indigo-600 dark:text-indigo-400 hover:underline">
                                      {app.mobile}
                                    </a>
                                    <a 
                                      href={`https://wa.me/91${app.mobile}?text=Hello%20${app.name},%20we%20received%20your%252520callback%252520request%25252520at%25252520Jan%25252520Seva%25252520Kendra.`}
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 font-semibold"
                                    >
                                      (WhatsApp)
                                    </a>
                                  </div>
                                </div>
                                {app.email && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-zinc-455 font-semibold">Email Address:</span>
                                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{app.email}</span>
                                  </div>
                                )}
                                <div className="flex items-start justify-between gap-4">
                                  <span className="text-zinc-455 font-semibold shrink-0">Address:</span>
                                  <span className="text-zinc-700 dark:text-zinc-300 text-right leading-relaxed">{app.address}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2 mt-2">
                                  <span className="text-zinc-455 font-semibold">Submitted On:</span>
                                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
                                    {new Date(app.submittedAt).toLocaleString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                
                                {/* Remarks & Private Notes */}
                                {app.remarks && (
                                  <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100 dark:bg-zinc-800/40 dark:border-zinc-800 mt-2">
                                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">Remarks (Public)</span>
                                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed">{app.remarks}</p>
                                  </div>
                                )}
                                {app.adminNotes && (
                                  <div className="rounded-lg bg-indigo-50/40 p-2.5 border border-indigo-100/50 dark:bg-indigo-950/20 dark:border-indigo-900/30 mt-2">
                                    <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-wider block">Admin Notes (Private)</span>
                                    <p className="text-indigo-950 dark:text-indigo-200 mt-0.5 leading-relaxed">{app.adminNotes}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Action */}
                            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                              {isCallback && app.status === 'pending' ? (
                                <a
                                  href={`tel:${app.mobile}`}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-755 active:scale-95"
                                >
                                  <Phone className="w-3.5 h-3.5 fill-current" />
                                  Call Now (अभी कॉल करें)
                                </a>
                              ) : <div />}
                              <button
                                type="button"
                                onClick={() => handleEditApplicationClick(app)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Edit Status & Remarks
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jan-seva-data' && <JanSevaDataModule />}

            {activeTab === 'seo-sitemap' && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      Sitemap & SEO Optimization
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      Manage site structure, preview search results, and optimize indexation in Google Search.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void loadSitemapFromAPI()}
                    disabled={sitemapLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {sitemapLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : null}
                    Refresh Sitemap
                  </button>
                </div>

                {sitemapLoading && !sitemapData ? (
                  <div className="space-y-6">
                    {/* Quick Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900">
                          <div className="flex items-center justify-between gap-2">
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                            <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                          </div>
                          <div className="mt-3 h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                    {/* Columns Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                        <div className="space-y-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center"><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-8"></div></div>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm animate-pulse dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                        <div className="h-28 bg-zinc-150 dark:bg-zinc-800/30 rounded-xl"></div>
                        <div className="h-32 bg-zinc-150 dark:bg-zinc-800/30 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                ) : sitemapData ? (
                  <div className="space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/60 to-blue-100/40 p-4 shadow-sm dark:border-blue-950/40 dark:from-blue-950/20 dark:to-slate-900/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Total Sitemap URLs</p>
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="mt-2 text-3xl font-bold tabular-nums text-blue-950 dark:text-blue-50">
                          {sitemapData.stats.total}
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 to-emerald-100/40 p-4 shadow-sm dark:border-emerald-950/40 dark:from-emerald-950/20 dark:to-slate-900/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Static Pages</p>
                          <Monitor className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-950 dark:text-emerald-50">
                          {sitemapData.stats.staticCount}
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-amber-100/40 p-4 shadow-sm dark:border-amber-950/40 dark:from-amber-950/20 dark:to-slate-900/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Dynamic Blogs</p>
                          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="mt-2 text-3xl font-bold tabular-nums text-amber-950 dark:text-amber-50">
                          {sitemapData.stats.blogCount}
                        </p>
                      </div>

                      <div className="rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/60 to-purple-100/40 p-4 shadow-sm dark:border-purple-950/40 dark:from-purple-950/20 dark:to-slate-900/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Google Status</p>
                          <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="mt-2 text-lg font-bold text-purple-950 dark:text-purple-100">
                          Live & Indexed
                        </p>
                        <p className="text-[10px] text-purple-800 dark:text-purple-300 mt-1">robots.txt config allows all</p>
                      </div>
                    </div>

                    {/* Google Search Console Direct Actions Card */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors duration-200">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Google Search Console Submission & Verification
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Google will index your pages much faster if you submit your sitemap file URL directly in the Google Search Console panel.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg select-all font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">
                              <span>https://www.jan-seva.site/sitemap.xml</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('https://www.jan-seva.site/sitemap.xml')}
                              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-sm transition"
                            >
                              Copy Link
                            </button>
                          </div>
                          <div className="pt-1">
                            <a
                              href="https://search.google.com/search-console?resource_id=sc-domain:jan-seva.site"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                            >
                              Open Google Search Console →
                            </a>
                          </div>
                        </div>

                        <div className="space-y-3 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 md:pl-6 pt-4 md:pt-0">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Your domain search console property is verified on Google using the following Meta Verification Key (configured in root layout):
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg select-all font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">
                              <span>2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('2rT4H0NwQhMpGMYTHC_rnHNs7Cpatm4pSUhvhtfaRPw')}
                              className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm transition"
                            >
                              Copy Key
                            </button>
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Status: <span className="text-emerald-600 font-semibold">Active & verified in layout.tsx</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Custom Sitemap Links Creator & Manager */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors duration-200">
                      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Custom Sitemap URL Submitter (कस्टम यूआरएल जोड़ें)
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Submit new custom sub-pages, external landing pages, or local campaigns directly to your indexable Google Sitemap.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Form to submit/fill */}
                        <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-400 mb-4">
                            {editingCustomSitemapLink ? '📝 Edit Custom Link' : '➕ Add Custom Link'}
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                URL Path / लिंक पाथ <span className="text-red-500">*</span>
                              </label>
                              <div className="flex rounded-lg shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-150 text-zinc-500 text-xs dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-400">
                                  /
                                </span>
                                <input
                                  type="text"
                                  placeholder="services/custom-landing"
                                  value={customSitemapForm.url.startsWith('/') ? customSitemapForm.url.substring(1) : customSitemapForm.url}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomSitemapForm({ ...customSitemapForm, url: val.startsWith('/') ? val : '/' + val });
                                  }}
                                  className="flex-1 block w-full min-w-0 rounded-none rounded-r-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-950 focus:outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                />
                              </div>
                              <p className="text-[10px] text-zinc-400 mt-1">E.g., services/custom-campaign or contact</p>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                SEO Meta Title / एसईओ टाइटल <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Best Service in Bharthana | Etawah"
                                value={customSitemapForm.title}
                                onChange={(e) => setCustomSitemapForm({ ...customSitemapForm, title: e.target.value })}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-950 focus:outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                SEO Meta Description / एसईओ विवरण
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Enter page search snippet description for google indexer..."
                                value={customSitemapForm.description}
                                onChange={(e) => setCustomSitemapForm({ ...customSitemapForm, description: e.target.value })}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-950 focus:outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                  Frequency / क्रॉल आवृत्ति
                                </label>
                                <select
                                  value={customSitemapForm.changeFrequency}
                                  onChange={(e) => setCustomSitemapForm({ ...customSitemapForm, changeFrequency: e.target.value })}
                                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-950 focus:outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                >
                                  <option value="always">Always</option>
                                  <option value="hourly">Hourly</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                                  <option value="never">Never</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                  Priority Weight
                                </label>
                                <select
                                  value={customSitemapForm.priority}
                                  onChange={(e) => setCustomSitemapForm({ ...customSitemapForm, priority: Number(e.target.value) })}
                                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-950 focus:outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                >
                                  <option value="1.0">1.0 (Critical)</option>
                                  <option value="0.8">0.8 (High)</option>
                                  <option value="0.5">0.5 (Medium)</option>
                                  <option value="0.3">0.3 (Low)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                id="is_active_sitemap"
                                checked={customSitemapForm.isActive}
                                onChange={(e) => setCustomSitemapForm({ ...customSitemapForm, isActive: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                              />
                              <label htmlFor="is_active_sitemap" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                                Active & Visible in Sitemap.xml
                              </label>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                              <button
                                type="button"
                                onClick={() => void handleSubmitCustomSitemapLink()}
                                disabled={customSitemapLoading}
                                className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-blue-500 disabled:opacity-50"
                              >
                                {customSitemapLoading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : editingCustomSitemapLink ? (
                                  'Save Changes'
                                ) : (
                                  'Submit Link'
                                )}
                              </button>
                              {editingCustomSitemapLink && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomSitemapLink(null);
                                    setCustomSitemapForm({
                                      url: '',
                                      title: '',
                                      description: '',
                                      changeFrequency: 'weekly',
                                      priority: 0.5,
                                      isActive: true,
                                    });
                                  }}
                                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* List of dynamic links */}
                        <div className="lg:col-span-7 flex flex-col border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
                          <div className="border-b border-zinc-200/80 px-4 py-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                              Active Submitted Sitemap Links ({customSitemapLinks.length})
                            </h4>
                          </div>

                          {customSitemapLoading && customSitemapLinks.length === 0 ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            </div>
                          ) : customSitemapLinks.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-zinc-400">
                              <Globe className="w-8 h-8 text-zinc-300 mb-2" />
                              No custom dynamic sitemap links added yet. Add your first link in the left panel!
                            </div>
                          ) : (
                            <div className="overflow-y-auto max-h-[350px] divide-y divide-zinc-200 dark:divide-zinc-800">
                              {customSitemapLinks.map((link) => (
                                <div key={link.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                        {link.url}
                                      </span>
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                        link.isActive
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-850 dark:text-zinc-400'
                                      }`}>
                                        {link.isActive ? 'Active' : 'Draft'}
                                      </span>
                                    </div>
                                    <h5 className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1 truncate">{link.title}</h5>
                                    {link.description && (
                                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-1">{link.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 text-[9px] text-zinc-400 mt-2">
                                      <span>Freq: <b className="capitalize">{link.changeFrequency}</b></span>
                                      <span>Priority: <b>{link.priority}</b></span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleEditCustomSitemapLink(link)}
                                      className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-400 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleDeleteCustomSitemapLink(link.id || '')}
                                      className="p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main Sitemap Explorer Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Left: Sitemap List */}
                      <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col">
                        <div className="border-b border-zinc-200/80 px-4 py-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">Site URLs List</h3>
                        </div>
                        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <input
                              type="text"
                              value={sitemapSearch}
                              onChange={(e) => setSitemapSearch(e.target.value)}
                              placeholder="Search URLs..."
                              className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-[500px] divide-y divide-zinc-100 dark:divide-zinc-800">
                          {sitemapData.urls
                            .filter(u => u.url.toLowerCase().includes(sitemapSearch.toLowerCase()))
                            .map((item, idx) => {
                              const path = item.url.replace('https://www.jan-seva.site', '') || '/';
                              const meta = getUrlMetadata(item.url);
                              const isSelected = selectedSitemapUrl?.url === item.url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedSitemapUrl(item)}
                                  className={`w-full p-3 text-left transition flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-600'
                                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                        {path}
                                      </span>
                                    </div>
                                    <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                      {meta.title}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                                      item.priority >= 0.9
                                        ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                                        : item.priority >= 0.7
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-400'
                                    }`}
                                  >
                                    P: {item.priority}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Right: SEO Preview Panel */}
                      <div className="lg:col-span-2 space-y-6">
                        {selectedSitemapUrl ? (
                          <>
                            {/* Google Search Mockup Card */}
                            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors duration-200">
                              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                                Google Search Engine Preview (Mockup)
                              </h3>
                              {(() => {
                                const meta = getUrlMetadata(selectedSitemapUrl.url);
                                return (
                                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50 dark:bg-zinc-950/40">
                                    <div className="font-sans max-w-2xl select-none">
                                      {/* Google breadcrumb */}
                                      <div className="text-xs text-[#202124] dark:text-[#bdc1c6] truncate flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
                                          <AdminBrandLogo size={12} className="h-3 w-3 object-contain" />
                                        </div>
                                        <div className="truncate text-xs leading-5">
                                          {meta.displayUrl}
                                        </div>
                                      </div>
                                      {/* Google title */}
                                      <h4 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer tracking-normal leading-tight mt-1 mb-1">
                                        {meta.title}
                                      </h4>
                                      {/* Google snippet description */}
                                      <p className="text-sm text-[#4d5156] dark:text-[#bebebe] leading-relaxed line-clamp-3">
                                        {meta.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* SEO Optimization Analysis */}
                            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors duration-200">
                              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                                SEO Metadata Breakdown
                              </h3>
                              {(() => {
                                const meta = getUrlMetadata(selectedSitemapUrl.url);
                                const titleLen = meta.title.length;
                                const descLen = meta.description.length;
                                
                                return (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Title Length</span>
                                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                            titleLen >= 50 && titleLen <= 70
                                              ? 'bg-green-100 text-green-800 dark:bg-green-950/50'
                                              : titleLen > 70
                                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50'
                                              : 'bg-red-100 text-red-800 dark:bg-red-950/50'
                                          }`}>
                                            {titleLen} Chars
                                          </span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 truncate">
                                          {meta.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2">
                                          {titleLen >= 50 && titleLen <= 70
                                            ? '✓ Optimal title length for Google (50-70 characters).'
                                            : titleLen > 70
                                            ? '⚠ Title is long; Google search results may truncate it with ...'
                                            : '⚠ Title is too short; add more relevant keywords to increase click-through rate.'}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description Length</span>
                                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                            descLen >= 120 && descLen <= 160
                                              ? 'bg-green-100 text-green-800 dark:bg-green-950/50'
                                              : descLen > 160
                                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50'
                                              : 'bg-red-100 text-red-800 dark:bg-red-950/50'
                                          }`}>
                                            {descLen} Chars
                                          </span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 line-clamp-1">
                                          {meta.description}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2">
                                          {descLen >= 120 && descLen <= 160
                                            ? '✓ Optimal description length for Google (120-160 characters).'
                                            : descLen > 160
                                            ? '⚠ Description is long (Google will truncate to ~160 chars), but it contains rich local keywords.'
                                            : '⚠ Description is short; expand details to entice clicks.'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Crawler details table */}
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                                          <tr>
                                            <th className="p-3">Attribute</th>
                                            <th className="p-3">Configuration</th>
                                            <th className="p-3">Crawlers Priority</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                          <tr>
                                            <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Category</td>
                                            <td className="p-3 text-zinc-600 dark:text-zinc-400">{meta.category}</td>
                                            <td className="p-3 text-zinc-400">—</td>
                                          </tr>
                                          <tr>
                                            <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Change Frequency</td>
                                            <td className="p-3 capitalize text-zinc-600 dark:text-zinc-400">{selectedSitemapUrl.changeFrequency}</td>
                                            <td className="p-3 text-zinc-500 font-medium">Medium</td>
                                          </tr>
                                          <tr>
                                            <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Priority Weight</td>
                                            <td className="p-3 text-zinc-600 dark:text-zinc-400">{selectedSitemapUrl.priority} / 1.0</td>
                                            <td className="p-3 text-indigo-600 dark:text-indigo-400 font-semibold">High</td>
                                          </tr>
                                          <tr>
                                            <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Last Modified</td>
                                            <td className="p-3 text-zinc-600 dark:text-zinc-400">
                                              {new Date(selectedSitemapUrl.lastModified).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                              })}
                                            </td>
                                            <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Updated</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </>
                        ) : (
                          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                            Select a URL from the left list to analyze its search engine structure.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                    Could not fetch sitemap. Click refresh above to retry.
                  </p>
                )}
              </div>
            )}

            {/* Service Application status edit modal */}
            {editingApplication && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
                <div 
                  className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-55">
                        Update Request Status
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5 font-semibold">
                        Tracking ID: {editingApplication.trackingId} | Applicant: {editingApplication.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingApplication(null)}
                      className="rounded-lg p-1.5 text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateApplicationStatus} className="space-y-4">
                    {/* Status Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350">
                        Application Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={appForm.status}
                        onChange={(e) => setAppForm({ ...appForm, status: e.target.value })}
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                      >
                        <option value="pending">Pending (लंबित)</option>
                        <option value="in_progress">In Progress (प्रक्रिया में)</option>
                        <option value="completed">Completed (पूर्ण)</option>
                        <option value="rejected">Rejected (अस्वीकृत)</option>
                      </select>
                    </div>

                    {/* Remarks (Public) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-350 flex items-center justify-between">
                        <span>Remarks (सार्वजनिक टिप्पणी)</span>
                        <span className="text-[10px] text-zinc-405 font-semibold">(Visible to applicant)</span>
                      </label>
                      <textarea
                        value={appForm.remarks}
                        onChange={(e) => setAppForm({ ...appForm, remarks: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 placeholder-zinc-400"
                        placeholder="जैसे: आपका फॉर्म भर दिया गया है, संपर्क करें। Or: Uploading document..."
                      />
                    </div>

                    {/* Admin Notes (Private) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-355 flex items-center justify-between">
                        <span>Admin Private Notes (प्राइवेट नोट)</span>
                        <span className="text-[10px] text-indigo-400 font-semibold">(Only you can see this)</span>
                      </label>
                      <textarea
                        value={appForm.adminNotes}
                        onChange={(e) => setAppForm({ ...appForm, adminNotes: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 placeholder-zinc-400"
                        placeholder="Internal notes about the application..."
                      />
                    </div>

                    {/* Buttons Row */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-zinc-150 dark:border-zinc-850 mt-4">
                      <button
                        type="button"
                        onClick={() => setEditingApplication(null)}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={appUpdateLoading}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {appUpdateLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Save Status
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'theme-settings' && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-black/20 p-4 sm:p-5 md:p-6 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" /> Global Website Theme
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                  Select a primary color for the entire website. This will instantly change buttons, links, and accents globally.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {['blue', 'green', 'red', 'purple', 'orange', 'rose'].map((color) => (
                    <button
                      key={color}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/theme', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ primaryColorName: color })
                          });
                          if (res.ok) {
                            alert('Theme updated successfully! Reloading...');
                            window.location.reload();
                          }
                        } catch (err) {
                          alert('Failed to update theme');
                        }
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full shadow-sm" style={{ backgroundColor: color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'red' ? '#ef4444' : color === 'purple' ? '#a855f7' : color === 'orange' ? '#f97316' : '#f43f5e' }}></div>
                      <span className="text-xs font-semibold capitalize text-gray-700 dark:text-zinc-300">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
              </main>
            </div>
          </div>
        )}
    </>
  );
}



