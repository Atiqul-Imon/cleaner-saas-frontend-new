import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Cleaning Business Tips & Guides | Clenvora',
  description: 'Expert advice, tips, and guides for UK cleaning businesses. Learn how to manage your cleaning jobs, grow your business, and work more efficiently.',
  keywords: 'cleaning business blog, cleaning tips UK, cleaning business advice, cleaner resources, cleaning business management',
  openGraph: {
    title: 'Blog - Cleaning Business Tips & Guides | Clenvora',
    description: 'Expert advice, tips, and guides for UK cleaning businesses.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.clenvora.com/blog',
  },
};

const blogArticles = [
  {
    slug: 'manage-cleaning-jobs-uk',
    title: 'How to Manage Your Cleaning Jobs Effectively in the UK',
    excerpt: 'Discover practical strategies and digital tools to streamline your cleaning business operations, from scheduling to invoicing and client communication.',
    date: '2026-02-28',
    category: 'Business Management',
    readTime: '8 min read',
    featured: true,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Resources for UK Cleaners
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
              Cleaning Business Blog
            </h1>
            <p className="text-lg text-zinc-600">
              Expert advice, practical tips, and insights to help you run your cleaning business more efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <article
              key={article.slug}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-xl"
            >
              {article.featured && (
                <div className="absolute right-4 top-4 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                </div>
              )}

              <Link href={`/blog/${article.slug}`} className="block">
                {/* Category Badge */}
                <div className="border-b border-zinc-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-8">
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="mb-3 text-xl font-bold text-zinc-900 transition-colors group-hover:text-emerald-600">
                    {article.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 text-sm text-zinc-600">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="mb-4 flex items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(article.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-3">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900">
              More Articles Coming Soon
            </h3>
            <p className="text-sm text-zinc-600">
              We&apos;re working on more helpful guides and tips for UK cleaning businesses. Check back soon for new content!
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center md:p-12">
          <h3 className="mb-3 text-2xl font-bold text-zinc-900">
            Ready to Streamline Your Cleaning Business?
          </h3>
          <p className="mb-6 text-zinc-700">
            Join hundreds of UK cleaners who manage their jobs, clients, and invoices with Clenvora.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Clenvora Blog',
            description: 'Expert advice and tips for UK cleaning businesses',
            url: 'https://www.clenvora.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Clenvora',
              url: 'https://www.clenvora.com',
            },
            blogPost: blogArticles.map(article => ({
              '@type': 'BlogPosting',
              headline: article.title,
              description: article.excerpt,
              datePublished: article.date,
              url: `https://www.clenvora.com/blog/${article.slug}`,
              author: {
                '@type': 'Organization',
                name: 'Clenvora',
              },
            })),
          }),
        }}
      />
    </div>
  );
}
