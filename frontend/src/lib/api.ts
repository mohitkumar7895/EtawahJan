const API_BASE_URL = 'https://etawah-jan-3og3.vercel.app/';

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