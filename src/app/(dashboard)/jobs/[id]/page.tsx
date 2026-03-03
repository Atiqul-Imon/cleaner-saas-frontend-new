'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getImageKitTransformUrl } from '@/lib/imagekit';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  Key,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Job } from '@/types/api';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobChecklist } from '@/components/job-checklist';
import { JobPhotoUpload } from '@/components/job-photo-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/date-format';
import { cn } from '@/lib/utils';
import { InlineMessage } from '@/components/ui/inline-message';
import { shareJobPhotosViaWhatsApp } from '@/lib/whatsapp-share';

const DUE_DATE_LABELS: Record<number, string> = {
  0: 'Same day',
  1: '1 day',
  3: '3 days',
  7: '7 days',
  15: '15 days',
  30: '1 month',
};

function getDefaultDueDateLabel(days: number): string {
  return DUE_DATE_LABELS[days] ?? `${days} days`;
}

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`),
  });

  const isCleaner = user?.role === 'CLEANER';
  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const { data: business } = useQuery({
    queryKey: ['business', 'settings'],
    queryFn: () => api.get<{ invoiceDueDateDays?: number | null }>('/business'),
    enabled: isOwner && !!job?.status && job.status === 'COMPLETED',
  });
  const isAssignedToMe = isCleaner && job?.cleanerId === user?.id;
  // Owner can update status and upload photos when: no cleaner assigned, or assigned to themselves
  const isOwnerDoingItThemselves = isOwner && (!job?.cleanerId || job?.cleanerId === user?.id);
  const canUpdateStatus = isAssignedToMe || isOwnerDoingItThemselves;
  const canUploadPhotos = isAssignedToMe || isOwnerDoingItThemselves;
  const [sendingPhotos, setSendingPhotos] = useState<string | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [customDueDate, setCustomDueDate] = useState(''); // yyyy-MM-dd, empty = use default
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSendPhotosViaWhatsApp(photoType: 'BEFORE' | 'AFTER' | 'ALL') {
    if (!job) return;
    setActionMessage(null);
    setSendingPhotos(photoType);
    try {
      await shareJobPhotosViaWhatsApp(
        job.id,
        job.client?.name ?? 'Client',
        'Clenvora',
        photoType,
      );
      setActionMessage({ type: 'success', text: 'Photos ready. Use share menu or check downloads.' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to share photos.' });
    } finally {
      setSendingPhotos(null);
    }
  }

  async function updateStatus(newStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') {
    if (!job) return;
    setActionMessage(null);
    
    // PHASE 3 OPTIMIZATION: Optimistic update - update UI immediately
    const previousJob = queryClient.getQueryData<Job>(['job', id]);
    queryClient.setQueryData<Job>(['job', id], (old) => {
      if (!old) return old;
      return { ...old, status: newStatus };
    });

    try {
      await api.put<Job>(`/jobs/${id}`, { status: newStatus });
      setActionMessage({ type: 'success', text: `Status updated to ${newStatus.replace('_', ' ')}.` });
      // Refresh to get any server-side changes
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch (error) {
      // Rollback on error
      if (previousJob) {
        queryClient.setQueryData(['job', id], previousJob);
      }
      setActionMessage({ type: 'error', text: 'Failed to update status.' });
    }
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(invoiceAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setActionMessage({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }
    setActionMessage(null);
    setCreatingInvoice(true);
    try {
      const body: { amount: number; dueDate?: string } = { amount };
      if (customDueDate) body.dueDate = customDueDate;
      const invoice = await api.post<{ id: string }>(`/invoices/from-job/${id}`, body);
      setActionMessage({ type: 'success', text: 'Invoice created.' });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      window.location.href = `/invoices/${invoice.id}`;
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create invoice.' });
    } finally {
      setCreatingInvoice(false);
    }
  }

  if (isLoading || !job) {
    return (
      <div className="space-y-8">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (isCleaner && !isAssignedToMe) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-900">Access denied</h2>
          <p className="mt-1 text-sm text-amber-800">
            This job is not assigned to you. You can only view and manage jobs assigned to you.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/my-jobs">Back to My Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const client = job.client;
  const notes = client?.notes;
  const hasNotes = notes && (notes.keySafe || notes.alarmCode || notes.accessInfo || notes.pets || notes.preferences);
  const backHref = isCleaner ? '/my-jobs' : '/jobs';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {actionMessage && (
        <InlineMessage type={actionMessage.type}>{actionMessage.text}</InlineMessage>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={backHref} className="text-sm font-medium text-zinc-700 hover:underline">
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {client?.name ?? 'Unknown client'}
          </h1>
          <p className="text-zinc-600">
            {formatDate(job.scheduledDate, 'fullDay')}
            {job.scheduledTime && ` at ${job.scheduledTime}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          {isOwner && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${id}/edit`}>Edit job</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Client information */}
          <Card className="border-zinc-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-zinc-900">
                <Briefcase className="size-5" />
                Client information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client && (
                <>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Name</p>
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {client.name}
                    </Link>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-zinc-500" />
                      <a href={`tel:${client.phone}`} className="text-zinc-900 hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                      <div className="flex-1">
                        <p className="text-zinc-900">{client.address}</p>
                        {isCleaner && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(client.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm text-zinc-600 hover:underline"
                          >
                            Open in Maps →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {hasNotes && (
                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700">
                    <Key className="size-4" />
                    Secure notes
                  </p>
                  <div className="space-y-2 text-sm">
                    {notes!.keySafe && (
                      <p><span className="font-medium text-zinc-600">Key safe:</span> {notes!.keySafe}</p>
                    )}
                    {notes!.alarmCode && (
                      <p><span className="font-medium text-zinc-600">Alarm code:</span> {notes!.alarmCode}</p>
                    )}
                    {notes!.accessInfo && (
                      <p><span className="font-medium text-zinc-600">Access:</span> {notes!.accessInfo}</p>
                    )}
                    {notes!.pets && (
                      <p><span className="font-medium text-zinc-600">Pets:</span> {notes!.pets}</p>
                    )}
                    {notes!.preferences && (
                      <p><span className="font-medium text-zinc-600">Preferences:</span> {notes!.preferences}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job details */}
          <Card className="border-zinc-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-zinc-900">
                <Calendar className="size-5" />
                Job details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Type</p>
                  <p className="font-medium text-zinc-900">{job.type.replace('_', ' ')}</p>
                </div>
                {job.frequency && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Frequency</p>
                    <p className="font-medium text-zinc-900">{job.frequency.replace('_', ' ')}</p>
                  </div>
                )}
                {job.scheduledTime && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Time</p>
                    <p className="font-medium text-zinc-900">{job.scheduledTime}</p>
                  </div>
                )}
                {job.reminderEnabled && job.reminderTime && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Reminder</p>
                    <p className="font-medium text-zinc-900">{job.reminderTime} before</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          {job.checklist && job.checklist.length > 0 && (
            <Card className="border-zinc-200 bg-white">
              <CardHeader>
                <CardTitle className="text-zinc-900">Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <JobChecklist
                  jobId={job.id}
                  checklist={job.checklist}
                  onUpdate={() => queryClient.invalidateQueries({ queryKey: ['job', id] })}
                  onError={(msg) => setActionMessage({ type: 'error', text: msg })}
                />
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          <Card className="border-zinc-200 bg-white">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-zinc-900">Photos</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {job.photos && job.photos.length > 0 && job.client?.phone && (
                    <div className="flex flex-wrap gap-2">
                      {job.photos.some((p) => p.photoType === 'BEFORE') && (
                        <Button
                          size="sm"
                          onClick={() => handleSendPhotosViaWhatsApp('BEFORE')}
                          disabled={!!sendingPhotos}
                          className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
                        >
                          <MessageCircle className="size-4" />
                          Send before
                        </Button>
                      )}
                      {job.photos.some((p) => p.photoType === 'AFTER') && (
                        <Button
                          size="sm"
                          onClick={() => handleSendPhotosViaWhatsApp('AFTER')}
                          disabled={!!sendingPhotos}
                          className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
                        >
                          <MessageCircle className="size-4" />
                          Send after
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleSendPhotosViaWhatsApp('ALL')}
                        disabled={!!sendingPhotos}
                        className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
                      >
                        <MessageCircle className="size-4" />
                        Send all via WhatsApp
                      </Button>
                    </div>
                  )}
                  {canUploadPhotos && (
                    <div className="flex gap-2">
                      <JobPhotoUpload
                      jobId={job.id}
                      photoType="BEFORE"
                      onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['job', id] });
                        setActionMessage({ type: 'success', text: 'Before photo uploaded.' });
                      }}
                      onError={(m) => setActionMessage({ type: 'error', text: m })}
                    />
                    <JobPhotoUpload
                      jobId={job.id}
                      photoType="AFTER"
                      onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['job', id] });
                        setActionMessage({ type: 'success', text: 'After photo uploaded.' });
                      }}
                      onError={(m) => setActionMessage({ type: 'error', text: m })}
                    />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {job.photos && job.photos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {job.photos.map((photo, index) => (
                    <div key={photo.id} className="overflow-hidden rounded-lg border border-zinc-200">
                      <img
                        src={getImageKitTransformUrl(photo.imageUrl, { width: 640, quality: 80 })}
                        alt={photo.photoType}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className="aspect-video w-full object-cover"
                      />
                      <p className="bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600">
                        {photo.photoType}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500">
                  No photos yet
                  {canUploadPhotos && (
                    <p className="mt-1">Use the buttons above to add before/after photos</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Status update */}
        <div className="space-y-6">
          {canUpdateStatus && (
            <Card className={cn(
              'border-zinc-200 bg-white',
              job.status === 'COMPLETED' && 'border-l-4 border-l-emerald-600'
            )}>
              <CardHeader>
                <CardTitle className="text-zinc-900">Update status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.status === 'SCHEDULED' && (
                  <Button
                    className="w-full bg-zinc-900 hover:bg-zinc-800"
                    onClick={() => updateStatus('IN_PROGRESS')}
                  >
                    Start job
                  </Button>
                )}
                {job.status === 'IN_PROGRESS' && (
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => updateStatus('COMPLETED')}
                  >
                    <CheckCircle2 className="size-4" />
                    Complete job
                  </Button>
                )}
                {job.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                    <CheckCircle2 className="size-5 shrink-0" />
                    <span className="font-medium">Job completed</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isOwner && job.status === 'COMPLETED' && (
            <Card className="border-zinc-200 bg-white">
              <CardHeader>
                <CardTitle className="text-zinc-900 flex items-center gap-2">
                  <FileText className="size-5" />
                  Invoice
                </CardTitle>
                <CardDescription>
                  {job.invoice
                    ? 'An invoice has been created for this job.'
                    : 'Create an invoice for this completed job.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {job.invoice ? (
                  <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border-0">
                    <Link href={`/invoices/${job.invoice.id}`}>
                      View invoice #{job.invoice.invoiceNumber}
                    </Link>
                  </Button>
                ) : (
                  <form onSubmit={handleCreateInvoice} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-amount">Amount (£)</Label>
                      <Input
                        id="invoice-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        required
                        disabled={creatingInvoice}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-due-date">Due date (optional)</Label>
                      <p className="text-xs text-zinc-500">
                        {customDueDate
                          ? `Custom: ${formatDate(customDueDate, 'short')}`
                          : `Default: ${getDefaultDueDateLabel(business?.invoiceDueDateDays ?? 30)}`}
                      </p>
                      <Input
                        id="invoice-due-date"
                        type="date"
                        value={customDueDate}
                        onChange={(e) => setCustomDueDate(e.target.value)}
                        disabled={creatingInvoice}
                        className="w-full"
                      />
                      {customDueDate && (
                        <button
                          type="button"
                          onClick={() => setCustomDueDate('')}
                          className="text-xs text-zinc-600 hover:text-zinc-900 underline"
                        >
                          Use default instead
                        </button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                      disabled={creatingInvoice}
                    >
                      {creatingInvoice ? 'Creating…' : 'Create invoice'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {isOwner && !canUpdateStatus && job.cleaner && (
            <Card className="border-zinc-200 bg-white">
              <CardHeader>
                <CardTitle className="text-zinc-900">Assigned to</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-zinc-900">{job.cleaner.name || job.cleaner.email}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
