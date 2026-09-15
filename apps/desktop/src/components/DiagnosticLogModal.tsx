import React, { useState } from 'react';
import { GlassModal, GlassButton } from '@knowthemd/ui';
import { getDiagnosticLogs, DiagnosticLog } from '../fileSystem';
import { Activity, Copy, Check } from 'lucide-react';

export interface DiagnosticLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticLogModal: React.FC<DiagnosticLogModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const logs = getDiagnosticLogs();

  const handleCopy = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category}] ${l.message} ${
            l.details ? ':: ' + l.details : ''
          }`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Internal Diagnostic Logs</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">
            Real-time diagnostics log ({logs.length} entries). No document contents are logged.
          </span>
          <GlassButton
            variant="secondary"
            size="sm"
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Logs'}
          </GlassButton>
        </div>

        <div className="h-72 overflow-y-auto bg-slate-950/90 rounded-xl p-3 font-mono text-[11px] border border-cyan-500/20 space-y-1.5 no-scrollbar">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic text-center py-10">No diagnostic logs recorded yet.</div>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-600 shrink-0">{l.timestamp.split('T')[1].slice(0, 8)}</span>
                <span
                  className={`font-semibold shrink-0 ${
                    l.level === 'error'
                      ? 'text-rose-400'
                      : l.level === 'warn'
                      ? 'text-amber-400'
                      : 'text-cyan-400'
                  }`}
                >
                  [{l.level.toUpperCase()}]
                </span>
                <span className="text-slate-400 shrink-0">[{l.category}]</span>
                <span className="text-slate-200">{l.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </GlassModal>
  );
};
