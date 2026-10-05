import 'server-only';

type PurchaseMeasurement = {
  clientId: string;
  sessionId?: string | null;
  transactionId: string;
  value: number;
  currency: string;
};

export async function sendGa4Purchase(event: PurchaseMeasurement) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const endpoint = new URL('https://www.google-analytics.com/mp/collect');
  endpoint.searchParams.set('measurement_id', measurementId);
  endpoint.searchParams.set('api_secret', apiSecret);
  const sessionId = event.sessionId && /^\d+$/.test(event.sessionId) ? Number(event.sessionId) : undefined;

  await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: event.clientId,
      events: [{
        name: 'purchase',
        params: {
          transaction_id: event.transactionId,
          value: event.value,
          currency: event.currency.toUpperCase(),
          session_id: sessionId,
          engagement_time_msec: 1,
          items: [{ item_id: process.env.GUMROAD_PRODUCT_ID || 'growlearnix-course', item_name: 'GrowLearnix Course', price: event.value, quantity: 1 }],
        },
      }],
    }),
    signal: AbortSignal.timeout(1500),
  });
}