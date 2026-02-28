'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserRole } from '@/types/api';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export function useUser() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: () => api.get<User>('/auth/me', { silent: true }),
    retry: false,
    // OPTIMIZED: User data rarely changes - cache for 30 minutes
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,     // Keep in memory for 1 hour
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isOwner: query.data?.role === 'OWNER',
    isCleaner: query.data?.role === 'CLEANER',
    isAdmin: query.data?.role === 'ADMIN',
    refetch: query.refetch,
  };
}
