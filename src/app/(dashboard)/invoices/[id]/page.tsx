'use client';

import { useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Invoice } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { shareInvoiceWithPdf } from '@/lib/whatsapp-share';
import { MessageCircle, Download } from 'lucide-react';

function InvoiceDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: invoice, isLoading, isError, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => api.get<Invoice>(`/invoices/${id}`),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <p className="text-red-600">{error instanceof Error ? error.message : 'Failed to load invoice'}</p>
        <Button variant="outline" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-8">
        <p className="text-zinc-500">Invoice not found</p>
        <Button variant="outline" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      </div>
    );
  }

  async function handleSendViaWhatsApp() {
    if (!invoice) return;
    setMessage(null);
    setSending(true);
    try {
      await shareInvoiceWithPdf(
        invoice.id,
        invoice.invoiceNumber,
        invoice.client?.name ?? 'Client',
        invoice.business?.name ?? 'Clenvora',
      );
      setMessage({ type: 'success', text: 'Use share menu or check downloads.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to share invoice.' });
    } finally {
      setSending(false);
    }
  }

  async function handleDownloadPdf() {
    setMessage(null);
    try {
      const supabase = (await import('@/lib/supabase/client')).createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`${api.getBaseUrl()}/invoices/${id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice?.invoiceNumber ?? 'invoice'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'PDF downloaded.' });
    } catch {
      setMessage({ type: 'error', text: 'Download failed.' });
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
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
      <div>
        <Link href="/invoices" className="text-sm text-zinc-600 hover:underline">
          ← Back to invoices
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Invoice information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-zinc-700">Client</p>
            <p className="mt-0.5 text-base leading-relaxed text-zinc-900">{invoice.client?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">Amount</p>
            <p className="mt-0.5 text-xl font-bold text-zinc-900">£{Number(invoice.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">Due date</p>
            <p className="mt-0.5 text-base leading-relaxed text-zinc-900">{format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSendViaWhatsApp}
          disabled={sending || !invoice.client?.phone}
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
        >
          <MessageCircle className="size-4" />
          Send via WhatsApp
        </Button>
        <Button variant="outline" onClick={handleDownloadPdf}>
          <Download className="size-4" />
          Download PDF
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      </div>
      {!invoice.client?.phone && (
        <p className="text-sm text-amber-600">
          Add a phone number to the client to send invoices via WhatsApp.
        </p>
      )}
    </div>
  );
}

export default function InvoiceDetailPage() {
  return (
    <RequireOwner>
      <InvoiceDetailContent />
    </RequireOwner>
  );
}
