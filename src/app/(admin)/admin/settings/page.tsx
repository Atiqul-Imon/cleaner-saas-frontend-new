'use client';

import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { isAdmin, isLoading: roleLoading } = useUser();

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">Platform configuration and preferences</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
              <div>
                <p className="font-medium text-zinc-900">Platform Name</p>
                <p className="mt-1 text-sm text-zinc-600">Clenvora</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
              <div>
                <p className="font-medium text-zinc-900">Support Email</p>
                <p className="mt-1 text-sm text-zinc-600">support@clenvora.com</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">Subscription Plans</h2>
          <p className="mb-4 text-sm text-zinc-600">
            Manual Payoneer collection. Admin updates status in Subscriptions after payment.
          </p>
          <div className="space-y-3">
            {[
              { plan: 'SOLO', price: '£4.99/mo', desc: '0 staff allowed', cleaners: 0 },
              { plan: 'TEAM', price: '£12.99/mo', desc: 'Up to 12 cleaners', cleaners: 12 },
              { plan: 'BUSINESS', price: '£25.99/mo', desc: 'Up to 100 cleaners', cleaners: 100 },
            ].map(({ plan, price, desc, cleaners }) => (
              <div key={plan} className="flex items-center justify-between rounded-lg bg-zinc-50 p-4">
                <div>
                  <p className="font-medium text-zinc-900">{plan} Plan</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {price} — {desc}
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{cleaners} staff</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">Payoneer</h2>
          <p className="mb-4 text-sm text-zinc-600">
            Subscribers pay manually via Payoneer. Admin records payments in Subscriptions and updates status.
          </p>
          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-sm text-zinc-600">
              Configure your Payoneer email and payment instructions. Admin uses Record Payment to mark subscriptions as paid after receiving Payoneer transfers.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">System Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3">
              <span className="text-zinc-600">Platform Version</span>
              <span className="font-semibold text-zinc-900">1.0.0</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3">
              <span className="text-zinc-600">Database Status</span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-zinc-900">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-3">
              <span className="text-zinc-600">API Status</span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-zinc-900">Operational</span>
              </span>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-red-200 p-6">
          <h2 className="mb-4 text-xl font-bold text-red-900">Danger Zone</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
              <div>
                <p className="font-medium text-red-900">Clear All Data</p>
                <p className="mt-1 text-sm text-red-700">Permanently delete all platform data</p>
              </div>
              <Button variant="destructive" size="sm">
                Clear Data
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
              <div>
                <p className="font-medium text-red-900">Reset Platform</p>
                <p className="mt-1 text-sm text-red-700">Reset platform to initial state</p>
              </div>
              <Button variant="destructive" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
