import React from 'react';
import { GlassCard } from '@knowthemd/ui';
import { Sparkles, Shield, Wrench, PlusCircle } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v1.0',
      date: 'September 18, 2026',
      title: 'Universal Device Compatibility & Play Store Release',
      highlights: 'APK Signature Scheme v2 & v3 verification, 4-byte zipaligning, square 15% radius icon, and Play Store style app details.',
      added: [
        'Full APK Signature Scheme v2 & v3 signing via apksigner for Android 7.0 up to Android 15+.',
        'Square application icon with pixel-perfect 15% corner radius across all launcher densities.',
        'Google Play Store styled App Details section with live device compatibility testing.',
        'Direct multi-platform browser downloads bypassing third-party redirects.',
        'Background Over-The-Air (OTA) update system with Restart to Update banner.',
      ],
      changed: [
        'Standardized release version to v1.0 across website, mobile, and desktop packages.',
        'Optimized compileSdkVersion 36 with targetSdkVersion 34 for maximum device installation reliability.',
      ],
      fixed: [
        'Resolved Android package installer failure on modern Android phones by enabling APK Signature Scheme v2 & v3.',
        'Fixed 4-byte zipalign integrity across APK distribution archives.',
      ],
      security: [
        'Hardened APK package signature using both Scheme v2 and Scheme v3.',
        'Validated 4-byte zipalign integrity neutralizing package tampering vulnerabilities.',
      ],
    },
    {
      version: '1.0.0',
      date: 'September 14, 2026',
      title: 'Production Core Launch',
      highlights: 'Complete cross-platform release with Liquid Glass identity, full GFM, and offline-first storage.',
      added: [
        'Monorepo cross-platform architecture supporting Windows, macOS, Linux, Android, and iOS.',
        'Proprietary Liquid Glass & Glossy Blue Gradient design system based on .MD insignia.',
        'CommonMark and GitHub Flavored Markdown (GFM) engine with KaTeX math and 25+ language syntax highlighting.',
        'Four workspace viewing modes: Edit (Source), Preview (Rendered), Split (Synchronized), and Reading Mode.',
        'Hierarchical Table of Contents auto-generated from H1-H6 headers.',
        'Find and Replace modal with regex, case-sensitivity, and whole-word matching.',
        'Publication-grade PDF export with CSS paged media rules and standalone HTML generator.',
        'Dedicated Android and iOS touch interfaces with sticky keyboard accessory toolbar.',
        'Official website with platform detection, checksums, and interactive documentation.',
      ],
      changed: [
        'Optimized AST parser to parse 100MB documents without memory exhaustion.',
        'Refined contrast tokens to guarantee WCAG 2.1 AAA accessibility conformance.',
      ],
      fixed: [
        'Fixed scroll position jitter during synchronized split-view editing.',
        'Resolved relative path image loading fallback without UI freeze.',
      ],
      security: [
        'Hardened defense-in-depth HTML sanitizer neutralizing XSS vectors and script injections.',
        'Sanitized SVG rendering against embedded onload and event handlers.',
        'Zero telemetry guarantee audited and verified.',
      ],
    },
    {
      version: '0.9.0',
      date: 'August 20, 2026',
      title: 'Public Beta Milestone',
      highlights: 'Added multi-document tabs, autosave crash recovery, and customizable typography.',
      added: [
        'Multi-document tab bar with dirty indicators and close confirmation dialogs.',
        'Continuous draft autosave and session recovery.',
        'Reading mode typography customizer (font size, line height, column width).',
      ],
      changed: [
        'Migrated theme tokens to centralized design system package.',
      ],
      fixed: [
        'Corrected table alignment parsing for center and right aligned columns.',
      ],
      security: [
        'Enforced protocol allowlisting on all Markdown links and images.',
      ],
    },
    {
      version: '0.8.0',
      date: 'July 15, 2026',
      title: 'Developer Preview Alpha',
      highlights: 'Initial prototype of the KnowTheMD engine.',
      added: [
        'Initial Markdown parser and source editor.',
        'Basic local file open and save dialogs.',
        'Command palette prototype.',
      ],
      changed: [],
      fixed: [],
      security: [],
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Changelog
        </h1>
        <p className="text-slate-400 text-sm">
          A continuous record of all new features, enhancements, and security fixes in KnowTheMD.
        </p>
      </div>

      <div className="space-y-8">
        {releases.map((rel) => (
          <GlassCard key={rel.version} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-500/15 gap-2">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">Version {rel.version}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                    {rel.title}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{rel.highlights}</div>
              </div>
              <span className="text-xs text-slate-500 font-mono">{rel.date}</span>
            </div>

            {/* Added */}
            {rel.added.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                  <PlusCircle className="w-4 h-4" /> Added
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {rel.added.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Changed */}
            {rel.changed.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                  <Wrench className="w-4 h-4" /> Changed
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {rel.changed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fixed */}
            {rel.fixed.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" /> Fixed
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {rel.fixed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security */}
            {rel.security && rel.security.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                  <Shield className="w-4 h-4" /> Security
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {rel.security.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
