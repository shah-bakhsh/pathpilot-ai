/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';
import { cn } from '../../lib/utils';
import { Search as SearchIcon, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

// 1. TEXT / PASSWORD / SEARCH / DATE / STANDARD INPUT
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, success, helperText, leftIcon, rightIcon, isLoading, disabled, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full select-none text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-text-sub tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {/* Search or Left Icon */}
          {isSearch && !leftIcon && (
            <div className="absolute left-3.5 text-text-mute flex items-center pointer-events-none select-none">
              <SearchIcon className="w-4 h-4" />
            </div>
          )}
          {!isSearch && leftIcon && (
            <div className="absolute left-3.5 text-text-mute flex items-center pointer-events-none select-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={actualType}
            id={inputId}
            disabled={disabled || isLoading}
            className={cn(
              'w-full bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] px-3.5 py-2 h-10 transition-all duration-200 outline-none placeholder:text-text-mute/60',
              'focus:border-primary focus:ring-2 focus:ring-primary/10',
              'disabled:opacity-50 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed',
              (isSearch || leftIcon) && 'pl-10',
              (isPassword || rightIcon || isLoading || success || error) && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger/10',
              success && 'border-success focus:border-success focus:ring-success/10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Right Accessories (Loading Spinner, Eye Toggle, Success/Error indicator, or Custom RightIcon) */}
          <div className="absolute right-3.5 flex items-center gap-1.5 select-none">
            {isLoading && <Loader2 className="w-4 h-4 text-text-mute animate-spin" />}
            {!isLoading && error && <X className="w-4 h-4 text-danger" />}
            {!isLoading && success && !error && <Check className="w-4 h-4 text-success" />}
            {!isLoading && isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-sub hover:text-text-main focus:outline-none p-1 cursor-pointer rounded"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {!isLoading && !isPassword && !error && !success && rightIcon && (
              <div className="text-text-mute flex items-center pointer-events-none">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-[11px] font-medium text-danger flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : success ? (
          <p className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
            {success}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-[11px] text-text-mute mt-0.5 leading-relaxed">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

// 2. TEXTAREA SYSTEM
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  isLoading?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, success, helperText, isLoading, disabled, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full select-none text-left">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-text-sub tracking-tight">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            disabled={disabled || isLoading}
            className={cn(
              'w-full bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] px-3.5 py-2.5 transition-all duration-200 outline-none placeholder:text-text-mute/60 resize-y min-h-[80px]',
              'focus:border-primary focus:ring-2 focus:ring-primary/10',
              'disabled:opacity-50 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed',
              error && 'border-danger focus:border-danger focus:ring-danger/10',
              success && 'border-success focus:border-success focus:ring-success/10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3.5 top-3.5">
              <Loader2 className="w-4 h-4 text-text-mute animate-spin" />
            </div>
          )}
        </div>

        {error ? (
          <p id={`${textareaId}-error`} className="text-[11px] font-medium text-danger flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : success ? (
          <p className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
            {success}
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="text-[11px] text-text-mute mt-0.5 leading-relaxed">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// 3. CHECKBOX COMPONENT
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1 select-none text-left">
        <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-text-main font-semibold">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'w-4.5 h-4.5 rounded border border-[var(--border)] text-primary bg-[var(--surface)]',
              'focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer',
              'accent-primary',
              className
            )}
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <p className="text-[10px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// 4. RADIO COMPONENT
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1 select-none text-left">
        <label htmlFor={radioId} className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-text-main font-semibold">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={cn(
              'w-4.5 h-4.5 rounded-full border border-[var(--border)] text-primary bg-[var(--surface)]',
              'focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer',
              'accent-primary',
              className
            )}
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <p className="text-[10px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// 5. MODERN TOGGLE/SWITCH SYSTEM
export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, error, id, checked, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1 select-none text-left">
        <label htmlFor={toggleId} className="inline-flex items-center justify-between gap-4 cursor-pointer text-sm text-text-main font-semibold">
          {label && <span>{label}</span>}
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={toggleId}
              checked={checked}
              className="sr-only peer"
              {...props}
            />
            <div className={cn(
              'w-10 h-6 bg-[var(--border)] rounded-full transition-colors',
              'peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/30'
            )} />
            <div className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform border border-black/5',
              'peer-checked:translate-x-4'
            )} />
          </div>
        </label>
        {error && <p className="text-[10px] text-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

// 6. SELECT SYSTEM
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, success, helperText, options, disabled, id, value, onChange, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full select-none text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-text-sub tracking-tight">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] px-3.5 py-2 h-10 transition-all duration-200 outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/10',
            'disabled:opacity-50 disabled:bg-[var(--surface-secondary)] disabled:cursor-not-allowed',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            success && 'border-success focus:border-success focus:ring-success/10',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error ? (
          <p id={`${selectId}-error`} className="text-[11px] font-medium text-danger flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : success ? (
          <p className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
            {success}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-[11px] text-text-mute mt-0.5 leading-relaxed">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

// 7. HIGH-FIDELITY MULTISELECT TAGS COMPONENT
export interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  success?: string;
  helperText?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = 'Select multiple...',
  options,
  selectedValues,
  onChange,
  error,
  success,
  helperText,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (disabled) return;
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedValues.filter((v) => v !== val));
  };

  return (
    <div className="flex flex-col gap-1.5 w-full select-none text-left relative">
      {label && <span className="text-xs font-semibold text-text-sub tracking-tight">{label}</span>}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full min-h-10 bg-[var(--surface)] text-text-main text-sm rounded-input border border-[var(--border)] px-3 py-1.5 transition-all duration-200 outline-none flex flex-wrap gap-1.5 items-center cursor-pointer',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
          disabled && 'opacity-50 bg-[var(--surface-secondary)] cursor-not-allowed',
          error && 'border-danger focus-within:border-danger focus-within:ring-danger/10',
          success && 'border-success focus-within:border-success focus-within:ring-success/10'
        )}
      >
        {selectedValues.length === 0 && (
          <span className="text-text-mute/60 pl-1">{placeholder}</span>
        )}
        {selectedValues.map((val) => {
          const matchedOpt = options.find((o) => o.value === val);
          return (
            <div
              key={val}
              className="bg-primary/10 border border-primary/20 text-text-main text-xs font-bold pl-2.5 pr-1.5 py-0.5 rounded-full flex items-center gap-1 hover:bg-primary/20"
            >
              <span>{matchedOpt?.label || val}</span>
              <button
                type="button"
                onClick={(e) => removeValue(val, e)}
                className="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center shrink-0"
              >
                <X className="w-2.5 h-2.5 text-text-sub" />
              </button>
            </div>
          );
        })}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-xl z-50 py-1.5 animate-dropdown">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={cn(
                  'px-3.5 py-2 text-xs font-semibold hover:bg-[var(--hover-tint)] flex items-center justify-between cursor-pointer',
                  isSelected && 'text-primary bg-primary/5'
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="text-[11px] font-medium text-danger flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : success ? (
        <p className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
          {success}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-text-mute mt-0.5 leading-relaxed">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
