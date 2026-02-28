'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // OPTIMIZED: Shorter staleTime for dynamic data (2 minutes)
            staleTime: 2 * 60 * 1000,
            
            // Keep in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            
            // Don't refetch on window focus (user-controlled refresh)
            refetchOnWindowFocus: false,
            
            // OPTIMIZED: Only refetch on mount if explicitly requested
            refetchOnMount: false,
            
            // OPTIMIZED: DO refetch after network reconnection (user came back online)
            refetchOnReconnect: true,
            
            // Retry failed requests once
            retry: 1,
          },
        },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
