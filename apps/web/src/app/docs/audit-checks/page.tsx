import { ISSUE_CATALOG, ISSUE_TYPES, type IssueType } from '@openseo/crawler/catalog';
import { DocTable } from '@/components/doc-blocks';
import { DocArticle } from '@/components/doc-page';
import { getDoc } from '@/content/docs';
import { pageMeta } from '@/lib/metadata';

const slug = 'audit-checks';
const doc = getDoc(slug);

export const metadata = pageMeta({ title: doc.seoTitle, description: doc.description, path: `/docs/${slug}` });

const SEVERITIES = [
  ['critical', 'Critical', 'Problems that stop pages being crawled, indexed or shown.'],
  ['warning', 'Warnings', 'Problems that hold pages back.'],
  ['info', 'Notices', 'Smaller improvements and things worth knowing.'],
] as const;

// Read from the crawler itself, so this page always matches what the audit reports.
const bySeverity = (severity: string): IssueType[] => ISSUE_TYPES.filter((type) => ISSUE_CATALOG[type].severity === severity);

export default function AuditChecksPage() {
  return (
    <DocArticle slug={slug}>
      <p>
        The site audit reports {ISSUE_TYPES.length} kinds of issue. This list is generated from the crawler&apos;s own
        catalog, so it always matches what an audit can report. The code in each row is the issue type used by the
        REST API and the MCP tools.
      </p>

      <h2 id="score">How the health score is worked out</h2>
      <ol>
        <li>
          It counts every URL the crawler tried, except those blocked by <code>robots.txt</code>, since the crawler
          never fetched them.
        </li>
        <li>
          The score is the share of those URLs without an error (a critical issue), rounded. Warnings and notices do
          not lower it. One broken link in the footer puts an error on every page, so it can take the score to 0.
        </li>
        <li>If no page answered with a success status, the score is 0.</li>
      </ol>
      <p>
        Links and Content issues are reported twice, once for indexable pages and once for pages that are not
        (noindex, canonicalised to another URL or not returning 200). On a non-indexable page they count one
        severity lower: a broken link on a noindex page is a warning, not an error.
      </p>
      <p>
        Issues that apply to the whole site, such as a missing sitemap or missing security headers, are reported once,
        on the start page or the first page of each origin. Checks that compare pages with each other (duplicates,
        broken internal links, orphan pages) are only as complete as the crawl; orphan pages are reported only when
        the crawl finished without hitting its page limit.
      </p>

      {SEVERITIES.map(([severity, title, intro]) => (
        <section key={severity}>
          <h2 id={severity}>
            {title} ({bySeverity(severity).length})
          </h2>
          <p>{intro}</p>
          <DocTable
            caption={`${title}: audit checks`}
            head={['Issue', 'What it means', 'How to fix it']}
            rows={bySeverity(severity).map((type) => [
              <span key={type}>
                {ISSUE_CATALOG[type].title}
                <code className="mt-1 block w-fit text-xs font-normal">{type}</code>
              </span>,
              ISSUE_CATALOG[type].description,
              ISSUE_CATALOG[type].howToFix,
            ])}
          />
        </section>
      ))}
    </DocArticle>
  );
}
