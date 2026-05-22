import { ANNOUNCEMENT_VIDEO_MAX } from '@/lib/announcementUploadConstants';

// API functions for Next.js - using relative API routes
const API_BASE_URL = '';
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

export interface ContactFormData {
  name: string;
  mobile: string;
  address: string;
  service_type: string;
  email?: string;
}

export interface ContactUsData {
  name: string;
  email: string;
  message: string;
}

export async function submitServiceApplication(formData: ContactFormData) {
  console.log('📡 API Call: POST /api/apply-service');
  console.log('📡 Request Data:', JSON.stringify(formData, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/api/apply-service`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  console.log('📡 Response Status:', response.status, response.statusText);
  
  const data = await response.json().catch((err) => {
    console.error('❌ Failed to parse response JSON:', err);
    return { error: 'Failed to parse server response' };
  });

  console.log('📡 Response Data:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    const errorMessage = data.error || data.message || 'Failed to submit service application';
    console.error('❌ API Error Response:', data);
    throw new Error(errorMessage);
  }

  // Check if email was sent successfully
  if (data.success === false || (data.emailStatus && data.emailStatus.includes('0/'))) {
    console.warn('⚠️ Email sending failed:', data);
    // Don't throw error, just log warning - form was submitted
  } else {
    console.log('✅ Service application submitted and email sent:', data.emailStatus || 'Success');
  }

  return data;
}

export async function submitContactForm(formData: ContactUsData) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }

  return response.json();
}

// Vacancies API
export interface Vacancy {
  _id?: string;
  id?: string;
  title: string;
  tag: string;
  info?: string;
  date?: string;
  lastDate?: string;
  vacancies?: number;
  link?: string;
}

export async function getVacancies(): Promise<Vacancy[]> {
  try {
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/vacancies`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache in production
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMessage = 'Failed to fetch vacancies';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.warn('API Error (non-critical):', errorData);
      } catch (e) {
        console.warn('API Error (non-critical):', response.statusText);
      }
      
      // Always return empty array instead of throwing - graceful degradation
      if (response.status === 503 || response.status === 500) {
        console.warn('Database/Server not available - returning empty list');
        return [];
      }
      
      // For other errors, also return empty array
      console.warn('API returned error status - returning empty list');
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      return [];
    }
    
    return data.map((v: any) => ({
      ...v,
      id: v._id || v.id,
    }));
  } catch (error: any) {
    // Handle network errors, timeouts, etc. gracefully
    if (error.name === 'AbortError') {
      console.warn('Request timeout - returning empty list');
    } else {
      console.warn('Error fetching vacancies (non-critical):', error.message || error);
    }
    // Always return empty array instead of throwing
    return [];
  }
}

export async function createVacancy(vacancy: Omit<Vacancy, '_id' | 'id'>): Promise<Vacancy> {
  // Add timeout for fetch request (8 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/vacancies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vacancy),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to create vacancy';
      
      // Handle timeout errors gracefully
      if (response.status === 504 || errorMessage.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { ...data, id: data._id || data.id };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function updateVacancy(id: string, vacancy: Omit<Vacancy, '_id' | 'id'>): Promise<Vacancy> {
  const response = await fetch(`${API_BASE_URL}/api/vacancies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vacancy),
  });

  if (!response.ok) {
    throw new Error('Failed to update vacancy');
  }

  const data = await response.json();
  return { ...data, id: data._id || data.id };
}

export async function deleteVacancy(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/vacancies/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete vacancy');
  }
}

// Announcements API
export interface Announcement {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  isActive?: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/api/announcements`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map((a: any) => ({
      ...a,
      id: a._id || a.id,
    }));
  } catch (error: any) {
    console.warn('Error fetching announcements:', error.message || error);
    return [];
  }
}

export async function createAnnouncement(announcement: Omit<Announcement, '_id' | 'id'>): Promise<Announcement> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcement),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to create announcement';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { ...data, id: data._id || data.id };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function updateAnnouncement(id: string, announcement: Omit<Announcement, '_id' | 'id'>): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(announcement),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update announcement');
  }

  const data = await response.json();
  return { ...data, id: data._id || data.id };
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete announcement');
  }
}

/** Client-side: match server inference so we hit /api/upload-video vs /api/announcements/upload */
function isAnnouncementVideoFile(file: File): boolean {
  const t = (file.type || '').trim().toLowerCase();
  if (t.startsWith('video/')) return true;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  return ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'ogv', '3gp'].includes(ext);
}

type ImageKitAuthPayload = { token: string; expire: number; signature: string; publicKey: string };

/** Matches ImageKit upload rules (alphanumeric, `.`, `-`); mirrors server sanitizer. */
function sanitizeImageKitClientFileName(originalName: string, fallbackExt: string): string {
  let base = (originalName.split(/[/\\]/).pop() || originalName).trim() || `upload.${fallbackExt}`;
  base = base.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  if (!base.includes('.')) {
    base = `${base}.${fallbackExt}`;
  }
  return base.slice(0, 180);
}

function imageKitUploadErrorMessage(data: unknown, status: number): string {
  const d = data as Record<string, unknown>;
  const msg = d?.message;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  if (Array.isArray(msg) && msg.length && typeof msg[0] === 'string') return msg.join(' ');
  const help = d?.help;
  if (typeof help === 'string' && help.trim()) return help.trim();
  return `ImageKit upload failed (${status})`;
}

/**
 * Large videos bypass the Next.js API (413 on Vercel / low proxy body limits).
 * Browser POSTs directly to ImageKit using a short-lived signature from /api/imagekit-auth.
 */
async function uploadAnnouncementVideoViaImageKit(file: File): Promise<{ fileUrl: string }> {
  if (file.size > ANNOUNCEMENT_VIDEO_MAX) {
    const mb = Math.floor(ANNOUNCEMENT_VIDEO_MAX / (1024 * 1024));
    throw new Error(`Video too large. Max ~${mb}MB for this app (adjust limits / ImageKit plan).`);
  }

  const authRes = await fetch(`${API_BASE_URL}/api/imagekit-auth`, { cache: 'no-store' });
  if (!authRes.ok) {
    const err = await authRes.json().catch(() => ({}));
    const msg =
      (err as { error?: string }).error ||
      'Could not start upload. Set IMAGEKIT_PUBLIC_KEY on the server (see .env.example).';
    throw new Error(msg);
  }

  const auth = (await authRes.json()) as ImageKitAuthPayload;
  if (!auth.token || !auth.signature || !auth.publicKey) {
    throw new Error('Invalid upload credentials from server.');
  }

  const rawExt =
    (file.name.split('.').pop() || 'mp4').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'mp4';
  const safeFileName = sanitizeImageKitClientFileName(file.name || '', rawExt);

  const formData = new FormData();
  formData.append('file', file, safeFileName);
  formData.append('fileName', safeFileName);
  formData.append('publicKey', auth.publicKey);
  formData.append('signature', auth.signature);
  formData.append('token', auth.token);
  formData.append('expire', String(auth.expire));
  formData.append('folder', '/announcements/videos');
  formData.append('useUniqueFileName', 'true');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(imageKitUploadErrorMessage(data, response.status));
    }

    const url = (data as { url?: string }).url?.trim();
    if (!url) {
      throw new Error('ImageKit did not return a file URL.');
    }

    return { fileUrl: url };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Upload announcement media to ImageKit (no local disk).
 * Videos → browser → ImageKit (auth from /api/imagekit-auth) · Images → POST /api/announcements/upload
 */
export async function uploadAnnouncementMedia(
  file: File
): Promise<{ fileUrl: string; mediaType: 'image' | 'video' }> {
  const isVideo = isAnnouncementVideoFile(file);

  if (isVideo) {
    try {
      const { fileUrl } = await uploadAnnouncementVideoViaImageKit(file);
      return { fileUrl, mediaType: 'video' };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timed out. Try a smaller file or check your connection.');
      }
      throw error;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/announcements/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { message?: string; error?: string }).message ||
        (errorData as { error?: string }).error ||
        'Failed to upload file';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      fileUrl: data.fileUrl as string,
      mediaType: (data.mediaType as 'image' | 'video') || 'image',
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out. Try a smaller file or check your connection.');
    }
    throw error;
  }
}

/** Dedicated video upload — same as uploadAnnouncementMedia for video files; useful for admin UI clarity */
export async function uploadVideoToImageKit(file: File): Promise<{ videoUrl: string; fileUrl: string }> {
  const r = await uploadAnnouncementMedia(file);
  return { videoUrl: r.fileUrl, fileUrl: r.fileUrl };
}

// Admin API
export interface Admin {
  _id?: string;
  id?: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAdmins(): Promise<Admin[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/api/admins`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('API Error (non-critical):', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      return [];
    }
    
    return data.map((a: any) => ({
      ...a,
      id: a._id || a.id,
    }));
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('Request timeout - returning empty list');
    } else {
      console.warn('Error fetching admins (non-critical):', error.message || error);
    }
    return [];
  }
}

export async function createAdmin(admin: { username: string; password: string }): Promise<Admin> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(admin),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to create admin';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { ...data, id: data._id || data.id };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admins/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || 'Failed to delete admin';
    throw new Error(errorMessage);
  }
}

// Chat API
export interface ChatMessage {
  _id?: string;
  sender: 'customer' | 'admin';
  content: string;
  type: 'text' | 'image' | 'video' | 'pdf';
  timestamp: Date | string;
}

export interface Chat {
  _id?: string;
  id?: string;
  userPhone: string;
  messages: ChatMessage[];
  lastMessageAt?: Date | string;
  lastMessage?: ChatMessage;
  messageCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export async function getChat(userPhone: string): Promise<Chat> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout
    
    const response = await fetch(`${API_BASE_URL}/api/chats?userPhone=${encodeURIComponent(userPhone)}&_t=${Date.now()}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }
    
    const data = await response.json();
    return {
      ...data,
      id: data._id || data.id,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function getAllChats(): Promise<Chat[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/api/chats?admin=true`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map((chat: any) => ({
      ...chat,
      id: chat._id || chat.id,
    }));
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function sendMessage(
  userPhone: string,
  sender: 'customer' | 'admin',
  content: string,
  type: 'text' | 'image' | 'video' | 'pdf' = 'text'
): Promise<Chat> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPhone,
        sender,
        content,
        type,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to send message';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      ...data.chat,
      id: data.chat._id || data.chat.id,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function uploadChatFile(
  file: File,
  userPhone: string,
  sender: 'customer' | 'admin'
): Promise<{ fileUrl: string; chat: Chat }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for file upload

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userPhone', userPhone);
    formData.append('sender', sender);

    const response = await fetch(`${API_BASE_URL}/api/chats/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to upload file';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      fileUrl: data.fileUrl,
      chat: {
        ...data.chat,
        id: data.chat._id || data.chat.id,
      },
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

// User API
export interface User {
  _id?: string;
  id?: string;
  phoneNumber: string;
  firstChatAt?: Date | string;
  lastActiveAt?: Date | string;
  messageCount?: number;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export async function saveUser(phoneNumber: string): Promise<User> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to save user';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      ...data.user,
      id: data.user._id || data.user.id,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

export async function updateUser(phoneNumber: string, updates: { messageCount?: number; lastActiveAt?: Date }): Promise<User> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, ...updates }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to update user';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      ...data.user,
      id: data.user._id || data.user.id,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

// Payment API
export interface Payment {
  _id?: string;
  id?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  receipt?: string;
  paymentDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Visitor {
  _id?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  page: string;
  referrer: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  name?: string;
  email?: string;
  isActive: boolean;
  lastActivity: string | Date;
  firstVisit: string | Date;
  visitCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface VisitorStats {
  total: number;
  active: number;
  today: number;
}

export async function trackVisitor(data: {
  sessionId: string;
  page: string;
  referrer?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  name?: string;
  email?: string;
}): Promise<{ success: boolean; visitor?: Visitor }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to track visitor');
    }

    return await response.json();
  } catch (error: any) {
    // Ignore connection reset and abort errors (common when page unloads or client disconnects)
    if (error.name === 'AbortError' || error.code === 'ECONNRESET' || error.message?.includes('aborted')) {
      // Silently ignore - this is normal when page unloads
      return { success: false };
    }
    
    // Only log actual errors
    console.error('Error tracking visitor:', error);
    return { success: false };
  }
}

export async function getVisitors(): Promise<{
  success: boolean;
  activeVisitors: Visitor[];
  allVisitors: Visitor[];
  stats: VisitorStats;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/visitors`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch visitors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return {
      success: false,
      activeVisitors: [],
      allVisitors: [],
      stats: { total: 0, active: 0, today: 0 },
    };
  }
}

export async function getAllPayments(): Promise<Payment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    const data = await response.json();
    return data.payments || [];
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return [];
  }
}

export async function getUser(phoneNumber: string): Promise<User | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/api/users?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    return {
      ...data,
      id: data._id || data.id,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    return null;
  }
}

export async function deleteChat(chatId: string): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to delete chat';
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

// Government Links API
export interface GovernmentLink {
  id?: string;
  _id?: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export async function getGovernmentLinks(activeOnly: boolean = true): Promise<GovernmentLink[]> {
  try {
    const response = await fetch(`/api/government-links?active=${activeOnly}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch government links');
    }

    const data = await response.json();
    return data.links || [];
  } catch (error: any) {
    console.error('Error fetching government links:', error);
    return [];
  }
}

export async function createGovernmentLink(link: Omit<GovernmentLink, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<GovernmentLink> {
  const response = await fetch('/api/government-links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create government link');
  }

  const data = await response.json();
  return { ...data.link, id: data.link.id || data.link._id };
}

export async function updateGovernmentLink(id: string, link: Partial<GovernmentLink>): Promise<GovernmentLink> {
  const response = await fetch(`/api/government-links/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update government link');
  }

  const data = await response.json();
  return { ...data.link, id: data.link.id || data.link._id };
}

export async function deleteGovernmentLink(id: string): Promise<void> {
  const response = await fetch(`/api/government-links/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete government link');
  }
}

// Notification API
export interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  type: 'vacancy' | 'announcement' | 'update' | 'general';
  link?: string;
  relatedId?: string;
  createdAt?: string;
}

export async function createNotification(notification: {
  title: string;
  message: string;
  type?: 'vacancy' | 'announcement' | 'update' | 'general';
  link?: string;
  relatedId?: string;
}): Promise<Notification> {
  const response = await fetch(`/api/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create notification');
  }

  const data = await response.json();
  return data.notification;
}

// Blog API
export interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags?: string[];
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPublished?: boolean;
  publishedAt?: string;
  views?: number;
  readingTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  published?: boolean;
}): Promise<{ blogs: Blog[]; pagination: any }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());

    const response = await fetch(`${API_BASE_URL}/api/blogs?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    return {
      blogs: data.blogs.map((b: any) => ({ ...b, id: b._id || b.id })),
      pagination: data.pagination,
    };
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
}

export async function getBlog(slug: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch blog');
  }

  const data = await response.json();
  return { ...data.blog, id: data.blog._id || data.blog.id };
}

export async function createBlog(blog: Omit<Blog, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/api/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create blog');
  }

  const data = await response.json();
  return { ...data.blog, id: data.blog._id || data.blog.id };
}

export async function updateBlog(slug: string, blog: Partial<Blog>): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update blog');
  }

  const data = await response.json();
  return { ...data.blog, id: data.blog._id || data.blog.id };
}

export async function deleteBlog(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete blog');
  }
}

export async function uploadBlogImage(file: File): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s for file upload

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/blogs/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to upload image';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.fileUrl;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

// Sitemap API
export interface SitemapUrl {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

export interface SitemapPayload {
  success: boolean;
  baseUrl: string;
  stats: {
    total: number;
    staticCount: number;
    blogCount: number;
  };
  urls: SitemapUrl[];
}

export async function getSitemapData(): Promise<SitemapPayload> {
  const response = await fetch(`${API_BASE_URL}/api/admin/sitemap`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch sitemap data');
  }

  return response.json();
}

// Custom Sitemap Links CRUD API
export interface CustomSitemapLink {
  id?: string;
  _id?: string;
  url: string;
  title: string;
  description?: string;
  changeFrequency?: string;
  priority?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getCustomSitemapLinks(): Promise<CustomSitemapLink[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/sitemap-links`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch custom sitemap links');
  }

  const data = await response.json();
  return data.links.map((link: any) => ({ ...link, id: link._id || link.id }));
}

export async function createCustomSitemapLink(
  link: Omit<CustomSitemapLink, 'id' | '_id' | 'createdAt' | 'updatedAt'>
): Promise<CustomSitemapLink> {
  const response = await fetch(`${API_BASE_URL}/api/admin/sitemap-links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create sitemap link');
  }

  const data = await response.json();
  return { ...data.link, id: data.link._id || data.link.id };
}

export async function updateCustomSitemapLink(
  id: string,
  link: Partial<CustomSitemapLink>
): Promise<CustomSitemapLink> {
  const response = await fetch(`${API_BASE_URL}/api/admin/sitemap-links/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update sitemap link');
  }

  const data = await response.json();
  return { ...data.link, id: data.link._id || data.link.id };
}

export async function deleteCustomSitemapLink(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/sitemap-links/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete sitemap link');
  }
}


