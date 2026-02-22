import { AppHeader } from '@/components/app-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { ErrorBoundary } from '@/components/error-boundary';
import { OnboardingGuard } from '@/components/onboarding-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-100">
        <AppHeader />
        <main className="min-h-screen pb-20 pt-14 md:pb-8 md:pt-0">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
            <OnboardingGuard>{children}</OnboardingGuard>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </ErrorBoundary>
  );
}
