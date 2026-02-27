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
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-4 py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-tight">
              Simple Job & Invoice Management for UK Cleaning Businesses
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-white/95 sm:text-2xl sm:leading-relaxed">
              Manage weekly jobs, send invoices in seconds, and track who has paid — all from your phone.
            </p>
            <p className="mt-4 text-lg font-medium text-white/95">
              No paperwork. No missed jobs. No payment confusion.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-white text-emerald-700 shadow-xl hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-2xl transition-all"
              >
                <Link href="/register">Start Free Beta</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base border-2 border-white/90 bg-white/15 font-semibold text-white backdrop-blur-sm hover:bg-white/25 hover:border-white transition-all"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/95">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 shrink-0" /> Free to start
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 shrink-0" /> Built for solo cleaners & small teams
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 shrink-0" /> Works on your phone
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 shrink-0" /> Works alongside WhatsApp
                </span>
              </div>
              <p className="text-sm text-white/85 font-medium">
                Takes less than 1 minute to get started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white px-4 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything in One Place
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
              No more lost papers or forgotten jobs
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Your Clients', desc: "Save names and addresses so you don't have to remember", color: 'bg-emerald-600' },
              { icon: Calendar, title: 'Weekly Jobs', desc: "Set it once, we'll remind you every week", color: 'bg-blue-600' },
              { icon: Camera, title: 'Take Photos', desc: 'Show before and after with your phone camera', color: 'bg-amber-600' },
              { icon: FileText, title: 'Quick Invoices', desc: "Job done? Invoice ready. No typing needed", color: 'bg-violet-600' },
              { icon: Wallet, title: 'Track Payments', desc: "See who paid and who still owes you", color: 'bg-teal-600' },
              { icon: Smartphone, title: 'On Your Phone', desc: "Works anywhere. Save to your home screen", color: 'bg-rose-600' },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-zinc-300"
              >
                <div className={`flex size-14 items-center justify-center rounded-xl text-white shadow-md ${item.color}`}>
                  <item.icon className="size-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-zinc-50 to-white px-4 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
              Four simple steps. That's it.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Add Job', desc: 'Write down your cleaning jobs' },
              { step: '2', title: 'Finish Job', desc: 'Tap "Done" when finished' },
              { step: '3', title: 'Send Invoice', desc: 'Already made for you' },
              { step: '4', title: 'Mark Paid', desc: 'Tick off when they pay' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="mt-5 text-xl font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 bg-white px-4 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Simple, Honest Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
              Start free. Upgrade when you're ready to grow your team.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* SOLO - Free */}
            <div className="rounded-3xl border-2 border-zinc-200 bg-white p-10 shadow-sm transition-all duration-200 hover:shadow-xl hover:border-zinc-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-zinc-900">Solo</h3>
                <p className="mt-3 text-base text-zinc-600">Perfect for self-employed cleaners</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-zinc-900">FREE</span>
                  <span className="ml-3 text-base font-semibold text-emerald-600">Forever</span>
                </div>
              </div>
              <ul className="mt-10 space-y-4">
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">1 staff member</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">20 jobs per month</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Client management</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Invoicing & payments</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Photo uploads</span>
                </li>
              </ul>
              <Button asChild className="mt-10 w-full h-12 text-base font-semibold" variant="outline">
                <Link href="/register">Start free</Link>
              </Button>
            </div>

            {/* TEAM - Most Popular */}
            <div className="relative rounded-3xl border-2 border-emerald-600 bg-white p-10 shadow-xl lg:scale-105 transition-all duration-200 hover:shadow-2xl">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-emerald-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-zinc-900">Team</h3>
                <p className="mt-3 text-base text-zinc-600">For growing cleaning businesses</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-zinc-900">£14.99</span>
                  <span className="ml-2 text-base text-zinc-600">/month</span>
                </div>
              </div>
              <ul className="mt-10 space-y-4">
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">Up to 20 staff</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">Unlimited jobs</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Everything in Solo</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Team management</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button asChild className="mt-10 w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all">
                <Link href="/register">Start 1-month free trial</Link>
              </Button>
            </div>

            {/* BUSINESS */}
            <div className="rounded-3xl border-2 border-zinc-200 bg-white p-10 shadow-sm transition-all duration-200 hover:shadow-xl hover:border-zinc-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-zinc-900">Business</h3>
                <p className="mt-3 text-base text-zinc-600">For large cleaning operations</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-zinc-900">£99.99</span>
                  <span className="ml-2 text-base text-zinc-600">/month</span>
                </div>
              </div>
              <ul className="mt-10 space-y-4">
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">Unlimited staff</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong className="font-semibold">Unlimited jobs</strong></span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Everything in Team</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Custom invoice branding</span>
                </li>
                <li className="flex items-start gap-3 text-base text-zinc-700">
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button asChild className="mt-10 w-full h-12 text-base font-semibold" variant="outline">
                <Link href="/register">Start 1-month free trial</Link>
              </Button>
            </div>
          </div>

          {/* Trust builder */}
          <div className="mt-16 text-center">
            <p className="text-base text-zinc-500 font-medium">
              Team & Business plans include 1 month free trial • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-white/95">
            Free to start. No complicated setup. Works on your phone.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-emerald-700 shadow-xl hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-2xl transition-all"
            >
              <Link href="/register">Try it free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base border-2 border-white/90 bg-white/15 font-semibold text-white hover:bg-white/25 hover:border-white transition-all"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
