'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackViewCourse } from '@/lib/analytics';

export function CourseAnalyticsTracker() {
  const pathname = usePathname();
  const trackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname === '/' && trackedPathRef.current !== pathname) {
      trackViewCourse();
      trackedPathRef.current = pathname;
      return;
    }

    if (pathname !== '/') {
      trackedPathRef.current = null;
    }
  }, [pathname]);

  return null;
}
