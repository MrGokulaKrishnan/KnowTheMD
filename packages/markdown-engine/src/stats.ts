/**
 * Real-time Document Metrics & Statistics
 */

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function computeStats(text: string): DocumentStats {
  if (!text || text.trim() === '') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const lines = text.split('\n').length;

  // Words: match alphanumeric sequences
  const wordsMatch = text.match(/[\p{L}\p{N}_\-]+/gu);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Paragraphs: blocks separated by double linebreaks
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Average speaking speed: 130 words per minute
  const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}
