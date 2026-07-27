/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div className={cn('fixed inset-y-0 flex max-w-full', position === 'right' ? 'right-0' : 'left-0')}>
        <div
          className={cn(
            'w-screen bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col justify-between overflow-hidden animate-slide',
            sizes[size]
          )}
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
            <div>
              {title && <h3 className="font-display font-bold text-base text-text-main leading-tight">{title}</h3>}
              {description && <p className="text-xs text-text-mute mt-0.5">{description}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-full text-text-mute hover:text-text-main"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
