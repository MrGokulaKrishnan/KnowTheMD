import React, { useState, useEffect } from 'react';
import { GlassModal, GlassButton, GlassInput, GlassTextArea } from '@knowthemd/ui';
import { Send, Bug, Copy, Check } from 'lucide-react';
import { detectUserPlatform, APP_VERSION } from '../../releases';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportBugModal: React.FC<ReportBugModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Functional');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [copied, setCopied] = useState(false);

  const [systemInfo, setSystemInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setSystemInfo({
        'URL': window.location.href,
        'Browser': navigator.userAgent,
        'Platform': detectUserPlatform(),
        'Screen': window.screen.width + 'x' + window.screen.height,
        'App Version': APP_VERSION
      });
      setCopied(false);
    }
  }, [isOpen]);

  const generateEmailBody = () => {
    const body = [
      'Name: ' + (name || 'Anonymous'),
      'Email: ' + (email || 'Not provided'),
      'Category: ' + category,
      'Priority: ' + priority,
      '',
      '--- Description ---',
      description,
      '',
      '--- System Info ---',
      Object.entries(systemInfo).map(([k, v]) => k + ': ' + v).join('\n')
    ].join('\n');
    return body;
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent('[Bug Report] [' + category + '] - ' + (title || 'Untitled Issue'));
    const body = encodeURIComponent(generateEmailBody());
    return 'mailto:gokulakrishnan.k.cseacet@gmail.com?subject=' + subject + '&body=' + body;
  };

  const handleSend = () => {
    window.location.href = getMailtoLink();
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        'Subject: [Bug Report] [' + category + '] - ' + (title || 'Untitled Issue') + '\n\n' + generateEmailBody()
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Report a Bug" maxWidth="lg">
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-300 ml-1">Name (Optional)</label>
            <GlassInput
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-300 ml-1">Email (Optional)</label>
            <GlassInput
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-300 ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950/60 backdrop-blur-md text-slate-100 border border-cyan-500/20 rounded-xl px-3.5 py-2 text-sm transition-all outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 appearance-none"
            >
              <option value="UI">UI</option>
              <option value="Performance">Performance</option>
              <option value="Functional">Functional</option>
              <option value="Crash">Crash</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-300 ml-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-950/60 backdrop-blur-md text-slate-100 border border-cyan-500/20 rounded-xl px-3.5 py-2 text-sm transition-all outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 appearance-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 ml-1">Bug Title</label>
          <GlassInput
            placeholder="E.g. App crashes when clicking login"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 ml-1">Description</label>
          <GlassTextArea
            placeholder="Steps to reproduce, expected vs actual behavior..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 font-semibold">Auto-captured info:</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono break-all">
            {Object.entries(systemInfo).map(([k, v]) => (
              <div key={k}><span className="text-slate-400">{k}:</span> {v}</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-6 border-t border-slate-800">
          <GlassButton
            onClick={handleCopy}
            variant="secondary"
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
            className="flex-1"
          >
            {copied ? 'Copied to Clipboard' : 'Copy Email Content'}
          </GlassButton>
          <GlassButton
            onClick={handleSend}
            variant="primary"
            icon={<Send size={16} />}
            className="flex-1"
          >
            Open Mail Client
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
