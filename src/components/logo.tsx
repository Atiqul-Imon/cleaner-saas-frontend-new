'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ href = '/', className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700',
        sizeClasses[size],
        className,
      )}
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      <span className="text-teal-700">C</span>
      <span>lenvora</span>
    </Link>
  );
}
