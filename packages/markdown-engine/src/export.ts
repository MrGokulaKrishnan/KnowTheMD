/**
 * Document Export Engine
 * Generates standalone HTML, print-ready PDF styling, and plain text.
 */

import { renderMarkdownToHtml } from './parser';

export function exportToHtml(markdown: string, title = 'KnowTheMD Document', lightMode = false): string {
  const { html, frontMatter } = renderMarkdownToHtml(markdown, { lightMode });
  const docTitle = frontMatter?.title || title;

  return `<!DOCTYPE html>
<html lang="en" class="${lightMode ? 'light' : 'dark'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <style>
    :root {
      --bg: ${lightMode ? '#F8FAFC' : '#030712'};
      --text: ${lightMode ? '#0F172A' : '#F8FAFC'};
      --surface: ${lightMode ? '#FFFFFF' : '#0B1528'};
      --border: ${lightMode ? 'rgba(2, 132, 199, 0.2)' : 'rgba(56, 189, 248, 0.2)'};
      --primary: ${lightMode ? '#0284C7' : '#00F0FF'};
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      margin: 0;
      padding: 2rem 1.5rem;
      display: flex;
      justify-content: center;
    }
    .knowthemd-container {
      max-width: 860px;
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    code, pre {
      font-family: "JetBrains Mono", Consolas, monospace;
    }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { border: 1px solid var(--border); padding: 0.75rem 1rem; text-align: left; }
    th { background: rgba(56, 189, 248, 0.1); }
    blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; margin: 1.5rem 0; opacity: 0.85; }
  </style>
</head>
<body>
  <article class="knowthemd-container">
    ${html}
  </article>
</body>
</html>`;
}

export function exportToPdfHtml(markdown: string, title = 'KnowTheMD Document'): string {
  const { html, frontMatter } = renderMarkdownToHtml(markdown, { lightMode: true });
  const docTitle = frontMatter?.title || title;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
      @bottom-right {
        content: counter(page);
        font-size: 9pt;
        color: #64748B;
      }
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #FFFFFF !important;
        color: #0F172A !important;
      }
      h1 { page-break-before: auto; }
      pre, table, blockquote { page-break-inside: avoid; }
    }
    body {
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #0F172A;
      background: #FFFFFF;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0369A1;
    }
    h1 { font-size: 24pt; border-bottom: 2pt solid #0284C7; padding-bottom: 6pt; margin-top: 0; }
    h2 { font-size: 18pt; border-bottom: 1pt solid #CBD5E1; padding-bottom: 4pt; }
    code, pre { font-family: "Consolas", "Courier New", monospace; font-size: 9.5pt; }
    pre { background: #F1F5F9; padding: 10pt; border-radius: 4pt; border: 1pt solid #CBD5E1; }
    table { width: 100%; border-collapse: collapse; margin: 15pt 0; font-size: 10pt; }
    th, td { border: 1pt solid #CBD5E1; padding: 6pt 8pt; text-align: left; }
    th { background: #F8FAFC; }
    blockquote { border-left: 3pt solid #0284C7; margin: 12pt 0; padding-left: 12pt; font-style: italic; color: #334155; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

export function exportToPlainText(markdown: string): string {
  if (!markdown) return '';
  let text = markdown;

  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n/, '');
  // Remove code block wrappers
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, '$1');
  // Remove inline code ticks
  text = text.replace(/`([^`]+)`/g, '$1');
  // Remove images ![alt](url) -> alt
  text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');
  // Remove links [text](url) -> text
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  // Remove headings #
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  // Remove bold / italic / strikethrough
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');
  // Remove blockquote >
  text = text.replace(/^>\s?/gm, '');
  // Remove horizontal rules
  text = text.replace(/^(---|[*]{3,}|_{3,})$/gm, '');

  return text.trim();
}
