'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { RequireCleaner } from '@/components/require-cleaner';
import Link from 'next/link';
import { api, normalizeList } from '@/lib/api';
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
import { Briefcase, LogOut, Building2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function MyJobsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', 'cleaner'],
    queryFn: () => api.get<{ data: Job[] } | Job[]>('/jobs'),
  });

  const { data: myBusiness, isLoading: businessLoading } = useQuery({
    queryKey: ['my-business'],
    queryFn: () => api.get<{ id: string; name: string }>('/business/cleaners/my-business'),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const leaveMutation = useMutation({
    mutationFn: () => api.post('/business/cleaners/leave', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setShowLeaveModal(false);
      router.push('/become-owner');
      router.refresh();
    },
  });

  const list = normalizeList<Job>(jobs);
  const hasBusiness = !!myBusiness && !businessLoading;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800">
        <div className="flex items-start gap-3">
          <UserCog className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">Welcome to the team!</p>
            <p className="mt-1 text-emerald-700">
              You can set a password and edit your name in{' '}
              <Link href="/profile" className="font-medium underline hover:text-emerald-900">
                Profile
              </Link>
              . You can also sign in with Google anytime.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Jobs</h1>
          <p className="mt-1 text-base leading-relaxed text-zinc-700">Jobs assigned to you</p>
        </div>
        {hasBusiness && (
          <Button
            variant="outline"
            size="sm"
            className="border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={() => setShowLeaveModal(true)}
          >
            <LogOut className="size-4" />
            Leave team
          </Button>
        )}
      </div>

      {!hasBusiness && !businessLoading ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center">
          <Building2 className="mx-auto size-12 text-zinc-500" />
          <p className="mt-2 text-base font-medium text-zinc-900">You&apos;re not on a team</p>
          <p className="mt-1 text-sm text-zinc-600">Start your own business to manage clients and jobs.</p>
          <Button asChild className="mt-4">
            <Link href="/become-owner">Start my own business</Link>
          </Button>
        </div>
      ) : (
      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">Assigned jobs</CardTitle>
          <CardDescription className="text-zinc-700">{list.length} job(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <ListItemSkeleton key={i} />
              ))}
            </div>
          ) : list.length ? (
            <div className="grid gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-4"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
                      {format(new Date(job.scheduledDate), 'EEEE, MMM d')}
                      {job.scheduledTime && ` at ${job.scheduledTime}`}
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
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-12 text-center">
              <Briefcase className="mx-auto size-12 text-zinc-500" />
              <p className="mt-2 text-base text-zinc-700">No jobs assigned yet</p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave team?</DialogTitle>
            <DialogDescription>
              You will no longer see jobs from this business. You can start your own business
              afterward.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveModal(false)} disabled={leaveMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isPending}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              {leaveMutation.isPending ? 'Leaving…' : 'Leave team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyJobsPage() {
  return (
    <RequireCleaner>
      <MyJobsContent />
    </RequireCleaner>
  );
}
