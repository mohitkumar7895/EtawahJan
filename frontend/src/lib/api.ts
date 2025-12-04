// Use production backend URL for live site, localhost for development
// Runtime check based on current hostname
const getApiBaseUrl = () => {
  // Check if we're running on localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'http://localhost:5000';
    }
  }
  // For production (www.jan-seva.site or any other domain)
  return 'https://etawah-jan-a6ol.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

// Log for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📍 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
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
  const response = await fetch(`${API_BASE_URL}/apply-service`, {
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
  const response = await fetch(`${API_BASE_URL}/contact`, {
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
    const response = await fetch(`${API_BASE_URL}/api/vacancies`);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Failed to fetch vacancies';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('API Error:', errorData);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // If 503, it's a database connection issue - return empty array
      if (response.status === 503) {
        console.warn('Database not available:', errorMessage);
        return []; // Return empty array instead of throwing error
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Handle case where data might not be an array
    if (!Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      return [];
    }
    
    // Map _id to id for compatibility
    return data.map((v: any) => ({
      ...v,
      id: v._id || v.id,
    }));
  } catch (error: any) {
    console.error('Error fetching vacancies:', error);
    // Return empty array on error instead of throwing
    // This allows the UI to still render
    return [];
  }
}

export async function createVacancy(vacancy: Omit<Vacancy, '_id' | 'id'>): Promise<Vacancy> {
  const response = await fetch(`${API_BASE_URL}/api/vacancies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vacancy),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || 'Failed to create vacancy';
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return { ...data, id: data._id || data.id };
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