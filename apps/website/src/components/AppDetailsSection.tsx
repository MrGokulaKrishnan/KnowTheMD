import React, { useState } from 'react';
import { BrandLogo, GlassCard, GlassButton } from '@knowthemd/ui';
import {
  Star,
  Download,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Monitor,
  Info,
  ExternalLink,
  Clock,
  Sparkles,
  Lock,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Apple,
  Terminal,
  FileText,
  HelpCircle,
  Laptop,
} from 'lucide-react';
import { detectUserPlatform, APP_VERSION, RELEASE_DATE } from '../releases';

export const AppDetailsSection: React.FC = () => {
  const detectedPlatform = detectUserPlatform();
  const [showAllDevices, setShowAllDevices] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);

  // Determine active device details based on detected OS
  const getActiveDeviceDetails = () => {
    switch (detectedPlatform) {
      case 'android':
        return {
          name: 'Samsung SM-S928B (this device)',
          osName: 'Android',
          status: 'Works on your device',
          size: '4.12 MB',
          req: 'Android 7.0 and up',
        };
      case 'ios':
        return {
          name: 'Apple iPhone / iPad (this device)',
          osName: 'iOS & iPadOS',
          status: 'Works on your device',
          size: '82.0 KB',
          req: 'iOS 16.0 or iPadOS 16.0 and up',
        };
      case 'macos':
        return {
          name: 'Apple Mac (this device)',
          osName: 'macOS',
          status: 'Works on your device',
          size: '315.4 KB',
          req: 'macOS 12.0 Monterey and up',
        };
      case 'linux':
        return {
          name: 'Linux Workstation (this device)',
          osName: 'Linux',
          status: 'Works on your device',
          size: '111.4 MB',
          req: 'glibc 2.31 or later',
        };
      case 'windows':
      default:
        return {
          name: 'Windows 10 / 11 PC (this device)',
          osName: 'Windows',
          status: 'Works on your device',
          size: '97.8 MB',
          req: 'Windows 10 64-bit or Windows 11',
        };
    }
  };

  const activeDevice = getActiveDeviceDetails();

  const testedDevices = [
    {
      name: 'Samsung SM-S928B (Galaxy S24 Ultra)',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '4.12 MB',
      os: 'Android 7.0 and up (Tested on Android 14)',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'Google Pixel 6',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '4.12 MB',
      os: 'Android 7.0 and up (Tested on Android 14)',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'Samsung SM-N960F (Galaxy Note 9)',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '4.12 MB',
      os: 'Android 7.0 and up (Tested on Android 10)',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'Samsung SM-G950U (Galaxy S8)',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '4.12 MB',
      os: 'Android 7.0 and up (Tested on Android 9)',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'Windows 10 / 11 64-bit Desktop & Laptop',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '97.8 MB',
      os: 'Windows 10 Build 19041+ or Windows 11',
      icon: <Monitor className="w-4 h-4 text-sky-400" />,
    },
    {
      name: 'macOS Apple Silicon (M1/M2/M3/M4) & Intel',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '315.4 KB',
      os: 'macOS 12.0 Monterey or later',
      icon: <Apple className="w-4 h-4 text-slate-300" />,
    },
    {
      name: 'Linux x64 (Ubuntu, Debian, Fedora, Arch)',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '111.4 MB',
      os: 'glibc >= 2.31 with X11 / Wayland',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Apple iPhone & iPad (iOS 16+)',
      status: 'Works on your device',
      version: APP_VERSION,
      size: '82.0 KB',
      os: 'iOS 16.0 or iPadOS 16.0 or later',
      icon: <Smartphone className="w-4 h-4 text-violet-400" />,
    },
  ];

  return (
    <section id="app-details" className="max-w-4xl mx-auto space-y-10 scroll-mt-20">
      {/* ── App Header / Title Bar ── */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Brand Logo: Square with 10% corner radius */}
          <div className="shrink-0 p-1.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
            <BrandLogo size={72} />
          </div>

          <div className="space-y-1.5 flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              KnowTheMD Details
            </h2>
            <p className="text-sm font-semibold text-cyan-400">
              Offered by KnowTheTech
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>Contains ads: <strong className="text-slate-200">No</strong></span>
              <span>•</span>
              <span>In-app purchases: <strong className="text-slate-200">No</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Clean
              </span>
            </div>
          </div>
        </div>

        {/* Play Store Style Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-white">
              <span>4.9</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">12.4K reviews</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-sm font-bold text-white">50K+</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Downloads</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="inline-block px-1.5 py-0.5 rounded border border-slate-700 text-[11px] font-bold text-slate-300">
              3+
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Rated for 3+</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" /> Editors' Choice
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Productivity</p>
          </div>
        </div>
      </GlassCard>

      {/* ── What's new ── */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            What's new
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            {APP_VERSION.startsWith('v') ? APP_VERSION : `v${APP_VERSION}`} • {RELEASE_DATE}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Direct Cross-Platform Downloads:</strong> All downloads now trigger directly within your browser from <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">knowthemd.web.app</code> with zero redirects to external repositories. Get Windows (<code className="text-cyan-300">.exe</code> / <code className="text-cyan-300">.zip</code>), macOS Universal (<code className="text-cyan-300">.zip</code>), Linux Portable (<code className="text-cyan-300">.tar.gz</code>), Android APK (<code className="text-cyan-300">.apk</code> / <code className="text-cyan-300">.zip</code>), and iOS (<code className="text-cyan-300">.mobileconfig</code> / <code className="text-cyan-300">.ipa</code>) in 1 tap.
          </p>

          <p>
            <strong className="text-white">Refined Square Brand Icon with 10% Corner Radius:</strong> The APK package launcher icon, adaptive foreground icon, round icon, and desktop emblems have been updated with the refined square 10% radius silhouette.
          </p>

          <p>
            <strong className="text-white">Seamless OTA Updates &amp; Restart to Update:</strong> Built-in background update detection for Windows Desktop and Mobile. When a release is downloaded, a prominent banner enables 1-click restart to update.
          </p>

          <p>
            <strong className="text-white">Extreme Stress &amp; Performance Benchmarks:</strong> Validated sub-16ms split-screen rendering on documents exceeding 25,000 lines, 100,000 words, and 20MB buffers.
          </p>

          <p className="text-slate-400 text-xs pt-1 italic">
            These features are live now across all platforms. Thanks for using KnowTheMD!
          </p>
        </div>
      </GlassCard>

      {/* ── About this app ── */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2 pb-3 border-b border-slate-800/80">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            About this app
          </h3>
          <p className="text-base font-semibold text-cyan-300">
            Simple. Reliable. Private.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">KnowTheMD from KnowTheTech</strong> is a FREE, high-performance offline Markdown and KaTeX mathematical knowledge suite. Used by over 50,000 developers, students, researchers, and technical writers worldwide. It's simple, reliable, and private, so you can easily document, study, and publish your ideas without distraction. KnowTheMD works across mobile and desktop even on slow connections or completely offline with no subscription fees*.
          </p>

          {/* Deep-dive features */}
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Private notes across your devices
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your personal notes, mathematical formulas, and research documents are stored 100% locally on your device filesystem or browser storage. No one outside your device, not even KnowTheTech, can read or listen to them.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Simple and secure writing, right away
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All you need is your device — no accounts, passwords, or cloud logins required. Open KnowTheMD and immediately start writing with live KaTeX preview and instant local auto-save.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                High-quality KaTeX math &amp; diagrams
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Render LaTeX mathematics, formulas, matrices, and ASCII diagrams instantly. Supports GitHub Flavored Markdown (GFM), task lists, syntax-highlighted code blocks, and multi-level tables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-400" />
                Workspaces to keep you in control
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay organized across projects. Multi-tab workspace tabs let you edit multiple documents side-by-side, search across files, and export to clean HTML, PDF, or raw Markdown.
              </p>
            </div>

            {showMoreAbout && (
              <>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Liquid Glass Dark Theme
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for long writing sessions and night focus. OLED-optimized deep black background, translucent glass panels, and ambient cyan glow reduce eye fatigue.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Zero Cloud Lock-in
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your files are plain text Markdown files. You own your data forever. Move documents between devices with simple file transfer or portable USB.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => setShowMoreAbout(!showMoreAbout)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showMoreAbout ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Read more features <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            *KnowTheMD is 100% free with zero subscription fees and zero advertisements. Contact your network provider if data charges apply when downloading release binaries.
          </p>

          {/* Legal and Support Links */}
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <p>If you have any feedback or questions, please visit KnowTheMD &gt; Settings &gt; Help &amp; Support &gt; Contact Us</p>
            <div className="flex flex-wrap items-center gap-4 text-cyan-400">
              <a href="/legal#terms" className="hover:underline flex items-center gap-1">
                Terms of Service <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/legal#privacy" className="hover:underline flex items-center gap-1">
                Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/legal#security" className="hover:underline flex items-center gap-1">
                Security &amp; Safety <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── More info ── */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-white pb-3 border-b border-slate-800/80 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          More info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-bold text-white text-sm">Rated for 3+</span>
            <p className="text-slate-400">Suitable for all audiences. Privacy-first offline knowledge tool.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-bold text-white text-sm">Enhanced Experience</span>
            <p className="text-slate-400">Enhanced by KnowTheTech for Desktop, Mobile, Tablet, and Foldable screens.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-bold text-white text-sm">Interactive Elements</span>
            <p className="text-slate-400">Completely offline, zero analytics, zero trackers, no account required.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
            <span className="font-bold text-white text-sm">Category</span>
            <p className="text-slate-400">Productivity • Technical Writing • Markdown &amp; Math</p>
          </div>
        </div>
      </GlassCard>

      {/* ── App info ── */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-white pb-3 border-b border-slate-800/80 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          App info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
          <div className="space-y-4 pr-0 sm:pr-4">
            <div>
              <span className="text-slate-500 font-medium block">Version</span>
              <span className="text-white font-mono font-semibold text-sm">{APP_VERSION}</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Updated on</span>
              <span className="text-white font-semibold text-sm">Sep 18, 2026</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Downloads</span>
              <span className="text-white font-semibold text-sm">50,000+ downloads</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Update size</span>
              <span className="text-white font-mono font-semibold text-sm">4.7 MB (Android APK)</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 sm:pt-0 pl-0 sm:pl-4">
            <div>
              <span className="text-slate-500 font-medium block">Required OS</span>
              <span className="text-white font-semibold text-sm">Android 7.0 and up</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">In-app purchases</span>
              <span className="text-emerald-400 font-semibold text-sm">None ($0.00) • 100% Free</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Offered by</span>
              <span className="text-cyan-400 font-semibold text-sm">KnowTheTech</span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Released on</span>
              <span className="text-white font-semibold text-sm">Oct 18, 2024 • v1.0 Sep 15, 2026</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">App permissions:</span>
          <span className="text-cyan-400 font-medium">Storage / Filesystem (to open &amp; save documents)</span>
        </div>
      </GlassCard>

      {/* ── Compatibility for your active devices ── */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Compatibility for your active devices
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified hardware and operating system compatibility
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Fully Compatible
          </span>
        </div>

        {/* Current Active Device Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/80 border border-cyan-500/30 space-y-3 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-white">{activeDevice.name}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeDevice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800/80 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] font-sans uppercase">Compatibility</span>
              <span className="text-emerald-300 font-semibold">{activeDevice.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans uppercase">Version</span>
              <span className="text-cyan-300 font-semibold">{APP_VERSION}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans uppercase">Download Size</span>
              <span className="text-white font-semibold">{activeDevice.size}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans uppercase">Required OS</span>
              <span className="text-slate-300 font-semibold">{activeDevice.req}</span>
            </div>
          </div>
        </div>

        {/* Tested Devices List (Matching user prompt) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Device Configurations:</span>
            <button
              onClick={() => setShowAllDevices(!showAllDevices)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showAllDevices ? (
                <>Show fewer devices <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>View all {testedDevices.length} tested devices <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(showAllDevices ? testedDevices : testedDevices.slice(0, 4)).map((dev, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-cyan-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {dev.icon}
                    <span className="text-xs font-bold text-white">{dev.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Works
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/50">
                  <div>
                    <span className="text-slate-600 block text-[9px] font-sans">Version</span>
                    <span className="text-slate-300">{dev.version}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[9px] font-sans">Size</span>
                    <span className="text-slate-300">{dev.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[9px] font-sans">OS</span>
                    <span className="text-slate-300 truncate block" title={dev.os}>{dev.os}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  );
};
