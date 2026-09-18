/**
 * Central Release Configuration
 * ─────────────────────────────
 * Single source of truth for all platform downloads.
 *
 * IMPORTANT: Only add entries here when a real, validated artifact exists.
 * Never add placeholder SHA256 values or fake file sizes.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** Distinguishes how a platform is distributed */
export type ReleaseType = 'download' | 'store' | 'coming-soon';

export interface ArchRelease {
  /** Human-readable architecture label shown in the UI */
  arch: string;
  /** File extension label, e.g. ".apk" */
  format: string;
  /** Human-readable file size, e.g. "4.05 MB" */
  fileSize: string;
  /** Exact filename as it will be saved on the user's disk */
  fileName: string;
  /** Absolute path served by Firebase Hosting, e.g. "/downloads/KnowTheMD-1.0.0-android.apk" */
  downloadUrl: string;
  /** SHA-256 checksum of the deployed file (lowercase hex) */
  sha256: string;
  /** Whether this artifact is actually available for download right now */
  available: boolean;
}

export interface PlatformRelease {
  id: string;
  osName: string;
  badge: string;
  icon: string;
  systemReq: string;
  recommendedArch: string;
  /** How this platform is distributed */
  type: ReleaseType;
  /** App Store or Play Store URL — used when type === 'store' */
  storeUrl?: string;
  architectures: ArchRelease[];
}

// ─── Release Metadata ────────────────────────────────────────────────────────

export const APP_VERSION = '1.0.0';
export const RELEASE_DATE = 'September 15, 2026';

// ─── Platform Releases ───────────────────────────────────────────────────────

export const RELEASES: PlatformRelease[] = [
  // ── Windows ─────────────────────────────────────────────────────────────
  {
    id: 'windows',
    osName: 'Windows',
    badge: '10 / 11',
    icon: 'windows',
    systemReq: 'Windows 10 64-bit or Windows 11',
    recommendedArch: 'exe',
    type: 'download',
    architectures: [
      {
        arch: 'Windows x64 Setup Installer (.exe)',
        format: '.exe',
        fileSize: '97.5 MB',
        fileName: 'KnowTheMD_Windows_x64_Setup.exe',
        // SHA-256 verified 2026-09-16 against local build artifact
        downloadUrl: '/downloads/KnowTheMD_Windows_x64_Setup.exe',
        sha256: '51ff0213afa196b5b92f356c8f99e95c86803027adb09a502a6492e9d0f96c93',
        available: true,
      },
      {
        arch: 'Windows x64 Portable Application (.zip)',
        format: '.zip',
        fileSize: '134.7 MB',
        fileName: 'KnowTheMD_Windows_x64.zip',
        // SHA-256 verified 2026-09-16 against local build artifact
        downloadUrl: '/downloads/KnowTheMD_Windows_x64.zip',
        sha256: '1a431a26349a59386d5c42e5c75241f005a94009bd91d2f1e56d2fb2a8f9d2ea',
        available: true,
      },
    ],
  },

  // ── macOS ────────────────────────────────────────────────────────────────
  {
    id: 'macos',
    osName: 'macOS',
    badge: '12.0+ Monterey',
    icon: 'apple',
    systemReq: 'macOS 12.0 or later (Apple Silicon & Intel)',
    recommendedArch: '.dmg',
    type: 'download',
    architectures: [
      {
        arch: 'macOS Universal (Apple Silicon + Intel)',
        format: '.dmg',
        fileSize: '~110 MB',
        fileName: 'KnowTheMD-1.0.0-universal.dmg',
        // Built via GitHub Actions macOS runner — download from GitHub Releases
        downloadUrl: 'https://github.com/MrGokulaKrishnan/KnowTheMD/releases/download/v1.0.0/KnowTheMD-1.0.0-universal.dmg',
        sha256: '',
        available: true,
      },
      {
        arch: 'macOS Apple Silicon (M1/M2/M3/M4)',
        format: '.dmg',
        fileSize: '~105 MB',
        fileName: 'KnowTheMD-1.0.0-arm64.dmg',
        // Built via GitHub Actions macOS runner — download from GitHub Releases
        downloadUrl: 'https://github.com/MrGokulaKrishnan/KnowTheMD/releases/download/v1.0.0/KnowTheMD-1.0.0-arm64.dmg',
        sha256: '',
        available: true,
      },
      {
        arch: 'macOS Intel (x64)',
        format: '.dmg',
        fileSize: '~115 MB',
        fileName: 'KnowTheMD-1.0.0-x64.dmg',
        // Built via GitHub Actions macOS runner — download from GitHub Releases
        downloadUrl: 'https://github.com/MrGokulaKrishnan/KnowTheMD/releases/download/v1.0.0/KnowTheMD-1.0.0-x64.dmg',
        sha256: '',
        available: true,
      },
    ],
  },

  // ── Linux ────────────────────────────────────────────────────────────────
  {
    id: 'linux',
    osName: 'Linux',
    badge: 'AppImage / Deb',
    icon: 'linux',
    systemReq: 'glibc >= 2.31 (Ubuntu, Debian, Fedora, Arch)',
    recommendedArch: '.AppImage',
    type: 'download',
    architectures: [
      {
        arch: 'Linux x64 Universal AppImage',
        format: '.AppImage',
        fileSize: '~120 MB',
        fileName: 'KnowTheMD-1.0.0-amd64.AppImage',
        // Built via GitHub Actions Ubuntu runner — download from GitHub Releases
        downloadUrl: 'https://github.com/MrGokulaKrishnan/KnowTheMD/releases/download/v1.0.0/KnowTheMD-1.0.0-amd64.AppImage',
        sha256: '',
        available: true,
      },
      {
        arch: 'Debian / Ubuntu Package',
        format: '.deb',
        fileSize: '~80 MB',
        fileName: 'knowthemd_1.0.0_amd64.deb',
        // Built via GitHub Actions Ubuntu runner — download from GitHub Releases
        downloadUrl: 'https://github.com/MrGokulaKrishnan/KnowTheMD/releases/download/v1.0.0/knowthemd_1.0.0_amd64.deb',
        sha256: '',
        available: true,
      },
    ],
  },


  // ── Android ──────────────────────────────────────────────────────────────
  {
    id: 'android',
    osName: 'Android',
    badge: '7.0+',
    icon: 'android',
    systemReq: 'Android 7.0 (API 24) or later',
    recommendedArch: 'apk',
    type: 'download',
    architectures: [
      {
        arch: 'Android Universal APK (all architectures)',
        format: '.apk',
        fileSize: '4.68 MB',
        fileName: 'KnowTheMD-1.0.0-android.apk',
        // Direct APK — NOT wrapped in a ZIP.
        // SHA-256 verified 2026-09-16 against Gradle debug build output:
        //   apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
        downloadUrl: '/downloads/KnowTheMD-1.0.0-android.apk',
        sha256: 'bbf538807a90d58bf17a881f68cdef2de7a21fe94a207355c0a2c803c7b8c339',
        available: true,
      },
    ],
  },

  // ── iOS ──────────────────────────────────────────────────────────────────
  // iOS apps cannot be distributed via direct website download.
  // Distribution is exclusively through the Apple App Store or TestFlight.
  {
    id: 'ios',
    osName: 'iOS & iPadOS',
    badge: '16.0+',
    icon: 'ios',
    systemReq: 'iOS 16.0 or iPadOS 16.0 or later',
    recommendedArch: 'store',
    type: 'store',
    // storeUrl: 'https://apps.apple.com/app/knowthemd/id000000000',
    architectures: [],
  },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Detect the user's operating system from the browser User Agent.
 * Returns one of the RELEASES[].id strings.
 */
export function detectUserPlatform(): string {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

/**
 * Return the recommended downloadable architecture for a given platform.
 * Returns null if the platform uses type 'store' or 'coming-soon'.
 */
export function getRecommendedArch(platformId: string): ArchRelease | null {
  const release = RELEASES.find((r) => r.id === platformId);
  if (!release || release.type !== 'download') return null;
  const recommended = release.architectures.find(
    (a) => a.available && a.format === `.${release.recommendedArch}`
  );
  return recommended || release.architectures.find((a) => a.available) || null;
}

/**
 * Triggers a browser download for the recommended artifact of the given platform.
 * Only works for platforms with type === 'download' and an available arch.
 * Returns null for 'store' or 'coming-soon' platforms.
 */
export function triggerDirectDownload(platformId?: string): { fileName: string; format: string } | null {
  const targetId = platformId || detectUserPlatform();
  const arch = getRecommendedArch(targetId);
  if (!arch) return null;

  const link = document.createElement('a');
  link.href = arch.downloadUrl;
  link.setAttribute('download', arch.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { fileName: arch.fileName, format: arch.format };
}

