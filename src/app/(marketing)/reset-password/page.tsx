'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
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
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
            <CardHeader>
              <CardTitle>Invalid link</CardTitle>
              <CardDescription>This reset link is invalid or expired.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="h-11 w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/forgot-password">Request new link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block font-semibold text-zinc-900">
            Clenvora
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter your new password
          </p>
        </div>

        <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">New password</CardTitle>
            <CardDescription>Minimum 6 characters</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
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
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full bg-emerald-600 font-medium hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-600">
              <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
