'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Loader2,
  Pencil,
  CreditCard,
  CalendarPlus,
  Banknote,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const PLAN_LABELS: Record<string, string> = {
  SOLO: 'Solo (FREE - 1 staff, 20 jobs/mo)',
  TEAM: 'Team (£14.99/mo, 20 staff)',
  BUSINESS: 'Business (£99.99/mo, unlimited staff)',
};

const STATUS_COLORS: Record<string, string> = {
  TRIALING: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PAST_DUE: 'bg-amber-100 text-amber-700',
};

interface Business {
  id: string;
  name: string;
  user: { email: string };
  subscription?: {
    planType: string;
    status: string;
    currentPeriodEnd: string;
    trialStartedAt?: string;
    trialEndsAt?: string;
    payoneerEmail?: string;
  };
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: roleLoading } = useUser();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [action, setAction] = useState<'edit' | 'extend' | 'payment'>('edit');
  const [editForm, setEditForm] = useState({
    planType: 'SOLO' as 'SOLO' | 'TEAM' | 'BUSINESS',
    status: 'TRIALING' as 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'PAST_DUE',
    currentPeriodEnd: '',
    payoneerEmail: '',
    adminNotes: '',
  });
  const [extendMonths, setExtendMonths] = useState('1');
  const [paymentForm, setPaymentForm] = useState({
    planType: 'SOLO' as 'SOLO' | 'TEAM' | 'BUSINESS',
    months: 1,
    payoneerEmail: '',
    adminNotes: '',
  });

  const businessesQuery = useQuery({
    queryKey: ['admin', 'businesses', 'subscriptions'],
    queryFn: () =>
      api.get<{ businesses: Business[]; pagination: { total: number } }>(
        '/admin/businesses?page=1&limit=100'
      ),
    enabled: isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { businessId: string; body: Record<string, unknown> }) =>
      api.patch(`/admin/subscriptions/${data.businessId}`, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      setSelectedBusiness(null);
    },
  });

  const extendMutation = useMutation({
    mutationFn: ({ businessId, months }: { businessId: string; months: number }) =>
      api.post(`/admin/subscriptions/${businessId}/extend`, { months: String(months) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      setSelectedBusiness(null);
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: ({ businessId, body }: { businessId: string; body: Record<string, unknown> }) =>
      api.post(`/admin/subscriptions/${businessId}/record-payment`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      setSelectedBusiness(null);
    },
  });

  const openModal = (business: Business, act: 'edit' | 'extend' | 'payment') => {
    setSelectedBusiness(business);
    setAction(act);
    if (act === 'edit' && business.subscription) {
      setEditForm({
        planType: (business.subscription.planType as 'SOLO' | 'TEAM' | 'BUSINESS') || 'SOLO',
        status: (business.subscription.status as 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'PAST_DUE') || 'ACTIVE',
        currentPeriodEnd: business.subscription.currentPeriodEnd
          ? new Date(business.subscription.currentPeriodEnd).toISOString().slice(0, 10)
          : '',
        payoneerEmail: business.subscription.payoneerEmail ?? '',
        adminNotes: '',
      });
    }
    if (act === 'payment' && business.subscription) {
      setPaymentForm({
        planType: (business.subscription.planType as 'SOLO' | 'TEAM' | 'BUSINESS') || 'SOLO',
        months: 1,
        payoneerEmail: business.subscription.payoneerEmail ?? '',
        adminNotes: '',
      });
    }
  };

  const handleEdit = () => {
    if (!selectedBusiness?.subscription) return;
    const body: Record<string, unknown> = {};
    if (editForm.planType) body.planType = editForm.planType;
    if (editForm.status) body.status = editForm.status;
    if (editForm.currentPeriodEnd) body.currentPeriodEnd = editForm.currentPeriodEnd;
    if (editForm.payoneerEmail !== undefined) body.payoneerEmail = editForm.payoneerEmail;
    if (editForm.adminNotes) body.adminNotes = editForm.adminNotes;
    updateMutation.mutate({ businessId: selectedBusiness.id, body });
  };

  const handleExtend = () => {
    if (!selectedBusiness) return;
    extendMutation.mutate({
      businessId: selectedBusiness.id,
      months: parseInt(extendMonths || '1', 10),
    });
  };

  const handleRecordPayment = () => {
    if (!selectedBusiness) return;
    recordPaymentMutation.mutate({
      businessId: selectedBusiness.id,
      body: {
        planType: paymentForm.planType,
        months: paymentForm.months,
        payoneerEmail: paymentForm.payoneerEmail || undefined,
        adminNotes: paymentForm.adminNotes || undefined,
      },
    });
  };

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
  const trialingSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'TRIALING');
  const cancelledSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'CANCELLED');
  const pastDueSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'PAST_DUE');

  const planCounts: Record<string, number> = {
    SOLO: subscriptions.filter((b) => b.subscription?.planType === 'SOLO').length,
    TEAM: subscriptions.filter((b) => b.subscription?.planType === 'TEAM').length,
    BUSINESS: subscriptions.filter((b) => b.subscription?.planType === 'BUSINESS').length,
  };

  const pending = updateMutation.isPending || extendMutation.isPending || recordPaymentMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manual Payoneer subscription management. All changes are manual.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Active</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{activeSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-100 opacity-50" />
        </Card>
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Trialing</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{trialingSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-100 opacity-50" />
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
            <p className="text-sm font-medium text-zinc-600">Cancelled</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{cancelledSubscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-100 opacity-50" />
        </Card>
        <Card className="relative overflow-hidden p-6">
          <div className="relative">
            <p className="text-sm font-medium text-zinc-600">Total</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{subscriptions.length}</p>
          </div>
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-zinc-100 opacity-50" />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">Plan Distribution</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(planCounts).map(([plan, count]) => (
            <div key={plan} className="rounded-lg bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-600">{PLAN_LABELS[plan] ?? plan}</p>
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
                className="flex items-center justify-between gap-4 rounded-lg bg-zinc-50 p-4"
              >
                <div
                  className="flex flex-1 cursor-pointer items-center gap-4"
                  onClick={() => router.push(`/admin/businesses/${business.id}`)}
                >
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
                    <p className="font-semibold text-zinc-900">
                      {PLAN_LABELS[business.subscription?.planType ?? ''] ?? business.subscription?.planType}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Ends{' '}
                      {business.subscription &&
                        new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_COLORS[business.subscription?.status ?? ''] ?? 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {business.subscription?.status}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(business, 'edit');
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(business, 'extend');
                      }}
                    >
                      <CalendarPlus className="mr-1 h-4 w-4" />
                      Extend
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(business, 'payment');
                      }}
                    >
                      <Banknote className="mr-1 h-4 w-4" />
                      Record Payment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/businesses/${business.id}`)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'edit' && 'Edit Subscription'}
              {action === 'extend' && 'Extend Period'}
              {action === 'payment' && 'Record Payoneer Payment'}
            </DialogTitle>
            <DialogDescription>
              {selectedBusiness?.name} — {selectedBusiness?.user.email}
            </DialogDescription>
          </DialogHeader>
          {action === 'edit' && (
            <div className="space-y-4">
              <div>
                <Label>Plan</Label>
                <select
                  value={editForm.planType}
                  onChange={(e) => setEditForm((f) => ({ ...f, planType: e.target.value as typeof editForm.planType }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs"
                >
                  <option value="SOLO">{PLAN_LABELS.SOLO}</option>
                  <option value="TEAM">{PLAN_LABELS.TEAM}</option>
                  <option value="BUSINESS">{PLAN_LABELS.BUSINESS}</option>
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as typeof editForm.status }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs"
                >
                  <option value="TRIALING">Trialing</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAST_DUE">Past Due</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <Label>Period End (YYYY-MM-DD)</Label>
                <Input
                  type="date"
                  value={editForm.currentPeriodEnd}
                  onChange={(e) => setEditForm((f) => ({ ...f, currentPeriodEnd: e.target.value }))}
                />
              </div>
              <div>
                <Label>Payoneer Email</Label>
                <Input
                  value={editForm.payoneerEmail}
                  onChange={(e) => setEditForm((f) => ({ ...f, payoneerEmail: e.target.value }))}
                  placeholder="subscriber@example.com"
                />
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Input
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  placeholder="Internal notes"
                />
              </div>
            </div>
          )}
          {action === 'extend' && (
            <div className="space-y-4">
              <div>
                <Label>Extend by (months)</Label>
                <Input
                  type="number"
                  min="1"
                  value={extendMonths}
                  onChange={(e) => setExtendMonths(e.target.value)}
                />
              </div>
            </div>
          )}
          {action === 'payment' && (
            <div className="space-y-4">
              <div>
                <Label>Plan (paid)</Label>
                <select
                  value={paymentForm.planType}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, planType: e.target.value as typeof paymentForm.planType }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs"
                >
                  <option value="SOLO">{PLAN_LABELS.SOLO}</option>
                  <option value="TEAM">{PLAN_LABELS.TEAM}</option>
                  <option value="BUSINESS">{PLAN_LABELS.BUSINESS}</option>
                </select>
              </div>
              <div>
                <Label>Months</Label>
                <Input
                  type="number"
                  min="1"
                  value={paymentForm.months}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, months: parseInt(e.target.value, 10) || 1 }))}
                />
              </div>
              <div>
                <Label>Payoneer Email</Label>
                <Input
                  value={paymentForm.payoneerEmail}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, payoneerEmail: e.target.value }))}
                  placeholder="subscriber@example.com"
                />
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Input
                  value={paymentForm.adminNotes}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  placeholder="Payment reference, etc."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBusiness(null)} disabled={pending}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (action === 'edit') handleEdit();
                if (action === 'extend') handleExtend();
                if (action === 'payment') handleRecordPayment();
              }}
              disabled={pending}
            >
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {action === 'edit' && 'Save'}
              {action === 'extend' && 'Extend'}
              {action === 'payment' && 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
