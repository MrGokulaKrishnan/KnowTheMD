import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in KnowTheMD mobile:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#030712] p-6 text-slate-100 select-none">
          <div className="max-w-md w-full rounded-2xl bg-slate-900/95 border border-cyan-500/25 p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] text-center space-y-5">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-lg font-bold text-white tracking-tight">
                KnowTheMD Recovery Screen
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected display error occurred. Your documents remain intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-left font-mono text-[11px] text-red-300 max-h-32 overflow-y-auto break-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restart App
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
