'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { DIGITAL_TOOLS } from './toolsData';

export default function ToolsShowcase() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Blue hero — pehle jaisa */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 text-white py-12 sm:py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
        <div className="container mx-auto max-w-4xl relative z-10 space-y-4">
          <div className="flex justify-center mb-2">
            <Image
              src="/jan-seva-logo-1.png"
              alt="Arpit Jan Seva Kendra"
              width={72}
              height={72}
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-contain drop-shadow-lg"
            />
          </div>
          <span className="bg-blue-500/25 text-blue-100 border border-blue-400/40 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Arpit Jan Seva Kendra · 100% Free
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Jan Seva Kendra Digital Tools
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Photo, PDF, Converter — neeche card par click karein, tool turant khulega.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-10 md:py-14 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIGITAL_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-white rounded-2xl border border-slate-200/80 border-t-4 ${tool.accent} p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
                >
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className={`p-3 rounded-xl ${tool.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mt-1">{tool.subtitle}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2 flex-1">{tool.description}</p>

                  <span className="mt-6 w-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white border-2 border-slate-100 group-hover:border-blue-600 text-slate-700 font-extrabold py-3 px-4 rounded-xl text-center text-sm transition duration-200 block">
                    {tool.cta} →
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Trust banner — pehle jaisa, thoda short */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-950 text-white rounded-2xl border-2 border-yellow-400/40 p-6 md:p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <span className="bg-yellow-400 text-slate-900 font-black px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wide inline-block">
                Expert Help
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Form mein galti se bachna hai? Hum bharenge!
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Online tools free hain. Kendra par ya WhatsApp — सेवा शुल्क <strong>₹50</strong> se.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-6 py-3.5 rounded-xl text-center text-sm transition active:scale-95"
              >
                WhatsApp करें
              </a>
              <a
                href="tel:9193898182"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-3.5 rounded-xl text-center text-sm transition"
              >
                📞 9193898182
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
