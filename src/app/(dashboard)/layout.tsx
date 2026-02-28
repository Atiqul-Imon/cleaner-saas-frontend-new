import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/error-boundary';
import { OnboardingGuard } from '@/components/onboarding-guard';
import { AdminRedirectGuard } from '@/components/admin-redirect-guard';
import { DashboardPrefetch } from '@/components/dashboard-prefetch';

const AppHeader = dynamic(
  () => import('@/components/app-header').then((m) => ({ default: m.AppHeader })),
  {
    loading: () => (
      <header className="h-14 shrink-0 border-b border-zinc-200 bg-white" aria-hidden="true" />
    ),
  }
);

const MobileBottomNav = dynamic(
  () => import('@/components/mobile-bottom-nav').then((m) => ({ default: m.MobileBottomNav })),
  {
    loading: () => (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-zinc-200 bg-zinc-50 md:hidden"
        aria-hidden="true"
      />
    ),
  }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AdminRedirectGuard>
        <DashboardPrefetch />
        <div className="min-h-screen bg-zinc-50">
          <AppHeader />
          <main className="min-h-screen pb-28 pt-14 md:pb-10 md:pt-8">
            <div className="dashboard-app mx-auto w-full max-w-7xl px-2 sm:px-3 md:px-6 lg:px-8">
              <OnboardingGuard>{children}</OnboardingGuard>
            </div>
          </main>
          <MobileBottomNav />
        </div>
      </AdminRedirectGuard>
    </ErrorBoundary>
  );
}
