import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  Camera,
  FileText,
  Wallet,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-900 px-4 py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Run your cleaning business. Simply.
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Run Your Cleaning Business Like a Pro
            </h1>
            <p className="mt-6 text-lg text-zinc-300 sm:text-xl">
              Manage clients, schedule jobs, track payments, and get paid faster. Everything you
              need in one powerful platform.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 bg-white text-zinc-900 hover:bg-zinc-100">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-zinc-400">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white px-4 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
              Powerful tools designed for cleaning businesses to streamline operations and grow
              faster.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Client Management',
                desc: 'Keep track of clients, preferences, access details, and service history in one place.',
                color: 'bg-emerald-600',
              },
              {
                icon: Calendar,
                title: 'Smart Scheduling',
                desc: 'Schedule one-off or recurring jobs with automatic generation for weekly or bi-weekly cleaning.',
                color: 'bg-blue-600',
              },
              {
                icon: Camera,
                title: 'Proof of Work',
                desc: 'Upload before/after photos with timestamps. Works offline and syncs when back online.',
                color: 'bg-amber-600',
              },
              {
                icon: FileText,
                title: 'Auto Invoicing',
                desc: 'Generate professional invoices on job completion with tax calculation.',
                color: 'bg-violet-600',
              },
              {
                icon: Wallet,
                title: 'Payment Tracking',
                desc: 'Track payments, send reminders, and mark payments for bank transfers.',
                color: 'bg-teal-600',
              },
              {
                icon: Smartphone,
                title: 'Mobile First',
                desc: 'Works on any device. Install as a PWA for an app-like experience.',
                color: 'bg-rose-600',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-lg text-white ${item.color}`}
                >
                  <item.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-3 text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-zinc-50 px-4 py-20 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Simple Workflow, Powerful Results
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
              From scheduling to payment, streamline your entire cleaning business workflow.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Schedule Jobs', desc: 'Create one-time or recurring cleaning jobs' },
              { step: '2', title: 'Complete Work', desc: 'Finish the job and upload proof photos' },
              { step: '3', title: 'Auto Invoice', desc: 'Invoices are generated and sent to clients' },
              { step: '4', title: 'Get Paid', desc: 'Track payments and send reminders' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-900 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-4 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Cleaning Business?
          </h2>
          <p className="mt-6 text-lg text-zinc-300">
            Join cleaning professionals who trust Clenvora. Start your free trial today—no credit
            card required.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-white text-zinc-900 hover:bg-zinc-100">
              <Link href="/register">Start free trial</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" /> 14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" /> No credit card
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
