'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

const INVOICE_TEMPLATES: {
  id: InvoiceTemplate;
  label: string;
  description: string;
  preview: ReactNode;
}[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Traditional layout with clear sections',
    preview: (
      <div className="rounded border border-zinc-300 bg-white p-2.5">
        <div className="flex justify-between border-b-2 border-zinc-300 pb-2 text-[10px]">
          <div>
            <div className="font-bold text-zinc-900">Business Name</div>
            <div className="text-zinc-500">Address</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-zinc-900">INVOICE</div>
            <div className="text-zinc-500">#INV-001</div>
          </div>
        </div>
        <div className="mt-2 rounded bg-zinc-50 p-1.5 text-[10px]">
          <div className="font-semibold text-zinc-900">Client Name</div>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 text-[10px]">
          <span className="text-zinc-600">Total</span>
          <span className="font-bold text-zinc-900">£100.00</span>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Clean design with subtle accents',
    preview: (
      <div className="rounded border border-zinc-200 bg-white p-2.5 shadow-sm">
        <div className="flex justify-between border-b border-zinc-200 pb-2 text-[10px]">
          <div className="font-bold text-zinc-900">Business Name</div>
          <div className="font-bold text-zinc-900">INVOICE</div>
        </div>
        <div className="mt-2 space-y-1 text-[10px]">
          <div className="text-[9px] uppercase text-zinc-500">Bill To</div>
          <div className="font-semibold text-zinc-900">Client Name</div>
        </div>
        <div className="mt-2 rounded bg-zinc-50 p-2 text-[10px]">
          <div className="flex justify-between">
            <span className="text-zinc-600">Total</span>
            <span className="font-bold text-zinc-900">£100.00</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Simple and uncluttered',
    preview: (
      <div className="rounded border border-zinc-200 bg-white p-2.5">
        <div className="pb-3 text-center text-[10px]">
          <div className="font-light text-zinc-900">Business Name</div>
          <div className="text-[9px] text-zinc-500">INVOICE #INV-001</div>
        </div>
        <div className="space-y-1 border-y border-zinc-200 py-3 text-[10px]">
          <div className="text-zinc-500">Bill To</div>
          <div className="font-medium text-zinc-900">Client Name</div>
        </div>
        <div className="mt-3 text-center text-lg font-light text-zinc-900">£100.00</div>
      </div>
    ),
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Corporate style with dark accents',
    preview: (
      <div className="rounded border border-zinc-200 bg-white p-2.5">
        <div className="flex justify-between border-b-2 border-zinc-900 pb-2">
          <div className="text-[10px]">
            <div className="mb-1 h-5 w-5 rounded bg-zinc-900" />
            <div className="font-bold text-zinc-900">Business Name</div>
          </div>
          <div className="rounded bg-zinc-900 px-2 py-1 text-[9px] text-white">
            <div className="uppercase">Invoice</div>
            <div className="font-bold">#INV-001</div>
          </div>
        </div>
        <div className="mt-2 border-l-4 border-zinc-900 bg-zinc-50 p-2 text-[10px]">
          <div className="font-bold text-zinc-900">Client Name</div>
        </div>
        <div className="mt-2 rounded bg-zinc-900 p-2 text-[10px] text-white">
          <div className="flex justify-between">
            <span className="uppercase">Total</span>
            <span className="font-bold">£100.00</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Refined with centered layout',
    preview: (
      <div className="rounded border border-zinc-200 border-t-2 border-t-zinc-900 bg-white p-2.5">
        <div className="pb-3 text-center">
          <div className="inline-block rounded border-2 border-zinc-900 px-2 py-1 text-[10px] font-medium text-zinc-900">
            Business Name
          </div>
          <div className="mt-1 text-[9px] text-zinc-500">INVOICE #INV-001</div>
        </div>
        <div className="space-y-2 text-[10px]">
          <div className="text-[9px] uppercase text-zinc-500">Bill To</div>
          <div className="font-semibold text-zinc-900">Client Name</div>
        </div>
        <div className="mt-2 border-y-2 border-zinc-900 py-3 text-center text-base font-medium text-zinc-900">
          £100.00
        </div>
      </div>
    ),
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Strong typography with dark header',
    preview: (
      <div className="rounded border-2 border-zinc-900 bg-white p-2.5">
        <div className="flex justify-between rounded-t bg-zinc-900 p-2 text-[10px] text-white">
          <div className="font-bold">Business Name</div>
          <div className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white">
            #INV-001
          </div>
        </div>
        <div className="space-y-1 p-2 text-[10px]">
          <div className="text-[9px] font-bold uppercase text-zinc-500">Bill To</div>
          <div className="font-bold text-zinc-900">Client Name</div>
        </div>
        <div className="rounded-b bg-zinc-900 p-2 text-center text-[10px] font-bold text-white">
          £100.00
        </div>
      </div>
    ),
  },
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setMessage(null);
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
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
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

      {message && (
        <div
          role="alert"
          className={cn(
            'rounded-lg border p-4 text-sm',
            message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'
          )}
        >
          {message.text}
        </div>
      )}

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INVOICE_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInvoiceTemplate(t.id)}
                  className={`text-left transition-all ${
                    invoiceTemplate === t.id
                      ? 'ring-2 ring-emerald-600 ring-offset-2'
                      : 'hover:ring-2 hover:ring-zinc-300'
                  } rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:border-zinc-300`}
                >
                  <div className="pointer-events-none mb-3 h-24 overflow-hidden rounded border border-zinc-100 bg-zinc-50/50">
                    {t.preview}
                  </div>
                  <div className="font-semibold text-zinc-900">{t.label}</div>
                  <p className="mt-0.5 text-xs text-zinc-600">{t.description}</p>
                  {invoiceTemplate === t.id && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </div>
                  )}
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
