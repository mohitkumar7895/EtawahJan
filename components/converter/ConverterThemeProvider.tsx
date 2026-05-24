'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
});

export function ConverterThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('converter-theme') as Theme | null;
    if (saved) setTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('converter-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  if (!mounted) {
    return <div className="converter-root min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`converter-root min-h-screen transition-colors duration-300 ${
          theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useConverterTheme() {
  return useContext(ThemeContext);
}
