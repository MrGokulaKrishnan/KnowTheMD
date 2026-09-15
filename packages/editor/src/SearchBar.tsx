import React, { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Replace, X, CaseSensitive, WholeWord, Regex } from 'lucide-react';

export interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onNavigateMatch?: (index: number) => void;
  onReplace?: (search: string, replaceWith: string, isRegex: boolean, isCaseSensitive: boolean, isWholeWord: boolean, replaceAll: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  content,
  onNavigateMatch,
  onReplace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isWholeWord, setIsWholeWord] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Compute matches
  const matches = React.useMemo(() => {
    if (!searchQuery) return [];
    try {
      let pattern = searchQuery;
      if (!isRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (isWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = isCaseSensitive ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);
      const indices: number[] = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        indices.push(match.index);
        if (!regex.global) break;
      }
      return indices;
    } catch (e) {
      return [];
    }
  }, [searchQuery, content, isCaseSensitive, isWholeWord, isRegex]);

  useEffect(() => {
    setCurrentMatchIndex(matches.length > 0 ? 1 : 0);
  }, [matches]);

  const handleNext = () => {
    if (matches.length === 0) return;
    const next = currentMatchIndex >= matches.length ? 1 : currentMatchIndex + 1;
    setCurrentMatchIndex(next);
    onNavigateMatch?.(matches[next - 1]);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prev = currentMatchIndex <= 1 ? matches.length : currentMatchIndex - 1;
    setCurrentMatchIndex(prev);
    onNavigateMatch?.(matches[prev - 1]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 right-6 z-40 w-80 md:w-96 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(0,240,255,0.15)] p-3 text-xs animate-slide-down">
      {/* Top specular highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Find Row */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.shiftKey ? handlePrev() : handleNext();
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Find in document..."
            className="w-full bg-slate-950/70 border border-cyan-500/20 rounded-lg pl-8 pr-16 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            autoFocus
          />
          <span className="absolute right-2 text-[10px] text-slate-400 font-mono">
            {matches.length > 0 ? `${currentMatchIndex}/${matches.length}` : '0 results'}
          </span>
        </div>

        {/* Prev / Next */}
        <button
          onClick={handlePrev}
          disabled={matches.length === 0}
          className="p-1 rounded hover:bg-cyan-500/20 text-slate-300 disabled:opacity-30"
          title="Previous Match (Shift+Enter)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={matches.length === 0}
          className="p-1 rounded hover:bg-cyan-500/20 text-slate-300 disabled:opacity-30"
          title="Next Match (Enter)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Replace */}
        <button
          onClick={() => setShowReplace(!showReplace)}
          className={`p-1 rounded transition-colors ${
            showReplace ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Replace"
        >
          <Replace className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white"
          title="Close (Escape)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Options Row */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCaseSensitive(!isCaseSensitive)}
            className={`px-1.5 py-0.5 rounded border text-[10px] flex items-center gap-1 ${
              isCaseSensitive
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'border-transparent text-slate-400 hover:bg-slate-800'
            }`}
            title="Match Case"
          >
            <CaseSensitive className="w-3 h-3" /> Aa
          </button>
          <button
            onClick={() => setIsWholeWord(!isWholeWord)}
            className={`px-1.5 py-0.5 rounded border text-[10px] flex items-center gap-1 ${
              isWholeWord
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'border-transparent text-slate-400 hover:bg-slate-800'
            }`}
            title="Match Whole Word"
          >
            <WholeWord className="w-3 h-3" /> \b
          </button>
          <button
            onClick={() => setIsRegex(!isRegex)}
            className={`px-1.5 py-0.5 rounded border text-[10px] flex items-center gap-1 ${
              isRegex
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'border-transparent text-slate-400 hover:bg-slate-800'
            }`}
            title="Use Regular Expression"
          >
            <Regex className="w-3 h-3" /> .*
          </button>
        </div>
      </div>

      {/* Replace Row */}
      {showReplace && (
        <div className="mt-2 pt-2 border-t border-cyan-500/15 flex items-center gap-1.5">
          <input
            type="text"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder="Replace with..."
            className="flex-1 bg-slate-950/70 border border-cyan-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <button
            onClick={() =>
              onReplace?.(searchQuery, replaceQuery, isRegex, isCaseSensitive, isWholeWord, false)
            }
            disabled={matches.length === 0}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] disabled:opacity-30"
          >
            Replace
          </button>
          <button
            onClick={() =>
              onReplace?.(searchQuery, replaceQuery, isRegex, isCaseSensitive, isWholeWord, true)
            }
            disabled={matches.length === 0}
            className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] disabled:opacity-30"
          >
            All
          </button>
        </div>
      )}
    </div>
  );
};
