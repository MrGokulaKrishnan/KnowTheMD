import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  inset = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative rounded-xl backdrop-blur-xl border transition-colors ${
        inset
          ? 'bg-black/30 border-cyan-500/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]'
          : 'bg-slate-900/50 border-cyan-500/15 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
