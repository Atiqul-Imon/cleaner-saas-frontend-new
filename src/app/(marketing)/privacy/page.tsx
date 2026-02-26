import Link from 'next/link';

export const metadata = {
  title: 'Privacy & Cookies – Clenvora',
  description: 'Privacy policy and cookie information for Clenvora',
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold text-zinc-900">Privacy & Cookie Policy</h1>
        <p className="mt-2 text-sm text-zinc-600">Last updated: February 2025</p>

        <section className="mt-8 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">What we collect</h2>
          <p>
            We collect the information you provide when you sign up and use Clenvora (e.g. email,
            business and client details, job and invoice data). We use this to run the service and
            to improve it.
          </p>
        </section>

        <section id="cookies" className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Cookies</h2>
          <p>
            We use cookies and similar storage for the following purposes:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Necessary cookies</strong> – Required for sign-in, security and basic
              operation. These are always used and cannot be disabled.
            </li>
            <li>
              <strong>Optional cookies</strong> – Used for analytics and improving the service, if
              you choose &quot;Accept all&quot; in the cookie banner.
            </li>
          </ul>
          <p>
            You can change your choice at any time by clearing site data or using the cookie
            preference link when we make it available.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Your rights (UK / GDPR)</h2>
          <p>
            You have the right to access, correct, export and delete your data. You can also
            object to or restrict certain processing. To exercise these rights, contact us using
            the details in your account or on our website.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900">Contact</h2>
          <p>
            For privacy or data requests, use the support contact provided in your dashboard or
            on the Clenvora website.
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
