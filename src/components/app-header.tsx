'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  ClipboardList,
  Menu,
  UserCog,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { clearTokenCache } from '@/lib/token-cache';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/logo';

const ownerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/settings/workers', label: 'Staff', icon: UserCog },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const cleanerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-jobs', label: 'My Jobs', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: UserCog },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const { user, isLoading } = useUser();
  const navItems = isLoading ? ownerNavItems : user?.role === 'OWNER' ? ownerNavItems : cleanerNavItems;

  async function handleSignOut() {
    if (signingOut) return; // Prevent double-click
    
    setSigningOut(true);
    
    // Clear token cache immediately
    clearTokenCache();
    
    // Immediate feedback: Navigate first for instant response
    router.push('/login');
    
    // Then cleanup in background (non-blocking)
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Clear cache first (faster than waiting for API)
      queryClient.clear();
      
      // Sign out from Supabase in background
      supabase.auth.signOut().catch(err => {
        console.error('Sign out error:', err);
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 sm:px-3 md:px-6 lg:px-8">
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
            <Logo href="/dashboard" size="md" />
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out',
                      active
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                  >
                    <Icon className={cn(
                      'size-4 transition-transform duration-200 ease-in-out',
                      active ? 'scale-110' : 'group-hover:scale-105'
                    )} />
                    {label}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-emerald-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
            className="group text-zinc-700 transition-all duration-200 hover:text-zinc-900"
          >
            <LogOut className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 md:mr-2" />
            <span className="hidden md:inline">{signingOut ? 'Signing out...' : 'Sign out'}</span>
          </Button>
        </div>
      </header>
      <MobileSidebar open={sidebarOpen} onClose={handleCloseSidebar} />
    </>
  );
}
