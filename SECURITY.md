# Security Policy

## Reporting a Vulnerability

We take the security of KnowTheMD very seriously. Since Markdown files may originate from untrusted external sources (e.g., git repositories, downloads, email attachments), KnowTheMD implements defense-in-depth sanitization.

If you discover a security vulnerability, please report it via private email to:
**security@knowthemd.com**

Please include:
1. Type of issue (e.g. XSS, unsafe URL execution, path traversal).
2. Step-by-step reproduction instructions or a sample `.md` payload.
3. Impact assessment and suggested remediation if known.

We pledge to acknowledge receipt within 24 hours and provide regular status updates until the fix is released.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Guarantees & Threat Model

1. **Strict HTML Sanitization**: Raw HTML tags embedded in Markdown are aggressively sanitized. `<script>`, `<iframe>`, `<object>`, `<embed>`, `<applet>`, `<form>`, `<meta>`, and `<base>` tags are completely stripped.
2. **Event Handler Neutralization**: Attributes like `onload`, `onerror`, `onclick`, `onmouseover`, and all `on*` event handlers are removed from all tags including `<img>` and `<svg>`.
3. **Protocol Allowlisting**: Links (`href`) and image sources (`src`) only accept safe protocols (`http:`, `https:`, `mailto:`, `file:`, relative paths, or local hash anchors `#`). Dangerous schemes such as `javascript:`, `vbscript:`, or arbitrary executable data schemes are discarded.
4. **Local-First Sandboxing**: KnowTheMD does not execute terminal commands or invoke external shells from Markdown hyperlinks.
5. **No Telemetry**: No user content, keystrokes, or document paths are transmitted across the network.
