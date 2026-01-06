'use client';

import { useEffect, useState } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';
import { getAnnouncements, type Announcement } from '@/lib/api';
import Link from 'next/link';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

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
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      loadAnnouncements();
    };

    window.addEventListener('janseva:notifications:updated', handler as EventListener);
    return () => window.removeEventListener('janseva:notifications:updated', handler as EventListener);
  }, []);

  if (announcements.length === 0) {
    return null; // Don't show section if no announcements
  }

  return (
    <section id="announcements" className="py-6 sm:py-8 md:py-10 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-2 sm:mb-3">
            <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Announcements
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            सूचनाएं - Important Updates & Notices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {announcements.slice(0, 6).map((announcement, index) => (
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
                <span className="text-xs text-gray-500 group-hover:text-pink-600 font-medium whitespace-nowrap transition-colors duration-300">
                  {announcement.createdAt
                    ? new Date(announcement.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </span>
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

        {announcements.length > 6 && (
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition"
            >
              <span>View All Announcements</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

