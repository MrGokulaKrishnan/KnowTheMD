import React, { useMemo } from 'react';
import { renderMarkdownToHtml } from '@knowthemd/markdown-engine';

export interface PreviewProps {
  content: string;
  lightMode?: boolean;
  className?: string;
  containerRef?: any;
  onTaskToggle?: (index: number, checked: boolean) => void;
}

export const Preview: React.FC<PreviewProps> = ({
  content,
  lightMode = false,
  className = '',
  containerRef,
}) => {
  const { html, frontMatter } = useMemo(() => {
    return renderMarkdownToHtml(content, { lightMode });
  }, [content, lightMode]);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full overflow-y-auto p-6 md:p-8 bg-slate-900/40 backdrop-blur-md text-slate-100 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Frontmatter display if present */}
        {frontMatter && Object.keys(frontMatter).length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs font-mono">
            <div className="text-cyan-400 font-bold mb-2 uppercase tracking-wider">Document Metadata</div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              {Object.entries(frontMatter).map(([key, val]) => (
                <div key={key}>
                  <span className="text-slate-500">{key}:</span> <span className="text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rendered HTML */}
        <div
          className="prose prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};
