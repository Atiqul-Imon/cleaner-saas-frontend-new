'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Job } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListItemSkeleton } from '@/components/loading-skeleton';
import { format } from 'date-fns';
import { Briefcase } from 'lucide-react';

export default function MyJobsPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', 'cleaner'],
    queryFn: () => api.get<{ data: Job[] } | Job[]>('/jobs'),
  });

  const list = Array.isArray(jobs) ? jobs : (jobs as { data?: Job[] })?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Jobs</h1>
        <p className="text-zinc-600">Jobs assigned to you</p>
      </div>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-zinc-900">Assigned jobs</CardTitle>
          <CardDescription>{list.length} job(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <ListItemSkeleton key={i} />
              ))}
            </div>
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
                      {format(new Date(job.scheduledDate), 'EEEE, MMM d')}
                      {job.scheduledTime && ` at ${job.scheduledTime}`}
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
              <Briefcase className="mx-auto size-12 text-zinc-400" />
              <p className="mt-2 text-sm text-zinc-600">No jobs assigned yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
