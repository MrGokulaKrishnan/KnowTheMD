import { describe, it, expect } from 'vitest';
import {
  renderMarkdownToHtml,
  parseFrontMatter,
  extractToc,
  computeStats,
  exportToPlainText,
  exportToHtml,
  exportToPdfHtml,
} from '@knowthemd/markdown-engine';

describe('Markdown Engine Parser & GFM', () => {
  it('parses headings H1-H6 with slugs and anchors', () => {
    const md = '# Title One\n## Subtitle Two\n### Heading Three';
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('<h1 id="title-one"');
    expect(html).toContain('Title One');
    expect(html).toContain('<h2 id="subtitle-two"');
    expect(html).toContain('Subtitle Two');
    expect(html).toContain('<h3 id="heading-three"');
  });

  it('parses inline bold, italic, strikethrough, and code', () => {
    const md = 'Here is **bold**, *italic*, ~~deleted~~, and `inline code`.';
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('<strong class="font-bold text-white">bold</strong>');
    expect(html).toContain('<em class="italic text-slate-200">italic</em>');
    expect(html).toContain('<del class="line-through text-slate-500">deleted</del>');
    expect(html).toContain('<code class="px-1.5 py-0.5 text-xs font-mono rounded-md bg-slate-900 border border-cyan-500/20 text-cyan-300">inline code</code>');
  });

  it('parses GFM task lists with checked/unchecked status', () => {
    const md = '- [ ] Task pending\n- [x] Task completed';
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked');
    expect(html).toContain('line-through');
    expect(html).toContain('Task pending');
    expect(html).toContain('Task completed');
  });

  it('parses GFM tables with alignment', () => {
    const md = `| Item | Price | Status |
|:---|:---:|---:|
| Apple | $1.00 | Available |
| Banana | $0.50 | Out of stock |`;
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('<table');
    expect(html).toContain('Apple');
    expect(html).toContain('text-center');
    expect(html).toContain('text-right');
  });

  it('parses code blocks with syntax highlighting', () => {
    const md = "```typescript\nconst message: string = 'Hello KnowTheMD';\n```";
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('TYPESCRIPT');
    expect(html).toContain('Copy');
    expect(html).toContain('text-cyan-400 font-semibold">const</span>');
  });

  it('parses math formulas (inline and block)', () => {
    const md = 'Inline $E=mc^2$ and block $$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$';
    const { html } = renderMarkdownToHtml(md);
    expect(html).toContain('E=mc^2');
    expect(html).toContain('\\sum_{i=1}^n');
  });

  it('extracts YAML frontmatter cleanly', () => {
    const md = `---\ntitle: "Test Document"\nauthor: "KnowTheMD Team"\n---\n\n# Body content`;
    const { frontMatter, content } = parseFrontMatter(md);
    expect(frontMatter?.title).toBe('Test Document');
    expect(frontMatter?.author).toBe('KnowTheMD Team');
    expect(content.trim()).toBe('# Body content');
  });
});

describe('Table of Contents Extractor', () => {
  it('extracts hierarchical headings and ignores headings inside code blocks', () => {
    const md = `# Document Title
## Section 1
\`\`\`bash
# this is a bash comment, not a markdown heading
echo "hi"
\`\`\`
### Subsection 1.1
## Section 2`;

    const toc = extractToc(md);
    expect(toc.length).toBe(4);
    expect(toc[0]).toEqual({ id: 'document-title', text: 'Document Title', level: 1, lineNumber: 1 });
    expect(toc[1]).toEqual({ id: 'section-1', text: 'Section 1', level: 2, lineNumber: 2 });
    expect(toc[2]).toEqual({ id: 'subsection-11', text: 'Subsection 1.1', level: 3, lineNumber: 7 });
    expect(toc[3]).toEqual({ id: 'section-2', text: 'Section 2', level: 2, lineNumber: 8 });
  });
});

describe('Document Metrics & Stats', () => {
  it('computes word count, character count, lines, and reading time', () => {
    const sample = 'Hello world! This is a test of the KnowTheMD metrics engine.\n\nSecond paragraph here.';
    const stats = computeStats(sample);
    expect(stats.words).toBe(14);
    expect(stats.paragraphs).toBe(2);
    expect(stats.lines).toBe(3);
    expect(stats.readingTimeMinutes).toBe(1);
  });
});

describe('Document Exporters', () => {
  it('exports plain text by stripping markdown tokens', () => {
    const md = '# Header\nThis is **bold** and *italic* with `code`.\n[Link](https://example.com)';
    const plain = exportToPlainText(md);
    expect(plain).not.toContain('#');
    expect(plain).not.toContain('**');
    expect(plain).not.toContain('*');
    expect(plain).not.toContain('`');
    expect(plain).toContain('Header');
    expect(plain).toContain('This is bold and italic with code.');
    expect(plain).toContain('Link');
  });

  it('exports standalone HTML with embedded styles', () => {
    const md = '# Title\nContent here';
    const html = exportToHtml(md, 'My Doc', false);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>My Doc</title>');
    expect(html).toContain('class="dark"');
  });

  it('exports PDF print-ready HTML with @page rules', () => {
    const md = '# Report Title\nReport details';
    const pdfHtml = exportToPdfHtml(md, 'Print Report');
    expect(pdfHtml).toContain('@page {');
    expect(pdfHtml).toContain('size: A4;');
    expect(pdfHtml).toContain('counter(page)');
  });
});
