'use client';

import { useEffect, useRef, useState } from 'react';
import { Rocket, MapPin, Star, Headset } from 'lucide-react';

const STATS = [
  { id: 1, label: 'Projects Delivered', value: 150, suffix: '+', icon: Rocket, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 2, label: 'Cities Covered', value: 50, suffix: '+', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, label: 'Client Satisfaction', value: 100, suffix: '%', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 4, label: 'Priority Support', value: 24, suffix: '/7', icon: Headset, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

function Counter({ target, duration = 2000 }: { target: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = target / (duration / 16); // 60fps approx
    let timer: NodeJS.Timeout;

    const updateCount = () => {
      start += increment;
      if (start < target) {
        setCount(Math.ceil(start));
        timer = setTimeout(updateCount, 16);
      } else {
        setCount(target);
      }
    };

    updateCount();
    return () => clearTimeout(timer);
  }, [isVisible, target, duration]);

  return <span ref={countRef}>{count}</span>;
}

export default function AnimatedCounters() {
  return (
    <section className="py-16 sm:py-20 bg-white border-y border-slate-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl -mr-32 -mb-32 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Trusted by Businesses Across <span className="text-blue-600">India & Globally</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat) => (
            <div 
              key={stat.id} 
              className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2} />
              </div>
              
              <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2 tracking-tight flex items-center">
                <Counter target={stat.value} />
                <span className={stat.color}>{stat.suffix}</span>
              </div>
              
              <p className="text-sm sm:text-base font-bold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
