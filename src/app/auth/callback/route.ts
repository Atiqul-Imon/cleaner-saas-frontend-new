import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const baseUrl = new URL(request.url).origin;

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[auth/callback] exchangeCodeForSession error:', error.message);
        return NextResponse.redirect(new URL('/login?error=session_expired', baseUrl));
      }
    } catch {
      return NextResponse.redirect(new URL('/login?error=session_expired', baseUrl));
    }
  }

  return NextResponse.redirect(new URL(next, baseUrl));
}
