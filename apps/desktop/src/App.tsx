import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GlassTabs,
  GlassSidebar,
  GlassCommandPalette,
  GlassToast,
  GlassDialog,
  AboutAppModal,
  ToastMessage,
  CommandItem,
  TabItem,
} from '@knowthemd/ui';

import {
  computeStats,
  exportToHtml,
  exportToPdfHtml,
  exportToPlainText,
} from '@knowthemd/markdown-engine';
import {
  Editor,
  Preview,
  SplitView,
  ReadingMode,
  SearchBar,
  Outline,
} from '@knowthemd/editor';
import { Sidebar } from './components/Sidebar';
import { Toolbar, WorkspaceMode } from './components/Toolbar';
import { StatusBar } from './components/StatusBar';
import { OpenFileMenu } from './components/OpenFileMenu';
import { SettingsModal, EditorSettings } from './components/SettingsModal';
import { DiagnosticLogModal } from './components/DiagnosticLogModal';
import { UpdateBanner } from './components/UpdateBanner';
import { useAutoUpdater } from './hooks/useAutoUpdater';
import {
  DocumentItem,
  RecentItem,
  getRecentFiles,
  openMarkdownFile,
  saveMarkdownFile,
  saveAsMarkdownFile,
  saveSessionTabs,
  loadSessionTabs,
  logDiagnostic,
} from './fileSystem';


const DEFAULT_DOC_CONTENT = `# Welcome to KnowTheMD

> **Read. Write. Understand Markdown.**

KnowTheMD is a modern, high-performance, offline-first Markdown reader and editor engineered for precision and speed.

---

## Key Capabilities

- **Three Primary Modes**: Edit (Source), Preview (Rendered), and Split View.
- **Dedicated Reading Mode**: Custom typeset distraction-free reader with progress tracking.
- **GFM & CommonMark**: Tables, task lists, blockquotes, and strikethrough.
- **Multi-Language Highlighting**: 25+ programming languages supported out-of-the-box.
- **Math Formulas**: Inline $E = mc^2$ and block math:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

- **Interactive Task Lists**:
  - [x] Create production architecture
  - [x] Implement Liquid Glass design system
  - [ ] Write your next technical masterpiece

## Code Example

\`\`\`typescript
interface DocumentMetadata {
  title: string;
  wordCount: number;
  isLocalOnly: true;
}
\`\`\`

---

Enjoy writing with **KnowTheMD**!
`;

export const App: React.FC = () => {
  // Theme is strictly Liquid Glass Dark across all platforms
  const theme = 'dark';

  // ── Auto-Updater (Electron only — no-ops in browser) ──
  const updater = useAutoUpdater();

  // Workspace Mode: edit | preview | split | reading
  const [mode, setMode] = useState<WorkspaceMode>('split');

  // Start at Open File Menu / Dashboard on application launch
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(true);

  // Sidebar & Outline visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);


  // Close Confirmation Dialog
  const [pendingCloseId, setPendingCloseId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    setToasts((prev) => [...prev, { id: `t_${Date.now()}_${Math.random()}`, type, message, title }]);
  };

  // Documents and Tabs
  const [docs, setDocs] = useState<DocumentItem[]>([
    {
      id: 'doc_welcome',
      name: 'Welcome.md',
      content: DEFAULT_DOC_CONTENT,
      isDirty: false,
    },
  ]);
  const [activeDocId, setActiveDocId] = useState<string>('doc_welcome');
  const [recentFiles, setRecentFiles] = useState<RecentItem[]>([]);

  // Settings
  const [settings, setSettings] = useState<EditorSettings>({
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: 'JetBrains Mono',
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    autoCloseBrackets: true,
    theme: 'dark',
    autosaveIntervalSec: 2,
    pdfPageSize: 'A4',
  });

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // On initial mount: restore session and check onboarding
  useEffect(() => {
    setRecentFiles(getRecentFiles());
    const restored = loadSessionTabs();
    if (restored && restored.docs.length > 0) {
      setDocs(restored.docs);
      setActiveDocId(restored.activeId);
      logDiagnostic('info', 'Session', `Restored ${restored.docs.length} tabs from previous session`);
    }

    const hasSeenOnboarding = localStorage.getItem('knowthemd_seen_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Save session when docs change
  useEffect(() => {
    saveSessionTabs(docs, activeDocId);
  }, [docs, activeDocId]);

  // Compute stats for active doc
  const stats = React.useMemo(() => computeStats(activeDoc.content), [activeDoc.content]);

  // Document management handlers
  const handleContentChange = useCallback((newContent: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === activeDocId ? { ...d, content: newContent, isDirty: true } : d))
    );
  }, [activeDocId]);

  const handleNewDoc = (initialContent?: string, name?: string) => {
    const newId = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      id: newId,
      name: name || `Untitled-${docs.length + 1}.md`,
      content: initialContent !== undefined ? initialContent : '# Untitled Document\n\n',
      isDirty: false,
    };
    setDocs((prev) => [...prev, newDoc]);
    setActiveDocId(newId);
    setIsFileMenuOpen(false);
    addToast('info', 'Created new Markdown document');
  };

  const handleOpenFile = async () => {
    try {
      const fileData = await openMarkdownFile();
      if (!fileData) return;
      const newId = `doc_${Date.now()}`;
      const newDoc: DocumentItem = {
        id: newId,
        name: fileData.name,
        content: fileData.content,
        isDirty: false,
        fileHandle: fileData.handle,
      };
      setDocs((prev) => [...prev, newDoc]);
      setActiveDocId(newId);
      setRecentFiles(getRecentFiles());
      setIsFileMenuOpen(false);
      addToast('success', `Opened ${fileData.name}`);
    } catch (err: any) {
      addToast('error', err.message || "Couldn't open file");
    }
  };

  const handleOpenRecent = (item: RecentItem) => {
    const existing = docs.find((d) => d.name === item.name);
    if (existing) {
      setActiveDocId(existing.id);
      setIsFileMenuOpen(false);
      addToast('info', `Switched to ${item.name}`);
    } else {
      handleOpenFile();
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveMarkdownFile(activeDoc.content, activeDoc.fileHandle, activeDoc.name);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === activeDocId
            ? { ...d, name: result.name, fileHandle: result.handle, isDirty: false }
            : d
        )
      );
      setRecentFiles(getRecentFiles());
      addToast('success', `Saved ${result.name}`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        addToast('error', err.message || 'Error saving file');
      }
    }
  };

  const handleSaveAs = async () => {
    try {
      const result = await saveAsMarkdownFile(activeDoc.content, activeDoc.name);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === activeDocId
            ? { ...d, name: result.name, fileHandle: result.handle, isDirty: false }
            : d
        )
      );
      setRecentFiles(getRecentFiles());
      addToast('success', `Saved as ${result.name}`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        addToast('error', err.message || 'Error saving file');
      }
    }
  };

  const handleCloseTab = (id: string) => {
    const docToClose = docs.find((d) => d.id === id);
    if (!docToClose) return;

    if (docToClose.isDirty) {
      setPendingCloseId(id);
    } else {
      performCloseTab(id);
    }
  };

  const performCloseTab = (id: string) => {
    if (docs.length === 1) {
      // Don't close last doc, replace with empty
      handleNewDoc();
    }
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (activeDocId === id) {
      const remaining = docs.filter((d) => d.id !== id);
      if (remaining.length > 0) {
        setActiveDocId(remaining[0].id);
      }
    }
    setPendingCloseId(null);
  };

  // Logo click: Navigate to Open File Menu / Workspace
  const handleGoHome = () => {
    setIsFileMenuOpen(true);
    addToast('info', 'Switched to Workspace File Menu', 'Workspace');
  };

  // Export handlers
  const handleExport = (format: 'pdf' | 'html' | 'txt' | 'md') => {
    const baseName = activeDoc.name.replace(/\.[^/.]+$/, '');
    if (format === 'html') {
      const htmlStr = exportToHtml(activeDoc.content, activeDoc.name, false);
      const blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, `${baseName}.html`);
      addToast('success', `Exported ${baseName}.html`);
    } else if (format === 'pdf') {
      const pdfHtml = exportToPdfHtml(activeDoc.content, activeDoc.name);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(pdfHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
        addToast('success', 'Opening print preview for PDF generation');
      }
    } else if (format === 'txt') {
      const plain = exportToPlainText(activeDoc.content);
      const blob = new Blob([plain], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, `${baseName}.txt`);
      addToast('success', `Exported ${baseName}.txt`);
    } else if (format === 'md') {
      const blob = new Blob([activeDoc.content], { type: 'text/markdown;charset=utf-8' });
      downloadBlob(blob, `${baseName}.md`);
      addToast('success', `Exported ${baseName}.md`);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Text formatting insertion
  const handleFormat = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = activeDoc.content.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        cursorOffset = 1;
        break;
      case 'code':
        replacement = `\`${selected || 'code'}\``;
        cursorOffset = 1;
        break;
      case 'link':
        replacement = `[${selected || 'link text'}](https://example.com)`;
        cursorOffset = 1;
        break;
      case 'list':
        replacement = `\n- ${selected || 'List item'}\n`;
        break;
      case 'task':
        replacement = `\n- [ ] ${selected || 'Task item'}\n`;
        break;
      case 'table':
        replacement = `\n| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n`;
        break;
      default:
        break;
    }

    const newContent =
      activeDoc.content.substring(0, start) + replacement + activeDoc.content.substring(end);
    handleContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + replacement.length - cursorOffset);
    }, 0);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewDoc();
      } else if (modKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFile();
      } else if (modKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveAs();
        } else {
          handleSave();
        }
      } else if (modKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (modKey && e.key === '\\') {
        e.preventDefault();
        setIsSidebarOpen((s) => !s);
      } else if (modKey && (e.key.toLowerCase() === 'p' && e.shiftKey)) {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeDoc, docs]);

  // Command palette command list
  const paletteCommands: CommandItem[] = [
    { id: 'new', title: 'New Document', category: 'File', shortcut: 'Ctrl+N', perform: handleNewDoc },
    { id: 'open', title: 'Open File', category: 'File', shortcut: 'Ctrl+O', perform: handleOpenFile },
    { id: 'save', title: 'Save Document', category: 'File', shortcut: 'Ctrl+S', perform: handleSave },
    { id: 'saveas', title: 'Save As...', category: 'File', shortcut: 'Ctrl+Shift+S', perform: handleSaveAs },
    { id: 'mode_edit', title: 'Switch to Edit Mode', category: 'View', perform: () => setMode('edit') },
    { id: 'mode_preview', title: 'Switch to Preview Mode', category: 'View', perform: () => setMode('preview') },
    { id: 'mode_split', title: 'Switch to Split Mode', category: 'View', perform: () => setMode('split') },
    { id: 'mode_reading', title: 'Switch to Reading Mode', category: 'View', perform: () => setMode('reading') },
    { id: 'toggle_sidebar', title: 'Toggle Sidebar', category: 'View', shortcut: 'Ctrl+\\', perform: () => setIsSidebarOpen((s) => !s) },
    { id: 'toggle_outline', title: 'Toggle Outline', category: 'View', perform: () => setIsOutlineOpen((o) => !o) },
    { id: 'export_pdf', title: 'Export to PDF', category: 'Export', perform: () => handleExport('pdf') },
    { id: 'export_html', title: 'Export Standalone HTML', category: 'Export', perform: () => handleExport('html') },
    { id: 'open_file_menu', title: 'Open File Menu / Start Workspace', category: 'File', shortcut: 'Ctrl+H', perform: () => setIsFileMenuOpen(true) },
    { id: 'settings', title: 'Open Preferences', category: 'General', perform: () => setIsSettingsOpen(true) },
    { id: 'diagnostics', title: 'View Diagnostic Logs', category: 'Diagnostics', perform: () => setIsDiagnosticsOpen(true) },
    { id: 'about', title: 'About KnowTheMD (Play Store Info)', category: 'General', perform: () => setIsAboutOpen(true) },
    { id: 'check_updates', title: 'Check for Updates', category: 'General', perform: updater.checkForUpdates },

    ...(updater.state === 'ready' ? [{ id: 'install_update', title: `Install Update v${updater.updateInfo?.version ?? ''}`, category: 'General', perform: updater.installUpdate }] : []),
  ];

  const tabs: TabItem[] = docs.map((d) => ({
    id: d.id,
    title: d.name,
    isDirty: d.isDirty,
  }));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100">
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        openDocs={docs}
        activeDocId={activeDocId}
        onSelectDoc={(id) => {
          setActiveDocId(id);
          setIsFileMenuOpen(false);
        }}
        onCloseDoc={handleCloseTab}
        onNewDoc={() => handleNewDoc()}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFile}
        recentFiles={recentFiles}
        onOpenRecent={handleOpenRecent}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onGoHome={handleGoHome}
      />


      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* OTA Update Banner (Electron only — invisible in browser/web) */}
        <UpdateBanner {...updater} />

        {/* Toolbar */}
        <Toolbar
          mode={mode}
          onModeChange={setMode}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isOutlineOpen={isOutlineOpen}
          onToggleOutline={() => setIsOutlineOpen(!isOutlineOpen)}
          onFormat={handleFormat}
          onSearch={() => setIsSearchOpen(true)}
          onCommandPalette={() => setIsPaletteOpen(true)}
          onExport={handleExport}
          onOpenFileMenu={() => setIsFileMenuOpen((prev) => !prev)}
          isFileMenuOpen={isFileMenuOpen}
        />

        {/* TabBar (hidden in reading mode or when in open file menu) */}
        {mode !== 'reading' && (
          <GlassTabs
            tabs={tabs}
            activeId={activeDocId}
            onSelect={(id) => {
              setActiveDocId(id);
              setIsFileMenuOpen(false);
            }}
            onClose={handleCloseTab}
            onNewTab={() => handleNewDoc()}
          />
        )}

        {/* Editor / Preview Area with Right Outline or Open File Menu */}
        <div className="relative flex-1 flex overflow-hidden">
          {isFileMenuOpen ? (
            <OpenFileMenu
              onOpenFile={handleOpenFile}
              onOpenFolder={handleOpenFile}
              onNewDoc={(content, name) => handleNewDoc(content, name)}
              recentFiles={recentFiles}
              onOpenRecent={handleOpenRecent}
              activeDoc={activeDoc}
              onGoToEditor={() => setIsFileMenuOpen(false)}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          ) : (
            <>
              <div className="flex-1 h-full overflow-hidden">
                {mode === 'reading' ? (
                  <ReadingMode
                    content={activeDoc.content}
                    onExit={() => setMode('split')}
                  />
                ) : mode === 'split' ? (
                  <SplitView
                    content={activeDoc.content}
                    onChange={handleContentChange}
                    textareaRef={textareaRef}
                    fontSize={settings.fontSize}
                    lineHeight={settings.lineHeight}
                    wordWrap={settings.wordWrap}
                    showLineNumbers={settings.lineNumbers}
                    onSave={handleSave}
                    onSearch={() => setIsSearchOpen(true)}
                    onCommandPalette={() => setIsPaletteOpen(true)}
                  />
                ) : mode === 'preview' ? (
                  <Preview content={activeDoc.content} />
                ) : (
                  <Editor
                    content={activeDoc.content}
                    onChange={handleContentChange}
                    textareaRef={textareaRef}
                    fontSize={settings.fontSize}
                    lineHeight={settings.lineHeight}
                    wordWrap={settings.wordWrap}
                    showLineNumbers={settings.lineNumbers}
                    onSave={handleSave}
                    onSearch={() => setIsSearchOpen(true)}
                    onCommandPalette={() => setIsPaletteOpen(true)}
                  />
                )}
              </div>

              {/* Collapsible Right Outline Sidebar */}
              {isOutlineOpen && mode !== 'reading' && (
                <aside className="w-64 h-full shrink-0 bg-slate-950/80 backdrop-blur-xl border-l border-cyan-500/15 flex flex-col z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-cyan-500/10 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Document Outline
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                    <Outline content={activeDoc.content} />
                  </div>
                </aside>
              )}
            </>
          )}

          {/* Floating Search & Replace Bar */}
          <SearchBar
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            content={activeDoc.content}
            onReplace={(search, replaceWith, isRegex, isCase, isWhole, all) => {
              try {
                let pattern = search;
                if (!isRegex) pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (isWhole) pattern = `\\b${pattern}\\b`;
                const flags = isCase ? (all ? 'g' : '') : (all ? 'gi' : 'i');
                const regex = new RegExp(pattern, flags);
                const updated = activeDoc.content.replace(regex, replaceWith);
                handleContentChange(updated);
                addToast('info', 'Text replacement applied');
              } catch (e: any) {
                addToast('error', `Regex error: ${e.message}`);
              }
            }}
          />
        </div>

        {/* Status Bar */}
        <StatusBar stats={stats} isDirty={activeDoc.isDirty} mode={mode} />
      </div>

      {/* Command Palette */}
      <GlassCommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        commands={paletteCommands}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(up) => setSettings((s) => ({ ...s, ...up }))}
        onOpenDiagnostics={() => {
          setIsSettingsOpen(false);
          setIsDiagnosticsOpen(true);
        }}
        onCheckUpdates={updater.checkForUpdates}
        onRestartUpdate={updater.installUpdate}
        isUpdateReady={updater.state === 'ready'}
        updateVersion={updater.updateInfo?.version}
      />

      {/* Play Store Style About Modal */}
      <AboutAppModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onCheckUpdates={updater.checkForUpdates}
      />

      {/* Diagnostics Modal */}
      <DiagnosticLogModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />


      {/* Unsaved Changes Confirmation Dialog */}
      <GlassDialog
        isOpen={pendingCloseId !== null}
        onClose={() => setPendingCloseId(null)}
        title="Unsaved Changes"
        type="warning"
        message="This document contains unsaved changes. Do you want to save your progress before closing?"
        confirmLabel="Save"
        cancelLabel="Cancel"
        secondaryLabel="Discard"
        onConfirm={async () => {
          await handleSave();
          if (pendingCloseId) performCloseTab(pendingCloseId);
        }}
        onSecondary={() => {
          if (pendingCloseId) performCloseTab(pendingCloseId);
        }}
      />

      {/* First Run Onboarding Modal */}
      {showOnboarding && (
        <GlassDialog
          isOpen={showOnboarding}
          onClose={() => {
            setShowOnboarding(false);
            localStorage.setItem('knowthemd_seen_onboarding', 'true');
          }}
          title="Welcome to KnowTheMD"
          maxWidth="lg"
          message={
            <div className="space-y-3 text-slate-300 text-xs sm:text-sm">
              <p>Welcome to your modern cross-platform Markdown workspace. Here is how to get started:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span><strong className="text-white">Open & Edit</strong> Markdown files with instant live preview.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span><strong className="text-white">Reading Mode</strong> gives you a distraction-free, typeset document view.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span><strong className="text-white">Export</strong> anytime to PDF, standalone HTML, clean Markdown, or Plain Text.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span><strong className="text-white">100% Offline & Local-First</strong>: Your files never leave your computer.</span>
                </li>
              </ul>
            </div>
          }
          confirmLabel="Get Started"
          cancelLabel="Skip"
          onConfirm={() => {
            setShowOnboarding(false);
            localStorage.setItem('knowthemd_seen_onboarding', 'true');
          }}
        />
      )}

      {/* Floating Toasts */}
      <GlassToast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};
