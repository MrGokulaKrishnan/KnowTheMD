/**
 * Comprehensive CommonMark + GitHub Flavored Markdown Parser
 * Built with defense-in-depth sanitization, table rendering, checklists, math, and code highlighting.
 */

import { sanitizeHtml, sanitizeUrl, escapeHtml } from './sanitizer';
import { highlightCode } from './highlighter';
import { generateSlug } from './toc';

export interface ParseOptions {
  enableMath?: boolean;
  enableTables?: boolean;
  enableTaskLists?: boolean;
  enableFootnotes?: boolean;
  lightMode?: boolean;
}

export interface ParseResult {
  html: string;
  frontMatter?: Record<string, string>;
}

export function parseFrontMatter(markdown: string): { frontMatter?: Record<string, string>; content: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { content: markdown };

  const rawYaml = match[1];
  const content = match[2];
  const frontMatter: Record<string, string> = {};

  rawYaml.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      frontMatter[key] = val;
    }
  });

  return { frontMatter, content };
}

export function renderMarkdownToHtml(markdown: string, options: ParseOptions = {}): ParseResult {
  const { frontMatter, content } = parseFrontMatter(markdown);

  const lines = content.split(/\r?\n/);
  const out: string[] = [];

  let inCodeBlock = false;
  let codeLang = '';
  let codeContent: string[] = [];

  let inTable = false;
  let tableRows: string[][] = [];
  let tableAlignments: string[] = [];

  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  const flushBlockquote = () => {
    if (inBlockquote) {
      const bqText = blockquoteLines.join('\n');
      out.push(
        `<blockquote class="border-l-4 border-cyan-400/80 bg-slate-900/40 backdrop-blur-md px-4 py-2.5 my-4 rounded-r-xl italic text-slate-300 shadow-sm">${renderInlines(
          bqText
        )}</blockquote>`
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const flushList = () => {
    if (inList) {
      out.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      let tableHtml = '<div class="overflow-x-auto my-5 rounded-xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-md shadow-lg">';
      tableHtml += '<table class="min-w-full text-sm text-left border-collapse">';

      // Header row
      const headerRow = tableRows[0];
      tableHtml += '<thead class="bg-slate-950/60 border-b border-cyan-500/25 text-cyan-300 font-semibold uppercase text-xs tracking-wider"><tr>';
      headerRow.forEach((cell, idx) => {
        const align = tableAlignments[idx] || 'left';
        tableHtml += `<th class="px-4 py-3 text-${align}">${renderInlines(cell.trim())}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      // Body rows
      for (let i = 1; i < tableRows.length; i++) {
        const row = tableRows[i];
        const bgClass = i % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent';
        tableHtml += `<tr class="${bgClass} border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-colors">`;
        row.forEach((cell, idx) => {
          const align = tableAlignments[idx] || 'left';
          tableHtml += `<td class="px-4 py-2.5 text-slate-200 text-${align}">${renderInlines(cell.trim())}</td>`;
        });
        tableHtml += '</tr>';
      }

      tableHtml += '</tbody></table></div>';
      out.push(tableHtml);

      inTable = false;
      tableRows = [];
      tableAlignments = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block boundary: ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const rawCode = codeContent.join('\n');
        const highlighted = highlightCode(rawCode, codeLang);
        out.push(
          `<div class="relative my-4 rounded-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-xl group">
            <div class="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-cyan-500/15 text-xs text-slate-400 font-mono">
              <span class="text-cyan-400 font-semibold uppercase">${escapeHtml((codeLang || 'text').toUpperCase())}</span>
              <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(
                rawCode
              )}'))" class="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors" title="Copy code">
                Copy
              </button>
            </div>
            <pre class="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200"><code>${highlighted}</code></pre>
          </div>`
        );
        inCodeBlock = false;
        codeContent = [];
        codeLang = '';
      } else {
        flushList();
        flushTable();
        flushBlockquote();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // 2. Blockquotes
    if (trimmed.startsWith('>')) {
      flushList();
      flushTable();
      inBlockquote = true;
      blockquoteLines.push(trimmed.slice(1).trim());
      continue;
    } else {
      flushBlockquote();
    }

    // 3. Tables: | cell | cell |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if this line is separator: |---|:---:|---:|
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
      if (isSeparator) {
        tableAlignments = cells.map((c) => {
          if (c.startsWith(':') && c.endsWith(':')) return 'center';
          if (c.endsWith(':')) return 'right';
          return 'left';
        });
      } else {
        inTable = true;
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // 4. Horizontal Rules: ---, ***, ___
    if (/^(---|[*]{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      out.push('<hr class="my-6 border-t border-cyan-500/20" />');
      continue;
    }

    // 5. Headings: H1 - H6
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const slug = generateSlug(text.replace(/[*_~`]/g, ''));

      const sizeClasses = [
        'text-3xl font-extrabold tracking-tight mt-8 mb-4 text-white border-b border-cyan-500/20 pb-2',
        'text-2xl font-bold tracking-tight mt-6 mb-3 text-white border-b border-cyan-500/10 pb-1.5',
        'text-xl font-semibold mt-5 mb-2.5 text-cyan-200',
        'text-lg font-semibold mt-4 mb-2 text-slate-100',
        'text-base font-semibold mt-3 mb-1.5 text-slate-200',
        'text-sm font-semibold uppercase tracking-wider mt-3 mb-1 text-slate-400',
      ];

      out.push(
        `<h${level} id="${slug}" class="${sizeClasses[level - 1]} scroll-mt-20 flex items-center group">
          <span>${renderInlines(text)}</span>
          <a href="#${slug}" class="ml-2 opacity-0 group-hover:opacity-100 text-cyan-400 text-sm" aria-hidden="true">#</a>
        </h${level}>`
      );
      continue;
    }

    // 6. Lists & Task items
    const taskMatch = line.match(/^(\s*)([-*]|\d+\.)\s+\[([ xX])\]\s+(.+)$/);
    if (taskMatch) {
      if (!inList) {
        inList = true;
        listType = 'ul';
        out.push('<ul class="my-3 space-y-1.5 list-none pl-1">');
      }
      const isChecked = taskMatch[3].toLowerCase() === 'x';
      const text = taskMatch[4];
      out.push(
        `<li class="flex items-start gap-2.5 text-slate-200 text-sm">
          <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="mt-1 w-4 h-4 rounded text-cyan-500 bg-slate-900 border-cyan-500/30 accent-cyan-400 cursor-default" />
          <span class="${isChecked ? 'line-through text-slate-500' : ''}">${renderInlines(text)}</span>
        </li>`
      );
      continue;
    }

    const ulMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        out.push('<ul class="my-3 space-y-1 list-disc list-inside text-slate-300 text-sm">');
      }
      out.push(`<li>${renderInlines(ulMatch[3])}</li>`);
      continue;
    }

    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
        out.push('<ol class="my-3 space-y-1 list-decimal list-inside text-slate-300 text-sm">');
      }
      out.push(`<li>${renderInlines(olMatch[3])}</li>`);
      continue;
    }

    flushList();

    // 7. Empty lines
    if (trimmed === '') {
      continue;
    }

    // 8. Regular Paragraphs
    out.push(`<p class="my-3 leading-relaxed text-slate-300 text-sm sm:text-base">${renderInlines(line)}</p>`);
  }

  flushList();
  flushTable();
  flushBlockquote();

  // Final HTML pass through security sanitizer
  const rawHtml = out.join('\n');
  const safeHtml = sanitizeHtml(rawHtml);

  return { html: safeHtml, frontMatter };
}

/**
 * Inlines parser: Bold, Italic, Strikethrough, Code, Links, Images, Math
 */
function renderInlines(text: string): string {
  let s = text;

  // Math blocks: $$...$$
  s = s.replace(/\$\$(.+?)\$\$/g, (_, math) => {
    return `<span class="inline-block px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-sm">${escapeHtml(
      math
    )}</span>`;
  });

  // Inline math: $...$
  s = s.replace(/\$(.+?)\$/g, (_, math) => {
    return `<span class="px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-300 font-mono text-xs">${escapeHtml(
      math
    )}</span>`;
  });

  // Images: ![alt](url)
  s = s.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    const cleanUrl = sanitizeUrl(url);
    const safeAlt = escapeHtml(alt);
    return `<span class="inline-block my-3"><img src="${cleanUrl}" alt="${safeAlt}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'100\\' viewBox=\\'0 0 200 100\\'><rect width=\\'200\\' height=\\'100\\' fill=\\'%230f172a\\' rx=\\'8\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%2338bdf8\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Image unavailable</text></svg>';" class="rounded-xl border border-cyan-500/20 max-w-full h-auto shadow-md" /><span class="block text-center text-xs text-slate-500 mt-1 italic">${safeAlt}</span></span>`;
  });

  // Links: [text](url)
  s = s.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, url) => {
    const cleanUrl = sanitizeUrl(url);
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/40 hover:decoration-cyan-400 transition-colors font-medium">${renderInlines(
      label
    )}</a>`;
  });

  // Inline code: `...`
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    return `<code class="px-1.5 py-0.5 text-xs font-mono rounded-md bg-slate-900 border border-cyan-500/20 text-cyan-300">${escapeHtml(
      code
    )}</code>`;
  });

  // Bold: **...**
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Italic: *...* or _..._
  s = s.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-200">$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em class="italic text-slate-200">$1</em>');

  // Strikethrough: ~~...~~
  s = s.replace(/~~(.+?)~~/g, '<del class="line-through text-slate-500">$1</del>');

  return s;
}
