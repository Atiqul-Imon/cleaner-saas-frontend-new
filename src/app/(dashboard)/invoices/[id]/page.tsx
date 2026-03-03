'use client';

import { useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { InlineMessage } from '@/components/ui/inline-message';
import type { Invoice } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/date-format';
import { shareInvoiceWithPdf } from '@/lib/whatsapp-share';
import { alertDialog } from '@/components/alert-dialog-provider';
import { MessageCircle, Download, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CARD', label: 'Card' },
  { value: 'CASH', label: 'Cash' },
] as const;

function InvoiceDetailContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER');
  const [editAmount, setEditAmount] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  async function handleMarkAsPaid() {
    setSubmitting(true);
    setMessage(null);
    try {
      await api.put(`/invoices/${id}/mark-paid`, { paymentMethod });
      setMarkPaidOpen(false);
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setMessage({ type: 'success', text: 'Invoice marked as paid.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to mark as paid.' });
    } finally {
      setSubmitting(false);
    }
  }

  function openEditDialog() {
    if (!invoice) return;
    setEditAmount(Number(invoice.amount).toString());
    setEditDueDate(new Date(invoice.dueDate).toISOString().slice(0, 10));
    setEditOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(editAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await api.patch(`/invoices/${id}`, { amount, dueDate: editDueDate || undefined });
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setMessage({ type: 'success', text: 'Invoice updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update invoice.' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeleteClick() {
    const jobId = invoice?.job?.id;
    alertDialog.confirm(
      'Delete invoice?',
      'This cannot be undone. You will be able to create a new invoice for this job.',
      async () => {
        setMessage(null);
        try {
          await api.delete(`/invoices/${id}`);
          queryClient.invalidateQueries({ queryKey: ['invoices'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          if (jobId) {
            queryClient.invalidateQueries({ queryKey: ['job', jobId] });
            router.push(`/jobs/${jobId}`);
          } else {
            router.push('/invoices');
          }
        } catch (err) {
          setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete invoice.' });
        }
      },
      undefined,
      'Delete',
      'Cancel'
    );
  }

  const isUnpaid = invoice.status === 'UNPAID';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {message && (
        <InlineMessage type={message.type}>{message.text}</InlineMessage>
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
            <p className="mt-0.5 text-base leading-relaxed text-zinc-900">{formatDate(invoice.dueDate, 'short')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {isUnpaid && (
          <Button
            onClick={() => setMarkPaidOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="size-4" />
            Mark as paid
          </Button>
        )}
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
        {isUnpaid && (
          <>
            <Button variant="outline" onClick={openEditDialog}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDeleteClick} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </>
        )}
        <Button variant="ghost" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      </div>
      {!invoice.client?.phone && (
        <p className="text-sm text-amber-600">
          Add a phone number to the client to send invoices via WhatsApp.
        </p>
      )}

      {/* Mark as paid dialog */}
      <Dialog open={markPaidOpen} onOpenChange={setMarkPaidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as paid</DialogTitle>
            <DialogDescription>
              Select how the client paid. This will record the payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment method</Label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      paymentMethod === pm.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkPaidOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid} disabled={submitting}>
              {submitting ? 'Saving…' : 'Mark as paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit invoice</DialogTitle>
            <DialogDescription>
              Change the amount or due date. VAT will be recalculated automatically if enabled.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (£)</Label>
              <Input
                id="edit-amount"
                type="number"
                min="0"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due-date">Due date</Label>
              <Input
                id="edit-due-date"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                disabled={submitting}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
