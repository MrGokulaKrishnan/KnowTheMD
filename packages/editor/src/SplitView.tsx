import React, { useRef, useEffect } from 'react';
import { Editor, EditorProps } from './Editor';
import { Preview } from './Preview';

export interface SplitViewProps extends EditorProps {
  lightMode?: boolean;
}

export const SplitView: React.FC<SplitViewProps> = ({
  content,
  onChange,
  textareaRef,
  fontSize,
  lineHeight,
  wordWrap,
  showLineNumbers,
  onSave,
  onSearch,
  onCommandPalette,
  onDropFile,
  lightMode = false,
  className = '',
}) => {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScroll = useRef(false);

  // Synchronized scrolling
  useEffect(() => {
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;

    const handleEditorScroll = () => {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;

      const editorScrollRatio =
        textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
      preview.scrollTop = editorScrollRatio * (preview.scrollHeight - preview.clientHeight);

      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 50);
    };

    const handlePreviewScroll = () => {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;

      const previewScrollRatio =
        preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
      textarea.scrollTop = previewScrollRatio * (textarea.scrollHeight - textarea.clientHeight);

      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 50);
    };

    textarea.addEventListener('scroll', handleEditorScroll, { passive: true });
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      textarea.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [textareaRef]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 h-full w-full divide-x divide-cyan-500/15 overflow-hidden ${className}`}>
      {/* Left Editor */}
      <div className="h-full overflow-hidden">
        <Editor
          content={content}
          onChange={onChange}
          textareaRef={textareaRef}
          fontSize={fontSize}
          lineHeight={lineHeight}
          wordWrap={wordWrap}
          showLineNumbers={showLineNumbers}
          onSave={onSave}
          onSearch={onSearch}
          onCommandPalette={onCommandPalette}
          onDropFile={onDropFile}
        />
      </div>

      {/* Right Preview */}
      <div className="h-full overflow-hidden hidden md:block">
        <Preview content={content} lightMode={lightMode} containerRef={previewRef} />
      </div>
    </div>
  );
};
