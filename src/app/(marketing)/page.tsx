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
            <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              Free to start
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Keep Track of Your Cleaning Work
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/95 sm:text-xl">
              Remember your jobs. Know who paid you. Simple as a notebook, but on your phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Link href="/register">Try it free</Link>
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
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Works on your phone
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Easy to use
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
              Everything in One Place
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
              No more lost papers or forgotten jobs
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Your Clients', desc: "Save names and addresses so you don't have to remember", color: 'bg-emerald-600' },
              { icon: Calendar, title: 'Weekly Jobs', desc: "Set it once, we'll remind you every week", color: 'bg-blue-600' },
              { icon: Camera, title: 'Take Photos', desc: "Show before and after - works without internet", color: 'bg-amber-600' },
              { icon: FileText, title: 'Quick Invoices', desc: "Job done? Invoice ready. No typing needed", color: 'bg-violet-600' },
              { icon: Wallet, title: 'Track Payments', desc: "See who paid and who still owes you", color: 'bg-teal-600' },
              { icon: Smartphone, title: 'On Your Phone', desc: "Works anywhere. Save to your home screen", color: 'bg-rose-600' },
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
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
              Four simple steps. That's it.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Add Job', desc: 'Write down your cleaning jobs' },
              { step: '2', title: 'Finish Job', desc: 'Tap "Done" when finished' },
              { step: '3', title: 'Send Invoice', desc: 'Already made for you' },
              { step: '4', title: 'Mark Paid', desc: 'Tick off when they pay' },
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

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Simple, Honest Pricing
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
              Start free. Upgrade when you're ready to grow your team.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* SOLO - Free */}
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-900">Solo</h3>
                <p className="mt-2 text-sm text-zinc-600">Perfect for self-employed cleaners</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-zinc-900">FREE</span>
                  <span className="ml-2 text-sm font-medium text-emerald-600">Forever</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>1 staff member</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>20 jobs per month</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Client management</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Invoicing & payments</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Photo uploads</span>
                </li>
              </ul>
              <Button asChild className="mt-8 w-full" variant="outline">
                <Link href="/register">Start free</Link>
              </Button>
            </div>

            {/* TEAM - Most Popular */}
            <div className="relative rounded-2xl border-2 border-emerald-600 bg-white p-8 shadow-lg lg:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-900">Team</h3>
                <p className="mt-2 text-sm text-zinc-600">For growing cleaning businesses</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-zinc-900">£14.99</span>
                  <span className="ml-2 text-sm text-zinc-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>Up to 15 staff</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>Unlimited jobs</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Everything in Solo</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Team management</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button asChild className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Start 1-month free trial</Link>
              </Button>
            </div>

            {/* BUSINESS */}
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-900">Business</h3>
                <p className="mt-2 text-sm text-zinc-600">For large cleaning operations</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-zinc-900">£99.99</span>
                  <span className="ml-2 text-sm text-zinc-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>Up to 100 staff</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span><strong>Unlimited jobs</strong></span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Everything in Team</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button asChild className="mt-8 w-full" variant="outline">
                <Link href="/register">Start 1-month free trial</Link>
              </Button>
            </div>
          </div>

          {/* Trust builder */}
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500">
              All plans include 1 month free trial • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/95 sm:text-lg">
            Free to start. No complicated setup. Works on your phone.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Link href="/register">Try it free</Link>
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
