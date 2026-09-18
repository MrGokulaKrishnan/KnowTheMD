import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

export interface GlassToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const GlassToast: React.FC<GlassToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2.5rem)]">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(0,240,255,0.15)] w-full sm:min-w-[280px] sm:max-w-md overflow-hidden animate-slide-up"
          >
            {icon}
            <div className="flex-1 min-w-0 overflow-hidden break-words [overflow-wrap:anywhere]">
              {toast.title && (
                <div className="text-xs font-semibold text-white mb-0.5 break-words">
                  {toast.title}
                </div>
              )}
              <div className="text-xs text-slate-300 leading-snug break-words [overflow-wrap:anywhere]">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors shrink-0 ml-1 p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
