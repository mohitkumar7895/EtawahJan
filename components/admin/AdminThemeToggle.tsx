'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeContext';

/**
 * Header control: cycles Light → Dark → System (optional third state via small menu).
 * Primary action: quick light/dark swap for most users.
 */
export function AdminThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleLightDark } = useAdminTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 p-0.5 transition-colors duration-200">
      <button
        type="button"
        onClick={toggleLightDark}
        className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-zinc-100/30"
        title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
        ) : (
          <Moon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
        )}
      </button>
      <span className="w-px h-5 bg-zinc-200 dark:bg-zinc-600" aria-hidden />
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`inline-flex items-center justify-center rounded-md p-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-zinc-100/30 ${
          theme === 'system'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
            : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/70 dark:hover:bg-zinc-700/70'
        }`}
        title="Use system theme"
        aria-label="Use system theme"
        aria-pressed={theme === 'system'}
      >
        <Monitor className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
      </button>
    </div>
  );
}
