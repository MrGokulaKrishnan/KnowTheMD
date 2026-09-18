import React, { useState, useEffect } from 'react';
import { Bug, MessageSquareWarning, HelpCircle, Mail } from 'lucide-react';
import { ReportBugModal } from './ReportBugModal';
import { ContactDeveloperModal } from './ContactDeveloperModal';

export const FloatingSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenBug = () => setIsBugModalOpen(true);
    const handleOpenContact = () => setIsContactModalOpen(true);
    
    window.addEventListener('open-bug-report', handleOpenBug);
    window.addEventListener('open-contact-developer', handleOpenContact);
    
    return () => {
      window.removeEventListener('open-bug-report', handleOpenBug);
      window.removeEventListener('open-contact-developer', handleOpenContact);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="flex flex-col gap-2 animate-fade-in-up">
            <button
              onClick={() => {
                setIsBugModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-full border border-cyan-500/30 hover:bg-cyan-900/40 hover:text-cyan-300 transition-all shadow-lg"
            >
              <Bug size={16} />
              <span className="text-sm font-medium">Report a Bug</span>
            </button>
            <button
              onClick={() => {
                setIsContactModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-full border border-cyan-500/30 hover:bg-cyan-900/40 hover:text-cyan-300 transition-all shadow-lg"
            >
              <Mail size={16} />
              <span className="text-sm font-medium">Contact Developer</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={"w-12 h-12 flex items-center justify-center rounded-full text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all " + (isOpen ? "bg-slate-700 border border-slate-500" : "bg-cyan-600 hover:bg-cyan-500")}
          aria-label="Support Options"
        >
          {isOpen ? <HelpCircle size={24} /> : <MessageSquareWarning size={24} />}
        </button>
      </div>

      <ReportBugModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
      <ContactDeveloperModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
};
