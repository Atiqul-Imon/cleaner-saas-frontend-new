import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.clenvora.com';

  return {
    rules: [
      // Public pages - allow all search engines
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/jobs',
          '/clients',
          '/invoices',
          '/settings',
          '/admin',
          '/my-jobs',
          '/onboarding',
          '/api',
        ],
      },
      // Block AI training bots (keep AI crawlers from training on your content)
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'Bytespider'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
