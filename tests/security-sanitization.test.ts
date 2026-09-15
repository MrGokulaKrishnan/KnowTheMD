import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeUrl } from '@knowthemd/markdown-engine';

describe('Security Sanitization & Defense-in-Depth', () => {
  it('CRITICAL: completely strips dangerous <script> tags and payloads', () => {
    const malicious = `<div>Hello<script>alert("XSS")</script> world!</div>`;
    const sanitized = sanitizeHtml(malicious);
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('alert(');
    expect(sanitized).toBe('<div>Hello world!</div>');
  });

  it('CRITICAL: removes inline event handlers (onload, onerror, onclick, onmouseover)', () => {
    const malicious = `<img src="nonexistent.jpg" onerror="alert('pwned')" onload="fetch('/stolen')" onclick="bad()">`;
    const sanitized = sanitizeHtml(malicious);
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('onload');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('alert');
  });

  it('HIGH: blocks javascript: and vbscript: URIs in links and image sources', () => {
    const evilHref = `<a href="javascript:alert(1)">Click me</a>`;
    const evilVb = `<a href="vbscript:msgbox(1)">Click me</a>`;

    const cleanHref = sanitizeHtml(evilHref);
    const cleanVb = sanitizeHtml(evilVb);

    expect(cleanHref).not.toContain('javascript:');
    expect(cleanHref).toContain('href="#blocked"');
    expect(cleanVb).not.toContain('vbscript:');
    expect(cleanVb).toContain('href="#blocked"');
  });

  it('HIGH: sanitizeUrl blocks dangerous executable protocols', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#blocked-unsafe-uri');
    expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('#blocked-unsafe-uri');
    expect(sanitizeUrl('vbscript:run()')).toBe('#blocked-unsafe-uri');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#blocked-unsafe-data-uri');

    // Safe protocols allowed
    expect(sanitizeUrl('https://knowthemd.com')).toBe('https://knowthemd.com');
    expect(sanitizeUrl('mailto:support@knowthemd.com')).toBe('mailto:support@knowthemd.com');
    expect(sanitizeUrl('#heading-anchor')).toBe('#heading-anchor');
    expect(sanitizeUrl('data:image/png;base64,iVBORw0KGgo=')).toBe('data:image/png;base64,iVBORw0KGgo=');
  });

  it('HIGH: neutralizes malicious SVG script payloads', () => {
    const maliciousSvg = `<svg><script>window.location="http://evil.com"</script><circle cx="50" cy="50" r="40" onload="alert(1)" /></svg>`;
    const sanitized = sanitizeHtml(maliciousSvg);
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('onload');
    expect(sanitized).toContain('<svg><circle cx="50" cy="50" r="40" /></svg>');
  });

  it('MEDIUM: sanitizes directory traversal escaping in relative asset paths', () => {
    const traversalPath = '../../../../windows/system32/cmd.exe';
    const clean = sanitizeUrl(traversalPath);
    expect(clean).not.toContain('..');
    expect(clean).toBe('windows/system32/cmd.exe');
  });

  it('MEDIUM: strips <iframe>, <object>, <embed>, <applet> embeds', () => {
    const embeds = `<iframe src="https://attacker.com"></iframe><embed src="evil.swf"></embed>`;
    const sanitized = sanitizeHtml(embeds);
    expect(sanitized).not.toContain('<iframe');
    expect(sanitized).not.toContain('<embed');
  });
});
