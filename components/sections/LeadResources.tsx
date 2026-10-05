'use client';

import { type FormEvent, useState } from 'react';
import { getFirstTouchAttribution, getSessionId, getVisitorId, getVoluntaryLeadAttribution, hasAnalyticsConsent, trackAnalyticsEvent } from '@/lib/analytics-client';

export function LeadResources() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');

    const analyticsConsent = hasAnalyticsConsent();
    const attribution = analyticsConsent ? getFirstTouchAttribution() : getVoluntaryLeadAttribution();
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        attribution,
        visitorId: analyticsConsent ? getVisitorId() : null,
        sessionId: analyticsConsent ? getSessionId() : null,
      }),
    }).catch(() => null);

    if (!response?.ok) {
      setStatus('error');
      return;
    }

    setEmail('');
    setStatus('success');
    trackAnalyticsEvent('lead_generated', { form_name: 'free_canva_resources' });
  }

  return (
    <section className="border-y border-slate-200 bg-white py-10 sm:py-12">
      <div className="site-container max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Get Free Canva Resources</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Get free Canva templates and creative resources delivered to your inbox.</p>
          </div>
          {status === 'success' ? (
            <p role="status" className="text-sm font-semibold text-emerald-800">Check your inbox! Your free resources are on the way.</p>
          ) : (
            <form onSubmit={submitLead} className="flex w-full flex-col gap-2 sm:w-80">
              <label htmlFor="resource-email" className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                id="resource-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
              <button type="submit" disabled={status === 'sending'} className="h-11 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Get Free Resources'}
              </button>
              <p className="text-xs leading-5 text-slate-500">By submitting, you&apos;re requesting these resources by email. We&apos;ll use your email to send them.</p>
              {status === 'error' && <p role="alert" className="text-xs text-red-700">We couldn&apos;t send the resources right now. Please try again later.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}