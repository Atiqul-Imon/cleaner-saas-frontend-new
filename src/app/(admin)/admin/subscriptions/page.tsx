'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  user: {
    email: string;
  };
  subscription?: {
    planType: string;
    status: string;
    currentPeriodEnd: string;
    createdAt: string;
  };
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { isAdmin, isLoading: roleLoading } = useUser();

  const businessesQuery = useQuery({
    queryKey: ['admin', 'businesses', 'subscriptions'],
    queryFn: () =>
      api.get<{ businesses: Business[]; pagination: { total: number } }>(
        '/admin/businesses?page=1&limit=100'
      ),
    enabled: isAdmin,
  });

  if (roleLoading || businessesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const businesses = businessesQuery.data?.businesses ?? [];
  const subscriptions = businesses.filter((b) => b.subscription);

  const activeSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'ACTIVE');
  const cancelledSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'CANCELLED');
  const pastDueSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'PAST_DUE');

  const planCounts: Record<string, number> = {
    FREE: subscriptions.filter((b) => b.subscription?.planType === 'FREE').length,
    SOLO: subscriptions.filter((b) => b.subscription?.planType === 'SOLO').length,
    SMALL_TEAM: subscriptions.filter((b) => b.subscription?.planType === 'SMALL_TEAM').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-zinc-600">Monitor and manage platform subscriptions</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Active</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{activeSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-100 opacity-50" />
        </Card>
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Cancelled</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{cancelledSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-100 opacity-50" />
        </Card>
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Past Due</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{pastDueSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-amber-100 opacity-50" />
        </Card>
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Total</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{subscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-100 opacity-50" />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">Plan Distribution</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(planCounts).map(([plan, count]) => (
            <div key={plan} className="rounded-lg bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-600">{plan}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{count}</p>
              <p className="mt-1 text-xs text-zinc-500">businesses</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">All Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="py-8 text-center text-zinc-500">No subscriptions found</p>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((business) => (
              <div
                key={business.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-zinc-50 p-4 transition-colors hover:bg-zinc-100"
                onClick={() => router.push(`/admin/businesses/${business.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">{business.name}</h3>
                    <p className="text-sm text-zinc-600">{business.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-zinc-900">{business.subscription?.planType}</p>
                    <p className="text-xs text-zinc-500">
                      Ends{' '}
                      {business.subscription &&
                        new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      business.subscription?.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : business.subscription?.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {business.subscription?.status}
                  </span>
                  <ChevronRight className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
