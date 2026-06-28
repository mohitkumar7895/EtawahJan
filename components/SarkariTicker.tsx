'use client'

import { Bell, Flame, Award, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SarkariTicker() {
  const updates = [
    { text: '🔔 UP Police Constable Bharti Exam Results - Check status instantly!', link: '/vacancies' },
    { text: '📌 PM Kisan Samman Nidhi 17th Installment - Check eligibility & register online!', link: '/services' },
    { text: '🎓 UP Scholarship 2026 Form Online Filling - Documents checklist updated!', link: '/services' },
    { text: '💳 Apply Instant E-PAN Card in 10 Minutes - Instant download available!', link: '/services' },
    { text: '💻 Special Promotion: 20% Discount on Custom Business Website & Android App Development!', link: '/services' },
    { text: '🔥 Sarkari Vacancy, Admit Card & Exam Results - Active list updated for all UP districts!', link: '/vacancies' }
  ]

  return (
    <div className="relative w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-semibold text-xs sm:text-sm py-2 shadow-md overflow-hidden z-[9999] border-b border-white/20">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* Hot Badge Label */}
        <div className="flex items-center gap-1.5 bg-white text-red-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider flex-shrink-0 shadow shadow-red-700/50">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          <span>Latest updates</span>
        </div>

        {/* Sliding Ticker Marquee */}
        <div className="relative flex-1 overflow-hidden h-5 sm:h-6">
          <div className="absolute whitespace-nowrap flex items-center gap-12 sm:gap-20 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            
            {/* Displaying Updates Twice to Create Seamless Loop */}
            {[...updates, ...updates].map((up, idx) => (
              <Link 
                key={idx} 
                href={up.link} 
                className="inline-flex items-center gap-1.5 hover:text-yellow-100 hover:underline transition"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 flex-shrink-0" />
                <span>{up.text}</span>
              </Link>
            ))}

          </div>
        </div>

        {/* Apply Quick Button */}
        <Link 
          href="/services" 
          className="hidden md:inline-flex items-center gap-1 bg-white text-zinc-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-100 transition shadow"
        >
          <span>Apply Online →</span>
        </Link>

      </div>

      {/* Modern Scrolling CSS Keyframes Injector */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
