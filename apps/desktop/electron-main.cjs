/**
 * KnowTheMD — Electron Main Process
 * ───────────────────────────────────
 * Responsibilities:
 *  - Enforce single-instance lock to prevent zombie processes and file conflicts
 *  - Handle Windows and macOS native file opening (.md / .markdown / .txt)
 *  - Create the BrowserWindow with hardware-accelerated, errorless rendering
 *  - Configure auto-updater (electron-updater → GitHub Releases)
 *  - Expose IPC handlers for the renderer (initial-file, version, install-update)
 */

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ─── Single-Instance Guard ───────────────────────────────────────────────────
// Ensures only one instance runs at a time. If user opens a .md file while app
// is already open, the file is passed to the running instance instead of creating
// conflicting processes that cause black screens.
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// ─── Platform & Display Optimization ─────────────────────────────────────────
if (process.platform === 'win32') {
  // Disable native window occlusion calculation to prevent blank/black windows on Windows 10/11
  app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
  app.commandLine.appendSwitch('enable-font-antialiasing');
  app.commandLine.appendSwitch('high-dpi-support', '1');
}

// Handle child / GPU process gone gracefully so the main window continues rendering
app.on('child-process-gone', (_event, details) => {
  console.warn('[Electron] Child process gone:', details.type, details.reason);
});

// ─── Native File Association Helpers ─────────────────────────────────────────
function extractFilePathFromArgs(argv) {
  if (!argv || !Array.isArray(argv)) return null;
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg || arg.startsWith('--') || arg.startsWith('-') || arg === '.') continue;
    try {
      const cleanPath = path.resolve(arg.replace(/^"|"$/g, ''));
      if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isFile()) {
        const ext = path.extname(cleanPath).toLowerCase();
        if (['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.txt', ''].includes(ext)) {
          return cleanPath;
        }
      }
    } catch (e) {
      // Non-file argument, skip
    }
  }
  return null;
}

function readMarkdownFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 25 * 1024 * 1024) {
      console.warn('[Electron] File too large to open directly (>25MB):', filePath);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      name: path.basename(filePath),
      path: filePath,
      content,
    };
  } catch (err) {
    console.error('[Electron] Error reading file:', filePath, err);
    return null;
  }
}

let pendingFilePayload = null;
const initialArgFile = extractFilePathFromArgs(process.argv);
if (initialArgFile) {
  pendingFilePayload = readMarkdownFile(initialArgFile);
}

function sendFileToWindow(filePath) {
  const payload = readMarkdownFile(filePath);
  if (!payload) return;
  pendingFilePayload = payload;

  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
    mainWindow.webContents.send('file-opened', payload);
  }
}

// Handle second instance (when user opens a file while app is running)
app.on('second-instance', (_event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (!mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();

    const filePath = extractFilePathFromArgs(commandLine);
    if (filePath) {
      sendFileToWindow(filePath);
    }
  }
});

// macOS native file open handler
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  sendFileToWindow(filePath);
});

// ─── Auto-Updater ─────────────────────────────────────────────────────────────
let autoUpdater;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (e) {
  console.warn('[Updater] electron-updater not found — auto-update disabled:', e.message);
  autoUpdater = null;
}

// ─── Window Management ────────────────────────────────────────────────────────
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
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Gracefully show window once renderer is ready
  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
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

  // Also ensure window is displayed once content finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  });

  // Fallback timer ensures window is displayed even if events are delayed
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  }, 1000);

  // Diagnostics and recovery listeners
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('[Window] Failed to load URL:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Window] Renderer process gone:', details);
    if (details.reason !== 'clean-exit' && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.reload();
    }
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

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    console.log('[Updater] Update available:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      });
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
      mainWindow.setProgressBar(progress.percent / 100);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[Updater] Update downloaded:', info.version);
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
  // Renderer requests initial file if opened via file association
  ipcMain.handle('get-initial-file', () => {
    const file = pendingFilePayload;
    pendingFilePayload = null;
    return file;
  });

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
