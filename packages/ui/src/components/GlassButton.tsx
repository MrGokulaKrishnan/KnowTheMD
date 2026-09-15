import React from 'react';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  active?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  active = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    md: 'px-3.5 py-1.5 text-sm gap-2 rounded-xl',
    lg: 'px-5 py-2.5 text-base gap-2.5 rounded-2xl',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold shadow-[0_0_20px_rgba(0,240,255,0.35)] border border-cyan-400/40 hover:brightness-110 active:scale-[0.98]',
    secondary:
      'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-400/40 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 active:scale-[0.98]',
    danger:
      'bg-rose-950/50 hover:bg-rose-900/80 text-rose-200 border border-rose-500/30 hover:border-rose-400/60 shadow-[0_4px_16px_rgba(239,68,68,0.2)] active:scale-[0.98]',
  };

  const activeClasses = active
    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
    : '';

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${activeClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
