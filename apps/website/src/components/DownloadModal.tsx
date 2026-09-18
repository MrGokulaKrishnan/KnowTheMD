import React, { useState } from 'react';
import { ArchRelease } from '../releases';
import { GlassButton } from '@knowthemd/ui';
import { Download, Check, Copy, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface DownloadModalProps {
  arch: ArchRelease;
  osName: string;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ arch, osName, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (arch.sha256) {
      navigator.clipboard.writeText(arch.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto min-w-0 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] text-left break-words [overflow-wrap:anywhere]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with animated icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-cyan-400 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Download Started!
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              KnowTheMD for <span className="text-cyan-300 font-semibold">{osName}</span>
            </p>
          </div>
        </div>

        {/* File information card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 mb-5 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">File Name:</span>
            <span className="font-mono text-cyan-300 font-semibold truncate max-w-[240px]">
              {arch.fileName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">File Size:</span>
            <span className="font-mono text-white font-medium">{arch.fileSize}</span>
          </div>
          {arch.sha256 && (
            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 shrink-0">SHA-256:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-[210px]">
                  {arch.sha256}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                  title="Copy Checksum"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Browser download banner notice */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3 mb-5">
          <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">Check your browser's download shelf:</strong>
            <br />
            Your browser is now downloading this file. Look in the{' '}
            <span className="text-cyan-300 font-medium">top-right corner</span> (Chrome, Edge) or{' '}
            <span className="text-cyan-300 font-medium">bottom bar</span>.
          </div>
        </div>

        {/* Platform quick instructions */}
        <div className="mb-6 space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Quick Setup Guide:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
            {osName.toLowerCase().includes('win') ? (
              <>
                <li>Wait for the <span className="font-mono text-cyan-300">{arch.fileName}</span> download to finish.</li>
                <li>Open the file to run the verified KnowTheMD setup wizard.</li>
                <li>Launch KnowTheMD from your Start Menu or Desktop shortcut.</li>
              </>
            ) : osName.toLowerCase().includes('android') ? (
              <>
                <li>Tap the downloaded <span className="font-mono text-cyan-300">{arch.fileName}</span>.</li>
                <li>Allow "Install unknown apps" for your browser if prompted.</li>
                <li>Tap Install and launch your new markdown editor.</li>
              </>
            ) : (
              <>
                <li>Open the downloaded package once download finishes.</li>
                <li>Follow your operating system's standard installation steps.</li>
                <li>Launch KnowTheMD and enjoy distraction-free writing.</li>
              </>
            )}
          </ol>
        </div>

        {/* Action footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <a
            href={arch.downloadUrl}
            download={arch.fileName}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            Didn't start? Click here to download directly
          </a>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={onClose}
            icon={<CheckCircle2 className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Got it
          </GlassButton>
        </div>
      </div>
    </div>
  );
};
