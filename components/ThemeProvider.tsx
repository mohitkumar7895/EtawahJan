'use client';

import { useEffect, useState } from 'react';

export const THEME_PRESETS: Record<string, Record<string, string>> = {
  blue: {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a',
    '950': '#172554',
  },
  green: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
  },
  red: {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
  },
  purple: {
    '50': '#faf5ff',
    '100': '#f3e8ff',
    '200': '#e9d5ff',
    '300': '#d8b4fe',
    '400': '#c084fc',
    '500': '#a855f7',
    '600': '#9333ea',
    '700': '#7e22ce',
    '800': '#6b21a8',
    '900': '#581c87',
    '950': '#3b0764',
  },
  orange: {
    '50': '#fff7ed',
    '100': '#ffedd5',
    '200': '#fed7aa',
    '300': '#fdba74',
    '400': '#fb923c',
    '500': '#f97316',
    '600': '#ea580c',
    '700': '#c2410c',
    '800': '#9a3412',
    '900': '#7c2d12',
    '950': '#431407',
  },
  rose: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#fecdd3',
    '300': '#fda4af',
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
    '800': '#9f1239',
    '900': '#881337',
    '950': '#4c0519',
  },
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('blue');

  useEffect(() => {
    setMounted(true);
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data?.theme?.primaryColorName) {
          setTheme(data.theme.primaryColorName);
          applyTheme(data.theme.primaryColorName);
        }
      })
      .catch((err) => console.error('Failed to load theme:', err));
  }, []);

  const applyTheme = (colorName: string) => {
    const preset = THEME_PRESETS[colorName] || THEME_PRESETS['blue'];
    const root = document.documentElement;
    Object.keys(preset).forEach((shade) => {
      root.style.setProperty(`--theme-primary-${shade}`, preset[shade]);
    });
  };

  // Run immediately on first mount to set default variables if not fetched yet,
  // but we actually don't need to if default is blue and tailwind handles defaults.
  useEffect(() => {
    if (theme !== 'blue') {
      applyTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
