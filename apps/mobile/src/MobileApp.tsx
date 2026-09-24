import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrandLogo, GlassCard, GlassButton, AboutAppModal } from '@knowthemd/ui';
import { computeStats } from '@knowthemd/markdown-engine';
import { Editor, Preview, ReadingMode } from '@knowthemd/editor';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileKeyboardToolbar } from './components/MobileKeyboardToolbar';
import { MobileOpenFileMenu, MobileOpenFileMenuDoc } from './components/MobileOpenFileMenu';
import { useUpdateChecker } from './hooks/useUpdateChecker';
import {
  Share2,
  FilePlus,
  FolderOpen,
  Eye,
  Edit3,
  BookOpen,
  Check,
  FileText,
  Clock,
  Sparkles,
  Download,
  X,
  ArrowUpCircle,
  RefreshCw,
  Info,
  ChevronLeft,
} from 'lucide-react';

declare global {
  interface Window {
    AndroidFileOpener?: {
      getPendingFile: () => string;
      clearPendingFile: () => void;
    };
    onAndroidFileOpened?: (payloadStr: string) => void;
  }
}

interface MobileDoc {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY_DOCS = 'knowthemd_mobile_docs_v1';
const STORAGE_KEY_ACTIVE = 'knowthemd_mobile_active_id_v1';

const SAMPLE_MOBILE_MD = `# KnowTheMD Mobile

> **Read. Write. Understand Markdown on the go.**

Welcome to the touch-optimized mobile experience for **KnowTheMD**.

---

## Mobile Features

- **Touch Toolbar**: Quickly format headings, bold, italic, and lists.
- **Preview & Reading**: Switch between editing and distraction-free reading with a single tap.
- **Offline & Local**: Works with no internet connection.

### Task Checklist
- [x] Test mobile layout
- [ ] Write a new note on the go
- [ ] Share with team

\`\`\`typescript
const mobileReady = true;
console.log("Touch optimized!");
\`\`\`
`;

export const MobileApp: React.FC = () => {
  // Always default to 'home' (Open File Menu / Page) as requested
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [editorSubMode, setEditorSubMode] = useState<'edit' | 'preview' | 'reading'>('edit');

  const [docs, setDocs] = useState<MobileDoc[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'doc_welcome',
        name: 'Welcome.md',
        content: SAMPLE_MOBILE_MD,
        updatedAt: Date.now(),
      },
    ];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (savedId) return savedId;
    } catch (e) {}
    return 'doc_welcome';
  });

  const [fontSize, setFontSize] = useState<number>(15);
  const [mobileToast, setMobileToast] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const theme = 'dark';

  // ── In-app update checker (polls GitHub Releases API, throttled 24h) ──
  const updateChecker = useUpdateChecker();

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0] || {
    id: 'doc_fallback',
    name: 'Untitled.md',
    content: '',
    updatedAt: Date.now(),
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const stats = React.useMemo(() => computeStats(activeDoc.content), [activeDoc.content]);

  // Persist docs and activeDocId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
    } catch (e) {}
  }, [docs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeDocId);
    } catch (e) {}
  }, [activeDocId]);

  // Show a mobile feedback toast
  const showToast = (message: string) => {
    setMobileToast(message);
    setTimeout(() => setMobileToast(null), 2800);
  };

  const docsRef = useRef<MobileDoc[]>(docs);
  docsRef.current = docs;

  // Open a document directly into the editor
  const openDocumentDirectly = useCallback((fileName: string, content: string) => {
    const currentDocs = docsRef.current;
    const existing = currentDocs.find((d) => d.name === fileName);
    if (existing) {
      // Update existing content
      setDocs((prev) =>
        prev.map((d) => (d.id === existing.id ? { ...d, content, updatedAt: Date.now() } : d))
      );
      setActiveDocId(existing.id);
    } else {
      const newId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newDoc: MobileDoc = {
        id: newId,
        name: fileName,
        content: content ?? '',
        updatedAt: Date.now(),
      };
      setDocs((prev) => [newDoc, ...prev]);
      setActiveDocId(newId);
    }
    setActiveTab('editor');
    setEditorSubMode('edit');
    showToast(`Opened ${fileName}`);
  }, []);

  // Check for file passed from Android Intent ("Open with KnowTheMD")
  const checkAndroidPendingFile = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.AndroidFileOpener) {
        const raw = window.AndroidFileOpener.getPendingFile();
        if (raw) {
          const payload = JSON.parse(raw);
          if (payload && payload.hasFile && typeof payload.content === 'string') {
            const fileName = payload.name || 'Opened_Document.md';
            openDocumentDirectly(fileName, payload.content);
            window.AndroidFileOpener.clearPendingFile();
          }
        }
      }
    } catch (e) {
      console.error('Error reading Android pending file:', e);
    }
  }, [openDocumentDirectly]);

  useEffect(() => {
    // 1. Check immediately on mount
    checkAndroidPendingFile();

    // 2. Poll after short intervals in case the native bridge connects slightly after JS loads
    const t1 = setTimeout(checkAndroidPendingFile, 200);
    const t2 = setTimeout(checkAndroidPendingFile, 600);

    // 3. Register global listener for live file intent while app is in background
    window.onAndroidFileOpened = (payloadStr: string) => {
      try {
        const payload = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
        if (payload && payload.hasFile && typeof payload.content === 'string') {
          const fileName = payload.name || 'Opened_Document.md';
          openDocumentDirectly(fileName, payload.content);
          if (window.AndroidFileOpener) {
            window.AndroidFileOpener.clearPendingFile();
          }
        }
      } catch (e) {
        console.error('Error handling live Android file intent:', e);
      }
    };

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      delete window.onAndroidFileOpened;
    };
  }, [checkAndroidPendingFile, openDocumentDirectly]);

  // Update content
  const handleContentChange = (newContent: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === activeDocId ? { ...d, content: newContent, updatedAt: Date.now() } : d
      )
    );
  };

  // Create new mobile doc (blank or from template)
  const handleNewDoc = (initialContent?: string, name?: string) => {
    const id = `doc_${Date.now()}`;
    const newDoc: MobileDoc = {
      id,
      name: name || `Note ${docs.length + 1}.md`,
      content: initialContent || '# Untitled Note\n\n',
      updatedAt: Date.now(),
    };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDocId(id);
    setActiveTab('editor');
    setEditorSubMode('edit');
    showToast(name ? `Created from ${name}` : 'New document created');
  };

  // Delete a document from recents
  const handleDeleteDoc = (id: string) => {
    setDocs((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      if (activeDocId === id && remaining.length > 0) {
        setActiveDocId(remaining[0].id);
      }
      return remaining;
    });
    showToast('Removed from recents');
  };

  // Open file via mobile file picker
  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.mdown,.mkd,.txt';
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        try {
          const content = await file.text();
          openDocumentDirectly(file.name, content);
        } catch (err) {
          console.error('Error reading file:', err);
          showToast('Failed to read file');
        }
      }
    };
    input.click();
  };

  // Share document using Native Web Share API
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: activeDoc.name,
          text: activeDoc.content,
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(activeDoc.content);
      showToast('Document copied to clipboard!');
    }
  };

  // Formatting from mobile toolbar
  const handleMobileFormat = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = activeDoc.content.substring(start, end);

    let insert = '';
    switch (type) {
      case 'h1':
        insert = `\n# ${selected || 'Heading 1'}\n`;
        break;
      case 'h2':
        insert = `\n## ${selected || 'Heading 2'}\n`;
        break;
      case 'bold':
        insert = `**${selected || 'bold'}**`;
        break;
      case 'italic':
        insert = `*${selected || 'italic'}*`;
        break;
      case 'code':
        insert = `\`${selected || 'code'}\``;
        break;
      case 'link':
        insert = `[${selected || 'link'}](url)`;
        break;
      case 'list':
        insert = `\n- ${selected || 'item'}\n`;
        break;
      case 'task':
        insert = `\n- [ ] ${selected || 'task'}\n`;
        break;
      case 'quote':
        insert = `\n> ${selected || 'quote'}\n`;
        break;
      default:
        break;
    }

    const updated =
      activeDoc.content.substring(0, start) + insert + activeDoc.content.substring(end);
    handleContentChange(updated);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 overflow-hidden select-none">
      {/* ── Update Banner (shows when a new APK version is on GitHub Releases) ── */}
      {updateChecker.state === 'available' && (
        <div className="w-full bg-slate-900/95 border-b border-cyan-500/25 px-4 py-2.5 flex items-center gap-3 z-50 shrink-0">
          <ArrowUpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-cyan-300">
              KnowTheMD v{updateChecker.latestVersion} is available!
            </p>
            <p className="text-[10px] text-slate-500 truncate">Tap Download to get the latest APK</p>
          </div>
          <a
            href={updateChecker.downloadUrl ?? updateChecker.releaseUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shrink-0 active:scale-95 transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
          <button
            onClick={updateChecker.dismiss}
            className="text-slate-600 hover:text-slate-400 p-1 shrink-0"
            aria-label="Dismiss update banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 1. Top Header Bar ── */}
      <header className="h-14 safe-top bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 transition-all">
        {activeTab === 'editor' ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/15 active:scale-95 transition-all text-xs font-semibold cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)] shrink-0"
              title="Return to Open File Menu"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Files</span>
            </button>
            <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-xs">
              {activeDoc.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <BrandLogo size={28} />
            <span className="text-sm font-bold text-white tracking-tight">
              KnowThe<span className="text-cyan-400">MD</span>
            </span>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mode switch */}
            <div className="flex items-center bg-slate-900 border border-cyan-500/20 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setEditorSubMode('edit')}
                className={`p-1.5 rounded-lg transition-all ${
                  editorSubMode === 'edit'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Edit Source"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEditorSubMode('preview')}
                className={`p-1.5 rounded-lg transition-all ${
                  editorSubMode === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Rendered Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEditorSubMode('reading')}
                className={`p-1.5 rounded-lg transition-all ${
                  editorSubMode === 'reading'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Distraction-Free Reading Mode"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Share Sheet */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-cyan-300 active:bg-cyan-500/20 rounded-xl transition-all cursor-pointer"
              title="Share Document"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* ── 2. Main Content Area ── */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* OPEN FILE MENU / DOCUMENT HUB (Default Landing Page) */}
        {activeTab === 'home' && (
          <MobileOpenFileMenu
            docs={docs}
            activeDocId={activeDocId}
            onSelectDoc={(id) => {
              setActiveDocId(id);
              setActiveTab('editor');
            }}
            onOpenFile={handleOpenFile}
            onNewDoc={handleNewDoc}
            onDeleteDoc={handleDeleteDoc}
            onResumeDoc={() => setActiveTab('editor')}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {/* EDITOR TAB */}
        {activeTab === 'editor' && (
          <div className="flex flex-col h-full overflow-hidden animate-fade-in">
            <div className="flex-1 overflow-hidden">
              {editorSubMode === 'reading' ? (
                <ReadingMode
                  content={activeDoc.content}
                  onExit={() => setEditorSubMode('edit')}
                />
              ) : editorSubMode === 'preview' ? (
                <Preview content={activeDoc.content} />
              ) : (
                <Editor
                  content={activeDoc.content}
                  onChange={handleContentChange}
                  textareaRef={textareaRef}
                  fontSize={fontSize}
                  showLineNumbers={false}
                />
              )}
            </div>

            {/* Keyboard accessory toolbar (visible in edit mode) */}
            {editorSubMode === 'edit' && (
              <MobileKeyboardToolbar
                onFormat={handleMobileFormat}
                onUndo={() => {}}
                onRedo={() => {}}
                canUndo={true}
                canRedo={false}
              />
            )}
          </div>
        )}

        {/* RECENT FILES TAB */}
        {activeTab === 'recent' && (
          <div className="p-4 h-full flex flex-col space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recently Modified ({docs.length})
              </h2>
              <GlassButton variant="primary" size="sm" icon={<FilePlus className="w-3.5 h-3.5" />} onClick={() => handleNewDoc()}>
                New
              </GlassButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDocId(doc.id);
                    setActiveTab('editor');
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer active:scale-[0.98] transition-all ${
                    doc.id === activeDocId
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.12)]'
                      : 'bg-slate-900/60 border-cyan-500/10 text-slate-300 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(doc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-5 overflow-y-auto h-full space-y-4 text-xs text-slate-300 animate-fade-in pb-24">
            <h2 className="text-base font-bold text-white mb-2">Mobile Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/15">
                <span className="font-semibold text-white">Font Size ({fontSize}px)</span>
                <input
                  type="range"
                  min="13"
                  max="22"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/15">
                <span className="font-semibold text-white">Theme</span>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                  Liquid Dark (Official)
                </span>
              </div>

              {/* OTA Updates Section */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Over-The-Air Updates</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Current Version</span>
                  <span className="font-mono text-cyan-300">v1.0</span>
                </div>

                {updateChecker.state === 'available' ? (
                  <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-400/30 space-y-2">
                    <p className="text-xs font-semibold text-cyan-200">
                      New version v{updateChecker.latestVersion} is available!
                    </p>
                    <a
                      href={updateChecker.downloadUrl ?? updateChecker.releaseUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download &amp; Install APK
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      {updateChecker.state === 'checking'
                        ? 'Checking for updates...'
                        : updateChecker.state === 'up-to-date'
                        ? 'You have the latest version'
                        : 'Automatic check every 24h'}
                    </span>
                    <button
                      onClick={updateChecker.check}
                      disabled={updateChecker.state === 'checking'}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-cyan-500/20 text-cyan-300 text-xs hover:bg-slate-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${updateChecker.state === 'checking' ? 'animate-spin' : ''}`} />
                      Check Now
                    </button>
                  </div>
                )}
              </div>

              {/* Play Store Style About Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>About This App</span>
                  </div>
                  <span className="text-[10px] text-cyan-300">KnowTheTech</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Offered by KnowTheTech • Updated on Sept 18, 2026 • Rating 4.9 ★
                </p>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="w-full mt-2 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  View App Info (Play Store Style) &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── 3. Bottom Touch Navigation Bar ── */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* ── 4. Play Store Style About Modal ── */}
      <AboutAppModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onCheckUpdates={updateChecker.check}
      />

      {/* ── 5. Floating Feedback Toast ── */}
      {mobileToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 border border-cyan-500/40 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.6),0_0_15px_rgba(0,240,255,0.2)] text-xs text-white flex items-center gap-2 animate-fade-in pointer-events-none">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{mobileToast}</span>
        </div>
      )}
    </div>
  );
};
