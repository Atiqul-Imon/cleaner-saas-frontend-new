import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy – Clenvora',
  description: 'Privacy policy and data protection information for Clenvora - UK GDPR compliant cleaning business management software',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-zinc-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-600">Last updated: 21 February 2026</p>
        <p className="mt-4 text-base text-zinc-700">
          Clenvora is committed to protecting your privacy and personal data. This policy explains how we collect, use, and safeguard your information in accordance with UK GDPR and Data Protection Act 2018.
        </p>

        {/* Data Controller */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">1. Data Controller</h2>
          <p>
            Clenvora (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is the data controller responsible for your personal information. We are committed to ensuring your data is processed lawfully, fairly, and transparently.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">2. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">2.1 Information You Provide</h3>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Account Information:</strong> Email address, name, phone number, business name and address</li>
            <li><strong>Business Data:</strong> Client information (names, addresses, phone numbers), job details, invoice data, payment records</li>
            <li><strong>Team Information:</strong> Staff member details you add to your account</li>
            <li><strong>Photos:</strong> Before and after photos you upload for jobs</li>
            <li><strong>Payment Information:</strong> Payment method details (processed securely through our payment providers)</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">2.2 Information Collected Automatically</h3>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
            <li><strong>Cookies:</strong> Essential cookies for authentication and optional analytics cookies (see Section 8)</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">3. How We Use Your Information</h2>
          <p>We process your data for the following purposes:</p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Service Delivery:</strong> To provide and operate Clenvora&apos;s job management and invoicing features</li>
            <li><strong>Account Management:</strong> To create and maintain your account, authenticate users, and manage subscriptions</li>
            <li><strong>Communication:</strong> To send service-related emails, updates, and support responses</li>
            <li><strong>Improvement:</strong> To analyze usage patterns and improve our service</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            <li><strong>Security:</strong> To detect, prevent, and address fraud and security issues</li>
          </ul>
        </section>

        {/* Legal Basis */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">4. Legal Basis for Processing</h2>
          <p>Under UK GDPR, we process your data based on:</p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Contract Performance:</strong> Processing necessary to provide the service you signed up for</li>
            <li><strong>Legitimate Interests:</strong> Improving our service, security, and fraud prevention</li>
            <li><strong>Legal Obligation:</strong> Compliance with tax, accounting, and other legal requirements</li>
            <li><strong>Consent:</strong> For optional analytics cookies (which you can withdraw anytime)</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">5. Data Retention</h2>
          <p>
            We retain your data only as long as necessary for the purposes outlined in this policy:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
            <li><strong>After Account Deletion:</strong> Most data deleted within 30 days, except where we have legal obligations to retain records (e.g., tax records for 7 years)</li>
            <li><strong>Backups:</strong> Data in backups deleted within 90 days</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">6. Data Sharing and Third Parties</h2>
          <p>We do not sell your data. We only share data with:</p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Service Providers:</strong> Cloud hosting (DigitalOcean), email services, payment processors - all under strict data processing agreements</li>
            <li><strong>Authentication Provider:</strong> Supabase for secure user authentication</li>
            <li><strong>Analytics:</strong> If you consent to optional cookies, anonymized usage data for service improvement</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
          </ul>
          <p className="mt-4">
            All third-party providers are UK GDPR compliant and process data only as instructed by us.
          </p>
        </section>

        {/* Data Security */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">7. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your data:</p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Encryption in transit (HTTPS/SSL) and at rest</li>
            <li>Secure authentication and password hashing</li>
            <li>Regular security updates and monitoring</li>
            <li>Access controls and staff training</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
          <p className="mt-4">
            While we take security seriously, no system is 100% secure. We cannot guarantee absolute security but commit to following industry best practices.
          </p>
        </section>

        {/* Cookies */}
        <section id="cookies" className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">8. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies:</p>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">8.1 Essential Cookies (Always Active)</h3>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Authentication:</strong> To keep you logged in securely</li>
            <li><strong>Security:</strong> To prevent fraud and protect your account</li>
            <li><strong>Functionality:</strong> To remember your preferences and settings</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">8.2 Optional Cookies (Requires Consent)</h3>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Analytics:</strong> To understand how the service is used and improve it</li>
            <li><strong>Performance:</strong> To monitor system performance and optimize speed</li>
          </ul>

          <p className="mt-4">
            You can manage your cookie preferences through your browser settings. Disabling essential cookies may affect service functionality.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">9. Your Rights (UK GDPR)</h2>
          <p>Under UK data protection law, you have the following rights:</p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Right to Object:</strong> Object to certain types of processing</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for optional cookies anytime</li>
            <li><strong>Right to Complain:</strong> Lodge a complaint with the Information Commissioner&apos;s Office (ICO)</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, contact us using the details in Section 12 below. We will respond within 30 days.
          </p>
        </section>

        {/* International Transfers */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">10. International Data Transfers</h2>
          <p>
            Your data is primarily stored in the UK/EU. If data is transferred outside the UK/EEA, we ensure appropriate safeguards are in place (such as Standard Contractual Clauses) to protect your information.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">11. Children&apos;s Privacy</h2>
          <p>
            Clenvora is not intended for users under 18. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">12. Contact & Data Requests</h2>
          <p>
            For privacy questions, data access requests, or to exercise your rights:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Email: Contact form on our website</li>
            <li>In-app: Use the support contact in your dashboard settings</li>
            <li>Delete Account: Available in your account settings</li>
          </ul>
          <p className="mt-4">
            To complain to the UK data protection authority: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:text-emerald-700">Information Commissioner&apos;s Office (ICO)</a>
          </p>
        </section>

        {/* Changes */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">13. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant changes by email or through a notice in the service. Your continued use after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <div className="mt-12 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-900">Summary</p>
          <p className="mt-2 text-sm text-emerald-800">
            We collect only what&apos;s needed to run the service, protect your data with industry-standard security, never sell your information, and respect your UK GDPR rights. You have full control over your data.
          </p>
        </div>

        <p className="mt-12">
          <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
