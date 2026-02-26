import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service – Clenvora',
  description: 'Terms of service for Clenvora',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="font-semibold text-emerald-600 hover:text-emerald-700">
            ← Clenvora
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-600">Last updated: February 2025</p>

        <section className="mt-8 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Acceptance</h2>
          <p>
            By using Clenvora you agree to these terms. If you do not agree, do not use the
            service.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Use of the service</h2>
          <p>
            You must use Clenvora in line with applicable law and not misuse the service, other
            users’ data, or our systems. You are responsible for keeping your account secure and
            for the data you enter.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Privacy</h2>
          <p>
            Our use of your data is described in our{' '}
            <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">
              Privacy & Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after
            changes means you accept the updated terms.
          </p>
        </section>

        <p className="mt-12">
          <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
