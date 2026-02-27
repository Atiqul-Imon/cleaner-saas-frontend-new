'use client';

import { Suspense, useState, useEffect } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { api, normalizeList } from '@/lib/api';
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

  const clientList = normalizeList<Client>(clients);
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
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div>
        <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
          ← Back to jobs
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Create New Job</h1>
        <p className="mt-2 text-lg text-zinc-600">Schedule a cleaning job with date and time</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 1. Basic info */}
          <Card className="border-2 border-zinc-200 shadow-sm">
            <CardHeader className="pb-5">
              <CardTitle className="text-xl font-bold text-zinc-900">1. Basic Information</CardTitle>
              <CardDescription className="text-base text-zinc-600">Select client and assign staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block text-base font-semibold text-zinc-900">Client *</Label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-zinc-300 px-4 py-3 text-base font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                >
                  <option value="">Select a client</option>
                  {clientList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-2 block text-base font-semibold text-zinc-900">Assign To</Label>
                <select
                  value={cleanerId}
                  onChange={(e) => setCleanerId(e.target.value)}
                  className="w-full rounded-xl border-2 border-zinc-300 px-4 py-3 text-base font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
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
                  <p className="mt-2 text-sm text-zinc-500">No staff yet. You can assign later from job details.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Job type */}
          <Card className="border-2 border-zinc-200 shadow-sm">
            <CardHeader className="pb-5">
              <CardTitle className="text-xl font-bold text-zinc-900">2. Job Type</CardTitle>
              <CardDescription className="text-base text-zinc-600">One-time or recurring schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block text-base font-semibold text-zinc-900">How often? *</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setType('ONE_OFF')}
                    className={cn(
                      'group rounded-2xl border-2 p-5 text-left transition-all',
                      type === 'ONE_OFF'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 shadow-md'
                        : 'border-zinc-200 hover:border-emerald-300 hover:bg-zinc-50'
                    )}
                  >
                    <p className="text-lg font-bold text-zinc-900">One-time job</p>
                    <p className="mt-1 text-sm text-zinc-600">Just this once</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('RECURRING')}
                    className={cn(
                      'group rounded-2xl border-2 p-5 text-left transition-all',
                      type === 'RECURRING'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 shadow-md'
                        : 'border-zinc-200 hover:border-emerald-300 hover:bg-zinc-50'
                    )}
                  >
                    <p className="text-lg font-bold text-zinc-900">Recurring job</p>
                    <p className="mt-1 text-sm text-zinc-600">Regular schedule</p>
                  </button>
                </div>
              </div>
              {type === 'RECURRING' && (
                <div>
                  <Label className="mb-3 block text-base font-semibold text-zinc-900">Frequency *</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('WEEKLY')}
                      className={cn(
                        'rounded-2xl border-2 p-5 text-left transition-all',
                        frequency === 'WEEKLY'
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 shadow-md'
                          : 'border-zinc-200 hover:border-emerald-300 hover:bg-zinc-50'
                      )}
                    >
                      <p className="text-lg font-bold text-zinc-900">Every week</p>
                      <p className="mt-1 text-sm text-zinc-600">Repeats weekly</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('BI_WEEKLY')}
                      className={cn(
                        'rounded-2xl border-2 p-5 text-left transition-all',
                        frequency === 'BI_WEEKLY'
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30 shadow-md'
                          : 'border-zinc-200 hover:border-emerald-300 hover:bg-zinc-50'
                      )}
                    >
                      <p className="text-lg font-bold text-zinc-900">Every 2 weeks</p>
                      <p className="mt-1 text-sm text-zinc-600">Bi-weekly schedule</p>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. When */}
          <Card className="border-2 border-zinc-200 shadow-sm">
            <CardHeader className="pb-5">
              <CardTitle className="text-xl font-bold text-zinc-900">3. Schedule</CardTitle>
              <CardDescription className="text-base text-zinc-600">Pick date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block text-base font-semibold text-zinc-900">Pick a date *</Label>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTodayDateInput())}
                    className={cn(
                      'rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all',
                      scheduledDate === getTodayDateInput()
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50'
                    )}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTomorrowDateInput())}
                    className={cn(
                      'rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all',
                      scheduledDate === getTomorrowDateInput()
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50'
                    )}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getNextWeekDateInput())}
                    className={cn(
                      'rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all',
                      scheduledDate === getNextWeekDateInput()
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50'
                    )}
                  >
                    Next week
                  </button>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-zinc-600">
                    Or choose a specific date
                  </Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    min={getTodayDateInput()}
                    className="text-base font-medium"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-base font-semibold text-zinc-900">Time (optional)</Label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {COMMON_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setScheduledTime(time)}
                      className={cn(
                        'rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all',
                        scheduledTime === time
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                          : 'border-zinc-300 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50'
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
                  className="max-w-[160px] text-base font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Reminder */}
          <Card className="border-2 border-zinc-200 shadow-sm">
            <CardHeader className="pb-5">
              <CardTitle className="text-xl font-bold text-zinc-900">4. Reminder</CardTitle>
              <CardDescription className="text-base text-zinc-600">Get notified before the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="reminderEnabled"
                  checked={reminderEnabled}
                  onCheckedChange={(v) => setReminderEnabled(!!v)}
                  className="size-5"
                />
                <Label htmlFor="reminderEnabled" className="cursor-pointer text-base font-medium text-zinc-900">
                  Send reminder before job
                </Label>
              </div>
              {reminderEnabled && (
                <div>
                  <Label className="mb-2 block text-base font-semibold text-zinc-900">When to remind</Label>
                  <select
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-zinc-300 px-4 py-3 text-base font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all sm:max-w-[240px]"
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
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5 text-base font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              type="submit" 
              disabled={loading}
              size="lg"
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Creating…' : 'Create Job'}
            </Button>
            <Button type="button" variant="outline" size="lg" className="h-12 text-base font-semibold" asChild>
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
