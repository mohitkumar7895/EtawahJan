'use client';

import { useEffect, useState } from 'react';
import { Megaphone, ExternalLink, Calendar } from 'lucide-react';
import { getAnnouncements, type Announcement } from '@/lib/api';
import Link from 'next/link';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    
    const interval = setInterval(() => {
      loadAnnouncements();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      loadAnnouncements();
    };

    window.addEventListener('janseva:notifications:updated', handler as EventListener);
    return () => window.removeEventListener('janseva:notifications:updated', handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <section className="py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-2 sm:mb-3 shadow-lg">
              <Megaphone className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Announcements
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              सूचनाएं - Important Updates & Notices
            </p>
          </div>

          {/* Announcements List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Announcements Yet
              </h3>
              <p className="text-gray-600 text-sm">
                Check back later for important updates and notices.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id || announcement._id}
                  className="group relative bg-gradient-to-br from-white via-pink-50/30 to-red-50/40 rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-pink-200 hover:border-pink-400 p-3 sm:p-4 flex flex-col w-full max-w-full overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Animated Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-rose-400/0 to-red-400/0 group-hover:from-pink-400/10 group-hover:via-rose-400/15 group-hover:to-red-400/10 transition-all duration-700 rounded-lg opacity-0 group-hover:opacity-100 blur-xl"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-lg"></div>

                  {/* Title Section */}
                  <div className="flex items-start gap-2 mb-2.5 relative z-10">
                    <div className="bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 p-1.5 rounded-md flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-pink-200/50">
                      <Megaphone className="w-4 h-4 text-pink-600 group-hover:text-rose-600 transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-pink-700 text-sm sm:text-base leading-snug break-words line-clamp-2 transition-colors duration-300">
                        {announcement.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description Section */}
                  {announcement.description && (
                    <div className="mb-3 flex-1 min-h-0 relative z-10">
                      <p className="text-gray-700 group-hover:text-gray-800 text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden transition-colors duration-300">
                        {announcement.description}
                      </p>
                    </div>
                  )}

                  {/* Footer Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 pt-2.5 border-t border-gray-200 group-hover:border-pink-200 mt-auto relative z-10 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-pink-600 font-medium transition-colors duration-300">
                      <Calendar className="w-3 h-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <span className="whitespace-nowrap">
                        {announcement.createdAt
                          ? new Date(announcement.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recently'}
                      </span>
                    </div>
                    {announcement.link && (
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-pink-600 hover:text-rose-600 font-medium text-xs transition-all duration-300 whitespace-nowrap hover:underline group-hover:scale-105"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                      </a>
                    )}
                  </div>

                  {/* Pulse Animation Ring */}
                  <div className="absolute inset-0 rounded-lg border-2 border-pink-300/0 group-hover:border-pink-300/40 transition-all duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

