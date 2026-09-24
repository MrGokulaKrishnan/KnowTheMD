import React from 'react';
import { BrandLogo, GlassCard, GlassButton } from '@knowthemd/ui';
import { RecentItem, DocumentItem } from '../fileSystem';
import {
  FolderOpen,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Users,
  Code2,
  FileText,
  Keyboard,
  Info,
  ExternalLink,
  Folder,
} from 'lucide-react';

export interface OpenFileMenuProps {
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onNewDoc: (initialContent?: string, name?: string) => void;
  recentFiles: RecentItem[];
  onOpenRecent: (item: RecentItem) => void;
  activeDoc?: DocumentItem;
  onGoToEditor: () => void;
  onOpenAbout: () => void;
}

const TEMPLATES = [
  {
    id: 'checklist',
    title: 'Task Checklist',
    desc: 'Interactive to-do list with checkboxes and priority markers',
    icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
    badge: 'Productivity',
    name: 'Checklist.md',
    content: `# Daily Tasks & Checklist

> **Focus on high-leverage activities first.**

---

### Priority Tasks
- [x] Review project requirements
- [ ] Implement core Markdown parser
- [ ] Test on Android and desktop devices

### Later Today
- [ ] Document release notes
- [ ] Clean up unused assets
`,
  },
  {
    id: 'meeting',
    title: 'Meeting Notes',
    desc: 'Structured meeting template with agenda, notes, and action items',
    icon: <Users className="w-4 h-4 text-cyan-400" />,
    badge: 'Collaboration',
    name: 'Meeting-Notes.md',
    content: `# Meeting Notes: Project Sync

- **Date**: ${new Date().toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
- **Time**: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
- **Participants**: Team Members

---

## Agenda
1. Architecture & Performance Review
2. Mobile & Desktop File Associations
3. Deployment Roadmap

## Discussion Notes
- Verified Android Intent filters for \`.md\` file opening.
- Optimized UI rendering for 60fps animations and fluid responsiveness.

## Action Items
- [ ] Publish signed APK package
- [ ] Verify clean zipalign check
`,
  },
  {
    id: 'techspec',
    title: 'Technical Spec',
    desc: 'Engineering architecture, data structures, and code blocks',
    icon: <Code2 className="w-4 h-4 text-sky-400" />,
    badge: 'Engineering',
    name: 'Technical-Spec.md',
    content: `# Engineering Specification: KnowTheMD

## Overview
A modern, offline-first, high-precision Markdown engine and editor with GFM support.

## Architecture
\`\`\`text
[ Client Storage ] <---> [ CommonMark AST Engine ] <---> [ Liquid Glass UI ]
\`\`\`

## Key Endpoints / Modules
\`\`\`typescript
interface MarkdownDocument {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}
\`\`\`

## Requirements
1. Sub-16ms split-screen rendering.
2. Complete APK Signature Scheme v2 & v3 compatibility.
`,
  },
];

export const OpenFileMenu: React.FC<OpenFileMenuProps> = ({
  onOpenFile,
  onOpenFolder,
  onNewDoc,
  recentFiles,
  onOpenRecent,
  activeDoc,
  onGoToEditor,
  onOpenAbout,
}) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-b from-[#030712] via-[#050e24] to-[#030712] p-6 sm:p-10 select-none animate-fade-in flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8 pb-12">
        {/* ── Brand Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/15 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              <BrandLogo size={52} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">KnowTheMD</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Read. Write. Understand Markdown. Modern offline-first Markdown suite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeDoc && (
              <GlassButton
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={onGoToEditor}
                className="shadow-[0_0_15px_rgba(0,240,255,0.25)]"
              >
                Go to Editor
              </GlassButton>
            )}
            <button
              onClick={onOpenAbout}
              className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer"
              title="About App"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Primary Action Grid ── */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Start Workspace
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Open File Button */}
            <button
              onClick={onOpenFile}
              className="group relative text-left p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400/60 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.08)] cursor-pointer overflow-hidden flex flex-col justify-between h-40"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Ctrl+O
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Open File
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Open any Markdown (.md, .markdown, .txt) file from your storage.
                </p>
              </div>
            </button>

            {/* New Document Button */}
            <button
              onClick={() => onNewDoc()}
              className="group relative text-left p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-700/60 hover:border-cyan-500/40 active:scale-[0.98] transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden flex flex-col justify-between h-40"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-800 text-sky-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Ctrl+N
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  New Document
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Start writing a fresh, blank Markdown note with split-screen preview.
                </p>
              </div>
            </button>

            {/* Open Folder Button */}
            <button
              onClick={onOpenFolder}
              className="group relative text-left p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-700/60 hover:border-cyan-500/40 active:scale-[0.98] transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden flex flex-col justify-between h-40"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-800 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Workspace
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Open Folder
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Browse a full directory of Markdown files in the sidebar tree.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── Recent Files Section ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recent Files ({recentFiles.length})
            </div>
          </div>

          {recentFiles.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-medium text-slate-400">No recent files yet</p>
              <p className="text-[11px] text-slate-500">
                Click "Open File" above to load a document.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recentFiles.slice(0, 8).map((file, idx) => (
                <div
                  key={file.path || idx}
                  onClick={() => onOpenRecent(file)}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-900/90 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-cyan-300 shrink-0 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {file.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                        {file.path || 'In-memory'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Templates Section ── */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Start from Template
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onNewDoc(tmpl.content, tmpl.name)}
                className="text-left p-4 rounded-xl bg-slate-900/50 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-900/80 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform">
                      {tmpl.icon}
                    </div>
                    <span className="font-semibold text-white text-xs group-hover:text-cyan-300 transition-colors">
                      {tmpl.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
