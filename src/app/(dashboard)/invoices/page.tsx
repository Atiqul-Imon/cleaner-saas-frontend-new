'use client';

import { Suspense, useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { sendInvoiceViaWhatsApp } from '@/lib/whatsapp-share';
import type { Invoice } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';

function InvoicesContentInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') as 'PAID' | 'UNPAID' | null;

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', status],
    queryFn: () =>
      api.get<{ data: Invoice[] } | Invoice[]>(
        status ? `/invoices?status=${status}` : '/invoices'
      ),
  });

  const list = Array.isArray(invoices)
    ? invoices
    : (invoices as { data?: Invoice[] })?.data ?? [];
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function handleQuickWhatsApp(e: React.MouseEvent, inv: Invoice) {
    e.preventDefault();
    e.stopPropagation();
    if (!inv.client?.phone) {
      toast.error('Add phone number to client to send via WhatsApp');
      return;
    }
    setSendingId(inv.id);
    try {
      await sendInvoiceViaWhatsApp(inv.id);
      toast.success('WhatsApp opened');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open WhatsApp');
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
        <p className="text-zinc-600">Manage invoices</p>
      </div>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-zinc-900">All invoices</CardTitle>
          <CardDescription>{list.length} invoice(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((inv) => {
                const hasPhone = !!inv.client?.phone;
                return (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-100"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">#{inv.invoiceNumber}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {inv.client?.name} · {format(new Date(inv.dueDate), 'MMM d')}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-medium text-zinc-900">£{Number(inv.totalAmount)}</p>
                        <Badge variant={inv.status === 'PAID' ? 'default' : 'secondary'}>
                          {inv.status}
                        </Badge>
                      </div>
                      {hasPhone && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 shrink-0 text-[#25D366] hover:bg-[#25D366]/10"
                          onClick={(e) => handleQuickWhatsApp(e, inv)}
                          disabled={sendingId === inv.id}
                        >
                          <MessageCircle className="size-4" />
                        </Button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center">
              <p className="text-sm text-zinc-600">No invoices yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <RequireOwner>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <InvoicesContentInner />
      </Suspense>
    </RequireOwner>
  );
}
