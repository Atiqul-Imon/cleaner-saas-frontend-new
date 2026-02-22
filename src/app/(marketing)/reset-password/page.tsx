'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    setIsValidLink(!!(accessToken && type === 'recovery'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        toast.error('Invalid reset link');
        return;
      }

      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success('Password reset. Redirecting…');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  if (isValidLink === false) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Invalid link</CardTitle>
              <CardDescription>
                This reset link is invalid or expired. Request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full h-11">
                <Link href="/forgot-password">Request new link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Reset password</h1>
          <p className="mt-2 text-zinc-600">Enter your new password below</p>
        </div>
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Set new password</CardTitle>
            <CardDescription>Use at least 6 characters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>
              <Button type="submit" className="h-11 w-full" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-600">
              <Link href="/login" className="font-medium text-zinc-900 hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
