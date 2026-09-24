import React from 'react';
import { GlassDropdown, DropdownItem } from '@knowthemd/ui';
import {
  Sidebar as SidebarIcon,
  Edit3,
  Eye,
  Columns,
  BookOpen,
  Bold,
  Italic,
  Code,
  Link,
  List,
  CheckSquare,
  Table,
  Search,
  Download,
  Command,
  ListTree,
  Maximize2,
  FileDown,
  FolderOpen,
} from 'lucide-react';

export type WorkspaceMode = 'edit' | 'preview' | 'split' | 'reading';

export interface ToolbarProps {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isOutlineOpen: boolean;
  onToggleOutline: () => void;
  onFormat: (type: string) => void;
  onSearch: () => void;
  onCommandPalette: () => void;
  onExport: (format: 'pdf' | 'html' | 'txt' | 'md') => void;
  onOpenFileMenu?: () => void;
  isFileMenuOpen?: boolean;
  lightMode?: boolean;
  onToggleTheme?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  onModeChange,
  isSidebarOpen,
  onToggleSidebar,
  isOutlineOpen,
  onToggleOutline,
  onFormat,
  onSearch,
  onCommandPalette,
  onExport,
  onOpenFileMenu,
  isFileMenuOpen,
}) => {
  const exportItems: DropdownItem[] = [
    {
      id: 'pdf',
      label: 'Export to PDF...',
      icon: <FileDown className="w-4 h-4 text-cyan-400" />,
      onClick: () => onExport('pdf'),
    },
    {
      id: 'html',
      label: 'Export Standalone HTML',
      icon: <FileDown className="w-4 h-4 text-sky-400" />,
      onClick: () => onExport('html'),
    },
    {
      id: 'txt',
      label: 'Export Plain Text',
      icon: <FileDown className="w-4 h-4 text-slate-400" />,
      onClick: () => onExport('txt'),
    },
    {
      id: 'md',
      label: 'Export Clean Markdown',
      icon: <FileDown className="w-4 h-4 text-emerald-400" />,
      onClick: () => onExport('md'),
    },
  ];

  return (
    <header className="h-12 bg-slate-900/70 backdrop-blur-xl border-b border-cyan-500/15 px-3 flex items-center justify-between select-none shrink-0 z-30">
      {/* Left controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition-colors ${
            isSidebarOpen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800'
          }`}
          title="Toggle Sidebar (Ctrl+\)"
          aria-label="Toggle Sidebar"
        >
          <SidebarIcon className="w-4 h-4" />
        </button>

        {onOpenFileMenu && (
          <button
            onClick={onOpenFileMenu}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all font-medium ${
              isFileMenuOpen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800'
            }`}
            title="Open File Menu / Start Workspace"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Files</span>
          </button>
        )}

        <div className="h-4 w-px bg-cyan-500/15 mx-1" />

        {/* Mode switcher segmented button */}
        <div className="flex items-center bg-slate-950/70 p-0.5 rounded-xl border border-cyan-500/20 text-xs">
          <button
            onClick={() => onModeChange('edit')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              mode === 'edit'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Edit Mode (Source)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onModeChange('split')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              mode === 'split'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Mode (Dual Pane)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              mode === 'preview'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Preview Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => onModeChange('reading')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              mode === 'reading'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Reading Mode (Distraction-Free)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read</span>
          </button>
        </div>
      </div>

      {/* Center Formatting Buttons (active in Edit & Split modes) */}
      {(mode === 'edit' || mode === 'split') && (
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded-xl border border-cyan-500/10">
          <button
            onClick={() => onFormat('bold')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('italic')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('code')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Inline Code (`code`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('link')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Link ([title](url))"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('list')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Unordered List (- item)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('task')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Task List (- [ ] task)"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormat('table')}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-lg transition-colors"
            title="Markdown Table"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Right Tools */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          onClick={onSearch}
          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
          title="Find & Replace (Ctrl+F)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Command Palette */}
        <button
          onClick={onCommandPalette}
          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
          title="Command Palette (Ctrl+Shift+P)"
        >
          <Command className="w-4 h-4" />
        </button>

        {/* Export Dropdown */}
        <GlassDropdown
          align="right"
          trigger={
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-xs font-medium transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </div>
          }
          items={exportItems}
        />

        {/* Outline Toggle */}
        <button
          onClick={onToggleOutline}
          className={`p-1.5 rounded-lg border transition-colors ${
            isOutlineOpen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800'
          }`}
          title="Document Outline"
        >
          <ListTree className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
