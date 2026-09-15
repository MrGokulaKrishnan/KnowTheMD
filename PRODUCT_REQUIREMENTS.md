# KnowTheMD Product Requirements Document (PRD)

**Product**: KnowTheMD  
**Tagline**: *Read. Write. Understand Markdown.*  
**Version**: 1.0.0  
**Status**: Approved Specification  

---

## 1. Executive Summary

KnowTheMD is a modern, high-performance, offline-first Markdown application designed for developers, technical writers, researchers, and students across Windows, macOS, Linux, Android, and iOS. Inspired by the focus of MarkText, Typora, and Obsidian, KnowTheMD introduces a proprietary **Liquid Glass & Glossy Blue Gradient** design identity based on its official `.MD` futuristic brand mark.

---

## 2. Target Personas

1. **The Software Engineer / DevOps Architect**: Needs rapid rendering of READMEs, CHANGELOGs, multi-language code snippets, YAML frontmatter, Mermaid architecture diagrams, and keyboard shortcuts.
2. **The Technical Writer & Researcher**: Demands distraction-free reading, KaTeX math rendering, collapsible outline navigation, word/character/reading-time statistics, and publication-ready PDF exports.
3. **The Mobile Writer**: Requires a touch-first interface on Android and iOS with a dedicated Markdown keyboard formatting bar, bottom navigation, and zero cognitive clutter.

---

## 3. Core Functional Requirements Matrix

| ID | Feature Category | Requirement Description | Priority |
|---|---|---|---|
| **FR-01** | **Editor Modes** | Seamless switching between **Edit** (source), **Preview** (rendered), and **Split** (dual synchronized scroll). | P0 (Must) |
| **FR-02** | **Reading Mode** | Distraction-free typography, customizable column width, font sizing, line height, and reading progress bar. | P0 (Must) |
| **FR-03** | **Syntax Support** | CommonMark + GFM: H1-H6, bold, italic, strikethrough, inline code, fenced code, blockquotes, lists, tables, checklists, footnotes, YAML frontmatter, KaTeX math. | P0 (Must) |
| **FR-04** | **Code Highlighting** | Syntax highlighting for 25+ programming languages, copy-code button, line number toggle, language badge. | P0 (Must) |
| **FR-05** | **File Operations** | Open, Save, Save As, New, Rename, Delete, Duplicate, Multi-tab management, Recent files, Folder explorer. | P0 (Must) |
| **FR-06** | **Drag & Drop** | Dragging Markdown files opens them; dragging image files inserts Markdown image syntax with preview. | P0 (Must) |
| **FR-07** | **Search & Replace** | Document search (case-sensitive, whole word, regex, previous/next match counter) + Workspace file search. | P0 (Must) |
| **FR-08** | **Document Outline** | Auto-generated collapsible Table of Contents from H1-H6 headers with instant anchor navigation. | P0 (Must) |
| **FR-09** | **Export Pipeline** | Professional export to PDF (with print CSS, margins, page breaks), standalone HTML, Plain text, Clean MD. | P0 (Must) |
| **FR-10** | **Autosave & Recovery**| Continuous background draft caching; crash recovery detection; unsaved changes safety dialog. | P0 (Must) |
| **FR-11** | **Command Palette** | Quick action modal (`Ctrl/Cmd+Shift+P` or `Ctrl/Cmd+K`) for keyboard-driven navigation. | P0 (Must) |
| **FR-12** | **Mobile Touch UX** | Bottom navigation bar, floating touch-optimized formatting toolbar above virtual keyboard, share sheet. | P0 (Must) |
| **FR-13** | **Theme System** | Liquid Glass Dark (Obsidian + Cyan Glow), Frosted Glass Light, and System adaptive theme. | P0 (Must) |
| **FR-14** | **Official Website** | Responsive showcase, OS-detected download cards, documentation center, changelog, legal & SEO. | P0 (Must) |

---

## 4. Non-Functional Requirements

### 4.1 Performance & Scalability
- **Startup Time**: Cold start < 1.2s; warm start < 400ms.
- **Typing Latency**: < 16ms input latency (60fps guaranteed).
- **Stress Handling**: Verified handling of 10KB, 100KB, 1MB, 10MB, and degradation testing up to 100MB without crashing.
- **Memory Footprint**: Idle memory < 90MB on desktop.

### 4.2 Security & Privacy
- **Local-First**: Zero document transmission to external servers.
- **XSS & Injection Immunity**: Strict HTML sanitization removing inline script tags, `javascript:` URLs, and dangerous attributes.
- **Safe Media**: Broken image gracefully renders placeholder fallback without UI freeze.

### 4.3 Accessibility (WCAG 2.1 AA / AAA)
- High-contrast text compliance (>= 4.5:1 for normal text, >= 3:1 for large text).
- Visible focus rings for keyboard navigation.
- Accessible ARIA roles on tabs, modals, buttons, and drawers.
- Reduced-motion media query support (`prefers-reduced-motion: reduce`).
