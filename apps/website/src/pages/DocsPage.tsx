import React, { useState } from 'react';
import { GlassCard } from '@knowthemd/ui';
import {
  BookOpen,
  FolderOpen,
  Edit,
  Code2,
  Keyboard,
  Palette,
  FileDown,
  Smartphone,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'opening-files', title: 'Opening Markdown', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'editing', title: 'Editing Markdown', icon: <Edit className="w-4 h-4" /> },
    { id: 'syntax', title: 'Markdown Syntax', icon: <Code2 className="w-4 h-4" /> },
    { id: 'shortcuts', title: 'Keyboard Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'themes', title: 'Liquid Glass Themes', icon: <Palette className="w-4 h-4" /> },
    { id: 'export-pdf', title: 'Exporting PDF', icon: <FileDown className="w-4 h-4" /> },
    { id: 'mobile', title: 'Mobile Touch Usage', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'faq', title: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Documentation
        </h1>
        <p className="text-slate-400 text-sm">
          Everything you need to master reading, writing, and exporting in KnowTheMD.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation index */}
        <aside className="space-y-1">
          {sections.map((sec) => {
            const isActive = sec.id === activeSection;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'
                }`}
              >
                {sec.icon}
                <span>{sec.title}</span>
              </button>
            );
          })}
        </aside>

        {/* Content pane */}
        <main className="md:col-span-3">
          <GlassCard className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed">
            {activeSection === 'getting-started' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Getting Started with KnowTheMD
                </h2>
                <p>
                  KnowTheMD is an offline-first desktop and mobile markdown workspace. To begin:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Download the binary for your operating system from the Download page.</li>
                  <li>Install and launch KnowTheMD. No account or registration is required.</li>
                  <li>
                    Press <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + N</kbd> to create a new
                    document, or drag and drop any existing <code className="text-cyan-300">.md</code> file
                    into the window.
                  </li>
                </ol>
              </div>
            )}

            {activeSection === 'opening-files' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Opening Markdown Files
                </h2>
                <p>KnowTheMD supports multiple convenient ways to open documents:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Native File Dialog</strong>: Click the folder icon or press <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + O</kbd>.</li>
                  <li><strong>Drag and Drop</strong>: Drag any Markdown file from File Explorer or Finder directly into KnowTheMD.</li>
                  <li><strong>Recent Files</strong>: Access your most recently opened files in the left sidebar.</li>
                  <li><strong>File Associations</strong>: Double-click any <code className="text-cyan-300">.md</code>, <code className="text-cyan-300">.markdown</code>, or <code className="text-cyan-300">.mkd</code> file.</li>
                </ul>
              </div>
            )}

            {activeSection === 'editing' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Editing Modes & Features
                </h2>
                <p>KnowTheMD provides three primary modes for writing:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Edit Mode</strong>: Clean source code view with line numbers and bracket auto-closing.</li>
                  <li><strong>Preview Mode</strong>: Beautifully rendered Liquid Glass Markdown preview.</li>
                  <li><strong>Split Mode</strong>: Synchronized dual-pane editor with proportional scrolling.</li>
                  <li><strong>Reading Mode</strong>: Full distraction-free technical reading layout.</li>
                </ul>
              </div>
            )}

            {activeSection === 'syntax' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Markdown Syntax & Math Reference
                </h2>
                <p>KnowTheMD supports all standard CommonMark, GitHub Flavored Markdown, and KaTeX math formulas:</p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/15 font-mono text-xs text-slate-200">
                  <p># Heading 1</p>
                  <p>## Heading 2</p>
                  <p>**Bold text** and *Italic text*</p>
                  <p>- [ ] Task item (uncompleted)</p>
                  <p>- [x] Task item (completed)</p>
                  <p>| Column 1 | Column 2 |</p>
                  <p>|---|---|</p>
                  <p>| Value A | Value B |</p>
                  <p>Inline math: $a^2 + b^2 = c^2$</p>
                  <p>Block math: $$\int_0^1 x^2 dx = \frac&#123;1&#125;&#123;3&#125;$$</p>
                </div>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Keyboard Shortcuts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>New Document</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + N</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>Open File</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + O</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>Save Document</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + S</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>Save As</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + Shift + S</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>Find & Replace</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + F</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 flex justify-between">
                    <span>Command Palette</span>
                    <kbd className="text-cyan-400 font-mono">Ctrl/Cmd + Shift + P</kbd>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'themes' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Liquid Glass Theme System
                </h2>
                <p>
                  KnowTheMD features two meticulously calibrated color schemes:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Liquid Dark</strong>: Deep obsidian black canvas with electric cyan highlights and subtle glowing specular reflections.</li>
                  <li><strong>Frosted Light</strong>: High-contrast cool white glass canvas with deep sapphire typography, meeting strict WCAG 2.1 AAA contrast benchmarks.</li>
                </ul>
              </div>
            )}

            {activeSection === 'export-pdf' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Exporting to PDF & HTML
                </h2>
                <p>
                  To export a document, click the <strong>Export</strong> button on the toolbar or open the Command Palette (<kbd className="text-cyan-400 font-mono">Ctrl+Shift+P</kbd>).
                </p>
                <p>
                  PDF exports utilize custom CSS paged media rules to ensure clean page numbering, headers, and code block formatting suitable for official documentation.
                </p>
              </div>
            )}

            {activeSection === 'mobile' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Mobile Touch Experience
                </h2>
                <p>
                  On Android and iOS devices, KnowTheMD switches to a dedicated touch UI featuring a bottom navigation bar and a sticky keyboard formatting toolbar for fast formatting without hunting through menus.
                </p>
              </div>
            )}

            {activeSection === 'troubleshooting' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Troubleshooting & Crash Recovery
                </h2>
                <p>
                  If you encounter an unexpected crash, KnowTheMD automatically retains your working draft in local storage. Simply re-open the app and your unsaved document will be automatically restored.
                </p>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-500/20 pb-2">
                  Frequently Asked Questions
                </h2>
                <p>
                  <strong>Q: Does KnowTheMD require internet access?</strong><br />
                  A: No. All core functionality operates completely offline.
                </p>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
};
