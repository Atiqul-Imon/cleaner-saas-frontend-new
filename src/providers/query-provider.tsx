'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
            gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
            refetchOnWindowFocus: false,
            retry: 1,
            // Only refetch if data is stale (respects staleTime)
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
