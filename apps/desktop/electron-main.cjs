/**
 * KnowTheMD — Electron Main Process
 * ───────────────────────────────────
 * Responsibilities:
 *  - Create the BrowserWindow
 *  - Configure auto-updater (electron-updater → GitHub Releases)
 *  - Expose IPC handlers for the renderer (version, install-update)
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

// Prevent black screen issues on Windows by disabling GPU acceleration & shader disk caching conflicts
if (process.platform === 'win32') {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');
  app.commandLine.appendSwitch('disable-gpu-process-crash-limit');
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
  app.commandLine.appendSwitch('disable-gpu-program-cache');
}


// electron-updater is installed as a dependency — it handles GitHub Releases OTA.
let autoUpdater;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (e) {
  // Fallback: electron-updater not installed yet (dev environment without it)
  console.warn('[Updater] electron-updater not found — auto-update disabled:', e.message);
  autoUpdater = null;
}

// ─── Window ───────────────────────────────────────────────────────────────────

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'KnowTheMD — Read. Write. Understand Markdown.',
    backgroundColor: '#030712',
    icon: path.join(__dirname, 'dist', process.platform === 'win32' ? 'icon.ico' : 'logo.png'),
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Preload bridges the main/renderer processes via a narrow IPC API
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Fallback timer ensures window is displayed even if ready-to-show is delayed
  const showFallbackTimer = setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  }, 1200);

  // Gracefully show window once renderer is ready to avoid blank white flash
  mainWindow.once('ready-to-show', () => {
    clearTimeout(showFallbackTimer);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
    // Check for updates ~5 seconds after window is shown (non-blocking)
    if (autoUpdater) {
      setTimeout(() => {
        try {
          autoUpdater.checkForUpdates();
        } catch (e) {
          console.warn('[Updater] checkForUpdates failed:', e.message);
        }
      }, 5000);
    }
  });

  // Diagnostics and error listeners
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[Window] Failed to load URL:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Window] Renderer process gone:', details);
  });

  // DevTools shortcut: F12 or Ctrl+Shift+I (or Cmd+Option+I on Mac)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F12' || ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i')) {
        mainWindow.webContents.toggleDevTools();
        event.preventDefault();
      }
    }
  });

  // Remove default menu bar for a clean, distraction-free modern UI
  Menu.setApplicationMenu(null);

  // Load the built application
  const htmlPath = path.join(__dirname, 'dist', 'index.html');
  mainWindow.loadFile(htmlPath).catch((err) => {
    console.error('[Window] loadFile error:', err);
  });
}


// ─── Auto-Updater Setup ───────────────────────────────────────────────────────

function setupAutoUpdater() {
  if (!autoUpdater) return;

  // Disable auto-download — we download manually so we can show progress in the UI
  autoUpdater.autoDownload = false;
  // Install on next app quit (instead of immediately forcing quit)
  autoUpdater.autoInstallOnAppQuit = true;

  // ── Events ──

  autoUpdater.on('update-available', (info) => {
    console.log('[Updater] Update available:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      });
      // Start downloading immediately after notifying the UI
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[Updater] App is up to date:', info.version);
  });

  autoUpdater.on('download-progress', (progress) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('download-progress', {
        percent: Math.round(progress.percent),
        transferred: progress.transferred,
        total: progress.total,
        bytesPerSecond: progress.bytesPerSecond,
      });
      // Also update the taskbar progress bar on Windows
      mainWindow.setProgressBar(progress.percent / 100);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[Updater] Update downloaded:', info.version);
    // Clear taskbar progress
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setProgressBar(-1);
      mainWindow.webContents.send('update-downloaded', {
        version: info.version,
        releaseDate: info.releaseDate,
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('[Updater] Error:', err.message);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setProgressBar(-1);
      mainWindow.webContents.send('update-error', err.message);
    }
  });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

function setupIpcHandlers() {
  // Renderer requests app version
  ipcMain.handle('get-app-version', () => app.getVersion());

  // Renderer says "restart and install now"
  ipcMain.on('install-update', () => {
    if (autoUpdater) {
      autoUpdater.quitAndInstall(false, true);
    }
  });

  // Renderer manually triggers an update check
  ipcMain.on('check-for-updates', () => {
    if (autoUpdater) {
      try {
        autoUpdater.checkForUpdates();
      } catch (e) {
        console.warn('[Updater] Manual check failed:', e.message);
      }
    }
  });
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  setupIpcHandlers();
  setupAutoUpdater();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
