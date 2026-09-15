# Changelog

All notable changes to **KnowTheMD** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-14

### Added
- **Monorepo Ecosystem**: Full workspace setup across `@knowthemd/ui`, `@knowthemd/markdown-engine`, `@knowthemd/editor`, `apps/desktop`, `apps/mobile`, and `apps/website`.
- **Liquid Glass Visual Identity**: Bespoke dark & light theme design system anchored by the official `.MD` futuristic cyan/sapphire logo mark.
- **Markdown Engine**: Support for CommonMark, GFM, task checklists, tables, footnotes, YAML frontmatter, inline KaTeX math formulas, and 25+ language syntax highlighting.
- **Three Core Workspace Modes**: Edit (Source), Preview (Rendered), and Split (dual synchronized scroll).
- **Dedicated Reading Mode**: Custom typeset reading layout with adjustable typography, column width, and reading progress bar.
- **Hierarchical Outline**: Collapsible Table of Contents generated automatically from H1-H6 headers.
- **Find & Replace**: Modal search supporting case-sensitivity, whole word, regular expressions, and match counter.
- **Command Palette**: Keyboard-driven command launcher (`Ctrl/Cmd+Shift+P` / `Ctrl/Cmd+K`).
- **Autosave & Crash Recovery**: Local-first draft persistence with unsaved-change protection prompts.
- **Multi-Format Export**: Export to publication-ready PDF, standalone HTML, clean Markdown, and plain text.
- **Desktop Application**: Multi-tab document workspace, sidebar file tree, drag-and-drop, and full settings modal.
- **Mobile Touch Experience**: Touch-first UI with mobile bottom navigation and floating Markdown keyboard toolbar.
- **Official Website & Downloads**: Showcase portal with platform detection (Windows, macOS, Linux, Android, iOS), SHA-256 checksums, documentation center, and SEO.
- **Security Defense-in-Depth**: Strict HTML sanitizer neutralizing XSS, script injection, and malicious SVGs.
- **Extreme Stress Benchmarks**: Verified performance across 10KB, 100KB, 1MB, 10MB, and degradation testing up to 100MB documents.

---

## [0.9.0] - 2026-08-20 (Beta)
### Added
- Initial prototype of Liquid Glass UI tokens.
- Synchronized split view scrolling algorithm.
- Multi-language code highlighter prototype.
### Changed
- Refactored AST pipeline for lower memory consumption.
### Fixed
- Fixed tab switching latency during rapid document navigation.

---

## [0.8.0] - 2026-07-15 (Alpha)
### Added
- Basic CommonMark parsing and preview rendering.
- Single-pane editor layout.
- Initial local file open and save dialogs.
