import Link from 'next/link';
import { Callout, DocTable, Step, Steps, Ui } from '@/components/doc-blocks';
import { DocArticle } from '@/components/doc-page';
import { getDoc } from '@/content/docs';
import { pageMeta } from '@/lib/metadata';

const slug = 'tutorials/search-console';
const doc = getDoc(slug);

export const metadata = pageMeta({ title: doc.seoTitle, description: doc.description, path: `/docs/${slug}` });

export default function SearchConsoleTutorial() {
  return (
    <DocArticle slug={slug} brands={['googlesearchconsole']}>
      <p>
        Search Console is the one source of search data that comes from Google itself: the queries people typed, how
        often you appeared, where, and how often they clicked. OpenSEO syncs your Search Console data daily, and
        nothing here spends from your YepAPI balance.
      </p>

      <h2 id="connect">Connect Google Search Console</h2>
      <Steps>
        <Step title="Open Search performance">
          <p>
            In a project, open <Ui>Search performance</Ui>. If it says Google is not set up, the person running your
            OpenSEO needs to create a Google OAuth client first: see <Link href="/docs/google-setup">Set up Google sign-in</Link>.
          </p>
        </Step>
        <Step title="Connect a Google account">
          <p>
            Under <strong>Google Search Console</strong>, click <Ui>Connect a Google account</Ui>. Google asks you to
            choose an account and allow access. Leave the permissions ticked: without them nothing is connected.
          </p>
        </Step>
        <Step title="Choose the property">
          <p>
            Back in OpenSEO, pick the account and the property this project should read. A{' '}
            <code>sc-domain:</code> property covers the whole domain; a URL property covers one prefix. Properties you
            can see but have no verified access to are listed and greyed out, because Google returns no data for them.
          </p>
        </Step>
      </Steps>

      <Callout title="What OpenSEO keeps">
        <p>
          The connection (which account, which property and its access tokens, encrypted), your Search Console
          numbers per day, query and page, synced daily up to 16 months back, and Google&apos;s index status for your
          pages from the Indexing page. Disconnecting Search Console deletes the synced data. Removing a Google
          account under <strong>Google accounts</strong>{' '}
          deletes the tokens and disconnects it from every project. To revoke access on Google&apos;s side too, use
          your Google account&apos;s security settings.
        </p>
      </Callout>

      <h2 id="read">Read the Search Console report</h2>
      <p>
        Pick a period (7 days, 28 days or 3 months) and optionally a device. Search Console data lags by about three
        days, so periods end three days ago. Each total is compared with the period of the same length just before it.
      </p>
      <DocTable
        caption="Search performance totals"
        head={['Figure', 'How it is worked out']}
        rows={[
          ['Clicks, impressions', 'Summed over the days in the period.'],
          ['CTR', 'Clicks divided by impressions for the whole period.'],
          ['Average position', 'Weighted by impressions, so a query seen 1,000 times counts more than one seen once. A lower number is better, so a fall shows as an improvement.'],
        ]}
      />

      <h2 id="striking">Find striking-distance keywords</h2>
      <p>
        The default tab lists queries one push from the top of page one. For each query OpenSEO takes the page of yours
        that ranks best for it, and keeps it when that page sits at positions 5 to 20. They are sorted by impressions,
        so the first rows are where improving a page would be seen most. Select rows and click{' '}
        <Ui>Save as keywords</Ui> to add them to Saved keywords, tagged <code>search-console</code>, ready for a rank
        tracker.
      </p>

      <h2 id="tables">Top queries and pages</h2>
      <p>
        The Queries and Pages tabs page through everything Search Console has, by clicks, 50 rows at a time, with CSV
        export of the page you are on.
      </p>

      <h2 id="opportunities">Page opportunity scores</h2>
      <p>Opportunities ranks pages at positions 4 to 20 by where a push is most worth it. Each page gets a score from 0 to 100:</p>
      <DocTable
        caption="Opportunity score"
        head={['Part', 'Weight', 'Measured by']}
        rows={[
          ['Demand', '0.7', 'Impressions, on a log scale, so one huge page does not flatten the rest.'],
          ['Reachability', '0.3', 'How close the page is to the top: 20 minus its position.'],
        ]}
      />
      <p>
        Each part is a percentile among the pages listed, so scores compare pages with each other, not with other
        sites.
      </p>

      <Callout title="With an agent">
        <p>
          Agents read the same data with <code>get_search_performance</code>, <code>get_search_console_rows</code>,{' '}
          <code>inspect_urls</code> and <code>get_search_opportunities</code>. They cannot connect Google themselves. See{' '}
          <Link href="/docs/mcp-tools#google">MCP tools</Link>.
        </p>
      </Callout>
    </DocArticle>
  );
}
