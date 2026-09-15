import { useState, useRef, useCallback, useEffect } from 'react';

export interface EditorHistoryStep {
  content: string;
  cursor: number;
}

export interface UseEditorStateOptions {
  initialContent?: string;
  docId?: string;
  onDirtyChange?: (isDirty: boolean) => void;
  autosaveIntervalMs?: number;
}

export function useEditorState({
  initialContent = '',
  docId = 'default_doc',
  onDirtyChange,
  autosaveIntervalMs = 2000,
}: UseEditorStateOptions) {
  const [content, setContent] = useState<string>(initialContent);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [history, setHistory] = useState<EditorHistoryStep[]>([
    { content: initialContent, cursor: 0 },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Recovery Draft Key
  const draftKey = `knowthemd_draft_${docId}`;

  // Check for crash recovery draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft && savedDraft !== initialContent) {
        // Draft exists
        console.log(`[KnowTheMD] Crash recovery draft found for ${docId}`);
      }
    } catch (e) {
      // Storage unavailable
    }
  }, [docId, draftKey, initialContent]);

  // Periodic autosave to recovery storage
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        try {
          localStorage.setItem(draftKey, content);
        } catch (e) {
          // Ignore storage quota
        }
      }
    }, autosaveIntervalMs);

    return () => clearInterval(timer);
  }, [content, isDirty, draftKey, autosaveIntervalMs]);

  // Update content with undo history tracking
  const updateContent = useCallback(
    (newContent: string, cursor = 0) => {
      setContent(newContent);
      setIsDirty(true);
      if (onDirtyChange) onDirtyChange(true);

      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        next.push({ content: newContent, cursor });
        // Keep max 50 history steps
        return next.slice(-50);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    },
    [historyIndex, onDirtyChange]
  );

  const markSaved = useCallback(() => {
    setIsDirty(false);
    if (onDirtyChange) onDirtyChange(false);
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {}
  }, [draftKey, onDirtyChange]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevStep = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prevStep.content);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = prevStep.cursor;
          textareaRef.current.selectionEnd = prevStep.cursor;
          textareaRef.current.focus();
        }
      }, 10);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextStep = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(nextStep.content);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = nextStep.cursor;
          textareaRef.current.selectionEnd = nextStep.cursor;
          textareaRef.current.focus();
        }
      }, 10);
    }
  }, [history, historyIndex]);

  // Formatting helpers
  const wrapSelection = useCallback(
    (prefix: string, suffix: string, defaultText = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.slice(start, end) || defaultText;

      const replacement = `${prefix}${selected}${suffix}`;
      const newContent = content.slice(0, start) + replacement + content.slice(end);
      const newCursor = start + prefix.length + selected.length;

      updateContent(newContent, newCursor);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 10);
    },
    [content, updateContent]
  );

  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;

      const newContent = content.slice(0, lineStart) + prefix + content.slice(lineStart);
      updateContent(newContent, start + prefix.length);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 10);
    },
    [content, updateContent]
  );

  return {
    content,
    setContent,
    updateContent,
    isDirty,
    markSaved,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    textareaRef,
    wrapSelection,
    insertLinePrefix,
  };
}
