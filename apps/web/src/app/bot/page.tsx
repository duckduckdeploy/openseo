import Link from 'next/link';
import { pageMeta } from '@/lib/metadata';
import { GITHUB_URL } from '@/lib/site';

export const metadata = pageMeta({
  title: 'OpenSEOBot: the OpenSEO Site Audit Crawler',
  description: 'What OpenSEOBot is, when it visits, how fast it crawls, what it fetches and how to slow it down or block it with robots.txt.',
  path: '/bot',
});

/** The address in the crawler's user agent: what a site owner who sees OpenSEOBot in their logs needs. */
export default function BotPage() {
  return (
    <article className="container-page py-20 md:py-28">
      <p className="eyebrow">Crawler</p>
      <h1 className="text-display mt-5">OpenSEOBot</h1>
      <div className="prose-doc mt-12">
        <p>
          OpenSEOBot is the crawler behind the <Link href="/features/site-audit">OpenSEO site audit</Link>. It
          visits a website only when someone runs a site audit of it, or has scheduled one, to check it for technical
          SEO issues such as broken links, redirects and missing titles. It does not build a search index, and it does
          not collect content for training AI models.
        </p>
        <p>It identifies itself with this user agent:</p>
        <pre><code>OpenSEOBot/0.1 (+https://openseo.gg/bot)</code></pre>

        <h2>How it crawls</h2>
        <ul>
          <li>At most two requests at a time to a site, at least half a second apart.</li>
          <li>
            It follows <code>robots.txt</code>: the rules for <code>OpenSEOBot</code>, or for <code>*</code> when there
            are none, including <code>Crawl-delay</code> up to 10 seconds.
          </li>
          <li>When a site keeps answering 429 Too Many Requests, it backs off and then stops.</li>
          <li>Each audit is capped at the number of pages its owner chose.</li>
        </ul>

        <h2>What it fetches</h2>
        <ul>
          <li>Pages it finds through links and XML sitemaps, starting from the address it was given.</li>
          <li>
            <code>robots.txt</code>, sitemaps and <code>llms.txt</code>, and the <code>http://</code> version of the
            home page, to check that it redirects to HTTPS.
          </li>
          <li>The images, scripts and stylesheets pages use, to check that they load.</li>
          <li>Links to other sites, up to 300 per audit, to check that they are not broken.</li>
        </ul>

        <h2>How to slow it down or block it</h2>
        <p>
          To keep it out of your whole site, add this to <code>robots.txt</code>:
        </p>
        <pre><code>{'User-agent: OpenSEOBot\nDisallow: /'}</code></pre>
        <p>
          A <code>Disallow</code> for part of the site, or a <code>Crawl-delay</code>, works the same way. The change
          applies from the next audit.
        </p>
        <p>
          A page your <code>robots.txt</code> disallows is never fetched. If your firewall or bot protection refuses
          OpenSEOBot instead, the audit reports the page as blocked. Its owner can choose to fetch blocked pages through
          a proxy service, which does not use this user agent.
        </p>

        <h2>Self-hosted copies</h2>
        <p>
          OpenSEO is open source, so anyone can run their own copy. Those copies send the same user agent from their own
          servers, and they follow the same rules unless the person running them changed the code.
        </p>

        <h2>Questions or problems</h2>
        <p>
          If OpenSEOBot is causing trouble for your site, open an issue on{' '}
          <a href={`${GITHUB_URL}/issues`} rel="noopener">
            GitHub
          </a>{' '}
          with your domain and the time of the visits.
        </p>
      </div>
    </article>
  );
}
