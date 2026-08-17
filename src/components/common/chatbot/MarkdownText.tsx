'use client';

import React from 'react';

interface MarkdownTextProps {
  content: string;
  className?: string;
}

export default function MarkdownText({ content, className = '' }: MarkdownTextProps) {
  // Helper to parse inline styles (bold, code, links)
  const parseInline = (text: string): React.ReactNode[] => {
    // Regex for bold (**text**), inline code (`code`), and markdown links ([text](url))
    const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

    return tokens.map((token, i) => {
      if (!token) return null;

      // Bold: **text**
      if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
        return (
          <strong key={i} className="font-black text-black dark:text-cyan-300">
            {token.slice(2, -2)}
          </strong>
        );
      }

      // Inline code: `code`
      if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-black/10 dark:bg-white/15 text-black dark:text-cyan-200 font-mono text-[12px] font-bold border border-black/20 dark:border-white/20"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      // Link: [text](url)
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-cyan-700 dark:text-cyan-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {linkMatch[1]} ↗
          </a>
        );
      }

      return <span key={i}>{token}</span>;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`flex flex-col gap-1.5 text-xs sm:text-sm leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> spacing
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point list items (* or -)
        if (/^[*•-]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[*•-]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
              <div className="flex-1">{parseInline(itemText)}</div>
            </div>
          );
        }

        // Numbered list items (1. 2. etc.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-mono font-black text-[11px] px-1 bg-black/10 dark:bg-white/10 rounded shrink-0">
                {numMatch[1]}
              </span>
              <div className="flex-1">{parseInline(numMatch[2])}</div>
            </div>
          );
        }

        // Section header (### or ##)
        if (/^#{1,3}\s+/.test(trimmed)) {
          const headerText = trimmed.replace(/^#{1,3}\s+/, '');
          return (
            <div
              key={idx}
              className="font-black text-xs uppercase tracking-wider text-black dark:text-cyan-300 pt-1 pb-0.5 border-b border-black/15 dark:border-white/15"
            >
              {parseInline(headerText)}
            </div>
          );
        }

        // Standard paragraph line
        return <p key={idx} className="m-0">{parseInline(line)}</p>;
      })}
    </div>
  );
}
