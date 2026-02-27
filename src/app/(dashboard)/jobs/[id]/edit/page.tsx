'use client';

import { useState, useEffect } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import type { Job } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

function EditJobContent() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { user } = useUser();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`),
    enabled: !!user && (user.role === 'OWNER' || user.role === 'ADMIN'),
  });

  const mutation = useMutation({
    mutationFn: (data: { scheduledDate?: string; scheduledTime?: string; status?: string }) =>
      api.put(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      router.push(`/jobs/${id}`);
      router.refresh();
    },
  });

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [status, setStatus] = useState<'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'>('SCHEDULED');

  useEffect(() => {
    if (job) {
      setScheduledDate(format(new Date(job.scheduledDate), 'yyyy-MM-dd'));
      setScheduledTime(job.scheduledTime ?? '');
      setStatus(job.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED');
    }
  }, [job]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      scheduledDate: new Date(scheduledDate).toISOString(),
      scheduledTime: scheduledTime || undefined,
      status,
    });
  }

  if (isLoading || !job) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <Link href={`/jobs/${id}`} className="text-sm text-zinc-600 hover:underline">
          ← Back to job
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Edit job</h1>
        <p className="text-zinc-600">{job.client?.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
          <CardDescription>Update schedule and status</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mutation.isError && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {mutation.error instanceof Error ? mutation.error.message : 'Failed to update job.'}
              </p>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Date</label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Time (optional)</label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="h-11 rounded-lg border-2 border-zinc-300 text-base font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-500" />
                      <span>Scheduled</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span>In progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/jobs/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditJobPage() {
  return (
    <RequireOwner>
      <EditJobContent />
    </RequireOwner>
  );
}
