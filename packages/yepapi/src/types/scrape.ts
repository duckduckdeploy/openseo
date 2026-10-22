export type ScrapeFormat = 'markdown' | 'html' | 'text';

export interface ScrapeParams {
  url: string;
  /** Default `"markdown"`. */
  format?: ScrapeFormat;
  /** Milliseconds to wait for JS rendering. Default 0. */
  waitFor?: number;
  /** CSS selector to extract a specific element. */
  selector?: string;
}

/**
 * Documented for the default markdown format only. Which field carries the
 * body for `format: "html" | "text"` is not documented, hence `content`/`format`
 * and the index signature.
 */
export interface ScrapeData {
  url: string;
  statusCode: number;
  title?: string;
  markdown?: string;
  metadata?: { description?: string; ogTitle?: string; [key: string]: unknown };
  content?: string;
  format?: ScrapeFormat;
  [key: string]: unknown;
}

export type ScrapeJsParams = ScrapeParams;

/** Residential-proxy fetch for sites that block datacenter crawlers. Verified live 2026-10-23: same response as /v1/scrape/js. */
export interface ScrapeStealthParams {
  url: string;
  format?: ScrapeFormat;
  /** Milliseconds to wait for JS rendering. Default 2000. */
  waitFor?: number;
  /** Proxy country, two letters. Default `"us"`. */
  country?: string;
}

export interface ScrapeJsData {
  url: string;
  statusCode: number;
  /** Page content in the requested format. */
  content: string;
  format: ScrapeFormat;
}
