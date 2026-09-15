# KnowTheMD

> **Read. Write. Understand Markdown.**

A fast, beautiful, offline-first Markdown reader and editor built for **Windows**, **macOS**, **Linux**, **Android**, and **iOS**.

---

## Overview

KnowTheMD combines the focused simplicity of MarkText and Typora with the structural power of Obsidian and VS Code, wrapped in a bespoke **Liquid Glass & Glossy Blue Gradient** visual identity.

- **Offline-First & Local-First**: No mandatory cloud accounts. Your files never leave your computer.
- **Three Editing Modes**: Edit (Source), Preview (Rendered), Split (Synchronized side-by-side).
- **Dedicated Reading Mode**: Typeset distraction-free reading with customizable typography, column width, and reading progress bar.
- **Rich Syntax Support**: CommonMark, GitHub Flavored Markdown (GFM), footnotes, task lists, tables, YAML frontmatter, KaTeX math formulas (`$...$`, `$$...$$`), and syntax highlighting for 25+ programming languages.
- **Document Outline**: Automatic collapsible Table of Contents extracted from H1-H6 headers.
- **Multi-Format Export**: Professional PDF with custom print margins and typography, standalone HTML, clean Markdown, and plain text.
- **Autosave & Crash Recovery**: Continuous draft persistence with unsaved-change protection.
- **Mobile Touch Native**: Dedicated touch formatting toolbar, bottom navigation, and safe-area optimization for Android and iOS.

---

## Monorepo Architecture

- **`packages/ui`**: Shared Liquid Glass design tokens, icons, and accessible components (`GlassButton`, `GlassCard`, `GlassModal`, etc.).
- **`packages/markdown-engine`**: High-performance parser, XSS security sanitizer, KaTeX renderer, syntax highlighter, outline generator, and export pipeline.
- **`packages/editor`**: Dual-pane editor, split-view controller, reading mode, search bar, and command palette.
- **`apps/desktop`**: Full desktop application with multi-tab management, file explorer, drag & drop, and native dialogs.
- **`apps/mobile`**: Touch-first mobile application with virtual keyboard accessory bar and bottom navigation.
- **`apps/website`**: Official showcase portal, platform download center, interactive documentation, and SEO.
- **`tests/`**: Unit tests, security audit, editor state recovery, and extreme stress benchmarks (up to 100MB documents).

---

## Quick Start

### Prerequisites
- Node.js >= 18.0.0 (Node 22 LTS recommended)
- npm >= 9.0.0

### Installation & Running

```bash
# Install all dependencies across workspace
npm install

# Run the test suite (Unit, Security, Stress benchmarks)
npm test

# Launch Desktop application in dev mode
npm run dev:desktop

# Launch Mobile application in dev mode
npm run dev:mobile

# Launch Website portal in dev mode
npm run dev:website

# Build all packages and applications for production
npm run build
```

---

## Security & Privacy

KnowTheMD is strictly local-first. We collect **zero telemetry** and **zero document data**. User Markdown is sanitized against XSS vectors, malicious SVGs, and unsafe URL protocols. See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## License

See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for full open-source attributions.
