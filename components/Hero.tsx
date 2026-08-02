'use client';

import { MapPin, Phone, Mail, X, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from './ContactForm';

export default function Hero() {
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
    <section id="home" className="bg-gradient-to-br from-blue-400 to-blue-800 text-white py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 relative">
            {/* Logo in corner - Desktop only */}
            <div className="hidden lg:block absolute top-0 left-0">
              <Image 
                src="/jan-seva-logo-1.png" 
                alt="Jan Seva Kendra Logo" 
                width={176}
                height={176}
                className="w-32 h-32 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 object-contain animate-fade-in-up"
                priority
              />
            </div>
            
            {/* Mobile/Tablet Layout - Logo centered */}
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 px-2 lg:hidden">
              <Image 
                src="/jan-seva-logo-1.png" 
                alt="Jan Seva Kendra Logo" 
                width={144}
                height={144}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain animate-fade-in-up"
                priority
              />
            </div>

            {/* Brand title — 3-color mix */}
            <h1 className="text-center px-2 mb-2 sm:mb-3 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <span className="text-yellow-300 drop-shadow-sm">Jan</span>{' '}
                <span className="text-white drop-shadow-md">Seva</span>{' '}
                <span className="text-emerald-300 drop-shadow-sm">Kendra</span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-50 font-semibold mb-6 sm:mb-8 px-2 max-w-3xl mx-auto leading-snug animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              आपकी सेवा में हमेशा तत्पर
            </p>

            {/* Star/Seal FOMO Badge (Mobile - In Flow) */}
            <div className="flex justify-center md:hidden mb-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="relative w-24 h-24 flex items-center justify-center group">
                <div className="absolute inset-0 text-yellow-400 drop-shadow-xl animate-[spin_12s_linear_infinite]">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path fill="currentColor" d="M100,5 119,25 147,18 156,45 182,53 176,80 196,100 176,120 182,147 156,155 147,182 119,175 100,195 81,175 53,182 44,155 18,147 24,120 4,100 24,80 18,53 44,45 53,18 81,25 Z"/>
                  </svg>
                </div>
                <div className="relative z-10 w-[72px] h-[72px] bg-slate-900 rounded-full border border-yellow-300 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-yellow-400 font-black text-[8px] leading-none uppercase mb-0.5 tracking-widest">Only</span>
                  <span className="text-red-500 font-black text-xl leading-none mb-0.5 animate-pulse drop-shadow-sm">1</span>
                  <span className="text-white font-bold text-[8px] leading-none uppercase tracking-wider">Slot Left</span>
                </div>
              </div>
            </div>

            {/* Star/Seal FOMO Badge (Desktop - Right Side next to text) */}
            <div className="hidden md:block absolute top-6 right-2 lg:right-12 xl:right-20 z-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="relative w-32 h-32 flex items-center justify-center group cursor-pointer">
                
                {/* Outer Glow */}
                <div className="absolute -inset-2 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/40 transition-colors duration-500"></div>

                {/* Spinning Golden Starburst SVG */}
                <div className="absolute inset-0 text-yellow-400 drop-shadow-2xl animate-[spin_12s_linear_infinite] group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path fill="currentColor" d="M100,5 119,25 147,18 156,45 182,53 176,80 196,100 176,120 182,147 156,155 147,182 119,175 100,195 81,175 53,182 44,155 18,147 24,120 4,100 24,80 18,53 44,45 53,18 81,25 Z"/>
                  </svg>
                </div>
                
                {/* Inner Dark Circle */}
                <div className="relative z-10 w-24 h-24 bg-slate-900 rounded-full border-2 border-yellow-300 flex flex-col items-center justify-center text-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <span className="text-yellow-400 font-black text-[10px] leading-none uppercase mb-1 tracking-widest">Only</span>
                  <span className="text-red-500 font-black text-3xl leading-none mb-1 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">1</span>
                  <span className="text-white font-bold text-[10px] leading-none uppercase tracking-wider">Slot Left</span>
                </div>
                
                {/* Hover Tooltip (Optional, for more context) */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
                  We take only 5 premium projects/month
                </div>
              </div>
            </div>

            {/* Website line — same 3-color style, 3 words */}
            <p className="text-center px-2 mb-3 sm:mb-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <span
                className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <span className="text-yellow-300 drop-shadow-sm">We</span>{' '}
                <span className="text-white drop-shadow-md">Build</span>{' '}
                <span className="text-emerald-300 drop-shadow-sm">Websites</span>
              </span>
            </p>

            <p className="text-xs sm:text-sm md:text-base text-blue-200/90 mb-4 sm:mb-6 md:mb-8 px-2 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              All Government & Private Services Under One Roof • Same Day Work • Website, Software & Digital Work
            </p>
            <div className="mb-4 sm:mb-6 px-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <a
                href="https://wa.me/917895094129?text=Hello,%20mujhe%20website%20ya%20software%20banwana%20hai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-bold text-white hover:bg-white/25 transition shadow-lg"
              >
                Get Your Website Built — 7895094129 →
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 md:gap-4 justify-center mb-6 sm:mb-8 md:mb-10 px-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl active:scale-95 transition transform hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Apply for Services</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Link
                href="/payment"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl active:scale-95 transition transform hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="flex items-center gap-1">
                  Make Payment
                </span>
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 border-2 border-white/30 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition transform hover:scale-105 active:scale-95 text-center w-full sm:w-auto"
              >
                View All Services
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20 hover:bg-white/15 active:bg-white/20 transition">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-blue-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">पता / Address</h3>
                  <p className="text-blue-100 text-[10px] sm:text-xs md:text-sm leading-relaxed">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah, UP
                  </p>
                  <p className="text-yellow-300 text-[10px] sm:text-xs mt-1 sm:mt-2">📍 आसानी से मिल जाएगा</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20 hover:bg-white/15 active:bg-white/20 transition">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-green-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Phone</h3>
                  <a href="tel:9193898182" className="text-yellow-300 hover:text-yellow-200 active:text-yellow-100 font-bold text-sm sm:text-base md:text-lg transition block break-all">
                    9193898182, 7895094129
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20 hover:bg-white/15 active:bg-white/20 transition sm:col-span-2 lg:col-span-1">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-orange-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Email</h3>
                  <a href="mailto:arpitcsc1707@gmail.com" className="text-yellow-300 hover:text-yellow-200 active:text-yellow-100 text-[10px] sm:text-xs md:text-sm transition break-all block">
                    arpitcsc1707@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 animate-fade-in overflow-y-auto py-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden
          />

          {/* Modal Container */}
          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative z-10 w-full max-w-lg animate-scale-in my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-400/20">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-4 sm:px-5 py-3 sm:py-4">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">Service Application</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold mb-1">Apply for Services</h3>
                    <p className="text-xs text-blue-100">Fill the form below to get started</p>
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

              {/* Form Content */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <ContactForm embedded />
              </div>

              {/* Footer Note */}
              <div className="px-4 sm:px-5 py-2 sm:py-3 bg-blue-50/50 border-t border-blue-100">
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
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
    </section>
  );
}







