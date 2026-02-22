'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() }, { silent: true });
      setSent(true);
      toast.success('Check your email for reset instructions');
    } catch {
      toast.error('Failed to send reset email. Check the address.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>We sent a reset link to {email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="h-11 w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/login">Back to sign in</Link>
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
            Forgot password
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter your email for a reset link
          </p>
        </div>

        <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Reset password</CardTitle>
            <CardDescription>We&apos;ll email you a link</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
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
              <Button
                type="submit"
                className="h-11 w-full bg-emerald-600 font-medium hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send reset link'}
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
