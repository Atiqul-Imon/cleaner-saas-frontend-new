/**
 * Token Cache Module
 * Caches Supabase access token in memory to avoid repeated IndexedDB calls
 *
 * Single-flight: Only one getSession() runs at a time to avoid Supabase's
 * Navigator LockManager timeout when many API calls fire concurrently.
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

// Single-flight: avoid multiple concurrent getSession() calls (prevents LockManager timeout)
let fetchPromise: Promise<string | null> | null = null;

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

  // If a fetch is already in progress, wait for it instead of starting another
  if (fetchPromise) {
    return fetchPromise;
  }

  // Token expired or doesn't exist - fetch from Supabase (single flight)
  fetchPromise = (async () => {
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
        cache.expiresAt = session.expires_at
          ? session.expires_at * 1000
          : Date.now() + 60 * 60 * 1000;
        return cache.token;
      }

      clearTokenCache();
      return null;
    } catch (error) {
      console.error('Token cache: Error fetching token:', error);
      clearTokenCache();
      return null;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Clear cached token
 * Call this when user signs out or token becomes invalid
 */
export function clearTokenCache(): void {
  cache.token = null;
  cache.expiresAt = 0;
  fetchPromise = null; // Allow fresh fetch on next getAccessToken
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
