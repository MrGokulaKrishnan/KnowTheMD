import React, { useState } from 'react';
import { GlassModal, GlassButton } from '@knowthemd/ui';
import {
  Sliders,
  Type,
  Palette,
  FileCode,
  FolderSync,
  Download,
  Keyboard,
  Eye,
  ShieldCheck,
  Info,
} from 'lucide-react';

export interface EditorSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  autoCloseBrackets: boolean;
  theme: 'dark' | 'light' | 'system';
  autosaveIntervalSec: number;
  pdfPageSize: 'A4' | 'Letter';
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onOpenDiagnostics?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenDiagnostics,
}) => {
  const [activeTab, setActiveTab] = useState<string>('editor');

  const tabs = [
    { id: 'general', label: 'General', icon: <Sliders className="w-4 h-4" /> },
    { id: 'editor', label: 'Editor', icon: <Type className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'markdown', label: 'Markdown', icon: <FileCode className="w-4 h-4" /> },
    { id: 'files', label: 'Files & Recovery', icon: <FolderSync className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="KnowTheMD Preferences" maxWidth="2xl">
      <div className="flex flex-col sm:flex-row gap-6 min-h-[380px]">
        {/* Navigation Sidebar */}
        <div className="w-full sm:w-44 shrink-0 space-y-1 border-b sm:border-b-0 sm:border-r border-cyan-500/15 pb-4 sm:pb-0 sm:pr-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Setting Panel Content */}
        <div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-5 pr-1">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">General Application</h4>
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-cyan-500/15">
                <div>
                  <div className="text-white font-medium">Restore Previous Session</div>
                  <div className="text-slate-500 text-[11px]">Re-open open documents upon app launch</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-cyan-500/15">
                <div>
                  <div className="text-white font-medium">Automatic Crash Recovery Drafts</div>
                  <div className="text-slate-500 text-[11px]">Continuously cache unsaved drafts in local storage</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4" />
              </label>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Editor Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Font Size ({settings.fontSize}px)</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                    className="accent-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Line Height ({settings.lineHeight})</span>
                  <input
                    type="range"
                    min="1.2"
                    max="2.2"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                    className="accent-cyan-400"
                  />
                </div>
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                  <span>Line Numbers</span>
                  <input
                    type="checkbox"
                    checked={settings.lineNumbers}
                    onChange={(e) => onUpdateSettings({ lineNumbers: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                  <span>Word Wrap</span>
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => onUpdateSettings({ wordWrap: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                  <span>Auto-close Brackets & Quotes</span>
                  <input
                    type="checkbox"
                    checked={settings.autoCloseBrackets}
                    onChange={(e) => onUpdateSettings({ autoCloseBrackets: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Visual Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => onUpdateSettings({ theme: 'dark' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/50 border-cyan-500/15 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold mb-1">Liquid Dark</div>
                  <div className="text-[10px] text-slate-500">Deep Obsidian & Glow</div>
                </button>
                <button
                  onClick={() => onUpdateSettings({ theme: 'light' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.theme === 'light'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/50 border-cyan-500/15 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold mb-1">Frosted Light</div>
                  <div className="text-[10px] text-slate-500">High Contrast Glass</div>
                </button>
                <button
                  onClick={() => onUpdateSettings({ theme: 'system' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.theme === 'system'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/50 border-cyan-500/15 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold mb-1">System</div>
                  <div className="text-[10px] text-slate-500">Match OS Appearance</div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Markdown Engine Options</h4>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                <span>GitHub Flavored Markdown (GFM) Tables</span>
                <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                <span>KaTeX Math Formulas ($...$, $$...$$)</span>
                <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                <span>YAML Frontmatter Parsing</span>
                <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-cyan-500/10">
                <span>Strict Security HTML Sanitization</span>
                <input type="checkbox" checked disabled className="accent-cyan-400 w-4 h-4" />
              </label>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Files & Autosave</h4>
              <div className="flex items-center justify-between">
                <span>Autosave Interval: {settings.autosaveIntervalSec} seconds</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.autosaveIntervalSec}
                  onChange={(e) => onUpdateSettings({ autosaveIntervalSec: Number(e.target.value) })}
                  className="accent-cyan-400"
                />
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                KnowTheMD continuously caches active modifications to local storage so you never lose a keystroke during crashes or accidental restarts.
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Export Settings</h4>
              <div className="flex items-center justify-between">
                <span>PDF Target Page Size</span>
                <select
                  value={settings.pdfPageSize}
                  onChange={(e) => onUpdateSettings({ pdfPageSize: e.target.value as any })}
                  className="bg-slate-950 border border-cyan-500/20 rounded-lg px-2.5 py-1 text-slate-200 outline-none"
                >
                  <option value="A4">A4 (210mm × 297mm)</option>
                  <option value="Letter">US Letter (8.5in × 11in)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white mb-2">Keyboard Shortcuts</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>New Document</span>
                  <kbd className="font-mono text-cyan-400">Ctrl/Cmd + N</kbd>
                </div>
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>Open File</span>
                  <kbd className="font-mono text-cyan-400">Ctrl/Cmd + O</kbd>
                </div>
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>Save File</span>
                  <kbd className="font-mono text-cyan-400">Ctrl/Cmd + S</kbd>
                </div>
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>Find & Replace</span>
                  <kbd className="font-mono text-cyan-400">Ctrl/Cmd + F</kbd>
                </div>
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>Command Palette</span>
                  <kbd className="font-mono text-cyan-400">Ctrl+Shift+P</kbd>
                </div>
                <div className="p-2 rounded bg-slate-950/50 flex justify-between">
                  <span>Toggle Sidebar</span>
                  <kbd className="font-mono text-cyan-400">Ctrl/Cmd + \</kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Accessibility & Contrast</h4>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/15 text-[11px] leading-relaxed">
                KnowTheMD adheres strictly to WCAG 2.1 AA and AAA standards. All text meets or exceeds a 4.5:1 contrast ratio. Animations gracefully obey your OS <code className="text-cyan-300">prefers-reduced-motion</code> setting.
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Privacy Guarantee</h4>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/25 text-[11px] leading-relaxed">
                <div className="text-emerald-400 font-bold mb-1">100% Local-First & Offline</div>
                Your Markdown files and keystrokes never leave your machine. KnowTheMD does not transmit telemetry, analytics, or document content.
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">KnowTheMD</h4>
                <div className="text-cyan-400 font-mono text-[11px]">Version 1.0.0 (Production Core)</div>
                <div className="text-slate-400 text-xs italic mt-1">Read. Write. Understand Markdown.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/15 space-y-1.5 text-[11px]">
                <div>Supported Platforms: Windows, macOS, Linux, Android, iOS</div>
                <div>Design: Liquid Glass & Glossy Blue Gradient</div>
              </div>
              {onOpenDiagnostics && (
                <GlassButton variant="secondary" size="sm" onClick={onOpenDiagnostics}>
                  Open Diagnostic Logs
                </GlassButton>
              )}
            </div>
          )}
        </div>
      </div>
    </GlassModal>
  );
};
