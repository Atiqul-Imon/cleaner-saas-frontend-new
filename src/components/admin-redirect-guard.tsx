'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';

/**
 * Redirects ADMIN users to /admin. Used in dashboard layout so admins
 * never see the owner/cleaner dashboard.
 */
export function AdminRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [user, isLoading, router]);

  if (!isLoading && user?.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
