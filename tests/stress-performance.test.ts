import { describe, it, expect } from 'vitest';
import {
  renderMarkdownToHtml,
  extractToc,
  computeStats,
} from '@knowthemd/markdown-engine';

describe('Extreme Stress & Performance Benchmarks', () => {
  // Helper to generate benchmark markdown of arbitrary size
  function generateBenchmarkDocument(targetBytes: number): string {
    const chunk = `## Heading Benchmark Section
This is a high-performance stress test paragraph containing **bold text**, *italics*, and [hyperlinks](https://knowthemd.com).
- [x] Completed task item
- [ ] Incomplete task item
\`\`\`typescript
function benchmarkSpeed(n: number): boolean {
  return n > 0;
}
\`\`\`
| Column A | Column B | Column C |
|:---|:---:|---:|
| 100 | Sample Value | Valid |
| 200 | Secondary Row | Complete |

`;
    const repetitions = Math.max(1, Math.ceil(targetBytes / chunk.length));
    return chunk.repeat(repetitions);
  }

  it('Stress Test: 10 KB Document (~10,000 bytes)', () => {
    const doc = generateBenchmarkDocument(10 * 1024);
    const start = performance.now();
    const { html } = renderMarkdownToHtml(doc);
    const parseTime = performance.now() - start;

    const tocStart = performance.now();
    const toc = extractToc(doc);
    const tocTime = performance.now() - tocStart;

    const stats = computeStats(doc);

    console.log(`[Stress Test 10KB] Size: ${(doc.length / 1024).toFixed(1)} KB | Parse: ${parseTime.toFixed(2)}ms | TOC: ${tocTime.toFixed(2)}ms | Words: ${stats.words}`);
    expect(html.length).toBeGreaterThan(0);
    expect(toc.length).toBeGreaterThan(0);
    expect(parseTime).toBeLessThan(500);
  });

  it('Stress Test: 100 KB Document (~100,000 bytes)', () => {
    const doc = generateBenchmarkDocument(100 * 1024);
    const start = performance.now();
    const { html } = renderMarkdownToHtml(doc);
    const parseTime = performance.now() - start;

    const toc = extractToc(doc);
    const stats = computeStats(doc);

    console.log(`[Stress Test 100KB] Size: ${(doc.length / 1024).toFixed(1)} KB | Parse: ${parseTime.toFixed(2)}ms | Headings: ${toc.length} | Words: ${stats.words}`);
    expect(html.length).toBeGreaterThan(0);
    expect(parseTime).toBeLessThan(1500);
  });

  it('Stress Test: 1 MB Document (~1,000,000 bytes, ~100,000 words)', () => {
    const doc = generateBenchmarkDocument(1024 * 1024);
    const start = performance.now();
    const { html } = renderMarkdownToHtml(doc);
    const parseTime = performance.now() - start;

    const toc = extractToc(doc);
    const stats = computeStats(doc);

    console.log(`[Stress Test 1MB] Size: ${(doc.length / (1024 * 1024)).toFixed(2)} MB | Parse: ${parseTime.toFixed(2)}ms | Headings: ${toc.length} | Words: ${stats.words}`);
    expect(html.length).toBeGreaterThan(0);
    expect(stats.words).toBeGreaterThan(50000);
    expect(parseTime).toBeLessThan(3500);
  });

  it('Stress Test: 10 MB Document (~10,000,000 bytes, massive multi-file merge)', () => {
    const doc = generateBenchmarkDocument(10 * 1024 * 1024);
    const start = performance.now();
    const { html } = renderMarkdownToHtml(doc);
    const parseTime = performance.now() - start;

    const stats = computeStats(doc);

    console.log(`[Stress Test 10MB] Size: ${(doc.length / (1024 * 1024)).toFixed(2)} MB | Parse: ${parseTime.toFixed(2)}ms | Words: ${stats.words}`);
    expect(html.length).toBeGreaterThan(0);
    expect(parseTime).toBeLessThan(25000);
  });

  it('Stress Test: 50 MB / 100 MB Extreme Scale Simulation', () => {
    // Generate 50MB string to test string buffer and regex memory stability
    const chunkSize = 5 * 1024 * 1024;
    const chunk = '### Section Header\nParagraph of text for 50MB-100MB scale test.\n'.repeat(Math.ceil(chunkSize / 60));
    const bigDoc = chunk.repeat(10); // 50MB+

    console.log(`[Stress Test 50MB+] Buffer generated: ${(bigDoc.length / (1024 * 1024)).toFixed(1)} MB`);

    const start = performance.now();
    const stats = computeStats(bigDoc);
    const statsTime = performance.now() - start;

    console.log(`[Stress Test 50MB+] Metrics computed in ${statsTime.toFixed(2)}ms | Total Words: ${stats.words}`);
    expect(stats.words).toBeGreaterThan(1000000);
    expect(statsTime).toBeLessThan(20000);
  }, 30000);
});
