import Link from 'next/link';
import { LegalPage } from '@/components/legal-page';
import { pageMeta } from '@/lib/metadata';
import { CONTACT_EMAIL, YEPAPI_URL } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Terms of service',
  description:
    'The terms for using OpenSEO online: your account, your YepAPI key and costs, acceptable use, Google connections, and our responsibilities.',
  path: '/terms',
});

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="2026-10-26">
      <p>
        These terms apply when you use the hosted version of OpenSEO: the website at openseo.gg, the app at
        app.openseo.gg, the API and MCP server at api.openseo.gg, and news.openseo.gg. &ldquo;OpenSEO&rdquo;,
        &ldquo;we&rdquo; and &ldquo;us&rdquo; mean the team that runs that service. By creating an account or using
        the service, you agree to these terms and to our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>The software and the hosted service</h2>
      <p>
        OpenSEO is open-source software released under the MIT licence. The licence in the repository governs the code,
        including when you self-host it, and these terms do not limit it. These terms cover only the hosted service we
        run.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be at least 16, and old enough to agree to these terms where you live.</li>
        <li>Give accurate details and keep your password, API keys and connected AI assistants secure.</li>
        <li>
          You are responsible for everything done through your account, including by scripts, agents or AI assistants
          you connect through the API or MCP server.
        </li>
        <li>
          If you use OpenSEO for an organisation, you confirm you are allowed to accept these terms on its behalf.
        </li>
      </ul>

      <h2>Your YepAPI key and costs</h2>
      <p>
        OpenSEO is free to use. The SEO data comes from YepAPI, using a YepAPI key you provide. YepAPI bills you
        directly for the calls made with that key, at its own prices and under{' '}
        <a href={YEPAPI_URL} rel="noopener">
          its own terms
        </a>
        . OpenSEO does not handle that payment.
      </p>
      <ul>
        <li>
          You are responsible for the usage and charges on your key, including from scheduled jobs you set up (such as
          rank trackers and AI visibility checks) and from agents you connect.
        </li>
        <li>
          The monthly spending limit in Settings is a safeguard, not a guarantee. A call already running can finish
          above it, and we are not liable for charges on your key.
        </li>
        <li>Prices shown on our sites are examples. YepAPI sets its prices and may change them.</li>
      </ul>

      <h2>Limits on the hosted service</h2>
      <p>
        To keep the hosted service fair and affordable to run, we apply limits, such as the number of pages per site
        audit, audits per day and uses of the free tools on our website. We may change these limits. A self-hosted
        copy has no limits beyond your own setup.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>break the law, or use OpenSEO to infringe anyone&apos;s rights;</li>
        <li>
          crawl, audit or submit sites you do not own or are not allowed to analyse, in a way that harms them or breaks
          their terms;
        </li>
        <li>submit pages to IndexNow or Google for sites you do not control;</li>
        <li>attack, overload, probe or interfere with the service, or try to get around its limits or security;</li>
        <li>access other users&apos; data, or create accounts in bulk or by automated means;</li>
        <li>resell or give access to the hosted service as a service of your own. You are free to run your own copy of the software for that;</li>
        <li>use the service in breach of the terms of YepAPI, Google or the sites and services it connects to.</li>
      </ul>

      <h2>Your content and data</h2>
      <p>
        You keep ownership of everything you add to OpenSEO and the results it produces for you. You give us
        permission to store and process it only as needed to run the service for you, as described in the{' '}
        <Link href="/privacy">privacy policy</Link>. You confirm you have the right to use the domains, keywords and
        other data you add.
      </p>

      <h2>Google and other connected services</h2>
      <p>
        When you connect Google Search Console, you confirm you are allowed to access that property, and your use
        of Google&apos;s data stays subject to Google&apos;s own terms. You can disconnect at any
        time in the app or from your Google account. When you set up IndexNow, you are responsible for the key file on
        your site and the pages you submit.
      </p>

      <h2>Accuracy of SEO data</h2>
      <p>
        Search volumes, difficulty scores, traffic estimates, backlink counts, rankings and AI answers are estimates
        and snapshots from third parties. They can be incomplete or wrong, and they change. Use your own judgement
        before acting on them; we do not guarantee any ranking, traffic or indexing result.
      </p>

      <h2>Changes and availability</h2>
      <p>
        OpenSEO is released and actively updated. We may add, change or remove features, and the service may sometimes
        be unavailable, for example during updates or when a provider has an outage. We do not promise any level of
        uptime. If we ever stop running the hosted service, we will give reasonable notice so you can export your data
        or move to a self-hosted copy.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can stop using OpenSEO at any time and ask us to delete your account by emailing {mail}. We may suspend or
        close an account that breaks these terms, puts the service or other users at risk, or that we must close by
        law. Where reasonable, we will tell you first and let you export your data.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent the law allows, we
        make no warranties, express or implied, including that it is fit for a particular purpose, uninterrupted or
        free of errors.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, OpenSEO is not liable for indirect, incidental, special or consequential losses,
        or for lost profits, revenue, rankings, traffic or data. Our total liability for any claim about the service is
        limited to US$50. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>Indemnity</h2>
      <p>
        If someone makes a claim against us because of how you used the service or because you broke these terms, you
        agree to cover our reasonable costs of dealing with it, to the extent the law allows.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the United States of America, without regard to conflict-of-law rules.
        If you live in a country whose consumer laws give you rights these terms cannot remove, those rights still
        apply.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        When we change these terms, we update them here and change the date at the top. If a change is significant, we
        will tell you by email or in the app before it applies. Using the service after that means you accept the new
        terms.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: {mail}.</p>
    </LegalPage>
  );
}
