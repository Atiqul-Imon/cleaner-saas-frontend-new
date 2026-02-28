'use client';

import { useUser } from '@/hooks/use-user';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequireOwner } from '@/components/require-owner';
import { CheckCircle2, ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { alertDialog } from '@/components/alert-dialog-provider';

interface Subscription {
  id: string;
  planType: 'SOLO' | 'TEAM' | 'BUSINESS';
  status: 'ACTIVE' | 'TRIALING' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodEnd: string;
  trialEndsAt?: string | null;
  payoneerEmail?: string | null;
}

interface UsageStats {
  currentPlan: 'SOLO' | 'TEAM' | 'BUSINESS';
  status: string;
  currentMonthUsage: number;
  monthlyLimit: number;
  cleanerLimit: number;
  usage: Array<{
    month: number;
    year: number;
    jobCount: number;
  }>;
}

interface Business {
  id: string;
  name: string;
  _count: {
    cleaners: number;
  };
}

const PLANS = [
  {
    type: 'SOLO' as const,
    name: 'Solo',
    price: 'FREE',
    priceDetail: 'Forever',
    staff: 1,
    jobs: 20,
    features: [
      '1 staff member',
      '20 jobs per month',
      'Client management',
      'Basic invoicing',
      'Photo uploads',
      'Payment tracking',
    ],
    badge: null,
  },
  {
    type: 'TEAM' as const,
    name: 'Team',
    price: '£14',
    priceDetail: '/month',
    staff: 20,
    jobs: 'Unlimited',
    features: [
      'Up to 20 staff',
      'Unlimited jobs',
      'Everything in Solo',
      'Team management',
      'Recurring jobs',
      'Priority support',
    ],
    badge: 'Most Popular',
  },
  {
    type: 'BUSINESS' as const,
    name: 'Business',
    price: '£49',
    priceDetail: '/month',
    staff: 1000,
    jobs: 'Unlimited',
    features: [
      'Unlimited staff',
      'Unlimited jobs',
      'Everything in Team',
      'API access',
      'Advanced analytics',
      'Dedicated support',
    ],
    badge: null,
  },
];

function SubscriptionContent() {
  const { user } = useUser();

  const { data: subscription, isLoading: subLoading, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get<Subscription>('/subscriptions'),
  });

  const { data: usageStats, isLoading: usageLoading, refetch: refetchUsage } = useQuery({
    queryKey: ['subscription-usage'],
    queryFn: () => api.get<UsageStats>('/subscriptions/usage'),
  });

  const { data: business, isLoading: businessLoading, refetch: refetchBusiness } = useQuery({
    queryKey: ['business', 'settings'],
    queryFn: () => api.get<Business>('/business'),
  });

  const loading = subLoading || usageLoading || businessLoading;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="h-32 animate-pulse rounded-lg bg-zinc-200" />
      </div>
    );
  }

  const currentPlan = PLANS.find((p) => p.type === subscription?.planType);
  const usagePercentage = usageStats
    ? Math.min((usageStats.currentMonthUsage / usageStats.monthlyLimit) * 100, 100)
    : 0;
  const isNearLimit = usageStats && usageStats.currentMonthUsage >= usageStats.monthlyLimit * 0.8;
  const isOverLimit = usageStats && usageStats.currentMonthUsage >= usageStats.monthlyLimit;

  const activeStaffCount = business?._count?.cleaners || 0;
  const staffLimit = usageStats?.cleanerLimit || 1;
  const isNearStaffLimit = activeStaffCount >= staffLimit * 0.8;

  const handleUpgradeRequest = async (planType: 'TEAM' | 'BUSINESS') => {
    const targetPlan = PLANS.find(p => p.type === planType);
    if (!targetPlan) return;

    alertDialog.confirm(
      `Upgrade to ${targetPlan.name}?`,
      `Your plan will be upgraded to ${targetPlan.name} (${targetPlan.price}${targetPlan.priceDetail}) immediately. You'll be charged on your next billing cycle.`,
      async () => {
        try {
          await api.post('/upgrade-requests', { toPlan: planType });
          refetchSubscription();
          refetchUsage();
          refetchBusiness();
          alertDialog.success(
            'Plan Upgraded!',
            'Your plan has been upgraded successfully. You will be charged for the new plan next billing cycle.',
          );
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to upgrade plan';
          alertDialog.error('Upgrade Failed', message);
        }
      },
      undefined,
      'Yes, Upgrade',
      'Cancel',
    );
  };

  const handleDowngradeRequest = async (planType: 'SOLO' | 'TEAM') => {
    const targetPlan = PLANS.find(p => p.type === planType);
    if (!targetPlan || !business || !usageStats) return;

    // Check if downgrade is possible
    const currentStaffCount = business._count.cleaners;
    const targetStaffLimit = typeof targetPlan.staff === 'number' ? targetPlan.staff : 1000;
    const targetJobLimit = typeof targetPlan.jobs === 'number' ? targetPlan.jobs : 9999;

    // Check staff limit
    if (currentStaffCount > targetStaffLimit) {
      alertDialog.error(
        'Cannot Downgrade',
        `You currently have ${currentStaffCount} staff members, but ${targetPlan.name} only allows ${targetStaffLimit}. Please remove ${currentStaffCount - targetStaffLimit} staff member${currentStaffCount - targetStaffLimit > 1 ? 's' : ''} first.`,
      );
      return;
    }

    // Check job usage for this month
    if (usageStats.currentMonthUsage > targetJobLimit) {
      alertDialog.error(
        'Cannot Downgrade',
        `You've used ${usageStats.currentMonthUsage} jobs this month, but ${targetPlan.name} only allows ${targetJobLimit}. Please wait until next month to downgrade.`,
      );
      return;
    }

    // Confirm downgrade
    alertDialog.confirm(
      `Downgrade to ${targetPlan.name}?`,
      `Your plan will be downgraded to ${targetPlan.name}. You'll have ${targetStaffLimit} staff and ${typeof targetPlan.jobs === 'number' ? `${targetPlan.jobs} jobs/month` : 'unlimited jobs'}. Changes apply immediately.`,
      async () => {
        try {
          await api.post('/upgrade-requests', { toPlan: planType });
          refetchSubscription();
          refetchUsage();
          refetchBusiness();
          alertDialog.success(
            'Plan Downgraded',
            'Your plan has been downgraded successfully.',
          );
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to downgrade plan';
          alertDialog.error('Downgrade Failed', message);
        }
      },
      undefined,
      'Yes, Downgrade',
      'Cancel',
    );
  };

  const handleCancelSubscription = async () => {
    alertDialog.confirm(
      'Cancel Subscription?',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.',
      async () => {
        try {
          await api.post('/subscriptions/cancel');
          refetchSubscription();
          refetchUsage();
          alertDialog.success(
            'Subscription Cancelled',
            'Your subscription has been cancelled. You will retain access until the end of your current billing period.',
          );
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
          alertDialog.error('Cancellation Failed', message);
        }
      },
      undefined,
      'Yes, Cancel',
      'Keep Subscription',
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/settings">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="mr-2 size-4" />
            Back to Settings
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Subscription</h1>
        <p className="mt-1 text-sm text-zinc-600">Manage your plan and view usage</p>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                subscription?.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-700'
                  : subscription?.status === 'TRIALING'
                    ? 'bg-blue-100 text-blue-700'
                    : subscription?.status === 'PAST_DUE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {subscription?.status || 'ACTIVE'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Info */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900">{currentPlan?.name || 'Solo'}</h3>
              <p className="mt-0.5 text-sm text-zinc-600">
                {currentPlan?.staff} staff • {currentPlan?.jobs} jobs
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">{currentPlan?.price}</div>
              <div className="text-xs text-zinc-600">{currentPlan?.priceDetail}</div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="space-y-4">
            {/* Job Usage */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-700">Jobs this month</span>
                <span className={`font-semibold ${isOverLimit ? 'text-red-600' : 'text-zinc-900'}`}>
                  {usageStats?.currentMonthUsage || 0} / {usageStats?.monthlyLimit || 20}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full transition-all ${
                    isOverLimit
                      ? 'bg-red-500'
                      : isNearLimit
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              {isOverLimit && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  You've reached your monthly limit. Upgrade to continue creating jobs.
                </p>
              )}
              {isNearLimit && !isOverLimit && (
                <p className="mt-2 text-sm font-medium text-amber-600">
                  You're close to your monthly limit. Consider upgrading.
                </p>
              )}
            </div>

            {/* Staff Count */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-700">Active staff</span>
                <span className={`font-semibold ${isNearStaffLimit ? 'text-amber-600' : 'text-zinc-900'}`}>
                  {activeStaffCount} / {staffLimit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full transition-all ${
                    activeStaffCount >= staffLimit
                      ? 'bg-red-500'
                      : isNearStaffLimit
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((activeStaffCount / staffLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Trial Info */}
          {subscription?.status === 'TRIALING' && subscription.trialEndsAt && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Free trial active</p>
                  <p className="mt-1 text-sm text-blue-700">
                    Your trial ends on{' '}
                    {new Date(subscription.trialEndsAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Period End */}
          {subscription?.currentPeriodEnd && (
            <p className="text-sm text-zinc-600">
              Current period ends:{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA if on SOLO */}
      {subscription?.planType === 'SOLO' && (
        <Card className="border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-600 p-3">
                <TrendingUp className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900">Ready to grow your team?</h3>
                <p className="mt-1 text-sm text-zinc-700">
                  Upgrade to Team for just £14.99/month and add up to 15 staff with unlimited jobs. Your new plan starts immediately, and you'll be charged next billing cycle.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => handleUpgradeRequest('TEAM')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Upgrade to Team Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Plans</CardTitle>
          <CardDescription>Choose the plan that fits your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrentPlan = subscription?.planType === plan.type;
              const isMostPopular = plan.badge === 'Most Popular';

              return (
                <div
                  key={plan.type}
                  className={`relative rounded-xl border-2 p-6 transition-all ${
                    isCurrentPlan
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-lg'
                      : isMostPopular
                        ? 'border-emerald-500 bg-white shadow-md'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-zinc-900">{plan.price}</span>
                      <span className="ml-1 text-sm text-zinc-600">{plan.priceDetail}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      {typeof plan.jobs === 'number' ? `${plan.jobs} jobs/mo` : plan.jobs}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="mt-6">
                    {isCurrentPlan ? (
                      <Button variant="outline" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <>
                        {/* Determine if upgrade or downgrade */}
                        {(() => {
                          const planOrder = { SOLO: 0, TEAM: 1, BUSINESS: 2 };
                          const currentOrder = planOrder[subscription?.planType || 'SOLO'];
                          const targetOrder = planOrder[plan.type];
                          const isUpgrade = targetOrder > currentOrder;
                          const isDowngrade = targetOrder < currentOrder;

                          if (isUpgrade) {
                            return (
                              <Button
                                onClick={() => handleUpgradeRequest(plan.type as 'TEAM' | 'BUSINESS')}
                                className={
                                  isMostPopular
                                    ? 'w-full bg-emerald-600 hover:bg-emerald-700'
                                    : 'w-full'
                                }
                                variant={isMostPopular ? 'default' : 'outline'}
                              >
                                Upgrade to {plan.name}
                              </Button>
                            );
                          } else if (isDowngrade) {
                            return (
                              <Button
                                onClick={() => handleDowngradeRequest(plan.type as 'SOLO' | 'TEAM')}
                                variant="outline"
                                className="w-full"
                              >
                                Downgrade to {plan.name}
                              </Button>
                            );
                          }
                          return null;
                        })()}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="mt-8 rounded-lg bg-zinc-50 p-4">
            <h4 className="font-semibold text-zinc-900">How upgrades work</h4>
            <p className="mt-1 text-sm text-zinc-600">
              When you upgrade, your new plan starts immediately. You'll be charged for the new plan on your next billing cycle. No immediate payment required.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Info */}
      {subscription?.payoneerEmail && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-medium text-zinc-700">Payoneer: </span>
              <span className="text-zinc-900">{subscription.payoneerEmail}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Subscription */}
      {subscription && subscription.status !== 'CANCELLED' && subscription.planType !== 'SOLO' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-900">Cancel Subscription</CardTitle>
            <CardDescription className="text-red-700">
              Permanently cancel your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-zinc-700">
                Cancelling your subscription will:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                <li>• Stop future billing</li>
                <li>• Keep access until end of current period ({subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB') : 'N/A'})</li>
                <li>• Downgrade to SOLO plan after current period ends</li>
                <li>• Limit you to 1 staff and 20 jobs/month</li>
              </ul>
            </div>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              className="w-full"
            >
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Already Cancelled */}
      {subscription?.status === 'CANCELLED' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg text-amber-900">Subscription Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">
              Your subscription has been cancelled. You will retain access to your current plan until{' '}
              {subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}. After that, you'll be downgraded to the SOLO (FREE) plan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <RequireOwner>
      <SubscriptionContent />
    </RequireOwner>
  );
}
