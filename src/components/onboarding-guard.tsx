'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useBusiness } from '@/hooks/use-business';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOwner, isLoading: userLoading } = useUser();
  const { hasBusiness, isLoading: businessLoading } = useBusiness();

  const isOnboardingPage = pathname === '/onboarding';

  useEffect(() => {
    if (userLoading || businessLoading) return;
    if (!isOwner) return; // Cleaners don't need business
    if (isOnboardingPage) return;

    if (!hasBusiness) {
      window.location.href = '/onboarding';
    }
  }, [isOwner, hasBusiness, isOnboardingPage, userLoading, businessLoading]);

  if (isOwner && !hasBusiness && !isOnboardingPage && !userLoading && !businessLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
