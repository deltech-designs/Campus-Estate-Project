import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (req.nextUrl.searchParams.get('clear') === 'true') {
    const url = new URL(pathname, req.url);
    const from = req.nextUrl.searchParams.get('from');
    if (from) {
      url.searchParams.set('from', from);
    }
    const response = NextResponse.redirect(url);
    response.cookies.delete('ems_token');
    return response;
  }

  const tokenCookie = req.cookies.get('ems_token');
  const token = tokenCookie?.value;

  let isExpired = false;
  let role: string | undefined;

  if (token) {
    const payload = decodeJwt(token);
    role = payload?.role;
    const exp = payload?.exp;
    isExpired = exp ? Date.now() >= exp * 1000 : false;
  }

  // Allow auth routes and Next.js internals to pass through
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico';

  if ((!token || isExpired) && !isPublicRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete('ems_token');
    }
    return response;
  }

  if (token && isExpired) {
    // If it's a public route and token is expired, clear the cookie to clean up
    const response = NextResponse.next();
    response.cookies.delete('ems_token');
    return response;
  }

  // Redirect based on role when logged in
  if (token && !isExpired) {
    if (pathname === '/overview') {
      if (role === 'tenant') {
        return NextResponse.redirect(new URL('/tenants', req.url));
      } else if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/overview', req.url));
      } else if (role === 'manager') {
        return NextResponse.redirect(new URL('/manager/overview', req.url));
      }
    }

    if (
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password'
    ) {
      if (role === 'tenant') {
        return NextResponse.redirect(new URL('/tenants', req.url));
      } else if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/overview', req.url));
      } else if (role === 'manager') {
        return NextResponse.redirect(new URL('/manager/overview', req.url));
      }
      return NextResponse.redirect(new URL('/overview', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

