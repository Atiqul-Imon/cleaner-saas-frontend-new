import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.clenvora.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/register',
          '/login',
          '/about',
          '/terms',
          '/privacy',
          '/blog',
        ],
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
