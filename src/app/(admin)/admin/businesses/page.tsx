'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Building2, Mail, Phone, MapPin, Loader2, ChevronRight } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  subscription?: {
    planType: string;
    status: string;
    currentPeriodEnd: string;
  };
  _count: {
    clients: number;
    jobs: number;
    invoices: number;
  };
}

export default function AdminBusinessesPage() {
  const router = useRouter();
  const { isAdmin, isLoading: roleLoading } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const businessesQuery = useQuery({
    queryKey: ['admin', 'businesses', currentPage],
    queryFn: () =>
      api.get<{ businesses: Business[]; pagination: { page: number; totalPages: number; total: number } }>(
        `/admin/businesses?page=${currentPage}&limit=20`
      ),
    enabled: isAdmin,
  });

  if (roleLoading || businessesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const businesses = businessesQuery.data?.businesses ?? [];
  const pagination = businessesQuery.data?.pagination;

  const filteredBusinesses = businesses.filter((business) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      business.name.toLowerCase().includes(query) ||
      business.user.email.toLowerCase().includes(query) ||
      business.phone?.toLowerCase().includes(query) ||
      business.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Businesses</h1>
          <p className="mt-1 text-sm text-zinc-600">Manage all registered businesses</p>
        </div>
        <div className="text-sm text-zinc-600">
          Total: <span className="font-semibold text-zinc-900">{pagination?.total ?? 0}</span>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </Card>

      {filteredBusinesses.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Building2 className="mb-4 h-16 w-16 text-zinc-400" />
            <p className="text-lg font-medium text-zinc-600">
              {searchQuery ? 'No businesses found' : 'No businesses registered yet'}
            </p>
            {searchQuery && <p className="mt-2 text-sm text-zinc-500">Try adjusting your search query</p>}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBusinesses.map((business) => (
            <Card
              key={business.id}
              className="cursor-pointer p-6 transition-colors hover:bg-zinc-50"
              onClick={() => router.push(`/admin/businesses/${business.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-lg">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-zinc-900 truncate">{business.name}</h3>
                      {business.subscription && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            business.subscription.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : business.subscription.status === 'TRIALING'
                                ? 'bg-blue-100 text-blue-700'
                                : business.subscription.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {business.subscription.planType}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm text-zinc-600">
                        <Mail className="h-4 w-4" />
                        {business.user.email}
                      </p>
                      {business.phone && (
                        <p className="flex items-center gap-2 text-sm text-zinc-600">
                          <Phone className="h-4 w-4" />
                          {business.phone}
                        </p>
                      )}
                      {business.address && (
                        <p className="flex items-center gap-2 text-sm text-zinc-600">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{business.address}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-zinc-600">
                      <span className="font-semibold text-zinc-900">{business._count.clients}</span>
                      <span>clients</span>
                      <span className="font-semibold text-zinc-900">{business._count.jobs}</span>
                      <span>jobs</span>
                      <span className="font-semibold text-zinc-900">{business._count.invoices}</span>
                      <span>invoices</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-zinc-500">
                    Joined{' '}
                    {new Date(business.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <ChevronRight className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
