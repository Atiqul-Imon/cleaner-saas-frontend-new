'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  FileText,
  UserPlus,
  Users,
  Briefcase,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSkeleton } from '@/components/loading-skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const quickActions = [
  { href: '/jobs/create', label: 'New Job', icon: Plus, bg: 'bg-emerald-600' },
  { href: '/jobs?status=SCHEDULED', label: 'Schedule', icon: Calendar, bg: 'bg-blue-600' },
  { href: '/invoices?status=UNPAID', label: 'Invoices', icon: FileText, bg: 'bg-amber-600' },
  { href: '/clients/new', label: 'Add Client', icon: UserPlus, bg: 'bg-teal-600' },
  { href: '/settings/workers', label: 'Staff', icon: Users, bg: 'bg-violet-600' },
];

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
    retry: 1,
  });

  const isOwner = stats?.role === 'OWNER';

  if (isLoading && !stats) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="font-medium text-amber-800">Unable to load dashboard</p>
        <p className="mt-1 text-sm text-amber-700">
          Please refresh the page or sign in again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-base leading-relaxed text-zinc-700">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>
        {isOwner && (
          <Button asChild size="lg" className="shrink-0 bg-emerald-600 hover:bg-emerald-700">
            <Link href="/jobs/create" className="gap-2">
              <Plus className="size-5" />
              Create Job
            </Link>
          </Button>
        )}
      </div>

      {isOwner && (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's jobs"
            value={stats?.todayJobs ?? 0}
            loading={isLoading}
            variant="emerald"
          />
          <StatCard
            title="Unpaid invoices"
            value={stats?.unpaidInvoices ?? 0}
            loading={isLoading}
            variant="amber"
          />
          <StatCard
            title="Monthly earnings"
            value={stats?.monthlyEarnings != null ? `£${stats.monthlyEarnings}` : '—'}
            loading={isLoading}
            variant="blue"
          />
          <StatCard
            title="Total jobs"
            value={stats?.totalJobs ?? 0}
            loading={isLoading}
            variant="violet"
          />
        </div>
      )}

      {isOwner && (
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900">Quick actions</CardTitle>
            <CardDescription className="text-zinc-700">Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {quickActions.map(({ href, label, icon: Icon, bg }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm sm:gap-3 sm:p-4">
                    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg text-white', bg)}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-base font-medium text-zinc-900">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-900">Today&apos;s jobs</CardTitle>
            <CardDescription className="text-zinc-700">
              {stats?.todayJobsList?.length
                ? `${stats.todayJobsList.length} job(s) scheduled`
                : 'No jobs scheduled today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : stats?.todayJobsList?.length ? (
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                {stats.todayJobsList.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-4"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
                        {job.scheduledTime ?? '—'} · {job.type}
                      </p>
                    </div>
                    <Badge
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
                {stats.todayJobsList.length > 6 && (
                  <Link
                    href={isOwner ? '/jobs' : '/my-jobs'}
                    className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-300 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    View all jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 py-12 text-center">
                <Briefcase className="mx-auto size-12 text-zinc-500" />
                <p className="mt-2 text-base text-zinc-700">No jobs today</p>
                {isOwner && (
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href="/jobs/create">Create job</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const statVariants = {
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-600 text-white',
  blue: 'bg-blue-600 text-white',
  violet: 'bg-violet-600 text-white',
} as const;

function StatCard({
  title,
  value,
  loading,
  variant = 'emerald',
}: {
  title: string;
  value: string | number;
  loading: boolean;
  variant?: keyof typeof statVariants;
}) {
  return (
    <div className={cn('rounded-xl p-4 shadow-md sm:p-5', statVariants[variant])}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">
        {loading ? '…' : value}
      </p>
    </div>
  );
}
