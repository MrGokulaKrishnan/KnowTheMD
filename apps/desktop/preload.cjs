/**
 * KnowTheMD Preload Script
 * ─────────────────────────
 * Safely bridges the Electron main process (Node.js) and the renderer process
 * (React UI) through a narrow, explicitly-typed API surface.
 *
 * Security constraints:
 *  - contextIsolation: true  → renderer cannot access Node APIs directly
 *  - sandbox: true           → renderer runs in a restricted OS sandbox
 *  - Only explicitly whitelisted channels are exposed
 */

const { contextBridge, ipcRenderer } = require('electron');

// ─── Native File Opener API ───────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronFileOpener', {
  /** Get initial file if app was launched via double-clicking a .md file */
  getInitialFile: () => ipcRenderer.invoke('get-initial-file'),

  /** Subscribe to file opened events (e.g. user opens file while app is running) */
  onFileOpened: (cb) => {
    const handler = (_event, fileData) => cb(fileData);
    ipcRenderer.on('file-opened', handler);
    return () => ipcRenderer.removeListener('file-opened', handler);
  },
});

// ─── Auto-Updater API ─────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronUpdater', {
  /** Subscribe to update-available event */
  onUpdateAvailable: (cb) =>
    ipcRenderer.on('update-available', (_event, info) => cb(info)),

  /** Subscribe to download-progress event */
  onDownloadProgress: (cb) =>
    ipcRenderer.on('download-progress', (_event, progress) => cb(progress)),

  /** Subscribe to update-downloaded event (ready to install) */
  onUpdateDownloaded: (cb) =>
    ipcRenderer.on('update-downloaded', (_event, info) => cb(info)),

  /** Subscribe to update-error event */
  onUpdateError: (cb) =>
    ipcRenderer.on('update-error', (_event, err) => cb(err)),

  /** Trigger restart-and-install */
  installUpdate: () => ipcRenderer.send('install-update'),

  /** Manually trigger an update check */
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),

  /** Remove all listeners for a channel (cleanup on unmount) */
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// ─── App Info API ─────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronApp', {
  /** Returns the current app version from package.json */
  getVersion: () => ipcRenderer.invoke('get-app-version'),
});
