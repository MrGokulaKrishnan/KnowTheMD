/**
 * useAutoUpdater
 * ──────────────
 * React hook that bridges the Electron auto-updater IPC events into
 * clean React state. Works only inside Electron — gracefully no-ops in
 * browser/web context (where window.electronUpdater is undefined).
 *
 * States:
 *   idle          → no update activity
 *   available     → update found, download starting automatically
 *   downloading   → download in progress (0–100%)
 *   ready         → downloaded, awaiting user confirmation to install
 *   error         → something went wrong (non-fatal, shown as toast)
 */

import { useState, useEffect, useCallback } from 'react';

export type UpdaterState = 'idle' | 'available' | 'downloading' | 'ready' | 'error';

export interface UpdateInfo {
  version: string;
  releaseDate?: string;
}

export interface DownloadProgress {
  percent: number;       // 0–100
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export interface AutoUpdaterResult {
  state: UpdaterState;
  updateInfo: UpdateInfo | null;
  progress: DownloadProgress | null;
  errorMessage: string | null;
  installUpdate: () => void;
  checkForUpdates: () => void;
  dismiss: () => void;
}

/** True when running inside Electron with the preload bridge available */
const isElectron = (): boolean =>
  typeof window !== 'undefined' && typeof (window as any).electronUpdater !== 'undefined';

export function useAutoUpdater(): AutoUpdaterResult {
  const [state, setState] = useState<UpdaterState>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isElectron()) return;

    const updater = (window as any).electronUpdater;

    updater.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo({ version: info.version, releaseDate: info.releaseDate });
      setState('available');
    });

    updater.onDownloadProgress((prog: DownloadProgress) => {
      setProgress(prog);
      setState('downloading');
    });

    updater.onUpdateDownloaded((info: UpdateInfo) => {
      setUpdateInfo({ version: info.version, releaseDate: info.releaseDate });
      setProgress(null);
      setState('ready');
    });

    updater.onUpdateError((err: string) => {
      setErrorMessage(err);
      setProgress(null);
      setState('error');
      // Auto-dismiss error after 8 seconds
      setTimeout(() => setState('idle'), 8000);
    });

    return () => {
      updater.removeAllListeners('update-available');
      updater.removeAllListeners('download-progress');
      updater.removeAllListeners('update-downloaded');
      updater.removeAllListeners('update-error');
    };
  }, []);

  const installUpdate = useCallback(() => {
    if (!isElectron()) return;
    (window as any).electronUpdater.installUpdate();
  }, []);

  const checkForUpdates = useCallback(() => {
    if (!isElectron()) return;
    setState('idle');
    (window as any).electronUpdater.checkForUpdates();
  }, []);

  const dismiss = useCallback(() => {
    setState('idle');
    setErrorMessage(null);
    setProgress(null);
  }, []);

  return { state, updateInfo, progress, errorMessage, installUpdate, checkForUpdates, dismiss };
}
