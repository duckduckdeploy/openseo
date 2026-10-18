import Link from 'next/link';
import { Fragment } from 'react';

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Plain text with markdown-style links: "[backlinks](/glossary/backlink)". Site paths use Link, others open as plain anchors. */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label = '', href = ''] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      href.startsWith('/') ? (
        <Link key={index} href={href} className="font-medium text-accent-text underline decoration-accent-line underline-offset-4 hover:decoration-accent">
          {label}
        </Link>
      ) : (
        <a key={index} href={href} rel="noopener" className="font-medium text-accent-text underline decoration-accent-line underline-offset-4 hover:decoration-accent">
          {label}
        </a>
      ),
    );
    last = index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

/** The text without link markup, for meta tags and JSON-LD. */
export const plainText = (text: string) => text.replace(LINK, '$1');
