'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/logo';

export function MarketingHeader() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Logo size="lg" />
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-zinc-600 transition-all duration-200 hover:text-zinc-900 hover:underline hover:underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-zinc-600 transition-all duration-200 hover:text-zinc-900 hover:underline hover:underline-offset-4"
          >
            How it works
          </Link>
          {!isLoading && user ? (
            <Button asChild className="transition-all duration-200 hover:scale-105 hover:shadow-md">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 transition-all duration-200 hover:text-zinc-900 hover:underline hover:underline-offset-4"
              >
                Sign in
              </Link>
              <Button asChild className="bg-emerald-600 transition-all duration-200 hover:scale-105 hover:bg-emerald-700 hover:shadow-md">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          {!isLoading && user ? (
            <Button size="sm" asChild className="bg-emerald-600 transition-all duration-200 hover:scale-105 hover:bg-emerald-700">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="transition-all duration-200 hover:scale-105">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="bg-emerald-600 transition-all duration-200 hover:scale-105 hover:bg-emerald-700">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
