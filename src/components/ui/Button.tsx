/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ButtonHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'icon' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface RippleItem {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      id,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<RippleItem[]>([]);

    const baseStyles = cn(
      'relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-250 rounded-btn cursor-pointer outline-none select-none',
      'hover:scale-[1.01] active:scale-[0.98]',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-40 disabled:pointer-events-none disabled:scale-100 disabled:hover:scale-100'
    );
    
    const variants = {
      primary: 'bg-primary text-black hover:bg-primary-hover border border-transparent shadow-sm hover:shadow-md font-bold',
      default: 'bg-primary text-black hover:bg-primary-hover border border-transparent shadow-sm hover:shadow-md font-bold',
      accent: 'bg-primary text-black hover:bg-primary-hover border border-transparent shadow-sm hover:shadow-md font-bold',
      secondary: 'bg-[var(--surface-secondary)] text-text-main border border-transparent hover:bg-[var(--hover-tint)] hover:shadow-sm',
      outline: 'bg-transparent text-text-main border border-[var(--border)] hover:bg-[var(--hover-tint)]',
      ghost: 'bg-transparent text-text-sub hover:bg-[var(--hover-tint)] hover:text-text-main border border-transparent',
      danger: 'bg-danger text-white hover:brightness-95 border border-transparent shadow-sm',
      success: 'bg-success text-white hover:brightness-95 border border-transparent shadow-sm',
      warning: 'bg-warning text-white hover:brightness-95 border border-transparent shadow-sm',
      icon: 'bg-transparent text-text-sub hover:text-text-main hover:bg-[var(--hover-tint)] border border-transparent p-2 rounded-full aspect-square',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 h-8',
      md: 'px-4 py-2 text-sm gap-2 h-10',
      lg: 'px-6 py-3 text-base gap-2.5 h-12',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const sizeVal = Math.max(rect.width, rect.height);
      const xVal = e.clientX - rect.left - sizeVal / 2;
      const yVal = e.clientY - rect.top - sizeVal / 2;

      const newRipple: RippleItem = {
        x: xVal,
        y: yVal,
        size: sizeVal,
        id: Date.now() + Math.random(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      if (onClick) {
        onClick(e);
      }
    };

    const buttonSizeStyle = variant === 'icon' ? '' : sizes[size];

    return (
      <button
        ref={ref}
        type={type}
        id={id}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(
          baseStyles,
          variants[variant],
          buttonSizeStyle,
          fullWidth && 'w-full',
          className
        )}
        aria-busy={isLoading}
        {...props}
      >
        {/* Render Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-current opacity-15 rounded-full pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

        {isLoading && <Spinner size="sm" className="text-current shrink-0 animate-spin mr-1" />}
        {!isLoading && leftIcon && <span className="flex shrink-0">{leftIcon}</span>}
        {children && <span className="truncate relative z-10">{children}</span>}
        {!isLoading && rightIcon && <span className="flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
