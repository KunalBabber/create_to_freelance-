'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackAnalyticsEvent } from '@/lib/analytics-client';

export function CourseAnalyticsTracker() {
  const pathname = usePathname();
  const trackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname === '/' && trackedPathRef.current !== pathname) {
      trackAnalyticsEvent('page_view', {}, { sendToGoogle: false });
      trackAnalyticsEvent('view_course', {}, { sendToGoogle: false });
      trackedPathRef.current = pathname;
      return;
    }

    if (pathname !== '/') {
      trackedPathRef.current = null;
    }
  }, [pathname]);

  return null;
}
