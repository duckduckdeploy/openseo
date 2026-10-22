import type { AiBotAccess, AiBotPurpose, AiDiscoverability, PageResult, Thresholds } from './types';

/**
 * Crawlers behind AI answers, by robots.txt token. `search` bots build the index an assistant cites
 * from, `user` bots fetch a page when someone asks about it, and `training` bots collect model
 * training data. Googlebot and Bingbot are here because AI Overviews, Gemini, Copilot and ChatGPT
 * search answer from those indexes.
 */
export const AI_BOTS: { token: string; owner: string; purpose: AiBotPurpose }[] = [
  { token: 'OAI-SearchBot', owner: 'OpenAI', purpose: 'search' },
  { token: 'ChatGPT-User', owner: 'OpenAI', purpose: 'user' },
  { token: 'GPTBot', owner: 'OpenAI', purpose: 'training' },
  { token: 'Claude-SearchBot', owner: 'Anthropic', purpose: 'search' },
  { token: 'Claude-User', owner: 'Anthropic', purpose: 'user' },
  { token: 'ClaudeBot', owner: 'Anthropic', purpose: 'training' },
  { token: 'PerplexityBot', owner: 'Perplexity', purpose: 'search' },
  { token: 'Perplexity-User', owner: 'Perplexity', purpose: 'user' },
  { token: 'Googlebot', owner: 'Google', purpose: 'search' },
  { token: 'Google-Extended', owner: 'Google', purpose: 'training' },
  { token: 'Bingbot', owner: 'Microsoft', purpose: 'search' },
  { token: 'DuckAssistBot', owner: 'DuckDuckGo', purpose: 'user' },
  { token: 'MistralAI-User', owner: 'Mistral', purpose: 'user' },
  { token: 'Applebot-Extended', owner: 'Apple', purpose: 'training' },
  { token: 'CCBot', owner: 'Common Crawl', purpose: 'training' },
  { token: 'meta-externalagent', owner: 'Meta', purpose: 'training' },
];

/** Weights of the parts of the AI discoverability score. */
export const AI_SCORE_WEIGHTS = { botAccess: 0.5, readability: 0.3, speed: 0.15, llmsTxt: 0.05 };

const pct = (part: number, whole: number): number => (whole === 0 ? 100 : Math.round((100 * part) / whole));

/** Readable without JavaScript, and with the title and description an assistant quotes. */
export const machineReadable = (page: PageResult): boolean =>
  !page.jsRenderingSuspected && !page.needsJavaScript && page.title !== null && page.metaDescription !== null;

/**
 * How well AI assistants can reach, read and cite the site. `allowedFor` answers robots.txt for a
 * URL and a user-agent token. Null when no indexable page was crawled.
 */
export function computeAiDiscoverability(
  pages: PageResult[],
  startUrl: string,
  allowedFor: (url: string, token: string) => boolean,
  llmsTxt: boolean,
  thresholds: Thresholds,
): AiDiscoverability | null {
  const indexable = pages.filter((p) => p.fetchClass === 'ok' && p.isHtml && p.indexable);
  if (indexable.length === 0) return null;

  const bots: AiBotAccess[] = AI_BOTS.map((bot) => ({
    ...bot,
    allowed: allowedFor(startUrl, bot.token),
    allowedPct: pct(indexable.filter((p) => allowedFor(p.url, bot.token)).length, indexable.length),
  }));
  const answering = bots.filter((b) => b.purpose !== 'training');
  const botAccess = Math.round(answering.reduce((sum, b) => sum + b.allowedPct, 0) / answering.length);
  const readability = pct(indexable.filter(machineReadable).length, indexable.length);
  const speed = pct(
    indexable.filter((p) => p.responseTimeMs !== null && p.responseTimeMs <= thresholds.slowAiResponseMs).length,
    indexable.length,
  );
  const w = AI_SCORE_WEIGHTS;
  const score = Math.round(w.botAccess * botAccess + w.readability * readability + w.speed * speed + w.llmsTxt * (llmsTxt ? 100 : 0));
  return { score, botAccess, readability, speed, llmsTxt, bots };
}
