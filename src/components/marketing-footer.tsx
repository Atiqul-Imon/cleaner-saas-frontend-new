'use client';

import Link from 'next/link';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="font-semibold text-zinc-900">
              Clenvora
            </Link>
            <p className="mt-3 max-w-sm text-sm text-zinc-600">
              Run your cleaning business smoothly. Manage clients, schedule jobs, and get paid
              faster.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">Product</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">Company</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">Legal</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-8">
          <p className="text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Clenvora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
