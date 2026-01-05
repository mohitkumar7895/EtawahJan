// API functions for Next.js - using relative API routes
const API_BASE_URL = '';

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
    const response = await fetch(`${API_BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to track visitor');
    }

    return await response.json();
  } catch (error) {
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
