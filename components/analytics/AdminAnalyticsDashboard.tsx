'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RefreshCw, Trash2 } from 'lucide-react';

type TrafficSource = { source: string; visitors: number };
type VisitorTime = { visitor_id: string; source: string; seconds: number; last_seen: string };
type AnalyticsData = {
  totalVisitors: number;
  uniqueVisitors: number;
  buyClicks: number;
  averageTimeSeconds: number;
  visitorTimes: VisitorTime[];
  sources: TrafficSource[];
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

const cardLabels: { label: string; key: 'totalVisitors' | 'uniqueVisitors' | 'buyClicks' }[] = [
  { label: 'TOTAL VISITORS', key: 'totalVisitors' },
  { label: 'UNIQUE VISITORS', key: 'uniqueVisitors' },
  { label: 'BUY CLICKS', key: 'buyClicks' },
];

export function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const refreshSequence = useRef(0);
  const resetInProgress = useRef(false);

  async function refreshAnalytics() {
    const requestSequence = ++refreshSequence.current;
    setLoading(true);
    setActionError('');
    try {
      const response = await fetch('/api/admin/analytics', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Analytics data is unavailable.');
      const nextData = await response.json() as AnalyticsData;
      if (requestSequence !== refreshSequence.current) return;
      setData(nextData);
      setError(false);
      setNotice('Analytics data refreshed.');
    } catch {
      if (requestSequence !== refreshSequence.current) return;
      setActionError('Could not refresh analytics data.');
    } finally {
      if (requestSequence === refreshSequence.current) setLoading(false);
    }
  }

  async function resetAnalytics() {
    const confirmed = window.confirm(
      'Delete all visitor, buy click, traffic source, and time-on-site analytics? This cannot be undone. Leads and verified purchase records will not be deleted.'
    );
    if (!confirmed) return;

    resetInProgress.current = true;
    refreshSequence.current += 1;
    setResetting(true);
    setActionError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/analytics/reset', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error('Analytics reset failed.');
      const result = await response.json() as { deletedCount: number };
      const analyticsResponse = await fetch('/api/admin/analytics', { cache: 'no-store', credentials: 'same-origin' });
      if (!analyticsResponse.ok) throw new Error('Analytics reset, but the dashboard could not be refreshed.');
      setData(await analyticsResponse.json() as AnalyticsData);
      setError(false);
      setNotice(`Analytics reset. ${result.deletedCount.toLocaleString('en-IN')} events deleted.`);
    } catch {
      setActionError('Could not reset analytics data. Check the server credentials and database permissions.');
    } finally {
      resetInProgress.current = false;
      setResetting(false);
    }
  }

  useEffect(() => {
    void refreshAnalytics();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const channel = supabase
      .channel('admin-analytics-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'analytics_events' },
        () => {
          if (!resetInProgress.current) void refreshAnalytics();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">GrowLearnix</p>
            <h1 className="mt-1 text-2xl font-bold">Analytics</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void refreshAnalytics()} disabled={loading || resetting} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              <RefreshCw size={16} aria-hidden="true" className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button type="button" onClick={() => void resetAnalytics()} disabled={loading || resetting} className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
              <Trash2 size={16} aria-hidden="true" />
              {resetting ? 'Resetting…' : 'Reset data'}
            </button>
            <a href="/" className="text-sm font-medium text-blue-700 hover:text-blue-900">View landing page</a>
          </div>
        </header>

        {notice && <p role="status" className="mt-4 text-sm text-emerald-700">{notice}</p>}
        {actionError && <p role="alert" className="mt-4 text-sm text-red-700">{actionError}</p>}

        {error ? (
          <p role="alert" className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Analytics data is unavailable. Check server credentials and the Supabase schema.</p>
        ) : !data ? (
          <p className="mt-8 text-sm text-slate-600">Loading analytics…</p>
        ) : (
          <>
            <section aria-label="Key metrics" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cardLabels.map(({ label, key }) => (
                <article key={key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="text-xs font-semibold tracking-wide text-slate-500">{label}</h2>
                  <p className="mt-3 text-2xl font-bold tabular-nums">{Number(data[key] || 0).toLocaleString('en-IN')}</p>
                </article>
              ))}
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-xs font-semibold tracking-wide text-slate-500">AVG. TIME PER VISITOR</h2>
                <p className="mt-3 text-2xl font-bold tabular-nums">{formatDuration(data.averageTimeSeconds || 0)}</p>
              </article>
            </section>

            <section aria-labelledby="sources-heading" className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5"><h2 id="sources-heading" className="text-base font-semibold">Traffic Sources</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-5 py-3 font-semibold">Source</th><th className="px-5 py-3 font-semibold">Visitors</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.sources || []).map((source) => (
                      <tr key={source.source}>
                        <th scope="row" className="px-5 py-3 font-medium">{source.source}</th>
                        <td className="px-5 py-3 tabular-nums">{source.visitors}</td>
                      </tr>
                    ))}
                    {!data.sources?.length && <tr><td colSpan={2} className="px-5 py-8 text-center text-slate-500">No traffic data yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="visitor-time-heading" className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5"><h2 id="visitor-time-heading" className="text-base font-semibold">Time Spent Per Visitor</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-5 py-3 font-semibold">Visitor</th><th className="px-5 py-3 font-semibold">Source</th><th className="px-5 py-3 font-semibold">Time Spent</th><th className="px-5 py-3 font-semibold">Last Visit</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.visitorTimes || []).map((visitor) => (
                      <tr key={visitor.visitor_id}>
                        <th scope="row" className="px-5 py-3 font-mono text-xs font-medium">{visitor.visitor_id.slice(0, 8)}</th>
                        <td className="px-5 py-3">{visitor.source}</td>
                        <td className="px-5 py-3 tabular-nums">{formatDuration(visitor.seconds)}</td>
                        <td className="px-5 py-3">{new Date(visitor.last_seen).toLocaleString()}</td>
                      </tr>
                    ))}
                    {!data.visitorTimes?.length && <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">Visitor time appears after visits are recorded.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}