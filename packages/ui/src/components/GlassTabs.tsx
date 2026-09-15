import React from 'react';
import { X } from 'lucide-react';

export interface TabItem {
  id: string;
  title: string;
  isDirty?: boolean;
  icon?: React.ReactNode;
}

export interface GlassTabsProps {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  onNewTab?: () => void;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeId,
  onSelect,
  onClose,
  onNewTab,
}) => {
  return (
    <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar border-b border-cyan-500/15 bg-slate-950/40 backdrop-blur-md px-2 pt-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`group relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-xl cursor-pointer transition-all duration-200 border-t border-x ${
              isActive
                ? 'bg-slate-900/90 text-cyan-300 border-cyan-400/40 shadow-[0_-4px_16px_rgba(0,240,255,0.1)]'
                : 'bg-slate-950/30 text-slate-400 border-transparent hover:bg-slate-900/40 hover:text-slate-200'
            }`}
          >
            {/* Top specular highlight on active tab */}
            {isActive && (
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 rounded-t-xl" />
            )}

            {tab.icon && <span className="text-slate-400 group-hover:text-cyan-400">{tab.icon}</span>}
            <span className="truncate max-w-[140px]">{tab.title}</span>

            {/* Dirty state indicator dot */}
            {tab.isDirty && (
              <span
                className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                title="Unsaved changes"
              />
            )}

            {/* Close tab button */}
            {onClose && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-opacity"
                aria-label={`Close ${tab.title}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}

      {onNewTab && (
        <button
          type="button"
          onClick={onNewTab}
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors ml-1"
          aria-label="New Document"
          title="New Document (Ctrl/Cmd+N)"
        >
          <span className="text-sm font-semibold">+</span>
        </button>
      )}
    </div>
  );
};
