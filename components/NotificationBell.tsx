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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastNotificationIdsRef = useRef<Set<string>>(new Set());
  const hasRequestedPermissionRef = useRef(false);
  const viewedNotificationsRef = useRef<Set<string>>(new Set());
  const notificationRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return;
    }

    if (Notification.permission !== 'denied' && !hasRequestedPermissionRef.current) {
      hasRequestedPermissionRef.current = true;
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show a welcome notification
        new Notification('Jan Seva Kendra', {
          body: 'आपको अब सभी अपडेट की सूचना मिलेगी!',
          icon: '/jan-seva-logo-1.png',
          badge: '/jan-seva-logo-1.png',
        });
      }
    } else {
      setNotificationPermission(Notification.permission);
    }
  };

  // Show browser notification - WhatsApp style
  const showBrowserNotification = (notification: Notification) => {
    if (notificationPermission !== 'granted' || !('Notification' in window)) {
      return;
    }

    try {
      // WhatsApp style notification - with sound and vibration
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/jan-seva-logo-1.png',
        badge: '/jan-seva-logo-1.png',
        tag: notification._id || notification.id,
        requireInteraction: false,
        silent: false, // Sound enabled
        vibrate: [200, 100, 200], // Vibration pattern (if supported)
      });

      // WhatsApp style: Notification with sound enabled (browser handles sound)

      browserNotification.onclick = () => {
        window.focus();
        // Mark as read when clicked
        const notificationId = (notification._id || notification.id || '').toString();
        markAsRead(notificationId);
        
        if (notification.link) {
          window.open(notification.link, '_blank');
        }
        browserNotification.close();
      };

      // Auto close after 7 seconds (WhatsApp style)
      setTimeout(() => {
        browserNotification.close();
      }, 7000);
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  };

  // Fetch notifications - SIMPLE: just get unread ones
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?unreadOnly=true&limit=20');
      const data = await response.json();
      
      if (data.notifications) {
        const newNotifications = data.notifications;
        const currentIds = new Set(newNotifications.map((n: Notification) => (n._id || n.id || '').toString()));
        const lastIds = lastNotificationIdsRef.current;

        // Find NEW notifications (for browser popup)
        const newNotificationsList = newNotifications.filter((n: Notification) => {
          const id = (n._id || n.id || '').toString();
          return !lastIds.has(id);
        });

        // Show browser notifications for NEW ones
        if (newNotificationsList.length > 0 && notificationPermission === 'granted') {
          newNotificationsList.forEach((notification: Notification) => {
            showBrowserNotification(notification);
          });
        }

        // Update last seen IDs
        lastNotificationIdsRef.current = currentIds;

        // SIMPLE: Filter out already viewed notifications
        const unviewedNotifications = newNotifications.filter((n: Notification) => {
          const id = (n._id || n.id || '').toString();
          return !viewedNotificationsRef.current.has(id) && !n.isRead;
        });

        // SIMPLE: Just set the notifications (no complex merging)
        setNotifications(unviewedNotifications);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read and remove from list immediately
  const markAsRead = async (notificationId: string) => {
    // Skip if already marked as viewed
    if (viewedNotificationsRef.current.has(notificationId)) {
      return;
    }

    // Mark as viewed
    viewedNotificationsRef.current.add(notificationId);
    
    // Immediately remove from UI
    setNotifications(prev => 
      prev.filter(n => {
        const id = (n._id || n.id || '').toString();
        return id !== notificationId;
      })
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Remove from tracking
    lastNotificationIdsRef.current.delete(notificationId);
    notificationRefs.current.delete(notificationId);
    
    // Mark as read in backend (fire and forget - don't wait)
    fetch(`/api/notifications/${notificationId}`, {
      method: 'PUT',
    }).catch(() => {
      // Silent fail
    });
  };

  // Mark all as read - clear everything immediately
  const markAllAsRead = async () => {
    // Clear from UI immediately
    setNotifications([]);
    setUnreadCount(0);
    
    // Clear all tracking
    lastNotificationIdsRef.current.clear();
    notificationRefs.current.clear();
    viewedNotificationsRef.current.clear();
    
    // Mark all as read in backend (fire and forget)
    fetch('/api/notifications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markAllAsRead: true }),
    }).catch(() => {
      // Silent fail
    });
  };

  // Clear all notifications - pura khali kar do (database se bhi delete)
  const clearAllNotifications = async () => {
    // Immediately clear from UI
    setNotifications([]);
    setUnreadCount(0);
    
    // Clear all tracking
    lastNotificationIdsRef.current.clear();
    notificationRefs.current.clear();
    viewedNotificationsRef.current.clear();
    
    // Delete ALL notifications from database
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('✅ All notifications deleted from database');
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
      // Still mark as read if delete fails
      markAllAsRead();
    }
  };

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Request permission after a short delay (better UX)
      const timer = setTimeout(() => {
        if (Notification.permission === 'default') {
          requestNotificationPermission();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll every 5 seconds (simple and efficient)
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, [notificationPermission]);

  // SIMPLE: When dropdown opens, mark all as read after user sees them
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      // User opened dropdown - ek baar dekh liya to mark as read
      const timer = setTimeout(() => {
        // Mark all as viewed
        notifications.forEach((notification) => {
          const notificationId = (notification._id || notification.id || '').toString();
          viewedNotificationsRef.current.add(notificationId);
        });
        
        // Clear from UI
        setNotifications([]);
        setUnreadCount(0);
        
        // Mark all as read in backend
        markAllAsRead();
      }, 500); // 500ms - user ne dekh liya

      return () => clearTimeout(timer);
    }
  }, [isOpen, notifications]);

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          const wasOpen = isOpen;
          setIsOpen(!isOpen);
          
          if (!wasOpen) {
            // Opening dropdown - fetch fresh notifications
            fetchNotifications();
          } else {
            // Closing dropdown - clear viewed notifications ref if all are read
            if (notifications.length === 0) {
              viewedNotificationsRef.current.clear();
            }
          }
          
          // Request permission if not granted when user clicks bell
          if (notificationPermission === 'default' && 'Notification' in window) {
            requestNotificationPermission();
          }
        }}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
        aria-label="Notifications"
        title={notificationPermission === 'denied' ? 'Enable notifications in browser settings' : 'Notifications'}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {notificationPermission === 'denied' && (
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white" title="Notifications blocked" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg">Notifications</h3>
              {notificationPermission !== 'granted' && 'Notification' in window && (
                <button
                  onClick={requestNotificationPermission}
                  className="text-xs px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded transition"
                  title="Enable browser notifications"
                >
                  🔔 Enable
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition"
                  title="Clear all notifications"
                >
                  <X className="w-4 h-4" />
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
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No unread notifications</p>
                    <p className="text-xs mt-1 text-gray-400">Read notifications are automatically hidden</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const notificationId = (notification._id || notification.id || '').toString();
                    const isUnread = !notification.isRead;
                    
                    return (
                      <div
                        key={notificationId}
                        ref={(el) => {
                          if (el) {
                            notificationRefs.current.set(notificationId, el);
                          } else {
                            notificationRefs.current.delete(notificationId);
                          }
                        }}
                        data-notification-id={notificationId}
                        className={`p-4 hover:bg-gray-50 transition-all cursor-pointer animate-in slide-in-from-right ${
                          isUnread ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' : ''
                        }`}
                        onClick={() => {
                          // WhatsApp style: Click = mark as read and remove immediately
                          markAsRead(notificationId);
                          
                          // Open link if available
                          if (notification.link) {
                            setTimeout(() => {
                              window.open(notification.link, '_blank');
                            }, 50);
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
                  })
                )}
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

