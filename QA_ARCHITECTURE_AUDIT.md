# KnowTheMD — Architecture & System Discovery Audit

**Audit Date**: September 16, 2026  
**Project**: KnowTheMD  
**Production URL**: https://knowthemd.web.app  
**Repository Architecture**: Monorepo (npm workspaces)  
**Lead Auditor**: Principal QA & Security Engineer  

---

## 1. Executive Architecture Summary

KnowTheMD is an offline-first, local-first Markdown reader and editor engineered with a proprietary **Liquid Glass & Blue Gradient** design identity. It is structured as an npm workspaces monorepo containing three shared core packages (`@knowthemd/ui`, `@knowthemd/markdown-engine`, `@knowthemd/editor`) and three application targets (`apps/desktop`, `apps/mobile`, `apps/website`).

| Component | Target Platform | Technology Stack | Deployment / Packaging |
|---|---|---|---|
| **Root Workspace** | Monorepo root | npm workspaces, TypeScript 5.6.3, Vitest 4.1.11 | CI/CD via GitHub Actions |
| **`@knowthemd/ui`** | Shared UI library | React 18, Tailwind CSS, Lucide Icons | Internal workspace package |
| **`@knowthemd/markdown-engine`** | Shared parser & pipeline | TypeScript CommonMark/GFM engine, KaTeX, Sanitizer | Internal workspace package |
| **`@knowthemd/editor`** | Shared editor experience | React 18, SplitView, Outline, ReadingMode | Internal workspace package |
| **`apps/desktop`** | Windows, macOS, Linux | Electron 41.7.1, Vite 6.4.3, NSIS / ZIP | Portable ZIP (137.1MB) & NSIS installer |
| **`apps/mobile`** | Android, iOS | Capacitor 8.5, Vite 6.4.3, Android SDK (API 24+) | Android APK (4.05MB direct download) |
| **`apps/website`** | Web Portal & Showcase | React 18, Vite 6.4.3, Firebase Hosting | Firebase Hosting (`knowthemd.web.app`) |

---

## 2. Dependency & Package Topology

```
KnowTheMD (Root: package.json)
 ├── packages/ui
 │    └── Liquid Glass design tokens, GlassButton, GlassCard, GlassModal, GlassTabs, BrandLogo
 ├── packages/markdown-engine
 │    └── AST Parser, GFM tables, checklists, math ($...$, $$...$$), Sanitizer, Stats, Exporter
 ├── packages/editor
 │    └── Source Editor, Preview, Synchronized SplitView, ReadingMode, Outline, SearchBar
 ├── apps/desktop
 │    └── 3-pane layout, Native File System Access API, Recent files, Electron shell, Session save
 ├── apps/mobile
 │    └── Touch-first layout, Sticky keyboard formatting toolbar, Bottom nav, Mobile outline
 └── apps/website
      └── Landing page, Interactive demo, Downloads, Documentation, Changelog, Legal, PWA
```

---

## 3. Authentication & Database Configuration

- **Authentication**: **Intentionally None (0 Auth / Zero Telemetry)**. KnowTheMD is architected as an offline-first local utility. Users do not need an account, password, or internet connection to view, edit, or export documents.
- **Database / Storage**: **Local-First Storage**.
  - Document drafts: `localStorage` (`knowthemd_drafts_{id}`) and session state (`knowthemd_session_tabs`).
  - Recent files: `localStorage` (`knowthemd_recent_files`).
  - Editor preferences: `localStorage` (`knowthemd_editor_settings`).
  - No remote databases (No Firestore, No Firebase Realtime DB, No MongoDB, No Postgres).
  - No server-side storage of user documents or keystrokes.

---

## 4. Hosting & Deployment Infrastructure

- **Firebase Project ID**: `knowthemd`
- **Hosting URL**: `https://knowthemd.web.app` (Custom domain: `https://knowthemd.com`)
- **Hosting Configuration (`firebase.json`)**:
  - Public directory: `apps/website/dist`
  - Headers: Configured with `Content-Type: application/vnd.android.package-archive` for `.apk`, `application/zip` for `.zip`, `X-Content-Type-Options: nosniff`, and `Content-Disposition: attachment`.
  - Rewrites: `/downloads/**` -> `/download-not-found.html`, catch-all `**` -> `/index.html`.
  - Clean URLs enabled.

---

## 5. Third-Party Integrations & Scope Verification

### AI Job Search & External Job Platform Inspection (Mandatory Verification)
- **Repo Inspection**: Verified 100% of the codebase across all packages and apps.
- **Finding**: **KnowTheMD contains NO job portal, AI job search, or resume parsing code.**
- **Integration Policy**:
  - No scraping of LinkedIn, Naukri, Indeed, or any third-party job board.
  - No fake claims or misleading keywords regarding job search or recruiting are present.
  - The application strictly focuses on its core value proposition: **"Read. Write. Understand Markdown."**

---

## 6. Architectural Risk & Vulnerability Assessment

### Critical Production Risks Identified:
1. **Live Download Delivery Failure**:
   - On the live site `https://knowthemd.web.app`, `/downloads/KnowTheMD-1.0.0-android.apk` and `/downloads/KnowTheMD_Windows_x64.zip` return `200 OK` with `text/html` (serving `index.html`)!
   - Root Cause: In the initial deployment, `**/downloads/**`, `**/*.apk`, and `**/*.zip` were in the Firebase `ignore` list, preventing physical file deployment to Firebase CDN.
2. **Missing Web App Bundle in Website Build**:
   - `apps/website/src/components/Navbar.tsx` contains links to `/app/` ("Launch Web App"), but `apps/website/dist/app` is not populated during standard `npm run build`.
3. **Tailwind Runtime Script on Production**:
   - `apps/website/index.html`, `apps/desktop/index.html`, and `apps/mobile/index.html` were loading `<script src="https://cdn.tailwindcss.com"></script>` at runtime. This causes layout flashes, violates offline-first availability, and degrades performance.
4. **Client Routing & Deep Linking**:
   - `apps/website/src/App.tsx` relied exclusively on `window.location.hash` (`#download`, `#docs`), causing direct navigation to `/download`, `/docs`, `/legal`, or 404 URLs to render the home page or fail deep-linking.
5. **Code Block Copy Button & Event Handler Stripping**:
   - `packages/markdown-engine/src/parser.ts` generated code block buttons with inline `onclick="..."`. Because `sanitizeHtml()` strips all `on*` attributes for defense-in-depth, the Copy button was rendered inert.
6. **Object URL Memory & Revocation Race**:
   - File exports and download triggers called `URL.revokeObjectURL(url)` synchronously after `a.click()` without appending `a` to the DOM, causing silent download cancellations in Firefox and WebKit.
7. **Production Page Gaps (Checklist Category 1 & 2)**:
   - Missing dedicated Cookie Policy, Security/Responsible Disclosure, Accessibility Statement, Help/Support Center, and 404 Not Found error states.
