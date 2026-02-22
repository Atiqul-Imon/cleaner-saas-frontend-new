'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { JobChecklistItem } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface JobChecklistProps {
  jobId: string;
  checklist: JobChecklistItem[];
  onUpdate: () => void;
  onError: (error: string) => void;
}

export function JobChecklist({ jobId, checklist, onUpdate, onError }: JobChecklistProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    setUpdating(itemId);
    try {
      await api.put(`/jobs/${jobId}/checklist/${itemId}`, { completed: !currentStatus });
      onUpdate();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">Checklist</h3>
        <span className="text-sm text-zinc-600">{completedCount} of {totalCount}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-2">
        {checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id, item.completed)}
            disabled={!!updating}
            className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-left transition-colors hover:bg-zinc-50 disabled:opacity-50"
          >
            <div
              className={`flex size-6 shrink-0 items-center justify-center rounded border-2 ${
                item.completed ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300'
              }`}
            >
              {item.completed && (
                <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`flex-1 text-sm font-medium ${
                item.completed ? 'text-zinc-500 line-through' : 'text-zinc-900'
              }`}
            >
              {item.itemText}
            </span>
            {updating === item.id && <Loader2 className="size-4 animate-spin text-zinc-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}
