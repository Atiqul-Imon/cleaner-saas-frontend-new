'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
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
import { PasswordInput } from '@/components/ui/password-input';

type Mode = 'choose' | 'email' | 'whatsapp' | 'whatsapp-otp';
type EmailSent = boolean;
type OtpSent = boolean;

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<Mode>('choose');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() }, { silent: true });
      setEmailSent(true);
    } catch {
      setError('Failed to send reset email. Check the address.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { phone: phone.trim() }, { silent: true });
      setOtpSent(true);
      setMode('whatsapp-otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post(
        '/auth/reset-password-otp',
        { phone: phone.trim(), otp: otp.trim(), newPassword },
        { silent: true },
      );
      setOtpSent(false);
      setMode('choose');
      setPhone('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      window.location.href = '/login?reset=success';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP. Request a new code.');
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
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

  if (mode === 'whatsapp-otp') {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block font-semibold text-zinc-900">
              Clenvora
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
              Enter code & new password
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Check WhatsApp for the 6-digit code, then set a new password
            </p>
          </div>
          <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
            <CardContent className="pt-6">
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {error && (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="otp">Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    className="h-11 font-mono text-lg tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <PasswordInput
                    id="newPassword"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              <p className="mt-4 text-center text-sm text-zinc-600">
                <button
                  type="button"
                  onClick={() => {
                    setMode('whatsapp');
                    setOtp('');
                    setError('');
                  }}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Request new code
                </button>
              </p>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'choose') {
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
              Choose how you want to reset
            </p>
          </div>
          <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
            <CardContent className="pt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start border-zinc-200"
                onClick={() => setMode('email')}
              >
                Email me a reset link
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full justify-start border-zinc-200"
                onClick={() => setMode('whatsapp')}
              >
                Send code via WhatsApp
              </Button>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'email') {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block font-semibold text-zinc-900">
              Clenvora
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
              Reset via email
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Enter your email for a reset link
            </p>
          </div>
          <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg">Email</CardTitle>
              <CardDescription>We&apos;ll send a link to your inbox</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                {error && (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
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
              <p className="mt-4 text-center text-sm text-zinc-600">
                <button
                  type="button"
                  onClick={() => { setMode('choose'); setError(''); }}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Back
                </button>
              </p>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-sm text-zinc-600">
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // mode === 'whatsapp'
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block font-semibold text-zinc-900">
            Clenvora
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Reset via WhatsApp
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter the phone number linked to your account (UK format)
          </p>
        </div>
        <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Phone number</CardTitle>
            <CardDescription>We&apos;ll send a 6-digit code via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07xxx xxxxxx or +44 7xxx xxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full bg-emerald-600 font-medium hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send code via WhatsApp'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-zinc-600">
              <button
                type="button"
                onClick={() => { setMode('choose'); setError(''); }}
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Back
              </button>
            </p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
