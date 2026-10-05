'use client';

import { useEffect, useState } from 'react';
import { getConsentChoice, setConsentChoice } from '@/lib/analytics-client';

export function AnalyticsConsentSettings() {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const sync = () => {
      setChoice(getConsentChoice());
    };
    sync();
    window.addEventListener('growlearnix-analytics-consent-change', sync);
    return () => window.removeEventListener('growlearnix-analytics-consent-change', sync);
  }, []);

  async function updateConsent(accepted: boolean) {
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
    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="mr-auto text-sm text-slate-700">Analytics preference: <strong>{choice === 'accepted' ? 'Allowed' : choice === 'rejected' ? 'Declined' : 'Not set'}</strong></p>
      <button type="button" disabled={saving} onClick={() => void updateConsent(false)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50">Decline analytics</button>
      <button type="button" disabled={saving} onClick={() => void updateConsent(true)} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">Allow analytics</button>
    </div>
  );
}