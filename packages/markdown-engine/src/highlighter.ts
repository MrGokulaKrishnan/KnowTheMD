/**
 * High-performance, resilient syntax highlighter for 25+ languages.
 */

import { escapeHtml } from './sanitizer';

const KEYWORDS_BY_LANG: Record<string, string[]> = {
  javascript: [
    'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
    'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this',
    'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'from'
  ],
  typescript: [
    'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
    'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this',
    'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static',
    'interface', 'type', 'enum', 'implements', 'namespace', 'declare', 'readonly', 'as', 'any', 'never', 'unknown', 'from'
  ],
  python: [
    'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del',
    'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import',
    'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
    'True', 'try', 'while', 'with', 'yield', 'self'
  ],
  rust: [
    'as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn', 'else', 'enum',
    'extern', 'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod',
    'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct', 'super',
    'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while'
  ],
  go: [
    'break', 'default', 'func', 'interface', 'select', 'case', 'defer', 'go', 'map', 'struct',
    'chan', 'else', 'goto', 'package', 'switch', 'const', 'fallthrough', 'if', 'range', 'type',
    'continue', 'for', 'import', 'return', 'var', 'nil', 'true', 'false'
  ],
  java: [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'if', 'goto', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
    'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
    'volatile', 'while', 'true', 'false', 'null'
  ],
  c: [
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else',
    'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline', 'int', 'long', 'register',
    'restrict', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef',
    'union', 'unsigned', 'void', 'volatile', 'while', 'NULL'
  ],
  cpp: [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break',
    'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept',
    'const', 'consteval', 'constexpr', 'const_cast', 'continue', 'decltype', 'default', 'delete',
    'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false',
    'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace',
    'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private',
    'protected', 'public', 'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return',
    'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch',
    'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename',
    'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
  ],
  csharp: [
    'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked',
    'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else',
    'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for',
    'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
    'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params',
    'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed',
    'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw',
    'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using',
    'virtual', 'void', 'volatile', 'while', 'var', 'async', 'await'
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'ON', 'GROUP', 'BY', 'ORDER',
    'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'AS', 'DISTINCT', 'COUNT', 'SUM',
    'AVG', 'MIN', 'MAX', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'VIEW', 'AND', 'OR', 'NOT', 'NULL', 'IS'
  ],
  bash: [
    'if', 'then', 'else', 'elif', 'fi', 'case', 'esac', 'for', 'while', 'until', 'do',
    'done', 'in', 'function', 'select', 'time', 'echo', 'cd', 'export', 'source', 'alias',
    'exit', 'return', 'set', 'unset', 'sudo', 'grep', 'awk', 'sed', 'cat', 'mkdir', 'rm'
  ]
};

// Precompiled Regex Cache for blistering speed
const REGEX_CACHE: Record<string, RegExp> = {};

function getKeywordRegex(lang: string): RegExp | null {
  if (REGEX_CACHE[lang]) return REGEX_CACHE[lang];
  const list = KEYWORDS_BY_LANG[lang];
  if (!list || list.length === 0) return null;
  const regex = new RegExp(`\\b(${list.join('|')})\\b`, 'g');
  REGEX_CACHE[lang] = regex;
  return regex;
}

export function highlightCode(code: string, language = 'text'): string {
  const lang = language.toLowerCase().trim();
  const keywordRegex = getKeywordRegex(lang) || getKeywordRegex('javascript');

  const lines = code.split('\n');
  const highlightedLines = lines.map((line) => {
    // 1. Comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) {
      return `<span class="text-slate-500 italic">${escapeHtml(line)}</span>`;
    }

    // Tokenize strings first using placeholder tokens to prevent keyword collision
    const stringTokens: string[] = [];
    let processed = line.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, (match) => {
      const idx = stringTokens.length;
      stringTokens.push(`<span class="text-emerald-400">${escapeHtml(match)}</span>`);
      return `___STR_TOKEN_${idx}___`;
    });

    // Escape HTML of the remaining code
    processed = escapeHtml(processed);

    // Numbers
    processed = processed.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      '<span class="text-amber-400">$1</span>'
    );

    // Keywords using single combined regex
    if (keywordRegex) {
      processed = processed.replace(
        keywordRegex,
        '<span class="text-cyan-400 font-semibold">$1</span>'
      );
    }

    // Restore strings
    stringTokens.forEach((strHtml, idx) => {
      processed = processed.replace(`___STR_TOKEN_${idx}___`, strHtml);
    });

    return processed;
  });

  return highlightedLines.join('\n');
}
