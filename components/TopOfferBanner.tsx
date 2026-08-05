'use client';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function TopOfferBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white py-2 relative z-50 overflow-hidden shadow-md">
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 w-[200%] animate-[shine_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none" />
      
      <div className="container mx-auto px-4 pr-10">
        <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm font-bold text-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse flex-shrink-0" />
            <span><span className="text-yellow-300">🔥 Special Offer:</span> Get 20% Off on E-Commerce & Business Websites!</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase tracking-wider hidden sm:inline-block">Valid only for this week</span>
            <a 
              href="https://wa.me/917895094129?text=Hello,%20I%20want%20the%2020%25%20Off%20Offer%20on%20Website%20Development."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-red-900 px-3 py-1 rounded-full text-xs transition-transform hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
            >
              Claim Offer <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
        aria-label="Close banner"
      >
        ✕
      </button>
    </div>
  );
}
