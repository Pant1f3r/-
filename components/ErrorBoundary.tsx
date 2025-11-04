import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you'd log this to a service like Sentry, LogRocket, etc.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // FIX: In a class component, `setState` must be called on the component instance (`this`).
    // FIX: Corrected to use `this.setState` as it is a class component.
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-8 p-6 bg-gray-800 border-2 border-red-500/50 rounded-lg error-boundary-glow-border text-gray-200 animate-fade-in-right">
          <div className="flex flex-col items-center text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400" />
            <h2 className="mt-4 text-2xl font-bold text-red-400 threatscape-glitch">[ COMPONENT FAILURE ]</h2>
            <p className="mt-2 text-gray-400 max-w-md">
              A critical error occurred in this module. The rest of the application remains operational.
            </p>
            
            <details className="mt-4 w-full max-w-lg text-left bg-gray-900/50 p-3 rounded-md">
              <summary className="cursor-pointer font-semibold text-gray-300">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-red-300 whitespace-pre-wrap font-mono overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>

            <button
              onClick={this.handleReset}
              className="mt-6 px-6 py-2 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
            >
              Attempt to Reset Module
            </button>
          </div>
        </div>
      );
    }

    // FIX: In a class component, `props` must be accessed from the component instance (`this`).
    // FIX: Corrected to use `this.props` as it is a class component.
    return this.props.children;
  }
}