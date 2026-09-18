import React from 'react';

export interface GlassTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
}

export const GlassTextArea = React.forwardRef<HTMLTextAreaElement, GlassTextAreaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-start w-full">
        <textarea
          ref={ref}
          className={`w-full bg-slate-950/60 backdrop-blur-md text-slate-100 placeholder-slate-500 border border-cyan-500/20 rounded-xl px-3.5 py-2 text-sm transition-all duration-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);

GlassTextArea.displayName = 'GlassTextArea';
