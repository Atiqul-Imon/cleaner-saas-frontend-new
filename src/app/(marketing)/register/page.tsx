'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordMatch = !confirmPassword || password === confirmPassword;
  const passwordValid = password.length >= 6;
  const canSubmit = email && password && confirmPassword && agreeTerms && passwordMatch && passwordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      await api.post('/auth/signup', {
        email: email.trim(),
        password,
      });
      toast.success('Account created. Sign in to continue.');
      router.push('/login?registered=1');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create your account</h1>
          <p className="mt-2 text-zinc-600">Start your free trial—no credit card required</p>
        </div>

        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>
              All fields are required. Use at least 6 characters for your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
                <p className="text-xs text-zinc-500">Must be at least 6 characters</p>
                {password && !passwordValid && (
                  <p className="text-xs text-amber-600">Password is too short</p>
                )}
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
                  autoComplete="new-password"
                  className="h-11"
                />
                {confirmPassword && !passwordMatch && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(v) => setAgreeTerms(!!v)}
                />
                <label htmlFor="terms" className="text-sm leading-relaxed text-zinc-600">
                  I agree to the{' '}
                  <Link href="#" className="font-medium text-zinc-900 underline hover:no-underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="font-medium text-zinc-900 underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="h-11 w-full"
                disabled={loading || !canSubmit}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
