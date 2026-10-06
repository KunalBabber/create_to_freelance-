import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return NextResponse.json({ error: 'Origin is required.' }, { status: 403 });

  try {
    if (new URL(origin).host !== request.headers.get('host')) {
      return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  }

  try {
    const { count, error } = await getSupabaseAdmin()
      .from('analytics_events')
      .delete({ count: 'exact' })
      .not('id', 'is', null);

    if (error) throw error;
    return NextResponse.json(
      { ok: true, deletedCount: count ?? 0 },
      { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  } catch {
    return NextResponse.json({ error: 'Analytics data could not be reset.' }, { status: 503 });
  }
}