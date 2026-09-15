/**
 * Table of Contents & Outline Generator
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
  lineNumber?: number;
  children?: TocItem[];
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function extractToc(markdown: string): TocItem[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  const slugCounts: Record<string, number> = {};

  let insideCodeBlock = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      return;
    }

    if (insideCodeBlock) return;

    // Match ATX headings (# to ######)
    const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim().replace(/\s*#+\s*$/, ''); // remove closing hashes if any
      const cleanText = rawText.replace(/[*_~`]/g, ''); // strip markdown formatting for label

      let slug = generateSlug(cleanText);
      if (slugCounts[slug] !== undefined) {
        slugCounts[slug] += 1;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 0;
      }

      items.push({
        id: slug,
        text: cleanText,
        level,
        lineNumber: index + 1,
      });
    }
  });

  return items;
}
