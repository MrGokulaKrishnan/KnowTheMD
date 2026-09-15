import React from 'react';
import { GlassCard } from '@knowthemd/ui';
import { ShieldCheck, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Privacy Policy & Terms
        </h1>
        <p className="text-slate-400 text-sm">
          Our uncompromising pledge to user privacy, local data sovereignty, and open trust.
        </p>
      </div>

      <GlassCard className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Privacy Policy */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
            <ShieldCheck className="w-5 h-5" /> Privacy Policy (Local-First Guarantee)
          </div>
          <p>
            KnowTheMD was built upon a fundamental conviction: <strong>your thoughts, code, and notes belong strictly to you.</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Zero Document Transmission</strong>: KnowTheMD never uploads your Markdown files, drafts, notes, or keystrokes to external servers.</li>
            <li><strong>No Hidden Telemetry</strong>: We do not track document contents, filenames, or user habits.</li>
            <li><strong>No Mandatory Accounts</strong>: All reading, editing, previewing, and export functionality operates completely offline without login or registration.</li>
            <li><strong>Local Draft Storage</strong>: Recovery drafts are stored exclusively in your local machine storage (<code className="text-cyan-300">localStorage</code> / <code className="text-cyan-300">IndexedDB</code>) and are never synchronized over the network.</li>
          </ul>
        </section>

        {/* Terms of Service */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg border-b border-cyan-500/15 pb-2">
            <FileText className="w-5 h-5" /> Terms of Service
          </div>
          <p>
            By downloading, installing, or using KnowTheMD, you agree to the following terms:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>You retain complete ownership and intellectual property rights to all Markdown documents, text, images, and diagrams you view or create using KnowTheMD.</li>
            <li>KnowTheMD is provided "as-is", without warranty of any kind, express or implied.</li>
            <li>You are solely responsible for maintaining appropriate backups of your local file systems.</li>
          </ul>
        </section>
      </GlassCard>
    </div>
  );
};
