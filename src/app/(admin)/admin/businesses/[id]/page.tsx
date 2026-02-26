'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Users, Calendar, FileText } from 'lucide-react';

interface BusinessDetails {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  subscription?: {
    id: string;
    planType: string;
    status: string;
    currentPeriodEnd: string;
    trialStartedAt?: string;
    trialEndsAt?: string;
    createdAt: string;
  };
  clients: Array<{
    id: string;
    name: string;
    phone?: string;
    createdAt: string;
  }>;
  jobs: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    client: { name: string };
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  _count: {
    clients: number;
    jobs: number;
    invoices: number;
  };
}

export default function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { isAdmin, isLoading: roleLoading } = useUser();

  const businessQuery = useQuery({
    queryKey: ['admin', 'business', id],
    queryFn: () => api.get<BusinessDetails>(`/admin/businesses/${id}`),
    enabled: isAdmin && !!id,
  });

  if (roleLoading || businessQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const business = businessQuery.data;

  if (!business) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500">Business not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/businesses')}>
          Back to Businesses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/businesses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{business.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">Business Details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-600">Business Name</label>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{business.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Email</label>
                  <p className="mt-1 text-zinc-900">{business.user.email}</p>
                </div>
                {business.phone && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Phone</label>
                    <p className="mt-1 text-zinc-900">{business.phone}</p>
                  </div>
                )}
              </div>
              {business.address && (
                <div>
                  <label className="text-sm font-medium text-zinc-600">Address</label>
                  <p className="mt-1 text-zinc-900">{business.address}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">VAT Enabled</label>
                  <p className="mt-1 text-zinc-900">
                    {business.vatEnabled ? (
                      <span className="font-semibold text-emerald-600">Yes</span>
                    ) : (
                      <span className="text-zinc-500">No</span>
                    )}
                  </p>
                </div>
                {business.vatNumber && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">VAT Number</label>
                    <p className="mt-1 text-zinc-900">{business.vatNumber}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Created</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Last Updated</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.updatedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recent Jobs</h2>
              <span className="text-sm text-zinc-600">{business._count.jobs} total</span>
            </div>
            {business.jobs.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No jobs yet</p>
            ) : (
              <div className="space-y-3">
                {business.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{job.client.name}</p>
                      <p className="text-sm text-zinc-600">
                        {new Date(job.scheduledDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recent Invoices</h2>
              <span className="text-sm text-zinc-600">{business._count.invoices} total</span>
            </div>
            {business.invoices.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {business.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">#{invoice.invoiceNumber}</p>
                      <p className="text-sm text-zinc-600">
                        {new Date(invoice.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900">
                        £
                        {Number(invoice.totalAmount).toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded px-2 py-1 text-xs font-semibold ${
                          invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Clients</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.clients}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Jobs</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.jobs}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-violet-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Invoices</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.invoices}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {business.subscription && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Subscription</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/subscriptions')}
                >
                  Manage
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Plan</label>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {business.subscription.planType === 'SOLO' && 'Solo (£4.99/mo, 0 staff)'}
                    {business.subscription.planType === 'TEAM' && 'Team (£12.99/mo, up to 12 staff)'}
                    {business.subscription.planType === 'BUSINESS' && 'Business (£25.99/mo, up to 100 staff)'}
                    {!['SOLO','TEAM','BUSINESS'].includes(business.subscription.planType) && business.subscription.planType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Status</label>
                  <p className="mt-1">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        business.subscription.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : business.subscription.status === 'TRIALING'
                            ? 'bg-blue-100 text-blue-700'
                            : business.subscription.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : business.subscription.status === 'PAST_DUE'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {business.subscription.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Current Period Ends</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {business.subscription.trialEndsAt && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Trial Ends</label>
                    <p className="mt-1 text-zinc-900">
                      {new Date(business.subscription.trialEndsAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-zinc-600">User ID</label>
                <p className="mt-1 font-mono text-sm text-zinc-900">{business.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-600">Role</label>
                <p className="mt-1 text-zinc-900">{business.user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-600">Account Created</label>
                <p className="mt-1 text-zinc-900">
                  {new Date(business.user.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
