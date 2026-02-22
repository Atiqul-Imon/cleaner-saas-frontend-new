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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
      </div>

      {isOwner && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's jobs"
            value={stats?.todayJobs ?? 0}
            loading={isLoading}
            accent="border-l-emerald-600"
          />
          <StatCard
            title="Unpaid invoices"
            value={stats?.unpaidInvoices ?? 0}
            loading={isLoading}
            accent="border-l-amber-600"
          />
          <StatCard
            title="Monthly earnings"
            value={stats?.monthlyEarnings != null ? `£${stats.monthlyEarnings}` : '—'}
            loading={isLoading}
            accent="border-l-blue-600"
          />
          <StatCard
            title="Total jobs"
            value={stats?.totalJobs ?? 0}
            loading={isLoading}
            accent="border-l-violet-600"
          />
        </div>
      )}

      {isOwner && (
        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-zinc-900">Quick actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {quickActions.map(({ href, label, icon: Icon, bg }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50">
                    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg text-white', bg)}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-sm font-medium text-zinc-900">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-zinc-900">Today's jobs</CardTitle>
            <CardDescription>
              {stats?.todayJobsList?.length
                ? `${stats.todayJobsList.length} job(s) scheduled`
                : 'No jobs scheduled today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : stats?.todayJobsList?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {stats.todayJobsList.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-100"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{job.client?.name ?? 'Unknown'}</p>
                      <p className="text-sm text-zinc-500">
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
                    className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    View all jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 py-12 text-center">
                <Briefcase className="mx-auto size-12 text-zinc-400" />
                <p className="mt-2 text-sm text-zinc-600">No jobs today</p>
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

function StatCard({
  title,
  value,
  loading,
  accent,
}: {
  title: string;
  value: string | number;
  loading: boolean;
  accent?: string;
}) {
  return (
    <Card className={cn('border-zinc-200 bg-white', accent && `border-l-4 ${accent}`)}>
      <CardHeader className="pb-2">
        <CardDescription className="text-zinc-600">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-zinc-900">
          {loading ? '…' : value}
        </p>
      </CardContent>
    </Card>
  );
}
