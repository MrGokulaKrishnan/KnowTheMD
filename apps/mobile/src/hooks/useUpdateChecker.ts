/**
 * useUpdateChecker
 * ─────────────────
 * Fetches the latest KnowTheMD release from the GitHub Releases API and
 * compares it to the current bundled version. If a newer version exists,
 * surfaces the download URL so the UI can prompt the user.
 *
 * - Runs once on mount (with a 3-second delay to avoid blocking app start)
 * - No native modules required — uses the Fetch API (available in Capacitor/WebView)
 * - Caches last-checked timestamp in localStorage to avoid hammering the API
 *   (minimum 24-hour interval between automatic checks)
 */

import { useState, useEffect, useCallback } from 'react';

const CURRENT_VERSION = '1.0';
const GITHUB_API_URL =
  'https://api.github.com/repos/MrGokulaKrishnan/KnowTheMD/releases/latest';
const APK_ASSET_PATTERN = /\.apk$/i;
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LAST_CHECK_KEY = 'knowthemd_last_update_check';

export type UpdateCheckState = 'idle' | 'checking' | 'available' | 'up-to-date' | 'error';

export interface UpdateCheckResult {
  state: UpdateCheckState;
  latestVersion: string | null;
  downloadUrl: string | null;
  releaseUrl: string | null;
  errorMessage: string | null;
  check: () => void;
  dismiss: () => void;
}

/** Semantic version comparison — returns true if `a` > `b` */
function isNewer(a: string, b: string): boolean {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const [aMaj, aMin, aPatch] = parse(a);
  const [bMaj, bMin, bPatch] = parse(b);
  if (aMaj !== bMaj) return aMaj > bMaj;
  if (aMin !== bMin) return aMin > bMin;
  return (aPatch ?? 0) > (bPatch ?? 0);
}

async function fetchLatestRelease(): Promise<{
  version: string;
  apkUrl: string | null;
  releaseUrl: string;
}> {
  const res = await fetch(GITHUB_API_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  const data = await res.json();

  const version: string = (data.tag_name as string).replace(/^v/, '');
  const releaseUrl: string = data.html_url as string;

  // Find the APK asset in the release assets list
  const apkAsset = (data.assets as Array<{ name: string; browser_download_url: string }>).find(
    (asset) => APK_ASSET_PATTERN.test(asset.name)
  );

  return {
    version,
    apkUrl: apkAsset?.browser_download_url ?? null,
    releaseUrl,
  };
}

export function useUpdateChecker(): UpdateCheckResult {
  const [state, setState] = useState<UpdateCheckState>('idle');
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [releaseUrl, setReleaseUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setState('checking');
    setErrorMessage(null);
    try {
      const { version, apkUrl, releaseUrl: rUrl } = await fetchLatestRelease();
      localStorage.setItem(LAST_CHECK_KEY, String(Date.now()));

      if (isNewer(version, CURRENT_VERSION)) {
        setLatestVersion(version);
        setDownloadUrl(apkUrl);
        setReleaseUrl(rUrl);
        setState('available');
      } else {
        setState('up-to-date');
        // Auto-clear "up-to-date" after 3 seconds
        setTimeout(() => setState('idle'), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message ?? 'Network error');
      setState('error');
      setTimeout(() => setState('idle'), 6000);
    }
  }, []);

  // Run automatically on mount with a 3s delay + 24h throttle
  useEffect(() => {
    const timer = setTimeout(() => {
      const lastCheck = Number(localStorage.getItem(LAST_CHECK_KEY) ?? '0');
      const timeSinceLastCheck = Date.now() - lastCheck;
      if (timeSinceLastCheck >= CHECK_INTERVAL_MS) {
        runCheck();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [runCheck]);

  const dismiss = useCallback(() => {
    setState('idle');
    setErrorMessage(null);
  }, []);

  return {
    state,
    latestVersion,
    downloadUrl,
    releaseUrl,
    errorMessage,
    check: runCheck,
    dismiss,
  };
}
