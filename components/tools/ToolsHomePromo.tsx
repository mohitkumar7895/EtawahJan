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
    <section className="bg-gradient-to-b from-blue-800 to-blue-950 border-b border-blue-900/50 py-8 sm:py-10 relative overflow-hidden">
      {/* Subtle compact background effect */}
      <div className="absolute inset-0 bg-blue-900/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side: Text and Buttons */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-200 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-4 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Free · No Login
            </div>
            
            <h2 
              className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Premium Tools for <br className="hidden sm:block"/>
              <span className="text-yellow-400 drop-shadow-sm">Everyday Tasks</span>
            </h2>
            
            <p className="text-sm text-blue-100 font-medium mb-6 leading-relaxed">
              Sarkari photo, PDF edit, note counter — sabhi tools yahan hain. Fast, Secure & 100% Free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white text-blue-950 px-5 py-2.5 font-bold text-sm hover:bg-blue-50 transition-colors active:scale-95 shadow-md"
              >
                All Tools
                <ArrowRight className="w-4 h-4 text-blue-600" />
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
              {TOP_TOOLS.map(({ href, label, icon: Icon, color, bg }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 hover:border-blue-400/50 transition-all duration-300 text-center shadow-sm hover:shadow-lg"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-blue-50 text-xs sm:text-sm group-hover:text-white transition-colors leading-tight drop-shadow-sm">
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
