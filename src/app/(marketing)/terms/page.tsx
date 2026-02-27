import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service – Clenvora',
  description: 'Terms and conditions for using Clenvora cleaning business management software',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-zinc-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-600">Last updated: 21 February 2026</p>
        <p className="mt-4 text-base text-zinc-700">
          These Terms of Service (&quot;Terms&quot;) govern your use of Clenvora. By accessing or using our service, you agree to be bound by these Terms.
        </p>

        {/* Acceptance */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">1. Acceptance of Terms</h2>
          <p>
            By creating an account, accessing, or using Clenvora (&quot;the Service&quot;), you agree to these Terms, our <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">Privacy Policy</Link>, and all applicable laws. If you do not agree, you must not use the Service.
          </p>
          <p className="mt-4">
            You must be at least 18 years old and have the legal capacity to enter into contracts to use Clenvora.
          </p>
        </section>

        {/* Service Description */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">2. Service Description</h2>
          <p>
            Clenvora provides job management, invoicing, and client management software designed for UK cleaning businesses. The Service includes:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Job scheduling and tracking</li>
            <li>Client database management</li>
            <li>Invoice generation and payment tracking</li>
            <li>Photo uploads for before/after documentation</li>
            <li>Team management features</li>
            <li>Mobile and web access</li>
          </ul>
          <p className="mt-4">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
          </p>
        </section>

        {/* Account Registration */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">3. Account Registration and Security</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">3.1 Account Creation</h3>
          <p>
            You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">3.2 Account Security</h3>
          <p>
            You are solely responsible for all activity under your account. You must:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Use a strong, unique password</li>
            <li>Not share your account credentials with others</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Log out from shared devices</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">3.3 Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.
          </p>
        </section>

        {/* Subscription Plans */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">4. Subscription Plans and Payment</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">4.1 Plan Types</h3>
          <p>
            Clenvora offers multiple subscription plans:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li><strong>Solo (Free):</strong> 1 staff member, 20 jobs/month</li>
            <li><strong>Team (£14.99/month):</strong> Up to 20 staff, unlimited jobs</li>
            <li><strong>Business (£99.99/month):</strong> Unlimited staff, unlimited jobs</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">4.2 Free Trial</h3>
          <p>
            New Team and Business plan subscribers receive a 1-month free trial. Your subscription begins automatically after the trial unless you cancel.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">4.3 Payment</h3>
          <p>
            Paid plans are billed monthly in advance. By subscribing, you authorize us to charge your payment method. All prices are in British Pounds (GBP) and exclude VAT where applicable.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">4.4 Cancellation & Refunds</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. We do not provide refunds for partial months, except where required by law.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">4.5 Price Changes</h3>
          <p>
            We may change subscription prices with 30 days&apos; notice. Continued use after the notice period constitutes acceptance of the new prices.
          </p>
        </section>

        {/* Acceptable Use */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">5. Acceptable Use Policy</h2>
          <p>
            You agree to use Clenvora only for lawful purposes. You must not:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the Service to spam, harass, or harm others</li>
            <li>Resell or redistribute the Service without permission</li>
            <li>Reverse engineer or copy our software</li>
            <li>Create fake accounts or impersonate others</li>
            <li>Scrape or harvest data from the Service</li>
          </ul>
        </section>

        {/* Data and Content */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">6. Your Data and Content</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">6.1 Your Ownership</h3>
          <p>
            You retain all rights to the data and content you enter into Clenvora (client information, job data, photos, etc.). You grant us a license to process this data solely to provide the Service.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">6.2 Your Responsibility</h3>
          <p>
            You are responsible for:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>The accuracy and legality of data you enter</li>
            <li>Obtaining necessary consents from your clients</li>
            <li>Complying with data protection laws (UK GDPR)</li>
            <li>Maintaining backups of important data</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">6.3 Data Backup</h3>
          <p>
            While we perform regular backups, you are responsible for maintaining your own copies of critical data. We are not liable for data loss.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">7. Intellectual Property</h2>
          <p>
            Clenvora and all related software, designs, logos, and content are owned by us or our licensors. You receive a limited, non-exclusive, non-transferable license to use the Service. You may not copy, modify, or create derivative works from our intellectual property.
          </p>
        </section>

        {/* Privacy */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">8. Privacy and Data Protection</h2>
          <p>
            Our use of your personal data is governed by our <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">Privacy Policy</Link>, which forms part of these Terms. We comply with UK GDPR and Data Protection Act 2018.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">9. Disclaimers and Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Uninterrupted or error-free operation</li>
            <li>That the Service will meet all your requirements</li>
            <li>That all bugs will be corrected</li>
            <li>The accuracy or completeness of content</li>
          </ul>
          <p className="mt-4">
            We strive to provide a reliable service but cannot guarantee 100% uptime. We are not responsible for third-party services (internet providers, device manufacturers) that may affect your access.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLENVORA SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Service interruptions or data loss</li>
            <li>Third-party actions or content</li>
          </ul>
          <p className="mt-4">
            Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim, or £100, whichever is greater.
          </p>
          <p className="mt-4">
            Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded by UK law.
          </p>
        </section>

        {/* Indemnification */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Clenvora from any claims, damages, or expenses arising from:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Your violation of these Terms</li>
            <li>Your violation of any law or third-party rights</li>
            <li>Your use or misuse of the Service</li>
            <li>Content you upload or share</li>
          </ul>
        </section>

        {/* Termination */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">12. Termination</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">12.1 By You</h3>
          <p>
            You may terminate your account at any time through your account settings or by contacting us.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">12.2 By Us</h3>
          <p>
            We may suspend or terminate your account if you:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Breach these Terms</li>
            <li>Fail to pay subscription fees</li>
            <li>Engage in fraudulent or illegal activity</li>
            <li>Pose a security risk</li>
          </ul>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">12.3 Effect of Termination</h3>
          <p>
            Upon termination, your access to the Service ends immediately. You may request a data export within 30 days. After 30 days, your data will be deleted in accordance with our Privacy Policy.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">13. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes by email or through a notice in the Service at least 30 days before they take effect. Your continued use after the notice period constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">14. Governing Law and Disputes</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
          <p className="mt-4">
            We encourage resolving disputes informally by contacting us first. If informal resolution fails, disputes may be subject to binding arbitration or court proceedings in accordance with UK law.
          </p>
        </section>

        {/* Miscellaneous */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">15. General Provisions</h2>
          
          <h3 className="text-lg font-semibold text-zinc-900 mt-6">15.1 Entire Agreement</h3>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Clenvora.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">15.2 Severability</h3>
          <p>
            If any provision is found unenforceable, the remaining provisions remain in full effect.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">15.3 No Waiver</h3>
          <p>
            Our failure to enforce any right does not waive that right.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">15.4 Assignment</h3>
          <p>
            You may not transfer your rights under these Terms. We may assign our rights to any successor or affiliate.
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6">15.5 Force Majeure</h3>
          <p>
            We are not liable for delays or failures caused by events beyond our reasonable control.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10 space-y-4 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">16. Contact Us</h2>
          <p>
            For questions about these Terms:
          </p>
          <ul className="list-inside list-disc space-y-2 ml-4">
            <li>Email: Contact form on our website</li>
            <li>In-app: Support section in your dashboard</li>
          </ul>
        </section>

        <div className="mt-12 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-900">Summary</p>
          <p className="mt-2 text-sm text-emerald-800">
            Use Clenvora lawfully and responsibly. You own your data. We provide the service &quot;as is&quot; with reasonable care. Cancel anytime. These terms protect both parties and comply with UK law.
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
