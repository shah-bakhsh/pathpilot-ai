/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'analytics' | 'glass' | 'interactive' | 'gradient' | 'aiInsight' | 'statistic' | 'dashboard' | 'hoverCard';
  hoverElevation?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', hoverElevation = false, id, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm',
      outline: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm',
      analytics: 'bg-[var(--surface)] border border-[var(--border)] shadow-md p-1',
      glass: 'glass-panel shadow-glass',
      interactive: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-primary/40 hover:shadow-hover hover:-translate-y-0.5 cursor-pointer',
      gradient: 'bg-linear-to-br from-[var(--surface)] via-[var(--surface)] to-primary/5 border border-[var(--border)] shadow-sm',
      aiInsight: 'bg-linear-to-r from-primary/10 via-accent/3 to-transparent border-l-4 border-l-primary border border-y-[var(--border)] border-r-[var(--border)] shadow-inner',
      statistic: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm text-center flex flex-col items-center justify-center py-6',
      dashboard: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm rounded-card overflow-hidden',
      hoverCard: 'bg-[var(--surface)] border border-[var(--border)] shadow-sm hover-lift',
    };

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          'rounded-card overflow-hidden transition-all duration-300',
          variantStyles[variant],
          hoverElevation && variant !== 'interactive' && variant !== 'hoverCard' && 'hover:shadow-hover hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-5 border-b border-[var(--border)]/70 flex flex-col gap-1.5', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display font-bold text-lg text-text-main tracking-tight leading-snug flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-text-sub font-normal leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 text-sm leading-relaxed text-text-sub', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 py-4 bg-[var(--surface-secondary)]/50 border-t border-[var(--border)]/70 flex items-center justify-end gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;
