// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROUTES = {
  public: ['/login', '/register', '/forgot-password', '/reset-password'],
  auth: ['/login', '/register'],
  protected: ['/home', '/profile', '/settings', '/matches', '/courts'],
  api: {
    public: ['/api/auth/login', '/api/auth/register'],
    protected: ['/api/users', '/api/matches', '/api/courts'],
  },
} as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Security headers
  const response = NextResponse.next();
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // API route handling
  if (pathname.startsWith('/api')) {
    if (ROUTES.api.public.some((route) => pathname.startsWith(route))) {
      return response;
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders,
          },
        }
      );
    }

    return response;
  }

  // Authentication flow handling
  const isAuthRoute = ROUTES.auth.some((route) => pathname.startsWith(route));
  const isProtectedRoute = ROUTES.protected.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Protect authenticated routes
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);

    // Set temporary redirect cookie
    redirectResponse.cookies.set('redirectTo', pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300, // 5 minutes
      path: '/',
    });

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/home/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/matches/:path*',
    '/courts/:path*',
    '/login',
    '/register',
  ],
};
