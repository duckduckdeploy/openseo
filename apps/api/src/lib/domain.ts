import { cleanDomain } from "@openseo/shared";

/**
 * Normalise user input ("https://www.Example.com/path") to a bare hostname. Input that is no
 * valid domain is only trimmed and lower-cased; schemas reject it earlier with zDomain().
 */
export function toDomain(input: string): string {
  return cleanDomain(input) ?? input.trim().toLowerCase().replace(/^www\./, "").replace(/\/.*$/, "");
}

export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

// True when host is the domain itself or one of its subdomains.
export function hostMatches(host: string | null, domain: string): boolean {
  if (!host) return false;
  const d = domain.toLowerCase().replace(/^www\./, "");
  return host === d || host.endsWith(`.${d}`);
}
