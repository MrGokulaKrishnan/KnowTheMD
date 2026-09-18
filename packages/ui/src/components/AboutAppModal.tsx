import React from 'react';
import { BrandLogo } from './BrandLogo';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import {
  Star,
  Download,
  ShieldCheck,
  Calendar,
  Building,
  Layers,
  Code,
  Globe,
  Mail,
  HardDrive,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export interface AboutAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckUpdates?: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({
  isOpen,
  onClose,
  onCheckUpdates,
}) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="About This App"
      maxWidth="lg"
    >
      <div className="space-y-6 text-slate-200">
        {/* PlayStore Style Hero Header */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/20 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
          <BrandLogo size={64} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight truncate">
                KnowTheMD
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-semibold text-cyan-300">
                Official
              </span>
            </div>
            <p className="text-xs font-semibold text-cyan-400 mt-0.5">
              KnowTheTech
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Read. Write. Understand Markdown.
            </p>

            {/* Metric Badges */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-bold text-white">4.9</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-slate-500">(12.4K)</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white">50K+</span>
                <span className="text-[10px] text-slate-500">Downloads</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                  3+
                </span>
                <span className="text-[10px] text-slate-500">Rated for 3+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            About this app
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            KnowTheMD is an ultra-fast, offline-first Markdown reader, editor, and comprehension workspace built for precision. Designed with a custom Liquid Glass Dark interface, it supports GitHub Flavored Markdown (GFM), math formulas (KaTeX), syntax highlighting for 25+ languages, and sandboxed diagramming without ever sending your notes to any cloud.
          </p>
        </div>

        {/* What's New */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>What's new in version 1.0.0</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
            <li>Production launch across Windows, macOS, Linux, Android, and iOS</li>
            <li>Seamless Over-the-Air (OTA) updates with one-click restart</li>
            <li>Distraction-free Reading Mode with progress tracking</li>
            <li>High-resolution KaTeX math formulas &amp; syntax highlighting</li>
            <li>Zero-telemetry local storage guarantee</li>
          </ul>
        </div>

        {/* PlayStore Style App Info Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            App info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Version
              </span>
              <span className="font-mono text-white font-semibold">1.0.0</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Updated on
              </span>
              <span className="text-white font-semibold">September 18, 2026</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Offered by
              </span>
              <span className="text-cyan-300 font-semibold">KnowTheTech</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Released on
              </span>
              <span className="text-slate-300 font-semibold">September 15, 2026</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-slate-500" /> Category
              </span>
              <span className="text-slate-300 font-semibold">Productivity / Tools</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" /> Storage
              </span>
              <span className="text-emerald-400 font-semibold">100% Local / Offline</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy
              </span>
              <span className="text-emerald-400 font-semibold">Zero Telemetry</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Website
              </span>
              <a
                href="https://knowthemd.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                knowthemd.web.app <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Developer Contact */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Developer Support: <strong className="text-slate-300">support@knowthetech.com</strong></span>
          </div>
          <span className="text-[11px] text-slate-500">KnowTheTech Ecosystem</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCheckUpdates && (
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onCheckUpdates}
            >
              Check for Updates
            </GlassButton>
          )}
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            Close
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
