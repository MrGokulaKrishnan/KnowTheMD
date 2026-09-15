import React from 'react';
import { DocumentStats } from '@knowthemd/markdown-engine';
import { Check, AlertCircle } from 'lucide-react';

export interface StatusBarProps {
  stats: DocumentStats;
  isDirty: boolean;
  mode: string;
  encoding?: string;
  format?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  isDirty,
  mode,
  encoding = 'UTF-8',
  format = 'GFM Markdown',
}) => {
  return (
    <footer className="h-6 bg-slate-950 border-t border-cyan-500/15 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0 z-30">
      {/* Left statistics */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          {isDirty ? (
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Unsaved
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </span>

        <span className="text-slate-700">|</span>
        <span>{stats.lines} lines</span>
        <span className="text-slate-700">|</span>
        <span>{stats.words} words</span>
        <span className="text-slate-700">|</span>
        <span>{stats.characters} chars</span>
        <span className="text-slate-700">|</span>
        <span className="hidden sm:inline">~{stats.readingTimeMinutes}m read</span>
      </div>

      {/* Right metadata */}
      <div className="flex items-center gap-3">
        <span className="hidden md:inline uppercase text-slate-500">{mode} mode</span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span className="text-slate-400">{format}</span>
        <span className="text-slate-700">|</span>
        <span className="text-cyan-400">{encoding}</span>
      </div>
    </footer>
  );
};
