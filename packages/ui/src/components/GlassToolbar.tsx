import React from 'react';

export interface GlassToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassToolbar: React.FC<GlassToolbarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-2 bg-slate-900/60 backdrop-blur-xl border-b border-cyan-500/15 overflow-x-auto no-scrollbar shadow-[0_4px_16px_rgba(0,0,0,0.2)] ${className}`}
    >
      {children}
    </div>
  );
};
