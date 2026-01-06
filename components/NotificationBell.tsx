'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>('anonymous');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Generate or retrieve user ID from localStorage
  useEffect(() => {
    let storedUserId = localStorage.getItem('janseva_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('janseva_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId || userId === 'anonymous') return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as seen
  const markAsSeen = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Remove from local state immediately
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        // Refresh to get latest from server
        setTimeout(() => {
          fetchNotifications();
        }, 100);
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  // Mark all as seen
  const markAllAsSeen = async () => {
    if (notifications.length === 0) return;
    
    try {
      const response = await fetch('/api/notifications/mark-all-seen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Clear local state immediately
        setNotifications([]);
        // Refresh to get latest from server
        setTimeout(() => {
          fetchNotifications();
        }, 100);
      }
    } catch (error) {
      console.error('Error marking all notifications as seen:', error);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the bell button
        if (!target.closest('button[aria-label="Notifications"]')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Poll for new notifications every 5 seconds for faster updates
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling
      pollingIntervalRef.current = setInterval(() => {
        fetchNotifications();
      }, 5000); // 5 seconds for faster updates
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [userId]);

  // Listen for custom events (when admin adds new notification)
  useEffect(() => {
    const handleNotificationUpdate = () => {
      if (userId && userId !== 'anonymous') {
        fetchNotifications();
      }
    };

    window.addEventListener('janseva:notifications:updated', handleNotificationUpdate);
    return () => {
      window.removeEventListener('janseva:notifications:updated', handleNotificationUpdate);
    };
  }, [userId]);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-white hover:text-blue-200 transition-colors rounded-md hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div 
            ref={panelRef}
            className="fixed sm:absolute right-0 sm:right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-sm bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-5rem)] sm:max-h-[500px] overflow-hidden flex flex-col transform transition-all duration-200 ease-out"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-bold text-base sm:text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-blue-600 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 transition-colors p-1 rounded-md hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-xs sm:text-sm">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs sm:text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-3 sm:p-4 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-blue-500"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 break-words">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-[11px] sm:text-xs mb-2 line-clamp-2 break-words">
                            {notification.message}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {notification.link && (
                              <Link
                                href={notification.link}
                                onClick={() => {
                                  markAsSeen(notification._id);
                                  setIsOpen(false);
                                }}
                                className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                              >
                                View
                                <span>→</span>
                              </Link>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => markAsSeen(notification._id)}
                          className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0 p-1 rounded-md hover:bg-green-50"
                          aria-label="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50 flex-shrink-0">
                <button
                  onClick={markAllAsSeen}
                  className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium py-1.5 sm:py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

