'use client';

import type { ReactNode } from 'react';
import { AdminThemeProvider, AdminThemeShell } from '@/components/admin/AdminThemeContext';

/**
 * Layout wrapper for all `/admin` routes.
 * - Mounts admin-only theme context + applies `dark` class on `.admin-theme-root` only.
 * - Does not touch `html` / `body` — public pages stay light.
 *
 * Add nested route UI here later (e.g. sidebar + top bar) around `{children}`.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminThemeShell>{children}</AdminThemeShell>
    </AdminThemeProvider>
  );
}
