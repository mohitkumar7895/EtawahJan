import AdminLayout from '@/components/admin/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Jan Seva Kendra',
  robots: { index: false, follow: false },
};

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
