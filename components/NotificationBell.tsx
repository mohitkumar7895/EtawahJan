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
        // Remove from local state
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  // Mark all as seen
  const markAllAsSeen = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-seen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error marking all notifications as seen:', error);
    }
  };

  // When notification panel opens, automatically mark all as seen
  useEffect(() => {
    if (isOpen && notifications.length > 0 && userId && userId !== 'anonymous') {
      // Mark all notifications as seen when panel opens
      markAllAsSeen();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling
      pollingIntervalRef.current = setInterval(() => {
        fetchNotifications();
      }, 30000); // 30 seconds
      
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
        className="relative p-2 text-white hover:text-blue-200 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
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
                                onClick={() => markAsSeen(notification._id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                View →
                              </Link>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => markAsSeen(notification._id)}
                          className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
                          aria-label="Mark as read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <button
                  onClick={markAllAsSeen}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
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

