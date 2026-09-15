export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeTokens {
  bgBase: string;
  bgSubtle: string;
  surfaceGlass: string;
  surfaceCard: string;
  surfaceElevated: string;
  borderSubtle: string;
  borderGlow: string;
  borderHighlight: string;
  primaryCyan: string;
  primaryBlue: string;
  brandGradient: string;
  accentGlow: string;
  textMain: string;
  textMuted: string;
  textInverted: string;
  codeBg: string;
  codeText: string;
  activeItem: string;
  hoverItem: string;
  danger: string;
  success: string;
  warning: string;
}

export const darkTokens: ThemeTokens = {
  bgBase: '#030712',
  bgSubtle: '#08101E',
  surfaceGlass: 'rgba(15, 23, 42, 0.72)',
  surfaceCard: 'rgba(17, 27, 50, 0.82)',
  surfaceElevated: 'rgba(23, 37, 68, 0.90)',
  borderSubtle: 'rgba(56, 189, 248, 0.16)',
  borderGlow: 'rgba(0, 240, 255, 0.45)',
  borderHighlight: 'rgba(255, 255, 255, 0.22)',
  primaryCyan: '#00F0FF',
  primaryBlue: '#0284C7',
  brandGradient: 'linear-gradient(135deg, #00F0FF 0%, #0099FF 50%, #0A4D8C 100%)',
  accentGlow: '0 0 24px rgba(0, 240, 255, 0.35)',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  textInverted: '#030712',
  codeBg: 'rgba(6, 13, 26, 0.85)',
  codeText: '#38BDF8',
  activeItem: 'rgba(0, 240, 255, 0.15)',
  hoverItem: 'rgba(255, 255, 255, 0.08)',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const lightTokens: ThemeTokens = {
  bgBase: '#F8FAFC',
  bgSubtle: '#EDF2F7',
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',
  surfaceCard: 'rgba(255, 255, 255, 0.95)',
  surfaceElevated: '#FFFFFF',
  borderSubtle: 'rgba(2, 132, 199, 0.20)',
  borderGlow: 'rgba(2, 132, 199, 0.55)',
  borderHighlight: 'rgba(255, 255, 255, 0.85)',
  primaryCyan: '#0284C7',
  primaryBlue: '#0369A1',
  brandGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
  accentGlow: '0 0 20px rgba(2, 132, 199, 0.25)',
  textMain: '#0F172A',
  textMuted: '#475569',
  textInverted: '#FFFFFF',
  codeBg: '#F1F5F9',
  codeText: '#0369A1',
  activeItem: 'rgba(2, 132, 199, 0.12)',
  hoverItem: 'rgba(0, 0, 0, 0.04)',
  danger: '#DC2626',
  success: '#059669',
  warning: '#D97706',
};

export const fontFamilies = {
  ui: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
  code: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
  readingSerif: '"Charter", "Merriweather", "Georgia", serif',
  readingSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export function getTokens(mode: ThemeMode): ThemeTokens {
  if (mode === 'light') return lightTokens;
  if (mode === 'dark') return darkTokens;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return lightTokens;
  }
  return darkTokens;
}
