import { AppHeader } from '@/components/app-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { ErrorBoundary } from '@/components/error-boundary';
import { OnboardingGuard } from '@/components/onboarding-guard';
import { AdminRedirectGuard } from '@/components/admin-redirect-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AdminRedirectGuard>
        <div className="min-h-screen bg-zinc-50">
          <AppHeader />
          <main className="min-h-screen pb-20 pt-14 md:pb-10 md:pt-8">
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
