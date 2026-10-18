function env(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return (trimmed ? trimmed : fallback).replace(/\/+$/, '');
}

export const SITE_URL = env(process.env.NEXT_PUBLIC_SITE_URL, 'https://openseo.gg');
export const APP_URL = env(process.env.NEXT_PUBLIC_APP_URL, 'http://localhost:3200');

/** The public repository. A fork can point its site at its own with NEXT_PUBLIC_GITHUB_URL. */
export const GITHUB_URL: string | null =
  process.env.NEXT_PUBLIC_GITHUB_URL?.trim().replace(/\/+$/, '') || 'https://github.com/duckduckdeploy/openseo';

/** The public API address. Agents connect to `${PUBLIC_API_URL}/mcp`. */
export const PUBLIC_API_URL = env(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:4100');
export const MCP_URL = `${PUBLIC_API_URL}/mcp`;

export const SIGN_UP_URL = `${APP_URL}/sign-up`;
export const SIGN_IN_URL = `${APP_URL}/sign-in`;
export const YEPAPI_URL = 'https://yepapi.com?ref=openseo';
/** OpenSEO News: the Google algorithm update tracker. */
export const NEWS_URL = 'https://news.openseo.gg';

export const SITE_NAME = 'OpenSEO';
export const SITE_TAGLINE = 'The open-source SEO suite you control.';
/** Homepage title tag: keyword first. */
export const SITE_TITLE = 'OpenSEO: Open-Source SEO Tools You Can Self-Host';
export const SITE_DESCRIPTION =
  'Open-source SEO tools for keyword research, rank tracking, backlinks, site audits and AI visibility. Self-host with Docker or use it online. MIT licensed.';

export const NAV_LINKS = [
  { href: '/tools', label: 'SEO tools' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/glossary', label: 'Glossary' },
] as const;

/** A name inside a sentence: "Keyword overview" becomes "keyword overview"; "AI" and "SERP" keep their capitals. */
export const inSentence = (name: string) => name.replace(/^[A-Z](?=[a-z])/, (letter) => letter.toLowerCase());
