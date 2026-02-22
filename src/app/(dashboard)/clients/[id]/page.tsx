'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Phone,
  MapPin,
  Key,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import type { Client } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get<Client>(`/clients/${id}`),
  });

  if (isLoading || !client) {
    return (
      <div className="space-y-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  const notes = client.notes;
  const hasNotes = notes && (
    notes.keySafe || notes.alarmCode || notes.accessInfo || notes.pets || notes.preferences
  );
  const jobs = client.jobs ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/clients" className="text-sm text-zinc-600 hover:underline">
            ← Back to clients
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{client.name}</h1>
          {(client.phone || client.address) && (
            <p className="text-zinc-600">
              {[client.phone, client.address].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/jobs/create?clientId=${client.id}`}>Create job</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/clients/${client.id}/edit`}>Edit</Link>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {client.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            Contact information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.phone && (
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Phone</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          )}
          {client.address && (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Address</p>
                <p className="font-medium">{client.address}</p>
              </div>
            </div>
          )}
          {!client.phone && !client.address && (
            <p className="text-sm text-zinc-500">No contact details added</p>
          )}
        </CardContent>
      </Card>

      {hasNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-5" />
              Secure notes
            </CardTitle>
            <CardDescription>Access codes and special instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 rounded-lg bg-zinc-50/50 p-4">
            {notes!.keySafe && (
              <div>
                <p className="text-xs font-medium text-zinc-500">Key safe</p>
                <p className="font-medium">{notes!.keySafe}</p>
              </div>
            )}
            {notes!.alarmCode && (
              <div>
                <p className="text-xs font-medium text-zinc-500">Alarm code</p>
                <p className="font-medium">{notes!.alarmCode}</p>
              </div>
            )}
            {notes!.accessInfo && (
              <div>
                <p className="text-xs font-medium text-zinc-500">Access information</p>
                <p className="font-medium">{notes!.accessInfo}</p>
              </div>
            )}
            {notes!.pets && (
              <div>
                <p className="text-xs font-medium text-zinc-500">Pets</p>
                <p className="font-medium">{notes!.pets}</p>
              </div>
            )}
            {notes!.preferences && (
              <div>
                <p className="text-xs font-medium text-zinc-500">Preferences</p>
                <p className="whitespace-pre-wrap font-medium">{notes!.preferences}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-5" />
                Job history
              </CardTitle>
              <CardDescription>{jobs.length} job(s)</CardDescription>
            </div>
            {isOwner && (
              <Button asChild size="sm">
                <Link href={`/jobs/create?clientId=${client.id}`}>New job</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length ? (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-zinc-400" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(job.scheduledDate), 'EEE, MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-zinc-500">{job.type}</p>
                    </div>
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
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center">
              <Briefcase className="mx-auto size-12 text-zinc-400" />
              <p className="mt-2 text-sm text-zinc-600">No jobs yet</p>
              {isOwner && (
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href={`/jobs/create?clientId=${client.id}`}>Create first job</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
