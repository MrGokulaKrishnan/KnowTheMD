import React, { useState, useRef, useEffect, useMemo } from 'react';
import { renderMarkdownToHtml, computeStats, extractToc } from '@knowthemd/markdown-engine';
import { Type, Sliders, BookOpen, Clock, List, X } from 'lucide-react';

export interface ReadingModeProps {
  content: string;
  lightMode?: boolean;
  onExit?: () => void;
  className?: string;
}

export const ReadingMode: React.FC<ReadingModeProps> = ({
  content,
  lightMode = false,
  onExit,
  className = '',
}) => {
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [maxWidth, setMaxWidth] = useState<'narrow' | 'medium' | 'wide'>('medium');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo(() => computeStats(content), [content]);
  const toc = useMemo(() => extractToc(content), [content]);
  const { html, frontMatter } = useMemo(
    () => renderMarkdownToHtml(content, { lightMode }),
    [content, lightMode]
  );

  // Track scroll progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const total = scrollHeight - clientHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollTop / total) * 100)));
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const maxWidthClasses = {
    narrow: 'max-w-xl',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
  };

  return (
    <div className={`relative h-full w-full flex flex-col bg-slate-950/95 overflow-hidden ${className}`}>
      {/* Top Reading Progress Bar */}
      <div className="w-full h-1 bg-slate-900 overflow-hidden shrink-0 z-30">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Floating Reading Controls */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900/60 backdrop-blur-xl border-b border-cyan-500/15 shrink-0 z-20">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <BookOpen className="w-4 h-4" /> Reading Mode
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" /> {stats.readingTimeMinutes} min read ({stats.words} words)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300 font-mono">{scrollProgress}% completed</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Typography Controls */}
          <div className="flex items-center bg-slate-950/70 border border-cyan-500/20 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
              className="px-2 py-0.5 rounded text-slate-300 hover:text-cyan-300 transition-colors"
              title="Toggle Serif / Sans Font"
            >
              {fontFamily === 'serif' ? 'Serif' : 'Sans'}
            </button>
            <span className="text-slate-700 px-1">|</span>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 1))}
              className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-400 font-mono px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 1))}
              className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white"
              title="Increase Font Size"
            >
              A+
            </button>
            <span className="text-slate-700 px-1">|</span>
            <button
              onClick={() =>
                setMaxWidth(maxWidth === 'narrow' ? 'medium' : maxWidth === 'medium' ? 'wide' : 'narrow')
              }
              className="px-2 py-0.5 rounded text-slate-300 hover:text-cyan-300 capitalize"
              title="Cycle Width"
            >
              {maxWidth}
            </button>
          </div>

          {/* Table of Contents Button */}
          <button
            onClick={() => setShowOutline(!showOutline)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 border border-cyan-500/20 transition-colors"
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Exit Reading Mode */}
          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Main Reading Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-12 flex justify-center"
      >
        <article
          className={`w-full ${maxWidthClasses[maxWidth]} text-slate-200 transition-all duration-200`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily:
              fontFamily === 'serif'
                ? '"Charter", "Merriweather", "Georgia", serif'
                : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {frontMatter?.title && (
            <header className="mb-10 pb-6 border-b border-cyan-500/20">
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                {frontMatter.title}
              </h1>
              {frontMatter.author && (
                <div className="text-sm text-cyan-400">By {frontMatter.author}</div>
              )}
            </header>
          )}

          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>

      {/* Slide-in Outline Drawer */}
      {showOutline && (
        <div className="absolute right-0 top-12 bottom-0 w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-cyan-500/20 p-5 z-40 shadow-2xl flex flex-col animate-slide-left">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/15">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Document Outline
            </h3>
            <button
              onClick={() => setShowOutline(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setShowOutline(false)}
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                className="block text-xs text-slate-300 hover:text-cyan-300 transition-colors py-1 truncate"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
