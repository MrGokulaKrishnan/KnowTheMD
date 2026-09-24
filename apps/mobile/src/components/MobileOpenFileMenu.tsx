import React, { useState } from 'react';
import { BrandLogo, GlassCard } from '@knowthemd/ui';
import {
  FolderOpen,
  FilePlus,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Trash2,
  BookOpen,
  CheckSquare,
  Users,
  Code2,
  StickyNote,
  ArrowRight,
  Info,
  Settings,
} from 'lucide-react';

export interface MobileOpenFileMenuDoc {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface MobileOpenFileMenuProps {
  docs: MobileOpenFileMenuDoc[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onOpenFile: () => void;
  onNewDoc: (initialContent?: string, name?: string) => void;
  onDeleteDoc: (id: string) => void;
  onResumeDoc: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
}

const TEMPLATES = [
  {
    id: 'checklist',
    title: 'Task Checklist',
    desc: 'Interactive to-do list with checkable items',
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
    desc: 'Agenda, key decisions, and action items',
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
    desc: 'Architecture, schema, code blocks & APIs',
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
  {
    id: 'scratchpad',
    title: 'Quick Scratchpad',
    desc: 'Fast, minimal markdown scratch note',
    icon: <StickyNote className="w-4 h-4 text-amber-400" />,
    badge: 'Ideas',
    name: 'Scratchpad.md',
    content: `# Quick Scratchpad

Capture thoughts, snippets, links, and ideas here.

- Idea 1: 
- Note: 
`,
  },
];

function getRelativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function countWords(str: string): number {
  const matches = str.match(/\b\w+\b/g);
  return matches ? matches.length : 0;
}

export const MobileOpenFileMenu: React.FC<MobileOpenFileMenuProps> = ({
  docs,
  activeDocId,
  onSelectDoc,
  onOpenFile,
  onNewDoc,
  onDeleteDoc,
  onResumeDoc,
  onOpenAbout,
  onOpenSettings,
}) => {
  const [templateFilter, setTemplateFilter] = useState<string | null>(null);
  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-6 pb-24 animate-fade-in">
      {/* ── 1. Top Brand Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-transform active:scale-95">
            <BrandLogo size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white tracking-tight">KnowTheMD</h1>
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                Mobile
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Read. Write. Understand Markdown.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAbout}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
            title="About App"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 2. Primary Action Cards: Open File & New Document ── */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Workspace Actions
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Open File Button (Primary Hero Card) */}
          <button
            onClick={onOpenFile}
            className="group relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 active:scale-[0.98] transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.12)] cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all pointer-events-none" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-[10px] font-mono text-cyan-300 font-semibold border border-cyan-500/20">
                .md • .txt
              </span>
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Open File
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Browse Markdown files from device storage, downloads, or external SD card.
            </p>
          </button>

          {/* New Document Button */}
          <button
            onClick={() => onNewDoc()}
            className="group relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 border border-slate-700/60 hover:border-cyan-500/40 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.4)] cursor-pointer overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sky-400 group-hover:scale-110 transition-transform">
                <FilePlus className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 font-semibold border border-slate-700">
                Blank Note
              </span>
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              New Document
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Create a clean, distraction-free blank Markdown canvas ready to type.
            </p>
          </button>
        </div>
      </div>

      {/* ── 3. Resume Active Document Card (if loaded) ── */}
      {activeDoc && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-slate-900/80 border border-cyan-500/25 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Currently Loaded</span>
                <span className="text-[10px] text-slate-500">• {countWords(activeDoc.content)} words</span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{activeDoc.name}</h3>
            </div>
          </div>

          <button
            onClick={onResumeDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer"
          >
            <span>Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 4. Recent Documents Section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Documents ({docs.length})
          </div>
        </div>

        {docs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-medium text-slate-400">No documents in memory</p>
            <p className="text-[11px] text-slate-500">Tap "Open File" above to pick a file from your device.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {docs.map((doc) => {
              const isCurrent = doc.id === activeDocId;
              const words = countWords(doc.content);
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`group relative flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900/90 border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.12)]'
                      : 'bg-slate-900/60 border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate text-xs sm:text-sm group-hover:text-cyan-300 transition-colors">
                          {doc.name}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{getRelativeTime(doc.updatedAt)}</span>
                        <span>•</span>
                        <span>{words} words</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {docs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDoc(doc.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove from recents"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-1 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. Quick Markdown Templates ── */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Start from Template
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => onNewDoc(tmpl.content, tmpl.name)}
              className="text-left p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-900/90 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
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
  );
};
