import React, { useState } from 'react';
import { GlassModal, GlassButton, GlassInput, GlassTextArea } from '@knowthemd/ui';
import { Send, Copy, Check } from 'lucide-react';

interface ContactDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDeveloperModal: React.FC<ContactDeveloperModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmailBody = () => {
    return 'Name: ' + (name || 'Anonymous') + '\nEmail: ' + (email || 'Not provided') + '\n\n' + message;
  };

  const getMailtoLink = () => {
    const encodedSubject = encodeURIComponent(subject || 'Contact Developer');
    const encodedBody = encodeURIComponent(generateEmailBody());
    return 'mailto:gokulakrishnan.k.cseacet@gmail.com?subject=' + encodedSubject + '&body=' + encodedBody;
  };

  const handleSend = () => {
    window.location.href = getMailtoLink();
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        'Subject: ' + (subject || 'Contact Developer') + '\n\n' + generateEmailBody()
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Contact Developer" maxWidth="md">
      <div className="space-y-4 text-sm">
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
        <div className="space-y-1.5">
          <label className="text-slate-300 ml-1">Subject</label>
          <GlassInput
            placeholder="E.g. Collaboration, Feedback, etc."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-slate-300 ml-1">Message</label>
          <GlassTextArea
            placeholder="Your message here..."
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-6 border-t border-slate-800">
          <GlassButton
            onClick={handleCopy}
            variant="secondary"
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
            className="flex-1"
          >
            {copied ? 'Copied to Clipboard' : 'Copy Email'}
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
