'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getConsentChoice, setConsentChoice, trackAnalyticsEvent, trackGoogleAnalyticsEvent } from '@/lib/analytics-client';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsRuntime() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<'accepted' | 'rejected'>(() => getConsentChoice() || 'accepted');
  const [lastTrackedPath, setLastTrackedPath] = useState<string | null>(null);

  useEffect(() => {
    const syncChoice = () => {
      setChoice(getConsentChoice() || 'accepted');
    };
    syncChoice();
    window.addEventListener('growlearnix-analytics-consent-change', syncChoice);
    return () => window.removeEventListener('growlearnix-analytics-consent-change', syncChoice);
  }, []);

  useEffect(() => {
    if (choice === 'rejected') {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
      setLastTrackedPath(null);
      return;
    }
    if (choice !== 'accepted') return;
    if (pathname !== lastTrackedPath) {
      const isFirstPageView = lastTrackedPath === null;
      trackAnalyticsEvent('page_view', {}, { sendToGoogle: !isFirstPageView });
      if (pathname === '/') {
        trackAnalyticsEvent('view_course', {}, { sendToGoogle: false });
        if (measurementId) {
          const timeoutAt = Date.now() + 3000;
          const sendCourseView = () => {
            if (trackGoogleAnalyticsEvent('view_course')) return;
            if (Date.now() < timeoutAt) window.setTimeout(sendCourseView, 50);
          };
          sendCourseView();
        }
      }
      setLastTrackedPath(pathname);
    }
  }, [choice, pathname, lastTrackedPath]);

  return (
    <>
      {choice === 'accepted' && measurementId && <GoogleAnalytics gaId={measurementId} />}
    </>
  );
}