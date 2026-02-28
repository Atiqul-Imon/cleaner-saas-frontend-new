/**
 * Token Cache Module
 * Caches Supabase access token in memory to avoid repeated IndexedDB calls
 * 
 * Performance Impact: Saves 20-50ms per API call
 * - Before: Every API call -> getSession() -> IndexedDB read (20-50ms)
 * - After: First call -> getSession() -> cache (20-50ms), subsequent calls -> memory (<1ms)
 */

import { createSupabaseBrowserClient } from './supabase/client';

interface TokenCache {
  token: string | null;
  expiresAt: number; // Timestamp in milliseconds
}

// In-memory cache
let cache: TokenCache = {
  token: null,
  expiresAt: 0,
};

/**
 * Get cached access token or fetch fresh one from Supabase
 * Uses 1-minute buffer before expiry to ensure token is always valid
 */
export async function getAccessToken(): Promise<string | null> {
  const now = Date.now();
  const bufferTime = 60 * 1000; // 1 minute buffer
  
  // Return cached token if still valid
  if (cache.token && cache.expiresAt > now + bufferTime) {
    return cache.token;
  }
  
  // Token expired or doesn't exist - fetch from Supabase
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Token cache: Failed to get session:', error);
      clearTokenCache();
      return null;
    }
    
    if (session?.access_token) {
      cache.token = session.access_token;
      // Supabase tokens typically expire in 1 hour
      // Use expires_at from session if available, otherwise default to 1 hour
      cache.expiresAt = session.expires_at 
        ? session.expires_at * 1000 
        : now + (60 * 60 * 1000);
      
      return cache.token;
    }
    
    // No valid session
    clearTokenCache();
    return null;
  } catch (error) {
    console.error('Token cache: Error fetching token:', error);
    clearTokenCache();
    return null;
  }
}

/**
 * Clear cached token
 * Call this when user signs out or token becomes invalid
 */
export function clearTokenCache(): void {
  cache.token = null;
  cache.expiresAt = 0;
}

/**
 * Check if token is cached and valid
 * Useful for debugging
 */
export function hasValidCachedToken(): boolean {
  const now = Date.now();
  const bufferTime = 60 * 1000;
  return cache.token !== null && cache.expiresAt > now + bufferTime;
}

/**
 * Get cache stats for monitoring
 */
export function getCacheInfo() {
  const now = Date.now();
  return {
    hasToken: cache.token !== null,
    isValid: cache.expiresAt > now,
    expiresIn: cache.expiresAt > now ? Math.floor((cache.expiresAt - now) / 1000) : 0,
  };
}
