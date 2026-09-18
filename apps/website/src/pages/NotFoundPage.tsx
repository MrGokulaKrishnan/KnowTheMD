import React from 'react';
import { GlassCard, GlassButton } from '@knowthemd/ui';
import { Home, Download, HelpCircle, ArrowLeft } from 'lucide-react';

export interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-24 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center text-center">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-8">
        HTTP 404 • Page Not Found
      </div>

      <h1 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 tracking-tight mb-6">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        This document does not exist.
      </h2>

      <p className="text-slate-400 max-w-md text-sm sm:text-base mb-10 leading-relaxed">
        The link you followed may be broken, out of date, or mistyped. Return to the home page or browse downloads and documentation.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <GlassButton
          variant="primary"
          icon={<Home className="w-4 h-4" />}
          onClick={() => onNavigate('home')}
        >
          Return Home
        </GlassButton>
        <GlassButton
          variant="secondary"
          icon={<Download className="w-4 h-4" />}
          onClick={() => onNavigate('download')}
        >
          All Downloads
        </GlassButton>
        <GlassButton
          variant="secondary"
          icon={<HelpCircle className="w-4 h-4" />}
          onClick={() => onNavigate('support')}
        >
          Help & Support
        </GlassButton>
      </div>

      <div className="mt-16 text-xs text-slate-500 font-mono">
        KnowTheMD v1.0.0 • Offline-First Markdown Architecture
      </div>
    </div>
  );
};
