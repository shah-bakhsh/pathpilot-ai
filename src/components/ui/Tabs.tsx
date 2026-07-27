/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  className,
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        'flex border-b border-[var(--border)] overflow-x-auto scrollbar-none',
        variant === 'pills' && 'border-none bg-[var(--hover-tint)]/50 p-1 rounded-card',
        className
      )}
      role="tablist"
      {...props}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer outline-none shrink-0',
              variant === 'underline' && 'text-text-mute hover:text-text-main border-b-2 border-transparent -mb-[1px]',
              variant === 'underline' && isActive && 'text-primary border-primary font-semibold',
              variant === 'pills' && 'rounded-btn text-text-sub hover:text-text-main py-1.5 px-3.5',
              variant === 'pills' && isActive && 'bg-[var(--surface)] text-text-main font-semibold shadow-sm border border-[var(--border)]/30'
            )}
          >
            {tab.icon && <span className="flex shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
