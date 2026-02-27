import type { Metadata } from 'next';
import { Roboto, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { AlertDialogProvider } from '@/components/alert-dialog-provider';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.clenvora.com'),
  title: {
    default: 'Clenvora – Job & Invoice Management App for UK Cleaners',
    template: '%s | Clenvora',
  },
  description: 'Free job management app for UK cleaners. Track cleaning jobs, send invoices, manage clients, and get paid faster. Built for self-employed cleaners and small cleaning teams. Works on your phone alongside WhatsApp.',
  keywords: [
    // Primary keywords
    'cleaning business app UK',
    'cleaner job management',
    'cleaning invoice app',
    'job tracker for cleaners',
    'cleaning business software',
    
    // Location-based
    'UK cleaning app',
    'cleaning software UK',
    'cleaner app Britain',
    
    // Problem-solving keywords
    'track cleaning jobs',
    'manage cleaning clients',
    'cleaning invoice maker',
    'payment tracker cleaners',
    'schedule cleaning jobs',
    
    // Specific use cases
    'self employed cleaner app',
    'domestic cleaner software',
    'commercial cleaning management',
    'cleaning team management',
    'mobile app for cleaners',
    
    // Competitor/alternative keywords
    'free cleaning business app',
    'simple cleaner software',
    'cleaning job organiser',
    'cleaner diary app',
    'cleaning work tracker',
  ],
  authors: [{ name: 'Clenvora' }],
  creator: 'Clenvora',
  publisher: 'Clenvora',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.clenvora.com',
    siteName: 'Clenvora',
    title: 'Clenvora – Job & Invoice Management App for UK Cleaners',
    description: 'Free job management app for UK cleaners. Track cleaning jobs, send invoices, and manage clients from your phone. No paperwork. No missed jobs.',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Clenvora - Cleaning Business Management App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clenvora – Job & Invoice Management App for UK Cleaners',
    description: 'Free job management app for UK cleaners. Track jobs, send invoices, manage clients from your phone.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0F766E',
  category: 'Business',
  alternates: {
    canonical: 'https://www.clenvora.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${roboto.variable} ${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AlertDialogProvider>
            {children}
            <CookieConsentBanner />
          </AlertDialogProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
