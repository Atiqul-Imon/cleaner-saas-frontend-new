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
      {/* Hero - emerald/teal gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-4 py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Run Your Cleaning Business Simply
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/95 sm:text-xl">
              Schedule jobs, track payments, get paid faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-2 border-white/80 bg-white/10 font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> 14-day trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Cancel anytime
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
              Tools built for cleaning businesses.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Client Management', desc: 'Track clients, preferences and history.', color: 'bg-emerald-600' },
              { icon: Calendar, title: 'Smart Scheduling', desc: 'One-off or recurring jobs, auto-generated.', color: 'bg-blue-600' },
              { icon: Camera, title: 'Proof of Work', desc: 'Before/after photos. Works offline.', color: 'bg-amber-600' },
              { icon: FileText, title: 'Auto Invoicing', desc: 'Generate invoices on completion.', color: 'bg-violet-600' },
              { icon: Wallet, title: 'Payment Tracking', desc: 'Track payments, send reminders.', color: 'bg-teal-600' },
              { icon: Smartphone, title: 'Mobile First', desc: 'Works on any device. Install as PWA.', color: 'bg-rose-600' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`flex size-11 items-center justify-center rounded-lg text-white ${item.color}`}>
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-zinc-50 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Simple Workflow
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
              Schedule → Complete → Invoice → Get paid.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Schedule', desc: 'Create jobs' },
              { step: '2', title: 'Complete', desc: 'Finish & upload photos' },
              { step: '3', title: 'Invoice', desc: 'Auto-generated' },
              { step: '4', title: 'Get Paid', desc: 'Track & remind' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/95">
            Start your free trial in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Link href="/register">Start free trial</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-2 border-white/80 bg-white/10 font-medium text-white hover:bg-white/20"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
