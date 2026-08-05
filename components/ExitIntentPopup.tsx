'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import ContactForm from './ContactForm';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('exitIntentTriggered');
    if (hasSeenPopup === 'true') {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves out of the top of the window
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitIntentTriggered', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 bg-white/50 md:bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* Left Side: Offer / Copy */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-900 to-indigo-950 p-8 sm:p-10 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider mb-6 border border-red-500/30">
              Wait! Don&apos;t leave yet
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              Get <span className="text-yellow-400">20% Off</span> Your Website Project!
            </h2>
            
            <p className="text-blue-100 text-sm sm:text-base mb-8 leading-relaxed">
              Book a free consultation today and lock in our special introductory discount on all web development and software services.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Free Business Growth Strategy',
                'Custom Design Mockup',
                'Same Day Delivery Available'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-blue-50">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <a 
              href="https://wa.me/917895094129?text=Hello,%20I%20want%20to%20claim%20the%2020%25%20Off%20Exit%20Offer."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-3.5 rounded-xl font-bold transition-transform active:scale-95 w-full shadow-lg"
            >
              Chat on WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-5 sm:p-8 md:p-10 bg-slate-50 flex flex-col justify-center">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Or Request a Callback</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">Fill the form below and we&apos;ll call you in 5 mins.</p>
          </div>
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-y-auto max-h-[50vh] md:max-h-none">
            <ContactForm embedded />
          </div>
        </div>

      </div>
    </div>
  );
}
