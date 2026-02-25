'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  BarChart3,
  PoundSterling,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

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

export default function AdminAnalyticsPage() {
  const { isAdmin, isLoading: roleLoading } = useUser();

  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats'),
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

  if (!stats) return null;

  const growthRate =
    stats.recentBusinesses > 0
      ? ((stats.recentBusinesses / stats.totalBusinesses) * 100).toFixed(1)
      : '0';
  const avgJobsPerBusiness =
    stats.totalBusinesses > 0 ? (stats.totalJobs / stats.totalBusinesses).toFixed(1) : '0';
  const avgRevenuePerBusiness =
    stats.totalBusinesses > 0
      ? (Number(stats.totalRevenue) / stats.totalBusinesses).toFixed(2)
      : '0';
  const conversionRate =
    stats.totalBusinesses > 0
      ? ((stats.activeSubscriptions / stats.totalBusinesses) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-600">Platform insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-zinc-600">Growth Rate</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{growthRate}%</p>
          <p className="mt-1 text-xs text-zinc-500">This month</p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-zinc-600">Avg Jobs/Business</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{avgJobsPerBusiness}</p>
          <p className="mt-1 text-xs text-zinc-500">Platform average</p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
            <PoundSterling className="h-6 w-6 text-violet-600" />
          </div>
          <p className="text-sm font-medium text-zinc-600">Avg Revenue/Business</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">£{avgRevenuePerBusiness}</p>
          <p className="mt-1 text-xs text-zinc-500">All-time average</p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
            <CheckCircle2 className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-zinc-600">Conversion Rate</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{conversionRate}%</p>
          <p className="mt-1 text-xs text-zinc-500">Active subscriptions</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">Platform Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Businesses', value: stats.totalBusinesses },
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Total Jobs', value: stats.totalJobs },
              { label: 'Total Invoices', value: stats.totalInvoices },
              { label: 'Active Subscriptions', value: stats.activeSubscriptions },
              {
                label: 'Total Revenue',
                value: `£${Number(stats.totalRevenue).toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
              >
                <span className="text-zinc-600">{label}</span>
                <span className="text-lg font-bold text-zinc-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">Subscription Plans</h2>
          <div className="space-y-4">
            {stats.businessesByPlan.map((plan) => {
              const percentage =
                stats.totalBusinesses > 0
                  ? ((plan.count / stats.totalBusinesses) * 100).toFixed(1)
                  : '0';
              return (
                <div key={plan.plan}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-zinc-600">{plan.plan}</span>
                    <span className="font-bold text-zinc-900">
                      {plan.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200">
                    <div
                      className="h-2 rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-zinc-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-zinc-900">{stats.recentBusinesses} new businesses</p>
              <p className="text-sm text-zinc-600">Registered this month</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
