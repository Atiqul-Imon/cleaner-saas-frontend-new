'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RequireOwner } from '@/components/require-owner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { InlineMessage } from '@/components/ui/inline-message';
import { alertDialog } from '@/components/alert-dialog-provider';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Copy, Plus, Trash2, UserX, UserMinus } from 'lucide-react';

function getStaffDisplayName(name?: string | null, email?: string): string {
  if (name?.trim()) return name.trim();
  if (email) {
    const beforeAt = email.split('@')[0];
    if (beforeAt) {
      return beforeAt.charAt(0).toUpperCase() + beforeAt.slice(1).toLowerCase();
    }
  }
  return email ?? 'Staff';
}

interface Worker {
  id: string;
  cleanerId: string;
  email: string;
  name?: string | null;
  role: string;
  status: string;
  totalJobs?: number;
  todayJobs?: number;
  createdAt: string;
  activatedAt?: string;
}

interface CreateCleanerResponse {
  inviteLink?: string;
  email?: string;
  message?: string;
}

function WorkersContent() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [staffToDeactivate, setStaffToDeactivate] = useState<{
    id: string;
    email: string;
    displayName: string;
  } | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<{
    id: string;
    email: string;
    displayName: string;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createdInvite, setCreatedInvite] = useState<{ email: string; inviteLink: string } | null>(null);
  const [formData, setFormData] = useState({ email: '', name: '', method: 'invite' as 'invite' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.get<Worker[]>('/business/cleaners'),
    enabled: !!user && (user.role === 'OWNER' || user.role === 'ADMIN'),
  });

  const createMutation = useMutation({
    mutationFn: (data: { email: string; name?: string; method?: 'password' | 'invite' }) =>
      api.post<CreateCleanerResponse>('/business/cleaners', data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['cleaners'] });
      if (result?.inviteLink) {
        setCreatedInvite({ email: result.email ?? variables.email, inviteLink: result.inviteLink });
        setShowAddModal(false);
        setShowInviteLinkModal(true);
      } else {
        setShowAddModal(false);
        setFormData({ email: '', name: '', method: 'invite' });
      }
      setFormData({ email: '', name: '', method: 'invite' });
      setMessage({ type: 'success', text: 'Staff member added.' });
    },
    onError: (err) => {
      // Keep error in mutation state to show in modal
      const msg = err instanceof Error ? err.message : 'Failed to add staff member';
      setMessage({ type: 'error', text: msg });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (cleanerId: string) =>
      api.post(`/business/cleaners/${cleanerId}/deactivate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['cleaners'] });
      setShowDeactivateModal(false);
      setStaffToDeactivate(null);
      setMessage({ type: 'success', text: 'Staff member deactivated.' });
    },
    onError: (err) => {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to deactivate' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cleanerId: string) => api.delete(`/business/cleaners/${cleanerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['cleaners'] });
      setShowDeleteModal(false);
      setStaffToDelete(null);
      setDeleteConfirmEmail('');
      setDeleteError(null);
      setMessage({ type: 'success', text: 'Staff member removed.' });
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to remove staff member';
      setDeleteError(msg);
      setMessage({ type: 'error', text: msg });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      email: formData.email.trim(),
      name: formData.name.trim() || undefined,
      method: formData.method,
    });
  };

  const handleRemoveClick = useCallback(
    (cleanerId: string, email: string, displayName: string) => {
      setStaffToDelete({ id: cleanerId, email, displayName });
      setDeleteConfirmEmail('');
      setDeleteError(null);
      setShowDeleteModal(true);
    },
    [],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!staffToDelete) return;
    if (deleteConfirmEmail !== staffToDelete.email) {
      setDeleteError('Email does not match. Please type the exact email address.');
      return;
    }
    setDeleteError(null);
    deleteMutation.mutate(staffToDelete.id);
  }, [staffToDelete, deleteConfirmEmail, deleteMutation]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copied to clipboard.' });
  };

  const list = workers ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Staff</h1>
          <p className="mt-1 text-base leading-relaxed text-zinc-700">Manage cleaners and team members</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="sm" className="shrink-0">
          <Plus className="size-4" />
          Add Staff
        </Button>
      </div>

      {message && (
        <InlineMessage type={message.type}>{message.text}</InlineMessage>
      )}

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-900">Team members</CardTitle>
          <CardDescription className="text-zinc-700">{list.length} member(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : list.length ? (
            <div className="space-y-3">
              {list.map((w) => {
                const displayName = getStaffDisplayName(w.name, w.email);
                return (
                  <div
                    key={w.id}
                    className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link
                      href={`/settings/workers/${w.cleanerId}`}
                      className="flex flex-1 min-w-0 items-start gap-4"
                    >
                      <Avatar className="size-12 shrink-0">
                        <AvatarFallback className="bg-zinc-200 text-zinc-700">
                          {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-zinc-900">{displayName}</p>
                          <Badge variant={w.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {w.status}
                          </Badge>
                        </div>
                        {w.email && (
                          <p className="text-sm text-zinc-500">{w.email}</p>
                        )}
                        <div className="mt-2 flex gap-6 text-sm">
                          <span>
                            <strong className="text-zinc-900">{w.totalJobs ?? 0}</strong>{' '}
                            <span className="text-zinc-500">total jobs</span>
                          </span>
                          <span>
                            <strong className="text-zinc-900">{w.todayJobs ?? 0}</strong>{' '}
                            <span className="text-zinc-500">today</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex shrink-0 gap-2">
                      {w.status === 'ACTIVE' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={(e) => {
                            e.preventDefault();
                            setStaffToDeactivate({
                              id: w.cleanerId,
                              email: w.email,
                              displayName: getStaffDisplayName(w.name, w.email),
                            });
                            setShowDeactivateModal(true);
                          }}
                        >
                          <UserMinus className="size-4" />
                          Deactivate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveClick(w.cleanerId, w.email, getStaffDisplayName(w.name, w.email));
                        }}
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-zinc-100">
                <UserX className="size-10 text-zinc-400" />
              </div>
              <h3 className="mb-1 font-semibold text-zinc-900">No staff yet</h3>
              <p className="mb-6 text-center text-sm text-zinc-600">
                Add your first staff member to get started
              </p>
              <Button onClick={() => setShowAddModal(true)}>Add First Staff Member</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      <Dialog 
        open={showAddModal} 
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            setFormData({ email: '', name: '', method: 'invite' });
            createMutation.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the staff member&apos;s email. An invite link will be created.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {createMutation.isError && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-900">Unable to add staff member</p>
                <p className="mt-1 text-sm text-red-700">
                  {createMutation.error instanceof Error ? createMutation.error.message : 'An error occurred'}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (createMutation.isError) createMutation.reset();
                }}
                placeholder="staff@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (createMutation.isError) createMutation.reset();
                }}
                placeholder="John Doe"
              />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
              A link will be generated. Share it with the staff member so they can sign up with Google or email.
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setShowAddModal(false);
                    setFormData({ email: '', name: '', method: 'invite' });
                  }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create Staff Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Link Modal */}
      <Dialog
        open={showInviteLinkModal}
        onOpenChange={(open) => {
          setShowInviteLinkModal(open);
          if (!open) setCreatedInvite(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Link Created</DialogTitle>
            <DialogDescription>
              Share this link with the staff member so they can sign up with Google or email
            </DialogDescription>
          </DialogHeader>
          {createdInvite && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Invite link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={createdInvite.inviteLink} className="font-mono text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdInvite.inviteLink)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Share via WhatsApp or SMS. The link expires in 7 days.
              </div>
              <Button className="w-full" onClick={() => setShowInviteLinkModal(false)}>
                Got it
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Deactivate Modal */}
      <Dialog
        open={showDeactivateModal}
        onOpenChange={(open) => {
          setShowDeactivateModal(open);
          if (!open) setStaffToDeactivate(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Staff Member?</DialogTitle>
            <DialogDescription>
              {staffToDeactivate && (
                <>
                  <strong>{staffToDeactivate.displayName}</strong> will no longer see new jobs. You
                  can re-add them later. This does not delete their account.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {staffToDeactivate && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivateModal(false);
                  setStaffToDeactivate(null);
                }}
                disabled={deactivateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => deactivateMutation.mutate(staffToDeactivate.id)}
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open);
          if (!open) {
            setStaffToDelete(null);
            setDeleteConfirmEmail('');
            setDeleteError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Staff Member?</DialogTitle>
            <DialogDescription>
              {staffToDelete && (
                <>
                  This will permanently remove <strong>{staffToDelete.displayName}</strong> from your
                  business. They will no longer be able to view or manage jobs.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {staffToDelete && (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                This will immediately revoke their access. This action cannot be undone.
              </div>
              {deleteError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="deleteConfirmEmail">Type {staffToDelete.email} to confirm:</Label>
                <Input
                  id="deleteConfirmEmail"
                  type="email"
                  value={deleteConfirmEmail}
                  onChange={(e) => {
                    setDeleteConfirmEmail(e.target.value);
                    setDeleteError(null);
                  }}
                  placeholder="Enter email to confirm"
                  disabled={deleteMutation.isPending}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStaffToDelete(null);
                    setDeleteConfirmEmail('');
                    setDeleteError(null);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={
                    deleteMutation.isPending || deleteConfirmEmail !== staffToDelete.email
                  }
                >
                  {deleteMutation.isPending ? 'Removing…' : 'Remove Staff Member'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function WorkersPage() {
  return (
    <RequireOwner>
      <WorkersContent />
    </RequireOwner>
  );
}
