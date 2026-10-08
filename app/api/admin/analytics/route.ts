import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

type AnalyticsResponse = {
  averageTimeSeconds?: number;
  visitorTimes?: Array<{
    visitor_id: string;
    source: string;
    seconds: number;
    last_seen: string;
  }>;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('get_admin_analytics');
    if (error) throw error;

    const response = data as AnalyticsResponse;
    const { data: timeRows, error: timeError } = await supabase
      .from('analytics_events')
      .select('visitor_id, duration_seconds, source, created_at')
      .eq('event_name', 'time_on_site')
      .not('visitor_id', 'is', 'null')
      .not('duration_seconds', 'is', 'null')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (timeError) throw timeError;

    const visitorTimes = new Map<string, { source: string; seconds: number; last_seen: string }>();
    for (const row of timeRows ?? []) {
      const visitorId = row.visitor_id as string;
      const durationSeconds = Number(row.duration_seconds);
      const current = visitorTimes.get(visitorId);
      const nextSeconds = (current?.seconds ?? 0) + durationSeconds;

      if (!current || row.created_at > current.last_seen) {
        visitorTimes.set(visitorId, {
          source: String(row.source ?? 'Other'),
          seconds: nextSeconds,
          last_seen: String(row.created_at),
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
        ...response,
        averageTimeSeconds,
        visitorTimes: visitorTimeList,
      },
      { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json({ error: 'Analytics data is unavailable.' }, { status: 503 });
  }
}