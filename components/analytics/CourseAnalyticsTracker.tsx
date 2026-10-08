'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hasAnalyticsConsent, trackAnalyticsEvent } from '@/lib/analytics-client';

export function CourseAnalyticsTracker() {
  const pathname = usePathname();
  const trackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname.startsWith('/admin')) {
      trackedPathRef.current = null;
      return;
    }

    let pageStartedAt = Date.now();
    const reportTime = () => {
      const durationSeconds = Math.floor((Date.now() - pageStartedAt) / 1000);
      pageStartedAt = Date.now();
      if (durationSeconds > 0) {
        trackAnalyticsEvent('time_on_site', { durationSeconds }, { sendToGoogle: false });
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') reportTime();
      else pageStartedAt = Date.now();
    };
    const trackCurrentPage = () => {
      if (!hasAnalyticsConsent() || trackedPathRef.current === pathname) return;
      trackAnalyticsEvent('page_view', {}, { sendToGoogle: false });
      if (pathname === '/') trackAnalyticsEvent('view_course', {}, { sendToGoogle: false });
      trackedPathRef.current = pathname;
    };
    const handleConsentChange = () => {
      if (hasAnalyticsConsent()) {
        pageStartedAt = Date.now();
        trackCurrentPage();
      } else {
        trackedPathRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', reportTime);
    window.addEventListener('growlearnix-analytics-consent-change', handleConsentChange);
    trackCurrentPage();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', reportTime);
      window.removeEventListener('growlearnix-analytics-consent-change', handleConsentChange);
      reportTime();
    };
  }, [pathname]);

  return null;
}
