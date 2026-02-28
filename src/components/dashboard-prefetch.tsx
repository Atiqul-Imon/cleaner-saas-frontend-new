'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * PHASE 3 OPTIMIZATION: Dashboard Prefetch Component
 * 
 * Prefetches critical data on dashboard mount to improve perceived performance.
 * This component loads data in the background so it's ready when users navigate.
 * 
 * Benefits:
 * - Instant page loads when navigating (data already cached)
 * - Reduced perceived latency
 * - Better user experience
 */
export function DashboardPrefetch() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch jobs list (most commonly viewed page)
    const jobParams = new URLSearchParams();
    jobParams.set('page', '1');
    jobParams.set('limit', '10');
    queryClient.prefetchQuery({
      queryKey: ['jobs', undefined, 1],
      queryFn: () => api.get(`/jobs?${jobParams}`),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Prefetch clients list
    const clientParams = new URLSearchParams();
    clientParams.set('page', '1');
    clientParams.set('limit', '10');
    queryClient.prefetchQuery({
      queryKey: ['clients', 1],
      queryFn: () => api.get(`/clients?${clientParams}`),
      staleTime: 3 * 60 * 1000, // 3 minutes
    });

    // Prefetch subscription data (used in settings and header)
    queryClient.prefetchQuery({
      queryKey: ['subscription'],
      queryFn: () => api.get('/subscriptions'),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Prefetch business data
    queryClient.prefetchQuery({
      queryKey: ['business', 'settings'],
      queryFn: () => api.get('/business'),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }, [queryClient]);

  // This component doesn't render anything
  return null;
}
