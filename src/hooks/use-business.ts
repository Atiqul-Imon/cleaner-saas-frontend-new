'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Business {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
}

export function useBusiness() {
  const query = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      try {
        const data = await api.get<Business>('/business', { silent: true });
        return data ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  return {
    business: query.data,
    isLoading: query.isLoading,
    hasBusiness: !!query.data,
    refetch: query.refetch,
  };
}
