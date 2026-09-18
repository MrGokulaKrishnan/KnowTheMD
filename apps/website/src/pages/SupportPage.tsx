import React, { useState } from 'react';
import { GlassCard, GlassButton } from '@knowthemd/ui';
import {
  HelpCircle,
  LifeBuoy,
  Bug,
  RotateCcw,
  ShieldCheck,
  FileQuestion,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Key,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const supportFaqs = [
    {
      q: 'Where are my Markdown files and drafts stored?',
      a: 'KnowTheMD is strictly local-first. When editing in the desktop or mobile app, documents are read directly from your local filesystem. Unsaved working drafts are stored exclusively in your browser/device local storage (`localStorage` / `IndexedDB`). Your documents are never uploaded to any remote server.',
    },
    {
      q: 'How do I recover an unsaved document after an unexpected crash or reboot?',
      a: 'Simply relaunch KnowTheMD. The workspace automatically inspects local session recovery drafts (`knowthemd_drafts_{id}`) and prompts you to restore your document with all unsaved edits intact.',
    },
    {
      q: 'Why does Android warn about "Installing from unknown sources"?',
      a: 'The KnowTheMD APK is distributed directly as an open-source artifact without Google Play Store intermediation. Android displays a standard security prompt for any direct APK installation. You can safely verify the binary SHA-256 hash using `CertUtil -hashfile KnowTheMD-v1.0-android.apk SHA256` or `sha256sum` before installing.',
    },
    {
      q: 'Does KnowTheMD collect telemetry, diagnostics, or personal data?',
      a: 'Zero. KnowTheMD contains no analytics trackers, no user session recording, no telemetry beacons, and no marketing cookies.',
    },
    {
      q: 'How do I report a security vulnerability or critical bug?',
      a: 'Please file a confidential advisory via our GitHub Security Advisories tab or report issues directly on the GitHub Issue Tracker. See our Security Policy on the Legal page for complete disclosure guidelines.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Support & Help Center</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
          How can we help you?
        </h1>
        <p className="text-slate-400 text-sm">
          Guides, troubleshooting procedures, recovery workflows, and community channels.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="space-y-3">
          <RotateCcw className="w-6 h-6 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Crash & Draft Recovery</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Did your machine unexpectedly shut down? Re-open KnowTheMD to restore all uncommitted drafts from your local cache.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <Key className="w-6 h-6 text-sky-400" />
          <h2 className="text-base font-bold text-white">Permissions & File Access</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            KnowTheMD uses the Native File System Access API. Ensure your browser or OS permits local disk read/write access.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <Bug className="w-6 h-6 text-amber-400" />
          <h2 className="text-base font-bold text-white">Issue Reporting</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Encountered a rendering glitch or parser anomaly? Submit a reproducible case on our official repository.
          </p>
        </GlassCard>
      </div>

      {/* Support FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        {supportFaqs.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={i}
              onClick={() => setOpenFaq(isOpen ? null : i)}
              className="rounded-xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/15 p-4 cursor-pointer transition-colors hover:border-cyan-400/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">{faq.q}</h3>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </div>
              {isOpen && (
                <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-cyan-500/10 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* GitHub External Links */}
      <GlassCard className="text-center p-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Need Further Assistance?</h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          KnowTheMD is community-supported and open source. Check our discussion board, issues tracker, or release logs.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <GlassButton
            variant="primary"
            icon={<Bug className="w-4 h-4" />}
            onClick={() => window.dispatchEvent(new CustomEvent('open-bug-report'))}
          >
            Report a Bug
          </GlassButton>
          <GlassButton
            variant="secondary"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-developer'))}
          >
            Contact Developer
          </GlassButton>
          <a
            href="https://github.com/MrGokulaKrishnan/KnowTheMD/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlassButton variant="secondary" icon={<ExternalLink className="w-4 h-4" />}>
              Open GitHub Issues
            </GlassButton>
          </a>
        </div>
      </GlassCard>
    </div>
  );
};
