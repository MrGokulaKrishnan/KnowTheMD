import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo, GlassCard, GlassButton } from '@knowthemd/ui';
import { computeStats } from '@knowthemd/markdown-engine';
import { Editor, Preview, ReadingMode } from '@knowthemd/editor';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileKeyboardToolbar } from './components/MobileKeyboardToolbar';
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
} from 'lucide-react';

interface MobileDoc {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

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
  const [activeTab, setActiveTab] = useState<MobileTab>('editor');
  const [editorSubMode, setEditorSubMode] = useState<'edit' | 'preview' | 'reading'>('edit');
  const [docs, setDocs] = useState<MobileDoc[]>([
    {
      id: 'doc_1',
      name: 'Welcome.md',
      content: SAMPLE_MOBILE_MD,
      updatedAt: Date.now(),
    },
  ]);
  const [activeDocId, setActiveDocId] = useState<string>('doc_1');
  const [fontSize, setFontSize] = useState<number>(15);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const stats = React.useMemo(() => computeStats(activeDoc.content), [activeDoc.content]);

  // Update content
  const handleContentChange = (newContent: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === activeDocId ? { ...d, content: newContent, updatedAt: Date.now() } : d
      )
    );
  };

  // Create new mobile doc
  const handleNewDoc = () => {
    const id = `doc_${Date.now()}`;
    const newDoc: MobileDoc = {
      id,
      name: `Note ${docs.length + 1}.md`,
      content: '# Untitled Note\n\n',
      updatedAt: Date.now(),
    };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDocId(id);
    setActiveTab('editor');
    setEditorSubMode('edit');
  };

  // Open file via mobile file picker
  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const content = await file.text();
        const id = `doc_${Date.now()}`;
        const newDoc: MobileDoc = {
          id,
          name: file.name,
          content,
          updatedAt: Date.now(),
        };
        setDocs((prev) => [newDoc, ...prev]);
        setActiveDocId(id);
        setActiveTab('editor');
        setEditorSubMode('preview');
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
      alert('Document copied to clipboard!');
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
      {/* 1. Mobile Header */}
      <header className="h-14 safe-top bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <BrandLogo size={24} />
          <span className="text-sm font-semibold text-white truncate max-w-[130px]">
            {activeDoc.name}
          </span>
        </div>

        {activeTab === 'editor' && (
          <div className="flex items-center gap-1.5">
            {/* Mode switch */}
            <div className="flex items-center bg-slate-900 border border-cyan-500/20 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setEditorSubMode('edit')}
                className={`p-1.5 rounded ${
                  editorSubMode === 'edit'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400'
                }`}
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEditorSubMode('preview')}
                className={`p-1.5 rounded ${
                  editorSubMode === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400'
                }`}
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEditorSubMode('reading')}
                className={`p-1.5 rounded ${
                  editorSubMode === 'reading'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400'
                }`}
                title="Reading"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Share Sheet */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-cyan-300 active:bg-cyan-500/20 rounded-lg"
              title="Share Document"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* 2. Main Content Area according to activeTab */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'editor' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {editorSubMode === 'reading' ? (
                <ReadingMode
                  content={activeDoc.content}
                  lightMode={theme === 'light'}
                  onExit={() => setEditorSubMode('edit')}
                />
              ) : editorSubMode === 'preview' ? (
                <Preview content={activeDoc.content} lightMode={theme === 'light'} />
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

        {activeTab === 'home' && (
          <div className="p-5 overflow-y-auto h-full space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">KnowTheMD Mobile</h2>
                <p className="text-xs text-slate-400">Read. Write. Understand Markdown.</p>
              </div>
              <BrandLogo size={36} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleNewDoc}
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex flex-col items-center justify-center text-center gap-2 active:bg-cyan-500/15 transition-colors cursor-pointer"
              >
                <FilePlus className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-semibold text-white">New Document</span>
              </button>
              <button
                onClick={handleOpenFile}
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex flex-col items-center justify-center text-center gap-2 active:bg-cyan-500/15 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-6 h-6 text-sky-400" />
                <span className="text-xs font-semibold text-white">Open File</span>
              </button>
            </div>

            {/* Document Metrics Card */}
            <GlassCard>
              <div className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Current Document Stats
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <div className="text-base font-bold text-white">{stats.words}</div>
                  <div className="text-[10px] text-slate-400">Words</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <div className="text-base font-bold text-white">{stats.lines}</div>
                  <div className="text-[10px] text-slate-400">Lines</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <div className="text-base font-bold text-white">{stats.readingTimeMinutes}m</div>
                  <div className="text-[10px] text-slate-400">Read Time</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase text-cyan-400 tracking-wider">
                My Documents ({docs.length})
              </h3>
              <GlassButton variant="primary" size="sm" icon={<FilePlus className="w-3.5 h-3.5" />} onClick={handleNewDoc}>
                New
              </GlassButton>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDocId(doc.id);
                    setActiveTab('editor');
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    doc.id === activeDocId
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                      : 'bg-slate-900/60 border-cyan-500/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(doc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold uppercase text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recently Modified
            </h3>
            <div className="space-y-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDocId(doc.id);
                    setActiveTab('editor');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Just now</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-5 overflow-y-auto h-full space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white mb-2">Mobile Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                <span>Font Size ({fontSize}px)</span>
                <input
                  type="range"
                  min="13"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="accent-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                <span>Theme</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 capitalize"
                >
                  {theme}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/15 space-y-1">
                <div className="font-semibold text-white">KnowTheMD Mobile v1.0.0</div>
                <div className="text-slate-400 text-[11px]">Android & iOS Ready • Local-First</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Bottom Touch Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};
