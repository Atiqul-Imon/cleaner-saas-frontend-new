import { cn } from '@/lib/utils';

interface InlineMessageProps {
  type: 'success' | 'error';
  children: React.ReactNode;
  className?: string;
}

export function InlineMessage({ type, children, className }: InlineMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4 text-sm',
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700',
        className
      )}
    >
      {children}
    </div>
  );
}
