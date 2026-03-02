'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserCog, Key, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, isCleaner } = useUser();
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['user'],
    queryFn: () => api.get<{ name?: string | null }>('/auth/me', { silent: true }),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile?.name !== undefined) {
      setName(profile.name ?? '');
    }
  }, [profile?.name]);

  const updateMutation = useMutation({
    mutationFn: (data: { name: string | null }) =>
      api.put('/auth/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setMessage({ type: 'success', text: 'Profile updated.' });
    },
    onError: (err) => {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile',
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    updateMutation.mutate({ name: name.trim() || null });
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link
          href={isCleaner ? '/my-jobs' : '/dashboard'}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">Profile</h1>
        <p className="mt-1 text-base leading-relaxed text-zinc-600">
          Update your name and manage your account
        </p>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCog className="size-5" />
            Edit name
          </CardTitle>
          <CardDescription>
            Your display name for the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div
                className={`rounded-lg border p-3 text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-11"
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="size-5" />
            Password
          </CardTitle>
          <CardDescription>
            Set or change your password to sign in with email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600">
            Use{' '}
            <Link
              href="/forgot-password"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Forgot password
            </Link>{' '}
            to set or reset your password. You can always sign in with Google.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
