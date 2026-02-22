'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { Invoice } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { shareInvoiceWithPdf } from '@/lib/whatsapp-share';
import { MessageCircle, Download } from 'lucide-react';

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => api.get<Invoice>(`/invoices/${id}`),
  });

  if (isLoading || !invoice) {
    return (
      <div className="space-y-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  const [sending, setSending] = useState(false);

  async function handleSendViaWhatsApp() {
    if (!invoice) return;
    setSending(true);
    try {
      toast.info('Opening WhatsApp…');
      await shareInvoiceWithPdf(
        invoice.id,
        invoice.invoiceNumber,
        invoice.client?.name ?? 'Client',
        invoice.business?.name ?? 'Clenvora',
      );
      toast.success('WhatsApp opened! Send the message to share the invoice.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open WhatsApp');
    } finally {
      setSending(false);
    }
  }

  async function handleDownloadPdf() {
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
    toast.success('PDF downloaded');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
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
            <p className="text-sm font-medium text-zinc-500">Client</p>
            <p>{invoice.client?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Amount</p>
            <p className="text-xl font-semibold">£{Number(invoice.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Due date</p>
            <p>{format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
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
