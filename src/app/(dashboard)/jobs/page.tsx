'use client';

import { Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

function JobsContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? undefined;
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', status],
    queryFn: () =>
      api.get<{ data: Job[] } | Job[]>(status ? `/jobs?status=${status}` : '/jobs'),
  });

  const list = normalizeList<Job>(jobs);

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

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">All jobs</CardTitle>
          <CardDescription className="text-zinc-700">{list.length} job(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
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
