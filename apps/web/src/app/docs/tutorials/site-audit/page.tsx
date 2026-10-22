import Link from 'next/link';
import { ISSUE_CATALOG, ISSUE_TYPES } from '@openseo/crawler/catalog';
import { Callout, DocTable, Step, Steps, Ui } from '@/components/doc-blocks';
import { DocArticle } from '@/components/doc-page';
import { Screenshot } from '@/components/screenshot';
import { getDoc } from '@/content/docs';
import { pageMeta } from '@/lib/metadata';

const slug = 'tutorials/site-audit';
const doc = getDoc(slug);

export const metadata = pageMeta({ title: doc.seoTitle, description: doc.description, path: `/docs/${slug}` });

const count = (severity: string) => ISSUE_TYPES.filter((type) => ISSUE_CATALOG[type].severity === severity).length;

export default function SiteAuditTutorial() {
  return (
    <DocArticle slug={slug}>
      <p>
        OpenSEO crawls your site with its own crawler, so the crawl itself costs nothing. It checks every page it
        reaches against {ISSUE_TYPES.length} kinds of problem ({count('critical')} errors, {count('warning')} warnings
        and {count('info')} notices), sums them up as a health score, and compares each audit with the one before.
      </p>
      <p>
        Run it in a project for scheduled audits of up to 10,000 pages with history, or use the{' '}
        <Link href="/tools/site-audit">Site audit tool</Link> for a one-off crawl of any site, up to 500
        pages.
      </p>

      <h2 id="run">Run a site audit</h2>
      <Steps>
        <Step title="Start it">
          <p>
            Open <Ui>Site audit</Ui> in your project. The start URL defaults to the project&apos;s website. Choose how
            many pages to crawl, up to 10,000, then click <Ui>Start crawl</Ui>. Under <Ui>More options</Ui> you can
            skip or limit URLs by pattern and check links to other sites.
          </p>
        </Step>
        <Step title="Let it crawl">
          <p>
            The crawler starts with two requests at a time and adds more while your site answers quickly, up to six
            at a time and four a second. It slows down as soon as the site does. It follows <code>robots.txt</code>,
            including its Crawl-delay (up to 10 seconds), finds pages through links and your XML sitemaps, and records
            the exact status code of every URL and every redirect hop. Links with a query string (filters, sorts,
            tracking) are crawled after the rest, so a page limit is spent on distinct pages first. You can leave the
            page while it runs.
          </p>
        </Step>
        <Step title="Only if your site needs it: render JavaScript or get past blocks">
          <p>
            Sites that build their content in the browser look empty to a plain crawler, and the audit flags them with
            &quot;Content needs JavaScript rendering&quot;. Set <strong>JavaScript rendering</strong> to{' '}
            <Ui>Where needed</Ui> and only those pages are rendered through YepAPI, at $0.02 each.
          </p>
          <p>
            If a firewall or bot protection refuses the crawler, tick <strong>Get past blocks</strong>: those pages are
            fetched through YepAPI&apos;s proxies at $0.03 each. Both stop at the spending cap you set; the crawl itself
            carries on.
          </p>
        </Step>
        <Step title="Schedule it">
          <p>
            On the <strong>History</strong> tab, <Ui>Settings and schedule</Ui> saves these choices and runs the audit
            weekly or monthly.
          </p>
        </Step>
      </Steps>

      <h2 id="read">Read the site audit report</h2>
      <p>
        The <strong>Overview</strong> shows the health score and the AI discoverability score, issue counts by
        severity, and the top issues, or what changed since the previous audit. Under them: response times, status
        codes, content types, how the links found were crawled and status codes by click depth.
      </p>
      <Screenshot
        name="site-audit"
        window
        alt="A site audit of upliftdesk.com: health score, AI discoverability score, issue counts and the top issues"
        caption="The overview of a site audit."
      />
      <DocTable
        caption="How to read the health score"
        head={['Score', 'Reading']}
        mono={[0]}
        rows={[
          ['80–100', 'Healthy. Few URLs have an error.'],
          ['50–79', 'Errors on a good share of URLs. Fix them first, then warnings.'],
          ['0–49', 'Errors on most URLs, often one sitewide problem such as a broken link in the footer.'],
        ]}
      />
      <p>
        The health score is the share of crawled URLs without an error. The AI discoverability score adds up which AI
        crawlers <code>robots.txt</code> lets in, whether pages read without JavaScript, how fast they answer and
        whether there is an <code>llms.txt</code>. The exact formulas and every check are listed in{' '}
        <Link href="/docs/audit-checks">Site audit checks</Link>.
      </p>
      <p>
        If the crawl stopped at your page limit, a note says so. Findings that compare pages with each other
        (duplicates, orphan pages, broken links) are then partial; run it again with a higher limit to cover the whole
        site.
      </p>

      <h3 id="issues">Work through the issues</h3>
      <p>
        <strong>All issues</strong> groups findings by category: crawling and status codes, redirects, indexability,
        content, links, sitemaps and more. Open an issue to see what it means, how to fix it and every affected URL
        with the detail for that page (which link is broken, which canonical is wrong and so on), most important pages
        first. Start with errors: they stop pages from being crawled, indexed or shown.
      </p>
      <Screenshot name="site-audit-issues" alt="All issues of a site audit grouped by category, each with its severity and the number of affected URLs" caption="Issues grouped by category. Open one for the affected URLs and how to fix it." />

      <h3 id="search-traffic">Check pages that get search traffic</h3>
      <p>
        When the project has <Link href="/docs/tutorials/search-console">Search Console</Link> connected, the audit
        reads each page&apos;s clicks from Google for the last 28 days and the 28 before. It then flags pages Google
        still sends visitors to that redirect, return an error, are noindex or point their canonical elsewhere, and
        pages whose clicks fell by half or more. The Pages tab shows the clicks and can sort by them.
      </p>

      <h3 id="pages">Look at pages and links</h3>
      <p>
        <strong>Pages</strong> lists every URL with its status, indexability, word count, depth, response time,
        incoming links, internal PageRank and issue count. Filter and sort, and click a page for everything recorded
        about it: why it is or is not indexable, its redirect chain, title, description, headings, structured data,
        issues, and the links in and out. <strong>Links</strong> lists every link found, with its anchor and the status
        of the page it points to.
      </p>

      <h3 id="history">Compare audits</h3>
      <p>
        Each audit is compared with the previous audit of the same site. Every issue shows how many URLs are new (found
        for the first time), added (crawled before without the issue), removed (fixed) and missing (not crawled this
        time). The audit also flags pages that became non-indexable or whose status code, title, description, H1 or
        word count changed. <strong>History</strong> charts the scores and lists every past audit.
      </p>

      <h2 id="export">Export the fixes for a coding agent</h2>
      <p>
        <strong>Exports</strong> has three kinds of download:
      </p>
      <ul>
        <li>
          <strong>AI fix brief</strong>: one Markdown file for Claude, Cursor or any coding agent. It lists the issues
          worst first with why each matters and how to fix it, groups URLs by template (such as{' '}
          <code>/blog/*</code>) so the template is fixed once, and names the pages most linked to a broken URL.
        </li>
        <li>
          <strong>Export all issues</strong>: a zip with one CSV per issue, and for link issues a second file of the
          links behind it.
        </li>
        <li>
          <strong>Bulk export</strong>: every crawled URL, every link, every redirect with its chain hop by hop, links to broken pages or redirects, uncrawled links, images without alt text, resources or external links, each as one CSV.
        </li>
      </ul>
      <Screenshot name="site-audit-tool-exports" alt="Exports of a site audit: the AI fix brief, the zip of every issue and bulk exports" caption="Hand the fix brief to your coding agent, or the CSVs to your team." />
      <Callout title="Agents can run it too">
        <p>
          Over the <Link href="/docs/mcp">MCP server</Link>, an agent can start an audit, read its issues and links,
          and fetch the fix brief, then fix what it finds in your codebase.
        </p>
      </Callout>

      <h2 id="lighthouse">Test a page with Lighthouse</h2>
      <p>
        In a project, the <strong>Lighthouse</strong> tab tests one URL on mobile or desktop ($0.05; a repeat
        within the hour is free). It shows the four Lighthouse scores, the Core Web Vitals (largest contentful paint,
        layout shift, total blocking time, first contentful paint, speed index) graded good, needs work or poor, and
        every failed audit with a severity, most serious first:
      </p>
      <ul>
        <li>
          <strong>Critical</strong>: fixing it would save 300 ms or more, or the audit scores under 50.
        </li>
        <li>
          <strong>Warning</strong>: it would save 100 ms or more, or scores under 90.
        </li>
        <li>
          <strong>Notice</strong>: anything else that failed.
        </li>
      </ul>
      <p>Within a severity, the biggest saving comes first.</p>

      <Callout title="If pages show as blocked">
        <p>
          &quot;Page blocked the crawler&quot; means the server answered 401/403 or a bot challenge. Allow the user
          agent <code>OpenSEOBot/0.1</code> in your firewall or CDN, or confirm the pages are meant to be private. Blocked
          pages are never reported as content problems.
        </p>
      </Callout>
    </DocArticle>
  );
}
