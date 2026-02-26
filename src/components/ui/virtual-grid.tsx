'use client';

import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const DEFAULT_ROW_HEIGHT = 120;
const MIN_ITEMS_TO_VIRTUALIZE = 50;
const DEFAULT_COLUMNS = 3;
const SCROLL_CONTAINER_MAX_HEIGHT = '70vh';

export interface VirtualGridProps<T> {
  items: T[];
  columns?: number;
  estimateRowHeight?: number;
  minItemsToVirtualize?: number;
  renderItem: (item: T) => React.ReactNode;
  /** Key for each item; default uses (item as any).id or index */
  getItemKey?: (item: T, index: number) => string | number;
  /** Grid gap class, e.g. "gap-2 sm:gap-4" */
  gapClassName?: string;
  /** Grid columns class, e.g. "sm:grid-cols-2 lg:grid-cols-3" */
  gridClassName?: string;
}

/**
 * Renders a grid of items. When items.length >= minItemsToVirtualize,
 * uses a virtualized list so only visible rows are in the DOM.
 */
function defaultGetKey<T>(item: T, index: number): string | number {
  const anyItem = item as { id?: string };
  return anyItem?.id ?? index;
}

export function VirtualGrid<T>({
  items,
  columns = DEFAULT_COLUMNS,
  estimateRowHeight = DEFAULT_ROW_HEIGHT,
  minItemsToVirtualize = MIN_ITEMS_TO_VIRTUALIZE,
  renderItem,
  getItemKey = defaultGetKey,
  gapClassName = 'gap-2 sm:gap-4',
  gridClassName = 'sm:grid-cols-2 lg:grid-cols-3',
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const useVirtual = items.length >= minItemsToVirtualize;
  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: useCallback(() => parentRef.current, []),
    estimateSize: () => estimateRowHeight,
    overscan: 2,
  });

  if (!useVirtual) {
    return (
      <div className={`grid ${gapClassName} ${gridClassName}`}>
        {items.map((item, i) => (
          <div key={getItemKey(item, i)}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="overflow-auto pr-1"
      style={{ maxHeight: SCROLL_CONTAINER_MAX_HEIGHT }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const start = virtualRow.index * columns;
          const rowItems = items.slice(start, start + columns);
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={`grid ${gapClassName} ${gridClassName}`}
            >
              {rowItems.map((item, i) => (
                <div key={getItemKey(item, start + i)}>{renderItem(item)}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
