# KnowTheMD System Architecture

**Tagline**: *Read. Write. Understand Markdown.*  
**Version**: 1.0.0  
**Status**: Production Specification  

---

## 1. Architectural Principles

1. **Offline-First & Local-First**: The user's files never leave the machine. No mandatory cloud accounts, no remote synchronization without explicit user action, and zero telemetry.
2. **Performance & Light Footprint**: Instant startup, minimal memory consumption, zero input latency during typing, and virtualized/graceful degradation on large documents (up to 100MB).
3. **Maximum Code Reuse with Platform-Native Fidelity**: Core business logic, parsing, security sanitization, and design tokens are shared 100% across Desktop (Windows, macOS, Linux), Mobile (Android, iOS), and the Web showcase.
4. **Liquid Glass Design Language**: Cohesive brand identity anchored by the electric cyan / sapphire `.MD` logo, featuring frosted transparency, specular reflections, smooth borders, and dark/light adaptive tokens.
5. **Security by Design**: Defense-in-depth against malicious Markdown, cross-site scripting (XSS), malicious SVGs, path traversal, and unsafe URI protocols.

---

## 2. Monorepo Organization

```
KnowTheMD/
├── ARCHITECTURE.md                  # System architecture specification
├── PRODUCT_REQUIREMENTS.md          # Comprehensive Product Requirements Document (PRD)
├── DESIGN_SYSTEM.md                 # Design token specification & Liquid Glass guide
├── ROADMAP.md                       # Release and milestone roadmap
├── README.md                        # Master repository documentation
├── CHANGELOG.md                     # Semantic versioned release history
├── CONTRIBUTING.md                  # Development and contribution guide
├── CODE_OF_CONDUCT.md               # Community standards
├── SECURITY.md                      # Vulnerability reporting and security policies
├── THIRD_PARTY_LICENSES.md          # Complete attribution of open-source libraries
│
├── packages/
│   ├── ui/                          # Liquid Glass Design System component library
│   │   ├── src/
│   │   │   ├── tokens/              # Colors, typography, spacing, shadows, blurs
│   │   │   ├── components/          # GlassButton, GlassCard, GlassModal, GlassTabs, etc.
│   │   │   └── assets/              # Scalable vector logo and icons
│   │   └── package.json
│   │
│   ├── markdown-engine/             # High-performance Markdown parser & export pipeline
│   │   ├── src/
│   │   │   ├── parser.ts            # CommonMark & GFM AST parser
│   │   │   ├── sanitizer.ts         # Defense-in-depth HTML / SVG sanitizer
│   │   │   ├── highlighter.ts       # Code syntax highlighting (25+ languages)
│   │   │   ├── math.ts              # LaTeX / KaTeX rendering engine
│   │   │   ├── mermaid.ts           # Sandboxed diagram engine
│   │   │   ├── toc.ts               # Automated outline & heading extraction (H1-H6)
│   │   │   ├── stats.ts             # Word count, reading time, char count metrics
│   │   │   └── export.ts            # PDF, standalone HTML, Plaintext, Clean Markdown
│   │   └── package.json
│   │
│   └── editor/                      # Editor & reading experience components
│       ├── src/
│       │   ├── Editor.tsx           # Source editor with line numbers & bracket matching
│       │   ├── Preview.tsx          # Rendered Markdown view with interactive tasks
│       │   ├── SplitView.tsx        # Synchronized dual-pane editor and preview
│       │   ├── ReadingMode.tsx      # Typeset distraction-free reader with progress bar
│       │   ├── SearchBar.tsx        # Find and replace engine with regex & word matching
│       │   ├── CommandPalette.tsx   # Keyboard-driven action launcher (Ctrl/Cmd+Shift+P)
│       │   ├── Outline.tsx          # Collapsible document outline tree
│       │   └── useEditorState.ts    # Document state, undo/redo, autosave, drafts
│       └── package.json
│
├── apps/
│   ├── desktop/                     # KnowTheMD Desktop (Windows, macOS, Linux)
│   │   ├── src/
│   │   │   ├── App.tsx              # 3-column workspace (Sidebar, Editor, Outline)
│   │   │   ├── fileSystem.ts        # Native file operations, drag-and-drop, session restore
│   │   │   ├── components/          # Tabs, Explorer, Status Bar, Settings Modal
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   ├── mobile/                      # KnowTheMD Mobile (Android, iOS)
│   │   ├── src/
│   │   │   ├── MobileApp.tsx        # Touch-first UI, bottom navigation
│   │   │   ├── components/          # Touch keyboard formatting bar, mobile outline
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   └── website/                     # Official Portal (knowthemd.com)
│       ├── src/
│       │   ├── pages/               # Home, Download, Docs, Changelog, Legal
│       │   ├── seo.ts               # Meta tags, OpenGraph, JSON-LD Schema
│       │   └── main.tsx
│       └── package.json
│
└── tests/                           # Comprehensive test suites
    ├── markdown-engine.test.ts      # Unit tests for parser, TOC, stats
    ├── security-sanitization.test.ts# XSS, HTML injection, malicious SVG prevention
    ├── editor-state.test.ts         # Autosave, undo/redo, crash recovery
    └── stress-performance.test.ts   # Benchmarks from 10KB to 100MB documents
```

---

## 3. High-Level Architecture Diagram

```
                             ┌─────────────────────────────────┐
                             │       KnowTheMD Workspace       │
                             └────────────────┬────────────────┘
                                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
     ┌────────────────┐                                              ┌────────────────┐
     │ KnowTheMD Apps │                                              │ KnowTheMD.com  │
     └────────┬───────┘                                              └────────┬───────┘
              │                                                               │
     ┌────────┴────────┬──────────────────┐                       ┌───────────┴───────────┐
     │ Desktop Shell   │ Mobile Shell     │                       │ Features, Downloads,  │
     │ (Win/Mac/Linux) │ (Android / iOS)  │                       │ Documentation & SEO   │
     └────────┬────────┴────────┬─────────┘                       └───────────────────────┘
              │                 │
              └────────┬────────┘
                       │
       ┌───────────────┴───────────────┐
       │   Shared Internal Packages    │
       ├───────────────────────────────┤
       │ @knowthemd/ui                 │ -> Liquid Glass tokens, buttons, dialogs, modals
       │ @knowthemd/markdown-engine    │ -> Parser, Sanitizer, Syntax Highlighting, Export
       │ @knowthemd/editor             │ -> SplitView, ReadingMode, Outline, CommandPalette
       └───────────────────────────────┘
```

---

## 4. Data Flow & State Management

1. **Document Loading**:
   - File opened via native picker, drag-and-drop, or recent files list.
   - Text loaded into memory buffer and assigned an active tab descriptor.
   - Autosave session draft persisted in IndexedDB / local storage cache.

2. **Editing & Incremental Parsing**:
   - Keystrokes update the source state with debounced AST compilation.
   - Synchronized scroll controller computes proportional line-offset tracking between editor and preview pane.
   - Real-time outline and reading statistics extracted on idle cycles.

3. **Autosave & Crash Recovery**:
   - Unsaved modifications continuously cached to recovery storage (`knowthemd_drafts_{docId}`).
   - On application startup, crash recovery automatically detects and prompts to restore unsaved sessions.
   - Tab closure triggers safety confirmation: **Save**, **Discard**, or **Cancel**.

4. **Export Pipeline**:
   - Source AST compiled to semantic HTML.
   - Security sanitizer strips dangerous attributes and script vectors.
   - Theme variables injected for PDF print media or standalone HTML packaging.

---

## 5. Security Architecture

- **Strict Content Sanitization**: All user-supplied Markdown is parsed to an Abstract Syntax Tree (AST). Raw HTML nodes pass through an allowlist filter. `javascript:`, `vbscript:`, and unsafe data URIs are strictly stripped.
- **SVG & Mermaid Sandboxing**: Rendered diagrams are stripped of inline event handlers (`onload`, `onerror`, `<script>`).
- **Path Traversal Protection**: Relative image and file references are sanitized against directory escaping (`../..`).
- **No Arbitrary Code Execution**: Code blocks are strictly syntax-highlighted as text, never executed locally.
