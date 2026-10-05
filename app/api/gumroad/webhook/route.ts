import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendGa4Purchase } from '@/lib/ga4-server';

export const dynamic = 'force-dynamic';

type GumroadSale = {
  id: string;
  product_id: string;
  paid: boolean;
  price: number | string;
  currency: string;
  email?: string;
  created_at?: string;
  refunded?: boolean;
  refunded_cents?: number;
  partially_refunded?: boolean;
  disputed?: boolean;
  dispute_won?: boolean;
  chargebacked?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  test?: boolean;
};

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : null;
}

function webhookSecretMatches(provided: string | null, expected: string) {
  if (!provided) return false;
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
}

function parseUrlParams(form: FormData) {
  const result: Record<string, string> = {};
  const raw = field(form, 'url_params');
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string' || typeof value === 'number') result[key] = String(value);
      }
    } catch {
      const normalized = raw
        .replace(/([{,]\s*)'([^']+)'(?=\s*:)/g, '$1"$2"')
        .replace(/:\s*'([^']*)'/g, (_match, value: string) => `:${JSON.stringify(value)}`);
      try {
        const parsed = JSON.parse(normalized) as Record<string, unknown>;
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === 'string' || typeof value === 'number') result[key] = String(value);
        }
      } catch {
        for (const [key, value] of new URLSearchParams(raw)) result[key] = value;
      }
    }
  }

  for (const [key, value] of form.entries()) {
    const match = /^url_params\[([^\]]+)\]$/.exec(key);
    if (match && typeof value === 'string') result[match[1]] = value;
  }
  return result;
}

function normalizedSource(utmSource: string | null, referrer: string | null) {
  const source = (utmSource || '').toLowerCase();
  const referringHost = (referrer || '').toLowerCase();
  if (source.includes('instagram') || referringHost.includes('instagram.com')) return 'Instagram';
  if (source.includes('youtube') || referringHost.includes('youtube.com') || referringHost.includes('youtu.be')) return 'YouTube';
  if (source.includes('google') || referringHost.includes('google.')) return 'Google';
  if (source.includes('facebook') || referringHost.includes('facebook.com') || referringHost.includes('fb.com')) return 'Facebook';
  if (source.includes('whatsapp') || referringHost.includes('whatsapp.com') || referringHost.includes('wa.me')) return 'WhatsApp';
  if (!source && (!referrer || referrer === 'direct')) return 'Direct';
  return source ? 'Other' : 'Other';
}

function asOrigin(value: string | null) {
  if (!value || value === 'direct') return null;
  try {
    return new URL(value).origin.slice(0, 200);
  } catch {
    return null;
  }
}

function isUuid(value: string | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function verifySale(saleId: string): Promise<GumroadSale | null> {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  const productId = process.env.GUMROAD_PRODUCT_ID;
  if (!token || !productId) throw new Error('Gumroad verification is not configured.');

  const url = new URL(`https://api.gumroad.com/v2/sales/${encodeURIComponent(saleId)}`);
  url.searchParams.set('access_token', token);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error('Gumroad sale verification failed.');

  const payload = await response.json() as { success?: boolean; sale?: GumroadSale };
  if (!payload.success || !payload.sale || payload.sale.id !== saleId) return null;
  if (payload.sale.product_id !== productId) return null;
  return payload.sale;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.GUMROAD_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: 'Gumroad webhook is not configured.' }, { status: 503 });
  if (!webhookSecretMatches(request.nextUrl.searchParams.get('key'), webhookSecret)) {
    return NextResponse.json({ error: 'Invalid webhook credentials.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a Gumroad form webhook.' }, { status: 400 });
  }

  const saleId = field(form, 'sale_id');
  const resourceName = field(form, 'resource_name') || 'sale';
  if (!saleId || saleId.length > 160 || !['sale', 'refund', 'dispute', 'dispute_won'].includes(resourceName)) {
    return NextResponse.json({ error: 'Invalid Gumroad notification.' }, { status: 400 });
  }

  const urlParams = parseUrlParams(form);
  try {
    const sale = await verifySale(saleId);
    if (!sale || sale.test || field(form, 'test') === 'true') return new NextResponse(null, { status: 204 });

    const supabase = getSupabaseAdmin();
    const email = sale.email?.trim().toLowerCase();
    let lead: { id: string; visitor_id: string | null; analytics_consent: boolean } | null = null;
    if (email) {
      const { data } = await supabase.from('leads').select('id, visitor_id, analytics_consent').eq('email', email).maybeSingle();
      lead = data;
    }

    const utmSource = urlParams.utm_source || sale.utm_source || null;
    const rawReferrer = sale.referrer || urlParams.referrer || null;
    const referrer = asOrigin(rawReferrer);
    const sourceHint = urlParams.growlearnix_source;
    const allowedSourceHints = new Set(['Instagram', 'YouTube', 'Google', 'Facebook', 'WhatsApp', 'Direct', 'Other']);
    const source = sourceHint && allowedSourceHints.has(sourceHint) ? sourceHint : normalizedSource(utmSource, rawReferrer);
    const firstLandingPage = urlParams.growlearnix_first_landing_page?.startsWith('/') && !urlParams.growlearnix_first_landing_page.startsWith('//')
      ? urlParams.growlearnix_first_landing_page.slice(0, 255)
      : '/';
    const visitorIdFromPing = urlParams.growlearnix_visitor_id;
    const visitorId = lead?.visitor_id || (isUuid(visitorIdFromPing) ? visitorIdFromPing : null);
    const sessionIdFromPing = urlParams.growlearnix_session_id;
    const sessionId = isUuid(sessionIdFromPing) ? sessionIdFromPing : null;
    const amount = Number(sale.price);
    if (!Number.isFinite(amount) || amount < 0 || !sale.currency) throw new Error('Verified sale has invalid amount data.');

    const status = sale.refunded || (resourceName === 'refund' && !sale.partially_refunded)
      ? 'refunded'
      : (resourceName === 'dispute_won' || sale.dispute_won) && sale.paid
        ? 'paid'
        : resourceName === 'dispute' || sale.disputed || sale.chargebacked
        ? 'disputed'
        : sale.paid
          ? 'paid'
          : null;

    if (!status) return new NextResponse(null, { status: 204 });

    const { data: priorPurchase } = await supabase
      .from('purchases')
      .select('status')
      .eq('gumroad_sale_id', saleId)
      .maybeSingle();

    const refundedCents = Number(sale.refunded_cents || 0);
    const amountCents = status === 'paid' ? Math.max(0, Math.round(amount - refundedCents)) : 0;
    const { error: purchaseError } = await supabase.from('purchases').upsert({
      gumroad_sale_id: saleId,
      lead_id: lead?.id || null,
      visitor_id: visitorId,
      product_id: sale.product_id,
      amount_cents: amountCents,
      currency: sale.currency.toLowerCase(),
      status,
      source,
      utm_source: utmSource,
      medium: urlParams.utm_medium || sale.utm_medium || null,
      campaign: urlParams.utm_campaign || sale.utm_campaign || null,
      content: urlParams.utm_content || null,
      referrer,
      first_landing_page: firstLandingPage,
      purchased_at: sale.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'gumroad_sale_id' });
    if (purchaseError) throw purchaseError;

    const { error: deliveryError } = await supabase.from('gumroad_webhook_deliveries').upsert({
      sale_id: saleId,
      resource_name: resourceName,
    }, { onConflict: 'sale_id,resource_name', ignoreDuplicates: true });
    if (deliveryError) throw deliveryError;

    if (lead) {
      const { error: leadUpdateError } = await supabase.from('leads')
        .update({ converted: status === 'paid', purchase_id: status === 'paid' ? saleId : null })
        .eq('id', lead.id);
      if (leadUpdateError) throw leadUpdateError;
    }

    if (status === 'paid' && priorPurchase?.status !== 'paid') {
      const { error: eventError } = await supabase.from('analytics_events').insert({
        event_name: 'purchase',
        visitor_id: visitorId,
        session_id: sessionId,
        page_path: firstLandingPage,
        source,
        utm_source: utmSource,
        medium: urlParams.utm_medium || sale.utm_medium || null,
        campaign: urlParams.utm_campaign || sale.utm_campaign || null,
        content: urlParams.utm_content || null,
        referrer,
        purchase_id: saleId,
      });
      if (eventError && eventError.code !== '23505') throw eventError;

      const consented = urlParams.growlearnix_analytics_consent === 'granted';
      if (consented && visitorId) {
        try {
          await sendGa4Purchase({
            clientId: urlParams.growlearnix_ga_client_id || visitorId,
            sessionId: urlParams.growlearnix_ga_session_id,
            transactionId: saleId,
            value: amountCents / 100,
            currency: sale.currency,
          });
        } catch {
          // The verified internal purchase remains recorded if GA4 is unavailable.
        }
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Gumroad event could not be verified or stored.' }, { status: 503 });
  }
}