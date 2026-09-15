/**
 * KnowTheMD Desktop Native File System & Session Manager
 */

export interface DocumentItem {
  id: string;
  name: string;
  path?: string;
  content: string;
  isDirty: boolean;
  fileHandle?: any;
}

export interface RecentItem {
  id: string;
  name: string;
  path?: string;
  lastOpened: number;
}

export interface DiagnosticLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
  details?: string;
}

// Global in-memory diagnostic logs
const diagnosticLogs: DiagnosticLog[] = [];

export function logDiagnostic(level: 'info' | 'warn' | 'error', category: string, message: string, details?: string) {
  const entry: DiagnosticLog = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    details,
  };
  diagnosticLogs.unshift(entry);
  if (diagnosticLogs.length > 200) diagnosticLogs.pop();
  console.log(`[Diagnostic][${entry.level.toUpperCase()}][${category}] ${message}`);
}

export function getDiagnosticLogs(): DiagnosticLog[] {
  return [...diagnosticLogs];
}

// Supported Markdown file extensions
export const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkdn', '.mkd'];

// Recent Files Persistence
const RECENT_FILES_KEY = 'knowthemd_recent_files';
const SESSION_TABS_KEY = 'knowthemd_session_tabs';

export function getRecentFiles(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_FILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentFile(name: string, path?: string) {
  try {
    const recents = getRecentFiles().filter((r) => r.name !== name);
    recents.unshift({
      id: `recent_${Date.now()}`,
      name,
      path: path || name,
      lastOpened: Date.now(),
    });
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recents.slice(0, 15)));
    logDiagnostic('info', 'File', `Added ${name} to recent files`);
  } catch (e) {
    logDiagnostic('warn', 'File', 'Could not save recent files', String(e));
  }
}

/**
 * Open Markdown file via Native File System Access API with fallback
 */
export async function openMarkdownFile(): Promise<{ name: string; content: string; handle?: any } | null> {
  try {
    if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Markdown Documents',
            accept: {
              'text/markdown': ['.md', '.markdown', '.mdown', '.mkdn', '.mkd'],
              'text/plain': ['.txt'],
            },
          },
        ],
        multiple: false,
      });

      const file = await handle.getFile();
      const content = await file.text();
      addRecentFile(file.name);
      logDiagnostic('info', 'File', `Opened file: ${file.name} (${content.length} chars)`);
      return { name: file.name, content, handle };
    } else {
      // Fallback via HTML input
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.mdown,.mkdn,.mkd,.txt';
        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const file = input.files[0];
            const content = await file.text();
            addRecentFile(file.name);
            logDiagnostic('info', 'File', `Opened file (fallback): ${file.name}`);
            resolve({ name: file.name, content });
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  } catch (err: any) {
    if (err.name === 'AbortError') return null; // User cancelled
    logDiagnostic('error', 'File', 'Failed to open file', String(err));
    throw new Error(
      "KnowTheMD couldn't open this file. The file may be in use, moved, or permissions were denied."
    );
  }
}

/**
 * Save Markdown document to current handle or trigger Save As
 */
export async function saveMarkdownFile(
  content: string,
  handle?: any,
  defaultName = 'document.md'
): Promise<{ name: string; handle?: any }> {
  try {
    if (handle && 'createWritable' in handle) {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      const file = await handle.getFile();
      logDiagnostic('info', 'File', `Saved file: ${file.name}`);
      return { name: file.name, handle };
    } else {
      return await saveAsMarkdownFile(content, defaultName);
    }
  } catch (err: any) {
    logDiagnostic('error', 'File', 'Failed to save document', String(err));
    throw new Error(
      "KnowTheMD couldn't save your file. Please check folder write permissions and try again."
    );
  }
}

/**
 * Save As Markdown file
 */
export async function saveAsMarkdownFile(
  content: string,
  defaultName = 'document.md'
): Promise<{ name: string; handle?: any }> {
  try {
    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description: 'Markdown File (*.md)',
            accept: { 'text/markdown': ['.md'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      const file = await handle.getFile();
      addRecentFile(file.name);
      logDiagnostic('info', 'File', `Saved As: ${file.name}`);
      return { name: file.name, handle };
    } else {
      // Browser download fallback
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultName;
      a.click();
      URL.revokeObjectURL(url);
      addRecentFile(defaultName);
      logDiagnostic('info', 'File', `Saved As (download): ${defaultName}`);
      return { name: defaultName };
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    logDiagnostic('error', 'File', 'Save As failed', String(err));
    throw new Error(
      "KnowTheMD couldn't complete the Save As operation. Please verify write permissions."
    );
  }
}

/**
 * Session Tab Persistence
 */
export function saveSessionTabs(docs: DocumentItem[], activeId: string) {
  try {
    const data = {
      docs: docs.map((d) => ({
        id: d.id,
        name: d.name,
        content: d.content,
        isDirty: d.isDirty,
      })),
      activeId,
    };
    localStorage.setItem(SESSION_TABS_KEY, JSON.stringify(data));
  } catch (e) {
    // Storage quota
  }
}

export function loadSessionTabs(): { docs: DocumentItem[]; activeId: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_TABS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
