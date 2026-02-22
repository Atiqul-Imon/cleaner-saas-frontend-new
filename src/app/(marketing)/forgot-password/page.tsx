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
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>We sent a password reset link to {email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full h-11">
                <Link href="/login">Back to sign in</Link>
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Forgot password</h1>
          <p className="mt-2 text-zinc-600">Enter your email and we will send a reset link</p>
        </div>
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>We will email you a link to create a new password</CardDescription>
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
              <Button type="submit" className="h-11 w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
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
