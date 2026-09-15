import React, { useState, useMemo } from 'react';
import { extractToc, TocItem } from '@knowthemd/markdown-engine';
import { ChevronRight, ChevronDown, Hash } from 'lucide-react';

export interface OutlineProps {
  content: string;
  onSelectHeading?: (heading: TocItem) => void;
  className?: string;
}

export const Outline: React.FC<OutlineProps> = ({
  content,
  onSelectHeading,
  className = '',
}) => {
  const items = useMemo(() => extractToc(content), [content]);
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (items.length === 0) {
    return (
      <div className={`p-4 text-xs text-slate-500 italic text-center ${className}`}>
        No headings found in this document. Add # Heading to see outline.
      </div>
    );
  }

  return (
    <nav className={`py-2 px-1 text-xs select-none space-y-0.5 ${className}`} aria-label="Document Outline">
      {items.map((item) => {
        const isCollapsed = !!collapsedIds[item.id];
        const indentClass =
          item.level === 1
            ? 'pl-2 font-semibold text-cyan-300'
            : item.level === 2
            ? 'pl-4 text-slate-200'
            : item.level === 3
            ? 'pl-6 text-slate-300'
            : item.level === 4
            ? 'pl-8 text-slate-400'
            : 'pl-10 text-slate-500';

        return (
          <div
            key={item.id}
            onClick={() => onSelectHeading?.(item)}
            className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors ${indentClass}`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Hash className="w-3 h-3 text-cyan-500/60 shrink-0" />
              <span className="truncate">{item.text}</span>
            </div>

            {item.level <= 2 && (
              <button
                type="button"
                onClick={(e) => toggleCollapse(item.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-cyan-300"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
};
