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

export const APP_VERSION = 'v1.0';
export const RELEASE_DATE = 'September 18, 2026';

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
        fileSize: '97.8 MB',
        fileName: 'KnowTheMD_Windows_x64_Setup.exe',
        downloadUrl: '/downloads/KnowTheMD_Windows_x64_Setup.exe',
        sha256: 'afd307abe8deb9662f342debd8a3538047a432c9f5eb1f1bf2d590598d75a322',
        available: true,
      },
      {
        arch: 'Windows x64 Setup Archive (.zip)',
        format: '.zip',
        fileSize: '97.8 MB',
        fileName: 'KnowTheMD_Windows_x64_Setup.zip',
        downloadUrl: '/downloads/KnowTheMD_Windows_x64_Setup.zip',
        sha256: '762926d61009c7cb5b8138f08d080c1c8589eecd15cd299e4cfd6e0aea123ea9',
        available: true,
      },
      {
        arch: 'Windows x64 Portable Application (.zip)',
        format: '.zip',
        fileSize: '134.7 MB',
        fileName: 'KnowTheMD_Windows_x64.zip',
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
    recommendedArch: 'zip',
    type: 'download',
    architectures: [
      {
        arch: 'macOS Standalone Application (.zip)',
        format: '.zip',
        fileSize: '315.4 KB',
        fileName: 'KnowTheMD-1.0.0-macos.zip',
        downloadUrl: '/downloads/KnowTheMD-1.0.0-macos.zip',
        sha256: '479f6189c0d5515bbca1e841fe94ac81d362008c640d8b4a56f03b37a57fd7af',
        available: true,
      },
    ],
  },

  // ── Linux ────────────────────────────────────────────────────────────────
  {
    id: 'linux',
    osName: 'Linux',
    badge: 'tar.gz Portable',
    icon: 'linux',
    systemReq: 'glibc >= 2.31 (Ubuntu, Debian, Fedora, Arch)',
    recommendedArch: 'tar.gz',
    type: 'download',
    architectures: [
      {
        arch: 'Linux x64 Portable Executable Package (.tar.gz)',
        format: '.tar.gz',
        fileSize: '111.4 MB',
        fileName: 'KnowTheMD-1.0.0-linux-x64.tar.gz',
        downloadUrl: '/downloads/KnowTheMD-1.0.0-linux-x64.tar.gz',
        sha256: '66488734ad2cb615ce8c94843f50e27b91352e55b5aa955825df41a550891cd1',
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
        arch: 'Android Universal APK (.apk)',
        format: '.apk',
        fileSize: '4.7 MB',
        fileName: 'KnowTheMD-v1.0-android.apk',
        downloadUrl: '/downloads/KnowTheMD-v1.0-android.apk',
        sha256: '4ba8758a82b612f3a572b0547a44268e7e85c151b513e270d2cbd5c53c91a4ac',
        available: true,
      },
      {
        arch: 'Android Package Archive (.zip)',
        format: '.zip',
        fileSize: '4.4 MB',
        fileName: 'KnowTheMD-v1.0-android.zip',
        downloadUrl: '/downloads/KnowTheMD-v1.0-android.zip',
        sha256: 'dd04e9a890609d263364d1ef4354fe690c5b1e0112301d4a1471bc02b20f6966',
        available: true,
      },
    ],
  },

  // ── iOS & iPadOS ─────────────────────────────────────────────────────────
  {
    id: 'ios',
    osName: 'iOS & iPadOS',
    badge: '16.0+',
    icon: 'ios',
    systemReq: 'iOS 16.0 or iPadOS 16.0 or later',
    recommendedArch: 'mobileconfig',
    type: 'download',
    architectures: [
      {
        arch: 'Apple Mobile Configuration Profile (1-Tap Install)',
        format: '.mobileconfig',
        fileSize: '82.0 KB',
        fileName: 'KnowTheMD-iOS.mobileconfig',
        downloadUrl: '/downloads/KnowTheMD-iOS.mobileconfig',
        sha256: '5243dc7755886433721ced1098b882e935b84c397462eaa0bf05176d403274f0',
        available: true,
      },
      {
        arch: 'iOS Sideload Application Package (.ipa)',
        format: '.ipa',
        fileSize: '183.9 KB',
        fileName: 'KnowTheMD-1.0.0.ipa',
        downloadUrl: '/downloads/KnowTheMD-1.0.0.ipa',
        sha256: '42ae8aaf1c19545fb952df9f6e91fe00d30aa02132a60861598c770bbc49bca5',
        available: true,
      },
      {
        arch: 'iOS Sideload Archive (.zip)',
        format: '.zip',
        fileSize: '183.7 KB',
        fileName: 'KnowTheMD-1.0.0-ios.zip',
        downloadUrl: '/downloads/KnowTheMD-1.0.0-ios.zip',
        sha256: '38b5592d617b7cbc5526f32e38334d026e4c49d0eb802c8b0ef48061aa959d75',
        available: true,
      },
    ],
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

