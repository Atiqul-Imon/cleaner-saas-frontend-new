/**
 * PHASE 3 OPTIMIZATION: Enhanced Skeleton Loaders
 * 
 * Better visual loading states that match actual content structure.
 * Provides a more polished UX during data fetching.
 */

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 sm:p-4">
      <div className="space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-zinc-200" />
    </div>
  );
}

export function JobsListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ClientCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 sm:p-4">
      <div className="space-y-2">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-3 w-32 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export function ClientsListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <ClientCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-zinc-200">
      <td className="px-4 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200" />
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      <table className="w-full">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-300" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-300" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-300" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-300" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="size-12 animate-pulse rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
