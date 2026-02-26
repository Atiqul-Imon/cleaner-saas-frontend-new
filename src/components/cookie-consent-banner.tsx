'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  getStoredConsent,
  setConsent,
  hasAnsweredConsent,
  type ConsentLevel,
} from '@/lib/cookie-consent';

const COOKIE_POLICY_URL = '/privacy#cookies';

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setShowBanner(!hasAnsweredConsent());
  }, [mounted]);

  const handleChoice = (level: ConsentLevel) => {
    setConsent(level);
    setShowBanner(false);
  };

  if (!showBanner || !mounted) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-zinc-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:left-4 sm:right-4 sm:bottom-4 sm:max-w-lg sm:rounded-xl sm:border"
    >
      <p className="text-sm text-zinc-700">
        We use necessary cookies for sign-in and security. Optional cookies help us improve the
        service. See our{' '}
        <Link href={COOKIE_POLICY_URL} className="font-medium text-emerald-600 underline hover:text-emerald-700">
          cookie and privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleChoice('necessary')}
          className="border-zinc-300"
        >
          Necessary only
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => handleChoice('all')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Accept all
        </Button>
      </div>
    </div>
  );
}
