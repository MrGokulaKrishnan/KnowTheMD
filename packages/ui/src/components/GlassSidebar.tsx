import React from 'react';

export interface GlassSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  side?: 'left' | 'right';
  className?: string;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  isOpen,
  title,
  children,
  width = 'w-64',
  side = 'left',
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className={`h-full ${width} shrink-0 bg-slate-950/70 backdrop-blur-xl border-${
        side === 'left' ? 'r' : 'l'
      } border-cyan-500/15 flex flex-col z-20 transition-all duration-300 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {title}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">{children}</div>
    </aside>
  );
};
