import React, { useState } from 'react';
import { BrandLogo, GlassButton, GlassCard } from '@knowthemd/ui';
import { renderMarkdownToHtml } from '@knowthemd/markdown-engine';
import { detectUserPlatform, triggerDirectDownload, getRecommendedArch, type ArchRelease } from '../releases';
import { DownloadModal } from '../components/DownloadModal';
import {
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Code2,
  FileDown,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface HomePageProps {
  onNavigate: (page: string) => void;
}

const DEMO_MD = `# KnowTheMD
> Read. Write. Understand Markdown.

- **Speed**: Instant startup & 60fps typing
- **Privacy**: Local-first & zero telemetry
- **Math**: $E = mc^2$ and $\\sqrt{a^2 + b^2} = c$

\`\`\`typescript
const isFast = true;
console.log("KnowTheMD Ready!");
\`\`\`
`;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [demoText, setDemoText] = useState(DEMO_MD);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [downloadingArch, setDownloadingArch] = useState<{ arch: ArchRelease; osName: string } | null>(null);
  const userPlatform = detectUserPlatform();

  const platformDisplayNames: Record<string, string> = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    android: 'Android',
    ios: 'iOS',
  };

  const { html } = renderMarkdownToHtml(demoText);

  const faqs = [
    {
      q: 'Is KnowTheMD really 100% offline-first?',
      a: 'Yes. KnowTheMD does not require an account, has no mandatory cloud connectivity, and collects zero telemetry. Your files remain exclusively on your device.',
    },
    {
      q: 'How does KnowTheMD differ from MarkText or Typora?',
      a: 'KnowTheMD introduces a dedicated Liquid Glass design system, true synchronized dual-scroll split mode, a publisher-grade PDF export engine with CSS paged media, and native touch support designed from scratch for Android and iOS.',
    },
    {
      q: 'Does it support GitHub Flavored Markdown (GFM) and Math?',
      a: 'Yes! It features complete GFM tables, task checklists, strikethrough, footnotes, KaTeX LaTeX formulas ($...$, $$...$$), and syntax highlighting across 25+ programming languages.',
    },
    {
      q: 'Can I open massive Markdown files (e.g. 10MB to 50MB)?',
      a: 'KnowTheMD is benchmarked up to 100MB documents. Large files parse with minimal memory footprint and degrade gracefully without UI freezing.',
    },
  ];

  return (
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Specular Glass Glow in Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 shadow-[0_0_15px_rgba(0,240,255,0.15)] animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>KnowTheMD Version 1.0.0 Now Available</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Read. Write.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.35)]">
            Understand Markdown.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
          A fast, beautiful, offline-first Markdown reader and editor built for{' '}
          <span className="text-white font-medium">Windows</span>,{' '}
          <span className="text-white font-medium">macOS</span>,{' '}
          <span className="text-white font-medium">Linux</span>,{' '}
          <span className="text-white font-medium">Android</span>, and{' '}
          <span className="text-white font-medium">iOS</span>.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-10">
          <GlassButton
            variant="primary"
            size="lg"
            icon={<Download className="w-5 h-5" />}
            onClick={() => {
              const arch = getRecommendedArch(userPlatform);
              if (arch && arch.available) {
                setDownloadingArch({ arch, osName: platformDisplayNames[userPlatform] || 'Windows' });
                triggerDirectDownload(userPlatform);
              } else {
                onNavigate('download');
              }
            }}
            className="w-full sm:w-auto text-base px-8 py-3.5 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
          >
            Download for {platformDisplayNames[userPlatform] || 'Windows'}
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => onNavigate('download')}
            className="w-full sm:w-auto text-base px-8 py-3.5"
          >
            All Platforms & Downloads
          </GlassButton>
        </div>

        {/* Interactive Live Demo Widget in Hero */}
        <div className="w-full max-w-5xl rounded-2xl bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(0,240,255,0.15)] overflow-hidden text-left z-10">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-cyan-500/15 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-cyan-400 font-medium">Interactive Demo — Try it now!</span>
            </div>
            <span className="text-[11px] text-slate-500">Live Dual-Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cyan-500/15 h-72">
            {/* Left Editor */}
            <div className="p-4 bg-slate-950/50 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                Editor (Type Markdown below)
              </span>
              <textarea
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                className="flex-1 w-full bg-transparent text-slate-200 font-mono text-xs outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Right Live Preview */}
            <div className="p-4 bg-slate-900/40 overflow-y-auto flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2 font-mono">
                Rendered Preview
              </span>
              <div
                className="prose prose-invert prose-xs text-slate-200"
                onClick={(e) => {
                  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy-code]');
                  if (btn) {
                    const code = btn.getAttribute('data-copy-code');
                    if (code) {
                      navigator.clipboard.writeText(decodeURIComponent(code));
                      const originalText = btn.textContent || 'Copy';
                      btn.textContent = 'Copied!';
                      btn.classList.add('text-emerald-300');
                      setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('text-emerald-300');
                      }, 1800);
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Identity & Visual Design Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Bespoke Visual Identity
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Liquid Glass meets futuristic precision.
          </p>
          <p className="text-slate-400 mt-3 text-sm">
            Crafted around the official .MD brand mark with electric cyan gradients, frosted transparency, and specular highlights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <Zap className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Instantaneous Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered for instantaneous document startup and 60fps keystroke rendering without typing latency or heavy web view baggage.
            </p>
          </GlassCard>

          <GlassCard>
            <ShieldCheck className="w-8 h-8 text-sky-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">100% Local-First Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your notes never touch third-party cloud servers. Strict HTML sanitization neutralizes malicious scripts and XSS vectors.
            </p>
          </GlassCard>

          <GlassCard>
            <BookOpen className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Typeset Reading Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distraction-free reader with customizable column widths, font sizing, line heights, and an intuitive reading progress bar.
            </p>
          </GlassCard>

          <GlassCard>
            <Code2 className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">GFM & Math Syntax</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full GitHub Flavored Markdown tables, checklists, footnotes, KaTeX math rendering, and 25+ language syntax highlighting.
            </p>
          </GlassCard>

          <GlassCard>
            <FileDown className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Publication-Grade PDF</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export to print-ready PDF with page numbering, custom margins, and clean typography, or output standalone single-file HTML.
            </p>
          </GlassCard>

          <GlassCard>
            <Smartphone className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Dedicated Touch Mobile UX</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Not a shrunk desktop app. Tailored for touch with bottom navigation, a floating Markdown keyboard bar, and native share sheet.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 3. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                onClick={() => setActiveFaq(isOpen ? null : i)}
                className="rounded-xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/15 p-4 cursor-pointer transition-colors hover:border-cyan-400/40"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-cyan-500/10 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Final Download Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Start writing with KnowTheMD today.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Free and local-first. Experience the elegance of Markdown without distraction.
          </p>
          <GlassButton
            variant="primary"
            size="lg"
            icon={<Download className="w-5 h-5" />}
            onClick={() => onNavigate('download')}
          >
            Get KnowTheMD v1.0.0
          </GlassButton>
        </div>
      </section>

      {/* ── Download Started Modal ── */}
      {downloadingArch && (
        <DownloadModal
          arch={downloadingArch.arch}
          osName={downloadingArch.osName}
          onClose={() => setDownloadingArch(null)}
        />
      )}
    </div>
  );
};
