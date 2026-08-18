'use client';
import { ExternalLink, Play, ShoppingCart, Activity, GraduationCap, Building2, ChevronRight, ArrowRight, Video, Link2, Briefcase, X } from 'lucide-react';
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

export default function PortfolioSection({ hideHeader = false, limit }: { hideHeader?: boolean; limit?: number } = {}) {
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
  const limitedItems = limit ? displayItems.slice(-limit).reverse() : displayItems;

  return (
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {!hideHeader && (
          <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 backdrop-blur-sm text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm border border-blue-200/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              Our Digital Portfolio
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Showcasing Our <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                Latest Projects
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
              Take a look at some of the premium websites, apps, and custom software we have recently delivered. 
              <strong> Loved our work? Let's build yours today!</strong>
            </p>

            <div className="flex justify-center">
              <a 
                href="https://wa.me/917895094129?text=Hello,%20I%20want%20to%20get%20a%20website%20built." 
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                <div className="bg-green-500 p-1.5 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </div>
                <span>Call / WhatsApp: <span className="text-blue-300 group-hover:text-white transition-colors">7895094129</span></span>
              </a>
            </div>
          </div>
        )}

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
            {limitedItems.map((item: any, index) => (
              <div 
                key={item._id || index}
                className="group bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col relative overflow-hidden"
              >
                {/* Photo Header */}
                <div className="h-60 w-full relative overflow-hidden bg-slate-50">
                  {item.videoUrl && item.videoUrl !== '#' ? (
                    <video
                      className="w-full h-full object-contain bg-slate-900"
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.photoUrl || undefined}
                    >
                      <source src={item.videoUrl} />
                    </video>
                  ) : item.photoUrl ? (
                    <>
                      <img 
                        src={item.photoUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient || 'from-indigo-500 via-purple-500 to-pink-500'} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                      {item.icon ? (
                        <item.icon className="w-20 h-20 text-white/90 transform group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-md" />
                      ) : (
                        <Briefcase className="w-20 h-20 text-white/90 transform group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-md" />
                      )}
                    </div>
                  )}
                  
                  {/* Category Badge Floating on Image */}
                  <div className="absolute top-5 left-5 z-20 pointer-events-none">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-white/20 pointer-events-auto">
                      {item.category || 'Project'}
                    </span>
                  </div>

                  {/* Overlay for actions on hover (Only show if not a video, otherwise it blocks video controls) */}
                  {(!item.videoUrl || item.videoUrl === '#') && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20 pointer-events-none group-hover:pointer-events-auto">
                      {item.liveUrl && item.liveUrl !== '#' && (
                        <a 
                          href={item.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                          title="View Live Site"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 text-[15px] mt-1 mb-8 flex-grow leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto flex flex-wrap gap-3">
                    {item.liveUrl && item.liveUrl !== '#' ? (
                      <a href={item.liveUrl} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-blue-200 transition-all group/btn">
                        <Link2 className="w-4 h-4 mr-2 text-slate-400 group-hover/btn:text-blue-500" />
                        Live Demo
                      </a>
                    ) : (
                      <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-slate-50 text-slate-400 text-sm font-medium rounded-xl border border-slate-100 cursor-not-allowed">
                        <Link2 className="w-4 h-4 mr-2 opacity-50" />
                        No Demo
                      </span>
                    )}
                    
                    {/* Watch Video button removed from here because video is directly playable above */}
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
