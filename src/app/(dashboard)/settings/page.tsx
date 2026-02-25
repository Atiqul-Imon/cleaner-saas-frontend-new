'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RequireOwner } from '@/components/require-owner';

type InvoiceTemplate = 'classic' | 'modern' | 'minimal' | 'professional' | 'elegant' | 'bold';

interface BusinessSettings {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  vatEnabled: boolean;
  vatNumber?: string | null;
  invoiceTemplate?: string | null;
}

const INVOICE_TEMPLATES: { id: InvoiceTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'bold', label: 'Bold' },
];

function SettingsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vatEnabled, setVatEnabled] = useState(false);
  const [vatNumber, setVatNumber] = useState('');
  const [invoiceTemplate, setInvoiceTemplate] = useState<InvoiceTemplate>('classic');
  const [saving, setSaving] = useState(false);

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', 'settings'],
    queryFn: () => api.get<BusinessSettings>('/business'),
    enabled: user?.role === 'OWNER',
  });

  useEffect(() => {
    if (business) {
      setName(business.name);
      setPhone(business.phone ?? '');
      setAddress(business.address ?? '');
      setVatEnabled(business.vatEnabled ?? false);
      setVatNumber(business.vatNumber ?? '');
      setInvoiceTemplate(
        (business.invoiceTemplate as InvoiceTemplate) || 'classic'
      );
    }
  }, [business]);

  if (userLoading || !user) return null;

  if (user.role !== 'OWNER') {
    router.replace('/dashboard');
    return null;
  }

  if (isLoading || !business) {
    return (
      <div className="space-y-6">
        <p className="text-zinc-500">Loading settings…</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/business', {
        name,
        phone: phone || undefined,
        address: address || undefined,
        vatEnabled,
        vatNumber: vatEnabled ? vatNumber || undefined : undefined,
        invoiceTemplate,
      });
      await queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">Manage your business profile and preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business</CardTitle>
            <CardDescription>Business details shown on invoices and communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Business name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Sparkle Clean"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7911 123456"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 High Street, London"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="vatEnabled"
                checked={vatEnabled}
                onChange={(e) => setVatEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Label htmlFor="vatEnabled" className="cursor-pointer font-normal">
                Enable VAT
              </Label>
            </div>
            {vatEnabled && (
              <div>
                <Label htmlFor="vatNumber">VAT number</Label>
                <Input
                  id="vatNumber"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="GB123456789"
                  className="mt-1.5"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Invoice template</CardTitle>
            <CardDescription>Choose the default layout for your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {INVOICE_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInvoiceTemplate(t.id)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    invoiceTemplate === t.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireOwner>
      <SettingsContent />
    </RequireOwner>
  );
}
