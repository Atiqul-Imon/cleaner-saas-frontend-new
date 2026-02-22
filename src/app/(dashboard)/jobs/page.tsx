'use client';

import { Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import type { Job } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? undefined;
  const { user, isLoading: userLoading } = useUser();
  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  useEffect(() => {
    if (!userLoading && user?.role === 'CLEANER') {
      router.replace('/my-jobs');
    }
  }, [user, userLoading, router]);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', status],
    queryFn: () =>
      api.get<{ data: Job[] } | Job[]>(status ? `/jobs?status=${status}` : '/jobs'),
  });

  const list = Array.isArray(jobs) ? jobs : (jobs as { data?: Job[] })?.data ?? [];

  if (!userLoading && user?.role === 'CLEANER') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-zinc-500">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Jobs</h1>
          <p className="text-zinc-600">Manage cleaning jobs</p>
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

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-zinc-900">All jobs</CardTitle>
          <CardDescription>{list.length} job(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-100"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {format(new Date(job.scheduledDate), 'MMM d, yyyy')}
                      {job.scheduledTime && ` · ${job.scheduledTime}`}
                    </p>
                    <p className="text-xs text-zinc-500">{job.type}</p>
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
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center">
              <p className="text-sm text-zinc-600">No jobs yet</p>
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
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <JobsContent />
    </Suspense>
  );
}
