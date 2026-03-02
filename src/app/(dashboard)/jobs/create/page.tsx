'use client';

import { Suspense, useState, useEffect } from 'react';
import { RequireOwner } from '@/components/require-owner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User, Users, UserCircle, Calendar, Clock, Bell, Repeat, CheckCircle2 } from 'lucide-react';

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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('clientId') ?? '';

  const [clientId, setClientId] = useState(clientIdParam);
  useEffect(() => {
    if (clientIdParam) setClientId(clientIdParam);
  }, [clientIdParam]);
  const [cleanerId, setCleanerId] = useState('self');
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
        cleanerId: cleanerId === 'self' ? undefined : cleanerId,
        type,
        frequency: type === 'RECURRING' ? frequency : undefined,
        scheduledDate,
        scheduledTime: scheduledTime || undefined,
        reminderEnabled,
        reminderTime,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors mb-3">
          ← Back to jobs
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Create New Job</h1>
        <p className="mt-2 text-base text-zinc-700">Fill in the details to schedule a cleaning job</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* 1. Client & Staff */}
          <Card className="border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50/50 to-transparent">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <User className="size-5 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900">Who is this job for?</CardTitle>
                  <CardDescription className="text-sm text-zinc-600 mt-1">Select client and assign staff member</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <span className="inline-flex items-center justify-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Required</span>
                  Client
                </Label>
                <Select value={clientId} onValueChange={setClientId} required>
                  <SelectTrigger className="h-12 rounded-lg border-2 border-zinc-200 text-base font-medium hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors">
                    <SelectValue placeholder="Choose a client from your list" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientList.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-base py-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-emerald-100 p-1">
                            <UserCircle className="size-4 text-emerald-600" />
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t border-zinc-100 pt-5">
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <span className="inline-flex items-center justify-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Optional</span>
                  Assign to staff
                </Label>
                <Select value={cleanerId} onValueChange={setCleanerId}>
                  <SelectTrigger className="h-12 rounded-lg border-2 border-zinc-200 text-base font-medium hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors">
                    <SelectValue placeholder="I'll do it myself" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self" className="text-base py-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1">
                          <UserCircle className="size-4 text-blue-600" />
                        </div>
                        <span className="font-medium">I&apos;ll do it myself</span>
                      </div>
                    </SelectItem>
                    {cleanerList.map((c) => (
                      <SelectItem key={c.cleanerId} value={c.cleanerId} className="text-base py-3">
                        <div className="flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-zinc-100 p-1">
                              <UserCircle className="size-4 text-zinc-600" />
                            </div>
                            <span className="font-medium">{c.name || c.email}</span>
                          </div>
                          {c.todayJobs > 0 && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                              {c.todayJobs} today
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cleanerList.length === 0 && (
                  <p className="mt-2 text-sm text-zinc-500 flex items-center gap-1.5">
                    <Users className="size-4" />
                    No staff members yet. You can assign later from job details.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Job Type */}
          <Card className="border-2 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50/50 to-transparent">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Repeat className="size-5 text-purple-700" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900">Job Type</CardTitle>
                  <CardDescription className="text-sm text-zinc-600 mt-1">One-time or recurring cleaning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div>
                <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <span className="inline-flex items-center justify-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">Required</span>
                  How often?
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setType('ONE_OFF')}
                    className={cn(
                      'group rounded-xl border-2 p-5 text-left transition-all',
                      type === 'ONE_OFF'
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30 shadow-md'
                        : 'border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className={cn(
                        "size-5 transition-colors",
                        type === 'ONE_OFF' ? 'text-purple-600' : 'text-zinc-400'
                      )} />
                      <p className="text-base font-bold text-zinc-900">One-time job</p>
                    </div>
                    <p className="ml-7 text-sm text-zinc-600">For a single cleaning session</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('RECURRING')}
                    className={cn(
                      'group rounded-xl border-2 p-5 text-left transition-all',
                      type === 'RECURRING'
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30 shadow-md'
                        : 'border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Repeat className={cn(
                        "size-5 transition-colors",
                        type === 'RECURRING' ? 'text-purple-600' : 'text-zinc-400'
                      )} />
                      <p className="text-base font-bold text-zinc-900">Recurring job</p>
                    </div>
                    <p className="ml-7 text-sm text-zinc-600">Regular cleaning schedule</p>
                  </button>
                </div>
              </div>
              {type === 'RECURRING' && (
                <div className="border-t border-zinc-100 pt-5 animate-in fade-in duration-300">
                  <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <span className="inline-flex items-center justify-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">Required</span>
                    Frequency
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('WEEKLY')}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        frequency === 'WEEKLY'
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30 shadow-md'
                          : 'border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50'
                      )}
                    >
                      <p className="text-base font-bold text-zinc-900">Every week</p>
                      <p className="mt-0.5 text-sm text-zinc-600">Weekly cleaning</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('BI_WEEKLY')}
                      className={cn(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        frequency === 'BI_WEEKLY'
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30 shadow-md'
                          : 'border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50'
                      )}
                    >
                      <p className="text-base font-bold text-zinc-900">Every 2 weeks</p>
                      <p className="mt-0.5 text-sm text-zinc-600">Fortnightly cleaning</p>
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Date & Time */}
          <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Calendar className="size-5 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900">When?</CardTitle>
                  <CardDescription className="text-sm text-zinc-600 mt-1">Schedule date and time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
              <div>
                <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <span className="inline-flex items-center justify-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Required</span>
                  Date
                </Label>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTodayDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                      scheduledDate === getTodayDateInput()
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getTomorrowDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                      scheduledDate === getTomorrowDateInput()
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledDate(getNextWeekDateInput())}
                    className={cn(
                      'rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                      scheduledDate === getNextWeekDateInput()
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    Next week
                  </button>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-zinc-600">
                    Or pick a specific date
                  </Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    min={getTodayDateInput()}
                    className="h-11 text-base font-medium border-2 rounded-lg hover:border-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Clock className="size-4 text-blue-600" />
                  <span className="inline-flex items-center justify-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Optional</span>
                  Time
                </Label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {COMMON_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setScheduledTime(time)}
                      className={cn(
                        'rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                        scheduledTime === time
                          ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                          : 'border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-zinc-600">
                    Or enter a custom time
                  </Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-11 max-w-[180px] text-base font-medium border-2 rounded-lg hover:border-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Reminder */}
          <Card className="border-2 border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-amber-50/50 to-transparent">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Bell className="size-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900">Reminder</CardTitle>
                  <CardDescription className="text-sm text-zinc-600 mt-1">Get notified before the job starts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 border border-amber-200">
                <Checkbox
                  id="reminderEnabled"
                  checked={reminderEnabled}
                  onCheckedChange={(v) => setReminderEnabled(!!v)}
                  className="mt-0.5 size-5 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <div className="flex-1">
                  <Label htmlFor="reminderEnabled" className="cursor-pointer text-base font-semibold text-zinc-900">
                    Send me a reminder
                  </Label>
                  <p className="text-sm text-zinc-600 mt-0.5">We'll notify you before the job is due</p>
                </div>
              </div>
              {reminderEnabled && (
                <div className="animate-in fade-in duration-300 pl-4">
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    When should we remind you?
                  </Label>
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger className="h-11 rounded-lg border-2 border-zinc-200 text-base font-medium hover:border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 sm:max-w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REMINDER_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="text-base py-2">
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-1 mt-0.5">
                <svg className="size-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              size="lg"
              className="h-13 px-8 bg-emerald-600 hover:bg-emerald-700 text-base font-bold shadow-lg hover:shadow-xl transition-all rounded-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating job...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-5" />
                  Create Job
                </span>
              )}
            </Button>
            <Button type="button" variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-2 rounded-lg hover:bg-zinc-50" asChild>
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
