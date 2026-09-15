import React from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, clearable, onClear, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-950/60 backdrop-blur-md text-slate-100 placeholder-slate-500 border border-cyan-500/20 rounded-xl px-3.5 py-2 text-sm transition-all duration-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] ${
            icon ? 'pl-9' : ''
          } ${clearable ? 'pr-9' : ''} ${className}`}
          {...props}
        />
        {clearable && props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-slate-400 hover:text-white"
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
