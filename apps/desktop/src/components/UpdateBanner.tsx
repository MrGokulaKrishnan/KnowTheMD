/**
 * UpdateBanner
 * ─────────────
 * Slim banner that appears at the top of the desktop app when an update
 * is available, downloading, ready to install, or errored.
 *
 * Design: Liquid Glass Dark — matches the rest of the app.
 * Position: fixed, below the toolbar, above the tab bar.
 */

import React from 'react';
import {
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-react';
import { AutoUpdaterResult } from '../hooks/useAutoUpdater';

interface UpdateBannerProps extends AutoUpdaterResult {}

/** Human-readable file size */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  state,
  updateInfo,
  progress,
  errorMessage,
  installUpdate,
  dismiss,
}) => {
  if (state === 'idle') return null;

  // ── Downloading ──────────────────────────────────────────────────────────
  if (state === 'downloading') {
    const pct = progress?.percent ?? 0;
    const speed = progress ? formatBytes(progress.bytesPerSecond) + '/s' : '';
    return (
      <div className="relative w-full bg-slate-900/95 border-b border-cyan-500/20 px-4 py-2 flex items-center gap-3 z-50">
        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-cyan-300">
              Downloading update v{updateInfo?.version}…
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
              {pct}% · {speed}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Available (download just started, brief flash) ────────────────────────
  if (state === 'available') {
    return (
      <div className="relative w-full bg-slate-900/95 border-b border-cyan-500/20 px-4 py-2 flex items-center gap-3 z-50">
        <Download className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="flex-1 text-xs text-slate-300">
          <span className="text-cyan-300 font-semibold">Update v{updateInfo?.version} found</span>
          {' — downloading in background…'}
        </span>
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ── Ready to install ──────────────────────────────────────────────────────
  if (state === 'ready') {
    return (
      <div className="relative w-full bg-slate-900/95 border-b border-emerald-500/25 px-4 py-2 flex items-center gap-3 z-50">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="flex-1 text-xs text-slate-300">
          <span className="text-emerald-300 font-semibold">
            KnowTheMD v{updateInfo?.version} is ready
          </span>
          {' — restart to apply the update.'}
        </span>
        <button
          onClick={installUpdate}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-colors shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Restart & Install
        </button>
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          aria-label="Dismiss — install on next restart"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="relative w-full bg-slate-900/95 border-b border-red-500/20 px-4 py-2 flex items-center gap-3 z-50">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        <span className="flex-1 text-xs text-slate-400 truncate">
          <span className="text-red-400 font-semibold">Update error: </span>
          {errorMessage ?? 'Unknown error'}
        </span>
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};
