/**
 * Central Release Configuration
 * Direct local download artifacts with verifiable SHA-256 checksums
 */

export interface PlatformRelease {
  id: string;
  osName: string;
  badge: string;
  icon: string;
  systemReq: string;
  recommendedArch: string;
  architectures: {
    arch: string;
    format: string;
    fileSize: string;
    fileName: string;
    downloadUrl: string;
    sha256: string;
  }[];
}

export const APP_VERSION = '1.0.0';
export const RELEASE_DATE = 'September 15, 2026';

export const RELEASES: PlatformRelease[] = [
  {
    id: 'windows',
    osName: 'Windows',
    badge: '10 / 11',
    icon: 'windows',
    systemReq: 'Windows 10 64-bit or Windows 11',
    recommendedArch: 'x64',
    architectures: [
      {
        arch: 'Windows x64 Standalone Application (.zip)',
        format: '.zip',
        fileSize: '137.1 MB',
        fileName: 'KnowTheMD_Windows_x64.zip',
        downloadUrl: '/downloads/KnowTheMD_Windows_x64.zip',
        sha256: '47fb286a8fdfece7a4da05e51c2a3251ef172be645079258158cec0c2fa38254',
      },
    ],
  },
  {
    id: 'macos',
    osName: 'macOS',
    badge: '12.0+ Monterey',
    icon: 'apple',
    systemReq: 'macOS 12.0 or later (Apple Silicon & Intel)',
    recommendedArch: 'universal',
    architectures: [
      {
        arch: 'macOS Universal Disk Image (.dmg)',
        format: '.dmg',
        fileSize: '62.1 MB',
        fileName: 'KnowTheMD_1.0.0_universal.dmg',
        downloadUrl: '/downloads/KnowTheMD_1.0.0_universal.dmg',
        sha256: '80710dd08097d28fd7271eb7f0757cd6305d5d1455f718802d6869c8233177f9',
      },
      {
        arch: 'macOS Apple Silicon M1/M2/M3/M4 (.dmg)',
        format: '.dmg',
        fileSize: '59.8 MB',
        fileName: 'KnowTheMD_1.0.0_aarch64.dmg',
        downloadUrl: '/downloads/KnowTheMD_1.0.0_aarch64.dmg',
        sha256: '57cb57f2b18ef2a846b262d3761fc96b93bcee4056b1ace28747ad066b90d1b0',
      },
    ],
  },
  {
    id: 'linux',
    osName: 'Linux',
    badge: 'AppImage / Deb',
    icon: 'linux',
    systemReq: 'glibc >= 2.31 (Ubuntu, Debian, Fedora, Arch)',
    recommendedArch: 'appimage',
    architectures: [
      {
        arch: 'Linux Universal AppImage (.AppImage)',
        format: '.AppImage',
        fileSize: '68.3 MB',
        fileName: 'KnowTheMD_1.0.0_amd64.AppImage',
        downloadUrl: '/downloads/KnowTheMD_1.0.0_amd64.AppImage',
        sha256: '73866f5f7107efd8e9b810b93879a603b0dd27504257d1bd143f683150701163',
      },
      {
        arch: 'Debian / Ubuntu Package (.deb)',
        format: '.deb',
        fileSize: '52.7 MB',
        fileName: 'knowthemd_1.0.0_amd64.deb',
        downloadUrl: '/downloads/knowthemd_1.0.0_amd64.deb',
        sha256: 'db25da6e4326f43c23c2bda46a6d92cbda7535d85995ea1f112a05a1d03981e1',
      },
    ],
  },
  {
    id: 'android',
    osName: 'Android',
    badge: '11.0+',
    icon: 'android',
    systemReq: 'Android 11 (API 30) or later',
    recommendedArch: 'apk',
    architectures: [
      {
        arch: 'Android Standalone Application Package (.apk in .zip)',
        format: '.zip',
        fileSize: '4.05 MB',
        fileName: 'KnowTheMD_1.0.0_apk.zip',
        downloadUrl: '/downloads/KnowTheMD_1.0.0_apk.zip',
        sha256: '7b3660725937369362e8a663fb9518731d55b0e4b92b0acf1409fde1788df772',
      },
    ],
  },
  {
    id: 'ios',
    osName: 'iOS & iPadOS',
    badge: '16.0+',
    icon: 'ios',
    systemReq: 'iOS 16.0 or iPadOS 16.0 or later',
    recommendedArch: 'ipa',
    architectures: [
      {
        arch: 'iOS Application Archive (.ipa)',
        format: '.ipa',
        fileSize: '28.1 MB',
        fileName: 'KnowTheMD_1.0.0.ipa',
        downloadUrl: '/downloads/KnowTheMD_1.0.0.ipa',
        sha256: '89a2defdfb1f6be4dc9675e008ce9e2d5c2e9f9a5ce0b75339ef2543cfac047d',
      },
    ],
  },
];

export function detectUserPlatform(): string {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

/**
 * Triggers direct browser download of the recommended file for the detected platform
 */
export function triggerDirectDownload(platformId?: string): { fileName: string; format: string } {
  const targetId = platformId || detectUserPlatform();
  const rel = RELEASES.find((r) => r.id === targetId) || RELEASES[0];
  const arch = rel.architectures[0];

  const link = document.createElement('a');
  link.href = arch.downloadUrl;
  link.setAttribute('download', arch.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { fileName: arch.fileName, format: arch.format };
}
