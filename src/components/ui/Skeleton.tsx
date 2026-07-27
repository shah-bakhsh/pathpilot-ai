/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}) => {
  const baseStyles = 'animate-skeleton bg-[var(--surface-secondary)] relative overflow-hidden';

  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-lg w-full',
    card: 'rounded-card w-full h-48 border border-[var(--border)]/40',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-5 rounded-card border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4 shadow-sm', className)}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-1/3 h-5" />
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <Skeleton variant="text" className="w-full h-4" />
    <Skeleton variant="text" className="w-4/5 h-4" />
    <div className="flex items-center gap-2 pt-2">
      <Skeleton variant="text" className="w-16 h-6 rounded-full" />
      <Skeleton variant="text" className="w-20 h-6 rounded-full" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 4,
  cols = 4,
  className,
}) => (
  <div className={cn('w-full border border-[var(--border)] rounded-card overflow-hidden bg-[var(--surface)]', className)}>
    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-secondary)]/40 flex items-center gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="h-4 flex-1" />
      ))}
    </div>
    <div className="divide-y divide-[var(--border)]/60">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" className={cn('h-4 flex-1', c === 0 ? 'w-1/4' : '')} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-6 w-full animate-fade-in">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="w-64 h-8" />
        <Skeleton variant="text" className="w-48 h-4" />
      </div>
      <Skeleton variant="text" className="w-36 h-10 rounded-btn" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TableSkeleton rows={5} cols={4} />
      </div>
      <div>
        <CardSkeleton className="h-80" />
      </div>
    </div>
  </div>
);

export default Skeleton;
