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
    staleTime: 5 * 60 * 1000,
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
