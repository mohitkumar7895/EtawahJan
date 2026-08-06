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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
      
      <div className="bg-[#0a0f1c] rounded-3xl w-full max-w-5xl relative z-10 max-h-[95vh] overflow-y-auto py-10 sm:py-12 px-4 shadow-2xl border border-slate-800 animate-scale-in">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Background Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 max-w-4xl mx-auto">
            
            {/* Left Side: Offer / Copy */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-6 border border-red-500/20">
                Wait! Don&apos;t leave yet
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">20% Off</span> Your Project!
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
                Book a free consultation today and lock in our special introductory discount on all web development and software services.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Free Business Growth Strategy',
                  'Custom Design Mockup',
                  'Same Day Delivery Available'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <a 
                href="https://wa.me/917895094129?text=Hello,%20I%20want%20to%20claim%20the%2020%25%20Off%20Exit%20Offer."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 px-6 py-3.5 rounded-xl font-black transition-all active:scale-95 w-full sm:w-auto shadow-lg shadow-yellow-500/25"
              >
                Chat on WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto w-full mt-8 lg:mt-0">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="text-center md:text-left mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Or Request a Callback</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">Fill the form below and we&apos;ll call you in 5 mins.</p>
                </div>
                <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <ContactForm embedded />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
