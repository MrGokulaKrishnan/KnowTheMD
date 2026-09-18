import React from 'react';
import { BrandLogo } from '@knowthemd/ui';

export interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenAbout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAbout }) => {
  return (
    <footer className="border-t border-cyan-500/15 bg-slate-950 py-12 px-6 sm:px-12 text-slate-400 text-xs select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-3">
          <BrandLogo size={28} showText={true} />
          <p className="text-slate-400 leading-relaxed">
            Read. Write. Understand Markdown. Built for speed, precision, and privacy across all platforms.
          </p>
          <div className="text-[11px] text-cyan-400 font-semibold">
            Offered by KnowTheTech • Updated on Sept 18, 2026
          </div>
          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} KnowTheMD Project. All rights reserved.
          </div>
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              View App Info (Play Store Style) &rarr;
            </button>
          )}
        </div>


        {/* Platforms */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
            Platforms
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('download')} className="hover:text-cyan-400">
                Windows 10 / 11 (x64, ARM64)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('download')} className="hover:text-cyan-400">
                macOS (Apple Silicon & Intel)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('download')} className="hover:text-cyan-400">
                Linux (AppImage & .deb)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('download')} className="hover:text-cyan-400">
                Android (Direct APK)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('download')} className="hover:text-cyan-400">
                iOS & iPadOS
              </button>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
            Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('docs')} className="hover:text-cyan-400">
                Documentation
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('docs')} className="hover:text-cyan-400">
                Markdown Syntax Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('docs')} className="hover:text-cyan-400">
                Keyboard Shortcuts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('changelog')} className="hover:text-cyan-400">
                Changelog (v1.0)
              </button>
            </li>
            <li>
              <a
                href="https://github.com/MrGokulaKrishnan/KnowTheMD"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Trust */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
            Trust & Compliance
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-cyan-400">
                Privacy Policy (Local-First)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-cyan-400">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-cyan-400">
                Cookie Policy (0 Tracking)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-cyan-400">
                Security &amp; Responsible Disclosure
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legal')} className="hover:text-cyan-400">
                Accessibility Statement
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('support')} className="hover:text-cyan-400">
                Support &amp; Help Center
              </button>
            </li>
            <li>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-bug-report'))} className="hover:text-cyan-400">
                Report a Bug
              </button>
            </li>
            <li>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-contact-developer'))} className="hover:text-cyan-400">
                Contact Developer
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
