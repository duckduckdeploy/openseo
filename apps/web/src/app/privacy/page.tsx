import Link from 'next/link';
import { LegalPage } from '@/components/legal-page';
import { pageMeta } from '@/lib/metadata';
import { CONTACT_EMAIL, YEPAPI_URL } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Privacy policy',
  description:
    'How OpenSEO handles your data: what the hosted app stores, how Google Search Console and Analytics data is used, who it is shared with, and how to delete it.',
  path: '/privacy',
});

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="2026-10-26">
      <p>
        This policy explains what data the hosted version of OpenSEO collects, why, who it is shared with and the
        choices you have. It covers openseo.gg, app.openseo.gg, api.openseo.gg and news.openseo.gg. In this policy,
        &ldquo;OpenSEO&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean the team that runs that hosted service.
      </p>
      <p>
        If you self-host OpenSEO, your copy runs on infrastructure you control and we receive none of its data. This
        policy does not apply to it.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>We store what the app needs to work: your account, your projects and the results of the actions you run.</li>
        <li>We do not sell your data, show ads or put tracking or advertising scripts on our sites.</li>
        <li>Google data you connect is used only to show you your own reports and power your project&apos;s features.</li>
        <li>You can delete projects and Google connections yourself at any time, and ask us to delete your account.</li>
      </ul>

      <h2>What we collect</h2>
      <h3>Your account</h3>
      <ul>
        <li>Your name, email address and password. The password is stored only as a salted hash.</li>
        <li>
          Sign-in sessions: a session token, with the IP address and browser details of the device that signed in, so
          you stay signed in and we can spot misuse. Sessions expire after 30 days.
        </li>
        <li>Your YepAPI key, encrypted with AES-256-GCM. It is never shown again after you save it.</li>
        <li>API keys you create for the OpenSEO API and MCP server. We store only a hash and a short prefix.</li>
        <li>
          AI assistants you connect through OAuth, such as ChatGPT: the client&apos;s name and address, and hashed
          access tokens.
        </li>
        <li>Your settings, such as an optional monthly spending limit.</li>
      </ul>

      <h3>Your projects and results</h3>
      <ul>
        <li>
          The domains, keywords, competitors, locations and AI prompts you add, and the results of the actions you run:
          keyword data, rankings, backlinks, AI answers, site audits, local grids and indexing status.
        </li>
        <li>
          A usage log of each paid call: what feature it was for, whether it worked, how long it took and what YepAPI
          charged. It shows you your spending and helps us fix problems.
        </li>
        <li>
          A short-term cache of YepAPI responses for your account, so repeating a lookup costs nothing until it
          expires.
        </li>
      </ul>

      <h3>Google Search Console and Google Analytics</h3>
      <p>Connecting Google is optional. If you connect it, we store:</p>
      <ul>
        <li>
          Which Google account you connected (its ID and email address), the scopes you granted, and the access and
          refresh tokens Google issues, encrypted.
        </li>
        <li>The Search Console property and Analytics property you choose for each project.</li>
        <li>
          Search Console performance data for that property: clicks, impressions, click-through rate and position per
          day, query and page, up to 16 months back, refreshed daily.
        </li>
        <li>Google&apos;s index status for your pages, from the URL Inspection API, and the sitemaps listed in Search Console.</li>
        <li>
          For site audits on a project with Search Console connected, each audited page&apos;s clicks for the last two
          28-day periods. They are deleted with the audit.
        </li>
      </ul>
      <p>
        Google Analytics reports are fetched from Google when you open them and are not stored. More on how we use
        Google data is under <a href="#google">Google user data</a> below.
      </p>

      <h3>Indexing</h3>
      <p>
        For the Indexing feature, we store your IndexNow key, the list of pages found in your sitemaps and site
        audits, a fingerprint of each page&apos;s content to spot changes, and a log of the URLs you submit to
        IndexNow.
      </p>

      <h3>Visitors to our websites</h3>
      <ul>
        <li>
          Our servers and our network provider, Cloudflare, log requests (IP address, page, browser details and time) to
          keep the sites running and protect them from abuse. Server logs are rotated automatically and kept only for
          a short time.
        </li>
        <li>
          The free SEO tools on openseo.gg use your IP address to apply daily limits. It is held in memory only and is
          not stored.
        </li>
        <li>We do not use Google Analytics or any other analytics or advertising scripts on our sites.</li>
      </ul>

      <h3>When you contact us</h3>
      <p>If you email us or open a GitHub issue, we keep the conversation so we can reply and follow up.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To run the service: sign you in, run the actions you ask for, show your results and run scheduled jobs such as rank checks and daily Search Console syncs.</li>
        <li>To show you what you have spent and enforce the limits you set.</li>
        <li>To keep the service secure: rate limits, spotting abuse and investigating problems.</li>
        <li>To contact you about your account or important changes to the service.</li>
      </ul>
      <p>
        We do not sell your personal data, use it for advertising or use it to train AI models. Where data protection
        law asks for a legal basis, we rely on performing our contract with you (running the service you signed up
        for), our legitimate interest in keeping it secure and working, and your consent where you give it, such as
        when you connect Google.
      </p>

      <h2 id="google">Google user data</h2>
      <p>
        OpenSEO&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. In particular:
      </p>
      <ul>
        <li>
          <strong>What we access.</strong> With the Search Console scope, we read your properties, performance data,
          URL inspection results and sitemaps, and submit sitemaps when you ask us to. With the Analytics read-only
          scope, we read your properties and reports. We do not change any other Search Console or Analytics setting.
        </li>
        <li>
          <strong>How we use it.</strong> Only to provide and improve the features you use: Search Console reports,
          keyword suggestions, rank tracking, AI prompt ideas, site audit traffic, indexing status and sitemap
          submission, all for your own projects.
        </li>
        <li>
          <strong>Who we share it with.</strong> No one, except when you ask: for example when you export a CSV, or
          when an AI assistant you have connected to your account requests your data through the OpenSEO API or MCP
          server. It is not sent to YepAPI or any other provider.
        </li>
        <li>
          <strong>What we never do.</strong> We do not sell Google user data, use it for advertising, use it to build
          profiles, or use it to train AI or machine learning models.
        </li>
        <li>
          <strong>Who can read it.</strong> People do not read your Google data, except with your permission, when
          needed for security or to investigate abuse, or when the law requires it.
        </li>
        <li>
          <strong>Removing it.</strong> Disconnecting Search Console from a project deletes its stored Search Console
          data. Removing a Google account in Settings deletes its tokens and the data synced through it. You can also
          revoke access at any time from your{' '}
          <a href="https://myaccount.google.com/permissions" rel="noopener">
            Google account permissions
          </a>
          .
        </li>
      </ul>

      <h2>Who we share data with</h2>
      <p>We use these providers to run the service. Each one gets only what it needs.</p>
      <ul>
        <li>
          <strong>Vultr</strong> hosts our servers and databases.
        </li>
        <li>
          <strong>Cloudflare</strong> provides DNS and sits in front of our sites to deliver and protect them.
        </li>
        <li>
          <strong>YepAPI</strong> supplies the SEO data. When you run an action, the request (such as the keywords,
          domains, URLs or AI prompts involved) is sent to YepAPI with your key, and YepAPI bills you for it. Your
          account and payments with YepAPI are covered by{' '}
          <a href={YEPAPI_URL} rel="noopener">
            YepAPI&apos;s own policies
          </a>
          . OpenSEO does not process payments.
        </li>
        <li>
          <strong>Google</strong>, when you connect Search Console or Analytics, to fetch your data and submit sitemaps
          you choose.
        </li>
        <li>
          <strong>IndexNow</strong> (api.indexnow.org), when you submit pages. The URLs you submit are passed on to the
          search engines that take part, such as Bing, Yandex, Seznam, Naver and Yep.
        </li>
        <li>
          <strong>Google Workspace</strong> hosts our email, so it holds the messages you send us.
        </li>
      </ul>
      <p>
        Our site audit crawler visits the sites you audit, identifying itself as OpenSEO&apos;s bot (see{' '}
        <Link href="/bot">our bot page</Link>). We may also disclose data if the law requires it, to protect people&apos;s
        safety or our rights, or as part of a transfer of the service to a new operator, who would be bound by this
        policy.
      </p>

      <h2>Cookies and browser storage</h2>
      <ul>
        <li>
          The app (app.openseo.gg) sets one essential cookie to keep you signed in. It lasts up to 30 days, or until you
          sign out.
        </li>
        <li>
          If you choose light or dark mode, a preference cookie and your browser&apos;s local storage remember it for a
          year, shared between our sites. The app also keeps a few view settings in local storage. None of this is
          used to identify or track you.
        </li>
        <li>Cloudflare may set a strictly necessary cookie to protect the sites from bots.</li>
        <li>We do not use analytics, advertising or tracking cookies, so there is no cookie banner.</li>
      </ul>

      <h2>How long we keep it</h2>
      <ul>
        <li>Account data: until you delete your account.</li>
        <li>Projects and their results: until you delete the project or your account. Deleting a project deletes everything in it.</li>
        <li>Google data: until you disconnect it, delete the project or delete your account.</li>
        <li>Sign-in sessions: 30 days. Cached YepAPI responses: until they expire, usually within days.</li>
        <li>Server logs: a short time, after which they are rotated away.</li>
        <li>Database backups: 14 days. Deleted data disappears from backups as they roll over.</li>
      </ul>

      <h2>Security</h2>
      <p>
        Traffic to our sites is encrypted with HTTPS. Passwords are hashed, API keys and OAuth tokens are stored as
        hashes, and YepAPI keys and Google tokens are encrypted at rest. Access to our servers is limited to the people
        who run the service. No system is perfectly secure, so if you find a vulnerability, please email {mail}.
      </p>

      <h2>Where your data is processed</h2>
      <p>
        Our providers may process data in countries other than yours, including the United States. Where the law
        requires it, we rely on safeguards such as the providers&apos; standard contractual clauses.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, including under the GDPR and US state laws such as the CCPA, you have the right to
        access, correct, export or delete your personal data, to object to or restrict how we use it, and to withdraw
        consent you have given.
      </p>
      <ul>
        <li>You can correct and remove most data yourself in the app: projects, saved keywords, Google connections, API keys and your YepAPI key.</li>
        <li>
          To get a copy of your data or delete your account, email {mail} from the address on your account. We reply
          within 30 days.
        </li>
        <li>If you are in the EU or UK, you can also complain to your data protection authority.</li>
      </ul>

      <h2>Children</h2>
      <p>OpenSEO is not meant for anyone under 16, and we do not knowingly collect their data.</p>

      <h2>Changes to this policy</h2>
      <p>
        When we change this policy, we update it here and change the date at the top. If a change materially affects
        how we use your data, we will tell you by email or in the app before it applies.
      </p>

      <h2>Contact</h2>
      <p>Questions or requests about privacy: {mail}.</p>
    </LegalPage>
  );
}
