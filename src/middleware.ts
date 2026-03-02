import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const isAuthRoute =
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register') ||
      request.nextUrl.pathname === '/';
    
    const isPublicContent =
      request.nextUrl.pathname.startsWith('/blog') ||
      request.nextUrl.pathname === '/about' ||
      request.nextUrl.pathname === '/privacy' ||
      request.nextUrl.pathname === '/terms' ||
      request.nextUrl.pathname === '/sitemap.xml' ||
      request.nextUrl.pathname === '/robots.txt';
    
    if (!isAuthRoute && !isPublicContent) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password') ||
    request.nextUrl.pathname === '/';

  // SEO and public routes
  const isSEORoute =
    request.nextUrl.pathname === '/sitemap.xml' ||
    request.nextUrl.pathname === '/robots.txt';

  const isPublicRoute =
    isAuthRoute ||
    isSEORoute ||
    request.nextUrl.pathname === '/auth/callback' ||
    request.nextUrl.pathname.startsWith('/accept-invite') ||
    request.nextUrl.pathname.startsWith('/blog') ||
    request.nextUrl.pathname === '/about' ||
    request.nextUrl.pathname === '/privacy' ||
    request.nextUrl.pathname === '/terms';

  // OPTIMIZED: Single API call for user role with cookie caching
  if (user) {
    let userRole: string | null = request.cookies.get('user_role')?.value || null;
    
    // Fetch role if not cached or for auth routes (to ensure fresh data on login)
    if (!userRole || isAuthRoute) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          const userResponse = await fetch(`${backendUrl}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userRole = userData.role;
            
            // Cache role in cookie (1 hour expiry) - only if not null
            if (userRole) {
              response.cookies.set('user_role', userRole, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60, // 1 hour
                path: '/',
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user role in middleware:', error);
      }
    }
    
    // Handle redirects based on cached or fetched role
    if (isAuthRoute) {
      const redirectPath =
        userRole === 'ADMIN'
          ? '/admin'
          : userRole === 'CLEANER'
            ? '/my-jobs'
            : '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Redirect admins trying to access /dashboard to /admin
    if (userRole === 'ADMIN' && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Redirect cleaners from /onboarding to /my-jobs (cleaners don't need business setup)
    if (userRole === 'CLEANER' && request.nextUrl.pathname === '/onboarding') {
      return NextResponse.redirect(new URL('/my-jobs', request.url));
    }
  }

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
