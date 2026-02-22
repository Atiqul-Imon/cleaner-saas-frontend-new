'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  ClipboardList,
  Menu,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { useUser } from '@/hooks/use-user';

const ownerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const cleanerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-jobs', label: 'My Jobs', icon: ClipboardList },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppHeader() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const { user, isLoading } = useUser();
  const navItems = isLoading ? ownerNavItems : user?.role === 'OWNER' || user?.role === 'ADMIN' ? ownerNavItems : cleanerNavItems;

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <Link href="/dashboard" className="font-semibold text-zinc-900">
              Clenvora
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-zinc-600">
            <LogOut className="size-4 md:mr-2" />
            <span className="hidden md:inline">Sign out</span>
          </Button>
        </div>
      </header>
      <MobileSidebar open={sidebarOpen} onClose={handleCloseSidebar} />
    </>
  );
}
