import React, { useState } from 'react';

export interface GlassTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const GlassTooltip: React.FC<GlassTooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = useState(false);

  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute ${posClasses[position]} z-50 pointer-events-none px-2.5 py-1 text-[11px] font-medium text-slate-200 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_10px_rgba(0,240,255,0.2)] whitespace-nowrap animate-fade-in`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
