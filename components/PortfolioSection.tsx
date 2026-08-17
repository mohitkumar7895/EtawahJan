'use client';
import { ExternalLink, Play, ShoppingCart, Activity, GraduationCap, Building2, ChevronRight, ArrowRight, Video, Link2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Fallback items if database is empty
const FALLBACK_ITEMS = [
  {
    title: 'E-Commerce App',
    category: 'Online Store',
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-rose-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    description: 'Fully functional online store with Razorpay integration and admin panel.',
    liveUrl: '#',
    videoUrl: '#',
    photoUrl: '',
  },
  {
    title: 'Hospital CRM',
    category: 'Management System',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    description: 'Patient management, appointment booking, and automated billing software.',
    liveUrl: '#',
    videoUrl: '',
    photoUrl: '',
  },
  {
    title: 'School ERP',
    category: 'Education Software',
    icon: GraduationCap,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    description: 'Student portal, attendance tracking, and digital report cards generation.',
    liveUrl: '#',
    videoUrl: '#',
    photoUrl: '',
  },
  {
    title: 'Corporate Website',
    category: 'Business Profile',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    description: 'High-converting lead generation website with SEO optimized structure.',
    liveUrl: '#',
    videoUrl: '',
    photoUrl: '',
  },
];

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  photoUrl: string;
  videoUrl: string;
  liveUrl: string;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          // Filter only active ones, assuming API returns all if not filtered, but we filter on frontend just in case
          const activeProjects = data.filter((p: any) => p.isActive);
          setProjects(activeProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const displayItems = projects.length > 0 ? projects : FALLBACK_ITEMS;

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Our Work & Expertise
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Built for Growth. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Designed to Convert.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Take a look at some of the high-quality digital solutions we build to help businesses scale and dominate their market.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-slate-100 shadow-sm p-6 flex flex-col">
                <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="w-24 h-4 bg-slate-200 rounded-full mb-3"></div>
                <div className="w-3/4 h-6 bg-slate-200 rounded-full mb-2"></div>
                <div className="w-full h-4 bg-slate-200 rounded-full mb-2"></div>
                <div className="w-2/3 h-4 bg-slate-200 rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayItems.map((item: any, index) => (
              <div 
                key={item._id || index}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col relative overflow-hidden"
              >
                {/* Photo Header */}
                <div className="h-56 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                  {item.photoUrl ? (
                    <img 
                      src={item.photoUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient || 'from-blue-500 to-indigo-500'} opacity-10 flex items-center justify-center`}>
                      {item.icon ? (
                        <item.icon className={`w-16 h-16 ${item.text || 'text-blue-500'} opacity-50`} />
                      ) : (
                        <Briefcase className="w-16 h-16 text-slate-300" />
                      )}
                    </div>
                  )}
                  
                  {/* Overlay for actions on hover */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    {item.liveUrl && (
                      <a 
                        href={item.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        title="View Live Site"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {item.videoUrl && (
                      <a 
                        href={item.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                        title="Watch Video"
                      >
                        <Play className="w-5 h-5 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 mt-2 mb-6 flex-grow leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-sm font-semibold">
                    {item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noreferrer" className="flex items-center text-slate-700 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200">
                        <Link2 className="w-4 h-4 mr-1.5" /> Live Link
                      </a>
                    )}
                    {item.videoUrl && (
                      <a href={item.videoUrl} target="_blank" rel="noreferrer" className="flex items-center text-slate-700 hover:text-rose-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200">
                        <Video className="w-4 h-4 mr-1.5" /> Watch Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-8 py-4 font-bold text-base hover:bg-blue-600 transition-colors active:scale-95 shadow-lg shadow-slate-900/20"
          >
            Explore All Solutions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
