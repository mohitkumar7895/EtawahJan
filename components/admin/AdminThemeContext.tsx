'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

/** Primary key — admin theme is isolated from the public site */
export const ADMIN_THEME_STORAGE_KEY = 'admin_theme';

/** Legacy key — read once and migrate to {@link ADMIN_THEME_STORAGE_KEY} */
const LEGACY_ADMIN_THEME_STORAGE_KEY = 'janseva-admin-theme';

export type AdminThemeSetting = 'light' | 'dark' | 'system';

type ResolvedTheme = 'light' | 'dark';

export type AdminThemeContextValue = {
  theme: AdminThemeSetting;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: AdminThemeSetting) => void;
  toggleLightDark: () => void;
};

export const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

/** Alias for apps that expect `ThemeContext` naming */
export const ThemeContext = AdminThemeContext;

function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function readStoredTheme(): AdminThemeSetting {
  if (typeof window === 'undefined') return 'light';
  try {
    let v = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    if (!v) {
      const legacy = localStorage.getItem(LEGACY_ADMIN_THEME_STORAGE_KEY);
      if (legacy === 'light' || legacy === 'dark' || legacy === 'system') {
        localStorage.setItem(ADMIN_THEME_STORAGE_KEY, legacy);
        v = legacy;
      }
    }
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* ignore */
  }
  return 'light';
}

/**
 * Provides admin-only theme state. Does not render a DOM node — pair with
 * {@link AdminThemeShell} inside {@link AdminLayout}.
 */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminThemeSetting>('light');
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  const setTheme = useCallback((t: AdminThemeSetting) => {
    setThemeState(t);
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLightDark = useCallback(() => {
    const next: AdminThemeSetting = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  useLayoutEffect(() => {
    setMounted(true);
    setThemeState(readStoredTheme());
    setSystemDark(getSystemDark());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemDark(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mounted]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleLightDark }),
    [theme, resolvedTheme, setTheme, toggleLightDark],
  );

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

/**
 * Applies Tailwind `dark` class only on this subtree (never on `document.documentElement`).
 * Must be rendered inside {@link AdminThemeProvider}.
 */
export function AdminThemeShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useAdminTheme();
  const rootClass = resolvedTheme === 'dark' ? 'dark' : '';

  return (
    <div
      className={`admin-theme-root min-h-screen ${rootClass} transition-colors duration-200 ease-out`}
    >
      {children}
    </div>
  );
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return ctx;
}

export const useTheme = useAdminTheme;
