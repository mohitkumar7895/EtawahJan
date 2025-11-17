// Use localhost for local development, otherwise use environment variable or production URL
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000' 
  : (import.meta.env.VITE_BACKEND_URL || 'https://etawah-jan-a6ol.vercel.app');


 // const API_BASE_URL = "https://etawah-jan-a6ol.vercel.app";
//jiii
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
  const response = await fetch(`${API_BASE_URL}/api/vacancies`);
  if (!response.ok) {
    throw new Error('Failed to fetch vacancies');
  }
  const data = await response.json();
  // Map _id to id for compatibility
  return data.map((v: any) => ({
    ...v,
    id: v._id || v.id,
  }));
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
    throw new Error('Failed to create vacancy');
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