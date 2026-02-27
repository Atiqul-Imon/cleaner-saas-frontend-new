'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/login?registered=1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setGoogleLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (err) throw err;
      // Redirect happens automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign up with Google');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <Logo href="/" size="lg" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Start your free trial—no credit card
          </p>
        </div>

        <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
          <CardContent className="pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-zinc-300 bg-white font-medium hover:bg-zinc-50"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-zinc-500">or</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
                {password && !passwordValid && (
                  <p className="text-xs text-amber-600">At least 6 characters</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
                {confirmPassword && !passwordMatch && (
                  <p className="text-xs text-red-600">Passwords don&apos;t match</p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(!!v)} />
                <label htmlFor="terms" className="text-sm leading-relaxed text-zinc-600">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-emerald-600 underline hover:no-underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-emerald-600 underline hover:no-underline">
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
                className="h-11 w-full bg-emerald-600 font-medium hover:bg-emerald-700"
                disabled={loading || !canSubmit}
              >
                {loading ? 'Creating…' : 'Create account'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
