import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component hierarchy:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 my-6 rounded-card bg-[var(--surface)] border border-red-500/20 shadow-md flex flex-col items-center justify-center text-center max-w-xl mx-auto animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-text-main mb-2">Module Exception Encountered</h3>
          <p className="text-xs text-text-sub max-w-md mb-6 leading-relaxed">
            An unexpected error occurred while rendering this component. You can attempt to reload the module or navigate to another view.
          </p>
          {this.state.error && (
            <div className="w-full text-left p-3 rounded bg-[var(--surface-secondary)] border border-[var(--border)] text-[11px] font-mono text-red-400 mb-6 overflow-x-auto max-h-32">
              {this.state.error.message || 'Unknown runtime error'}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Module
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { window.location.hash = 'dashboard'; window.location.reload(); }}
            >
              Back to Main Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
