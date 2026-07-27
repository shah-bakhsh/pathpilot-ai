/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, description, type = 'info', duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, title, description, type, duration };
    setToasts((prev) => [...prev.slice(-4), newToast]); // Limit to max 5 visible toasts

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const typeIcons = {
            success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
            info: <Info className="w-5 h-5 text-info shrink-0" />,
          };

          const typeBorders = {
            success: 'border-l-4 border-l-success',
            error: 'border-l-4 border-l-danger',
            warning: 'border-l-4 border-l-warning',
            info: 'border-l-4 border-l-info',
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-card shadow-xl transition-all duration-300 animate-toast overflow-hidden',
                typeBorders[toast.type || 'info']
              )}
              role="alert"
            >
              {typeIcons[toast.type || 'info']}
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-bold text-text-main leading-snug truncate">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] text-text-sub font-medium mt-0.5 leading-relaxed line-clamp-2">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-text-mute hover:text-text-main p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (toast: Omit<ToastMessage, 'id'>) => console.log('Toast:', toast),
      dismissToast: () => {},
    };
  }
  return context;
};
