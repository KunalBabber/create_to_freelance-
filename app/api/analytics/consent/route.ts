import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return NextResponse.json({ error: 'Origin is required.' }, { status: 403 });
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get('host')) {
        return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
    }
  }

  let body: { accepted?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof body.accepted !== 'boolean') {
    return NextResponse.json({ error: 'Consent choice is required.' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('growlearnix_analytics_consent', body.accepted ? 'granted' : 'denied', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: body.accepted ? 60 * 60 * 24 * 180 : 60 * 60 * 24 * 180,
  });
  return response;
}