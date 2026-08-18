'use client';

import { MonitorSmartphone, Code2, Gamepad2, Rocket, PhoneCall, ArrowRight, CheckCircle2, Sparkles, X, FileText, IndianRupee, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import FreeSeoAuditForm from './FreeSeoAuditForm';
import CostEstimatorModal from './CostEstimatorModal';

export default function ITServicesBanner() {
  const [showModal, setShowModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showEstimatorModal, setShowEstimatorModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);
  
  return (
    <section className="w-full bg-white relative overflow-hidden py-16 md:py-24">
      {/* Premium Light Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/70 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/70 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 mix-blend-multiply pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Content - Details */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Premium Digital Services</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Scale Your Business 10x with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
                Next-Gen IT Solutions
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Take your business to the next level. We specialize in building high-quality websites, robust mobile applications, engaging games, and custom software tailored to boost your revenue and growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 mx-auto lg:mx-0 w-full sm:w-auto">
              <button
                onClick={() => setShowAuditModal(true)}
                className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2 rounded-xl p-0.5 transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <div className="relative flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-xl w-full">
                  <Sparkles className="w-5 h-5 text-yellow-400 group-hover:animate-spin" />
                  Free SEO Audit
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              {[
                { icon: MonitorSmartphone, title: 'Web Development' },
                { icon: Code2, title: 'Mobile Apps' },
                { icon: Gamepad2, title: 'Game Development' },
                { icon: Rocket, title: 'Custom Software' },
              ].map((service, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-blue-400 hover:shadow-[0_8px_20px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 group">
                  <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <service.icon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-slate-800 font-extrabold text-sm tracking-wide">{service.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className="w-full lg:w-[440px] shrink-0">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl transition-opacity opacity-0 group-hover:opacity-100 duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Let&apos;s Build It!</h3>
                  <p className="text-slate-600 text-sm font-medium">Get a free consultation for your project today.</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowEstimatorModal(true)}
                    className="relative w-full group overflow-hidden rounded-2xl p-1 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 opacity-70 group-hover:opacity-100 animate-[spin_4s_linear_infinite]" />
                    <div className="relative flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-xl font-black text-lg transition-all group-hover:bg-slate-50 shadow-inner">
                      <Calculator className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
                        Instant Cost Estimator
                      </span>
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-bold text-white items-center justify-center">!</span>
                      </span>
                    </div>
                  </button>

                  <a 
                    href="tel:9193898182" 
                    className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  >
                    <PhoneCall className="w-5 h-5 animate-wiggle" />
                    <span>Call: +91-9193898182</span>
                  </a>
                  
                  <a 
                    href="https://wa.me/9193898182?text=Hello,%20I%20am%20interested%20in%20your%20IT/Digital%20services%20like%20Website%20or%20App%20development." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-[#22bf5b] transition-all shadow-md hover:shadow-xl hover:shadow-[#25D366]/20 hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>WhatsApp: 9193898182</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>

                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:scale-95"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Apply for Services</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                  {['Fast Delivery', 'Premium Quality', 'Affordable Pricing'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 text-sm font-bold">{benefit}</span>
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden
          />
          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative z-10 w-full max-w-lg animate-scale-in my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="relative bg-slate-50 border-b border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-slate-900">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">IT Service Application</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mb-1">Start Your Project</h3>
                    <p className="text-sm font-medium text-slate-500">Fill the form below to get a free quote</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    aria-label="Close dialog"
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all p-2 rounded-xl hover:scale-110 active:scale-95 flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-white">
                <ContactForm embedded preselectedService="Website, Mobile App, Custom Software" />
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600">
                  <PhoneCall className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Need help? Call us at</span>
                  <a href="tel:9193898182" className="font-bold text-blue-600 hover:text-blue-700 transition break-all">
                    9193898182, 7895094129
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Audit Modal */}
      <FreeSeoAuditForm isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />

      {/* Cost Estimator Modal */}
      <CostEstimatorModal isOpen={showEstimatorModal} onClose={() => setShowEstimatorModal(false)} />

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
