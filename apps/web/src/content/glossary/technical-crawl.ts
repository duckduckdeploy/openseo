import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'robots-txt',
    term: 'Robots.txt',
    aka: ['robots.txt file', 'robots exclusion protocol', 'REP'],
    category: 'technical',
    short: 'Robots.txt is a plain-text file at the root of a site that tells crawlers which URLs they may and may not request.',
    definition: [
      'Robots.txt is a plain-text file at the root of a website, such as example.com/robots.txt, that tells search engine crawlers which URLs they may request. It follows the Robots Exclusion Protocol. It controls crawling, not indexing: a blocked URL can still appear in search results if other pages link to it.',
      'The file is made of groups. Each group starts with one or more `User-agent` lines naming the crawler it applies to, followed by `Disallow` and `Allow` rules that match URL paths. Google supports four fields: `user-agent`, `allow`, `disallow` and `sitemap`. Other fields, such as `crawl-delay`, are ignored by Google (Bing does read `crawl-delay`).',
      'Rules match from the start of the path and are case-sensitive. Google supports two wildcards: `*` matches any run of characters and `$` marks the end of the URL. When an `Allow` and a `Disallow` rule both match a URL, Google uses the most specific rule, meaning the one with the longest matching path. If they are equally specific, Google uses the least restrictive one, the `Allow`.',
      'A robots.txt file only covers the exact host, protocol and port it is served from. The file at https://example.com/robots.txt does not apply to https://shop.example.com or to http://example.com. Google caches the file for up to 24 hours and ignores anything after the first 500 KiB.',
      'Robots.txt is a request, not a lock. [Googlebot](/glossary/googlebot) and other well-behaved crawlers obey it, but scrapers and malicious bots can ignore it, and anyone can read the file. Never use it to hide private content; use authentication instead.',
    ],
    why: [
      'Robots.txt is the first file a crawler fetches on your site, so a single bad line can stop search engines crawling everything. `Disallow: /` left over from a staging site is one of the most common causes of a site vanishing from Google.',
      'Used well, it keeps crawlers out of URL spaces that waste their time: internal search results, endless filter combinations from faceted navigation, cart and checkout pages. On large sites that protects [crawl budget](/glossary/crawl-budget) for the pages you want found.',
      'It is also how you opt out of some AI uses. Tokens such as `GPTBot` (OpenAI) and `Google-Extended` (Google’s token for Gemini training and grounding) are controlled with robots.txt groups; see [AI crawlers](/glossary/ai-crawlers).',
      'The big misunderstanding: blocking a page in robots.txt does not remove it from Google. If the page is linked from elsewhere, Google can index the URL without its content and show it with no description. To keep a page out of results, let it be crawled and add [noindex](/glossary/noindex). Google stopped supporting a `noindex` rule inside robots.txt in September 2019.',
    ],
    how: {
      heading: 'How to write a robots.txt file',
      steps: [
        'Create a UTF-8 plain-text file named exactly robots.txt and serve it at the root of each host, for example https://example.com/robots.txt. It must return a 200 status.',
        'Start a group with `User-agent: *` for rules that apply to every crawler. Add separate groups only for crawlers that need different rules. A crawler follows only the most specific group that names it, so it ignores the `*` group if it has its own.',
        'Disallow URL patterns that have no search value: internal search, cart, checkout, account pages and parameter combinations that create near-endless duplicates.',
        'Do not block CSS, JavaScript or image files that pages need to render. Google renders pages, and blocked resources can make a page look broken or empty to it.',
        'Do not disallow pages you want removed from search. Use a noindex tag or X-Robots-Tag header, and leave the page crawlable so Google can see it.',
        'Add a `Sitemap:` line with the absolute URL of your [XML sitemap](/glossary/xml-sitemap). It can go anywhere in the file and is not tied to a group.',
        'Test before you ship. Check the robots.txt report in Google Search Console for fetch errors, and check a handful of important URLs against the rules.',
        'Watch the server. If robots.txt returns a 5xx error, Google stops crawling the site for up to 12 hours, then falls back to the last good copy for up to 30 days. A 404 for robots.txt is fine: Google treats it as no restrictions.',
      ],
    },
    example: {
      label: 'robots.txt',
      code: `# Rules for every crawler
User-agent: *
Disallow: /cart/
Disallow: /checkout/
Disallow: /search
Allow: /search/help
Disallow: /*?sort=

# Opt out of Gemini training and grounding
User-agent: Google-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml`,
    },
    openseo: {
      body: 'The OpenSEO site audit reads your robots.txt before it crawls, reports every page it was blocked from, and flags indexable pages that the rules shut out.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawling', 'googlebot', 'noindex', 'xml-sitemap', 'crawl-budget', 'ai-crawlers', 'meta-robots-tag'],
    faqs: [
      {
        question: 'Does robots.txt stop a page being indexed?',
        answer: [
          'No. Robots.txt stops crawling, not indexing. Google can still index a blocked URL it finds through links, usually without a description. Use a noindex meta tag or X-Robots-Tag header on a crawlable page to keep it out of results.',
        ],
      },
      {
        question: 'Can I put noindex in robots.txt?',
        answer: [
          'No. Google never officially supported it and stopped honouring it altogether on 1 September 2019. Put noindex on the page or in the HTTP header instead.',
        ],
      },
      {
        question: 'Does Google support crawl-delay?',
        answer: [
          'No. Google ignores `crawl-delay`. If Googlebot is overloading your server, return 503 or 429 responses for a short time and Google will slow down. Bing does honour `crawl-delay`.',
        ],
      },
      {
        question: 'Where does robots.txt go?',
        answer: [
          'At the root of the host, for example https://www.example.com/robots.txt. A file in a subfolder is ignored, and each subdomain needs its own file.',
        ],
      },
    ],
  },
  {
    slug: 'xml-sitemap',
    term: 'XML sitemap',
    aka: ['sitemap.xml', 'sitemap'],
    category: 'technical',
    short: 'An XML sitemap is a file that lists the URLs you want search engines to crawl and index, with optional last-modified dates.',
    definition: [
      'An XML sitemap is a file, usually at /sitemap.xml, that lists the URLs on a site you want search engines to crawl and index. Each entry gives the page’s full URL and, optionally, when it last changed. It helps crawlers find pages faster, but it does not guarantee that they will be crawled or indexed.',
      'The format comes from the sitemaps.org protocol, which Google, Bing and other engines share. A single sitemap can hold up to 50,000 URLs or 50 MB uncompressed. Bigger sites split their URLs across several sitemaps and list those in a sitemap index file. Sitemaps can be gzipped to save bandwidth.',
      'Each `<url>` entry has a required `<loc>` with an absolute URL. The optional `<lastmod>` gives the date of the last meaningful change. The protocol also defines `<priority>` and `<changefreq>`, but Google ignores both. Google uses `<lastmod>` only when it is consistently and verifiably accurate, so it should change when the content, structured data or links change, not every time the page is rebuilt.',
      'There are also extensions for images, videos and news, plus the option to list [hreflang](/glossary/hreflang) alternates inside the sitemap rather than in each page’s HTML.',
    ],
    why: [
      'Search engines mainly discover pages by following links. A sitemap is a second route in. It matters most for large sites, new sites with few [backlinks](/glossary/backlink), sites that publish often, and pages that are poorly linked internally, such as deep product pages.',
      'A sitemap is also a statement of intent. It tells Google which URL you consider the canonical version of each page. Listing redirected, noindexed, broken or non-canonical URLs sends mixed signals and makes your sitemap less trustworthy, so keep it to indexable 200-status pages only.',
      'Once you submit it, the Sitemaps report and page indexing report in Google Search Console show how many listed URLs are indexed, which is one of the quickest ways to spot [indexing](/glossary/indexing) problems.',
    ],
    how: {
      heading: 'How to create an XML sitemap',
      steps: [
        'Generate it automatically. Most CMSs and frameworks can build a sitemap from your content, which keeps it in step as pages are added and removed. Hand-written sitemaps go stale.',
        'Include only canonical, indexable URLs that return 200. Leave out redirects, 404s, noindexed pages, URLs blocked by robots.txt and parameter variants.',
        'Use absolute URLs on the same protocol and host as the site: https://www.example.com/page, not /page.',
        'Set `<lastmod>` from the real last-modified date of the content, in W3C date format (2026-10-01 or 2026-10-01T09:30:00+00:00). Do not set every URL to today’s date.',
        'Split past 50,000 URLs or 50 MB. Group URLs by type (products, categories, articles) so you can see indexing rates per section, and link each sitemap from a sitemap index.',
        'Submit the sitemap or sitemap index in Search Console and Bing Webmaster Tools, and add a `Sitemap:` line to [robots.txt](/glossary/robots-txt) so every crawler can find it.',
        'Check the Sitemaps report after each big change for fetch errors and a falling indexed count.',
      ],
    },
    example: {
      label: 'sitemap.xml',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.example.com/</loc>
    <lastmod>2026-10-01</lastmod>
  </url>
  <url>
    <loc>https://www.example.com/guides/robots-txt</loc>
    <lastmod>2026-09-14</lastmod>
  </url>
</urlset>`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks that a sitemap exists, flags non-indexable URLs listed in it and indexable pages missing from it, and uses it to find orphan pages.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['html-sitemap', 'robots-txt', 'indexing', 'crawling', 'orphan-page', 'canonical-tag', 'indexnow', 'google-search-console'],
    faqs: [
      {
        question: 'Do I need an XML sitemap?',
        answer: [
          'Small, well-linked sites can be crawled fine without one, but a sitemap costs little and helps Google and Bing find new and updated pages. Large sites, new sites and sites with deep or poorly linked pages benefit most.',
        ],
      },
      {
        question: 'How many URLs can a sitemap have?',
        answer: [
          'Up to 50,000 URLs or 50 MB uncompressed per sitemap file. Beyond that, split the URLs into several sitemaps and list them in a sitemap index.',
        ],
      },
      {
        question: 'Does Google use priority and changefreq?',
        answer: [
          'No. Google ignores `<priority>` and `<changefreq>`. It uses `<lastmod>` only when the dates are consistently accurate.',
        ],
      },
      {
        question: 'Can I still ping Google with my sitemap?',
        answer: [
          'No. Google retired the sitemap ping endpoint in 2023. Submit the sitemap in Search Console or reference it in robots.txt; Google rechecks it on its own. For Bing and some other engines, [IndexNow](/glossary/indexnow) is the way to notify changes.',
        ],
      },
    ],
  },
  {
    slug: 'html-sitemap',
    term: 'HTML sitemap',
    aka: ['user sitemap', 'site map page'],
    category: 'technical',
    short: 'An HTML sitemap is a normal web page that links to a site’s main sections and pages, mainly to help visitors and crawlers navigate.',
    definition: [
      'An HTML sitemap is an ordinary web page that lists links to a site’s main sections and pages, usually grouped by topic or category. Unlike an XML sitemap, which is written for search engines, it is written for people, though crawlers can follow its links like any others. It is often linked from the footer.',
      'On a small site an HTML sitemap might be one page of links. Large sites, such as retailers or news publishers, often build a tree of sitemap pages: an index of categories, each linking to a page of subcategories or products, so every page is a few clicks from the top.',
      'Google does not require an HTML sitemap and does not treat it as a special signal. Its value comes from the internal links it adds.',
    ],
    why: [
      'Every link on an HTML sitemap is an [internal link](/glossary/internal-links). That makes it a cheap way to reduce [crawl depth](/glossary/crawl-depth) and give otherwise hard-to-reach pages at least one link, so they are less likely to become [orphan pages](/glossary/orphan-page).',
      'It also helps visitors who cannot find what they want through menus or search, and it can expose gaps in your [site architecture](/glossary/site-architecture): if the sitemap is a jumble, the navigation probably is too.',
      'It is not a substitute for an [XML sitemap](/glossary/xml-sitemap) or good navigation. Think of it as a safety net.',
    ],
    how: {
      heading: 'How to build an HTML sitemap',
      steps: [
        'Group links by the same sections as your main navigation, with clear headings.',
        'Link to important hub and category pages first. On very large sites, link to category pages and let those link onwards, rather than listing every URL on one page.',
        'Keep each page to a sensible number of links so it stays usable. Split by section if it gets long.',
        'Generate it from your CMS so it updates when pages are added, moved or removed. Never link to redirected or deleted pages.',
        'Link the sitemap page from the footer so it is reachable from every page.',
      ],
    },
    example: {
      label: 'HTML',
      code: `<h2>Guides</h2>
<ul>
  <li><a href="/guides/keyword-research">Keyword research</a></li>
  <li><a href="/guides/technical-seo">Technical SEO</a></li>
</ul>
<h2>Tools</h2>
<ul>
  <li><a href="/tools/serp-checker">SERP checker</a></li>
</ul>`,
    },
    openseo: {
      body: 'The OpenSEO site audit flags orphan pages and pages that sit deep in the site, which are the ones an HTML sitemap or better internal linking should reach.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['xml-sitemap', 'internal-links', 'site-architecture', 'crawl-depth', 'orphan-page', 'breadcrumbs'],
    faqs: [
      {
        question: 'Are HTML sitemaps still useful for SEO?',
        answer: [
          'They can help on large or deep sites because they add internal links to pages that are otherwise hard to reach. On a small site with clear navigation they add little.',
        ],
      },
      {
        question: 'What is the difference between an HTML sitemap and an XML sitemap?',
        answer: [
          'An HTML sitemap is a page of links for people. An XML sitemap is a machine-readable file for search engines that you submit in Search Console. Most sites should have an XML sitemap; an HTML sitemap is optional.',
        ],
      },
    ],
  },
  {
    slug: 'canonical-tag',
    term: 'Canonical tag',
    aka: ['rel=canonical', 'canonical URL', 'canonical link element'],
    category: 'technical',
    short: 'A canonical tag is a link element that tells search engines which URL is the main version of a page when duplicates exist.',
    definition: [
      'A canonical tag is an HTML link element, `<link rel="canonical" href="…">`, placed in a page’s head to tell search engines which URL is the preferred, main version when the same or very similar content is available at several URLs. Google treats it as a strong hint, not a command, when choosing which URL to index.',
      'Duplicate URLs are everywhere. The same product can be reached at /shoes/red-trainers, /shoes/red-trainers?colour=red, /sale/red-trainers and the http and www variants of each. Google groups duplicates into a cluster and picks one URL as the canonical. That URL is the one it crawls most, shows in results and credits with the signals, such as links, from the rest of the cluster.',
      'Several signals feed that choice. Redirects and `rel="canonical"` are strong signals; inclusion in a sitemap is a weak one. Google also looks at internal links, HTTPS and which URL looks cleanest. When your signals agree, Google nearly always picks your canonical. When they conflict, for example a canonical tag pointing to one URL while your internal links and sitemap point to another, Google may choose for itself.',
      'You can set a canonical in two ways: a `<link>` element in the HTML head, or a `Link` HTTP header, which is the only option for non-HTML files such as PDFs. A self-referencing canonical, where a page names its own URL, is good practice: it guards against parameter and tracking variants.',
      'A canonical is not a redirect. Visitors stay on the URL they opened; only search engines consolidate signals. Use a [301 redirect](/glossary/301-redirect) when the duplicate URL should not exist at all.',
    ],
    why: [
      'Without clear canonicals, Google may index the wrong version of a page, such as a URL with a tracking parameter, split ranking signals across duplicates, or spend [crawl budget](/glossary/crawl-budget) on near-identical URLs. Canonicals are the main tool for managing [duplicate content](/glossary/duplicate-content) that has a legitimate reason to exist.',
      'Bad canonicals do real damage. A template bug that points every page’s canonical at the homepage can drop thousands of pages from the index. Canonicals that point to redirected, 404 or noindexed URLs give Google contradictory instructions, and Google will often ignore them.',
      'Canonical problems are also hard to see in a browser, which is why they are a staple of every SEO audit. The URL Inspection tool in Google Search Console shows both your declared canonical and the Google-selected canonical, and the page indexing report lists pages where Google chose a different one.',
    ],
    how: {
      heading: 'How to set canonical tags correctly',
      steps: [
        'Pick the one URL you want indexed for each piece of content: the right protocol (https), host (www or not), trailing-slash style and no tracking parameters.',
        'Add `<link rel="canonical" href="…">` inside the `<head>`, using an absolute URL. Google ignores canonicals placed in the `<body>`.',
        'Give every indexable page a self-referencing canonical. Point duplicates and parameter variants at the main version.',
        'Use only one canonical per page. Multiple canonical tags that disagree are usually ignored. Check that plugins, themes and your framework are not each adding one.',
        'Make the canonical target a live, indexable URL that returns 200. Never point it at a redirect, a 404, a noindexed page or a URL blocked by robots.txt.',
        'Back the canonical up with your other signals: link internally to the canonical URL, list only canonical URLs in your [XML sitemap](/glossary/xml-sitemap), and redirect retired duplicates.',
        'Don’t combine `noindex` and a canonical to a different URL on the same page; they send opposite messages. Don’t use robots.txt to handle duplicates either, because Google then cannot see the canonical tag at all.',
        'For [pagination](/glossary/pagination), give each page in a series its own self-referencing canonical. Pointing page 2 and beyond at page 1 tells Google to ignore the items listed on them.',
        'For PDFs and other files, send the canonical in a `Link` HTTP header.',
      ],
    },
    example: {
      label: 'HTML and HTTP header',
      code: `<!-- On https://www.example.com/shoes/red-trainers?utm_source=newsletter -->
<head>
  <link rel="canonical" href="https://www.example.com/shoes/red-trainers" />
</head>

# For a PDF, as an HTTP response header
Link: <https://www.example.com/guides/sizing.pdf>; rel="canonical"`,
    },
    openseo: {
      body: 'The OpenSEO site audit flags pages that canonicalise elsewhere, multiple or conflicting canonicals, and canonicals that point to broken, redirected or non-indexable URLs.',
      href: '/docs/audit-checks',
      label: 'See the canonical checks',
    },
    related: ['duplicate-content', '301-redirect', 'noindex', 'url-parameters', 'indexing', 'pagination', 'hreflang'],
    faqs: [
      {
        question: 'Is a canonical tag a directive?',
        answer: [
          'No. Google treats `rel="canonical"` as a strong hint. It usually follows it, but it can pick another URL if other signals, such as redirects, internal links and the sitemap, point elsewhere or the pages are not really duplicates.',
        ],
      },
      {
        question: 'Should every page have a self-referencing canonical?',
        answer: [
          'Yes, it is good practice. A self-referencing canonical tells search engines that the clean URL is the main one even when the page is reached with tracking or sorting parameters.',
        ],
      },
      {
        question: 'Can a canonical tag point to another domain?',
        answer: [
          'Yes. Cross-domain canonicals are supported, for example when you syndicate an article to a partner site and want the original to rank. As with any canonical, Google treats it as a hint.',
        ],
      },
      {
        question: 'Canonical tag or 301 redirect?',
        answer: [
          'Use a 301 when the duplicate URL should not be visited at all, such as an old URL after a move. Use a canonical when the duplicate needs to keep working for visitors, such as a filtered or tracked URL.',
        ],
      },
    ],
  },
  {
    slug: 'noindex',
    term: 'Noindex',
    aka: ['noindex tag', 'meta noindex', 'noindex directive'],
    category: 'technical',
    short: 'Noindex is a robots directive, set in a meta tag or HTTP header, that tells search engines not to show a page in search results.',
    definition: [
      'Noindex is a robots directive that tells search engines not to include a page in their index, so it does not appear in search results. You set it with a robots meta tag, `<meta name="robots" content="noindex">`, in the page’s head, or with an `X-Robots-Tag: noindex` HTTP header. Google treats it as a rule, not a hint.',
      'The crawler has to see the directive to obey it. If the page is blocked in [robots.txt](/glossary/robots-txt), Google never fetches it, never sees the noindex, and may keep the URL indexed from links. So a page you want out of results must stay crawlable.',
      'Noindex affects only the page it is on. Links on a noindexed page can still be followed for a while, although Google has said that long-term noindexed pages are eventually crawled less and their links treated like those on a page that is not there. `noindex` in robots.txt itself has not worked since Google dropped it in September 2019.',
    ],
    why: [
      'Noindex is how you keep low-value pages out of search: thank-you pages, internal search results, thin tag archives, staging copies and account pages. Removing them reduces [index bloat](/glossary/index-bloat) and keeps searchers landing on pages that are worth landing on.',
      'It is also one of the easiest ways to lose traffic by accident. A noindex left on after a redesign, or a CMS setting that adds it to a whole section, removes those pages from Google within days or weeks of the next crawl. Checking for unexpected noindex is a standard part of every [technical SEO](/glossary/technical-seo) audit.',
    ],
    how: {
      heading: 'How to noindex a page',
      steps: [
        'Add `<meta name="robots" content="noindex">` to the `<head>` of the page. To target only Google, use `name="googlebot"`.',
        'For PDFs, images and other non-HTML files, send an `X-Robots-Tag: noindex` header from your server instead. See [X-Robots-Tag](/glossary/x-robots-tag).',
        'Make sure the URL is not disallowed in robots.txt, or Google cannot see the directive.',
        'Remove the page from your [XML sitemap](/glossary/xml-sitemap) and avoid pointing a canonical tag from it to another URL.',
        'Check it worked with the URL Inspection tool in Search Console. For an urgent removal, use the Removals tool, which hides a URL for about six months while the noindex takes effect.',
      ],
    },
    example: {
      label: 'HTML and HTTP header',
      code: `<!-- In the page head -->
<meta name="robots" content="noindex">

# Or as an HTTP response header
X-Robots-Tag: noindex`,
    },
    openseo: {
      body: 'The OpenSEO site audit reports every page carrying noindex in a meta tag or X-Robots-Tag header, and flags noindexed URLs that are still listed in your sitemap.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['meta-robots-tag', 'x-robots-tag', 'robots-txt', 'indexing', 'index-bloat', 'nofollow', 'deindexing'],
    faqs: [
      {
        question: 'What is the difference between noindex and disallow?',
        answer: [
          'Disallow in robots.txt stops a page being crawled but not indexed. Noindex lets the page be crawled but keeps it out of the index. To remove a page from results, use noindex and do not disallow it.',
        ],
      },
      {
        question: 'How long does noindex take to work?',
        answer: [
          'It takes effect the next time Google crawls the page, which can be days or weeks depending on how often the page is crawled. Requesting indexing in URL Inspection can speed up the recrawl.',
        ],
      },
      {
        question: 'Does noindex pass link equity?',
        answer: [
          'Links on a noindexed page can still be followed at first, but Google has said that pages left on noindex for a long time are treated more like noindex, nofollow. Don’t rely on noindexed pages to pass value.',
        ],
      },
    ],
  },
  {
    slug: 'nofollow',
    term: 'Nofollow',
    aka: ['rel=nofollow', 'nofollow attribute', 'meta nofollow'],
    category: 'technical',
    short: 'Nofollow is a link attribute or meta directive asking search engines not to follow or credit links. Google treats it as a hint.',
    definition: [
      'Nofollow is an instruction that asks search engines not to follow a link or pass ranking credit through it. It can be set on a single link with `rel="nofollow"` or on every link on a page with `<meta name="robots" content="nofollow">`. Since 2019 Google treats link-level nofollow as a hint rather than a strict rule.',
      'Google introduced nofollow in 2005 to fight blog comment spam. In September 2019 it added two more specific values: `rel="sponsored"` for paid and affiliate links and `rel="ugc"` for user-generated content such as comments and forum posts. At the same time, all three became hints for ranking, and from 1 March 2020 also for crawling and indexing. Google may now use a nofollowed link to discover a URL or understand a page, but it decides for itself.',
      'The page-level meta nofollow is different from the link attribute: it applies to all links on the page and is a robots directive, not a link hint. For the full picture of how link attributes are seen from the backlink side, see [nofollow links](/glossary/nofollow-link).',
    ],
    why: [
      'Google’s spam policies require paid links to be qualified with `sponsored` or `nofollow`. Buying or selling links that pass PageRank without one is a [link scheme](/glossary/link-schemes) and can earn a manual action.',
      'Nofollow and `ugc` also protect your site from spam in comments and forums, because spammers gain nothing from links that do not pass value.',
      'What nofollow is not: a way to control crawling of your own pages. Adding nofollow to internal links to "sculpt" [PageRank](/glossary/pagerank) does not work, and since nofollow is a hint, it will not reliably keep a URL from being crawled. Use [robots.txt](/glossary/robots-txt) or [noindex](/glossary/noindex) for that.',
    ],
    how: {
      heading: 'How to use nofollow correctly',
      steps: [
        'Mark paid, sponsored and affiliate links with `rel="sponsored"`. `nofollow` is also acceptable.',
        'Mark links in comments, forum posts and other user-generated content with `rel="ugc"`. Most CMSs do this automatically.',
        'Use plain `rel="nofollow"` for links you do not want to vouch for, such as a link to a site you are criticising.',
        'Combine values when more than one applies, for example `rel="ugc nofollow"`.',
        'Leave normal editorial and internal links without the attribute. Nofollowing your own navigation wastes the internal links that help Google understand your site.',
      ],
    },
    example: {
      label: 'HTML',
      code: `<!-- One link -->
<a href="https://partner.example/offer" rel="sponsored">See the offer</a>
<a href="https://forum.example/post" rel="ugc nofollow">user link</a>

<!-- Every link on the page -->
<meta name="robots" content="nofollow">`,
    },
    related: ['nofollow-link', 'dofollow-link', 'sponsored-attribute', 'ugc-attribute', 'meta-robots-tag', 'link-equity', 'paid-links'],
    faqs: [
      {
        question: 'Is nofollow a hint or a directive?',
        answer: [
          'For Google, `rel="nofollow"` on a link has been a hint since 2019 for ranking and since March 2020 for crawling and indexing. Google usually respects it but may use the link for discovery.',
        ],
      },
      {
        question: 'Should I use nofollow on internal links?',
        answer: [
          'Usually not. It does not save crawl budget or concentrate PageRank. If you don’t want a page crawled or indexed, use robots.txt or noindex instead.',
        ],
      },
      {
        question: 'What is the difference between nofollow, sponsored and ugc?',
        answer: [
          '`sponsored` is for paid or affiliate links, `ugc` is for user-generated content, and `nofollow` is the general catch-all. All three tell Google not to treat the link as an endorsement.',
        ],
      },
    ],
  },
  {
    slug: 'x-robots-tag',
    term: 'X-Robots-Tag',
    aka: ['X-Robots-Tag header', 'robots HTTP header'],
    category: 'technical',
    short: 'X-Robots-Tag is an HTTP response header that gives search engines robots directives such as noindex, including for PDFs and images.',
    definition: [
      'X-Robots-Tag is an HTTP response header that carries the same robots directives as the robots meta tag, such as `noindex`, `nofollow` and `nosnippet`. Because it is sent by the server rather than written in HTML, it works for any file type, including PDFs, images, videos and other documents that cannot hold a meta tag.',
      'Any directive valid in a [meta robots tag](/glossary/meta-robots-tag) is valid in X-Robots-Tag, for example `noindex`, `nofollow`, `none`, `nosnippet`, `max-snippet`, `max-image-preview`, `noimageindex` and `unavailable_after`. You can combine them with commas, send several headers, and target one crawler by naming it first: `X-Robots-Tag: googlebot: noindex`.',
      'As with the meta tag, crawlers only see the header when they fetch the URL. A file blocked in [robots.txt](/glossary/robots-txt) is never fetched, so its X-Robots-Tag is never read.',
    ],
    why: [
      'It is the only way to keep non-HTML files out of search. If you have PDFs of price lists, internal documents or duplicates of web pages that you do not want ranking, X-Robots-Tag is how you [noindex](/glossary/noindex) them.',
      'It also scales. One server rule can noindex a whole folder, a file type or a staging host without touching any templates.',
      'That power cuts both ways. A header added at the CDN or server level is invisible when you view the page source, so an accidental `noindex` there can remove a site from Google without anyone noticing. Check response headers, not just HTML, when you audit [indexing](/glossary/indexing).',
    ],
    how: {
      heading: 'How to set an X-Robots-Tag header',
      steps: [
        'Decide which URLs need it: a file type (all PDFs), a path (/internal/) or a whole host (staging).',
        'Add the header in your server, CDN or framework config. The example shows Nginx and Apache.',
        'Make sure those URLs are not disallowed in robots.txt.',
        'Check the live response with your browser’s developer tools (Network tab) or `curl -I https://example.com/file.pdf`, and confirm in Search Console’s URL Inspection tool.',
      ],
    },
    example: {
      label: 'Server config',
      code: `# Nginx: keep all PDFs out of search
location ~* \\.pdf$ {
  add_header X-Robots-Tag "noindex, nofollow";
}

# Apache (.htaccess)
<FilesMatch "\\.pdf$">
  Header set X-Robots-Tag "noindex, nofollow"
</FilesMatch>

# The resulting response header
X-Robots-Tag: noindex, nofollow`,
    },
    openseo: {
      body: 'The OpenSEO site audit reads response headers as well as HTML, so it reports pages made noindex by an X-Robots-Tag header that you would not see in the page source.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['noindex', 'meta-robots-tag', 'robots-txt', 'nofollow', 'indexing', 'http-status-codes'],
    faqs: [
      {
        question: 'What is the difference between X-Robots-Tag and the meta robots tag?',
        answer: [
          'They accept the same directives. The meta tag lives in a page’s HTML; X-Robots-Tag is an HTTP header, so it also works for PDFs, images and other non-HTML files.',
        ],
      },
      {
        question: 'How do I check if a page has an X-Robots-Tag?',
        answer: [
          'Look at the response headers in your browser’s developer tools, run `curl -I` on the URL, or use URL Inspection in Google Search Console, which shows whether indexing is allowed.',
        ],
      },
    ],
  },
  {
    slug: 'crawl-budget',
    term: 'Crawl budget',
    aka: ['crawl allowance'],
    category: 'technical',
    short: 'Crawl budget is the set of URLs Google can and wants to crawl on a site. It only becomes a constraint on very large or fast-changing sites.',
    definition: [
      'Crawl budget is the number of URLs a search engine can and wants to crawl on a site in a given period. Google defines it as the combination of crawl capacity, how much crawling your server can handle without slowing down, and crawl demand, how much Google wants to crawl based on the site’s size, update frequency, quality and popularity.',
      'Crawl capacity rises when your server responds quickly and falls when it slows down or returns errors: 5xx and 429 responses make Google’s crawlers back off. Crawl demand rises for popular pages and content that changes often, and falls for URLs Google sees as stale, duplicate or low value.',
      'Google says crawl budget is something most sites do not need to think about. Its guidance is aimed at large sites, roughly 1 million or more unique pages that change weekly, or 10,000 or more pages that change daily, and at sites with many URLs Google has discovered but not crawled. Google calls those numbers rough estimates.',
    ],
    why: [
      'If Google spends its visits on junk URLs, new and updated pages wait longer to be crawled and indexed. On a large ecommerce site, that can mean new products or price changes taking weeks to show up.',
      'The usual culprits are [faceted navigation](/glossary/faceted-navigation) and URL parameters that create near-endless combinations, [duplicate content](/glossary/duplicate-content), [soft 404s](/glossary/soft-404), long [redirect chains](/glossary/redirect-chain) and slow servers.',
      'Crawl budget does not directly affect rankings. More crawling does not make a page rank higher; it only means Google sees changes sooner.',
    ],
    how: {
      heading: 'How to optimise crawl budget',
      steps: [
        'Check whether you have a problem first. In Search Console, look at the Crawl stats report and the page indexing report. Many "Discovered – currently not indexed" URLs on a big site is a sign.',
        'Block URL spaces with no search value, such as sort and filter combinations or internal search, in robots.txt. Noindex does not save crawling, because Google still has to fetch the page to see it.',
        'Consolidate duplicates with redirects or canonicals, and link internally to canonical URLs only.',
        'Return real 404 or 410 codes for removed pages, and fix soft 404s.',
        'Shorten redirect chains so each old URL takes one hop.',
        'Speed up server responses so Google can crawl more without overloading you.',
        'Keep your XML sitemap clean and its lastmod dates accurate, so Google knows what changed.',
      ],
    },
    openseo: {
      body: 'The OpenSEO site audit finds the usual crawl budget drains: redirect chains, internal links to redirects, duplicate pages, slow responses and non-indexable URLs in the sitemap.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawling', 'googlebot', 'faceted-navigation', 'url-parameters', 'log-file-analysis', 'index-bloat', 'robots-txt'],
    faqs: [
      {
        question: 'Does crawl budget matter for small sites?',
        answer: [
          'Rarely. Google says sites with fewer than a few thousand pages are usually crawled efficiently. If new pages on a small site are not indexed, the cause is more likely quality or discovery than crawl budget.',
        ],
      },
      {
        question: 'Does noindex save crawl budget?',
        answer: [
          'No. Google has to crawl a page to see the noindex, so noindexed pages still use crawl budget. Use robots.txt to stop crawling of URLs you never want fetched.',
        ],
      },
      {
        question: 'How can I see my crawl budget?',
        answer: [
          'Google does not publish a number. The Crawl stats report in Search Console shows how many requests Googlebot makes per day and how fast your server responds, and server [log file analysis](/glossary/log-file-analysis) shows exactly which URLs it fetches.',
        ],
      },
    ],
  },
  {
    slug: 'crawl-depth',
    term: 'Crawl depth',
    aka: ['click depth', 'page depth'],
    category: 'technical',
    short: 'Crawl depth is how many clicks a page is from the homepage. Deep pages are found and crawled less often than shallow ones.',
    definition: [
      'Crawl depth, also called click depth, is the number of links a crawler has to follow from the homepage, or another start page, to reach a page. The homepage has a depth of 0, pages linked from it have a depth of 1, and so on. It measures how buried a page is in a site’s link structure.',
      'Depth is about the shortest path through links, not the folder structure of the URL. /products/shoes/trainers/red-trainers can sit at depth 1 if it is linked from the homepage, and /red-trainers can sit at depth 6 if it is only reachable through pagination.',
    ],
    why: [
      'Search engines find most pages through links, and pages close to the homepage tend to be crawled more often and seen as more important. A page ten clicks deep is likely to be crawled rarely, and it receives little [link equity](/glossary/link-equity) from the rest of the site.',
      'A common rule of thumb is to keep important pages within about three clicks of the homepage. It is a guideline, not a Google rule, but deep pages are a reliable symptom of weak [site architecture](/glossary/site-architecture), long [pagination](/glossary/pagination) chains or missing category links.',
    ],
    how: {
      heading: 'How to reduce crawl depth',
      steps: [
        'Crawl the site and sort pages by depth. Look for important pages beyond three or four clicks.',
        'Add links from category and hub pages, and use related-content and related-product links between pages at the same level.',
        'Flatten deep pagination by showing more items per page or linking to more page numbers at once.',
        'Add [breadcrumbs](/glossary/breadcrumbs) and, on very large sites, an [HTML sitemap](/glossary/html-sitemap).',
        'Do not rely on the XML sitemap alone. It helps discovery but adds no internal links.',
      ],
    },
    example: {
      body: 'Homepage (depth 0) → Shoes category (1) → Trainers subcategory (2) → Page 4 of trainers (5, after following pages 2 and 3) → Red trainers product (6). Linking Red trainers from the Trainers category’s featured list brings it to depth 3.',
    },
    openseo: {
      body: 'The OpenSEO site audit records how many clicks each page is from the start URL and flags pages that sit deep in the site.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['site-architecture', 'internal-links', 'orphan-page', 'crawl-budget', 'pagination', 'crawling'],
    faqs: [
      {
        question: 'What is a good crawl depth?',
        answer: [
          'Aim for important pages within three clicks of the homepage. This is a widely used rule of thumb rather than a Google requirement.',
        ],
      },
      {
        question: 'Is crawl depth the same as URL depth?',
        answer: [
          'No. URL depth is the number of folders in the path. Crawl depth is the number of clicks needed to reach the page, which depends on internal links.',
        ],
      },
    ],
  },
  {
    slug: 'orphan-page',
    term: 'Orphan page',
    aka: ['orphaned page', 'orphan URL'],
    category: 'technical',
    short: 'An orphan page is a page with no internal links pointing to it, so visitors and crawlers cannot reach it by browsing the site.',
    definition: [
      'An orphan page is a page on a website that no other page on the same site links to. Visitors cannot reach it by clicking through the site, and crawlers can only find it through an XML sitemap, external backlinks or a URL they already know. It exists, but it is cut off from the site’s link structure.',
      'Orphans usually appear by accident: a page drops out of the navigation after a redesign, a campaign landing page is never linked, products go out of stock and vanish from category pages, or a CMS publishes pages that no template links to.',
    ],
    why: [
      'Search engines rely on [internal links](/glossary/internal-links) to discover pages, judge their importance and understand what they are about. An orphan page gets none of that. Even if it is in your [XML sitemap](/glossary/xml-sitemap), it receives no internal [link equity](/glossary/link-equity) and tends to be crawled rarely and rank poorly.',
      'Orphans are also a maintenance risk. Outdated pages nobody can find still sit in the index, sometimes with old prices or wrong information.',
    ],
    how: {
      heading: 'How to find and fix orphan pages',
      steps: [
        'Build a list of every URL you know about: your XML sitemap, pages getting traffic in GA4 or Search Console, and URLs with backlinks.',
        'Crawl the site from the homepage by following links only.',
        'Any URL on the first list that the crawl did not reach is an orphan.',
        'If the page is valuable, link to it from relevant pages, such as its category, related articles or the navigation.',
        'If it is obsolete, remove it from the sitemap and either redirect it to the closest replacement with a [301](/glossary/301-redirect) or let it return 404 or 410.',
      ],
    },
    openseo: {
      body: 'The OpenSEO site audit compares your sitemap with the pages it reached by following links and reports sitemap URLs that no crawled page links to.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['internal-links', 'crawl-depth', 'xml-sitemap', 'site-architecture', 'html-sitemap', 'crawling'],
    faqs: [
      {
        question: 'Can Google index orphan pages?',
        answer: [
          'Yes, if it finds them through a sitemap or external links. But with no internal links they are crawled less and usually rank poorly.',
        ],
      },
      {
        question: 'Are orphan pages bad for SEO?',
        answer: [
          'They are wasted opportunities rather than a penalty. A valuable page that nothing links to underperforms, and an outdated one can mislead visitors. Link the good ones and retire the rest.',
        ],
      },
    ],
  },
  {
    slug: '301-redirect',
    term: '301 redirect',
    aka: ['permanent redirect', '301 moved permanently', '308 redirect'],
    category: 'technical',
    short: 'A 301 redirect permanently sends visitors and search engines from one URL to another and tells Google the new URL should be indexed.',
    definition: [
      'A 301 redirect is an HTTP response with status 301 Moved Permanently that sends browsers and search engines from an old URL to a new one. It tells Google the move is permanent, which Google treats as a strong signal that the new URL should be indexed in place of the old one and receive its ranking signals.',
      'A 308 Permanent Redirect means the same thing but requires the browser to keep the request method, so a POST stays a POST. Google treats 301 and 308 the same. Google can also treat an instant meta refresh or a JavaScript redirect as permanent, but a server-side 301 is the most reliable.',
      'Since 2016 Google has said that 3xx redirects do not lose PageRank, so you no longer need to worry about a fixed "loss" per redirect. What still costs you is pointing redirects at irrelevant pages or chaining them.',
    ],
    why: [
      '301s are how you keep rankings and backlinks when URLs change: site migrations, moving to [HTTPS](/glossary/https), changing domains, merging pages and tidying [URL slugs](/glossary/url-slug). Without them, old URLs return 404, their [backlinks](/glossary/backlink) point nowhere, and visitors hit dead ends.',
      'They also fix duplication. Redirecting http to https and non-www to www (or the other way round) makes sure only one version of each page can be indexed.',
      'The target matters. Redirecting many removed pages to the homepage is often treated by Google as a [soft 404](/glossary/soft-404), so the old pages’ value is not passed on. Redirect each URL to the closest relevant replacement.',
    ],
    how: {
      heading: 'How to set up a 301 redirect',
      steps: [
        'Map every old URL to its new equivalent before you change anything. One-to-one mappings beat blanket redirects.',
        'Set the redirect on the server, CDN or framework, not with JavaScript, so every crawler sees it.',
        'Redirect straight to the final URL. Avoid [redirect chains](/glossary/redirect-chain) and update old redirects when you add new ones.',
        'Update internal links, canonical tags and your XML sitemap to point at the new URLs, so you are not relying on the redirect.',
        'Keep redirects in place for at least a year, and ideally indefinitely for URLs with backlinks.',
        'Test with `curl -I` or a crawler that each old URL returns 301 and lands on a 200 page.',
      ],
    },
    example: {
      label: 'Server config',
      code: `# Nginx
location = /old-page {
  return 301 https://www.example.com/new-page;
}

# Apache (.htaccess)
Redirect 301 /old-page https://www.example.com/new-page

# What the server returns
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/new-page`,
    },
    openseo: {
      body: 'The OpenSEO site audit follows every redirect it meets and flags redirect chains, loops and internal links that point at redirects instead of the final URL.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['302-redirect', 'redirect-chain', 'redirect-loop', 'http-status-codes', 'canonical-tag', 'link-equity', 'sneaky-redirects'],
    faqs: [
      {
        question: 'Do 301 redirects lose link equity?',
        answer: [
          'Google has said since 2016 that 3xx redirects do not lose PageRank. Value can still be lost if the target is not relevant, for example when everything is redirected to the homepage.',
        ],
      },
      {
        question: 'What is the difference between a 301 and a 308?',
        answer: [
          'Both are permanent. A 308 also requires the browser to repeat the same HTTP method. Google treats them the same.',
        ],
      },
      {
        question: 'How long should I keep a 301 redirect?',
        answer: [
          'Google recommends keeping redirects for at least a year. For URLs with backlinks or regular traffic, keep them permanently.',
        ],
      },
    ],
  },
  {
    slug: '302-redirect',
    term: '302 redirect',
    aka: ['temporary redirect', '302 found', '307 redirect'],
    category: 'technical',
    short: 'A 302 redirect temporarily sends visitors to another URL while telling search engines to keep the original URL indexed.',
    definition: [
      'A 302 redirect is an HTTP response with status 302 Found that sends visitors from one URL to another temporarily. It tells search engines the original URL is still the real one, so Google treats it as only a weak signal that the target should be indexed and usually keeps the original URL in its results.',
      'There are three temporary codes: 302 Found, 303 See Other and 307 Temporary Redirect. 307 is the strict version of 302: the browser must repeat the same request method. Google handles 302, 303 and 307 the same way.',
      'If a "temporary" redirect stays in place for a long time, Google may eventually decide the move is permanent and index the target instead. That is Google adapting to how sites behave, not a reason to use 302s for permanent moves.',
    ],
    why: [
      'Choosing the wrong code is a common migration mistake. A permanent move done with 302s tells Google to keep the old URLs, so the new ones can take longer to replace them in results.',
      'Used on purpose, 302s are the right tool for genuinely temporary situations: a product briefly out of stock, a short promotion, A/B tests that send some visitors to a variant, or sending users to a login page.',
    ],
    how: {
      heading: 'How to choose between a 301 and a 302',
      steps: [
        'Ask whether the old URL will come back. If it won’t, use a [301 redirect](/glossary/301-redirect).',
        'If it will, and you want the original URL to keep ranking, use a 302 or 307.',
        'For A/B tests, Google recommends 302 redirects rather than 301s, plus a [canonical tag](/glossary/canonical-tag) on the variant pointing at the original.',
        'Audit old 302s from time to time, and fold any that sit inside a [redirect chain](/glossary/redirect-chain) into a single hop. Temporary redirects have a habit of becoming permanent without anyone switching them to 301.',
      ],
    },
    example: {
      label: 'Server response',
      code: `HTTP/1.1 302 Found
Location: https://www.example.com/summer-sale`,
    },
    openseo: {
      body: 'The OpenSEO site audit follows redirects of every type, so temporary redirects show up alongside the chains and loops it reports.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['301-redirect', 'redirect-chain', 'http-status-codes', 'canonical-tag', 'redirect-loop'],
    faqs: [
      {
        question: 'Do 302 redirects pass PageRank?',
        answer: [
          'Google has said that 3xx redirects, including 302s, do not lose PageRank. The difference is which URL Google indexes: with a 302 it usually keeps the original.',
        ],
      },
      {
        question: 'When should I use a 302 instead of a 301?',
        answer: [
          'Only when the move is temporary and the original URL will return, such as a short promotion or maintenance. For anything permanent, use a 301 or 308.',
        ],
      },
    ],
  },
  {
    slug: 'redirect-chain',
    term: 'Redirect chain',
    aka: ['chained redirects', 'multiple redirects'],
    category: 'technical',
    short: 'A redirect chain is when a URL redirects to another URL that redirects again, so it takes two or more hops to reach the final page.',
    definition: [
      'A redirect chain is a sequence of two or more redirects between the URL that was requested and the page that finally loads, such as A → B → C. Chains build up as sites change URLs, move to HTTPS or switch domains, with each new redirect added on top of the old ones.',
      'A typical chain: http://example.com/page → https://example.com/page → https://www.example.com/page → https://www.example.com/page/. Each hop is a separate request the browser or crawler has to make.',
    ],
    why: [
      'Every hop adds a round trip, which slows the page for visitors, especially on mobile. For crawlers, Google says long chains have a negative effect on crawling, and Googlebot generally follows up to 10 hops before giving up and reporting a redirect error. Other crawlers may stop sooner.',
      'Chains also multiply the chance of something going wrong: one hop changes to a 404 or loops back, and every URL earlier in the chain breaks with it. Fixing them is one of the quickest wins in a [technical SEO](/glossary/technical-seo) audit.',
    ],
    how: {
      heading: 'How to fix a redirect chain',
      steps: [
        'Crawl the site and list every URL that takes more than one redirect to resolve, including old URLs from past migrations and your backlink list.',
        'For each chain, change the first redirect so it points straight at the final URL: A → C, B → C.',
        'Combine protocol and host rules so http://example.com goes to https://www.example.com in one hop.',
        'Update [internal links](/glossary/internal-links), canonicals and the sitemap to use the final URL, so no internal path hits a redirect at all.',
        'Re-test each fixed URL and check that it returns a single 301 followed by a 200.',
      ],
    },
    example: {
      body: 'Before: /blog/seo-tips → /blog/seo-tips-2024 → /guides/seo-tips (two hops). After: /blog/seo-tips → /guides/seo-tips and /blog/seo-tips-2024 → /guides/seo-tips (one hop each), with internal links updated to /guides/seo-tips.',
    },
    openseo: {
      body: 'The OpenSEO site audit reports every URL that takes two or more redirects to resolve, plus internal links that point at redirects instead of the final page.',
      href: '/docs/audit-checks',
      label: 'See the redirect checks',
    },
    related: ['301-redirect', 'redirect-loop', '302-redirect', 'crawl-budget', 'internal-links', 'http-status-codes'],
    faqs: [
      {
        question: 'How many redirects does Google follow?',
        answer: [
          'Googlebot generally follows up to 10 redirect hops. After that it stops and Search Console reports a redirect error. Aim for one hop anyway.',
        ],
      },
      {
        question: 'Are redirect chains bad for SEO?',
        answer: [
          'Yes, in practice. They slow pages, waste crawling and make the redirect more fragile. They rarely cause a ranking drop on their own, but they are easy to fix.',
        ],
      },
    ],
  },
  {
    slug: 'redirect-loop',
    term: 'Redirect loop',
    aka: ['infinite redirect', 'too many redirects', 'ERR_TOO_MANY_REDIRECTS'],
    category: 'technical',
    short: 'A redirect loop is when redirects send a URL back to itself, so the page never loads and browsers show a too-many-redirects error.',
    definition: [
      'A redirect loop happens when a chain of redirects points back to a URL it has already visited, for example A → B → A, so the browser or crawler never reaches a page that loads. Browsers stop after a set number of hops and show an error such as Chrome’s ERR_TOO_MANY_REDIRECTS. Search engines cannot index the URL.',
      'Loops are usually caused by conflicting rules: an HTTP-to-[HTTPS](/glossary/https) rule on the server fighting a [CDN](/glossary/cdn) that talks to the server over HTTP, a www rule and a non-www rule both active, a trailing-slash rule that undoes another, or a CMS redirect that clashes with one in the server config.',
    ],
    why: [
      'A loop makes a page completely unreachable for everyone. If it affects the homepage or a template, the whole site can drop out of search once Google recrawls it, and visitors see an error instead of your content.',
      'Because loops often appear right after a migration, an HTTPS change or a CDN setup, they are one of the first things to check when traffic falls off a cliff.',
    ],
    how: {
      heading: 'How to fix a redirect loop',
      steps: [
        'Trace the hops with `curl -IL https://example.com/page` or a redirect checker to see exactly which URLs repeat.',
        'Find the rules responsible: server config, .htaccess, CMS settings, plugins and CDN rules can all issue redirects.',
        'With a CDN in front of an HTTPS site, make sure the CDN connects to your server over HTTPS (Cloudflare’s "Full" or "Full (strict)" SSL mode, for example) so the server does not keep redirecting it.',
        'Remove the conflicting rule so each URL redirects once, straight to its final version.',
        'Clear caches and test again in a private window, since browsers cache 301s.',
      ],
    },
    example: {
      body: 'The server redirects http://example.com to https://example.com. The CDN in front of it fetches pages from the server over plain HTTP, so every request from the CDN gets that redirect again, and the visitor bounces between the two forever.',
    },
    openseo: {
      body: 'The OpenSEO site audit detects redirect loops as a critical issue, so you find them before Googlebot does.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['redirect-chain', '301-redirect', '302-redirect', 'https', 'cdn', 'http-status-codes'],
    faqs: [
      {
        question: 'What causes ERR_TOO_MANY_REDIRECTS?',
        answer: [
          'A redirect loop: two or more rules keep sending the browser between the same URLs. Common causes are conflicting HTTPS, www or trailing-slash rules, and CDN SSL settings.',
        ],
      },
      {
        question: 'Can Google index a page in a redirect loop?',
        answer: [
          'No. Googlebot never reaches content, so the URL is reported as a redirect error in Search Console and is not indexed.',
        ],
      },
    ],
  },
  {
    slug: 'http-status-codes',
    term: 'HTTP status codes',
    aka: ['HTTP response codes', 'status codes'],
    category: 'technical',
    short: 'HTTP status codes are three-digit numbers a server returns with each response to say whether a request worked, moved or failed.',
    definition: [
      'HTTP status codes are three-digit numbers a web server sends with every response to say what happened to the request. 2xx means success, 3xx means the content is elsewhere (a redirect), 4xx means a problem with the request, such as a missing page, and 5xx means the server failed. Search engines use them to decide what to crawl and index.',
      'The ones that matter most for SEO: 200 OK, the page loaded. 301 and 308, permanent redirects. 302, 303 and 307, temporary redirects. 304 Not Modified, the page has not changed since the crawler last saw it. 404 Not Found and 410 Gone, the page does not exist. 429 Too Many Requests, the server is rate-limiting. 500, 502, 503 and 504, server errors.',
    ],
    why: [
      'Status codes are instructions to crawlers. Google indexes content from 2xx responses, follows 3xx redirects, drops URLs that return 4xx from the index over time, and slows crawling when it sees 5xx or 429. Google treats all 4xx codes other than 429 the same way, so 404 and 410 both remove a page.',
      'Wrong codes cause real problems. A missing page that returns 200 becomes a [soft 404](/glossary/soft-404). A permanent move done with a 302 keeps the old URL indexed. A server that returns 500 during busy periods gets crawled less. Checking codes across the whole site is the backbone of any [technical SEO](/glossary/technical-seo) audit.',
    ],
    how: {
      heading: 'How to check HTTP status codes',
      steps: [
        'For one URL, open your browser’s developer tools (Network tab) and reload, or run `curl -I https://example.com/page`.',
        'For a whole site, crawl it and group pages by status code.',
        'In [Google Search Console](/glossary/google-search-console), the page indexing report lists URLs Google saw as 404, soft 404, redirect or server error, and the Crawl stats report breaks requests down by response.',
        'Fix in order: 5xx first, then broken internal links to 4xx pages, then redirect chains and wrong redirect types.',
      ],
    },
    example: {
      label: 'Common codes',
      code: `200 OK                   page served, can be indexed
301 Moved Permanently    permanent redirect (308 is equivalent)
302 Found                temporary redirect (307 is equivalent)
304 Not Modified         unchanged since last crawl
404 Not Found            page missing
410 Gone                 page removed on purpose
429 Too Many Requests    rate-limited; Google slows down
500 Internal Server Error
503 Service Unavailable  temporary; use with Retry-After`,
    },
    openseo: {
      body: 'The OpenSEO site audit records the status code of every URL it crawls and flags 4xx and 5xx pages, rate-limited pages, redirect chains and broken links.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['301-redirect', '302-redirect', '404-error', 'soft-404', '5xx-errors', 'redirect-chain', 'crawling'],
    faqs: [
      {
        question: 'Which HTTP status codes matter for SEO?',
        answer: [
          '200, 301, 302, 404, 410, 429 and 503 are the ones you will deal with most. They decide whether Google indexes a page, follows it elsewhere, drops it or slows down.',
        ],
      },
      {
        question: 'Is 404 or 410 better for removed pages?',
        answer: [
          'Google treats them the same: both lead to the URL being dropped from the index. Use 410 if you want to say the removal is deliberate.',
        ],
      },
    ],
  },
  {
    slug: '404-error',
    term: '404 error',
    aka: ['404 not found', 'page not found', 'broken page'],
    category: 'technical',
    short: 'A 404 error is the HTTP status a server returns when a requested page does not exist. It is normal, but broken links to 404s are worth fixing.',
    definition: [
      'A 404 error is the HTTP status code 404 Not Found, which a server returns when the requested URL does not exist. It happens when a page is deleted or moved without a redirect, or when someone follows a mistyped or broken link. Search engines drop URLs that keep returning 404 from their index.',
      'A 404 page is the page the visitor sees. A good one keeps the 404 status code but shows a helpful message, search box and links to popular sections, so the visitor does not leave.',
      '410 Gone is the deliberate version: it says the page was removed on purpose. Google treats 404 and 410 the same way.',
    ],
    why: [
      'Google says 404s on their own do not hurt a site’s rankings. Every site has them, and returning 404 for a page that really is gone is the correct behaviour.',
      'They matter in three cases. Internal links pointing at 404s waste crawling and frustrate visitors. Removed pages that had [backlinks](/glossary/backlink) lose that value unless you [301 redirect](/glossary/301-redirect) them to a relevant replacement. And important pages returning 404 by mistake, after a migration or a CMS change, will drop out of search.',
    ],
    how: {
      heading: 'How to fix 404 errors',
      steps: [
        'Find them: crawl your site for broken internal links, and check the "Not found (404)" list in Search Console’s page indexing report.',
        'Fix internal links so they point at live URLs.',
        'If a page moved or has a close replacement, add a 301 redirect to it. Prioritise URLs with backlinks or traffic.',
        'If a page is gone with no replacement, let it return 404 or 410. Don’t redirect everything to the homepage; Google often treats that as a [soft 404](/glossary/soft-404).',
        'Make sure your 404 page returns a real 404 status, not 200, and offers useful links onwards.',
      ],
    },
    openseo: {
      body: 'The OpenSEO site audit lists broken pages (4xx), broken internal links and broken external links, and the backlink checker shows which of your pages other sites link to before you remove them.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['http-status-codes', 'soft-404', '301-redirect', 'internal-links', 'link-reclamation', 'lost-backlinks'],
    faqs: [
      {
        question: 'Do 404 errors hurt SEO?',
        answer: [
          'Not on their own. Google expects some 404s. They become a problem when important pages return 404 by mistake, internal links point at them, or removed pages had backlinks you could redirect.',
        ],
      },
      {
        question: 'Should I redirect all 404s to the homepage?',
        answer: [
          'No. Google often treats mass redirects to the homepage as soft 404s, and visitors find them confusing. Redirect to a relevant page or leave a genuine 404.',
        ],
      },
    ],
  },
  {
    slug: 'soft-404',
    term: 'Soft 404',
    aka: ['soft 404 error'],
    category: 'technical',
    short: 'A soft 404 is a page that returns a 200 success code but looks like an error or empty page, so Google treats it as not found.',
    definition: [
      'A soft 404 is a URL that returns a 200 OK status code but whose content looks like an error, an empty page or a "not found" message. Because the server says the page is fine while the content says it is not, Google reports it as a soft 404 in Search Console and leaves it out of the index.',
      'Common causes: an error page or "no results" page that returns 200, empty category or search pages, product pages for discontinued items with no content, pages that depend on JavaScript that failed to load, and redirects of many unrelated URLs to the homepage or another generic page.',
    ],
    why: [
      'Soft 404s waste [crawl budget](/glossary/crawl-budget): Google says they continue to be crawled because the status code keeps telling it they exist. They also confuse reporting, since the page looks fine in your monitoring but never ranks.',
      'Sometimes Google flags real pages as soft 404s because they are too thin to look like real content. That is a signal to improve the page, not just a technical bug. See [thin content](/glossary/thin-content).',
    ],
    how: {
      heading: 'How to fix soft 404 errors',
      steps: [
        'Open the page indexing report in [Google Search Console](/glossary/google-search-console) and filter for "Soft 404".',
        'For pages that really are gone, return a 404 or 410 status, or 301 redirect to a close replacement.',
        'Make sure your error page and empty search results return a 404 status (or are noindexed), not 200.',
        'For real pages Google mistook for errors, add substantial content and check that it renders without relying on scripts that can fail. Use URL Inspection to see what Google rendered.',
        'Replace blanket homepage redirects with redirects to relevant pages, or let the old URLs 404.',
      ],
    },
    example: {
      body: 'https://shop.example.com/product/blue-kettle was discontinued. The page now shows "Sorry, this product is no longer available" and nothing else, but still returns 200. Google flags it as a soft 404. Better: 301 redirect it to the current kettle range, or return 410.',
    },
    openseo: {
      body: 'The OpenSEO site audit flags thin pages and pages whose content needs JavaScript to appear, two of the usual reasons Google sees a soft 404.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['404-error', 'http-status-codes', 'thin-content', 'crawl-budget', 'javascript-seo', '301-redirect'],
    faqs: [
      {
        question: 'What is the difference between a 404 and a soft 404?',
        answer: [
          'A 404 returns the 404 Not Found status code. A soft 404 returns 200 OK but shows error-like or empty content, so Google has to guess that the page is missing.',
        ],
      },
      {
        question: 'Are soft 404s bad for SEO?',
        answer: [
          'They are not a penalty, but those pages will not rank and they waste crawling. Fix the status code, redirect the URL or improve the content.',
        ],
      },
    ],
  },
  {
    slug: '5xx-errors',
    term: '5xx server errors',
    aka: ['5xx errors', '500 error', '503 service unavailable', 'server error'],
    category: 'technical',
    short: '5xx server errors are HTTP status codes meaning the server failed to handle a request. Persistent ones make Google crawl less and drop pages.',
    definition: [
      '5xx server errors are HTTP status codes from 500 to 599 that mean the server failed to fulfil a valid request. The common ones are 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable and 504 Gateway Timeout. Unlike a 404, they say nothing about whether the page exists; they say the server could not deliver it.',
      '503 is the one to use on purpose. During planned maintenance, returning 503 with a `Retry-After` header tells crawlers to come back later, instead of indexing a maintenance page.',
    ],
    why: [
      'Google responds to 5xx and 429 errors by temporarily slowing its crawling, then speeding up again once responses return to 2xx. Pages already indexed are kept for a while, but URLs that persistently return server errors are eventually dropped from the index.',
      'A 5xx on robots.txt is worse: Google stops crawling the whole site for up to 12 hours while it retries, then falls back to the last good copy of the file. See [robots.txt](/glossary/robots-txt).',
      'Server errors also mean visitors see an error page. Intermittent 5xx under load are easy to miss in a browser but show up clearly in crawls, Search Console and server logs.',
    ],
    how: {
      heading: 'How to fix 5xx errors',
      steps: [
        'Find them: run a crawl, check the "Server error (5xx)" list in Search Console’s page indexing report, and look at the Crawl stats report for spikes.',
        'Check server and application logs for the failing URLs to find the cause: crashes, timeouts, database errors or exhausted memory.',
        'For 502 and 504, look at the layer between visitor and app: the CDN, load balancer or reverse proxy and its timeouts.',
        'If load is the cause, add caching, a [CDN](/glossary/cdn) or more capacity. Return 503 or 429 briefly rather than letting the server fall over.',
        'For planned downtime, serve 503 with `Retry-After` and keep it short. A day or two is fine; weeks of 503 lead to pages being dropped.',
      ],
    },
    example: {
      label: 'Maintenance response',
      code: `HTTP/1.1 503 Service Unavailable
Retry-After: 3600
Content-Type: text/html; charset=utf-8`,
    },
    openseo: {
      body: 'The OpenSEO site audit flags every page that returned a 5xx as a critical issue, along with rate-limited pages and slow server responses.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['http-status-codes', 'crawl-budget', 'time-to-first-byte', 'cdn', 'log-file-analysis', '404-error'],
    faqs: [
      {
        question: 'Do 5xx errors affect rankings?',
        answer: [
          'Brief errors usually do not. Google slows crawling and keeps indexed pages for a while. Errors that persist lead to pages being dropped from the index.',
        ],
      },
      {
        question: 'Should I use 503 for site maintenance?',
        answer: [
          'Yes. Return 503 Service Unavailable with a Retry-After header for the duration, so Google knows the outage is temporary and does not index the maintenance page.',
        ],
      },
    ],
  },
  {
    slug: 'https',
    term: 'HTTPS',
    aka: ['HTTP Secure', 'SSL', 'TLS', 'SSL certificate'],
    category: 'technical',
    short: 'HTTPS is the encrypted version of HTTP. It protects data between browser and site, and Google uses it as a lightweight ranking signal.',
    definition: [
      'HTTPS (Hypertext Transfer Protocol Secure) is the encrypted version of HTTP, the protocol browsers use to load web pages. It uses TLS, often still called SSL, to encrypt traffic between the visitor and the server and to prove the site is who it says it is, via a certificate. Sites on HTTPS show https:// in the address bar.',
      'A TLS certificate is issued by a certificate authority for a domain. Free, automatically renewed certificates from authorities such as Let’s Encrypt, and the certificates built into most hosts and CDNs, mean cost is no longer a reason to stay on HTTP.',
    ],
    why: [
      'Google announced HTTPS as a ranking signal in 2014 and has described it as a lightweight one. It is also part of Google’s page experience considerations. On its own it will not lift a weak page, but there is no good reason to give it up.',
      'The bigger effect is on people. Chrome and other browsers label HTTP pages "Not secure", which puts visitors off, and many browser features, such as geolocation and service workers, only work over HTTPS. Without it, anything typed into a form can be read or altered in transit.',
      'When both versions exist, Google prefers to index the HTTPS URL as the canonical, as long as it works properly. A half-done move, with HTTP pages still live or [mixed content](/glossary/mixed-content) on HTTPS pages, leaves duplicate URLs and warnings.',
    ],
    how: {
      heading: 'How to move a site to HTTPS',
      steps: [
        'Get a certificate that covers every host you use (www and non-www, plus subdomains). Most hosts and CDNs can issue and renew one automatically.',
        'Redirect every HTTP URL to its HTTPS equivalent with a single server-side [301 redirect](/glossary/301-redirect), page to page, not to the homepage.',
        'Update internal links, canonical tags, hreflang annotations and structured data to use https:// URLs.',
        'Fix mixed content: every image, script, stylesheet and iframe must load over HTTPS.',
        'Update the [XML sitemap](/glossary/xml-sitemap) and the `Sitemap:` line in robots.txt. A robots.txt file must also be served on the HTTPS host.',
        'Verify a Domain property in Search Console (it covers both protocols) and watch the page indexing report as Google swaps the URLs.',
        'Once everything works, add an [HSTS](/glossary/hsts) header so browsers always use HTTPS.',
      ],
    },
    example: {
      label: 'Nginx',
      code: `# Send all HTTP traffic to HTTPS in one hop
server {
  listen 80;
  server_name example.com www.example.com;
  return 301 https://www.example.com$request_uri;
}`,
    },
    openseo: {
      body: 'The OpenSEO site audit flags sites still served over HTTP, mixed content on HTTPS pages and a missing Strict-Transport-Security header.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['mixed-content', 'hsts', 'security-headers', '301-redirect', 'redirect-loop', 'technical-seo'],
    faqs: [
      {
        question: 'Is HTTPS a ranking factor?',
        answer: [
          'Yes, but a lightweight one. Google has used HTTPS as a ranking signal since 2014. Its larger value is trust: browsers warn visitors about HTTP pages.',
        ],
      },
      {
        question: 'Will moving to HTTPS hurt my rankings?',
        answer: [
          'A well-run move with page-to-page 301 redirects usually causes only short fluctuations while Google recrawls. Problems come from missing redirects, redirect loops and leftover HTTP links.',
        ],
      },
      {
        question: 'What is the difference between SSL and TLS?',
        answer: [
          'TLS is the modern successor to SSL. Every current HTTPS site uses TLS; "SSL certificate" is just the name that stuck.',
        ],
      },
    ],
  },
  {
    slug: 'mixed-content',
    term: 'Mixed content',
    aka: ['mixed content warning', 'insecure content'],
    category: 'technical',
    short: 'Mixed content is when an HTTPS page loads images, scripts or other files over insecure HTTP. Browsers block or upgrade much of it.',
    definition: [
      'Mixed content is when a page served over HTTPS loads some of its resources, such as images, scripts, stylesheets, fonts or iframes, over plain HTTP. The page itself is encrypted, but those files are not, so they can be read or tampered with in transit. Browsers treat it as a security problem and block or upgrade much of it.',
      'Browsers split it into two kinds. Active mixed content, such as scripts, stylesheets, iframes and fetch requests, can change the whole page, so modern browsers block it outright. Passive or display content, such as images, audio and video, is less dangerous; current versions of Chrome and other browsers try to load it over HTTPS automatically and block it if that fails.',
    ],
    why: [
      'Blocked resources break pages. A blocked script can stop a menu, form or checkout working; a blocked stylesheet leaves the page unstyled; a blocked image leaves a hole. Search engines that [render](/glossary/rendering) the page may see the same broken version.',
      'It also undermines a move to [HTTPS](/glossary/https). Visitors can see a warning or lose the padlock, and the site sends mixed signals about which protocol it really uses. Mixed content is one of the most common leftovers after an HTTPS migration.',
    ],
    how: {
      heading: 'How to fix mixed content',
      steps: [
        'Find it: open the browser console on HTTPS pages, which logs every mixed content warning, or crawl the site with a tool that checks resource URLs.',
        'Change hard-coded http:// URLs in templates, content and the database to https://, or to relative URLs for files on your own site.',
        'For third-party files, check the provider serves them over HTTPS. If it doesn’t, host the file yourself or replace it.',
        'As a safety net, send the `Content-Security-Policy: upgrade-insecure-requests` header, which tells browsers to request every resource over HTTPS.',
        'Re-crawl to confirm nothing is left.',
      ],
    },
    example: {
      label: 'HTML',
      code: `<!-- On https://www.example.com/ -->
<!-- Mixed content: loads over plain HTTP -->
<script src="http://cdn.example.net/widget.js"></script>
<img src="http://www.example.com/images/logo.png" alt="Example">

<!-- Fixed -->
<script src="https://cdn.example.net/widget.js"></script>
<img src="/images/logo.png" alt="Example">`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks the resources on every HTTPS page and reports any loaded over HTTP.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['https', 'hsts', 'security-headers', 'rendering', 'technical-seo'],
    faqs: [
      {
        question: 'Does mixed content affect SEO?',
        answer: [
          'Indirectly. It can break how pages render and look, for visitors and for search engines, and it weakens the security benefit of HTTPS. It is worth fixing on any HTTPS site.',
        ],
      },
      {
        question: 'How do I find mixed content?',
        answer: [
          'Open the browser’s developer console on a page: every insecure request is logged as a mixed content warning. For a whole site, use a crawler that checks the URLs of images, scripts and stylesheets.',
        ],
      },
    ],
  },
  {
    slug: 'hsts',
    term: 'HSTS (Strict-Transport-Security)',
    aka: ['HTTP Strict Transport Security', 'Strict-Transport-Security header', 'HSTS preload'],
    category: 'technical',
    short: 'HSTS is a response header that tells browsers to only connect to a site over HTTPS, so they never load it over insecure HTTP.',
    definition: [
      'HSTS (HTTP Strict Transport Security) is a security policy a site sends with the `Strict-Transport-Security` response header. It tells browsers to connect only over HTTPS for a set period: if a visitor types http:// or follows an old HTTP link, the browser switches to HTTPS itself before sending any request.',
      'The header has three parts. `max-age` is how long, in seconds, the browser should remember the rule. `includeSubDomains` applies it to every subdomain. `preload` signals that you want the domain on the HSTS preload list built into Chrome, Firefox, Safari and Edge, which protects even a visitor’s very first visit. Browsers only honour the header when it arrives over HTTPS.',
    ],
    why: [
      'A 301 from HTTP to HTTPS still leaves the first request unencrypted, which an attacker on the same network can intercept. HSTS closes that gap, and it also removes the redirect hop for returning visitors, so pages start loading slightly sooner.',
      'HSTS is not a Google ranking factor. It is a security best practice that completes a move to [HTTPS](/glossary/https), and it is one of the [security headers](/glossary/security-headers) audits check for.',
      'It is also hard to undo. Browsers remember it for the full max-age, and removal from the preload list can take months to reach users. If any subdomain still needs HTTP, `includeSubDomains` will break it.',
    ],
    how: {
      heading: 'How to enable HSTS',
      steps: [
        'Make sure every page and every subdomain you plan to cover works over HTTPS, and that HTTP redirects to HTTPS.',
        'Start with a short max-age, such as `max-age=300` (five minutes), and check nothing breaks.',
        'Raise it in steps to a week, a month, then a year (`max-age=31536000`).',
        'Add `includeSubDomains` once you are sure no subdomain needs HTTP.',
        'Only then consider preloading at hstspreload.org. It requires a max-age of at least one year, `includeSubDomains` and `preload`, served on the bare domain over HTTPS.',
      ],
    },
    example: {
      label: 'HTTP response header',
      code: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks HTTPS responses for a Strict-Transport-Security header and reports it once for the site if it is missing.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['https', 'security-headers', 'mixed-content', '301-redirect', 'technical-seo'],
    faqs: [
      {
        question: 'Is HSTS required for SEO?',
        answer: [
          'No. Google does not use it as a ranking signal. It is a security measure that makes sure visitors always reach the HTTPS version of your site.',
        ],
      },
      {
        question: 'What max-age should I use for HSTS?',
        answer: [
          'Work up to one year (31536000 seconds), which is also the minimum for the preload list. Start with a few minutes so you can roll back quickly if something breaks.',
        ],
      },
    ],
  },
  {
    slug: 'security-headers',
    term: 'Security headers',
    aka: ['HTTP security headers', 'Content-Security-Policy', 'X-Frame-Options'],
    category: 'technical',
    short: 'Security headers are HTTP response headers that tell browsers how to handle a site’s content safely, blocking common attacks.',
    definition: [
      'Security headers are HTTP response headers that tell the browser how to handle a site’s content more safely. They switch on built-in protections against common attacks such as cross-site scripting, clickjacking and content-type sniffing. They are set on the server, CDN or framework and are invisible to visitors unless something is blocked.',
      'The main ones: `Strict-Transport-Security` ([HSTS](/glossary/hsts)) forces HTTPS. `Content-Security-Policy` (CSP) limits where scripts, styles and other files can load from. `X-Content-Type-Options: nosniff` stops browsers guessing file types. `X-Frame-Options` or CSP’s `frame-ancestors` stops other sites embedding yours in a frame (clickjacking). `Referrer-Policy` controls how much of the URL is shared with other sites. `Permissions-Policy` limits browser features such as the camera or geolocation.',
    ],
    why: [
      'Security headers are not a Google ranking factor. Their SEO value is indirect but real: hacked sites get injected spam pages, cloaked redirects and malware, which can lead to browser warnings, a [manual action](/glossary/manual-action) for [hacked content](/glossary/hacked-content) and a long clean-up. Headers make several common attacks much harder.',
      'They also protect visitors and their data, which protects your brand. Many security reviews and procurement checklists ask for them.',
    ],
    how: {
      heading: 'How to add security headers',
      steps: [
        'Check what you send now with your browser’s developer tools or `curl -I`.',
        'Add the low-risk headers first: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `X-Frame-Options: SAMEORIGIN` (or `frame-ancestors \'self\'` in CSP).',
        'Add HSTS once the whole site works over HTTPS.',
        'Roll out CSP carefully. Start with `Content-Security-Policy-Report-Only` to see what would be blocked, adjust the policy for your analytics, fonts and embeds, then switch to enforcing.',
        'Set headers in one place, such as the CDN or server config, so every response gets them, including error pages.',
      ],
    },
    example: {
      label: 'HTTP response headers',
      code: `Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; img-src 'self' https:; frame-ancestors 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks for Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, clickjacking protection and Referrer-Policy, reported once per site.',
      href: '/docs/audit-checks',
      label: 'See the security checks',
    },
    related: ['hsts', 'https', 'mixed-content', 'hacked-content', 'technical-seo'],
    faqs: [
      {
        question: 'Do security headers affect SEO?',
        answer: [
          'Not directly; Google does not rank on them. They reduce the risk of the site being hacked and filled with spam, which can cause warnings, manual actions and lost traffic.',
        ],
      },
      {
        question: 'Can a Content-Security-Policy break my site?',
        answer: [
          'Yes. A strict CSP blocks any script or style not allowed by the policy, including analytics and embeds. Test it in report-only mode first.',
        ],
      },
    ],
  },
  {
    slug: 'hreflang',
    term: 'Hreflang',
    aka: ['hreflang tag', 'rel="alternate" hreflang', 'hreflang attribute'],
    category: 'technical',
    short: 'Hreflang is an annotation that tells search engines which language or regional version of a page to show to which searchers.',
    definition: [
      'Hreflang is an annotation, `rel="alternate" hreflang="…"`, that tells search engines which pages are language or regional versions of each other, so they can show searchers the version in their language or for their country. For example, it tells Google to show your en-gb page in the UK and your en-us page in the US.',
      'Each value is a language code in ISO 639-1 format (en, de, fr), optionally followed by a region code in ISO 3166-1 Alpha 2 format (en-gb, en-us, de-at). A region on its own is not valid: you cannot target "gb" without a language. The special value `x-default` marks the fallback page for users who match none of your versions, often a language selector or your main international page.',
      'You can declare hreflang in three ways, and should pick one: `<link>` elements in each page’s HTML head, `Link` HTTP headers (useful for PDFs), or `<xhtml:link>` entries in your [XML sitemap](/glossary/xml-sitemap), which is easiest to maintain for big sites.',
      'Two rules trip most sites up. First, annotations must be reciprocal: if page A lists page B as an alternate, page B must list page A. Without the return link, Google may ignore the pair. Second, each page should list every version in its set, including itself.',
      'Hreflang is a signal, not a directive, and it does not merge pages or pass ranking signals between them. Each language version still needs to be indexable and to stand on its own. Google does not use the HTML `lang` attribute to pick language versions; it relies on hreflang and the content itself.',
    ],
    why: [
      'Without hreflang, Google may rank the wrong version: your US page in the UK with dollar prices, or the English page for German searchers. Visitors bounce and conversion suffers. Hreflang is the core tool of [international SEO](/glossary/international-seo).',
      'It also handles near-duplicates. Pages for the UK, US and Australia are often almost identical. Hreflang tells Google they are deliberate regional versions, so it shows the right one rather than picking one and filtering the others.',
      'It is easy to get wrong at scale. Invalid codes such as en-uk (the correct region code is gb), missing return links, alternates pointing at redirects or 404s, and canonicals that point all versions to one URL are the common errors. Any of them can make Google ignore the annotations.',
    ],
    how: {
      heading: 'How to implement hreflang',
      steps: [
        'List every language and regional version of each page and the URL of each one.',
        'Choose one method: HTML link elements, HTTP headers or the XML sitemap. Mixing methods makes errors more likely.',
        'On every version, list all versions in the set, including the page itself, with absolute URLs.',
        'Use valid codes: language first (ISO 639-1), then optionally a region (ISO 3166-1 Alpha 2), such as en-gb, pt-br or es. Don’t invent codes like en-uk or eu.',
        'Add an `x-default` entry for the fallback page.',
        'Give each version a self-referencing [canonical tag](/glossary/canonical-tag). Don’t point the canonical of the French page at the English one, or Google will drop the French page.',
        'Make sure every URL in an hreflang set returns 200, is indexable and is not redirected.',
        'Validate with a crawler that checks return links, and watch the international and indexing reports in Search Console after launch.',
      ],
    },
    example: {
      label: 'HTML and sitemap',
      code: `<!-- In the <head> of every version, including this one -->
<link rel="alternate" hreflang="en-gb" href="https://www.example.com/uk/" />
<link rel="alternate" hreflang="en-us" href="https://www.example.com/us/" />
<link rel="alternate" hreflang="de" href="https://www.example.com/de/" />
<link rel="alternate" hreflang="x-default" href="https://www.example.com/" />

<!-- The same set in an XML sitemap (repeat for each URL) -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.example.com/uk/</loc>
    <xhtml:link rel="alternate" hreflang="en-gb" href="https://www.example.com/uk/" />
    <xhtml:link rel="alternate" hreflang="en-us" href="https://www.example.com/us/" />
    <xhtml:link rel="alternate" hreflang="de" href="https://www.example.com/de/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.example.com/" />
  </url>
</urlset>`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks hreflang on every page: invalid language or region codes, missing return links, missing self-references and alternates that point to non-200 URLs.',
      href: '/docs/audit-checks',
      label: 'See the hreflang checks',
    },
    related: ['international-seo', 'lang-attribute', 'canonical-tag', 'xml-sitemap', 'duplicate-content', 'indexing'],
    faqs: [
      {
        question: 'Is hreflang a ranking factor?',
        answer: [
          'No. Hreflang does not make a page rank higher. It helps Google swap in the right language or regional version of a page that already ranks.',
        ],
      },
      {
        question: 'Is it en-uk or en-gb?',
        answer: [
          'en-gb. Region codes follow ISO 3166-1 Alpha 2, and the code for the United Kingdom is GB. en-uk is invalid and will be ignored.',
        ],
      },
      {
        question: 'What does x-default mean in hreflang?',
        answer: [
          '`x-default` marks the page to show when none of your language or region versions matches the searcher, such as a language selector or your global homepage.',
        ],
      },
      {
        question: 'Do I need hreflang if my site is in one language?',
        answer: [
          'No. Hreflang is only for sites with versions of the same page in different languages or for different regions.',
        ],
      },
    ],
  },
  {
    slug: 'structured-data',
    term: 'Structured data',
    aka: ['structured data markup', 'semantic markup'],
    category: 'technical',
    short: 'Structured data is code in a standard format that describes a page’s content to search engines, making it eligible for rich results.',
    definition: [
      'Structured data is code added to a page in a standard format that describes its content in a way machines can read: this is a product with this price, this is an article by this author. Search engines use it to understand content and to show [rich results](/glossary/rich-results) such as review stars and product prices.',
      'Most structured data on the web uses the [schema.org](/glossary/schema-markup) vocabulary, which defines types (Product, Article, Recipe, Event, Organization, LocalBusiness, BreadcrumbList) and their properties (name, price, author, datePublished). Google, Bing and other engines all read it.',
      'The vocabulary can be written in three formats: [JSON-LD](/glossary/json-ld), a block of JSON in a script tag; Microdata, attributes added to existing HTML elements; and RDFa, a similar attribute-based syntax. Google supports all three and recommends JSON-LD because it is the easiest to add and maintain without touching the visible HTML.',
      'Structured data must describe what is actually on the page. Marking up reviews that are not shown, prices that differ from the visible price, or content hidden from users breaks Google’s structured data guidelines, and [structured data spam](/glossary/structured-data-spam) can earn a manual action that removes rich results.',
      'Google lists which types it supports for rich results, with required and recommended properties for each, in its Search Gallery. That list changes. Google has retired several types over the years, such as HowTo results in 2023, and the same year limited FAQ rich results to a small set of well-known government and health sites. Check the current documentation before you invest in a type.',
    ],
    why: [
      'Structured data is not a direct ranking factor. Google has said so repeatedly. What it does is make pages eligible for rich results, which take up more space and can lift click-through rate. Eligibility is not a guarantee; Google decides when to show them.',
      'It also helps search engines understand entities: who the organisation is, which product a page sells, who wrote an article. That understanding feeds features such as the knowledge panel and helps machines, including AI systems that read the web, interpret your pages accurately.',
      'For ecommerce, Product markup with offers is what feeds price, availability and review stars in results and in Google’s shopping surfaces. For local businesses, [LocalBusiness schema](/glossary/local-business-schema) supports what Google knows from your Business Profile.',
    ],
    how: {
      heading: 'How to add structured data',
      steps: [
        'Pick the types that match your pages and that Google supports: Product for product pages, Article for news and blog posts, BreadcrumbList for breadcrumbs, Organization for your homepage, LocalBusiness for location pages, Event, Recipe, JobPosting and so on.',
        'Read Google’s documentation for each type and note the required and recommended properties.',
        'Write the markup in JSON-LD and add it to the page’s HTML, ideally from your templates so it updates with the content. Google can also read JSON-LD that is injected with JavaScript, but server-rendered markup is more reliable.',
        'Mark up only content that is visible on the page, and keep the values identical to what users see.',
        'Test each template in Google’s Rich Results Test, which shows which rich results the page is eligible for and any errors. Use the Schema Markup Validator (validator.schema.org) to check general schema.org validity.',
        'After launch, watch the rich result reports in Google Search Console for errors and warnings across the whole site.',
      ],
    },
    example: {
      label: 'JSON-LD (Article)',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to write a robots.txt file",
  "datePublished": "2026-09-14T09:00:00+01:00",
  "dateModified": "2026-10-01T10:30:00+01:00",
  "image": ["https://www.example.com/images/robots-txt-guide.png"],
  "author": {
    "@type": "Person",
    "name": "Jane Doe",
    "url": "https://www.example.com/authors/jane-doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example",
    "logo": "https://www.example.com/logo.png"
  }
}
</script>`,
    },
    openseo: {
      body: 'The OpenSEO site audit parses the JSON-LD on every page and flags invalid JSON, blocks without an @type and markup missing the properties Google requires.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['schema-markup', 'json-ld', 'rich-results', 'rich-snippets', 'structured-data-spam', 'entity', 'knowledge-graph'],
    faqs: [
      {
        question: 'Is structured data a ranking factor?',
        answer: [
          'No. Google has said structured data does not directly improve rankings. It makes pages eligible for rich results and helps Google understand them, which can improve click-through rate.',
        ],
      },
      {
        question: 'What is the difference between structured data and schema markup?',
        answer: [
          'Structured data is the general idea of describing content in a machine-readable format. Schema markup is structured data that uses the schema.org vocabulary, which is what nearly every site uses.',
        ],
      },
      {
        question: 'Why is my structured data not showing rich results?',
        answer: [
          'Valid markup only makes a page eligible. Google may not show rich results because of query type, page quality, missing required properties, or because the type is restricted or no longer supported. Check the Rich Results Test and Search Console reports.',
        ],
      },
      {
        question: 'How do I test structured data?',
        answer: [
          'Use Google’s Rich Results Test for Google eligibility and the Schema Markup Validator at validator.schema.org for general schema.org validity. Search Console’s enhancement reports show issues site-wide.',
        ],
      },
    ],
  },
  {
    slug: 'schema-markup',
    term: 'Schema markup',
    aka: ['schema.org', 'schema', 'schema.org markup'],
    category: 'technical',
    short: 'Schema markup is structured data that uses the schema.org vocabulary to describe things on a page, such as products, articles and businesses.',
    definition: [
      'Schema markup is [structured data](/glossary/structured-data) that uses the schema.org vocabulary to describe the things on a page, such as a product, an article, a recipe, an event or a local business, in a form search engines can read. It is usually written as JSON-LD. Google, Microsoft (Bing) and Yahoo launched schema.org in 2011, and Yandex joined later that year.',
      'Schema.org is organised as types with properties. Types form a hierarchy: LocalBusiness is a kind of Organization, which is a kind of Thing. Properties can hold text, numbers, dates or other types, so a Product has an `offers` property holding an Offer, which has its own `price` and `priceCurrency`.',
      'Schema.org defines hundreds of types, but Google only uses a subset for rich results, each with its own required properties. Markup outside that subset is still valid and can help search engines understand the page; it just will not produce a special result in Google.',
    ],
    why: [
      'Schema markup is how pages qualify for [rich results](/glossary/rich-results), such as product prices and availability, review stars, event dates and breadcrumbs in place of the URL. Those results stand out on the [SERP](/glossary/serp) and can earn more clicks.',
      'It also makes entities explicit. Organization markup with `sameAs` links to your official profiles, and author markup with a profile URL, help search engines connect your pages to the right business and people.',
    ],
    how: {
      heading: 'How to add schema markup',
      steps: [
        'Choose the most specific type that fits: Product, not Thing; Restaurant, not just LocalBusiness.',
        'Fill in Google’s required properties for that type, then as many recommended ones as you can support accurately.',
        'Write it as JSON-LD in a `<script type="application/ld+json">` block, generated from the same data that renders the page.',
        'Keep it truthful: every value must match what users see on the page. Fake or hidden review markup is [structured data spam](/glossary/structured-data-spam).',
        'Test in the Rich Results Test, then monitor the enhancement reports in Search Console.',
      ],
    },
    example: {
      label: 'JSON-LD (Product)',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail running shoe",
  "image": "https://www.example.com/images/trail-shoe.jpg",
  "description": "Lightweight trail shoe with a grippy outsole.",
  "sku": "TRS-042",
  "brand": { "@type": "Brand", "name": "Example" },
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.com/shoes/trail-running-shoe",
    "price": "89.99",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
    },
    openseo: {
      body: 'The OpenSEO site audit checks schema markup in JSON-LD on every page and reports invalid JSON, missing @type and missing required properties.',
      href: '/docs/audit-checks',
      label: 'See the structured data checks',
    },
    related: ['structured-data', 'json-ld', 'rich-results', 'rich-snippets', 'local-business-schema', 'breadcrumbs', 'entity'],
    faqs: [
      {
        question: 'Does schema markup help SEO?',
        answer: [
          'It does not raise rankings directly, but it makes pages eligible for rich results, which can improve click-through rate, and it helps search engines understand your content.',
        ],
      },
      {
        question: 'Which schema types should I use?',
        answer: [
          'Use the types that match your content and that Google supports in its Search Gallery: often Organization, BreadcrumbList, Article, Product and LocalBusiness. Don’t add types that do not describe what is on the page.',
        ],
      },
    ],
  },
  {
    slug: 'json-ld',
    term: 'JSON-LD',
    aka: ['JavaScript Object Notation for Linked Data', 'application/ld+json'],
    category: 'technical',
    short: 'JSON-LD is a JSON-based format for structured data, placed in a script tag. It is the format Google recommends for schema markup.',
    definition: [
      'JSON-LD (JavaScript Object Notation for Linked Data) is a format for writing structured data as a block of JSON inside a `<script type="application/ld+json">` tag. It is the format Google recommends for [schema markup](/glossary/schema-markup) because it sits apart from the visible HTML, so you can add, generate and update it without changing your page layout.',
      'A JSON-LD block starts with `@context`, normally `https://schema.org`, and an `@type`, such as Product or Organization, followed by that type’s properties. Nested objects describe related things. `@id` gives a node a stable identifier so other blocks can refer to it, and `@graph` lets you put several connected nodes in one block.',
      'The script can go in the `<head>` or the `<body>`, and a page can have more than one block. Google can also read JSON-LD that JavaScript adds to the page after it loads, though markup in the server-rendered HTML is safer for every crawler.',
    ],
    why: [
      'JSON-LD is the simplest way to make pages eligible for [rich results](/glossary/rich-results). Because it lives in one block, developers can build it from the same data that renders the page, which keeps it accurate, and SEOs can review it without picking through HTML attributes as with Microdata or RDFa.',
      'It is also strict. A single missing comma or stray quote makes the whole block invalid JSON, and search engines ignore it. Template changes that break JSON-LD are a common silent cause of lost rich results.',
    ],
    how: {
      heading: 'How to write JSON-LD',
      steps: [
        'Start from Google’s documentation for the type you need, and copy its required properties.',
        'Generate the JSON in code from your page data rather than writing strings by hand, so values are escaped correctly and stay in sync.',
        'Use absolute URLs, ISO 8601 dates (2026-10-01T09:00:00+01:00) and full schema.org enum URLs such as `https://schema.org/InStock`.',
        'Place the script in the page’s HTML, one block per entity or one `@graph` block for several.',
        'Validate with the Rich Results Test or the Schema Markup Validator after every template change.',
      ],
    },
    example: {
      label: 'JSON-LD (Organization)',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.example.com/#organization",
  "name": "Example Ltd",
  "url": "https://www.example.com/",
  "logo": "https://www.example.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://github.com/example"
  ]
}
</script>`,
    },
    openseo: {
      body: 'The OpenSEO site audit parses every JSON-LD block it finds and flags invalid JSON, blocks without an @type and markup missing required properties.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['structured-data', 'schema-markup', 'rich-results', 'javascript-seo', 'entity', 'structured-data-spam'],
    faqs: [
      {
        question: 'Is JSON-LD better than Microdata?',
        answer: [
          'For most sites, yes. Google supports both but recommends JSON-LD because it is separate from the HTML and easier to maintain. Search engines treat valid markup in either format the same.',
        ],
      },
      {
        question: 'Where should JSON-LD go, head or body?',
        answer: [
          'Either works. Google reads JSON-LD in the head or the body, and a page can have several blocks.',
        ],
      },
      {
        question: 'Can JSON-LD be added with JavaScript or Google Tag Manager?',
        answer: [
          'Google can read JSON-LD injected with JavaScript once it renders the page, but server-rendered markup is more reliable and works for crawlers that do not run JavaScript.',
        ],
      },
    ],
  },
];
