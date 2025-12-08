// API functions for Next.js - using relative API routes
const API_BASE_URL = '';

export interface ContactFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  service_type: string;
}

export interface ContactUsData {
  name: string;
  email: string;
  message: string;
}

export async function submitServiceApplication(formData: ContactFormData) {
  const response = await fetch(`${API_BASE_URL}/api/apply-service`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit service application');
  }

  return response.json();
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


