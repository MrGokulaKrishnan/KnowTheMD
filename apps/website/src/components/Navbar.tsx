import React, { useState } from 'react';
import { BrandLogo, GlassButton } from '@knowthemd/ui';
import { Menu, X, Download, Github } from 'lucide-react';

export interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Features' },
    { id: 'download', label: 'Download' },
    { id: 'docs', label: 'Documentation' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'support', label: 'Support' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/75 backdrop-blur-2xl border-b border-cyan-500/20 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="cursor-pointer"
        >
          <BrandLogo size={32} showText={true} />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`transition-colors cursor-pointer ${
                activePage === link.id
                  ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/MrGokulaKrishnan/KnowTheMD"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <a href="/app/" target="_blank" rel="noopener noreferrer">
            <GlassButton
              variant="secondary"
              size="sm"
            >
              Launch Web App
            </GlassButton>
          </a>
          <GlassButton
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => onNavigate('download')}
          >
            Download App
          </GlassButton>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 space-y-3 border-t border-cyan-500/15 mt-3 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base text-slate-300 hover:text-cyan-400 font-medium"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <a href="/app/" target="_blank" rel="noopener noreferrer" className="w-full">
              <GlassButton
                variant="secondary"
                className="w-full"
              >
                Launch Web App
              </GlassButton>
            </a>
            <GlassButton
              variant="primary"
              className="w-full"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                onNavigate('download');
                setMobileMenuOpen(false);
              }}
            >
              Download KnowTheMD
            </GlassButton>
          </div>
        </div>
      )}
    </nav>
  );
};
