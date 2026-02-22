'use client';

import { useQuery } from '@tanstack/react-query';
import { RequireOwner } from '@/components/require-owner';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import type { Client } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ClientsContent() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<{ data: Client[] } | Client[]>('/clients'),
  });

  const list = Array.isArray(clients) ? clients : (clients as { data?: Client[] })?.data ?? [];

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Clients</h1>
          <p className="mt-1 text-base leading-relaxed text-zinc-700">Manage your clients</p>
        </div>
        <Button asChild>
          <Link href="/clients/new" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Add client
          </Link>
        </Button>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">All clients</CardTitle>
          <CardDescription className="text-zinc-700">{list.length} client(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <div className="grid gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex flex-col rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-4"
                >
                  <p className="font-medium text-zinc-900">{client.name}</p>
                  {client.phone && (
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{client.phone}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-12 text-center">
              <p className="text-base text-zinc-700">No clients yet</p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/clients/new">Add first client</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <RequireOwner>
      <ClientsContent />
    </RequireOwner>
  );
}
