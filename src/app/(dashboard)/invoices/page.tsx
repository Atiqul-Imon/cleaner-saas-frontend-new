'use client';

import { Suspense, useState } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { shareInvoiceWithPdf } from '@/lib/whatsapp-share';
import type { Invoice } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { InlineMessage } from '@/components/ui/inline-message';
import { VirtualGrid } from '@/components/ui/virtual-grid';

function InvoicesContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status') as 'PAID' | 'UNPAID' | null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const queryClient = useQueryClient();

  const limit = 50; // Items per page

  const { data: response, isLoading } = useQuery({
    queryKey: ['invoices', status, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (status) params.set('status', status);
      return api.get<{ data: Invoice[]; total: number; page: number; totalPages: number }>(`/invoices?${params}`);
    },
    staleTime: 2 * 60 * 1000,
  });

  const list = response?.data || [];
  const total = response?.total || 0;
  const totalPages = response?.totalPages || 1;
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('page', newPage.toString());
    router.push(`/invoices?${params}`);
  };

  async function handleQuickWhatsApp(e: React.MouseEvent, inv: Invoice) {
    e.preventDefault();
    e.stopPropagation();
    setMessage(null);
    setSendingId(inv.id);
    try {
      await shareInvoiceWithPdf(
        inv.id,
        inv.invoiceNumber,
        inv.client?.name ?? 'Client',
        inv.business?.name ?? 'Clenvora',
      );
      setMessage({ type: 'success', text: 'Use share menu or check downloads.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to share invoice.' });
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
        <p className="mt-1 text-base leading-relaxed text-zinc-700">Manage invoices</p>
      </div>

      {message && (
        <InlineMessage type={message.type}>{message.text}</InlineMessage>
      )}

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">All invoices</CardTitle>
          <CardDescription className="text-zinc-700">
            Showing {list.length > 0 ? ((page - 1) * limit + 1) : 0}-{Math.min(page * limit, total)} of {total} invoice(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <>
              <VirtualGrid
                items={list}
                renderItem={(inv) => (
                  <Link
                    href={`/invoices/${inv.id}`}
                    onMouseEnter={() => {
                      queryClient.prefetchQuery({
                        queryKey: ['invoice', inv.id],
                        queryFn: () => api.get<Invoice>(`/invoices/${inv.id}`),
                      });
                    }}
                    className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-4"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">#{inv.invoiceNumber}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 shrink-0 text-[#25D366] hover:bg-[#25D366]/10"
                        onClick={(e) => handleQuickWhatsApp(e, inv)}
                        disabled={sendingId === inv.id}
                      >
                        <MessageCircle className="size-4" />
                      </Button>
                    </div>
                  </Link>
                )}
              />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-zinc-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-12 text-center">
              <p className="text-base text-zinc-700">No invoices yet</p>
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
