import { NextRequest, NextResponse } from 'next/server';

function constantTimeEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function decodeBasicAuthorization(header: string | null) {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const binary = atob(header.slice(6));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const username = process.env.ANALYTICS_ADMIN_USER || (isDevelopment ? 'admin' : undefined);
  const password = process.env.ANALYTICS_ADMIN_PASSWORD || (isDevelopment ? 'admin' : undefined);

  if (!username || !password) {
    return new NextResponse('Analytics admin access is not configured.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const supplied = decodeBasicAuthorization(request.headers.get('authorization'));
  if (!supplied || !constantTimeEqual(supplied, `${username}:${password}`)) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="GrowLearnix Analytics", charset="UTF-8"',
        'Cache-Control': 'no-store',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
}

export const config = {
  matcher: ['/admin/analytics/:path*', '/api/admin/:path*'],
};