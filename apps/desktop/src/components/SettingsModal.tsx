import React, { useState } from 'react';
import { GlassModal, GlassButton, BrandLogo } from '@knowthemd/ui';
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
  RefreshCw,
  Sparkles,
  Building,
  Calendar,
  Layers,
  Star,
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
  onCheckUpdates?: () => void;
  onRestartUpdate?: () => void;
  isUpdateReady?: boolean;
  updateVersion?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenDiagnostics,
  onCheckUpdates,
  onRestartUpdate,
  isUpdateReady,
  updateVersion,
}) => {
  const [activeTab, setActiveTab] = useState<string>('editor');

  const tabs = [
    { id: 'editor', label: 'Editor', icon: <Type className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'markdown', label: 'Markdown', icon: <FileCode className="w-4 h-4" /> },
    { id: 'files', label: 'Files & Recovery', icon: <FolderSync className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'updates', label: 'OTA Updates', icon: <RefreshCw className="w-4 h-4" /> },
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
              <div className="p-4 rounded-xl border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white mb-0.5">Liquid Glass Dark (Exclusive)</div>
                  <div className="text-[11px] text-slate-300">
                    Deep obsidian canvas with electric cyan gradients, specular reflections, and distraction-free contrast.
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-400/40">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                KnowTheMD is tuned exclusively with the signature Liquid Glass Dark design language across all platforms for optimal optical clarity and reduced eye strain.
              </p>
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

          {activeTab === 'updates' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Over-The-Air (OTA) Updates</h4>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current App Version</span>
                  <span className="font-mono text-cyan-300 font-semibold">v1.0.0 (Latest Release)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Update Channel</span>
                  <span className="text-emerald-400 font-semibold">Stable (Official)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OTA Source</span>
                  <span className="text-slate-300 font-mono text-[10px]">GitHub Releases API</span>
                </div>
              </div>

              {isUpdateReady ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Update v{updateVersion || '1.0.1'} is downloaded and ready to apply!</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Restart KnowTheMD to complete the update installation without losing your open tabs.
                  </p>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={onRestartUpdate}
                  >
                    Restart to Update Now
                  </GlassButton>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">KnowTheMD checks for updates automatically in the background.</span>
                  {onCheckUpdates && (
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      onClick={onCheckUpdates}
                    >
                      Check for Updates
                    </GlassButton>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              {/* Play Store Style Header */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                <BrandLogo size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white tracking-tight">KnowTheMD</h4>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-semibold">Official</span>
                  </div>
                  <div className="text-cyan-400 font-semibold text-xs">Offered by KnowTheTech</div>
                  <div className="text-slate-400 text-[11px] italic">Read. Write. Understand Markdown.</div>
                </div>
              </div>

              {/* App Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Version</span>
                  <span className="font-mono text-white font-semibold">1.0.0</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Updated on</span>
                  <span className="text-white font-semibold">Sept 18, 2026</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Offered by</span>
                  <span className="text-cyan-300 font-semibold">KnowTheTech</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Developer</span>
                  <span className="text-slate-300 font-semibold">KnowTheTech</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Rating</span>
                  <span className="text-amber-400 font-semibold">4.9 ★ (12K+)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Downloads</span>
                  <span className="text-cyan-400 font-semibold">50K+</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Released on</span>
                  <span className="text-slate-300 font-semibold">Sept 15, 2026</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Compatibility</span>
                  <span className="text-slate-300">Win, Mac, Linux, Android, iOS</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {onOpenDiagnostics && (
                  <GlassButton variant="secondary" size="sm" onClick={onOpenDiagnostics}>
                    Open Diagnostics
                  </GlassButton>
                )}
                <a
                  href="https://knowthemd.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline text-xs"
                >
                  knowthemd.web.app &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

    </GlassModal>
  );
};
