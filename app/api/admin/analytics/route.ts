import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin().rpc('get_admin_analytics');
    if (error) throw error;
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ error: 'Analytics data is unavailable.' }, { status: 503 });
  }
}