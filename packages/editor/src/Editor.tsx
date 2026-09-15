import React, { useEffect, useMemo } from 'react';

export interface EditorProps {
  content: string;
  onChange: (value: string, cursor?: number) => void;
  textareaRef: any;
  fontSize?: number;
  lineHeight?: number;
  wordWrap?: boolean;
  showLineNumbers?: boolean;
  onSave?: () => void;
  onSearch?: () => void;
  onCommandPalette?: () => void;
  onDropFile?: (file: File) => void;
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  textareaRef,
  fontSize = 14,
  lineHeight = 1.6,
  wordWrap = true,
  showLineNumbers = true,
  onSave,
  onSearch,
  onCommandPalette,
  onDropFile,
  className = '',
}) => {
  // Generate line numbers array
  const lineCount = useMemo(() => {
    return content.split('\n').length;
  }, [content]);

  // Handle Tab key and auto-closing brackets
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Shortcuts
    if (modKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSave?.();
      return;
    }
    if (modKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      onSearch?.();
      return;
    }
    if (modKey && (e.key.toLowerCase() === 'p' && e.shiftKey)) {
      e.preventDefault();
      onCommandPalette?.();
      return;
    }

    // Tab key -> 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent, start + 2);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Auto-close brackets & quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    if (pairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      e.preventDefault();
      const closing = pairs[e.key];
      const replacement = `${e.key}${selected}${closing}`;
      const newContent = content.substring(0, start) + replacement + content.substring(end);
      onChange(newContent, start + 1);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }
  };

  // Drag & drop handling
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onDropFile) {
        onDropFile(file);
      }
    }
  };

  return (
    <div
      className={`relative flex h-full w-full bg-slate-950/80 backdrop-blur-md overflow-hidden ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Line numbers gutter */}
      {showLineNumbers && (
        <div
          className="select-none py-4 px-3 text-right font-mono text-xs text-slate-600 bg-slate-950/90 border-r border-cyan-500/10 overflow-hidden shrink-0"
          style={{ width: `${Math.max(3, String(lineCount).length) * 10 + 20}px` }}
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i + 1} style={{ lineHeight: `${lineHeight * fontSize}px`, fontSize: `${fontSize}px` }}>
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Main text area */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value, e.target.selectionStart)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight * fontSize}px`,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        }}
        className={`flex-1 w-full h-full p-4 bg-transparent text-slate-100 placeholder-slate-600 resize-none outline-none overflow-y-auto no-scrollbar caret-cyan-400 selection:bg-cyan-500/30 ${
          wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
        }`}
        placeholder="# Start writing Markdown..."
      />
    </div>
  );
};
