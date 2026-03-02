'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';

function getInviteUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
  return `${base}/invites/${token}`;
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { user, isLoading: userLoading } = useUser();
  const [invite, setInvite] = useState<{ email: string; businessName: string } | null>(null);
  const [inviteError, setInviteError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteError('Invalid invite link');
      return;
    }
    fetch(getInviteUrl(token))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Invalid or expired invite'))))
      .then((data) => setInvite({ email: data.email, businessName: data.businessName }))
      .catch(() => setInviteError('Invalid or expired invite'));
  }, [token]);

  useEffect(() => {
    if (!user || !token || !invite || accepted || accepting) return;
    setAccepting(true);
    api
      .post('/business/cleaners/accept-invite', { token })
      .then(() => {
        setAccepted(true);
        setTimeout(() => {
          router.push('/my-jobs');
          router.refresh();
        }, 1500);
      })
      .catch((err) => {
        setInviteError(err instanceof Error ? err.message : 'Could not accept invite');
      })
      .finally(() => setAccepting(false));
  }, [user, token, invite, accepted, accepting, router]);

  const handleGoogleSignIn = () => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(`/accept-invite?token=${token}`)}`,
      },
    });
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invite</CardTitle>
            <CardDescription>This invite link is invalid or missing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (inviteError && !invite) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid or expired invite</CardTitle>
            <CardDescription>{inviteError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>You&apos;ve joined the team</CardTitle>
            <CardDescription>
              Welcome to {invite?.businessName}. Redirecting you to your jobs…
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && invite) {
    if (accepting) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      );
    }
    if (inviteError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Could not accept invite</CardTitle>
              <CardDescription>{inviteError}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/my-jobs">Go to my jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block font-semibold text-zinc-900">
            Clenvora
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">Join the team</h1>
          <p className="mt-2 text-sm text-zinc-600">
            You&apos;ve been invited to join <strong>{invite?.businessName ?? '…'}</strong>
          </p>
        </div>
        <Card className="border-zinc-200 shadow-lg shadow-zinc-200/50">
          <CardHeader>
            <CardTitle>Continue with Google</CardTitle>
            <CardDescription>
              Use the Google account that matches the invite email to join the team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-600">
              Use the Google account <strong>{invite?.email ?? '…'}</strong> that your manager added.
            </p>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-zinc-300 bg-white font-medium hover:bg-zinc-50"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading…</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
