/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  id,
  ...props
}) => {
  const clampedValue = Math.min(Math.max(0, value), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div id={id} className={cn('w-full flex flex-col gap-1.5', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-text-sub">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={cn('w-full bg-[var(--border)] rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            colors[variant]
          )}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default Progress;
