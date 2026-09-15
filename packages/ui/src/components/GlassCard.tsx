import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = true,
  glow = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/15 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ${
        hoverEffect
          ? 'hover:border-cyan-400/40 hover:shadow-[0_12px_40px_rgba(0,240,255,0.12)] hover:-translate-y-0.5'
          : ''
      } ${glow ? 'shadow-[0_0_30px_rgba(0,240,255,0.18)] border-cyan-400/35' : ''} ${className}`}
      {...props}
    >
      {/* Subtle specular reflection rim at top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none rounded-t-2xl" />
      {children}
    </div>
  );
};
