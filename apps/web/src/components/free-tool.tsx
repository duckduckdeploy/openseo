'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { buttonClasses } from './button';

/**
 * A tool anyone can try on the website, without an account: a few small checks a day, run by the
 * API's free tools (apps/api/src/services/public-tools.ts) with the site's own YepAPI key.
 */
export type FreeToolKind = 'website-traffic' | 'website-authority' | 'keyword-ideas' | 'keyword-difficulty' | 'serp' | 'ai-overview';

const COUNTRIES: [string, string][] = [
  ['us', 'United States'],
  ['gb', 'United Kingdom'],
  ['ca', 'Canada'],
  ['au', 'Australia'],
  ['in', 'India'],
  ['de', 'Germany'],
  ['fr', 'France'],
  ['es', 'Spain'],
  ['it', 'Italy'],
  ['nl', 'Netherlands'],
  ['br', 'Brazil'],
];

type Row = Record<string, unknown>;
type Spec = {
  label: string;
  placeholder: string;
  /** One line per item, up to this many; 1 means a single input. */
  max: number;
  country: boolean;
  /** Optional second field (the AI Overview checker's "your domain"). */
  domainField?: boolean;
  body: (items: string[], country: string, domain: string) => object;
  render: (data: Row, domain: string) => ReactNode;
};

const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value).toLocaleString('en-US') : '—');
const list = (value: unknown) => (Array.isArray(value) ? (value as Row[]) : []);
const hostOf = (url: unknown) => {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, '');
  } catch {
    return String(url ?? '');
  }
};
const cleanDomain = (value: string) => hostOf(/^https?:\/\//i.test(value) ? value : `https://${value}`);
const band = (kd: unknown) => (typeof kd !== 'number' ? '—' : kd < 30 ? 'Easy' : kd < 60 ? 'Medium' : 'Hard');

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[0.9375rem]">
        <thead>
          <tr className="border-b border-line font-mono text-xs uppercase tracking-wide text-muted">
            {head.map((cell, index) => (
              <th key={cell} scope="col" className={`py-2.5 pr-4 font-medium ${index ? 'text-right' : ''}`}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={head.length} className="py-4 text-muted">
                No results for this check. Try another keyword, website or country.
              </td>
            </tr>
          )}
          {rows.map((cells, index) => (
            <tr key={index} className="border-b border-line last:border-0">
              {cells.map((cell, column) => (
                <td key={column} className={`py-2.5 pr-4 ${column ? 'text-right font-mono tabular-nums' : 'max-w-[22rem] truncate font-medium'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SPECS: Record<FreeToolKind, Spec> = {
  'website-traffic': {
    label: 'Websites, one per line',
    placeholder: 'yoursite.com\ncompetitor.com',
    max: 5,
    country: true,
    body: (items, country) => ({ domains: items.map(cleanDomain), country }),
    render: (data) => (
      <Table
        head={['Website', 'Organic traffic / mo', 'Organic keywords', 'Paid traffic / mo']}
        rows={list(data.domains).map((row) => [String(row.domain), num(row.organicTraffic), num(row.organicKeywords), num(row.paidTraffic)])}
      />
    ),
  },
  'website-authority': {
    label: 'Websites, one per line',
    placeholder: 'yoursite.com\ncompetitor.com',
    max: 3,
    country: false,
    body: (items) => ({ domains: items.map(cleanDomain) }),
    render: (data) => (
      <Table
        head={['Website', 'Domain Rating', 'Referring domains', 'Backlinks']}
        rows={list(data.urls).map((row) => {
          const site = (row.domain ?? {}) as Row;
          return [String(row.url), num(site.domainRating), num(site.refDomains), num(site.backlinks)];
        })}
      />
    ),
  },
  'keyword-ideas': {
    label: 'Seed keyword',
    placeholder: 'standing desk',
    max: 1,
    country: true,
    body: (items, country) => ({ keyword: items[0], country }),
    render: (data) => (
      <Table
        head={['Keyword idea', 'Searches / mo', 'Difficulty', 'CPC']}
        rows={list(data.keywords).map((row) => [String(row.keyword), num(row.volume), num(row.difficulty), typeof row.cpc === 'number' ? `$${row.cpc.toFixed(2)}` : '—'])}
      />
    ),
  },
  'keyword-difficulty': {
    label: 'Keywords, one per line',
    placeholder: 'standing desk\nbest standing desk for small spaces',
    max: 20,
    country: true,
    body: (items, country) => ({ keywords: items, country }),
    render: (data) => (
      <Table head={['Keyword', 'Difficulty', '']} rows={list(data.keywords).map((row) => [String(row.keyword), num(row.difficulty), band(row.difficulty)])} />
    ),
  },
  serp: {
    label: 'Keyword',
    placeholder: 'standing desk',
    max: 1,
    country: true,
    body: (items, country) => ({ keyword: items[0], country }),
    render: (data) => (
      <Table
        head={['Result', 'Position']}
        rows={list(data.results)
          .filter((row) => row.type === 'organic' && row.url)
          .map((row, index) => [
            <a key="link" href={String(row.url)} target="_blank" rel="noreferrer noopener nofollow" className="underline-offset-4 hover:underline">
              {String(row.title || hostOf(row.url))}
              <span className="block truncate font-mono text-xs font-normal text-muted">{hostOf(row.url)}</span>
            </a>,
            index + 1,
          ])}
      />
    ),
  },
  'ai-overview': {
    label: 'Keywords, one per line',
    placeholder: 'how to clean a standing desk\nis a standing desk worth it',
    max: 3,
    country: true,
    domainField: true,
    body: (items, country, domain) => ({ keywords: items, country, ...(domain.trim() ? { domain: cleanDomain(domain) } : {}) }),
    render: (data, domain) => (
      <Table
        head={['Keyword', 'AI Overview', domain ? 'Cites you' : 'Sources cited', 'Top sources']}
        rows={list(data.keywords).map((row) => {
          const overview = row.aiOverview as { cited: boolean | null; sources?: Row[] } | null;
          const sources = overview?.sources ?? [];
          return [
            String(row.keyword),
            row.error ? 'Failed' : overview ? 'Yes' : 'No',
            !overview ? '—' : domain ? (overview.cited ? 'Yes' : 'No') : sources.length,
            overview ? [...new Set(sources.map((s) => hostOf(s.url)))].slice(0, 3).join(', ') || '—' : '—',
          ];
        })}
      />
    ),
  },
};

export function FreeTool({ kind, apiUrl, appHref, signUpHref }: { kind: FreeToolKind; apiUrl: string; appHref: string; signUpHref: string }) {
  const spec = SPECS[kind];
  const [text, setText] = useState('');
  const [domain, setDomain] = useState('');
  const [country, setCountry] = useState('us');
  const [state, setState] = useState<{ status: 'idle' | 'loading' | 'done' | 'error'; data?: Row; message?: string; remaining?: number; domain?: string }>({ status: 'idle' });

  const items = text
    .split(spec.max === 1 ? /\n/ : /[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!items.length || state.status === 'loading') return;
    setState({ status: 'loading' });
    const fallback = 'Something went wrong. Try again in a moment.';
    try {
      const response = await fetch(`${apiUrl}/public/tools/${kind}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(spec.body(items.slice(0, spec.max), country, domain)),
      }).catch(() => {
        // fetch only rejects on network or CORS failures; its own message ("Failed to fetch") means nothing to a reader.
        throw new Error('Could not reach the OpenSEO server. Check your connection and try again.');
      });
      const json = (await response.json().catch(() => null)) as { ok?: boolean; data?: Row; remaining?: number; error?: { message?: string } } | null;
      if (!response.ok || !json?.ok) throw new Error(json?.error?.message ?? fallback);
      if (!json.data) throw new Error(fallback);
      setState({ status: 'done', data: json.data, remaining: json.remaining, domain: domain.trim() });
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error && error.message ? error.message : fallback });
    }
  }

  const field = 'w-full rounded-md border border-edge bg-surface px-3.5 text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25';

  return (
    <section aria-label="Try it free" className="card mx-auto max-w-3xl p-5 text-left sm:p-7">
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-ink">{spec.label}</span>
          {spec.max === 1 ? (
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder={spec.placeholder} className={`${field} mt-1.5 h-12`} />
          ) : (
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={spec.placeholder} rows={3} className={`${field} mt-1.5 py-2.5 font-mono text-sm`} />
          )}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {spec.domainField && (
            <label className="block flex-1">
              <span className="text-sm font-medium text-ink">Your website (optional)</span>
              <input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="yoursite.com" className={`${field} mt-1.5 h-11`} />
            </label>
          )}
          {spec.country && (
            <label className="block sm:w-52">
              <span className="text-sm font-medium text-ink">Country</span>
              <select value={country} onChange={(event) => setCountry(event.target.value)} className={`${field} mt-1.5 h-11`}>
                {COUNTRIES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="submit" disabled={!items.length || state.status === 'loading'} className={buttonClasses('primary', 'md', 'disabled:pointer-events-none disabled:opacity-60 sm:ml-auto')}>
            {state.status === 'loading' ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
            Check free
          </button>
        </div>
        <p className="text-xs text-muted">
          Free, no account: {spec.max === 1 ? 'one keyword' : `up to ${spec.max}`} per check, a few checks a day.
          {items.length > spec.max ? ` Only the first ${spec.max} will be checked.` : ''}
        </p>
      </form>

      <div aria-live="polite">
        {state.status === 'error' && (
          <p className="mt-5 rounded-md border border-line bg-peach/60 px-4 py-3 text-[0.9375rem] text-ink">
            {state.message}{' '}
            <a href={signUpHref} className="font-medium text-accent-text underline-offset-4 hover:underline">
              Sign up free
            </a>
          </p>
        )}
        {state.status === 'done' && state.data && (
          <div className="mt-6 border-t border-line pt-5">
            {spec.render(state.data, state.domain ?? '')}
            <div className="mt-5 flex flex-col gap-3 rounded-md bg-sunken px-4 py-3 text-[0.9375rem] sm:flex-row sm:items-center">
              <p className="text-muted">
                {typeof state.remaining === 'number' ? `${state.remaining} free ${state.remaining === 1 ? 'check' : 'checks'} left today. ` : ''}
                The app has more of everything, in any country, and you only pay for the lookups you run.
              </p>
              <a href={appHref} className={buttonClasses('secondary', 'sm', 'shrink-0 sm:ml-auto')}>
                Open the full tool
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
