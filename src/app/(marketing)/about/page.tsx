import Link from 'next/link';
import { CheckCircle2, Users, Sparkles, Shield, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Clenvora – Job Management for UK Cleaners',
  description: 'Learn about Clenvora, the job and invoice management platform built specifically for UK cleaning professionals and small cleaning businesses.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            ← Back to Clenvora
          </Link>
        </div>
      </header>
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900">About Clenvora</h1>
          <p className="mt-4 text-xl leading-relaxed text-zinc-700">
            Simple job and invoice management built for UK cleaning professionals
          </p>
        </div>

        {/* Mission */}
        <section className="mt-16 rounded-2xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-emerald-600 p-3 shrink-0">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Our Mission</h2>
              <p className="mt-3 text-lg leading-relaxed text-zinc-800">
                To help UK cleaners and small cleaning businesses spend less time on paperwork and more time doing what they do best — providing excellent cleaning services.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900">The Problem We Solve</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            Running a cleaning business shouldn't be complicated. Yet many cleaners struggle with:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              'Keeping track of which clients need cleaning and when',
              'Creating professional invoices quickly',
              'Remembering who has paid and who hasn&apos;t',
              'Managing a growing team of cleaners',
              'Spending too much time on admin instead of cleaning',
            ].map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-base text-zinc-700">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-400" />
                {problem}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-zinc-700">
            Clenvora eliminates these pain points with software designed specifically for the way UK cleaners work.
          </p>
        </section>

        {/* Our Solution */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900">Our Solution</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            Clenvora is a mobile-first platform that simplifies every aspect of managing a cleaning business:
          </p>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Users,
                title: 'Client Management',
                description: 'Store all client details in one place. No more lost phone numbers or forgotten addresses.',
              },
              {
                icon: CheckCircle2,
                title: 'Job Scheduling',
                description: 'Never miss a job. Set up recurring weekly cleans and get automatic reminders.',
              },
              {
                icon: Sparkles,
                title: 'Quick Invoicing',
                description: 'Generate professional invoices in seconds. Share via WhatsApp with one tap.',
              },
              {
                icon: Shield,
                title: 'Payment Tracking',
                description: 'Always know who has paid. Mark invoices as paid with one click.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-600">
                  <feature.icon className="size-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why We're Different */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900">Why We&apos;re Different</h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border-l-4 border-emerald-600 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Built for UK Cleaners</h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-700">
                We understand how UK cleaners work — from WhatsApp communication to GBP pricing. Clenvora is designed specifically for your needs, not adapted from generic business software.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-emerald-600 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Mobile-First Design</h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-700">
                Most cleaners are on the go. Clenvora works perfectly on your phone — add jobs, send invoices, and track payments from anywhere.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-emerald-600 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Free to Start</h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-700">
                Self-employed cleaners get Clenvora free forever. No credit card required, no hidden fees. As your business grows, upgrade to paid plans with more features.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-emerald-600 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Simple & Straightforward</h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-700">
                No complicated menus or confusing features. Everything you need is easy to find. Get started in less than 5 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* For Solo Cleaners & Teams */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900">For Solo Cleaners & Growing Teams</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            Whether you're a self-employed cleaner or managing a team of 20+, Clenvora scales with you:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Solo Cleaners</h3>
              <ul className="mt-4 space-y-2">
                {[
                  'Free forever',
                  '20 jobs per month',
                  'Unlimited clients',
                  'Full invoicing',
                  'Payment tracking',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border-2 border-emerald-600 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900">Team Plans</h3>
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {[
                  'Manage up to 20 staff',
                  'Unlimited jobs',
                  'Assign jobs to cleaners',
                  'Track team performance',
                  'Everything in Solo',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900">Our Commitment to You</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-700">
            <p>
              <strong className="text-zinc-900">Your Data is Yours:</strong> We never sell your data. You can export or delete it anytime.
            </p>
            <p>
              <strong className="text-zinc-900">Security First:</strong> All data is encrypted and stored securely. We comply with UK GDPR and data protection laws.
            </p>
            <p>
              <strong className="text-zinc-900">Transparent Pricing:</strong> No hidden fees. Free plan is truly free. Paid plans have clear, upfront pricing.
            </p>
            <p>
              <strong className="text-zinc-900">Customer Support:</strong> We're here to help. Contact us through the app or website for support.
            </p>
            <p>
              <strong className="text-zinc-900">Continuous Improvement:</strong> We regularly add features and improvements based on feedback from real cleaners.
            </p>
          </div>
        </section>

        {/* Get Started */}
        <section className="mt-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Simplify Your Cleaning Business?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg">
            Join hundreds of UK cleaners who've already switched to Clenvora. Start free today — no credit card required.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/90 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:border-white"
            >
              See Features
            </Link>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600">
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-zinc-400">·</span>
          <Link href="/terms" className="hover:text-emerald-600 transition-colors">
            Terms of Service
          </Link>
          <span className="text-zinc-400">·</span>
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
