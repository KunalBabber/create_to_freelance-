import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { buildTrafficSourceList } from '@/lib/traffic-sources';

export const dynamic = 'force-dynamic';

type AnalyticsEvent = {
  event_name: string;
  visitor_id: string | null;
  session_id: string | null;
  duration_seconds: number | null;
  source: string | null;
  created_at: string;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: eventRows, error: eventsError } = await supabase
      .from('analytics_events')
      .select('event_name, visitor_id, session_id, duration_seconds, source, created_at')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (eventsError) throw eventsError;

    const events = (eventRows ?? []) as AnalyticsEvent[];
    const pageViewEvents = events.filter((event) => event.event_name === 'page_view');
    const buyClickEvents = events.filter((event) => event.event_name === 'click_buy');
    const timeOnSiteEvents = events.filter((event) => event.event_name === 'time_on_site');

    const totalVisitors = new Set(
      pageViewEvents
        .map((event) => (event.session_id ?? event.visitor_id) as string | null)
        .filter((value): value is string => Boolean(value))
    ).size;

    const uniqueVisitorKeys = new Set<string>();
    for (const event of pageViewEvents) {
      if (event.visitor_id) {
        uniqueVisitorKeys.add(`visitor:${event.visitor_id}`);
      } else if (event.session_id) {
        uniqueVisitorKeys.add(`session:${event.session_id}`);
      }
    }
    const uniqueVisitors = uniqueVisitorKeys.size;

    const sourceRows: Array<{ visitor_id: string | null; source: string | null; utm_source: string | null }> = [];

    const sourcePageSize = 1000;
    let sourceOffset = 0;
    let sourcePage: Array<{ visitor_id: string | null; source: string | null; utm_source: string | null }> = [];
    do {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('visitor_id, source, utm_source')
        .eq('event_name', 'page_view')
        .order('created_at', { ascending: false })
        .range(sourceOffset, sourceOffset + sourcePageSize - 1);

      if (error) throw error;
      sourcePage = (data ?? []) as Array<{ visitor_id: string | null; source: string | null; utm_source: string | null }>;
      sourceRows.push(...sourcePage);

      sourceOffset += sourcePage.length;
    } while (sourcePage.length === sourcePageSize);

    const sourceSummary = buildTrafficSourceList(sourceRows);

    const visitorTimes = new Map<string, { source: string; seconds: number; last_seen: string }>();
    for (const event of timeOnSiteEvents) {
      if (!event.visitor_id || event.duration_seconds === null) continue;
      const visitorId = event.visitor_id;
      const durationSeconds = Number(event.duration_seconds);
      const current = visitorTimes.get(visitorId);
      const nextSeconds = (current?.seconds ?? 0) + durationSeconds;

      if (!current || event.created_at > current.last_seen) {
        visitorTimes.set(visitorId, {
          source: String(event.source ?? 'Other'),
          seconds: nextSeconds,
          last_seen: event.created_at,
        });
      } else {
        current.seconds = nextSeconds;
      }
    }

    const visitorTimeList = Array.from(visitorTimes.entries())
      .map(([visitor_id, value]) => ({ visitor_id, ...value }))
      .sort((left, right) => right.seconds - left.seconds)
      .slice(0, 100);
    const averageTimeSeconds = visitorTimeList.length
      ? Math.round(visitorTimeList.reduce((total, visitor) => total + visitor.seconds, 0) / visitorTimeList.length)
      : 0;

    return NextResponse.json(
      {
        totalVisitors,
        uniqueVisitors,
        buyClicks: buyClickEvents.length,
        averageTimeSeconds,
        visitorTimes: visitorTimeList,
        sources: sourceSummary,
      },
      { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json({ error: 'Analytics data is unavailable.' }, { status: 503 });
  }
}