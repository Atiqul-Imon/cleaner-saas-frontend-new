'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RequireOwner } from '@/components/require-owner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
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
import { Copy, Plus, Trash2, UserX } from 'lucide-react';

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
  tempPassword?: string;
}

function WorkersContent() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [staffToDelete, setStaffToDelete] = useState<{
    id: string;
    email: string;
    displayName: string;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createdStaff, setCreatedStaff] = useState<{ email: string; password: string } | null>(null);
  const [formData, setFormData] = useState({ email: '', name: '' });

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.get<Worker[]>('/business/cleaners'),
    enabled: !!user && (user.role === 'OWNER' || user.role === 'ADMIN'),
  });

  const createMutation = useMutation({
    mutationFn: (data: { email: string; name?: string }) =>
      api.post<CreateCleanerResponse>('/business/cleaners', data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      if (result?.tempPassword) {
        setCreatedStaff({ email: variables.email, password: result.tempPassword });
        setShowAddModal(false);
        setShowPasswordModal(true);
      } else {
        setShowAddModal(false);
        setFormData({ email: '', name: '' });
      }
      setFormData({ email: '', name: '' });
      toast.success('Staff member added successfully');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to add staff member';
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cleanerId: string) => api.delete(`/business/cleaners/${cleanerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setShowDeleteModal(false);
      setStaffToDelete(null);
      setDeleteConfirmEmail('');
      setDeleteError(null);
      toast.success('Staff member removed successfully');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to remove staff member';
      setDeleteError(msg);
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ email: formData.email.trim(), name: formData.name.trim() || undefined });
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
    toast.success('Copied to clipboard');
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveClick(w.cleanerId, w.email, getStaffDisplayName(w.name, w.email));
                      }}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
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
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          onPointerDownOutside={() => setFormData({ email: '', name: '' })}
          onEscapeKeyDown={() => setFormData({ email: '', name: '' })}
        >
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the staff member&apos;s email. A temporary password will be generated.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="staff@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
              A temporary password will be generated and shown after creation. Share it securely
              with the staff member.
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ email: '', name: '' });
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

      {/* Password Display Modal */}
      <Dialog
        open={showPasswordModal}
        onOpenChange={(open) => {
          setShowPasswordModal(open);
          if (!open) setCreatedStaff(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staff Member Created</DialogTitle>
            <DialogDescription>
              Share these credentials securely with the staff member
            </DialogDescription>
          </DialogHeader>
          {createdStaff && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex gap-2">
                  <Input readOnly value={createdStaff.email} className="font-mono" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdStaff.email)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Temporary password</Label>
                <div className="flex gap-2">
                  <Input readOnly value={createdStaff.password} className="font-mono font-semibold" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdStaff.password)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                This password remains valid until the staff member changes it. Share it securely via
                WhatsApp, SMS, or email.
              </div>
              <Button className="w-full" onClick={() => setShowPasswordModal(false)}>
                Got it, I&apos;ve saved the credentials
              </Button>
            </div>
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
