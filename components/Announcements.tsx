'use client';

import { useEffect, useState } from 'react';
import { Megaphone, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getActiveAnnouncements, type Announcement } from '@/lib/api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Fetch announcements on mount and when updated event is dispatched
  useEffect(() => {
    fetchAnnouncements();
    
    // Listen for announcements update event from admin panel
    const handleUpdate = () => {
      fetchAnnouncements();
    };
    window.addEventListener('janseva:announcements:updated', handleUpdate);
    
    return () => {
      window.removeEventListener('janseva:announcements:updated', handleUpdate);
    };
  }, []);

  // Auto-scroll through announcements
  useEffect(() => {
    if (!isAutoScrolling || announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // Change announcement every 5 seconds

    return () => clearInterval(interval);
  }, [announcements.length, isAutoScrolling]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getActiveAnnouncements();
      setAnnouncements(data);
      setCurrentIndex(0); // Reset to first announcement
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
    // If current announcement is dismissed, move to next
    if (announcements[currentIndex]?.id === id || announcements[currentIndex]?._id === id) {
      const nextIndex = (currentIndex + 1) % announcements.length;
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id || announcement._id || '')
  );

  // Ensure currentIndex is within bounds
  useEffect(() => {
    if (visibleAnnouncements.length > 0 && currentIndex >= visibleAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [visibleAnnouncements.length, currentIndex]);

  if (loading) {
    return null;
  }

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  // Safety check: ensure currentIndex is valid
  const safeIndex = Math.min(currentIndex, visibleAnnouncements.length - 1);
  const currentAnnouncement = visibleAnnouncements[safeIndex];

  // Final safety check
  if (!currentAnnouncement) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl relative overflow-hidden">
      {/* Animated background pattern - using simple dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Announcement Banner */}
          <div 
            className="bg-red-500/20 backdrop-blur-md rounded-xl shadow-2xl border-2 border-red-300/40 p-4 sm:p-6 relative animate-fade-in transition-all duration-500"
            key={currentAnnouncement.id || currentAnnouncement._id}
          >
            {/* Close button */}
            <button
              onClick={() => handleDismiss(currentAnnouncement.id || currentAnnouncement._id || '')}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm z-20"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3 sm:gap-4 pr-8 sm:pr-12">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 sm:p-3 bg-yellow-400/20 rounded-full border-2 border-yellow-300/50 animate-pulse">
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-lg">
                    {currentAnnouncement.title}
                  </h3>
                  <div className="flex items-center gap-1 bg-red-500/80 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-bounce">
                    <AlertCircle className="w-3 h-3" />
                    <span>Important</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-white/95 leading-relaxed mb-3">
                  {currentAnnouncement.description}
                </p>
                <div className="text-xs sm:text-sm text-white/80">
                  {currentAnnouncement.createdAt && (
                    <span>
                      {new Date(currentAnnouncement.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation dots and arrows (if multiple announcements) */}
            {visibleAnnouncements.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm z-20"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm z-20"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-white/20">
                  {visibleAnnouncements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsAutoScrolling(false);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-8 bg-yellow-400'
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to announcement ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
