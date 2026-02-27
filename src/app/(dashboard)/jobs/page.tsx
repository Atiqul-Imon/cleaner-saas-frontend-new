'use client';

import { Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { RequireOwner } from '@/components/require-owner';
import { Plus } from 'lucide-react';
import { api, normalizeList } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import type { Job } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VirtualGrid } from '@/components/ui/virtual-grid';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { label: 'All Jobs', value: undefined },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
] as const;

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status') ?? undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const limit = 50; // Items per page

  const { data: response, isLoading } = useQuery({
    queryKey: ['jobs', status, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (status) params.set('status', status);
      return api.get<{ data: Job[]; total: number; page: number; totalPages: number }>(`/jobs?${params}`);
    },
    staleTime: 2 * 60 * 1000,
  });

  const list = response?.data || [];
  const total = response?.total || 0;
  const totalPages = response?.totalPages || 1;

  const handleFilterChange = (newStatus: string | undefined) => {
    const params = new URLSearchParams();
    if (newStatus) params.set('status', newStatus);
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/jobs?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('page', newPage.toString());
    router.push(`/jobs?${params}`);
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Jobs</h1>
          <p className="mt-1 text-base leading-relaxed text-zinc-700">Manage cleaning jobs</p>
        </div>
        {isOwner && (
          <Button asChild>
            <Link href="/jobs/create" className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              New job
            </Link>
          </Button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => handleFilterChange(filter.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              status === filter.value
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">
            {status ? `${status.replace('_', ' ')} Jobs` : 'All Jobs'}
          </CardTitle>
          <CardDescription className="text-zinc-700">
            Showing {list.length > 0 ? ((page - 1) * limit + 1) : 0}-{Math.min(page * limit, total)} of {total} job(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <>
              <VirtualGrid
                items={list}
                renderItem={(job) => (
                  <Link
                    href={`/jobs/${job.id}`}
                    onMouseEnter={() => {
                      queryClient.prefetchQuery({
                        queryKey: ['job', job.id],
                        queryFn: () => api.get<Job>(`/jobs/${job.id}`),
                      });
                    }}
                    className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-4"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
                        {format(new Date(job.scheduledDate), 'MMM d, yyyy')}
                        {job.scheduledTime && ` · ${job.scheduledTime}`}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-600">{job.type}</p>
                    </div>
                    <Badge
                      className="mt-3 w-fit"
                      variant={
                        job.status === 'COMPLETED'
                          ? 'default'
                          : job.status === 'IN_PROGRESS'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {job.status.replace('_', ' ')}
                    </Badge>
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
              <p className="text-base text-zinc-700">No jobs yet</p>
              {isOwner && (
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/jobs/create">Create first job</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function JobsPage() {
  return (
    <RequireOwner>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <JobsContent />
      </Suspense>
    </RequireOwner>
  );
}
