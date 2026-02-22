'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    const isOwnerOrAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';
    if (isOwnerOrAdmin) {
      router.replace('/settings/workers');
    } else {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-zinc-500">Loading…</p>
    </div>
  );
}
