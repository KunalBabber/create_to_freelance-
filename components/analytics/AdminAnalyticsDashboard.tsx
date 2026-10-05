'use client';

import { useEffect, useState } from 'react';

type Revenue = Record<string, number>;
type FunnelStage = { stage: string; count: number; conversion: number };
type TrafficSource = { source: string; visitors: number; leads: number; purchases: number; revenue_by_currency: Revenue };
type AnalyticsData = {
  totalVisitors: number;
  todayVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  leads: number;
  buyClicks: number;
  checkouts: number;
  purchases: number;
  revenueByCurrency: Revenue;
  conversionRate: number;
  funnel: FunnelStage[];
  sources: TrafficSource[];
};

function formatRevenue(revenue: Revenue) {
  const entries = Object.entries(revenue || {});
  if (!entries.length) return '₹0';
  return entries.map(([currency, amount]) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 2 }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
    }
  }).join(' · ');
}

const cardLabels: { label: string; key: keyof AnalyticsData }[] = [
  { label: 'TOTAL VISITORS', key: 'totalVisitors' },
  { label: "TODAY'S VISITORS (UTC)", key: 'todayVisitors' },
  { label: 'UNIQUE VISITORS', key: 'uniqueVisitors' },
  { label: 'PAGE VIEWS', key: 'pageViews' },
  { label: 'LEADS', key: 'leads' },
  { label: 'BUY CLICKS', key: 'buyClicks' },
  { label: 'CHECKOUTS', key: 'checkouts' },
  { label: 'PURCHASES', key: 'purchases' },
];

export function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/analytics', { cache: 'no-store', credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Dashboard unavailable');
        return response.json() as Promise<AnalyticsData>;
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">GrowLearnix</p>
            <h1 className="mt-1 text-2xl font-bold">Analytics</h1>
          </div>
          <a href="/" className="text-sm font-medium text-blue-700 hover:text-blue-900">View landing page</a>
        </header>

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
                <h2 className="text-xs font-semibold tracking-wide text-slate-500">TOTAL REVENUE</h2>
                <p className="mt-3 text-lg font-bold tabular-nums">{formatRevenue(data.revenueByCurrency)}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-xs font-semibold tracking-wide text-slate-500">CONVERSION RATE</h2>
                <p className="mt-3 text-2xl font-bold tabular-nums">{Number(data.conversionRate || 0).toFixed(2)}%</p>
              </article>
            </section>

            <section aria-labelledby="funnel-heading" className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 id="funnel-heading" className="text-base font-semibold">Funnel</h2>
              <ol className="mt-4 grid gap-2 sm:grid-cols-5">
                {(data.funnel || []).map((stage, index) => (
                  <li key={stage.stage} className="flex items-center gap-3 rounded-md bg-slate-50 p-3 sm:block">
                    {index > 0 && <span aria-hidden="true" className="text-slate-400 sm:hidden">↓</span>}
                    <div>
                      <p className="text-xs font-medium text-slate-500">{stage.stage}</p>
                      <p className="mt-1 text-xl font-bold tabular-nums">{stage.count.toLocaleString('en-IN')}</p>
                      <p className="mt-1 text-xs text-blue-700">{stage.conversion}% from previous</p>
                    </div>
                    {index < data.funnel.length - 1 && <span aria-hidden="true" className="hidden text-right text-slate-400 sm:block">↓</span>}
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="sources-heading" className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5"><h2 id="sources-heading" className="text-base font-semibold">Traffic Sources</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-5 py-3 font-semibold">Source</th><th className="px-5 py-3 font-semibold">Visitors</th><th className="px-5 py-3 font-semibold">Leads</th><th className="px-5 py-3 font-semibold">Purchases</th><th className="px-5 py-3 font-semibold">Revenue</th><th className="px-5 py-3 font-semibold">Conversion Rate</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.sources || []).map((source) => (
                      <tr key={source.source}>
                        <th scope="row" className="px-5 py-3 font-medium">{source.source}</th>
                        <td className="px-5 py-3 tabular-nums">{source.visitors}</td>
                        <td className="px-5 py-3 tabular-nums">{source.leads}</td>
                        <td className="px-5 py-3 tabular-nums">{source.purchases}</td>
                        <td className="px-5 py-3 tabular-nums">{formatRevenue(source.revenue_by_currency)}</td>
                        <td className="px-5 py-3 tabular-nums">{source.visitors ? (source.purchases * 100 / source.visitors).toFixed(2) : '0.00'}%</td>
                      </tr>
                    ))}
                    {!data.sources?.length && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No traffic data yet.</td></tr>}
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