'use client';

import { useParams } from 'next/navigation';
import { RequireOwner } from '@/components/require-owner';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api, normalizeList } from '@/lib/api';
import type { Job } from '@/types/api';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/date-format';

function getStaffDisplayName(name?: string | null, email?: string): string {
  if (name?.trim()) return name.trim();
  if (email) {
    const beforeAt = email.split('@')[0];
    if (beforeAt) {
      return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1).toLowerCase();
    }
  }
  return email ?? 'Staff';
}

interface WorkerDetail {
  id: string;
  cleanerId: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  totalJobs: number;
  todayJobs: number;
  createdAt: string;
  activatedAt?: string;
}

function WorkerDetailContent() {
  const params = useParams();
  const cleanerId = params.id as string;
  const { user } = useUser();

  const { data: cleaner, isLoading } = useQuery({
    queryKey: ['worker', cleanerId],
    queryFn: () => api.get<WorkerDetail>(`/business/cleaners/${cleanerId}`),
    enabled: !!cleanerId && !!user && (user.role === 'OWNER' || user.role === 'ADMIN'),
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get<Job[] | { data: Job[] }>('/jobs'),
  });

  const jobList = normalizeList<Job>(jobs);
  const staffJobs = jobList
    .filter((j) => j.cleanerId === cleanerId || j.cleaner?.id === cleanerId)
    .slice(0, 12);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16">
          <h3 className="mb-1 font-semibold text-zinc-900">Staff member not found</h3>
          <p className="mb-6 text-center text-sm text-zinc-600">
            The staff member you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/settings/workers">Back to Staff</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayName = getStaffDisplayName(cleaner.name, cleaner.email);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/settings/workers" className="gap-2">
          <ArrowLeft className="size-4" />
          Back to Staff
        </Link>
      </Button>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="size-20 shrink-0">
          <AvatarFallback className="bg-zinc-200 text-xl text-zinc-700">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{displayName}</h1>
          {cleaner.name && (
            <p className="text-zinc-600">{cleaner.email}</p>
          )}
          <Badge variant={cleaner.status === 'ACTIVE' ? 'default' : 'secondary'} className="mt-2">
            {cleaner.status}
          </Badge>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-2xl font-bold text-zinc-900">{cleaner.totalJobs}</p>
              <p className="text-sm text-zinc-500">Total jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{cleaner.todayJobs}</p>
              <p className="text-sm text-zinc-500">Today</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-zinc-200">
        <CardHeader>
          <CardTitle className="text-zinc-900">Recent jobs</CardTitle>
          <CardDescription>Jobs assigned to this staff member</CardDescription>
        </CardHeader>
        <CardContent>
          {staffJobs.length ? (
            <div className="space-y-2">
              {staffJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100">
                      <Briefcase className="size-5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                      <p className="text-sm text-zinc-500">
                        {formatDate(job.scheduledDate, 'short')} · {job.status}
                      </p>
                    </div>
                  </div>
                  <Badge variant={job.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-zinc-500">No jobs assigned yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function WorkerDetailPage() {
  return (
    <RequireOwner>
      <WorkerDetailContent />
    </RequireOwner>
  );
}
