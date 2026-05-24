import Link from 'next/link';
import ConverterBrandLogo from './ConverterBrandLogo';

export default function ConverterFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6">
        <ConverterBrandLogo size="md" centered linkHome={false} />
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">Arpit Jan Seva Kendra</span>
          {' '}· Bharthana, Etawah, UP
        </p>
        <div className="flex gap-6">
          <Link href="/file-converter" className="hover:text-rose-500 transition-colors">
            All Tools
          </Link>
          <Link href="/tools" className="hover:text-rose-500 transition-colors">
            CSC Tools
          </Link>
          <Link href="/contact" className="hover:text-rose-500 transition-colors">
            Contact
          </Link>
        </div>
        </div>
      </div>
    </footer>
  );
}
