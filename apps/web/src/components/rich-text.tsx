import Link from 'next/link';
import { Fragment } from 'react';

// Markdown-style links, "[backlinks](/glossary/backlink)", and inline code, `rel="canonical"`.
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const linkClass = 'font-medium text-accent-text underline decoration-accent-line underline-offset-4 hover:decoration-accent';

/** Plain text with markdown-style links and inline code. Site paths use Link, others open as plain anchors. */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, label = '', href = '', code] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    if (code !== undefined) {
      parts.push(
        <code key={index} className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.875em] text-ink">
          {code}
        </code>,
      );
    } else {
      parts.push(
        href.startsWith('/') ? (
          <Link key={index} href={href} className={linkClass}>
            {label}
          </Link>
        ) : (
          <a key={index} href={href} rel="noopener" className={linkClass}>
            {label}
          </a>
        ),
      );
    }
    last = index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

/** The text without link or code markup, for meta tags and JSON-LD. */
export const plainText = (text: string) => text.replace(LINK, '$1').replace(/`([^`]+)`/g, '$1');
