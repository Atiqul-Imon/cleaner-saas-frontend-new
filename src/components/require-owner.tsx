'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';

/**
 * Guard for owner-only routes. Redirects Cleaners to /my-jobs.
 * Use on pages that should only be accessible to OWNER or ADMIN.
 */
export function RequireOwner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    const isOwnerOrAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';
    if (user && !isOwnerOrAdmin) {
      router.replace('/my-jobs');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (user && user.role !== 'OWNER' && user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-zinc-500">Redirecting…</p>
      </div>
    );
  }

  return <>{children}</>;
}
