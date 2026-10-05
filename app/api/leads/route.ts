import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const leadSchema = z.object({
  email: z.string().trim().email().max(254),
  visitorId: z.string().uuid().nullable(),
  sessionId: z.string().uuid().nullable(),
  attribution: z.object({
    source: z.string().min(1).max(40),
    utmSource: z.string().max(100).nullable(),
    medium: z.string().max(100).nullable(),
    campaign: z.string().max(150).nullable(),
    content: z.string().max(150).nullable(),
    referrer: z.string().max(200).nullable(),
    firstLandingPage: z.string().min(1).max(255),
  }),
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
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });

  const data = parsed.data;
  const email = data.email.toLowerCase();
  const analyticsConsent = request.cookies.get('growlearnix_analytics_consent')?.value === 'granted';
  const source = allowedSources.has(data.attribution.source) ? data.attribution.source : 'Other';

  try {
    const supabase = getSupabaseAdmin();
    const { error: upsertError } = await supabase.from('leads').upsert({
      email,
      source,
      utm_source: data.attribution.utmSource,
      medium: data.attribution.medium,
      campaign: data.attribution.campaign,
      content: data.attribution.content,
      first_landing_page: data.attribution.firstLandingPage,
      visitor_id: analyticsConsent ? data.visitorId : null,
      session_id: analyticsConsent ? data.sessionId : null,
      analytics_consent: analyticsConsent,
    }, { onConflict: 'email', ignoreDuplicates: true });

    if (upsertError) throw upsertError;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, visitor_id, analytics_consent, last_resource_email_sent_at')
      .eq('email', email)
      .single();

    if (leadError || !lead) throw leadError || new Error('Lead record unavailable.');
    const lastEmailSentAt = lead.last_resource_email_sent_at ? Date.parse(lead.last_resource_email_sent_at) : 0;
    if (lastEmailSentAt && Date.now() - lastEmailSentAt < 24 * 60 * 60 * 1000) {
      return NextResponse.json({ ok: true });
    }
    if (analyticsConsent && !lead.analytics_consent) {
      const { error: consentUpdateError } = await supabase.from('leads').update({ analytics_consent: true }).eq('id', lead.id);
      if (consentUpdateError) throw consentUpdateError;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.LEAD_FROM_EMAIL;
    if (!apiKey || !from) {
      return NextResponse.json({ error: 'Resource email delivery is not configured.' }, { status: 503 });
    }

    const resourceUrl = new URL(process.env.LEAD_RESOURCE_URL || 'https://www.canva.com/templates/');
    if (resourceUrl.protocol !== 'https:') return NextResponse.json({ error: 'Resource URL must use HTTPS.' }, { status: 500 });

    const mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your free Canva resources from GrowLearnix',
        html: `<p>Here are your requested free Canva resources:</p><p><a href="${resourceUrl.href}">Browse free Canva templates</a></p><p><a href="https://www.canva.com/learn/">Explore Canva design lessons</a></p><p>You received this because you requested the resources on GrowLearnix. We will not use this address for unrelated marketing.</p>`,
        text: `Here are your requested free Canva resources:\n\nFree Canva templates: ${resourceUrl.href}\nCanva design lessons: https://www.canva.com/learn/\n\nYou received this because you requested the resources on GrowLearnix. We will not use this address for unrelated marketing.`,
      }),
      signal: AbortSignal.timeout(4500),
    });

    if (!mailResponse.ok) return NextResponse.json({ error: 'Resource email could not be sent.' }, { status: 502 });

    const { error: sentAtError } = await supabase.from('leads')
      .update({ last_resource_email_sent_at: new Date().toISOString() })
      .eq('id', lead.id);
    if (sentAtError) throw sentAtError;

    const { error: eventError } = await supabase.from('analytics_events').insert({
      event_name: 'lead_generated',
      visitor_id: analyticsConsent ? data.visitorId : null,
      session_id: analyticsConsent ? data.sessionId : null,
      page_path: data.attribution.firstLandingPage,
      source,
      utm_source: data.attribution.utmSource,
      medium: data.attribution.medium,
      campaign: data.attribution.campaign,
      content: data.attribution.content,
      referrer: data.attribution.referrer,
    });
    if (eventError) console.error('Unable to record lead analytics event:', eventError.code);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lead storage or email delivery is unavailable.' }, { status: 503 });
  }
}