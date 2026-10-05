'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getConsentChoice, setConsentChoice, trackAnalyticsEvent, trackGoogleAnalyticsEvent } from '@/lib/analytics-client';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsRuntime() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [saving, setSaving] = useState(false);
  const [lastTrackedPath, setLastTrackedPath] = useState<string | null>(null);

  useEffect(() => {
    const syncChoice = () => {
      setChoice(getConsentChoice() || 'pending');
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

  async function chooseConsent(accepted: boolean) {
    setSaving(true);
    try {
      const response = await fetch('/api/analytics/consent', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accepted }),
      });
      if (!response.ok) return;
      const nextChoice = accepted ? 'accepted' : 'rejected';
      setConsentChoice(nextChoice);
      setChoice(nextChoice);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {choice === 'accepted' && measurementId && <GoogleAnalytics gaId={measurementId} />}
      {choice === 'pending' && (
        <aside className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between" aria-label="Analytics consent">
          <p className="text-sm leading-5 text-slate-700">Allow anonymous analytics to help us understand visits and improve the course page. No email or device fingerprinting is collected by analytics.</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" disabled={saving} onClick={() => void chooseConsent(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">Decline</button>
            <button type="button" disabled={saving} onClick={() => void chooseConsent(true)} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">Allow analytics</button>
          </div>
        </aside>
      )}
    </>
  );
}