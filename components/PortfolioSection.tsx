'use client';
import { ExternalLink, ShoppingCart, Activity, GraduationCap, Building2, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PORTFOLIO_ITEMS = [
  {
    title: 'E-Commerce App',
    category: 'Online Store',
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-rose-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    description: 'Fully functional online store with Razorpay integration and admin panel.',
  },
  {
    title: 'Hospital CRM',
    category: 'Management System',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    description: 'Patient management, appointment booking, and automated billing software.',
  },
  {
    title: 'School ERP',
    category: 'Education Software',
    icon: GraduationCap,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    description: 'Student portal, attendance tracking, and digital report cards generation.',
  },
  {
    title: 'Corporate Website',
    category: 'Business Profile',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    description: 'High-converting lead generation website with SEO optimized structure.',
  },
];

export default function PortfolioSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Our Work & Expertise
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Built for Growth. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Designed to Convert.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Take a look at some of the high-quality digital solutions we build to help businesses scale and dominate their market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col relative overflow-hidden"
            >
              {/* Top Gradient Line */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <item.icon className={`w-7 h-7 ${item.text}`} strokeWidth={2} />
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </div>
              
              <p className="text-sm text-slate-500 mt-2 mb-6 flex-grow leading-relaxed">
                {item.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-8 py-4 font-bold text-base hover:bg-blue-600 transition-colors active:scale-95 shadow-lg shadow-slate-900/20"
          >
            Explore All Solutions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
