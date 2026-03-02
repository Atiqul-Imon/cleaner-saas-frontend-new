'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  ClipboardList,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

const ownerNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/settings/workers', label: 'Staff', icon: UserCog },
];

const cleanerNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/my-jobs', label: 'My Jobs', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: UserCog },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const navItems = isLoading ? ownerNavItems : user?.role === 'OWNER' ? ownerNavItems : cleanerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-all duration-200 ease-in-out',
                active ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Icon className={cn(
                'size-6 transition-all duration-200 ease-in-out',
                active ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
              )} />
              <span className={cn(
                'transition-all duration-200',
                active && 'font-semibold'
              )}>
                {label}
              </span>
              {active && (
                <span className="absolute -top-px left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
