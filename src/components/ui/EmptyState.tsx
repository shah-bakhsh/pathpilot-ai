/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'outline';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  actionText,
  onAction,
  actionVariant = 'primary',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-card',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-base text-text-main tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-text-mute max-w-sm leading-relaxed mb-5">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant={actionVariant} size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
