// Service Worker for Background Notifications
// This allows notifications even when website is closed

const CACHE_NAME = 'jan-seva-chat-v1';
const API_BASE = '/api/chats';

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Background message checking
async function checkForNewMessages(phoneNumber, lastMessageTime) {
  try {
    const response = await fetch(`${API_BASE}?userPhone=${encodeURIComponent(phoneNumber)}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const chatData = await response.json();
    
    if (chatData.messages && chatData.messages.length > 0) {
      // Find new admin messages
      const adminMessages = chatData.messages.filter((msg) => {
        if (msg.sender !== 'admin') return false;
        const msgTime = new Date(msg.timestamp);
        if (lastMessageTime && msgTime > new Date(lastMessageTime)) {
          return true;
        }
        return false;
      });

      if (adminMessages.length > 0) {
        const latestMsg = adminMessages[adminMessages.length - 1];
        return {
          message: latestMsg,
          timestamp: latestMsg.timestamp,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Service Worker: Error checking messages:', error);
    return null;
  }
}

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-messages') {
    event.waitUntil(handlePeriodicSync());
  }
});

// Handle periodic sync
async function handlePeriodicSync() {
  try {
    // Get stored phone numbers and last message times
    const storedData = await getStoredData();
    
    if (storedData && storedData.phoneNumber) {
      await performCheck(
        storedData.phoneNumber,
        storedData.lastAdminMessageTime
      );
    }
  } catch (error) {
    console.error('Service Worker: Periodic sync error:', error);
  }
}

// Message handler from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Received message', event.data);
  
  if (event.data && event.data.type === 'START_MONITORING') {
    const { phoneNumber, lastAdminMessageTime } = event.data;
    
    // Store data for background checking
    setStoredData({
      phoneNumber,
      lastAdminMessageTime,
      lastCheck: Date.now(),
    });

    // Start periodic checking
    startBackgroundChecking(phoneNumber, lastAdminMessageTime);
  } else if (event.data && event.data.type === 'STOP_MONITORING') {
    // Stop background checking
    if (self.checkingInterval) {
      clearInterval(self.checkingInterval);
      self.checkingInterval = null;
    }
  } else if (event.data && event.data.type === 'UPDATE_LAST_MESSAGE_TIME') {
    // Update last message time
    getStoredData().then((data) => {
      if (data) {
        setStoredData({
          ...data,
          lastAdminMessageTime: event.data.lastAdminMessageTime,
        });
      }
    });
  }
});

// Start background checking
function startBackgroundChecking(phoneNumber, lastAdminMessageTime) {
  // Clear existing interval
  if (self.checkingInterval) {
    clearInterval(self.checkingInterval);
  }

  // Register periodic background sync if supported
  if ('periodicSync' in self.registration) {
    self.registration.periodicSync.register('check-messages', {
      minInterval: 30000, // 30 seconds (minimum)
    }).catch((error) => {
      console.log('Service Worker: Periodic sync not supported, using fallback:', error);
      // Fallback to interval-based checking
      startIntervalChecking(phoneNumber, lastAdminMessageTime);
    });
  } else {
    // Fallback: Use interval checking (works when service worker is active)
    startIntervalChecking(phoneNumber, lastAdminMessageTime);
  }
}

// Interval-based checking (fallback)
function startIntervalChecking(phoneNumber, lastAdminMessageTime) {
  // Check immediately
  performCheck(phoneNumber, lastAdminMessageTime);
  
  // Then check every 30 seconds
  self.checkingInterval = setInterval(() => {
    performCheck(phoneNumber, lastAdminMessageTime);
  }, 30000);
}

// Perform message check
async function performCheck(phoneNumber, lastAdminMessageTime) {
  try {
    const storedData = await getStoredData();
    const checkTime = storedData?.lastAdminMessageTime || lastAdminMessageTime;
    
    const newMessage = await checkForNewMessages(phoneNumber, checkTime);
    
    if (newMessage) {
      showNotification(newMessage.message, phoneNumber);
      
      // Update stored data
      if (storedData) {
        await setStoredData({
          ...storedData,
          lastAdminMessageTime: newMessage.timestamp,
        });
      } else {
        // Create new stored data
        await setStoredData({
          phoneNumber,
          lastAdminMessageTime: newMessage.timestamp,
          lastCheck: Date.now(),
        });
      }

      // Notify all clients
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'NEW_MESSAGE',
          message: newMessage.message,
        });
      });
    }
  } catch (error) {
    console.error('Service Worker: Background check error:', error);
  }
}

// Show notification
async function showNotification(message, phoneNumber) {
  // Check notification permission
  const permission = await self.registration.permission;
  if (permission !== 'granted') {
    console.log('Service Worker: Notification permission not granted');
    return;
  }

  const messagePreview = message.type === 'text' 
    ? (message.content.length > 60 ? message.content.substring(0, 60) + '...' : message.content)
    : message.type === 'image' ? '📷 Image भेजा गया है' 
    : message.type === 'video' ? '🎥 Video भेजा गया है'
    : '📄 File भेजा गया है';

  const notificationOptions = {
    body: `Jan Seva Kendra: ${messagePreview}`,
    icon: '/jan-seva-logo.png',
    badge: '/jan-seva-logo.png',
    tag: `chat-${phoneNumber}-${Date.now()}`,
    requireInteraction: false,
    silent: false,
    data: {
      phoneNumber,
      messageId: message._id || Date.now(),
    },
  };

  // Add vibrate for mobile
  if ('vibrate' in navigator) {
    notificationOptions.vibrate = [200, 100, 200];
  }

  try {
    await self.registration.showNotification('नया संदेश आया है - Jan Seva Kendra', notificationOptions);
    console.log('Service Worker: Notification shown successfully');
  } catch (error) {
    console.error('Service Worker: Error showing notification:', error);
  }
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.notification.data);
  
  event.notification.close();

  const phoneNumber = event.notification.data?.phoneNumber;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If window is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((client) => {
            // Send message to open chat
            client.postMessage({
              type: 'OPEN_CHAT',
              phoneNumber,
            });
            return client;
          });
        }
      }
      
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow('/').then((client) => {
          if (client) {
            // Wait a bit for page to load, then send message
            setTimeout(() => {
              client.postMessage({
                type: 'OPEN_CHAT',
                phoneNumber,
              });
            }, 1000);
          }
          return client;
        });
      }
    })
  );
});

// Storage helpers
async function getStoredData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('chat-data');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Service Worker: Error getting stored data:', error);
  }
  return null;
}

async function setStoredData(data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put('chat-data', response);
  } catch (error) {
    console.error('Service Worker: Error setting stored data:', error);
  }
}

