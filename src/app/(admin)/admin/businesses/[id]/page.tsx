'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, Calendar, FileText, UserCog, Briefcase, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { alertDialog } from '@/components/alert-dialog-provider';

interface BusinessDetails {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  invoiceTemplate?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
    phone?: string;
    createdAt: string;
  };
  subscription?: {
    id: string;
    planType: string;
    status: string;
    currentPeriodEnd: string;
    trialStartedAt?: string;
    trialEndsAt?: string;
    payoneerEmail?: string;
    adminNotes?: string;
    paymentMethod?: string;
    createdAt: string;
  };
  clients: Array<{
    id: string;
    name: string;
    phone?: string;
    createdAt: string;
  }>;
  jobs: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    client: { name: string };
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  cleaners: Array<{
    id: string;
    cleaner: {
      email: string;
      name?: string;
      phone?: string;
    };
    status: string;
    createdAt: string;
  }>;
  _count: {
    clients: number;
    jobs: number;
    invoices: number;
    cleaners: number;
  };
}

export default function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { isAdmin, isLoading: roleLoading } = useUser();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    vatEnabled: false,
    vatNumber: '',
  });

  const businessQuery = useQuery({
    queryKey: ['admin', 'business', id],
    queryFn: () => api.get<BusinessDetails>(`/admin/businesses/${id}`),
    enabled: isAdmin && !!id,
  });

  // Initialize form when business data loads
  const business = businessQuery.data;
  if (business && !editForm.name && !isEditing) {
    setEditForm({
      name: business.name,
      phone: business.phone || '',
      address: business.address || '',
      vatEnabled: business.vatEnabled,
      vatNumber: business.vatNumber || '',
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data: typeof editForm) => api.put(`/admin/businesses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'business', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      setIsEditing(false);
      alertDialog.success('Success', 'Business updated successfully');
    },
    onError: (error: any) => {
      alertDialog.error('Update Failed', error.message || 'Failed to update business');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/businesses/${id}`),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      alertDialog.success(
        'Business Deleted',
        `Successfully deleted ${data.deletedBusiness.name} and all associated data (${data.deletedCounts.clients} clients, ${data.deletedCounts.jobs} jobs, ${data.deletedCounts.invoices} invoices, ${data.deletedCounts.cleaners} staff)`,
        () => router.push('/admin/businesses')
      );
    },
    onError: (error: any) => {
      alertDialog.error('Delete Failed', error.message || 'Failed to delete business');
    },
  });

  const handleDelete = () => {
    if (!business) return;
    
    alertDialog.confirm(
      'Delete Business?',
      `Are you sure you want to delete "${business.name}"?\n\nThis will PERMANENTLY delete:\n• The business and owner account\n• ${business._count.clients} clients\n• ${business._count.jobs} jobs\n• ${business._count.invoices} invoices\n• ${business._count.cleaners} staff members\n• All associated data\n\nThis action CANNOT be undone!`,
      () => deleteMutation.mutate(),
      undefined,
      'Delete Permanently',
      'Cancel'
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editForm);
  };

  if (roleLoading || businessQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  if (!business) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500">Business not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/businesses')}>
          Back to Businesses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/businesses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{business.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">Business Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: business.name,
                    phone: business.phone || '',
                    address: business.address || '',
                    vatEnabled: business.vatEnabled,
                    vatNumber: business.vatNumber || '',
                  });
                }}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Business Information</h2>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vatEnabled"
                    checked={editForm.vatEnabled}
                    onChange={(e) => setEditForm({ ...editForm, vatEnabled: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="vatEnabled">VAT Enabled</Label>
                </div>
                {editForm.vatEnabled && (
                  <div>
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      value={editForm.vatNumber}
                      onChange={(e) => setEditForm({ ...editForm, vatNumber: e.target.value })}
                    />
                  </div>
                )}
                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-sm text-zinc-600">
                    Note: Owner email and account details cannot be changed here.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-600">Business Name</label>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{business.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Owner Email</label>
                  <p className="mt-1 text-zinc-900">{business.user.email}</p>
                </div>
                {business.user.name && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Owner Name</label>
                    <p className="mt-1 text-zinc-900">{business.user.name}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {business.user.phone && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Owner Phone</label>
                    <p className="mt-1 text-zinc-900">{business.user.phone}</p>
                  </div>
                )}
                {business.phone && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Business Phone</label>
                    <p className="mt-1 text-zinc-900">{business.phone}</p>
                  </div>
                )}
              </div>
              {business.address && (
                <div>
                  <label className="text-sm font-medium text-zinc-600">Address</label>
                  <p className="mt-1 text-zinc-900">{business.address}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">VAT Enabled</label>
                  <p className="mt-1 text-zinc-900">
                    {business.vatEnabled ? (
                      <span className="font-semibold text-emerald-600">Yes</span>
                    ) : (
                      <span className="text-zinc-500">No</span>
                    )}
                  </p>
                </div>
                {business.vatNumber && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">VAT Number</label>
                    <p className="mt-1 text-zinc-900">{business.vatNumber}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Created</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Last Updated</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.updatedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Staff / Cleaners</h2>
              <span className="text-sm text-zinc-600">{business._count.cleaners} total</span>
            </div>
            {business.cleaners.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No staff added yet</p>
            ) : (
              <div className="space-y-3">
                {business.cleaners.map((cleaner) => (
                  <div
                    key={cleaner.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{cleaner.cleaner.email}</p>
                      {cleaner.cleaner.name && (
                        <p className="text-sm text-zinc-600">{cleaner.cleaner.name}</p>
                      )}
                      {cleaner.cleaner.phone && (
                        <p className="text-sm text-zinc-600">{cleaner.cleaner.phone}</p>
                      )}
                      <p className="text-xs text-zinc-500">
                        Added {new Date(cleaner.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        cleaner.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {cleaner.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recent Jobs</h2>
              <span className="text-sm text-zinc-600">{business._count.jobs} total</span>
            </div>
            {business.jobs.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No jobs yet</p>
            ) : (
              <div className="space-y-3">
                {business.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{job.client.name}</p>
                      <p className="text-sm text-zinc-600">
                        {new Date(job.scheduledDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recent Invoices</h2>
              <span className="text-sm text-zinc-600">{business._count.invoices} total</span>
            </div>
            {business.invoices.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {business.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">#{invoice.invoiceNumber}</p>
                      <p className="text-sm text-zinc-600">
                        {new Date(invoice.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900">
                        £
                        {Number(invoice.totalAmount).toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded px-2 py-1 text-xs font-semibold ${
                          invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/subscriptions')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Clients</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.clients}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Jobs</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.jobs}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-violet-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Invoices</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.invoices}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                    <UserCog className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Staff</p>
                    <p className="text-2xl font-bold text-zinc-900">{business._count.cleaners}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {business.subscription && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Subscription</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/subscriptions')}
                >
                  Manage
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-zinc-600">Plan</label>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">
                    {business.subscription.planType === 'SOLO' && 'Solo (FREE - 1 staff, 20 jobs/mo)'}
                    {business.subscription.planType === 'TEAM' && 'Team (£14.99/mo, 15 staff)'}
                    {business.subscription.planType === 'BUSINESS' && 'Business (£99.99/mo, 100 staff)'}
                    {!['SOLO','TEAM','BUSINESS'].includes(business.subscription.planType) && business.subscription.planType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Status</label>
                  <p className="mt-1">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        business.subscription.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : business.subscription.status === 'TRIALING'
                            ? 'bg-blue-100 text-blue-700'
                            : business.subscription.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : business.subscription.status === 'PAST_DUE'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {business.subscription.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600">Current Period Ends</label>
                  <p className="mt-1 text-zinc-900">
                    {new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {business.subscription.trialEndsAt && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Trial Ends</label>
                    <p className="mt-1 text-zinc-900">
                      {new Date(business.subscription.trialEndsAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {business.subscription.paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Payment Method</label>
                    <p className="mt-1 text-zinc-900">{business.subscription.paymentMethod}</p>
                  </div>
                )}
                {business.subscription.payoneerEmail && (
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Payoneer Email</label>
                    <p className="mt-1 text-zinc-900">{business.subscription.payoneerEmail}</p>
                  </div>
                )}
                {business.subscription.adminNotes && (
                  <div className="border-t border-zinc-200 pt-3">
                    <label className="text-sm font-medium text-zinc-600">Admin Notes</label>
                    <p className="mt-1 whitespace-pre-wrap rounded bg-amber-50 p-2 text-sm text-zinc-900">
                      {business.subscription.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-zinc-600">Business ID</label>
                <p className="mt-1 font-mono text-sm text-zinc-900">{business.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-600">User ID</label>
                <p className="mt-1 font-mono text-sm text-zinc-900">{business.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-600">Role</label>
                <p className="mt-1 text-zinc-900">{business.user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-600">Account Created</label>
                <p className="mt-1 text-zinc-900">
                  {new Date(business.user.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              {business.invoiceTemplate && (
                <div>
                  <label className="text-sm font-medium text-zinc-600">Invoice Template</label>
                  <p className="mt-1 text-zinc-900">{business.invoiceTemplate}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
