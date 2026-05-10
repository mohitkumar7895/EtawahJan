'use client';

import { MonitorSmartphone, Code2, Gamepad2, Rocket, PhoneCall, ArrowRight, CheckCircle2, Sparkles, X, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';

export default function ITServicesBanner() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);
  return (
    <section className="w-full bg-slate-950 relative overflow-hidden py-10 md:py-16 border-y border-white/10">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          
          {/* Left Content - Details */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 text-blue-300 font-semibold text-sm mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Premium Digital Services</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Scale Your Business 10x with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-sm">
                Next-Gen IT Solutions
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Take your business to the next level. We specialize in building high-quality websites, robust mobile applications, engaging games, and custom software tailored to boost your revenue and growth.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              {[
                { icon: MonitorSmartphone, title: 'Web Development' },
                { icon: Code2, title: 'Mobile Apps' },
                { icon: Gamepad2, title: 'Game Development' },
                { icon: Rocket, title: 'Custom Software' },
              ].map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 rounded-lg px-4 py-2.5 shadow-sm hover:border-blue-500/50 transition-colors">
                  <service.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-200 font-semibold text-sm">{service.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 p-8 rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Let&apos;s Build It!</h3>
                  <p className="text-slate-400 text-sm">Get a free consultation for your project today.</p>
                </div>

                <div className="space-y-4">
                  <a 
                    href="tel:7895094129" 
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:-translate-y-0.5"
                  >
                    <PhoneCall className="w-5 h-5 animate-wiggle" />
                    <span>Call: +91-7895094129</span>
                  </a>
                  
                  <a 
                    href="https://wa.me/917895094129?text=Hello,%20I%20am%20interested%20in%20your%20IT/Digital%20services%20like%20Website%20or%20App%20development." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#22bf5b] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:-translate-y-0.5"
                  >
                    <span>WhatsApp Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>

                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 px-6 py-4 rounded-xl font-extrabold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:-translate-y-0.5"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Apply for Services</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col gap-3">
                  {['Fast Delivery', 'Premium Quality', 'Affordable Pricing'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4 animate-fade-in overflow-y-auto py-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden
          />
          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative z-10 w-full max-w-lg animate-scale-in my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-400/20">
              <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 px-4 sm:px-5 py-3 sm:py-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">IT Service Application</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold mb-1">Start Your Project</h3>
                    <p className="text-xs text-blue-200">Fill the form below to get a free quote</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close dialog"
                    className="text-white hover:text-yellow-300 hover:bg-white/10 transition-all p-1.5 sm:p-2 rounded-lg hover:scale-110 active:scale-95 flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <ContactForm embedded preselectedService="Website, Mobile App, Custom Software" />
              </div>

              <div className="px-4 sm:px-5 py-2 sm:py-3 bg-slate-900 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span>Need help? Call us at</span>
                  <a href="tel:9193898182" className="font-bold text-yellow-400 hover:text-yellow-300 transition break-all">
                    9193898182, 7895094129
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}
