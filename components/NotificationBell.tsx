'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, ExternalLink } from 'lucide-react';

interface Notification {
  _id: string;
  id?: string;
  type: 'vacancy' | 'announcement';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?unreadOnly=false&limit=20');
      const data = await response.json();
      
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => 
            n._id === notificationId || n.id === notificationId
              ? { ...n, isRead: true }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Listen for custom events when vacancies/announcements are updated
  useEffect(() => {
    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('janseva:vacancies:updated', handleUpdate);
    window.addEventListener('janseva:announcements:updated', handleUpdate);

    return () => {
      window.removeEventListener('janseva:vacancies:updated', handleUpdate);
      window.removeEventListener('janseva:announcements:updated', handleUpdate);
    };
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="font-bold text-lg">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const notificationId = notification._id || notification.id || '';
                  const isUnread = !notification.isRead;
                  
                  return (
                    <div
                      key={notificationId}
                      className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                        isUnread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => {
                        if (isUnread) {
                          markAsRead(notificationId);
                        }
                        if (notification.link) {
                          window.open(notification.link, '_blank');
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          isUnread ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm font-semibold ${
                              isUnread ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            {notification.link && (
                              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              notification.type === 'vacancy'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {notification.type === 'vacancy' ? 'Vacancy' : 'Announcement'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <a
                href={notifications[0]?.type === 'vacancy' ? '/vacancies' : '/'}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View All
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

