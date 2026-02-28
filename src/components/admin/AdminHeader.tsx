'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { AdminSidebarToggle } from './AdminSidebar';

export default function AdminHeader() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; name?: string } } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
    };
    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => loadUser());
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    if (signingOut) return;
    
    setSigningOut(true);
    setMenuOpen(false);
    
    // Immediate feedback: Navigate first for instant response
    window.location.href = '/login';
    
    // Cleanup in background (non-blocking)
    try {
      // Clear cache
      queryClient.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'Admin';

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <AdminSidebarToggle />

        <div className="flex items-center gap-2">
          <button
            className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-zinc-900">{displayName}</p>
                <p className="text-xs text-zinc-500">Administrator</p>
              </div>
              <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-zinc-200 px-4 py-2">
                    <p className="text-sm font-semibold text-zinc-900">{displayName}</p>
                    {user?.email && displayName !== user.email && (
                      <p className="mt-1 text-xs text-zinc-500">{user.email}</p>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {signingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
