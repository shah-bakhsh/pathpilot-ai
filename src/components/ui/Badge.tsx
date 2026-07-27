/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'neutral' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = 'primary',
  id,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 text-[10.5px] font-bold rounded-badge border transition-all select-none uppercase tracking-wider';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/15',
    secondary: 'bg-[var(--surface-secondary)] text-text-main border-[var(--border)]',
    success: 'bg-success/10 text-success border-success/20 dark:bg-success/15',
    warning: 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/15',
    error: 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/15',
    danger: 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/15',
    neutral: 'bg-[var(--surface-secondary)] text-text-sub border-[var(--border)]',
    info: 'bg-info/10 text-info border-info/20 dark:bg-info/15',
    outline: 'bg-transparent text-foreground border-border/60',
  };

  return (
    <span
      id={id}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
