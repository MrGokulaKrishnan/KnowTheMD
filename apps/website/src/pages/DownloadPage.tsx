import React, { useState } from 'react';
import { RELEASES, APP_VERSION, RELEASE_DATE, detectUserPlatform, PlatformRelease } from '../releases';
import { GlassCard, GlassButton } from '@knowthemd/ui';
import { Download, Copy, Check, Shield, Monitor, Apple, Terminal, Smartphone } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const detected = detectUserPlatform();
  const [selectedPlatform, setSelectedPlatform] = useState<string>(detected);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const currentRelease = RELEASES.find((r) => r.id === selectedPlatform) || RELEASES[0];

  return (
    <div className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Download KnowTheMD
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Version <span className="text-cyan-400 font-mono font-semibold">{APP_VERSION}</span> • Released on {RELEASE_DATE}. Clean, standalone, and completely offline-first.
        </p>
      </div>

      {/* Platform Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {RELEASES.map((p) => {
          const isSelected = p.id === selectedPlatform;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/60 border border-cyan-500/15 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>{p.osName}</span>
              <span className="text-[10px] text-slate-500 font-mono">({p.badge})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Detail Card */}
      <div className="max-w-4xl mx-auto">
        <GlassCard glow={true}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/15 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{currentRelease.osName}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  v{APP_VERSION}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                System Requirement: {currentRelease.systemReq}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Verified Artifacts</span>
            </div>
          </div>

          {/* Architectures list */}
          <div className="space-y-4">
            {currentRelease.architectures.map((arch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{arch.arch}</span>
                    <span className="text-xs text-slate-500 font-mono">({arch.format})</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Size: <span className="font-mono text-slate-300">{arch.fileSize}</span>
                  </div>
                  {/* SHA-256 Checksum */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="shrink-0">SHA-256:</span>
                    <span className="truncate max-w-[200px] sm:max-w-xs">{arch.sha256}</span>
                    <button
                      onClick={() => handleCopySha(arch.sha256)}
                      className="text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Copy SHA-256"
                    >
                      {copiedSha === arch.sha256 ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <a
                  href={arch.downloadUrl}
                  download={arch.fileName}
                  className="w-full md:w-auto"
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
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Verification Notice */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-950/60 border border-cyan-500/15 text-xs text-slate-400 leading-relaxed">
        <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Integrity & Checksum Verification
        </div>
        To verify your downloaded binary on Windows, run{' '}
        <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">
          CertUtil -hashfile KnowTheMD.msi SHA256
        </code>
        . On macOS/Linux, run{' '}
        <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">
          shasum -a 256 KnowTheMD.dmg
        </code>
        .
      </div>
    </div>
  );
};
