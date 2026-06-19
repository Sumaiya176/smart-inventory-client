// frontend/src/components/common/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks/useRedux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'MANAGER' | 'VIEWER'>;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if still loading
    if (isLoading) return;

    // No token or no user - redirect to login
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Check role authorization
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [token, user, isLoading, router, allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!token || !user) {
    return null;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}