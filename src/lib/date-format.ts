import { format } from 'date-fns';

/**
 * British date format: dd/MM/yy (e.g. 02/04/26)
 */
export const DATE_FORMAT = 'dd/MM/yy';

/**
 * British date format with weekday: EEE, dd/MM/yy (e.g. Sat, 02/04/26)
 */
export const DATE_WITH_DAY = 'EEE, dd/MM/yy';

/**
 * British date format with full weekday: EEEE, dd/MM/yy (e.g. Saturday, 02/04/26)
 */
export const DATE_FULL_DAY = 'EEEE, dd/MM/yy';

/**
 * Format a date for display using British dd/MM/yy format
 */
export function formatDate(
  date: Date | string,
  style: 'short' | 'withDay' | 'fullDay' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const fmt = style === 'withDay' ? DATE_WITH_DAY : style === 'fullDay' ? DATE_FULL_DAY : DATE_FORMAT;
  return format(d, fmt);
}
