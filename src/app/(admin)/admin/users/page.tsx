'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Users, Building2, Briefcase, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  business?: {
    id: string;
    name: string;
  };
  _count: {
    assignedJobs: number;
  };
}

export default function AdminUsersPage() {
  const { isAdmin, isLoading: roleLoading } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', currentPage],
    queryFn: () =>
      api.get<{ users: User[]; pagination: { page: number; totalPages: number; total: number } }>(
        `/admin/users?page=${currentPage}&limit=20`
      ),
    enabled: isAdmin,
  });

  if (roleLoading || usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const users = usersQuery.data?.users ?? [];
  const pagination = usersQuery.data?.pagination;

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !user.email.toLowerCase().includes(query) &&
        !user.business?.name.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  const roleCounts = {
    all: users.length,
    OWNER: users.filter((u) => u.role === 'OWNER').length,
    CLEANER: users.filter((u) => u.role === 'CLEANER').length,
    ADMIN: users.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Users</h1>
          <p className="mt-1 text-sm text-zinc-600">Manage all platform users</p>
        </div>
        <div className="text-sm text-zinc-600">
          Total: <span className="font-semibold text-zinc-900">{pagination?.total ?? 0}</span>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by email or business name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'OWNER', 'CLEANER', 'ADMIN'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {role === 'all' ? 'All' : role} ({roleCounts[role]})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filteredUsers.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Users className="mb-4 h-16 w-16 text-zinc-400" />
            <p className="text-lg font-medium text-zinc-600">
              {searchQuery || roleFilter !== 'all' ? 'No users found' : 'No users registered yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6 transition-colors hover:bg-zinc-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg ${
                      user.role === 'ADMIN'
                        ? 'bg-violet-600'
                        : user.role === 'OWNER'
                          ? 'bg-blue-600'
                          : 'bg-emerald-600'
                    }`}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-bold text-zinc-900">{user.email}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-violet-100 text-violet-700'
                            : user.role === 'OWNER'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {user.business && (
                        <p className="flex items-center gap-2 text-sm text-zinc-600">
                          <Building2 className="h-4 w-4" />
                          {user.business.name}
                        </p>
                      )}
                      <p className="flex items-center gap-2 text-sm text-zinc-600">
                        <Briefcase className="h-4 w-4" />
                        {user._count.assignedJobs} assigned jobs
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-zinc-500">
                    Joined{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
