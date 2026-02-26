'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, CreditCard, PoundSterling, Loader2 } from 'lucide-react';

interface AdminStats {
  totalBusinesses: number;
  totalUsers: number;
  totalJobs: number;
  totalInvoices: number;
  activeSubscriptions: number;
  totalRevenue: number;
  recentBusinesses: number;
  businessesByPlan: Array<{ plan: string; count: number }>;
}

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
  user: { id: string; email: string; role: string; createdAt: string };
  subscription?: { planType: string; status: string; currentPeriodEnd: string };
  _count: { clients: number; jobs: number; invoices: number };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, isLoading: roleLoading } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats'),
    enabled: isAdmin,
  });

  const businessesQuery = useQuery({
    queryKey: ['admin', 'businesses', currentPage],
    queryFn: () =>
      api.get<{ businesses: Business[]; pagination: { page: number; totalPages: number; total: number } }>(
        `/admin/businesses?page=${currentPage}&limit=10`
      ),
    enabled: isAdmin,
  });

  if (roleLoading || statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const stats = statsQuery.data;
  const businesses = businessesQuery.data?.businesses ?? [];
  const pagination = businessesQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-zinc-600">Monitor and manage your SaaS platform</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Businesses</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{stats.totalBusinesses}</p>
                <p className="mt-1 text-xs text-zinc-500">+{stats.recentBusinesses} new this month</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Users</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Active Subscriptions</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{stats.activeSubscriptions}</p>
              </div>
              <div className="rounded-lg bg-violet-100 p-3">
                <CreditCard className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  £{Number(stats.totalRevenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <PoundSterling className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {stats && stats.businessesByPlan.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Subscription Plans</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.businessesByPlan.map((plan) => (
              <div key={plan.plan} className="rounded-lg bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-600">{plan.plan}</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">{plan.count}</p>
                <p className="mt-1 text-xs text-zinc-500">businesses</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Recent Businesses</h2>
            <p className="mt-1 text-sm text-zinc-600">{pagination?.total ?? 0} total businesses</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/businesses')}>
            View All
          </Button>
        </div>

        {businessesQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">No businesses registered yet</div>
        ) : (
          <div className="space-y-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-zinc-50 p-4 transition-colors hover:bg-zinc-100"
                onClick={() => router.push(`/admin/businesses/${business.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-zinc-900">{business.name}</h3>
                      {business.subscription && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            business.subscription.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : business.subscription.status === 'TRIALING'
                                ? 'bg-blue-100 text-blue-700'
                                : business.subscription.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {business.subscription.planType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600">{business.user.email}</p>
                    <div className="mt-1 flex gap-4 text-xs text-zinc-500">
                      <span>{business._count.clients} clients</span>
                      <span>{business._count.jobs} jobs</span>
                      <span>{business._count.invoices} invoices</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(business.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <p className="text-sm text-zinc-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
