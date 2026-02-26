'use client';

import { Suspense, useState, useEffect } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { api } from '@/lib/api';
import type { Client } from '@/types/api';
import {
  getTodayDateInput,
  getTomorrowDateInput,
  getNextWeekDateInput,
} from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Cleaner {
  cleanerId: string;
  email: string;
  name?: string;
  totalJobs: number;
  todayJobs: number;
}

const COMMON_TIMES = ['09:00', '10:00', '12:00', '14:00', '16:00'];
const REMINDER_OPTIONS = [
  { value: '30 minutes', label: '30 minutes before' },
  { value: '1 hour', label: '1 hour before' },
  { value: '2 hours', label: '2 hours before' },
  { value: '1 day', label: '1 day before' },
  { value: '2 days', label: '2 days before' },
] as const;

function CreateJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('clientId') ?? '';

  const [clientId, setClientId] = useState(clientIdParam);
  useEffect(() => {
    if (clientIdParam) setClientId(clientIdParam);
  }, [clientIdParam]);
  const [cleanerId, setCleanerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(getTodayDateInput());
  const [scheduledTime, setScheduledTime] = useState('');
  const [type, setType] = useState<'ONE_OFF' | 'RECURRING'>('ONE_OFF');
  const [frequency, setFrequency] = useState<'WEEKLY' | 'BI_WEEKLY'>('WEEKLY');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('1 day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useUser();
  const canAssignCleaners = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<{ data: Client[] } | Client[]>('/clients'),
    enabled: canAssignCleaners,
  });

  const { data: cleaners } = useQuery({
    queryKey: ['cleaners'],
    queryFn: () => api.get<Cleaner[]>('/business/cleaners'),
    enabled: canAssignCleaners,
  });

  const clientList = Array.isArray(clients)
    ? clients
    : (clients as { data?: Client[] })?.data ?? [];
  const cleanerList = cleaners ?? [];
  const hasClients = clientList.length > 0;
  const clientsLoading = canAssignCleaners && clients === undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const scheduled = new Date(scheduledDate);
      if (scheduled < new Date(new Date().setHours(0, 0, 0, 0))) {
        setError('Scheduled date cannot be in the past');
        setLoading(false);
        return;
      }
      if (type === 'RECURRING' && !frequency) {
        setError('Please select frequency for recurring jobs');
        setLoading(false);
        return;
      }

      const job = await api.post<{ id: string }>('/jobs', {
        clientId,
        cleanerId: cleanerId || undefined,
        type,
        frequency: type === 'RECURRING' ? frequency : undefined,
        scheduledDate,
        scheduledTime: scheduledTime || undefined,
        reminderEnabled,
        reminderTime,
      });
      router.push(`/jobs/${job.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  }

  if (!clientsLoading && !hasClients) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Link href="/jobs" className="text-sm text-zinc-600 hover:underline">
            ← Back to jobs
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">New job</h1>
          <p className="text-zinc-600">Schedule a cleaning job with date and time</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-900">Add a client first to create a job.</p>
          <p className="mt-1 text-sm text-amber-800">You need at least one client before scheduling jobs.</p>
          <Button asChild className="mt-4">
            <Link href="/clients/new">Add client</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/jobs" className="text-sm text-zinc-600 hover:underline">
          ← Back to jobs
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New job</h1>
        <p className="text-zinc-600">Schedule a cleaning job with date and time</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* 1. Basic info */}
          <Card>
            <CardHeader>
              <CardTitle>1. Basic information</CardTitle>
              <CardDescription>Client and assignee</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Client *</Label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="">Select client</option>
                  {clientList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block">Who will do this job?</Label>
                <select
                  value={cleanerId}
                  onChange={(e) => setCleanerId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="">I&apos;ll do it myself</option>
                  {cleanerList.map((c) => (
                    <option key={c.cleanerId} value={c.cleanerId}>
                      {c.name || c.email}
                      {c.todayJobs > 0 ? ` (${c.todayJobs} today)` : ''}
                    </option>
                  ))}
                </select>
                {cleanerList.length === 0 && (
                  <p className="mt-1 text-xs text-zinc-500">No staff yet. You can assign later.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Job type */}
          <Card>
            <CardHeader>
              <CardTitle>2. Job type</CardTitle>
              <CardDescription>One-time or repeating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">How often? *</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setType('ONE_OFF')}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition-all',
                      type === 'ONE_OFF'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-zinc-200 hover:border-primary/50'
                    )}
                  >
                    <p className="font-semibold">One-time job</p>
                    <p className="text-sm text-zinc-600">Just this once</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('RECURRING')}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition-all',
                      type === 'RECURRING'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-zinc-200 hover:border-primary/50'
                    )}
                  >
                    <p className="font-semibold">Repeating job</p>
                    <p className="text-sm text-zinc-600">Regular schedule</p>
                  </button>
                </div>
              </div>
              {type === 'RECURRING' && (
                <div>
                  <Label className="mb-3 block">Frequency *</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('WEEKLY')}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        frequency === 'WEEKLY'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-zinc-200 hover:border-primary/50'
                      )}
                    >
                      <p className="font-semibold">Every week</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('BI_WEEKLY')}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        frequency === 'BI_WEEKLY'
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-zinc-200 hover:border-primary/50'
                      )}
                    >
                      <p className="font-semibold">Every 2 weeks</p>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. When */}
          <Card>
            <CardHeader>
              <CardTitle>3. When?</CardTitle>
              <CardDescription>Date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Pick a date *</Label>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTodayDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all',
                      scheduledDate === getTodayDateInput()
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100'
                    )}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTomorrowDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all',
                      scheduledDate === getTomorrowDateInput()
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100'
                    )}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getNextWeekDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all',
                      scheduledDate === getNextWeekDateInput()
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100'
                    )}
                  >
                    Next week
                  </button>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm text-zinc-600">
                    Or choose a specific date
                  </Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    min={getTodayDateInput()}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Time (optional)</Label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {COMMON_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setScheduledTime(time)}
                      className={cn(
                        'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all',
                        scheduledTime === time
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="max-w-[140px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Reminder */}
          <Card>
            <CardHeader>
              <CardTitle>4. Reminder</CardTitle>
              <CardDescription>Get notified before the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="reminderEnabled"
                  checked={reminderEnabled}
                  onCheckedChange={(v) => setReminderEnabled(!!v)}
                />
                <Label htmlFor="reminderEnabled" className="cursor-pointer">
                  Send reminder before job
                </Label>
              </div>
              {reminderEnabled && (
                <div>
                  <Label className="mb-1.5 block text-sm">When to remind</Label>
                  <select
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 sm:max-w-[200px]"
                  >
                    {REMINDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create job'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/jobs">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateJobPage() {
  return (
    <RequireOwner>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <CreateJobContent />
      </Suspense>
    </RequireOwner>
  );
}
