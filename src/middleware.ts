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

  if (user && isAuthRoute) {
    // Fetch user role to redirect appropriately
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
          const redirectPath = userData.role === 'ADMIN' ? '/admin' : '/dashboard';
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    } catch (error) {
      // If role fetch fails, default to dashboard
      console.error('Failed to fetch user role in middleware:', error);
    }
    
    // Fallback to dashboard if role fetch fails
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if admin is trying to access non-admin routes
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
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
          if (userData.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url));
          }
        }
      }
    } catch (error) {
      // If role fetch fails, allow access
      console.error('Failed to fetch user role for dashboard access:', error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
