'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { History, LayoutGrid, Moon, Sun, BarChart3 } from 'lucide-react';
import { useConverterTheme } from './ConverterThemeProvider';
import ConverterBrandLogo from './ConverterBrandLogo';

export default function ConverterNav() {
  const pathname = usePathname();
  const { theme, toggle } = useConverterTheme();

  const linkClass = (href: string) =>
    `text-sm font-semibold transition-colors ${
      pathname === href || pathname?.startsWith(href + '/')
        ? 'text-rose-500'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <ConverterBrandLogo size="sm" hideTextOnMobile className="shrink-0 min-w-0" />

        <nav className="flex items-center gap-5 sm:gap-7">
          <Link href="/file-converter" className={linkClass('/file-converter')}>
            <span className="inline-flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4" />
              Tools
            </span>
          </Link>
          <Link href="/file-converter/history" className={linkClass('/file-converter/history')}>
            <span className="inline-flex items-center gap-1.5">
              <History className="w-4 h-4" />
              History
            </span>
          </Link>
          <Link href="/file-converter/admin" className={linkClass('/file-converter/admin')}>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Admin
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            href="/tools"
            className="hidden md:inline-flex text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          >
            Jan Seva Tools
          </Link>
        </div>
      </div>
    </header>
  );
}
