import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const eventSchema = z.object({
  eventName: z.enum(['page_view', 'view_course', 'click_buy', 'begin_checkout']),
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  pagePath: z.string().min(1).max(255),
  source: z.string().min(1).max(40),
  utmSource: z.string().max(100).nullable(),
  medium: z.string().max(100).nullable(),
  campaign: z.string().max(150).nullable(),
  content: z.string().max(150).nullable(),
  referrer: z.string().max(200).nullable(),
});

const allowedSources = new Set(['Instagram', 'YouTube', 'Google', 'Facebook', 'WhatsApp', 'Direct', 'Other']);

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (request.cookies.get('growlearnix_analytics_consent')?.value !== 'granted') {
    return NextResponse.json({ error: 'Analytics consent is required.' }, { status: 403 });
  }
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid analytics event.' }, { status: 400 });

  const event = parsed.data;
  try {
    const { error } = await getSupabaseAdmin().from('analytics_events').insert({
      event_name: event.eventName,
      visitor_id: event.visitorId,
      session_id: event.sessionId,
      page_path: event.pagePath,
      source: allowedSources.has(event.source) ? event.source : 'Other',
      utm_source: event.utmSource,
      medium: event.medium,
      campaign: event.campaign,
      content: event.content,
      referrer: event.referrer,
    });

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Analytics storage is unavailable.' }, { status: 503 });
  }
}