'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import CallbackRequestForm from '@/components/CallbackRequestForm';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  createdAt: string;
}

function parseJobTitle(notifTitle: string): string {
  const idx = notifTitle.indexOf(':');
  return idx >= 0 ? notifTitle.slice(idx + 1).trim() : notifTitle;
}

function parseSlugFromLink(link?: string): string {
  if (!link) return '';
  const parts = link.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function parseCategoryFromLink(link?: string): string {
  if (!link?.includes('admit-card')) return link?.includes('result') ? 'Results' : 'Vacancies';
  return 'Admit Cards';
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>('anonymous');
  const [expandedCallback, setExpandedCallback] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem('janseva_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('janseva_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

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

  const markAsSeen = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/seen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        setExpandedCallback((id) => (id === notificationId ? null : id));
        setTimeout(() => fetchNotifications(), 100);
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const markAllAsSeen = async () => {
    if (notifications.length === 0) return;

    try {
      const response = await fetch('/api/notifications/mark-all-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setNotifications([]);
        setExpandedCallback(null);
        setTimeout(() => fetchNotifications(), 100);
      }
    } catch (error) {
      console.error('Error marking all notifications as seen:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
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

  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      fetchNotifications();
      pollingIntervalRef.current = setInterval(() => fetchNotifications(), 5000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [userId]);

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

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={panelRef}
            className="fixed sm:absolute right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-sm bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-5rem)] sm:max-h-[560px] overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-bold text-base sm:text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-blue-600 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
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

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                  <p className="mt-2 text-sm">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => {
                    const lines = notification.message.split('\n').filter(Boolean);
                    const infoLines = lines.filter((l) => !l.includes('Callback'));
                    const jobTitle = parseJobTitle(notification.title);

                    return (
                      <div
                        key={notification._id}
                        className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1.5 break-words">
                              {notification.title}
                            </h4>
                            <ul className="space-y-0.5 mb-2">
                              {infoLines.map((line, i) => (
                                <li
                                  key={i}
                                  className="text-[11px] sm:text-xs text-slate-600 font-medium"
                                >
                                  {line}
                                </li>
                              ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mb-2">
                              {notification.link && (
                                <Link
                                  href={notification.link}
                                  onClick={() => {
                                    markAsSeen(notification._id);
                                    setIsOpen(false);
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-700 font-bold"
                                >
                                  Details →
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCallback((id) =>
                                    id === notification._id ? null : notification._id
                                  )
                                }
                                className="text-[10px] text-orange-600 hover:text-orange-700 font-bold"
                              >
                                {expandedCallback === notification._id
                                  ? 'Form band karein'
                                  : '📞 Callback'}
                              </button>
                            </div>

                            {expandedCallback === notification._id && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <CallbackRequestForm
                                  compact
                                  jobTitle={jobTitle}
                                  jobSlug={parseSlugFromLink(notification.link)}
                                  category={parseCategoryFromLink(notification.link)}
                                  source="notification"
                                />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => markAsSeen(notification._id)}
                            className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0 p-1"
                            aria-label="Mark as read"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-2 bg-gray-50 flex-shrink-0 space-y-2">
                <button
                  onClick={markAllAsSeen}
                  className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-2"
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
