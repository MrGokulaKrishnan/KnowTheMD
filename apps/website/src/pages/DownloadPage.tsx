import React, { useState } from 'react';
import {
  RELEASES,
  APP_VERSION,
  RELEASE_DATE,
  detectUserPlatform,
  type PlatformRelease,
  type ArchRelease,
} from '../releases';
import { GlassCard, GlassButton } from '@knowthemd/ui';
import { DownloadModal } from '../components/DownloadModal';
import {
  Download,
  Copy,
  Check,
  Shield,
  ExternalLink,
  Clock,
  AlertTriangle,
  Monitor,
  Apple,
  Terminal,
  Smartphone,
} from 'lucide-react';

// ─── Platform Icon ────────────────────────────────────────────────────────────

const PlatformIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-6 h-6' }) => {
  switch (id) {
    case 'windows':
      return <Monitor className={className} />;
    case 'macos':
      return <Apple className={className} />;
    case 'linux':
      return <Terminal className={className} />;
    case 'android':
    case 'ios':
      return <Smartphone className={className} />;
    default:
      return <Monitor className={className} />;
  }
};

// ─── Architecture Row ────────────────────────────────────────────────────────

interface ArchRowProps {
  arch: ArchRelease;
  copiedSha: string | null;
  onCopySha: (sha: string) => void;
  onDownloadStart: (arch: ArchRelease) => void;
}

const ArchRow: React.FC<ArchRowProps> = ({ arch, copiedSha, onCopySha, onDownloadStart }) => {
  if (!arch.available) {
    return (
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 opacity-60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-400">{arch.arch}</span>
            <span className="text-xs text-slate-600 font-mono">({arch.format})</span>
          </div>
          <div className="text-xs text-slate-500">Build pipeline in progress — not yet available</div>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-500 font-semibold whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          Coming Soon
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{arch.arch}</span>
          <span className="text-xs text-slate-500 font-mono">({arch.format})</span>
        </div>
        <div className="text-xs text-slate-400">
          Size: <span className="font-mono text-slate-300">{arch.fileSize}</span>
        </div>
        {arch.sha256 && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span className="shrink-0">SHA-256:</span>
            <span className="truncate max-w-[200px] sm:max-w-xs">{arch.sha256}</span>
            <button
              onClick={() => onCopySha(arch.sha256)}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              title="Copy SHA-256"
              aria-label="Copy SHA-256 checksum"
            >
              {copiedSha === arch.sha256 ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>

      <a
        href={arch.downloadUrl}
        download={arch.fileName}
        onClick={() => onDownloadStart(arch)}
        className="w-full md:w-auto"
        aria-label={`Download ${arch.fileName}`}
      >
        <GlassButton
          variant="primary"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          className="w-full md:w-auto"
        >
          Download {arch.format}
        </GlassButton>
      </a>
    </div>
  );
};

// ─── Coming-Soon Panel ───────────────────────────────────────────────────────

const ComingSoonPanel: React.FC<{ platform: PlatformRelease }> = ({ platform }) => (
  <div className="text-center py-10 px-6 space-y-4">
    <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-500">
      <PlatformIcon id={platform.id} className="w-7 h-7" />
    </div>
    <div>
      <p className="text-white font-semibold text-lg">{platform.osName} — Coming Soon</p>
      <p className="text-slate-400 text-sm mt-1">
        The {platform.osName} build pipeline is in progress. Check back shortly or{' '}
        <a
          href="https://github.com/MrGokulaKrishnan/KnowTheMD/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline"
        >
          watch GitHub Releases
        </a>{' '}
        for updates.
      </p>
    </div>
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
      <Clock className="w-3.5 h-3.5" />
      In Development
    </div>
  </div>
);

// ─── iOS Panel ───────────────────────────────────────────────────────────────

const AppStorePanel: React.FC<{ platform: PlatformRelease }> = ({ platform }) => (
  <div className="py-10 px-6 space-y-6">
    {/* Header */}
    <div className="text-center space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400">
        <Apple className="w-7 h-7" />
      </div>
      <div>
        <p className="text-white font-semibold text-lg">iOS & iPadOS</p>
        <p className="text-slate-400 text-sm mt-1">{platform.systemReq}</p>
      </div>
    </div>

    {/* Distribution info cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
      {/* App Store card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/30 space-y-2">
        <div className="flex items-center gap-2 text-white text-sm font-semibold">
          <Apple className="w-4 h-4 text-slate-300" />
          App Store
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">
          The official channel for iOS distribution. Pending Apple review and listing.
        </p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-[10px] font-semibold">
          <Clock className="w-3 h-3" />
          Submission in progress
        </div>
      </div>

      {/* TestFlight card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/30 space-y-2">
        <div className="flex items-center gap-2 text-white text-sm font-semibold">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          TestFlight Beta
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">
          Early access beta via TestFlight. Public link will be posted here when available.
        </p>
        <a
          href="https://github.com/MrGokulaKrishnan/KnowTheMD/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-semibold hover:bg-cyan-500/20 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Watch GitHub Releases
        </a>
      </div>
    </div>

    {/* Apple policy note */}
    <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-700/30 text-xs text-slate-500 max-w-xl mx-auto">
      <Shield className="w-4 h-4 shrink-0 mt-0.5 text-slate-600" />
      <p>
        <span className="text-slate-400 font-semibold">Apple platform policy:</span>{' '}
        iOS and iPadOS apps can only be installed from the App Store or via TestFlight.
        Direct IPA sideloading is not supported on standard devices.
      </p>
    </div>
  </div>
);

// ─── Installation Notices ───────────────────────────────────────────────────

const AndroidSideloadNotice: React.FC = () => (
  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/8 border border-amber-400/20 text-xs text-amber-300/80 mt-4">
    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
    <p>
      <span className="font-semibold text-amber-300">Android Installation:</span> Allow "Install from unknown sources" in device Settings if prompted when opening the APK.
    </p>
  </div>
);

const IosInstallNotice: React.FC = () => (
  <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-200/90 mt-4">
    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
    <p>
      <span className="font-semibold text-cyan-300">iOS Installation:</span> Download the <strong className="text-white">.mobileconfig</strong> profile on your iPhone/iPad and tap <strong className="text-white">Settings &rarr; Profile Downloaded &rarr; Install</strong> for 1-tap home screen installation, or use the <strong className="text-white">.ipa</strong> with AltStore / TrollStore / Sideloadly.
    </p>
  </div>
);

const MacInstallNotice: React.FC = () => (
  <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-xs text-slate-300 mt-4">
    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
    <p>
      <span className="font-semibold text-white">macOS Installation:</span> Download the <strong className="text-white">.zip</strong>, double-click to extract <strong className="text-cyan-300">KnowTheMD.app</strong>, and move it to your <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/Applications</code> folder.
    </p>
  </div>
);

const LinuxInstallNotice: React.FC = () => (
  <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-xs text-slate-300 mt-4">
    <Terminal className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
    <p>
      <span className="font-semibold text-white">Linux Installation:</span> Extract the <strong className="text-white">.tar.gz</strong> and execute <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">./knowthemd-desktop</code>, or mark the <strong className="text-white">.AppImage</strong> executable with <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">chmod +x</code> and run.
    </p>
  </div>
);


// ─── Download Page ────────────────────────────────────────────────────────────

export const DownloadPage: React.FC = () => {
  const detected = detectUserPlatform();
  const [selectedPlatform, setSelectedPlatform] = useState<string>(detected);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [downloadingArch, setDownloadingArch] = useState<{ arch: ArchRelease; osName: string } | null>(null);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const currentRelease = RELEASES.find((r) => r.id === selectedPlatform) || RELEASES[0];
  const availableArchs = currentRelease.architectures.filter((a) => a.available);
  const hasAvailableDownload = currentRelease.type === 'download' && availableArchs.length > 0;

  return (
    <div className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Download KnowTheMD
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Version{' '}
          <span className="text-cyan-400 font-mono font-semibold">{APP_VERSION}</span>
          {' '}• Released {RELEASE_DATE}. Clean, standalone, and completely offline-first.
        </p>
        {detected !== selectedPlatform && (
          <p className="mt-3 text-xs text-slate-500">
            Detected platform:{' '}
            <button
              onClick={() => setSelectedPlatform(detected)}
              className="text-cyan-400 hover:underline"
            >
              switch to {RELEASES.find((r) => r.id === detected)?.osName ?? detected}
            </button>
          </p>
        )}
      </div>

      {/* ── Platform Selector ── */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {RELEASES.map((p) => {
          const isSelected = p.id === selectedPlatform;
          const isAvailable = p.type === 'download';
          return (
            <button
              key={p.id}
              id={`platform-tab-${p.id}`}
              onClick={() => setSelectedPlatform(p.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/60 border border-cyan-500/15 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
              aria-pressed={isSelected}
            >
              <PlatformIcon id={p.id} className="w-3.5 h-3.5" />
              <span>{p.osName}</span>
              {!isAvailable && (
                <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wide">soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Selected Platform Card ── */}
      <div className="max-w-4xl mx-auto">
        <GlassCard glow={hasAvailableDownload}>
          {/* Card Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/15 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <PlatformIcon id={currentRelease.id} className="w-6 h-6 text-cyan-400" />
                <span className="text-2xl font-bold text-white">{currentRelease.osName}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  v{APP_VERSION}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {currentRelease.systemReq}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 verified artifacts</span>
            </div>
          </div>

          {/* Card Body */}
          {currentRelease.type === 'store' && (
            <AppStorePanel platform={currentRelease} />
          )}

          {currentRelease.type === 'coming-soon' && (
            <ComingSoonPanel platform={currentRelease} />
          )}

          {currentRelease.type === 'download' && (
            <div className="space-y-4">
              {currentRelease.architectures.map((arch, idx) => (
                <ArchRow
                  key={idx}
                  arch={arch}
                  copiedSha={copiedSha}
                  onCopySha={handleCopySha}
                  onDownloadStart={(a) => setDownloadingArch({ arch: a, osName: currentRelease.osName })}
                />
              ))}

              {/* Platform specific installation notices */}
              {currentRelease.id === 'android' && <AndroidSideloadNotice />}
              {currentRelease.id === 'ios' && <IosInstallNotice />}
              {currentRelease.id === 'macos' && <MacInstallNotice />}
              {currentRelease.id === 'linux' && <LinuxInstallNotice />}
            </div>
          )}
        </GlassCard>
      </div>


      {/* ── Integrity Notice ── */}
      {hasAvailableDownload && (
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-950/60 border border-cyan-500/15 text-xs text-slate-400 leading-relaxed">
          <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Integrity & Checksum Verification
          </div>
          {currentRelease.id === 'windows' && (
            <p>
              Verify on Windows:{' '}
              <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">
                CertUtil -hashfile KnowTheMD_Windows_x64.zip SHA256
              </code>
            </p>
          )}
          {currentRelease.id === 'android' && (
            <p>
              Verify on macOS/Linux:{' '}
              <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">
                sha256sum KnowTheMD-1.0.0-android.apk
              </code>
              {' '}— or on Windows:{' '}
              <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">
                CertUtil -hashfile KnowTheMD-1.0.0-android.apk SHA256
              </code>
            </p>
          )}
          <p className="mt-2">
            Compare the output against the SHA-256 shown above. They must match exactly before
            installing.
          </p>
        </div>
      )}

      {/* ── GitHub Releases Link ── */}
      <div className="max-w-4xl mx-auto text-center">
        <a
          href="https://github.com/MrGokulaKrishnan/KnowTheMD/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View all releases &amp; release notes on GitHub
        </a>
      </div>

      {/* ── Download Started Modal ── */}
      {downloadingArch && (
        <DownloadModal
          arch={downloadingArch.arch}
          osName={downloadingArch.osName}
          onClose={() => setDownloadingArch(null)}
        />
      )}
    </div>
  );
};
