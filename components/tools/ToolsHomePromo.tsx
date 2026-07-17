import Link from 'next/link';
import { Camera, FileText, Wallet, Wrench } from 'lucide-react';

const TOP_TOOLS = [
  { href: '/photo-resizer', label: 'Photo 20KB Resizer', icon: Camera, color: 'text-orange-500' },
  { href: '/pdf-editor', label: 'PDF Editor Free', icon: FileText, color: 'text-purple-500' },
  { href: '/cash-counter', label: 'Cash Counter', icon: Wallet, color: 'text-emerald-500' },
  { href: '/file-converter', label: 'File Converter', icon: Wrench, color: 'text-rose-500' },
];

export default function ToolsHomePromo() {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-8 sm:py-10 px-4 border-y border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">100% Free · No Login</span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Free Online Tools — Photo, PDF, Cash Counter & More
            </h2>
            <p className="text-sm text-blue-200 mt-1 max-w-xl">
              Sarkari photo 20KB, PDF edit, note counter, merge PDF, resume builder — sab free tools ek jagah.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {TOP_TOOLS.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold hover:bg-white/20 transition"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                {label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-slate-900 px-5 py-2.5 text-xs sm:text-sm font-black hover:bg-yellow-300 transition"
            >
              All Tools →
            </Link>
            <Link
              href="/build-website"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-white px-5 py-2.5 text-xs sm:text-sm font-black hover:bg-emerald-400 transition"
            >
              Website Banwana →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
