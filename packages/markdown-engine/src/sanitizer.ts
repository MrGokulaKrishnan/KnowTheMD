/**
 * KnowTheMD Security Sanitizer
 * Implements strict defense-in-depth sanitization against:
 * - Cross-Site Scripting (XSS)
 * - Raw <script>, <iframe>, <object>, <embed>, <applet> tags
 * - Inline event handlers (onload, onerror, onclick, on*, etc.)
 * - Dangerous URI schemes (javascript:, vbscript:, unsafe data:)
 * - Malicious SVG payload injections
 * - Path traversal in relative asset links
 */

const DANGEROUS_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'applet',
  'meta',
  'base',
  'form',
  'link',
  'style',
]);

const ALLOWED_URI_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:', 'file:', '#', '/'];

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Block javascript: or vbscript: or data: (except safe images)
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) {
    return '#blocked-unsafe-uri';
  }

  // Allow data:image/*
  if (lower.startsWith('data:')) {
    if (lower.startsWith('data:image/png;') || lower.startsWith('data:image/jpeg;') || lower.startsWith('data:image/webp;') || lower.startsWith('data:image/gif;')) {
      return trimmed;
    }
    return '#blocked-unsafe-data-uri';
  }

  // Sanitize path traversal "../.." escaping
  if (trimmed.includes('../') || trimmed.includes('..\\')) {
    // Clean normalized path
    const normalized = trimmed.replace(/(\.\.[\/\\])+/g, '');
    return normalized;
  }

  return trimmed;
}

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let sanitized = rawHtml;

  // 1. Remove dangerous tag blocks completely (e.g. <script>...</script>)
  for (const tag of DANGEROUS_TAGS) {
    const tagRegex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(tagRegex, '');
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(selfClosingRegex, '');
  }

  // 2. Remove all inline event handlers (on\w+=...)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript: & vbscript: in any href/src
  sanitized = sanitized.replace(/(href|src)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, '$1="#blocked"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*(?:'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]+)/gi, '$1="#blocked"');

  // 4. Sanitize <svg> elements: ensure no nested scripts or event handlers
  sanitized = sanitized.replace(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gi, (match) => {
    let safeSvg = match.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
    safeSvg = safeSvg.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
    return safeSvg;
  });

  return sanitized;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
