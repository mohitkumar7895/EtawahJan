'use client';

const TECHNOLOGIES = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Tailwind CSS', icon: '🌊' },
  { name: 'Razorpay', icon: '💳' },
  { name: 'AWS', icon: '☁️' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Android', icon: '📱' },
  { name: 'iOS', icon: '🍎' },
  { name: 'Figma', icon: '🎨' },
];

export default function TechStackMarquee() {
  return (
    <section className="py-6 bg-white border-y border-slate-100 overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl mb-4 text-center">
        <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">
          Trusted Modern Technologies We Use
        </p>
      </div>

      {/* Gradient Fades for edges */}
      <div className="absolute left-0 top-0 w-20 sm:w-40 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 sm:w-40 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      {/* Marquee Track */}
      <div className="flex w-[200%] animate-marquee">
        {/* Double the list to make it infinite loop seamlessly */}
        {[...TECHNOLOGIES, ...TECHNOLOGIES].map((tech, index) => (
          <div 
            key={index} 
            className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-12 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0"
          >
            <span className="text-2xl sm:text-3xl">{tech.icon}</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
