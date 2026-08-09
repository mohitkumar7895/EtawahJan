'use client';

import { Star, StarHalf, Quote, ExternalLink } from 'lucide-react';
import React from 'react';

const REVIEWS_ROW_1 = [
  {
    name: 'Rahul Sharma',
    role: 'Founder, RetailMart',
    rating: 5,
    text: 'We hired them to build our E-Commerce Mobile App. They delivered it in just 3 weeks! The UI is incredibly smooth, and our online sales have increased by 40% since the launch.',
    color: 'bg-blue-500'
  },
  {
    name: 'Priya Patel',
    role: 'Director, Elite Public School',
    rating: 4,
    text: 'The Custom School ERP they developed for us is flawless. From student attendance to fee management and digital report cards, everything is now automated. Highly recommended!',
    color: 'bg-emerald-500'
  },
  {
    name: 'Amit Verma',
    role: 'CEO, Verma Enterprises',
    rating: 4,
    text: 'Best web development agency I have worked with. They built a corporate website for us with excellent SEO. We are now ranking on Google Page 1 for our main keywords.',
    color: 'bg-orange-500'
  },
  {
    name: 'Neha Singh',
    role: 'Marketing Head, StyleCo',
    rating: 5,
    text: 'Their team is extremely professional. They redesigned our outdated website into a modern, high-converting landing page. Our lead generation has literally doubled.',
    color: 'bg-purple-500'
  }
];

const REVIEWS_ROW_2 = [
  {
    name: 'Sandeep Gupta',
    role: 'Owner, Gupta Electronics',
    rating: 3,
    text: 'They built a custom Billing and Inventory Management Software for my 3 shops. It is so easy to use, and I can track my daily sales directly from my mobile phone now.',
    color: 'bg-rose-500'
  },
  {
    name: 'Vikas Tiwari',
    role: 'Director, Tiwari Hospitals',
    rating: 3.5,
    text: 'Excellent Hospital CRM development. Patient appointments, doctor schedules, and billing are all integrated perfectly. Their 24/7 support is also very responsive.',
    color: 'bg-teal-500'
  },
  {
    name: 'Anjali Desai',
    role: 'Founder, FoodieExpress',
    rating: 4.5,
    text: 'We needed a food delivery app similar to Zomato for our local city. They built the user app, delivery boy app, and admin panel flawlessly. Great pricing too!',
    color: 'bg-indigo-500'
  },
  {
    name: 'Manish Kumar',
    role: 'CEO, TechSolutions',
    rating: 5,
    text: 'Top-notch UI/UX design and React development. They understand business requirements very well and deliver bug-free code. Will definitely work with them again.',
    color: 'bg-amber-500'
  }
];

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="w-[190px] sm:w-[280px] md:w-[320px] shrink-0 bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
      <div className="flex justify-between items-start mb-3 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${review.color} text-white flex items-center justify-center font-black text-sm sm:text-lg shadow-md`}>
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-[13px] sm:text-sm text-slate-900 leading-tight truncate max-w-[90px] sm:max-w-none">{review.name}</h4>
            <p className="text-[9px] sm:text-xs text-slate-500 font-medium truncate max-w-[90px] sm:max-w-none">{review.role}</p>
          </div>
        </div>
        <Quote className="w-5 h-5 sm:w-7 sm:h-7 text-blue-100 shrink-0" />
      </div>
      
      <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          if (review.rating >= starIndex) {
            return <Star key={starIndex} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          } else if (review.rating >= starIndex - 0.5) {
            return <StarHalf key={starIndex} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          } else {
            return <Star key={starIndex} className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200 fill-transparent" />
          }
        })}
      </div>
      
      <p className="text-slate-600 text-[10px] sm:text-sm leading-relaxed sm:leading-relaxed font-medium line-clamp-4">
        &quot;{review.text}&quot;
      </p>
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden border-y border-slate-200">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 mb-12 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <Star className="w-4 h-4 fill-blue-600" />
            Client Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Don&apos;t Just Take <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Our Word</span> For It
          </h2>
        </div>
      </div>

      {/* Marquee Row 1 (Moving Left) */}
      <div className="relative w-full flex overflow-x-hidden mb-6 group">
        <div className="flex animate-marquee-left gap-6 px-3">
          {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Moving Right) */}
      <div className="relative w-full flex overflow-x-hidden group">
        <div className="flex animate-marquee-right gap-6 px-3">
          {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-12 sm:mt-16 text-center">
        <a
          href="https://wa.me/917895094129"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95"
        >
          <span>Start Your Project Today</span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <style jsx global>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marqueeLeft 40s linear infinite;
          width: max-content;
        }
        .animate-marquee-right {
          animation: marqueeRight 40s linear infinite;
          width: max-content;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
