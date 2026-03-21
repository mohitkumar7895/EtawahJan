import axios from 'axios';

const base = typeof window !== 'undefined' ? '' : '';

const client = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Request failed';
    return Promise.reject(new Error(typeof msg === 'string' ? msg : 'Request failed'));
  }
);

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ElectricityRecord {
  _id?: string;
  id: string;
  consumerId: string;
  date: string;
  name: string;
  password?: string;
  amount: number;
  baki?: number;
  address?: string;
  contact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EdistrictRecord {
  _id?: string;
  id: string;
  date: string;
  subject: string;
  certificateNumber?: string;
  name: string;
  mobile?: string;
  address?: string;
  amount: number;
  jama: number;
  baki: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WithdrawalRecord {
  _id?: string;
  id: string;
  date: string;
  aadharNumber: string;
  name: string;
  withdrawal: string;
  remains: number;
  signature?: string;
  mobileNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getElectricityPage(page: number, limit: number) {
  const { data } = await client.get<Paginated<ElectricityRecord>>('/api/electricity', {
    params: { page, limit },
  });
  return data;
}

export async function getElectricityById(id: string) {
  const { data } = await client.get<ElectricityRecord>(`/api/electricity/${id}`);
  return data;
}

export async function createElectricity(payload: {
  date: string;
  name: string;
  consumerId: string;
  password?: string;
  amount: number;
  baki?: number;
  address?: string;
  contact?: string;
}) {
  const { data } = await client.post<ElectricityRecord>('/api/electricity', payload);
  return data;
}

export async function updateElectricity(
  id: string,
  payload: {
    date: string;
    name: string;
    consumerId: string;
    password?: string;
    amount: number;
    address?: string;
    contact?: string;
  }
) {
  const { data } = await client.put<ElectricityRecord>(`/api/electricity/${id}`, payload);
  return data;
}

export async function deleteElectricity(id: string) {
  await client.delete(`/api/electricity/${id}`);
}

export async function getEdistrictPage(page: number, limit: number) {
  const { data } = await client.get<Paginated<EdistrictRecord>>('/api/edistrict', {
    params: { page, limit },
  });
  return data;
}

export async function getEdistrictById(id: string) {
  const { data } = await client.get<EdistrictRecord>(`/api/edistrict/${id}`);
  return data;
}

export async function createEdistrict(payload: {
  date: string;
  subject: string;
  certificateNumber?: string;
  name: string;
  mobile?: string;
  address?: string;
  amount: number;
  jama: number;
  baki: number;
}) {
  const { data } = await client.post<EdistrictRecord>('/api/edistrict', payload);
  return data;
}

export async function updateEdistrict(
  id: string,
  payload: {
    date: string;
    subject: string;
    certificateNumber?: string;
    name: string;
    mobile?: string;
    address?: string;
    amount: number;
    jama: number;
    baki: number;
  }
) {
  const { data } = await client.put<EdistrictRecord>(`/api/edistrict/${id}`, payload);
  return data;
}

export async function deleteEdistrict(id: string) {
  await client.delete(`/api/edistrict/${id}`);
}

export async function getWithdrawalPage(page: number, limit: number) {
  const { data } = await client.get<Paginated<WithdrawalRecord>>('/api/withdrawal', {
    params: { page, limit },
  });
  return data;
}

export async function getWithdrawalById(id: string) {
  const { data } = await client.get<WithdrawalRecord>(`/api/withdrawal/${id}`);
  return data;
}

export async function createWithdrawal(payload: {
  date: string;
  aadharNumber: string;
  name: string;
  withdrawal: string;
  remains: number;
  signature?: string;
  mobileNumber?: string;
}) {
  const { data } = await client.post<WithdrawalRecord>('/api/withdrawal', payload);
  return data;
}

export async function updateWithdrawal(
  id: string,
  payload: {
    date: string;
    aadharNumber: string;
    name: string;
    withdrawal: string;
    remains: number;
    signature?: string;
    mobileNumber?: string;
  }
) {
  const { data } = await client.put<WithdrawalRecord>(`/api/withdrawal/${id}`, payload);
  return data;
}

export async function deleteWithdrawal(id: string) {
  await client.delete(`/api/withdrawal/${id}`);
}
