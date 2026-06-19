// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/:path*',
  '/products',
  '/products/:path*',
  '/orders',
  '/orders/:path*',
  '/categories',
  '/restock-queue',
  '/activity-log',
  '/analytics',
  '/users',
  '/profile',
  '/settings',
];

// Public routes (accessible without authentication)
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/services',
  '/unauthorized',
];

// Role-based route access
const roleBasedRoutes = {
  ADMIN: ['/users', '/settings', '/analytics', '/categories', '/restock-queue'],
  MANAGER: ['/analytics', '/categories', '/restock-queue'],
  VIEWER: ['/dashboard', '/products', '/orders'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Get user role from cookie (set during login)
  const userRole = request.cookies.get('userRole')?.value as 'ADMIN' | 'MANAGER' | 'VIEWER';
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    route === pathname || pathname.startsWith(route)
  );
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    route === pathname || pathname.startsWith(route.replace(':path*', ''))
  );
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing login/signup while authenticated
  if (isPublicRoute && token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Role-based access control
  if (token && userRole && isProtectedRoute) {
    const allowedRoutes = roleBasedRoutes[userRole] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
    
    if (!hasAccess && userRole !== 'ADMIN') {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};