import React, { useState } from 'react';
import { BrandLogo, GlassButton } from '@knowthemd/ui';
import { RecentItem, DocumentItem } from '../fileSystem';
import {
  FileText,
  FolderOpen,
  Plus,
  Clock,
  Settings,
  Activity,
  Folder,
  ChevronRight,
  ChevronDown,
  Trash2,
  Info,
} from 'lucide-react';


export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  openDocs: DocumentItem[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onCloseDoc: (id: string) => void;
  onNewDoc: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  recentFiles: RecentItem[];
  onOpenRecent: (item: RecentItem) => void;
  onOpenSettings: () => void;
  onOpenDiagnostics: () => void;
  onOpenAbout?: () => void;
  onGoHome?: () => void;
  lightMode?: boolean;
}


export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  openDocs,
  activeDocId,
  onSelectDoc,
  onCloseDoc,
  onNewDoc,
  onOpenFile,
  onOpenFolder,
  recentFiles,
  onOpenRecent,
  onOpenSettings,
  onOpenDiagnostics,
  onOpenAbout,
  onGoHome,
}) => {

  const [showRecents, setShowRecents] = useState(true);
  const [showWorkspace, setShowWorkspace] = useState(true);

  if (!isOpen) return null;

  return (
    <aside
      className="w-64 h-full shrink-0 bg-slate-950/80 backdrop-blur-xl border-r border-cyan-500/15 flex flex-col z-20 select-none overflow-hidden"
      aria-label="Application Sidebar"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-cyan-500/15 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl p-1 -m-1 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          title="KnowTheMD Homepage (Click to open homepage / files)"
        >
          <BrandLogo size={28} showText={true} />
        </button>
      </div>

      {/* Primary Actions */}
      <div className="p-3 border-b border-cyan-500/10 flex items-center gap-1.5">
        <GlassButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onNewDoc} className="flex-1">
          New File
        </GlassButton>
        <button
          onClick={onOpenFile}
          className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/15 transition-colors"
          title="Open File (Ctrl+O)"
          aria-label="Open File"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace & Files Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {/* Open Documents */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 px-2 mb-1.5 flex items-center justify-between">
            <span>Open Documents</span>
            <span className="text-slate-500 font-mono">{openDocs.length}</span>
          </div>
          <div className="space-y-0.5">
            {openDocs.map((doc) => {
              const isActive = doc.id === activeDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                      : 'text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  {doc.isDirty && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)]" title="Unsaved changes" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Files */}
        <div>
          <button
            onClick={() => setShowRecents(!showRecents)}
            className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center justify-between hover:text-cyan-400"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recent Files
            </span>
            {showRecents ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {showRecents && (
            <div className="space-y-0.5 mt-1">
              {recentFiles.length === 0 ? (
                <div className="px-2 py-2 text-[11px] text-slate-500 italic">No recent files</div>
              ) : (
                recentFiles.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenRecent(item)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-900/50 cursor-pointer truncate transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-cyan-500/15 flex items-center justify-between text-slate-400 bg-slate-950/90">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 text-xs hover:text-cyan-300 transition-colors p-1.5 rounded-lg hover:bg-cyan-500/10 cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <div className="flex items-center gap-1">
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-1.5 rounded-lg hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
              title="About This App (KnowTheTech)"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onOpenDiagnostics}
            className="p-1.5 rounded-lg hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
            title="Diagnostic Logs"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
