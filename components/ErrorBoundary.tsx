'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold mb-2">Component Error</h2>
            <p className="text-sm opacity-80 max-w-md">
              {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
