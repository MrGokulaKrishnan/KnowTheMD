import React, { useState } from 'react';
import { GlassCard } from '@knowthemd/ui';
import { ShieldCheck, FileText, Cookie, AlertTriangle, Eye, Lock } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'security' | 'accessibility' | 'disclaimer'>('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'cookies', label: 'Cookie Policy', icon: <Cookie className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Disclosure', icon: <Lock className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility Statement', icon: <Eye className="w-4 h-4" /> },
    { id: 'disclaimer', label: 'Disclaimer', icon: <AlertTriangle className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Legal & Compliance
        </h1>
        <p className="text-slate-400 text-sm">
          Our uncompromising pledge to user privacy, local data sovereignty, accessibility, and open security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-900/60 border border-cyan-500/15 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <GlassCard className="p-6 sm:p-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* 1. Privacy Policy */}
        {activeTab === 'privacy' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <ShieldCheck className="w-5 h-5" /> Privacy Policy (Local-First Guarantee)
            </div>
            <p className="text-slate-200 font-medium">
              Effective Date: September 16, 2026
            </p>
            <p>
              KnowTheMD was built upon a fundamental conviction: <strong>your thoughts, code, and notes belong strictly to you.</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Zero Document Transmission</strong>: KnowTheMD never transmits your Markdown files, drafts, notes, or keystrokes to any cloud server, third-party API, or analytics backend.</li>
              <li><strong>No Hidden Telemetry</strong>: We do not track document contents, file paths, opening frequencies, or user habits.</li>
              <li><strong>No Mandatory Accounts</strong>: All reading, editing, previewing, and export functionality operates completely offline without login, registration, or OAuth authorization.</li>
              <li><strong>Local Draft Storage</strong>: Recovery drafts are stored exclusively in your local machine storage (<code className="text-cyan-300">localStorage</code> / <code className="text-cyan-300">IndexedDB</code>) and are never synchronized over any network.</li>
              <li><strong>Children&apos;s Privacy</strong>: Because we do not collect personal information of any kind, we do not knowingly collect or solicit data from children under 13.</li>
            </ul>
          </section>
        )}

        {/* 2. Terms of Service */}
        {activeTab === 'terms' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <FileText className="w-5 h-5" /> Terms of Service
            </div>
            <p className="text-slate-200 font-medium">
              Effective Date: September 16, 2026
            </p>
            <p>
              By downloading, installing, accessing, or using KnowTheMD, you agree to the following terms:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Intellectual Property & Ownership</strong>: You retain 100% intellectual property ownership of all Markdown documents, text, images, tables, code snippets, and diagrams you view, create, or export using KnowTheMD.</li>
              <li><strong>Software License</strong>: KnowTheMD is licensed for personal, educational, and commercial technical writing. You may not reverse-engineer, decompile, or redistribute malicious modifications of the binary artifacts.</li>
              <li><strong>Backup Responsibility</strong>: KnowTheMD operates directly on your local filesystem. You are solely responsible for maintaining appropriate backups of your local file systems and storage devices.</li>
              <li><strong>Acceptable Use</strong>: You agree not to use KnowTheMD to generate or process unlawful materials or attempt to bypass system security boundaries.</li>
            </ul>
          </section>
        )}

        {/* 3. Cookie Policy */}
        {activeTab === 'cookies' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <Cookie className="w-5 h-5" /> Cookie Policy
            </div>
            <p className="text-slate-200 font-medium">
              KnowTheMD uses <strong>Zero Tracking Cookies</strong>.
            </p>
            <p>
              Unlike conventional web applications, KnowTheMD respects your privacy by completely avoiding third-party advertising cookies, user profiling cookies, and persistent cross-site tracking beacons.
            </p>
            <div className="space-y-2 border-l-2 border-cyan-500/40 pl-4 py-1 text-slate-300">
              <p><strong>What we store locally:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><code className="text-cyan-300">knowthemd_settings</code>: Stores your local editor preferences (font size, line numbers, word wrap).</li>
                <li><code className="text-cyan-300">knowthemd_recent_files</code>: Stores your recently opened file list on your own device.</li>
                <li><code className="text-cyan-300">knowthemd_session_tabs</code>: Saves open editor tab names and dirty state across browser restarts.</li>
              </ul>
            </div>
            <p className="text-xs text-slate-400">
              You can clear this storage at any time by clearing your browser site data or clearing cache in app settings.
            </p>
          </section>
        )}

        {/* 4. Security Policy */}
        {activeTab === 'security' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <Lock className="w-5 h-5" /> Security Policy &amp; Responsible Disclosure
            </div>
            <p>
              KnowTheMD employs defense-in-depth principles across its parsing, rendering, and file access engines:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Strict Content Sanitization</strong>: User-supplied Markdown is parsed to an AST and raw HTML nodes are filtered against dangerous tags (<code className="text-cyan-300">&lt;script&gt;</code>, <code className="text-cyan-300">&lt;iframe&gt;</code>, <code className="text-cyan-300">&lt;object&gt;</code>).</li>
              <li><strong>Protocol Filtering</strong>: Executable URIs (<code className="text-cyan-300">javascript:</code>, <code className="text-cyan-300">vbscript:</code>, unsafe <code className="text-cyan-300">data:</code>) are strictly blocked.</li>
              <li><strong>Path Traversal Neutralization</strong>: Directory escaping sequences (<code className="text-cyan-300">../..</code>) are stripped from relative paths.</li>
              <li><strong>Binary Cryptographic Checksums</strong>: Official binaries are published with SHA-256 verification hashes to protect against tamper.</li>
            </ul>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs">
              <span className="font-semibold text-white">Responsible Disclosure:</span> If you identify a security vulnerability or bypass, please report it responsibly by contacting <span className="text-cyan-300 font-mono">support@knowthemd.com</span> or submitting a confidential GitHub Security Advisory.
            </div>
          </section>
        )}

        {/* 5. Accessibility Statement */}
        {activeTab === 'accessibility' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <Eye className="w-5 h-5" /> Accessibility Statement
            </div>
            <p>
              KnowTheMD is committed to ensuring digital accessibility for all users, including those using screen readers, keyboard-only navigation, and high-contrast assistive settings.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>WCAG 2.1 Compliance</strong>: Meticulously calibrated contrast ratios exceeding 4.5:1 for standard body text and 3:1 for large display elements.</li>
              <li><strong>Full Keyboard Navigation</strong>: Comprehensive keyboard shortcuts for editor navigation, command palette (<kbd className="text-cyan-400 font-mono">Ctrl+Shift+P</kbd>), tabs, and modal dismissals (<kbd className="text-cyan-400 font-mono">Esc</kbd>).</li>
              <li><strong>ARIA Semantics</strong>: Semantic roles, labels, and focus rings applied to buttons, tabs, dropdowns, and dialogs.</li>
              <li><strong>Reduced Motion</strong>: Respects OS-level <code className="text-cyan-300">prefers-reduced-motion</code> settings to minimize visual discomfort.</li>
            </ul>
          </section>
        )}

        {/* 6. Disclaimer */}
        {activeTab === 'disclaimer' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
              <AlertTriangle className="w-5 h-5" /> Legal Disclaimer
            </div>
            <p>
              KnowTheMD is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, or non-infringement.
            </p>
            <p>
              Under no circumstances shall the authors, maintainers, or contributors of KnowTheMD be held liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to the use, inability to use, or loss of data resulting from the operation of this application.
            </p>
          </section>
        )}
      </GlassCard>
    </div>
  );
};
