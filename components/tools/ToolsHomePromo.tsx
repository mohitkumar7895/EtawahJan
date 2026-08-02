import Link from 'next/link';
import { Camera, FileText, Wallet, Wrench, ArrowRight, MonitorSmartphone, ShieldCheck } from 'lucide-react';

const TOP_TOOLS = [
  { href: '/photo-resizer', label: 'Photo 20KB Resizer', icon: Camera, color: 'text-rose-300', bg: 'bg-rose-500/20' },
  { href: '/pdf-editor', label: 'PDF Editor Free', icon: FileText, color: 'text-violet-300', bg: 'bg-violet-500/20' },
  { href: '/cash-counter', label: 'Cash Counter', icon: Wallet, color: 'text-emerald-300', bg: 'bg-emerald-500/20' },
  { href: '/file-converter', label: 'File Converter', icon: Wrench, color: 'text-amber-300', bg: 'bg-amber-500/20' },
];

export default function ToolsHomePromo() {
  return (
    <section className="bg-white border-y border-slate-100 py-12 sm:py-16 relative overflow-hidden">
      {/* Subtle compact background effect */}
      <div className="absolute inset-0 bg-blue-50/30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side: Text and Buttons */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-4 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              100% Free · No Login
            </div>
            
            <h2 
              className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Premium Tools for <br className="hidden sm:block"/>
              <span className="text-blue-600 drop-shadow-sm">Everyday Tasks</span>
            </h2>
            
            <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
              Sarkari photo, PDF edit, note counter — sabhi tools yahan hain. Fast, Secure & 100% Free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors active:scale-95 shadow-md"
              >
                All Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/build-website"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 text-slate-900 px-5 py-2.5 font-bold text-sm hover:bg-yellow-300 transition-colors active:scale-95 shadow-md"
              >
                <MonitorSmartphone className="w-4 h-4" />
                Website Banwana Hai?
              </Link>
            </div>
          </div>

          {/* Right Side: Tools Grid */}
          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {TOP_TOOLS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
