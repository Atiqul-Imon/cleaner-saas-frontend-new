'use client';

import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-zinc-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
