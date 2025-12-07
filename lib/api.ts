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
    const response = await fetch(`${API_BASE_URL}/api/vacancies`);
    
    if (!response.ok) {
      let errorMessage = 'Failed to fetch vacancies';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('API Error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      
      if (response.status === 503) {
        console.warn('Database not available:', errorMessage);
        return [];
      }
      
      throw new Error(errorMessage);
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
    console.error('Error fetching vacancies:', error);
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

