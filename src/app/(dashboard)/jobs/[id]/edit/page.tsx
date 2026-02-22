'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import type { Job } from '@/types/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { user, isLoading: userLoading } = useUser();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`),
    enabled: !!user && (user.role === 'OWNER' || user.role === 'ADMIN'),
  });

  useEffect(() => {
    if (!userLoading && user?.role === 'CLEANER') {
      router.replace(`/jobs/${id}`);
    }
  }, [user, userLoading, router, id]);

  const mutation = useMutation({
    mutationFn: (data: { scheduledDate?: string; scheduledTime?: string; status?: string }) =>
      api.patch(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Job updated');
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

  if (userLoading || (user?.role === 'CLEANER')) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-zinc-500">Redirecting…</p>
      </div>
    );
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
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
