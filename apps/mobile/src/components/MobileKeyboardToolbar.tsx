import React from 'react';
import {
  Bold,
  Italic,
  Code,
  Link,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

export interface MobileKeyboardToolbarProps {
  onFormat: (type: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const MobileKeyboardToolbar: React.FC<MobileKeyboardToolbarProps> = ({
  onFormat,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-900/90 backdrop-blur-xl border-t border-cyan-500/20 overflow-x-auto no-scrollbar shrink-0 z-30">
      {/* Undo / Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 disabled:opacity-30 active:bg-cyan-500/20 rounded-xl"
        aria-label="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 disabled:opacity-30 active:bg-cyan-500/20 rounded-xl"
        aria-label="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-cyan-500/20 mx-1 shrink-0" />

      {/* Formatting buttons */}
      <button
        onClick={() => onFormat('h1')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl font-bold"
        aria-label="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('h2')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl font-bold"
        aria-label="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('bold')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('code')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('link')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Link"
      >
        <Link className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('list')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('task')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Checklist Task"
      >
        <CheckSquare className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('quote')}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 active:bg-cyan-500/20 active:text-cyan-300 rounded-xl"
        aria-label="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};
