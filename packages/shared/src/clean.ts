import { z } from "zod";

/**
 * One place that cleans what people type or paste into a tool: keywords, search queries,
 * domains and URLs. The API applies it to every input (so the website, the app, the REST API and
 * the MCP server behave the same), and the app uses it to preview what will be sent.
 *
 * Pasted text brings in zero-width characters, non-breaking spaces, smart quotes, list bullets,
 * trailing commas, "https//" typos and paths on a domain. Left in, YepAPI either rejects them,
 * answers with an upstream error, or quietly skips the keyword.
 */

// Soft hyphen, zero-width spaces and joiners, direction marks, word joiners and the BOM.
const INVISIBLE = /[­​-‏‪-‮⁠-⁤﻿]/g;

/** NFKC, invisible characters out, straight quotes and dashes, all whitespace one space, trimmed. */
export function cleanText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(INVISIBLE, "")
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/[\p{Cc}\p{Z}]+/gu, " ")
    .trim();
}

// "- seo", "* seo", "• seo", "1. seo", "2) seo", "> seo": bullets from pasted lists.
const LIST_MARKER = /^(?:[-*•·▪◦‣>]+|\d{1,3}[.)])\s+/u;
const PAIRS: Record<string, string> = { '"': '"', "'": "'", "`": "`", "(": ")", "[": "]", "{": "}", "<": ">" };

function unwrap(value: string): string {
  let text = value;
  for (;;) {
    const close = PAIRS[text[0] ?? ""];
    if (!close || text.length < 2 || !text.endsWith(close)) return text;
    text = text.slice(1, -1).trim();
  }
}

/**
 * A keyword for keyword data (volume, ideas, difficulty, tracking): cleaned text without list
 * bullets, wrapping quotes or brackets, emoji or trailing punctuation, in lower case. Keyword
 * data is case-insensitive, and lower case lets "SEO Tools" and "seo tools" count as one.
 */
export function cleanKeyword(value: string): string {
  const text = unwrap(cleanText(value).replace(LIST_MARKER, ""))
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[\s,;:.!?]+$/u, "")
    .replace(/^[\s,;:.!?]+/u, "");
  return cleanText(text).toLowerCase();
}

/**
 * A Google search query: cleaned text without a list bullet. Case, quotes and operators
 * (site:, intitle:, "exact phrase", OR) are kept, since they change the search.
 */
export function cleanQuery(value: string): string {
  return cleanText(cleanText(value).replace(LIST_MARKER, ""));
}

/** Unique non-empty keywords, first spelling kept. Entries holding several lines are split. */
export function cleanKeywords(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values.flatMap((v) => v.split(/[\r\n]+/))) {
    const keyword = cleanKeyword(value);
    if (keyword && !seen.has(keyword)) {
      seen.add(keyword);
      out.push(keyword);
    }
  }
  return out;
}

/**
 * Pasted text to entries: one per line, or also comma, semicolon or tab separated when `commas`
 * is set. Trimmed and de-duplicated; no other cleaning.
 */
export function splitEntries(value: string, { commas = false }: { commas?: boolean } = {}): string[] {
  const parts = value
    .split(commas ? /[\r\n,;\t]+/ : /[\r\n]+/)
    .map((part) => cleanText(part))
    .filter(Boolean);
  return [...new Set(parts)];
}

const HOSTNAME = /^(?=.{3,253}$)(?:[a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

// "https://", "http//", "https:/", "//", "htps://" and "site:" in front of a domain or URL.
const SCHEME = /^(?:[a-z]{2,8}:\/{0,3}(?=[^/])|[a-z]{2,8}\/\/+|\/\/+)/i;

/** The part of a scheme-less address before its path, query or fragment. */
const hostPart = (value: string) => value.split(/[/?#\\]/)[0] ?? "";

/** Host of "user@host:port" in lower case, IDN as punycode, no trailing dot; null when not a public hostname. */
function toHostname(raw: string, { keepWww }: { keepWww: boolean }): string | null {
  let host = raw.replace(/^.*@/, "").replace(/:\d*$/, "").replace(/\.+$/, "").toLowerCase();
  if (!host || /\s/.test(host)) return null;
  try {
    host = new URL(`http://${host}`).hostname;
  } catch {
    return null;
  }
  if (!keepWww) host = host.replace(/^www\d{0,2}\./, "");
  return HOSTNAME.test(host) && !IPV4.test(host) ? host : null;
}

function stripWrapping(value: string): string {
  return unwrap(cleanText(value).replace(LIST_MARKER, "")).replace(/[,;.!?]+$/, "");
}

/** Removes a scheme or "site:" in front, keeping whether it was plain http. */
function splitScheme(value: string): { http: boolean; rest: string } {
  const match = SCHEME.exec(value);
  const scheme = match?.[0].toLowerCase() ?? "";
  return { http: scheme.startsWith("http:") || scheme === "http//", rest: match ? value.slice(scheme.length) : value };
}

/**
 * A bare domain: "https://www.Example.com/path?q", "example.com:443" or "site:example.com" all
 * give "example.com". Subdomains other than www are kept. Null when there is no valid domain.
 */
export function cleanDomain(value: string): string | null {
  const { rest } = splitScheme(stripWrapping(value));
  return toHostname(hostPart(rest), { keepWww: false });
}

/**
 * An absolute http(s) URL: a missing or misspelled scheme becomes https, the host is lower case,
 * the fragment is dropped. Null when there is no valid public host.
 */
export function cleanUrl(value: string): string | null {
  const { http, rest } = splitScheme(stripWrapping(value));
  if (!rest) return null;
  const host = toHostname(hostPart(rest), { keepWww: true });
  if (!host) return null;
  try {
    const url = new URL(`${http ? "http" : "https"}://${rest}`);
    url.hash = "";
    url.username = "";
    url.password = "";
    url.hostname = host;
    return url.href;
  } catch {
    return null;
  }
}

/**
 * A domain or one exact page: a URL with a path or query stays a URL (cleaned); a bare host or a
 * home page ("https://www.example.com/") means the whole site and becomes its domain. Null when
 * invalid.
 */
export function cleanTarget(value: string): string | null {
  const { rest } = splitScheme(stripWrapping(value));
  const afterHost = rest.slice(hostPart(rest).length);
  return afterHost && afterHost !== "/" ? cleanUrl(value) : cleanDomain(value);
}

// ── Zod schemas: clean first, then validate the result ──────────────────────

const DOMAIN_HINT = "Enter a domain like example.com";
const URL_HINT = "Enter a full web address like https://example.com/page";

function cleaned(clean: (value: string) => string | null, message: string, max: number) {
  return z.string().transform((value, ctx) => {
    const result = clean(value);
    if (!result) {
      ctx.addIssue({ code: "custom", message: value.trim() ? `"${cleanText(value).slice(0, 80)}" is not valid. ${message}.` : `${message}.` });
      return z.NEVER;
    }
    if (result.length > max) {
      ctx.addIssue({ code: "custom", message: `Too long: at most ${max} characters.` });
      return z.NEVER;
    }
    return result;
  });
}

/** A bare domain, e.g. example.com. */
export const zDomain = () => cleaned(cleanDomain, DOMAIN_HINT, 253);
/** An absolute http(s) URL. */
export const zUrl = (max = 2000) => cleaned(cleanUrl, URL_HINT, max);
/** A domain, subdomain, or full URL for one exact page. */
export const zTarget = (max = 2000) => cleaned(cleanTarget, `${DOMAIN_HINT}, or a full page URL`, max);

/** One keyword for keyword data. */
export const zKeyword = (max = 200) =>
  z
    .string()
    .transform(cleanKeyword)
    .pipe(z.string().min(1, "Enter a keyword.").max(max, `Keywords can be at most ${max} characters.`));

/** One Google search query (case, quotes and operators kept). */
export const zQuery = (max = 300) =>
  z
    .string()
    .transform(cleanQuery)
    .pipe(z.string().min(1, "Enter a search query.").max(max, `Queries can be at most ${max} characters.`));

/** A list of keywords: cleaned, blanks dropped, duplicates merged, then counted. */
export const zKeywords = (max: number, { itemMax = 200, tooMany }: { itemMax?: number; tooMany?: string } = {}) =>
  z
    .array(z.string())
    .transform(cleanKeywords)
    .pipe(
      z
        .array(z.string().max(itemMax, `Keywords can be at most ${itemMax} characters.`))
        .min(1, "Enter at least one keyword.")
        .max(max, tooMany ?? `Up to ${max} keywords at a time.`),
    );

const blankToNull = (value: unknown) => (typeof value === "string" && !cleanText(value) ? null : value);

/** An optional domain that may be cleared: "" and null give null, undefined leaves it unchanged. */
export const zDomainOrNull = () => z.preprocess(blankToNull, zDomain().nullable().optional());
/** An optional URL that may be cleared: "" and null give null, undefined leaves it unchanged. */
export const zUrlOrNull = (max = 2000) => z.preprocess(blankToNull, zUrl(max).nullable().optional());
