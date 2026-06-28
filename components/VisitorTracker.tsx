'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/api';

const VISITOR_HEARTBEAT_MS = 2 * 60 * 1000;

// Generate or get session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}

// Detect device info
function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { device: '', browser: '', os: '' };
  }

  const ua = navigator.userAgent;
  let device = 'Desktop';
  let browser = 'Unknown';
  let os = 'Unknown';

  // Device detection
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    device = 'Mobile';
  }

  // Browser detection
  if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';
  else if (ua.indexOf('Opera') > -1) browser = 'Opera';

  // OS detection
  if (ua.indexOf('Windows') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('iOS') > -1 || /iPad|iPhone|iPod/.test(ua)) os = 'iOS';

  return { device, browser, os };
}

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const track = async () => {
      const sessionId = getSessionId();
      const { device, browser, os } = getDeviceInfo();
      const page = window.location.pathname;
      const referrer = document.referrer || '';

      try {
        await trackVisitor({
          sessionId,
          page,
          referrer,
          userAgent: navigator.userAgent,
          device,
          browser,
          os,
        });
      } catch (error: any) {
        // Ignore connection errors (common when page unloads)
        if (error?.name !== 'AbortError' && error?.code !== 'ECONNRESET') {
          console.error('Failed to track visitor:', error);
        }
      }
    };

    const scheduleTrack = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => track(), { timeout: 2000 });
        return;
      }

      setTimeout(track, 0);
    };

    // Track after the browser has had a chance to paint the page.
    scheduleTrack();

    // Track on route change (for Next.js)
    const handleRouteChange = () => {
      setTimeout(scheduleTrack, 100);
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Keep visitor active without frequent background network work.
    const interval = setInterval(scheduleTrack, VISITOR_HEARTBEAT_MS);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, []);

  return null; // This component doesn't render anything
}

