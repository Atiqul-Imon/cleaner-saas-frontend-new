'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, CheckCircle } from 'lucide-react';

interface UpgradeRequest {
  id: string;
  businessId: string;
  fromPlan: string;
  toPlan: string;
  status: string;
  autoUpgraded: boolean;
  message?: string;
  createdAt: string;
  processedAt?: string;
  business: {
    id: string;
    name: string;
    user: {
      email: string;
      name?: string;
    };
    subscription: {
      planType: string;
      status: string;
    };
  };
}

export default function UpgradeRequestsPage() {
  const { isAdmin, isLoading: roleLoading } = useUser();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'upgrade-requests'],
    queryFn: () => api.get<UpgradeRequest[]>('/upgrade-requests'),
    enabled: isAdmin,
  });

  if (roleLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingRequests = requests?.filter((r) => r.status === 'PENDING') || [];
  const completedRequests = requests?.filter((r) => r.status === 'COMPLETED') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Upgrade Requests</h1>
        <p className="mt-1 text-sm text-zinc-600">Monitor plan upgrades and billing changes</p>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Pending</p>
              <p className="text-2xl font-bold text-zinc-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Completed</p>
              <p className="text-2xl font-bold text-zinc-900">{completedRequests.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Total</p>
              <p className="text-2xl font-bold text-zinc-900">{requests?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">Pending Requests</h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-900">{request.business.name}</p>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      PENDING
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{request.business.user.email}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium text-zinc-700">Upgrade:</span>{' '}
                    <span className="text-zinc-900">
                      {request.fromPlan} → {request.toPlan}
                    </span>
                  </p>
                  {request.message && (
                    <p className="mt-1 text-sm text-zinc-600">{request.message}</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500">
                    Requested {new Date(request.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Requests */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">All Upgrade Requests</h2>
        {!requests || requests.length === 0 ? (
          <p className="py-8 text-center text-zinc-500">No upgrade requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-sm font-medium text-zinc-600">
                  <th className="pb-3">Business</th>
                  <th className="pb-3">Upgrade</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Auto</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {requests.map((request) => (
                  <tr key={request.id} className="text-sm">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-zinc-900">{request.business.name}</p>
                        <p className="text-xs text-zinc-600">{request.business.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-zinc-900">
                        {request.fromPlan} → {request.toPlan}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          request.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : request.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {request.autoUpgraded ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-zinc-600">
                      {new Date(request.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900">How Auto-Upgrade Works</h3>
        <p className="mt-2 text-sm text-blue-700">
          When an owner requests an upgrade, their plan is automatically upgraded immediately. They get instant access to new limits (staff/jobs). The new plan price will be charged on their next billing cycle. No manual admin action needed.
        </p>
      </Card>
    </div>
  );
}
