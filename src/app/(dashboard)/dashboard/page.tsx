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
import { formatDate } from '@/lib/date-format';
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
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data doesn't change that often
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-lg leading-relaxed text-zinc-600">
            {formatDate(new Date(), 'fullDay')}
          </p>
        </div>
        {isOwner && (
          <Button asChild size="lg" className="h-12 shrink-0 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all">
            <Link href="/jobs/create" className="gap-2 text-base font-semibold">
              <Plus className="size-5" />
              Create Job
            </Link>
          </Button>
        )}
      </div>

      {isOwner && (
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <CardHeader className="pb-5">
            <CardTitle className="text-xl font-bold text-zinc-900">Quick Actions</CardTitle>
            <CardDescription className="text-base text-zinc-600">Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {quickActions.map(({ href, label, icon: Icon, bg }) => (
                <Link key={href} href={href}>
                  <div className="group flex flex-col items-center gap-3 rounded-xl border-2 border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md sm:p-5">
                    <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md group-hover:scale-110 transition-transform', bg)}>
                      <Icon className="size-6" />
                    </div>
                    <span className="text-center text-sm font-semibold text-zinc-900">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader className="pb-5">
            <CardTitle className="text-xl font-bold text-zinc-900">Today&apos;s Jobs</CardTitle>
            <CardDescription className="text-base text-zinc-600">
              {stats?.todayJobsList?.length
                ? `${stats.todayJobsList.length} job(s) scheduled`
                : 'No jobs scheduled today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-base text-zinc-500">Loading…</p>
            ) : stats?.todayJobsList?.length ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {stats.todayJobsList.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="group flex items-center justify-between rounded-xl border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-4 transition-all hover:border-zinc-300 hover:shadow-md sm:p-5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-900 text-base truncate">{job.client?.name ?? 'Unknown'}</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                        {job.scheduledTime ?? '—'} · {job.type.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge
                      className="ml-3 shrink-0"
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
                    className="col-span-full flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 py-4 text-base font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all"
                  >
                    View all jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 py-16 text-center">
                <Briefcase className="mx-auto size-14 text-zinc-400" />
                <p className="mt-3 text-lg font-medium text-zinc-700">No jobs today</p>
                <p className="mt-1 text-sm text-zinc-500">Create a job to get started</p>
                {isOwner && (
                  <Button asChild variant="outline" size="lg" className="mt-5">
                    <Link href="/jobs/create">Create Job</Link>
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
    <div className={cn('rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow', statVariants[variant])}>
      <p className="text-sm font-semibold uppercase tracking-wide opacity-90">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {loading ? '…' : value}
      </p>
    </div>
  );
}
