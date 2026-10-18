import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'rich-results',
    term: 'Rich results',
    aka: ['rich result', 'enhanced results'],
    category: 'technical',
    short: 'Rich results are Google search results with extra visual features, such as star ratings, prices or event dates, usually powered by structured data.',
    definition: [
      'Rich results are search results that show more than the standard blue link, URL and snippet. They add visual features such as review stars, prices, stock status, recipe cook times, event dates or breadcrumbs. Google builds most of them from [structured data](/glossary/structured-data) that a page adds to its HTML.',
      'Each rich result type has its own documentation and its own required and recommended properties. Common types include Product, Review snippet, Recipe, Event, Video, Breadcrumb, Article, Organization, Job posting and Local business. A page that marks up a product with a price and an aggregate rating, for example, can become eligible for a result that shows both under the title.',
      'Eligibility is not a guarantee. Google decides per query whether to show a rich result, and it can ignore markup it thinks is misleading or low quality. Google also changes which types it supports: in 2023 it limited FAQ rich results to well-known, authoritative government and health sites and stopped showing HowTo rich results, and it has retired other little-used types since. Always check the current documentation before you build markup for a type.',
      'You will also hear the older term [rich snippets](/glossary/rich-snippets). People often use the two interchangeably; Google’s own documentation now says rich results.',
    ],
    why: [
      'A rich result takes up more space and gives searchers information before they click, which can make your listing stand out against plain results on the same page. For product, recipe and event searches, the result without stars, prices or dates can look incomplete next to competitors that have them.',
      'Rich results also show that Google has parsed your page correctly. If your markup is broken, Search Console lists the errors in its enhancement reports, which is often the first sign that a template change has stripped something important.',
    ],
    how: {
      heading: 'How to get rich results',
      steps: [
        'Check Google’s search gallery for the rich result types that match your content, and read the required properties for each.',
        'Add the markup in [JSON-LD](/glossary/json-ld), which Google recommends, and describe only content that is visible on the page.',
        'Test the URL in Google’s Rich Results Test to confirm the page is eligible and the required properties are present.',
        'Publish, then watch the enhancement reports in Search Console for errors and warnings across all pages that use the template.',
        'Be patient and keep the markup honest. Google may take time to show a rich result, and marking up hidden or false content breaks its structured data policies.',
      ],
    },
    example: {
      label: 'JSON-LD for a product rich result',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Trail running shoe",\n  "image": "https://example.com/shoe.jpg",\n  "offers": {\n    "@type": "Offer",\n    "price": "89.00",\n    "priceCurrency": "GBP",\n    "availability": "https://schema.org/InStock"\n  },\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": "4.6",\n    "reviewCount": "128"\n  }\n}\n</script>',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags invalid JSON-LD, structured data without an @type and markup missing required properties, and the SERP checker shows which SERP features appear for a keyword.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['structured-data', 'schema-markup', 'json-ld', 'rich-snippets', 'serp-features', 'structured-data-spam'],
    faqs: [
      {
        question: 'Does structured data guarantee rich results?',
        answer: ['No. Valid markup makes a page eligible, but Google decides whether to show a rich result for each search. Quality, relevance and policy compliance all play a part.'],
      },
      {
        question: 'Are rich results a ranking factor?',
        answer: ['Google says structured data is not a general ranking factor. Rich results can raise click-through rate because they make a listing more noticeable, but they do not move the page up on their own.'],
      },
      {
        question: 'How do I test for rich results?',
        answer: ['Use Google’s Rich Results Test on a URL or a code snippet. After you publish, the enhancement reports in Google Search Console show valid items and errors across the site.'],
      },
    ],
  },
  {
    slug: 'javascript-seo',
    term: 'JavaScript SEO',
    aka: ['JS SEO'],
    category: 'technical',
    short: 'JavaScript SEO is the work of making sure search engines can crawl, render and index content and links that a site builds with JavaScript.',
    definition: [
      'JavaScript SEO is the part of [technical SEO](/glossary/technical-seo) that makes sure search engines can find, render and index pages built with JavaScript. It covers how content, links and metadata get into the page, whether bots can see them without interaction, and how frameworks such as React, Vue, Angular, Next.js and Nuxt deliver HTML.',
      'A plain HTML page holds its content in the response the server sends. A JavaScript-heavy page may send an almost empty HTML shell and build the content in the browser. For a person in a modern browser the result looks the same. For a crawler it is not: the content only exists after the crawler downloads the scripts, runs them and waits for any API calls they make.',
      'Google handles this in stages. Googlebot crawls the URL and reads the raw HTML. Pages then go into a queue for [rendering](/glossary/rendering), where Google’s Web Rendering Service runs the page in an evergreen version of Chromium. Only after rendering can Google see content and links that JavaScript added. Google’s documentation says most pages are rendered quickly, but rendering still costs resources, and anything that fails during it, such as a blocked script, a timed-out API call or an error, can leave Google with a blank page.',
      'Other crawlers are less capable. Many AI crawlers and some smaller search engines fetch the HTML and do not run JavaScript at all, so content that only appears after scripts run can be invisible to them. Social platforms that build link previews from [Open Graph tags](/glossary/open-graph) usually read the raw HTML too.',
      'The common problems are predictable. Links built as click handlers on buttons or spans instead of real <a href> elements, which Google does not follow. Content that only loads after a click, a scroll or a tab change. Titles, canonicals and meta robots tags that differ between the raw HTML and the rendered page. Single-page apps that return a 200 status for every route, including ones that should be 404, which produces [soft 404s](/glossary/soft-404). URLs that use # fragments for different views, which Google treats as the same page. And JavaScript or CSS files blocked in robots.txt, which stops Google rendering the page properly.',
    ],
    why: [
      'If Google cannot render a page, it cannot index what is on it. A product page whose description and price arrive through a failed API call is, as far as search is concerned, a page with no description and no price. Internal links that only exist after JavaScript runs slow down discovery, because Google cannot follow them until the page has been rendered.',
      'Search is also no longer one crawler. AI assistants and answer engines pull from the web through their own fetchers, and many of them read only raw HTML. A site that serves real content in the initial HTML is visible to all of them; a site that relies on client-side rendering is visible to fewer.',
      'Finally, JavaScript affects speed. Large bundles delay rendering and interaction, which shows up in [Core Web Vitals](/glossary/core-web-vitals), especially LCP and INP.',
    ],
    how: {
      heading: 'How to audit JavaScript SEO',
      steps: [
        'Compare the raw HTML with the rendered page. View the source (not the DevTools Elements panel) and check whether the main content, title, meta description, canonical and links are there before JavaScript runs.',
        'Use the URL Inspection tool in Search Console and open “View crawled page” to see the HTML Google rendered and any resources it could not load.',
        'Check that every link you want crawled is an <a> element with an href attribute that holds a real URL, not a # or javascript: value.',
        'Make sure each view has its own URL using the History API, not a # fragment, and that missing routes return a real 404 status or a noindex tag.',
        'Do not block the JavaScript, CSS or API endpoints the page needs in robots.txt.',
        'Keep critical tags consistent. If the raw HTML says noindex and JavaScript removes it, Google may never render the page to see the change.',
        'For important templates, prefer [server-side rendering](/glossary/server-side-rendering) or static generation so the content is in the first response. Google no longer recommends dynamic rendering (serving bots a separate pre-rendered version) as a long-term fix.',
        'Crawl the site with a crawler that can run in both modes and compare the results: pages whose word count or link count jumps after rendering depend on JavaScript.',
      ],
    },
    example: {
      label: 'A link Google can follow, and one it cannot',
      code: '<!-- Crawlable: a real URL in an href -->\n<a href="/shoes/trail">Trail shoes</a>\n\n<!-- Not crawlable: no href, navigation happens in a script -->\n<span onclick="goTo(\'/shoes/trail\')">Trail shoes</span>',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages whose HTML is an empty app shell, so you can see which templates depend on JavaScript to show their content.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['rendering', 'server-side-rendering', 'client-side-rendering', 'googlebot', 'crawling', 'lazy-loading', 'ai-crawlers', 'soft-404'],
    faqs: [
      {
        question: 'Can Google crawl JavaScript?',
        answer: ['Yes. Googlebot renders pages with an up-to-date version of Chromium, so it can see content JavaScript adds. It does not click, type or scroll like a person, and anything that fails during rendering is lost.'],
      },
      {
        question: 'Is JavaScript bad for SEO?',
        answer: ['No, but it adds steps that can go wrong. Sites that put their main content and links in the server’s HTML response avoid most of the risk, whichever framework they use.'],
      },
      {
        question: 'Do AI crawlers render JavaScript?',
        answer: ['Many do not. They fetch the HTML and read what is there, so content that only appears after scripts run may never reach AI assistants. Server-side rendering or static generation solves this.'],
      },
      {
        question: 'Is dynamic rendering still recommended?',
        answer: ['No. Google describes dynamic rendering as a workaround rather than a long-term solution and recommends server-side rendering, static rendering or hydration instead.'],
      },
    ],
  },
  {
    slug: 'server-side-rendering',
    term: 'Server-side rendering (SSR)',
    aka: ['SSR', 'server rendering'],
    category: 'technical',
    short: 'Server-side rendering (SSR) builds a page’s full HTML on the server for each request, so browsers and crawlers get the content in the first response.',
    definition: [
      'Server-side rendering (SSR) is a way of building web pages where the server produces the complete HTML for each request and sends it to the browser. The content, links and metadata are in the first response, so a browser can show the page straight away and a crawler can read it without running JavaScript.',
      'Most modern JavaScript frameworks support SSR. Next.js, Nuxt, SvelteKit, Remix and Angular can all render components on the server, then send JavaScript that “hydrates” the page in the browser so it becomes interactive. Traditional server-rendered stacks such as WordPress, Rails, Django or Laravel have always worked this way.',
      'SSR sits alongside related approaches. Static site generation (SSG) renders pages once at build time and serves the same HTML to everyone, which is fast and cheap but needs a rebuild when content changes. Incremental or on-demand regeneration mixes the two. [Client-side rendering](/glossary/client-side-rendering) is the opposite: the server sends a shell and the browser builds the page.',
    ],
    why: [
      'SSR removes the biggest risk in [JavaScript SEO](/glossary/javascript-seo). Google does not have to wait for its rendering step to see your content, and crawlers that never run JavaScript, including many [AI crawlers](/glossary/ai-crawlers), still see the full page.',
      'It usually helps speed too. Because the HTML arrives complete, the browser can paint the main content sooner, which tends to improve [Largest Contentful Paint](/glossary/largest-contentful-paint). The trade-off is server work: rendering on every request can raise [time to first byte](/glossary/time-to-first-byte) if the server is slow or the page waits on slow data, so caching matters.',
    ],
    how: {
      heading: 'How to check if a page is server-rendered',
      steps: [
        'Open the page and view the source (Ctrl+U or Cmd+Option+U). If you can read the main text, headings and links in the source, the page is server-rendered or statically generated.',
        'Fetch the URL without JavaScript, for example with curl or by turning JavaScript off in the browser, and see what is left.',
        'Check that the title, meta description, canonical and robots tags are in the source and match what the rendered page shows.',
        'If the server is slow, cache rendered pages at the server or on a CDN, or move pages that rarely change to static generation.',
      ],
    },
    example: {
      label: 'What the server sends with SSR',
      code: '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Trail running shoes | Example</title>\n    <link rel="canonical" href="https://example.com/shoes/trail">\n  </head>\n  <body>\n    <h1>Trail running shoes</h1>\n    <p>Grippy, light shoes for muddy and rocky paths.</p>\n    <a href="/shoes/trail/waterproof">Waterproof trail shoes</a>\n    <script src="/app.js" defer></script>\n  </body>\n</html>',
    },
    openseo: {
      body: 'OpenSEO’s site audit reads the HTML your server returns and flags pages that arrive as an empty app shell.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['client-side-rendering', 'javascript-seo', 'rendering', 'time-to-first-byte', 'largest-contentful-paint'],
    faqs: [
      {
        question: 'Is SSR better than CSR for SEO?',
        answer: ['For pages you want indexed, usually yes. SSR puts content in the first response, so every crawler can read it, while CSR depends on the crawler running JavaScript successfully.'],
      },
      {
        question: 'What is the difference between SSR and static site generation?',
        answer: ['SSR renders HTML on each request. Static site generation renders it once at build time and serves the same file to everyone. Both deliver full HTML to crawlers.'],
      },
    ],
  },
  {
    slug: 'client-side-rendering',
    term: 'Client-side rendering (CSR)',
    aka: ['CSR', 'single-page app rendering'],
    category: 'technical',
    short: 'Client-side rendering (CSR) sends a near-empty HTML page and builds the content in the browser with JavaScript, which crawlers must run to see it.',
    definition: [
      'Client-side rendering (CSR) is a way of building web pages where the server sends a minimal HTML shell and JavaScript, and the browser then fetches data and builds the page itself. Single-page applications made with React, Vue or Angular without a server-rendering layer work this way.',
      'CSR makes moving between views feel fast once the app has loaded, because the browser swaps content in place instead of loading a new document. The cost comes on the first load: the browser must download, parse and run the JavaScript, and often call an API, before anything useful appears.',
      'For search, the important point is that the first HTML response holds little or no content. A crawler only sees the page after [rendering](/glossary/rendering) it, which Google does in a separate step and many other crawlers do not do at all.',
    ],
    why: [
      'Google can index client-rendered pages, but each one depends on rendering working: scripts must load, APIs must respond in time and nothing must error. When it fails, Google indexes a blank or partial page. Links that only exist after rendering are found later than links in the HTML.',
      'Crawlers that do not run JavaScript, including many [AI crawlers](/glossary/ai-crawlers) and link-preview bots, see only the shell. CSR also tends to delay [Largest Contentful Paint](/glossary/largest-contentful-paint), because the main content cannot paint until the JavaScript has run.',
      'CSR is a fine choice for logged-in dashboards, account areas and tools that do not need to rank. For public pages that should rank, [server-side rendering](/glossary/server-side-rendering) or static generation is safer.',
    ],
    how: {
      heading: 'How to make client-rendered pages indexable',
      steps: [
        'Move public, rankable pages to server-side rendering or static generation where your framework allows it.',
        'If you must keep CSR, put the title, meta description and canonical in the initial HTML, and render real <a href> links.',
        'Give every view its own URL with the History API, and return a 404 status, or add a noindex tag, for routes that do not exist.',
        'Do not block JavaScript, CSS or API endpoints in robots.txt.',
        'Check the rendered HTML with the URL Inspection tool in Search Console to confirm Google sees the content.',
      ],
    },
    example: {
      label: 'What the server sends with CSR',
      code: '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Example</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script src="/bundle.js"></script>\n  </body>\n</html>',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages that arrive as an empty app shell like this one, so you know where content depends on JavaScript.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['server-side-rendering', 'javascript-seo', 'rendering', 'ai-crawlers', 'googlebot'],
    faqs: [
      {
        question: 'Can Google index client-side rendered pages?',
        answer: ['Yes, Google renders JavaScript and can index CSR pages. It is less reliable than server rendering, because anything that fails during rendering means Google sees less content.'],
      },
      {
        question: 'How do I know if my site uses client-side rendering?',
        answer: ['View the page source. If the body is mostly an empty container such as <div id="root"></div> and script tags, the content is rendered in the browser.'],
      },
    ],
  },
  {
    slug: 'mobile-first-indexing',
    term: 'Mobile-first indexing',
    aka: ['mobile first indexing', 'mobile-first index'],
    category: 'technical',
    short: 'Mobile-first indexing means Google crawls and indexes the mobile version of your pages and uses it for ranking, on mobile and desktop alike.',
    definition: [
      'Mobile-first indexing means Google uses the mobile version of a page’s content, crawled with its smartphone crawler, for [indexing](/glossary/indexing) and ranking. Whatever is on your mobile page is what Google knows about, for searches on phones and on desktop computers.',
      'Google started moving sites to mobile-first indexing in 2018 and announced the move complete in 2023. Since July 2024 it crawls and indexes all sites with Googlebot Smartphone. A site that does not work on mobile devices can no longer be indexed properly.',
      'There is no separate mobile index. The name describes which version of a page Google reads first. For a responsive site, which serves the same HTML to every device, nothing changes. For sites with a separate mobile site (m.example.com) or dynamic serving that sends different HTML to phones, the mobile version must hold the same content, links, structured data and metadata as the desktop version.',
    ],
    why: [
      'Content that only appears on desktop does not exist for Google. If your mobile template drops product descriptions, reviews, internal links or [structured data](/glossary/structured-data) to save space, Google indexes and ranks the slimmer page.',
      'Blocking resources for the mobile crawler, lazy-loading content that only appears on interaction, or serving a broken mobile layout all hurt. A correct [viewport meta tag](/glossary/viewport-meta-tag) and a responsive design are the simplest way to avoid the problem.',
    ],
    how: {
      heading: 'How to prepare for mobile-first indexing',
      steps: [
        'Use responsive design so every device gets the same HTML, and add a viewport meta tag.',
        'If you have a separate mobile site, make sure it has the same main content, headings, internal links, images with alt text, structured data, titles and meta descriptions as desktop.',
        'Keep meta robots tags the same on both versions. A noindex on the mobile page applies to the page in Google’s index.',
        'Do not hide important content behind interactions that Googlebot will not perform; content in tabs or accordions is fine if it is in the HTML.',
        'Check pages with the URL Inspection tool in Search Console, which shows what Googlebot Smartphone fetched.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages without a viewport meta tag and runs Lighthouse on mobile as well as desktop.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['viewport-meta-tag', 'googlebot', 'indexing', 'page-speed', 'lighthouse'],
    faqs: [
      {
        question: 'Is mobile-first indexing complete?',
        answer: ['Yes. Google announced the move complete in 2023, and since July 2024 it crawls and indexes all sites with its smartphone crawler.'],
      },
      {
        question: 'Does mobile-first indexing mean desktop rankings do not matter?',
        answer: ['No. Desktop searches still happen and are ranked separately, but the content Google uses for both comes from the mobile version of your page.'],
      },
      {
        question: 'Is hidden content in tabs indexed on mobile?',
        answer: ['Yes, as long as it is in the HTML. Google has said content in tabs and accordions on mobile is treated normally. Content that only loads after a tap is a different matter.'],
      },
    ],
  },
  {
    slug: 'viewport-meta-tag',
    term: 'Viewport meta tag',
    aka: ['meta viewport', 'viewport tag'],
    category: 'technical',
    short: 'The viewport meta tag tells mobile browsers how to size and scale a page. Without it, phones show a shrunken desktop layout.',
    definition: [
      'The viewport meta tag is an HTML tag in the head of a page that tells mobile browsers how wide the layout should be and how to scale it. The standard value, width=device-width, initial-scale=1, makes the page as wide as the screen and starts it at normal zoom, so responsive CSS works.',
      'Without the tag, most mobile browsers assume the page was built for a desktop and render it on a virtual canvas around 980 pixels wide, then shrink it to fit. Text becomes tiny, tap targets crowd together and people have to pinch and zoom. Your responsive CSS media queries also stop working as intended, which undermines [page speed](/glossary/page-speed) work and mobile layouts alike, because the browser reports the wide virtual width instead of the real screen width.',
    ],
    why: [
      'Google uses the mobile version of pages for indexing and ranking ([mobile-first indexing](/glossary/mobile-first-indexing)), and a page that is not usable on a phone gives searchers a poor experience. Lighthouse checks for the tag in its SEO and best practices audits.',
      'Avoid user-scalable=no and low maximum-scale values. Blocking zoom stops people with low vision from enlarging text, and accessibility checks flag it.',
    ],
    how: {
      heading: 'How to add a viewport meta tag',
      steps: [
        'Add the tag once inside the <head> of every page template.',
        'Use width=device-width, initial-scale=1 unless you have a specific reason not to.',
        'Do not disable zoom with user-scalable=no or maximum-scale=1.',
        'Test the page on a real phone or in your browser’s device mode to check that text is readable without zooming.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags every crawled page that is missing a viewport meta tag.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['mobile-first-indexing', 'lighthouse', 'page-speed', 'technical-seo'],
    faqs: [
      {
        question: 'Is the viewport meta tag needed for SEO?',
        answer: ['It is needed for a usable mobile page, and Google indexes the mobile version of your site. It is not a ranking factor on its own, but a page without it gives mobile searchers a poor experience.'],
      },
      {
        question: 'Should I use user-scalable=no?',
        answer: ['No. It stops people zooming in, which harms accessibility. Modern browsers handle tap delays without it.'],
      },
    ],
  },
  {
    slug: 'lang-attribute',
    term: 'Lang attribute',
    aka: ['html lang', 'language attribute'],
    category: 'technical',
    short: 'The lang attribute declares the language of a page’s content, usually on the <html> element, for browsers, screen readers and translation tools.',
    definition: [
      'The lang attribute is an HTML attribute that declares the human language of an element’s content, set on the <html> element to cover the whole page. Its value is a language code such as en, fr or de, optionally followed by a region, as in en-GB or pt-BR.',
      'You can also set lang on a smaller element when part of a page is in a different language, for example a quotation in French on an English page. The codes follow the BCP 47 standard, the same family of codes used in [hreflang](/glossary/hreflang).',
    ],
    why: [
      'Screen readers use the lang attribute to choose the right pronunciation, so a missing or wrong value makes a page hard to follow for blind and partially sighted visitors. Browsers use it to offer translation, pick hyphenation rules and choose fonts, and accessibility checks such as Lighthouse flag a missing lang.',
      'Google has said it works out a page’s language from its visible content and does not rely on the lang attribute. That does not make the attribute pointless for SEO: other search engines and tools may use it, and it is part of a clean, accessible page. For targeting languages and regions in Google, use hreflang and separate URLs per language, as described in [international SEO](/glossary/international-seo).',
    ],
    how: {
      heading: 'How to set the lang attribute',
      steps: [
        'Add lang to the <html> element of every template, matching the main language of the content.',
        'Add a region subtag only when it is meaningful, such as en-GB versus en-US.',
        'On multilingual sites, make sure each language version sets its own value rather than inheriting the default.',
        'Mark passages in another language with lang on the containing element.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<html lang="en-GB">\n  ...\n  <blockquote lang="fr">Je pense, donc je suis.</blockquote>\n</html>',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages whose <html> element has no lang attribute.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['hreflang', 'international-seo', 'technical-seo', 'lighthouse'],
    faqs: [
      {
        question: 'Does Google use the lang attribute?',
        answer: ['Google has said it detects a page’s language from the visible content and does not use code-level language information such as the lang attribute. Use hreflang to point Google at language versions.'],
      },
      {
        question: 'What is the difference between lang and hreflang?',
        answer: ['lang declares the language of the current page’s content. hreflang lists the other language or regional versions of the page so search engines can show the right one.'],
      },
    ],
  },
  {
    slug: 'page-speed',
    term: 'Page speed',
    aka: ['site speed', 'page load speed', 'page load time'],
    category: 'technical',
    short: 'Page speed is how quickly a page loads, shows its content and responds to input. Google measures it mainly through Core Web Vitals.',
    definition: [
      'Page speed is how quickly a web page loads, shows its main content and becomes responsive to clicks and taps. It is not one number: a page can start drawing quickly but take seconds to show its main image, or look finished but freeze when someone taps a button.',
      'Google measures speed for search through [Core Web Vitals](/glossary/core-web-vitals): Largest Contentful Paint for loading, Interaction to Next Paint for responsiveness and Cumulative Layout Shift for visual stability. Supporting metrics include [time to first byte](/glossary/time-to-first-byte), First Contentful Paint and, in lab tests, Total Blocking Time.',
      'There are two kinds of speed data. Field data comes from real visitors, such as the Chrome User Experience Report (CrUX) that Google uses. Lab data comes from a test run in a controlled environment, such as [Lighthouse](/glossary/lighthouse). Field data is what Google’s ranking systems look at; lab data is what you use to find and fix the causes.',
    ],
    why: [
      'Speed affects people first. Slow pages lose visitors before they see anything, and sluggish pages frustrate the ones who stay. That shows up in engagement and conversions whatever happens in search.',
      'For SEO, Core Web Vitals are part of the page experience signals Google’s ranking systems use. Google is clear that relevance and helpful content come first and a fast page will not outrank a much more relevant one, but when results are otherwise close, a better experience can help. Very slow servers can also reduce how much Google crawls, since Googlebot slows down when a site responds slowly.',
    ],
    how: {
      heading: 'How to improve page speed',
      steps: [
        'Measure first. Check field data in PageSpeed Insights or the Core Web Vitals report in Search Console, then use Lighthouse to find causes.',
        'Speed up the server response with caching, faster hosting or a [CDN](/glossary/cdn).',
        'Compress and resize images, serve modern formats such as WebP or AVIF, and give the main image a high fetch priority.',
        'Cut and defer JavaScript: remove unused code and third-party scripts, and load non-critical scripts with defer or async.',
        'Remove [render-blocking resources](/glossary/render-blocking-resources) by inlining critical CSS and deferring the rest.',
        'Set width and height on images and reserve space for ads and embeds to avoid layout shifts.',
        'Lazy-load images and iframes below the fold, but never the main image at the top.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop and flags slow server responses and large HTML documents.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['core-web-vitals', 'largest-contentful-paint', 'interaction-to-next-paint', 'cumulative-layout-shift', 'time-to-first-byte', 'pagespeed-insights', 'lighthouse'],
    faqs: [
      {
        question: 'Is page speed a ranking factor?',
        answer: ['Yes, through Core Web Vitals and page experience, but a modest one. Google says it will still rank the most relevant, helpful page first even if it is slower.'],
      },
      {
        question: 'What is a good page load time?',
        answer: ['Rather than one load time, aim for Google’s Core Web Vitals thresholds at the 75th percentile of visits: LCP within 2.5 seconds, INP within 200 milliseconds and CLS of 0.1 or less.'],
      },
      {
        question: 'Why do my PageSpeed Insights scores change every time?',
        answer: ['The performance score comes from a single Lighthouse lab run, which varies with network, server load and third-party scripts. The field data section, based on 28 days of real visits, is more stable.'],
      },
    ],
  },
  {
    slug: 'core-web-vitals',
    term: 'Core Web Vitals',
    aka: ['CWV', 'web vitals'],
    category: 'technical',
    short: 'Core Web Vitals are Google’s three metrics for real-world page experience: Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift.',
    definition: [
      'Core Web Vitals are three metrics Google uses to measure the experience real people have on a page: Largest Contentful Paint (LCP) for loading, Interaction to Next Paint (INP) for responsiveness and Cumulative Layout Shift (CLS) for visual stability. A page passes when all three are “good” for at least 75% of visits.',
      'The thresholds are the same for every site. [Largest Contentful Paint](/glossary/largest-contentful-paint) is good at 2.5 seconds or less and poor above 4 seconds. [Interaction to Next Paint](/glossary/interaction-to-next-paint) is good at 200 milliseconds or less and poor above 500 milliseconds. [Cumulative Layout Shift](/glossary/cumulative-layout-shift) is good at 0.1 or less and poor above 0.25. Anything between good and poor is “needs improvement”.',
      'Google assesses each metric at the 75th percentile of page loads, measured separately for mobile and desktop. Using the 75th percentile means most visitors, not just the ones on fast devices and connections, need a good experience before a page passes. A page with a median LCP of 1.8 seconds can still fail if a quarter of visits take longer than 2.5 seconds.',
      'The set has changed once. When Google introduced Core Web Vitals in 2020, responsiveness was measured by First Input Delay (FID), which only timed the delay before the first interaction was handled. In March 2024 INP replaced FID. INP looks at the latency of interactions across the whole visit, including the time to update the screen, so it is a stricter and more complete measure.',
      'Core Web Vitals come from field data: real Chrome users who have opted in to share usage statistics, collected in the Chrome User Experience Report (CrUX) over a rolling 28-day window. When a URL does not have enough traffic for its own data, Google may group it with similar pages or fall back to the whole origin. Lab tools such as [Lighthouse](/glossary/lighthouse) cannot measure the field values directly. Lighthouse reports LCP and CLS from a simulated load and uses Total Blocking Time as a lab stand-in for INP, because there is no real user interacting during a test.',
      'Core Web Vitals are part of Google’s page experience signals, alongside things like HTTPS and the absence of intrusive interstitials. They became part of ranking with the page experience update in 2021.',
    ],
    why: [
      'Google’s ranking systems use Core Web Vitals, so they are one of the few user-experience measures with a direct, documented link to search. Google is careful about their weight: it says good scores do not guarantee top rankings and that relevance and helpful content matter more. In practice they work as a tiebreaker between pages that are otherwise similar, and as a guard against an experience bad enough to lose visitors.',
      'The bigger payoff is usually outside rankings. Faster loading, quick responses and a page that does not jump about all keep visitors on the page and make it easier for them to buy, sign up or read. Because CWV come from real visitors, they also show you problems that only appear on slow phones and networks, which a developer testing on a fast laptop would never see.',
      'They also give teams a shared, measurable target. “Make the site faster” is vague; “get mobile LCP at the 75th percentile under 2.5 seconds on product pages” is a goal a developer can work on and a report can track.',
    ],
    how: {
      heading: 'How to check Core Web Vitals',
      steps: [
        'Open the Core Web Vitals report in [Google Search Console](/glossary/google-search-console). It groups your URLs into good, needs improvement and poor for mobile and desktop, based on CrUX field data, and names the failing metric for each group.',
        'Pick an example URL from a failing group and test it in [PageSpeed Insights](/glossary/pagespeed-insights). The top section shows field data for the URL and the origin; the lower section is a Lighthouse lab run with specific suggestions.',
        'Work on the failing metric. For LCP, find the LCP element, cut server response time, preload or prioritise the main image and remove render-blocking CSS and JavaScript. For INP, break up long JavaScript tasks, cut third-party scripts and keep event handlers light. For CLS, set width and height on images and video, reserve space for ads and embeds and avoid inserting content above what people are reading.',
        'Reproduce problems in Chrome DevTools. The Performance panel shows live LCP, INP and CLS as you use the page, and lets you throttle the CPU and network to imitate a mid-range phone.',
        'For your own field data, add real-user monitoring with Google’s open-source web-vitals JavaScript library, which reports the same metrics from your visitors’ browsers.',
        'Ship the fix and wait. CrUX uses a 28-day rolling window, so Search Console’s report takes up to four weeks to reflect a change. Use the “Validate fix” button to start Google’s check.',
        'Watch for regressions. A new script, a redesigned hero or an ad change can undo the work, so check the report after every major release.',
      ],
    },
    example: {
      label: 'Core Web Vitals thresholds (75th percentile)',
      body: 'LCP: good ≤2.5 s, needs improvement 2.5–4 s, poor >4 s. INP: good ≤200 ms, needs improvement 200–500 ms, poor >500 ms. CLS: good ≤0.1, needs improvement 0.1–0.25, poor >0.25. A product page with field values of LCP 2.1 s, INP 240 ms and CLS 0.04 fails overall, because INP is above 200 ms.',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop alongside its crawl, so you can see lab LCP, CLS and Total Blocking Time next to the technical issues on each page.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['largest-contentful-paint', 'interaction-to-next-paint', 'cumulative-layout-shift', 'page-speed', 'pagespeed-insights', 'lighthouse', 'time-to-first-byte', 'ranking-factors'],
    faqs: [
      {
        question: 'What are the three Core Web Vitals?',
        answer: ['Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness) and Cumulative Layout Shift (visual stability). INP replaced First Input Delay in March 2024.'],
      },
      {
        question: 'Are Core Web Vitals a ranking factor?',
        answer: ['Yes. They are part of the page experience signals Google’s ranking systems use. Google says they are not a major factor next to relevance and content quality, so treat them as important but not decisive.'],
      },
      {
        question: 'Why does PageSpeed Insights show different numbers from Search Console?',
        answer: ['Search Console groups URLs and uses 28 days of field data. The PageSpeed Insights score comes from a single lab test. Use field data to judge whether you pass and lab data to find out why.'],
      },
      {
        question: 'How long does it take for Core Web Vitals improvements to show?',
        answer: ['Up to about four weeks. Field data is a 28-day rolling average, so the old, slower visits have to age out before the numbers fully reflect a fix.'],
      },
      {
        question: 'What if my site has no Core Web Vitals data?',
        answer: ['Sites or pages with too little Chrome traffic do not appear in CrUX. Use Lighthouse for lab checks and add your own real-user monitoring with the web-vitals library.'],
      },
    ],
  },
  {
    slug: 'largest-contentful-paint',
    term: 'Largest Contentful Paint (LCP)',
    aka: ['LCP'],
    category: 'technical',
    short: 'Largest Contentful Paint (LCP) is a Core Web Vital that measures when the largest image or text block in the viewport appears. Good is 2.5 seconds or less.',
    definition: [
      'Largest Contentful Paint (LCP) is a [Core Web Vitals](/glossary/core-web-vitals) metric that measures how long it takes for the largest image, video poster or block of text visible in the viewport to render, counted from when the user started loading the page. Google rates LCP good at 2.5 seconds or less and poor above 4 seconds, at the 75th percentile of visits.',
      'The LCP element is usually a hero image, a product photo, a large heading or the first paragraph. It can be an <img>, an image inside an SVG, a video’s poster image, an element with a CSS background image, or a block-level element containing text. The browser keeps updating its choice as the page loads and stops once the person interacts.',
      'LCP time breaks into four parts: [time to first byte](/glossary/time-to-first-byte), the delay before the browser starts loading the LCP resource, the time to download it, and the delay before it is rendered. Knowing which part is large tells you what to fix.',
    ],
    why: [
      'LCP is the closest single number to “when did the page look loaded?”, and it is the Core Web Vital that most sites fail. Because it is part of page experience, it feeds into Google’s ranking systems, and slow LCP also means people leave before they see your content.',
    ],
    how: {
      heading: 'How to improve LCP',
      steps: [
        'Find the LCP element in PageSpeed Insights or the Chrome DevTools Performance panel.',
        'Cut server response time with caching, a faster backend or a [CDN](/glossary/cdn).',
        'Make the LCP image discoverable in the HTML as an <img>, not something injected by JavaScript or hidden in a CSS file.',
        'Add fetchpriority="high" to the LCP image, or preload it, so the browser fetches it early.',
        'Never lazy-load the LCP image. Leave loading="lazy" off images at the top of the page.',
        'Compress and resize the image and serve WebP or AVIF.',
        'Remove [render-blocking resources](/glossary/render-blocking-resources) that delay the first paint, and avoid client-side rendering for the main content.',
      ],
    },
    example: {
      label: 'A prioritised hero image',
      code: '<img src="/img/hero-1200.webp"\n     srcset="/img/hero-600.webp 600w, /img/hero-1200.webp 1200w"\n     sizes="100vw"\n     width="1200" height="600"\n     fetchpriority="high"\n     alt="Runner on a muddy trail">',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop, which reports lab LCP for the pages you test.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['core-web-vitals', 'page-speed', 'time-to-first-byte', 'lazy-loading', 'render-blocking-resources', 'pagespeed-insights'],
    faqs: [
      {
        question: 'What is a good LCP score?',
        answer: ['2.5 seconds or less for at least 75% of visits. Between 2.5 and 4 seconds needs improvement, and over 4 seconds is poor.'],
      },
      {
        question: 'Why is my LCP slow on mobile but fine on desktop?',
        answer: ['Phones usually have slower networks and CPUs, and mobile layouts often make a different element the largest. Test with mobile throttling and check which element is the LCP on mobile.'],
      },
    ],
  },
  {
    slug: 'interaction-to-next-paint',
    term: 'Interaction to Next Paint (INP)',
    aka: ['INP'],
    category: 'technical',
    short: 'Interaction to Next Paint (INP) is a Core Web Vital that measures how quickly a page responds to clicks, taps and key presses. Good is 200 ms or less.',
    definition: [
      'Interaction to Next Paint (INP) is a [Core Web Vitals](/glossary/core-web-vitals) metric that measures how quickly a page visibly responds to clicks, taps and key presses. It times each interaction from the input until the browser paints the next frame, and reports roughly the slowest one during the visit. Good is 200 milliseconds or less; poor is above 500 milliseconds.',
      'INP replaced First Input Delay (FID) as a Core Web Vital in March 2024. FID only measured the delay before the browser started handling the first interaction. INP covers every interaction on the page and includes the time to run event handlers and update the screen, so it catches slow menus, filters and add-to-basket buttons that FID missed. Scrolling and hovering are not counted.',
      'Each interaction has three parts: input delay (waiting for the main thread to be free), processing time (running your event handlers) and presentation delay (working out layout and painting). On pages with many interactions, INP ignores one outlier for every 50 interactions, so a single freak delay does not define the score.',
    ],
    why: [
      'A page that looks loaded but freezes when tapped feels broken. INP is the measure Google uses for that experience, and as a Core Web Vital it is part of page experience in ranking. Sites heavy with JavaScript, third-party tags and client-side frameworks are the most likely to fail it.',
      'INP can only be measured with real users, because it needs real interactions. Lab tools such as [Lighthouse](/glossary/lighthouse) report Total Blocking Time instead, which is a useful proxy but not the same thing.',
    ],
    how: {
      heading: 'How to improve INP',
      steps: [
        'Find the slow interactions. Use field data from PageSpeed Insights or real-user monitoring, then reproduce them in the Chrome DevTools Performance panel with CPU throttling on.',
        'Break up long tasks (anything over 50 ms on the main thread) so the browser can respond between them, for example by yielding with scheduler.yield() or setTimeout.',
        'Do the minimum in event handlers: update the screen first, then defer analytics calls and other non-urgent work.',
        'Remove or delay third-party scripts that compete for the main thread, such as chat widgets and tag managers.',
        'Keep the DOM small and avoid forcing layout repeatedly in a loop.',
        'Ship less JavaScript overall, and consider [server-side rendering](/glossary/server-side-rendering) so less work happens in the browser.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop, whose Total Blocking Time is the lab signal to watch alongside your INP field data.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['core-web-vitals', 'page-speed', 'javascript-seo', 'lighthouse', 'pagespeed-insights'],
    faqs: [
      {
        question: 'When did INP replace FID?',
        answer: ['In March 2024. Interaction to Next Paint became a Core Web Vital and First Input Delay was retired.'],
      },
      {
        question: 'What is a good INP score?',
        answer: ['200 milliseconds or less at the 75th percentile of visits. 200 to 500 ms needs improvement, and over 500 ms is poor.'],
      },
      {
        question: 'Why does Lighthouse not show INP?',
        answer: ['A standard Lighthouse run loads the page without anyone interacting with it, so there is nothing to measure. It shows Total Blocking Time as a lab stand-in.'],
      },
    ],
  },
  {
    slug: 'cumulative-layout-shift',
    term: 'Cumulative Layout Shift (CLS)',
    aka: ['CLS', 'layout shift'],
    category: 'technical',
    short: 'Cumulative Layout Shift (CLS) is a Core Web Vital that measures how much content moves unexpectedly while a page is used. Good is 0.1 or less.',
    definition: [
      'Cumulative Layout Shift (CLS) is a [Core Web Vitals](/glossary/core-web-vitals) metric that measures visual stability: how much visible content moves unexpectedly while a page loads and is used. It is a unitless score where good is 0.1 or less and poor is above 0.25, at the 75th percentile of visits.',
      'Each unexpected shift is scored by how much of the viewport moved (impact fraction) multiplied by how far it moved (distance fraction). Shifts that happen close together are grouped into a session window, and CLS reports the window with the largest total. Shifts within half a second of a click, tap or key press are not counted, because people expect the page to change when they act.',
      'Typical causes are images and videos without dimensions, ads and embeds that load into empty space, banners or cookie notices pushed in above content, and web fonts that swap in at a different size.',
    ],
    why: [
      'Layout shifts make people lose their place or tap the wrong thing, such as an ad that appears where a button was. As a Core Web Vital, CLS is part of the page experience signals Google’s ranking systems use. It is often the easiest of the three to fix.',
    ],
    how: {
      heading: 'How to fix Cumulative Layout Shift',
      steps: [
        'Set width and height attributes (or a CSS aspect-ratio) on every image, video and iframe, so the browser reserves space before it loads.',
        'Reserve space for ads, embeds and dynamic widgets with a fixed minimum height.',
        'Do not insert banners, notices or content above existing content after the page has started rendering; overlay them or place them below.',
        'Animate with transform and opacity instead of properties that change layout, such as top or height.',
        'Load web fonts carefully: preload key fonts and use matching fallback metrics so text does not jump when the font swaps.',
        'Find the shifting elements with the Layout Shift regions option in Chrome DevTools or the diagnostics in [PageSpeed Insights](/glossary/pagespeed-insights).',
      ],
    },
    example: {
      label: 'Reserving space for an image',
      code: '<img src="/img/product.webp" width="800" height="600" alt="Blue trail shoe, side view">\n\n<style>\n  img { max-width: 100%; height: auto; }\n</style>',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop, which reports lab CLS and the elements that shifted.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['core-web-vitals', 'page-speed', 'lazy-loading', 'lighthouse', 'image-seo'],
    faqs: [
      {
        question: 'What is a good CLS score?',
        answer: ['0.1 or less for at least 75% of visits. Between 0.1 and 0.25 needs improvement, and above 0.25 is poor.'],
      },
      {
        question: 'Why is my CLS worse in field data than in Lighthouse?',
        answer: ['Lighthouse only measures shifts during the initial load. Real visitors scroll and interact, which can trigger later shifts, such as ads loading or content expanding, that a lab test never sees.'],
      },
    ],
  },
  {
    slug: 'time-to-first-byte',
    term: 'Time to First Byte (TTFB)',
    aka: ['TTFB', 'server response time'],
    category: 'technical',
    short: 'Time to First Byte (TTFB) is the time from requesting a page until the first byte of the response arrives. It sets the floor for every other speed metric.',
    definition: [
      'Time to First Byte (TTFB) is the time between a browser requesting a page and receiving the first byte of the server’s response. It includes any redirects, the DNS lookup, connecting and negotiating TLS, and the time the server takes to produce the response. Google’s web.dev guidance treats 0.8 seconds or less as good.',
      'TTFB is not a Core Web Vital, but it comes before all of them. Nothing can render until the HTML starts arriving, so a slow TTFB pushes back [Largest Contentful Paint](/glossary/largest-contentful-paint) and First Contentful Paint by the same amount.',
      'High TTFB usually comes from slow database queries or rendering on the server, no page caching, a server far from the visitor, or chains of redirects before the final URL.',
    ],
    why: [
      'A slow server makes every page slow, and it is often the cause when LCP fails even though the page itself is light. It also affects crawling: Google’s crawler slows down when a site responds slowly, which can matter for large sites with tight [crawl budget](/glossary/crawl-budget).',
    ],
    how: {
      heading: 'How to reduce TTFB',
      steps: [
        'Measure from real locations. Field TTFB appears in PageSpeed Insights, and the browser’s Network panel shows it for a single request.',
        'Cache full pages where you can, on the server or at a [CDN](/glossary/cdn) edge, so most requests skip the backend.',
        'Profile slow pages on the server and fix the slow queries, API calls or templates.',
        'Serve visitors from nearby locations with a CDN.',
        'Remove redirects in front of the final URL, such as http to https to www hops; see [redirect chains](/glossary/redirect-chain).',
        'Use modern protocols (HTTP/2 or HTTP/3) and keep TLS configuration current.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages whose server response is slow, as well as redirect chains that add to the wait.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['page-speed', 'core-web-vitals', 'largest-contentful-paint', 'cdn', 'redirect-chain', 'crawl-budget'],
    faqs: [
      {
        question: 'What is a good TTFB?',
        answer: ['Google’s web.dev guidance treats 0.8 seconds or less as good and over 1.8 seconds as poor, measured from real visits. Faster is better, since it limits how quickly anything else can load.'],
      },
      {
        question: 'Is TTFB a Core Web Vital?',
        answer: ['No. It is a supporting metric. It matters because it delays LCP, which is a Core Web Vital.'],
      },
    ],
  },
  {
    slug: 'lighthouse',
    term: 'Lighthouse',
    aka: ['Google Lighthouse'],
    category: 'technical',
    short: 'Lighthouse is Google’s open-source tool that tests a page in a lab and scores its performance, accessibility, best practices and SEO.',
    definition: [
      'Lighthouse is an open-source, automated tool from Google that loads a web page in a controlled environment and audits it. It scores the page from 0 to 100 in four categories, Performance, Accessibility, Best Practices and SEO, and lists specific problems with advice on fixing them.',
      'You can run Lighthouse from the Lighthouse panel in Chrome DevTools, through [PageSpeed Insights](/glossary/pagespeed-insights), from the command line, or as a Node module in a build pipeline. Mobile runs simulate a mid-range phone on a slow network; desktop runs use a faster profile.',
      'The performance score is a weighted mix of lab metrics: First Contentful Paint, Speed Index, Largest Contentful Paint, Total Blocking Time and Cumulative Layout Shift, with Total Blocking Time, LCP and CLS carrying the most weight. Scores of 90 and above are shown as good, 50 to 89 as needing improvement, and below 50 as poor.',
    ],
    why: [
      'Lighthouse tells you why a page is slow or inaccessible, in a way you can test again after each change. It is the standard tool for debugging [Core Web Vitals](/glossary/core-web-vitals) problems before they reach real users.',
      'Remember what it is not. Lighthouse is lab data from one simulated visit, so scores vary between runs and differ from what real visitors experience. Google’s ranking systems use field data, not Lighthouse scores, and the Lighthouse SEO category only checks basics such as a title, meta description, crawlability and valid hreflang. A score of 100 does not mean a page will rank.',
    ],
    how: {
      heading: 'How to run a Lighthouse test',
      steps: [
        'Open the page in Chrome in an incognito window, so extensions do not skew results.',
        'Open DevTools, choose the Lighthouse panel, pick mobile or desktop and the categories you want, and run the audit.',
        'Read the diagnostics and opportunities under each category, starting with the ones that affect your LCP element and Total Blocking Time.',
        'Run it a few times and look at the median, since single runs vary.',
        'Compare with field data in PageSpeed Insights or Search Console before deciding a problem is real for users.',
      ],
    },
    example: {
      label: 'Command line',
      code: 'npx lighthouse https://example.com --preset=desktop --output=html --output-path=./report.html',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop as part of an audit, next to its own crawl checks.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['pagespeed-insights', 'core-web-vitals', 'page-speed', 'seo-audit', 'site-health-score'],
    faqs: [
      {
        question: 'Does a Lighthouse score affect rankings?',
        answer: ['Not directly. Google uses field data from real Chrome users for Core Web Vitals. Lighthouse is a lab tool for finding problems.'],
      },
      {
        question: 'Why does my Lighthouse score change between runs?',
        answer: ['Network conditions, server load, third-party scripts and your own computer’s workload all vary. Run several tests and use the median.'],
      },
      {
        question: 'Is a Lighthouse SEO score of 100 enough?',
        answer: ['No. The SEO category checks a small set of technical basics. It says nothing about content quality, links, search intent or how you compare with competitors.'],
      },
    ],
  },
  {
    slug: 'pagespeed-insights',
    term: 'PageSpeed Insights',
    aka: ['PSI', 'Google PageSpeed'],
    category: 'technical',
    short: 'PageSpeed Insights is Google’s free tool that shows a page’s real-user Core Web Vitals and a Lighthouse lab test with suggestions, for mobile and desktop.',
    definition: [
      'PageSpeed Insights (PSI) is a free Google tool that reports how a page performs, using two kinds of data. The top section shows field data from the Chrome User Experience Report: real visitors’ [Core Web Vitals](/glossary/core-web-vitals) over the last 28 days. The lower section runs [Lighthouse](/glossary/lighthouse) and shows a lab performance score with diagnostics.',
      'You enter a URL and get separate results for mobile and desktop. Field data appears only when Google has enough visits for that URL or origin; small sites may see only the lab section. PSI also has an API, which many tools use to test pages in bulk.',
    ],
    why: [
      'PSI is the quickest way to see whether a page passes Core Web Vitals for real users, which is what Google’s ranking systems use, and to get a lab report explaining why it might not.',
      'Read the two halves for what they are. The field assessment (“passed” or “failed”) is the one that matters for page experience. The 0–100 performance score is a single simulated test that varies from run to run, and chasing a perfect score often brings little benefit once the field metrics are good.',
    ],
    how: {
      heading: 'How to use PageSpeed Insights',
      steps: [
        'Enter a URL at pagespeed.web.dev and start on the mobile tab, since most sites have more trouble there.',
        'Check the Core Web Vitals assessment in the field data. Switch between “This URL” and “Origin” to see whether the problem is the page or the whole site.',
        'Scroll to the Lighthouse diagnostics and look at the LCP element, render-blocking requests, long main-thread tasks and layout shifts.',
        'Fix the biggest causes, then retest the lab result. Field data takes up to 28 days to update.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop as part of each audit, so you get lab results without testing pages one by one.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['lighthouse', 'core-web-vitals', 'page-speed', 'largest-contentful-paint', 'google-search-console'],
    faqs: [
      {
        question: 'Why does PageSpeed Insights say “no data”?',
        answer: ['The page or site does not have enough real Chrome visits in the Chrome User Experience Report. You still get the Lighthouse lab test.'],
      },
      {
        question: 'Is a PageSpeed score of 100 necessary?',
        answer: ['No. What counts for search is passing Core Web Vitals in field data. A lab score in the 80s with good field metrics is fine.'],
      },
    ],
  },
  {
    slug: 'site-architecture',
    term: 'Site architecture',
    aka: ['website architecture', 'site structure', 'information architecture'],
    category: 'technical',
    short: 'Site architecture is how a website’s pages are organised and linked together, which shapes how people and search engines find and value them.',
    definition: [
      'Site architecture is the way a website’s pages are organised into sections and linked to each other: the hierarchy from the home page down to individual pages, the navigation, the [internal links](/glossary/internal-links) and the URL structure that reflects them. Good architecture lets people and crawlers reach any important page in a few clicks.',
      'Most sites use a hierarchy. The home page links to main sections or categories, those link to subcategories or hub pages, and those link to individual articles, products or services. A shop might go home → women’s shoes → trail running shoes → a single product. A content site might group articles into [topic clusters](/glossary/topic-cluster), each with a pillar page linking out to detailed pages and back.',
      'People often describe architecture as flat or deep. In a flat architecture, most pages are only a few clicks from the home page. In a deep one, pages sit many levels down and can only be reached through long chains of links. “Every important page within three clicks” is a common rule of thumb, not a Google rule, but the idea behind it is sound: the further a page is from the home page, the less often it tends to be crawled and the less internal link value reaches it.',
      'Architecture is more than the menu. It includes contextual links within content, breadcrumbs, category and tag pages, pagination, footer links, and the XML sitemap, which lists URLs but does not replace links. It also includes the URLs themselves. Folders such as /shoes/trail/ help people understand where they are, though Google has said URL structure matters much less than how pages link.',
      'Large sites add their own problems. [Faceted navigation](/glossary/faceted-navigation) can create millions of filter URLs, pagination can push older items deep into the site, and old sections can end up with no links at all, leaving [orphan pages](/glossary/orphan-page). Planning architecture means deciding which pages deserve to be found and making sure the link structure gets crawlers there efficiently.',
    ],
    why: [
      'Search engines discover most pages by following links. A clear architecture means Googlebot finds new and updated pages quickly and spends its [crawl budget](/glossary/crawl-budget) on pages that matter rather than on endless filter combinations. Pages with no internal links may never be found or may be treated as unimportant.',
      'Links also pass value. Pages that the home page and main categories link to receive more internal link equity than pages buried deep, so your architecture is how you tell Google which pages are most important. Grouping related pages and linking them to each other also makes the topic of each section clear, which supports topical authority.',
      'People benefit in the same way. Visitors who can see where they are and move to related pages stay longer and find what they came for. Google can also show sitelinks for sites whose structure it understands well.',
      'Fixing architecture later is expensive. Moving sections means changing URLs, adding redirects and risking lost rankings. It is worth getting the structure right before a site grows, or before a redesign or migration.',
    ],
    how: {
      heading: 'How to plan site architecture',
      steps: [
        'List what the site needs to rank for. Group keywords by topic and intent with keyword clustering, and map each cluster to a page so you do not create two pages for the same search.',
        'Turn the groups into a hierarchy: main sections, then subsections, then individual pages. Keep the number of levels low.',
        'Give every section a hub page that introduces the topic and links to every page in it, and have those pages link back to the hub and to each other where it helps the reader.',
        'Build navigation and breadcrumbs from the hierarchy so every page links up to its parent and across to its siblings.',
        'Use short, readable URLs that follow the same structure, such as /guides/technical-seo/, and keep them stable.',
        'Add contextual links from strong pages, such as your most-linked articles, to important pages that sit lower down.',
        'Control the URLs that should not be crawled, such as most filter combinations, internal search results and session IDs.',
        'Crawl the site and check click depth, orphan pages, broken internal links and pages that receive few internal links. Fix the worst first, then re-crawl after every big change.',
      ],
    },
    example: {
      label: 'A simple hierarchy',
      body: 'Home → /guides/ (hub) → /guides/technical-seo/ (pillar) → /guides/technical-seo/robots-txt/ and /guides/technical-seo/canonical-tags/ (detail pages). Each detail page links back to the pillar and to related detail pages, the pillar links to every detail page, and breadcrumbs show the path on every page. No page is more than three clicks from the home page.',
    },
    openseo: {
      body: 'OpenSEO’s site audit crawls your site the way a search engine does and flags orphan pages, pages deep in the site, broken internal links and pages with no outgoing links.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['internal-links', 'crawl-depth', 'orphan-page', 'breadcrumbs', 'topic-cluster', 'pillar-page', 'crawl-budget', 'faceted-navigation'],
    faqs: [
      {
        question: 'What is a good site architecture for SEO?',
        answer: ['A shallow, logical hierarchy where related pages are grouped, every important page is a few clicks from the home page, and pages link up to their parent and across to related pages.'],
      },
      {
        question: 'How many clicks from the home page should a page be?',
        answer: ['“Within three clicks” is a common rule of thumb. Google has no fixed limit, but pages close to the home page tend to be crawled more often and receive more internal link value.'],
      },
      {
        question: 'Does URL structure matter for SEO?',
        answer: ['Somewhat. Readable folder-based URLs help people and make sections easy to analyse, but Google has said URL structure matters far less than how pages are linked internally.'],
      },
      {
        question: 'Is a flat or deep architecture better?',
        answer: ['Flatter is usually better, as long as it stays organised. A site with every page linked from the home page is flat but has no clear groupings, which helps neither people nor search engines.'],
      },
    ],
  },
  {
    slug: 'pagination',
    term: 'Pagination',
    aka: ['paginated pages', 'rel prev next'],
    category: 'technical',
    short: 'Pagination splits a long list of items, such as products or articles, across a series of numbered pages, each with its own URL.',
    definition: [
      'Pagination is the practice of splitting a long list, such as products in a category, posts in a blog archive or comments on a thread, across a series of numbered pages. Each page in the series usually has its own URL, for example /shoes/?page=2 or /blog/page/2/, and links to the next and previous pages.',
      'Google used to support rel="prev" and rel="next" link tags to describe a paginated series. In 2019 it said it no longer uses them as an indexing signal and had not for some time. Google now treats each paginated URL as a normal page, so the series is understood through ordinary links. The tags do no harm, and some other tools still read them, but they do nothing for Google.',
      'Infinite scroll and “load more” buttons are alternatives that load the next items on the same page. They are fine for people, but Googlebot does not scroll or click, so items that only appear that way may not be found unless there are crawlable paginated URLs behind them.',
    ],
    why: [
      'Pagination is how crawlers reach items beyond the first page of a category. If page 2 onwards cannot be crawled, products or articles that only appear there may never be found or may be seen as unimportant. Long series also push items many clicks deep, which affects [crawl depth](/glossary/crawl-depth).',
      'Common mistakes cause indexing problems: canonicalising every page in the series to page 1 (which tells Google the later pages are duplicates, so their links may be ignored), noindexing paginated pages, or building pagination links with JavaScript that crawlers cannot follow.',
    ],
    how: {
      heading: 'How to handle pagination for SEO',
      steps: [
        'Give each page in the series its own URL, using a query parameter or path, not a # fragment.',
        'Link pages with normal <a href> links, ideally to the next and previous page and to page 1.',
        'Give each paginated page a self-referencing [canonical tag](/glossary/canonical-tag). Do not point them all at page 1.',
        'Let paginated pages be indexed; they are how Google reaches the items on them.',
        'If you use infinite scroll or a load-more button, back it with paginated URLs that work without JavaScript.',
        'Keep important items close to the top: sort by popularity or recency, and link to key products or articles from elsewhere too.',
      ],
    },
    example: {
      label: 'Page 2 of a category',
      code: '<link rel="canonical" href="https://example.com/shoes/?page=2">\n...\n<nav aria-label="Pagination">\n  <a href="/shoes/">1</a>\n  <a href="/shoes/?page=2" aria-current="page">2</a>\n  <a href="/shoes/?page=3">3</a>\n  <a href="/shoes/?page=3">Next</a>\n</nav>',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages deep in the site and canonicals that point to another URL, two common signs of pagination problems.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['canonical-tag', 'crawl-depth', 'site-architecture', 'faceted-navigation', 'url-parameters', 'lazy-loading'],
    faqs: [
      {
        question: 'Does Google still use rel=prev and rel=next?',
        answer: ['No. Google said in 2019 that it does not use them as an indexing signal. It treats paginated pages as normal pages linked to each other.'],
      },
      {
        question: 'Should paginated pages be noindex?',
        answer: ['Usually not. Indexable, crawlable paginated pages are how Google finds the items listed on them. Noindex pages tend to be crawled less over time, and their links may be dropped too.'],
      },
      {
        question: 'Should page 2 canonicalise to page 1?',
        answer: ['No. Page 2 has different content from page 1, so each page should have a self-referencing canonical. Canonicalising to a “view all” page is an option only if that page actually exists and loads well.'],
      },
    ],
  },
  {
    slug: 'faceted-navigation',
    term: 'Faceted navigation',
    aka: ['faceted search', 'filtered navigation', 'facets'],
    category: 'technical',
    short: 'Faceted navigation lets visitors filter a list by attributes such as size, colour or price, and can create huge numbers of crawlable URLs.',
    definition: [
      'Faceted navigation is a set of filters on a category or search page that lets visitors narrow a list by attributes, or facets, such as size, colour, brand, price or rating. Each filter combination usually produces its own URL, for example /shoes/?colour=blue&size=9.',
      'Facets are useful for shoppers but multiply URLs fast. Five filters with ten values each, combined and reordered, can produce millions of URLs, most showing near-identical lists or no results at all. Crawlers that follow every filter link can spend most of their time on these pages instead of your products.',
      'Google’s guidance, updated in late 2024, is to stop facet URLs being crawled if you do not need them in search, for example by disallowing them in robots.txt or using URL fragments, which Google does not crawl. If you do want some facet pages indexed, keep the URL parameters in a consistent order, and return a 404 for filter combinations with no results.',
    ],
    why: [
      'Uncontrolled faceted navigation is one of the main causes of wasted [crawl budget](/glossary/crawl-budget) and [index bloat](/glossary/index-bloat) on large sites. It can slow the discovery of new products, create [duplicate content](/glossary/duplicate-content) and spread internal link value across countless thin pages.',
      'Some facets are worth ranking. “Women’s waterproof trail shoes” may have real search demand, and a filtered page can serve it well. The skill lies in choosing which facet pages to make indexable, giving them proper titles and copy, and keeping the rest out of the crawl.',
    ],
    how: {
      heading: 'How to manage faceted navigation',
      steps: [
        'List your facets and check which combinations have search demand with keyword research.',
        'For combinations that deserve to rank, create clean, static URLs (such as /shoes/trail/waterproof/) with their own title, heading and copy, and link to them from the category.',
        'Keep other facet URLs out of the crawl, for example with robots.txt disallow rules for their parameters or by applying filters with a # fragment or JavaScript that does not change the URL.',
        'Always add parameters in the same order so the same filters do not produce several URLs.',
        'Return a 404 status for filter combinations with no results.',
        'Remember that canonical and noindex tags still let Google crawl the URLs; they help consolidate signals but do not save crawl budget.',
      ],
    },
    example: {
      label: 'robots.txt rules for filter parameters',
      code: 'User-agent: *\nDisallow: /*?*colour=\nDisallow: /*?*size=\nDisallow: /*?*sort=',
    },
    openseo: {
      body: 'OpenSEO’s site audit crawls your site’s links, so a crawl that turns up thousands of filter URLs, duplicate titles or duplicate content shows you where facets are leaking.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['url-parameters', 'crawl-budget', 'index-bloat', 'duplicate-content', 'robots-txt', 'canonical-tag', 'ecommerce-seo'],
    faqs: [
      {
        question: 'Should faceted navigation pages be indexed?',
        answer: ['Only the ones with real search demand and useful, distinct content. Most filter combinations should be kept out of the crawl.'],
      },
      {
        question: 'Is robots.txt or canonical better for facets?',
        answer: ['They do different jobs. Robots.txt stops crawling, which saves crawl budget but means Google cannot see canonicals on those URLs. A canonical consolidates signals but the URLs are still crawled. Google suggests robots.txt for facets you do not need in search.'],
      },
    ],
  },
  {
    slug: 'url-parameters',
    term: 'URL parameters',
    aka: ['query parameters', 'query strings', 'query string parameters'],
    category: 'technical',
    short: 'URL parameters are key-value pairs after a ? in a URL, used for tracking, sorting, filtering and pagination. Each variation can look like a new page.',
    definition: [
      'URL parameters are key-value pairs added to the end of a URL after a question mark, separated by ampersands, as in /shoes?colour=blue&sort=price. They pass information to the server or to analytics, and are used for filtering, sorting, pagination, internal search, session IDs and campaign tracking.',
      'Some parameters change what the page shows, such as a filter, a page number or a search query. Others do not, such as [UTM parameters](/glossary/utm-parameters), click IDs and session IDs. To a search engine, every distinct URL is potentially a separate page, so /shoes, /shoes?sort=price and /shoes?utm_source=newsletter can all be crawled and indexed separately even if they look the same.',
      'Google’s Search Console used to have a URL Parameters tool for telling Google how to treat parameters. Google retired it in 2022, saying its systems had become good at working this out. Controlling parameters is now up to your site: canonicals, robots.txt, consistent internal linking and not generating needless variations in the first place.',
    ],
    why: [
      'Parameters are a common source of [duplicate content](/glossary/duplicate-content), wasted [crawl budget](/glossary/crawl-budget) and [index bloat](/glossary/index-bloat). They can split signals, such as links, between several URLs for the same page, and cause the wrong version to appear in search.',
    ],
    how: {
      heading: 'How to handle URL parameters for SEO',
      steps: [
        'Audit which parameters your site generates and sort them into ones that change content and ones that do not.',
        'Link internally to clean URLs only. Never add tracking parameters to internal links.',
        'Add a [canonical tag](/glossary/canonical-tag) on parameter URLs pointing to the clean version when the content is the same.',
        'Keep parameter order consistent and avoid empty values, so the same view has one URL.',
        'Disallow crawl-only parameters, such as sort orders and session IDs, in robots.txt if they produce many URLs. Do not combine this with a canonical on the same URLs, since Google cannot see a canonical it is not allowed to crawl.',
        'Use paths rather than parameters for pages you want to rank, such as /shoes/trail/ instead of /shoes?type=trail.',
      ],
    },
    example: {
      label: 'Canonical on a tracked URL',
      code: '<!-- On https://example.com/shoes/?utm_source=newsletter -->\n<link rel="canonical" href="https://example.com/shoes/">',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags duplicate titles, duplicate content and conflicting canonicals, which often trace back to parameter URLs.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['faceted-navigation', 'canonical-tag', 'duplicate-content', 'crawl-budget', 'utm-parameters', 'index-bloat'],
    faqs: [
      {
        question: 'Are URL parameters bad for SEO?',
        answer: ['Not in themselves. They become a problem when they create many crawlable URLs with the same content. Google indexes parameter URLs fine when they are controlled.'],
      },
      {
        question: 'What happened to the URL Parameters tool in Search Console?',
        answer: ['Google retired it in 2022. Use canonical tags, robots.txt and clean internal links instead.'],
      },
    ],
  },
  {
    slug: 'index-bloat',
    term: 'Index bloat',
    aka: ['indexation bloat'],
    category: 'technical',
    short: 'Index bloat is when a search engine indexes many more of a site’s pages than it should, most of them low-value, duplicate or unintended URLs.',
    definition: [
      'Index bloat is when a search engine has indexed many more pages from a site than the site intends to rank, and most of the extra pages are low value: filter and sort URLs, internal search results, tag archives, parameter duplicates, empty categories, staging copies or old thin pages.',
      'It usually builds up without anyone deciding it. A content management system creates tag and author archives automatically, [faceted navigation](/glossary/faceted-navigation) generates filter URLs, tracking parameters get linked internally, or an old section is left live after a redesign. The site might have 2,000 real pages and 60,000 indexed URLs.',
    ],
    why: [
      'Google has to crawl and process every URL, so bloat wastes [crawl budget](/glossary/crawl-budget) on large sites and can slow the discovery of new pages. Many near-duplicate pages also split signals, cause [keyword cannibalisation](/glossary/keyword-cannibalization), and make the site look thinner overall. Google’s quality systems look at a site as a whole as well as page by page, so large amounts of unhelpful content can hold back the good pages.',
    ],
    how: {
      heading: 'How to fix index bloat',
      steps: [
        'Compare what you expect to be indexed (your sitemap and the pages you want to rank) with what Google has indexed in the Search Console Pages report. The site: search operator gives only a rough estimate.',
        'Look for patterns among the extra URLs: parameters, archives, search pages, paginated duplicates, old sections.',
        'Remove the cause first: stop linking to the URLs and stop the CMS generating them.',
        'Noindex pages that people need but search does not, such as internal search results; canonicalise duplicates; 301 redirect old pages with a good replacement; return 404 or 410 for pages that should be gone.',
        'Use robots.txt for URLs that should not be crawled at all, but only after they have dropped out of the index, since a blocked page cannot show Google a noindex.',
        'Keep your [XML sitemap](/glossary/xml-sitemap) limited to canonical, indexable URLs.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit flags non-indexable URLs in your sitemap, thin and duplicate pages and canonical problems, which help you find what is bloating the index.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawl-budget', 'faceted-navigation', 'url-parameters', 'thin-content', 'duplicate-content', 'noindex', 'content-pruning'],
    faqs: [
      {
        question: 'How do I know if my site has index bloat?',
        answer: ['Compare the number of indexed pages in the Search Console Pages report with the number of pages you actually want in search. A large gap, made up of patterns such as parameter or archive URLs, suggests bloat.'],
      },
      {
        question: 'Should I block bloated URLs in robots.txt?',
        answer: ['Not first. If they are already indexed, Google needs to crawl them to see a noindex or redirect. Block them only once they have left the index, or for new URL patterns you never want crawled.'],
      },
    ],
  },
  {
    slug: 'duplicate-content',
    term: 'Duplicate content',
    aka: ['duplicate pages', 'near-duplicate content'],
    category: 'technical',
    short: 'Duplicate content is the same or very similar content available at more than one URL, on one site or across sites. Google picks one version to show.',
    definition: [
      'Duplicate content is content that appears at more than one URL, either word for word or with only small differences. It can happen within one site, such as the same product at several URLs, or across sites, such as an article republished elsewhere. Search engines usually index one version, the canonical, and filter the rest from results.',
      'Most duplicate content is technical and accidental. The same page can be reached over http and https, with and without www, with and without a trailing slash, with URL parameters for tracking or sorting, through print versions, through faceted navigation, or through several category paths in a shop. A product sold in six colours may have six near-identical pages. To Google, each URL is a separate document until it works out they are the same.',
      'Other duplication is editorial. Location pages that swap only the town name, manufacturer descriptions copied onto hundreds of shops, boilerplate text that outweighs the unique text on each page, and articles syndicated to partner sites all count. Near-duplicates are pages that are mostly the same, such as two category pages showing nearly identical product lists.',
      'When Google finds duplicates, it groups them and picks one URL as canonical, using signals such as the [canonical tag](/glossary/canonical-tag), redirects, which URL is linked internally, the sitemap, HTTPS and simple URL patterns. Your canonical tag is a strong hint, not a command; if the other signals disagree, Google may choose a different URL. Search Console’s URL Inspection tool shows both the canonical you declared and the one Google selected.',
      'There is a widespread myth of a “duplicate content penalty”. Google has said for years that duplicate content on its own is not grounds for a penalty and that most of it is not deceptive. The exception is duplication meant to manipulate rankings, such as scraped content republished from other sites without adding value, or many [doorway pages](/glossary/doorway-pages) with the same text. Those fall under Google’s spam policies.',
    ],
    why: [
      'Even without a penalty, duplication costs you. Links and other signals can be split across several URLs instead of building up on one. Google may choose a different version from the one you want, so a parameter URL or an http page appears in results. On large sites, crawling duplicates wastes crawl budget and can delay new pages being found. Near-duplicate pages targeting the same search can compete with each other, which is [keyword cannibalisation](/glossary/keyword-cannibalization).',
      'Cross-site duplication carries its own risk. If you syndicate an article and the partner’s copy is stronger, it may rank instead of your original. And if your product pages use the same manufacturer text as every other retailer, Google has little reason to show yours over theirs.',
      'Fixing duplication is usually cheap compared with its effects: a few redirects, consistent canonicals and clean internal links can consolidate signals onto one URL per page.',
    ],
    how: {
      heading: 'How to fix duplicate content',
      steps: [
        'Find it. Crawl the site and look for duplicate titles, meta descriptions and body text, and check the Search Console Pages report for “Duplicate without user-selected canonical” and “Duplicate, Google chose different canonical than user”.',
        'Pick one preferred URL for every page: one protocol (https), one host (www or not), one trailing-slash style and no tracking parameters.',
        'Redirect the other versions with [301 redirects](/glossary/301-redirect) where people do not need them, for example http to https and non-www to www.',
        'Add a self-referencing canonical tag to every indexable page, and point duplicates that must stay live, such as parameter or print versions, at the preferred URL.',
        'Make all your other signals agree: link internally only to preferred URLs, list only them in the XML sitemap, and use them in hreflang and structured data.',
        'Merge or rewrite editorial duplicates. Combine near-identical pages into one stronger page and redirect the rest, and write unique descriptions for important products instead of using manufacturer text.',
        'For language and regional versions, use [hreflang](/glossary/hreflang). Pages translated into different languages are not duplicates.',
        'For syndication, ask partners to noindex their copy. Google’s guidance is that a cross-domain canonical is not the most reliable fix here, because syndicated pages often differ from the original.',
      ],
    },
    example: {
      label: 'Five URLs, one page',
      body: 'http://example.com/shoes, https://example.com/shoes, https://www.example.com/shoes, https://www.example.com/shoes/ and https://www.example.com/shoes/?utm_source=newsletter can all serve the same page. Choose https://www.example.com/shoes/ as the preferred URL, 301 redirect the http and non-www versions to it, add a canonical pointing to it on every variant, and link to it internally.',
    },
    openseo: {
      body: 'OpenSEO’s site audit flags pages with identical visible text, duplicate titles and meta descriptions, and canonical tags that conflict, point to redirects or point to broken URLs.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['canonical-tag', '301-redirect', 'url-parameters', 'faceted-navigation', 'keyword-cannibalization', 'scraped-content', 'thin-content', 'hreflang'],
    faqs: [
      {
        question: 'Is there a duplicate content penalty?',
        answer: ['No, not for ordinary duplication. Google filters duplicates and shows one version. Only duplication meant to manipulate rankings, such as scraped or spun content, breaks Google’s spam policies.'],
      },
      {
        question: 'How much duplicate content is acceptable?',
        answer: ['There is no official percentage. Shared boilerplate such as navigation and footers is normal. The problem is when the main content of pages is the same, so focus on making each indexable page’s main content distinct.'],
      },
      {
        question: 'Is translated content duplicate content?',
        answer: ['No. Pages in different languages are different content. Use hreflang to connect the language versions so Google shows the right one.'],
      },
      {
        question: 'Why did Google choose a different canonical from mine?',
        answer: ['Your canonical tag is a hint. If redirects, internal links, the sitemap or the content itself point to another URL, Google may pick that one. Make every signal agree on the same URL.'],
      },
    ],
  },
  {
    slug: 'thin-content',
    term: 'Thin content',
    aka: ['low-quality content', 'thin pages'],
    category: 'technical',
    short: 'Thin content is a page with little or no useful content of its own, such as near-empty pages, copied text or doorway pages.',
    definition: [
      'Thin content is a page that offers little or no value of its own to the person who lands on it. Examples include near-empty pages, empty categories, product pages with only a manufacturer description, tag archives listing two posts, and templated location pages that swap in a town name.',
      'Affiliate pages that copy product details without adding anything are another common case.',
      'Thin is about value, not just length. A short page that answers a question completely, such as a store’s opening hours, is not thin. A 2,000-word article that says nothing new can be. Google’s own language is pages with “little or no added value”, and its manual actions include one with exactly that name, covering [thin affiliate pages](/glossary/thin-affiliate-pages), [doorway pages](/glossary/doorway-pages), scraped content and low-quality guest posts.',
    ],
    why: [
      'Thin pages rarely rank on their own, and in large numbers they can drag down how Google sees a site. Google’s helpful content guidance, now part of its core ranking systems, looks at content across a site as well as page by page. Thin pages also cause [index bloat](/glossary/index-bloat) and waste crawl time.',
      'At the extreme, mass-produced thin pages made to rank fall under Google’s spam policies, including [scaled content abuse](/glossary/scaled-content-abuse), and can lead to a manual action.',
    ],
    how: {
      heading: 'How to fix thin content',
      steps: [
        'Find candidates: pages with little visible text, pages with no organic clicks or impressions in Search Console over a long period, and template pages that differ only by a word or two.',
        'For each, decide: improve it, merge it, noindex it or remove it.',
        'Improve pages that target a real search: add original information, specifics, images, answers to common questions and anything a visitor would need.',
        'Merge near-identical pages into one stronger page and 301 redirect the others to it.',
        'Noindex pages people need but search does not, such as thin tag archives or internal search results.',
        'Remove pages with no value and no traffic, returning 404 or 410. This is part of [content pruning](/glossary/content-pruning).',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit flags indexable pages with very little visible text, and the search performance view shows which pages earn no impressions or clicks.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['helpful-content', 'duplicate-content', 'index-bloat', 'content-pruning', 'thin-affiliate-pages', 'doorway-pages', 'word-count'],
    faqs: [
      {
        question: 'How many words make content thin?',
        answer: ['There is no word count. Google judges whether a page is useful for its purpose. A short page can be complete, and a long one can still be thin if it adds nothing.'],
      },
      {
        question: 'Can thin content cause a penalty?',
        answer: ['Yes. Google has a manual action for “thin content with little or no added value”. More often, thin pages simply do not rank and can weigh on how the whole site is assessed.'],
      },
    ],
  },
  {
    slug: 'log-file-analysis',
    term: 'Log file analysis',
    aka: ['server log analysis', 'log analysis'],
    category: 'technical',
    short: 'Log file analysis is reviewing your server’s access logs to see exactly which URLs search engine bots requested, when and with what result.',
    definition: [
      'Log file analysis is the practice of reviewing your web server’s access logs to see how search engine crawlers actually behave on your site. Every request is recorded with the time, the URL, the status code returned, the response size and the [user agent](/glossary/user-agent), so you can see which pages Googlebot crawled, how often, and what it got back.',
      'Crawl tools show what a crawler could find by following links. Logs show what real bots did. The two often differ: logs reveal bots spending time on parameter URLs you thought were hidden, important pages that are rarely crawled, redirects and errors only bots hit, and old URLs that are still requested years after a migration.',
      'Because anyone can claim to be Googlebot in a user agent string, real analysis verifies the bot. Google documents two ways: a reverse DNS lookup on the IP address (genuine Googlebot resolves to googlebot.com, google.com or googleusercontent.com, and the forward lookup matches), or checking the IP against the ranges Google publishes.',
    ],
    why: [
      'Logs are the only direct evidence of how your [crawl budget](/glossary/crawl-budget) is spent. On large or frequently changing sites, they show whether new pages are being crawled quickly, whether bots are stuck in [faceted navigation](/glossary/faceted-navigation) or redirect chains, and whether server errors are hitting crawlers. They are also useful for checking how often AI crawlers visit and which pages they request.',
      'For a small site, Search Console’s Crawl Stats report gives a summary that is often enough. Log analysis pays off on sites with tens of thousands of URLs or more, and during migrations.',
    ],
    how: {
      heading: 'How to do log file analysis',
      steps: [
        'Get access logs from your server, host or CDN, covering at least a few weeks. Check that they include the user agent and status code.',
        'Filter to search engine bots by user agent, then verify them by reverse DNS or published IP ranges.',
        'Group requests by URL pattern, section and status code to see where crawling goes.',
        'Compare the crawled URLs with your list of important pages and your sitemap: find important pages that are rarely crawled, and crawled URLs you do not want.',
        'Look for 3xx, 4xx and 5xx responses served to bots and fix the causes.',
        'Act on the findings with internal links, robots.txt rules, redirects or server fixes, then check the logs again.',
      ],
    },
    example: {
      label: 'A Googlebot request in a combined log format line',
      code: '66.249.66.1 - - [14/Oct/2026:09:12:44 +0000] "GET /shoes/trail/ HTTP/1.1" 200 51234 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"',
    },
    related: ['crawl-budget', 'googlebot', 'user-agent', 'crawling', 'ai-crawlers', 'http-status-codes'],
    faqs: [
      {
        question: 'What can log files tell you about SEO?',
        answer: ['Which URLs search engine bots requested, how often, what status codes they received and how much time they spent on low-value URLs. It is the most direct view of crawling you can get.'],
      },
      {
        question: 'How do I verify Googlebot in my logs?',
        answer: ['Run a reverse DNS lookup on the IP and check it resolves to googlebot.com, google.com or googleusercontent.com, then run a forward lookup to confirm it matches. Or compare the IP with Google’s published crawler IP ranges.'],
      },
    ],
  },
  {
    slug: 'user-agent',
    term: 'User agent',
    aka: ['user-agent string', 'UA'],
    category: 'technical',
    short: 'A user agent is the software making a web request, identified by a user-agent string such as Googlebot’s that servers and robots.txt can read.',
    definition: [
      'A user agent is the software that makes a request to a web server on someone’s behalf, such as a browser or a crawler. It identifies itself with a user-agent string sent in the User-Agent HTTP header, for example a version of Chrome on Android, or Googlebot.',
      'In SEO the term has two related uses. Servers and analytics read the user-agent string to tell browsers from bots. And [robots.txt](/glossary/robots-txt) uses user-agent tokens, short names such as Googlebot, Bingbot, GPTBot or ClaudeBot, to set rules for particular crawlers. Some tokens control use rather than crawling: Google-Extended, for example, lets sites opt out of their content being used to train Google’s Gemini models, but it is not a separate crawler.',
      'User-agent strings are easy to fake, so a request claiming to be Googlebot is not proof. Verify important bots by reverse DNS or published IP ranges.',
    ],
    why: [
      'Knowing user agents lets you write the right robots.txt rules, read your logs correctly in [log file analysis](/glossary/log-file-analysis), and make sure your server, firewall or [CDN](/glossary/cdn) is not accidentally blocking search engine crawlers. Serving different content to search engine user agents than to people, on purpose, is [cloaking](/glossary/cloaking) and breaks Google’s spam policies.',
    ],
    how: {
      heading: 'How to target a user agent in robots.txt',
      steps: [
        'Find the crawler’s token in its owner’s documentation, such as Googlebot, Bingbot or GPTBot.',
        'Start a group with User-agent: followed by the token, then add Allow and Disallow rules beneath it.',
        'Remember that a crawler follows only the most specific group that matches it, so rules in the * group do not also apply to a crawler that has its own group.',
        'Test changes before you publish them, as one wrong line can block a whole site.',
      ],
    },
    example: {
      label: 'Googlebot Smartphone’s user-agent string, and robots.txt groups',
      code: '# Googlebot Smartphone (W.X.Y.Z is the current Chrome version)\n# Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)\n\nUser-agent: *\nDisallow: /search/\n\nUser-agent: GPTBot\nDisallow: /',
    },
    related: ['googlebot', 'web-crawler', 'robots-txt', 'ai-crawlers', 'log-file-analysis', 'cloaking'],
    faqs: [
      {
        question: 'What is Googlebot’s user agent?',
        answer: ['Googlebot has a smartphone and a desktop crawler, both identified by “Googlebot/2.1” in their strings. Google crawls most sites with the smartphone version. The robots.txt token for both is Googlebot.'],
      },
      {
        question: 'Can I block bots by user agent?',
        answer: ['Well-behaved bots follow robots.txt rules for their user agent. Bad bots ignore them and fake their strings, so blocking those needs firewall or server-level rules.'],
      },
    ],
  },
  {
    slug: 'cdn',
    term: 'CDN (content delivery network)',
    aka: ['content delivery network', 'content distribution network'],
    category: 'technical',
    short: 'A CDN (content delivery network) is a network of servers around the world that caches and serves your site from locations close to each visitor.',
    definition: [
      'A CDN (content delivery network) is a distributed network of servers, called edge servers, in many locations that store copies of a website’s files and serve them to visitors from the nearest location. Instead of every request travelling to one origin server, most are answered by an edge server close to the visitor.',
      'CDNs began by caching static files such as images, CSS and JavaScript. Most now also cache whole HTML pages, terminate HTTPS, compress and resize images, support HTTP/2 and HTTP/3, run code at the edge and protect sites against traffic floods and abusive bots.',
    ],
    why: [
      'Distance adds delay. A CDN cuts the time to connect and download, which lowers [time to first byte](/glossary/time-to-first-byte) and improves [Largest Contentful Paint](/glossary/largest-contentful-paint), especially for visitors far from your server. It also keeps sites up under load, which matters for crawling: Googlebot slows down when a server is slow or returns errors.',
      'There is one common SEO risk. Bot protection and firewall rules on a CDN can block or challenge search engine crawlers, returning errors or challenge pages instead of your content. Check that verified crawlers such as Googlebot and Bingbot are allowed, and that any AI crawlers you want are not blocked by default settings.',
    ],
    how: {
      heading: 'How to set up a CDN for SEO',
      steps: [
        'Serve the whole site through the CDN on your own domain, and cache static assets with long cache lifetimes.',
        'Cache HTML where your content allows it, with sensible expiry and purging when pages change.',
        'Keep one canonical host and protocol, with redirects handled consistently at the edge.',
        'Check bot management settings so verified search engine crawlers are allowed.',
        'After setup, inspect a few URLs in Search Console and watch the Crawl Stats report for errors or a rise in response time.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit flags slow server responses and pages that block or rate-limit its crawler, which can point to CDN or firewall settings.',
      href: '/docs/audit-checks',
      label: 'Read the audit checks',
    },
    related: ['page-speed', 'time-to-first-byte', 'core-web-vitals', 'https', 'googlebot', 'ai-crawlers'],
    faqs: [
      {
        question: 'Does a CDN help SEO?',
        answer: ['Indirectly. A CDN makes pages faster and more reliable, which helps Core Web Vitals, visitors and crawling. It is not a ranking factor in itself.'],
      },
      {
        question: 'Can a CDN block Googlebot?',
        answer: ['Yes, if its bot protection or firewall rules challenge or block crawlers. Make sure verified search engine bots are allowed and check Search Console for crawl errors after changes.'],
      },
    ],
  },
  {
    slug: 'indexnow',
    term: 'IndexNow',
    aka: ['Index Now', 'IndexNow protocol'],
    category: 'technical',
    short: 'IndexNow is an open protocol that lets a site notify search engines such as Bing and Yandex the moment a URL is added, changed or deleted.',
    definition: [
      'IndexNow is an open protocol that lets websites tell participating search engines immediately when a URL has been added, updated or deleted, instead of waiting for the engines to crawl and notice. A site sends a simple HTTP request listing the changed URLs, and the engines that support it share the notification with each other.',
      'Microsoft Bing and Yandex launched IndexNow in 2021. Other engines, including Seznam, Naver and Yep, have joined since. Google does not support IndexNow. It said it would test the protocol but has not adopted it, so Google still finds changes through crawling, links and [XML sitemaps](/glossary/xml-sitemap).',
      'To use IndexNow, you create a key, host it as a text file on your site to prove ownership, and send URLs to an IndexNow endpoint, either one at a time or up to 10,000 per request. Many content management systems, plugins and CDNs can do this automatically.',
    ],
    why: [
      'For engines that support it, IndexNow can get new and updated pages crawled faster and reduce unnecessary crawling of pages that have not changed. That matters for [Bing SEO](/glossary/bing-seo), and Bing’s index also supplies results to other services. It is most useful for sites that change often, such as news, ecommerce stock and prices, or job listings.',
      'It does not guarantee indexing or rankings, and it does nothing for Google. Keep an accurate sitemap with lastmod dates for Google.',
    ],
    how: {
      heading: 'How to set up IndexNow',
      steps: [
        'Check whether your CMS, plugin or CDN already supports IndexNow, and turn it on if so.',
        'Otherwise, generate a key (8–128 characters of letters, numbers and dashes) and host it at your site root as a text file named after the key, containing the key.',
        'Send changed URLs to api.indexnow.org/indexnow or a participating engine’s endpoint, with a GET request for one URL or a POST with a JSON list for many.',
        'Submit only URLs that have actually changed, and include deleted URLs too.',
        'Check submissions and any errors in Bing Webmaster Tools.',
      ],
    },
    example: {
      label: 'Submitting URLs with a POST request',
      code: 'POST https://api.indexnow.org/indexnow\nContent-Type: application/json; charset=utf-8\n\n{\n  "host": "www.example.com",\n  "key": "5f2b7c9e1a4d4e8b9c3f6a2d7e1b4c8f",\n  "keyLocation": "https://www.example.com/5f2b7c9e1a4d4e8b9c3f6a2d7e1b4c8f.txt",\n  "urlList": [\n    "https://www.example.com/shoes/trail/",\n    "https://www.example.com/blog/new-season/"\n  ]\n}',
    },
    related: ['bing-seo', 'bing-webmaster-tools', 'xml-sitemap', 'indexing', 'crawling'],
    faqs: [
      {
        question: 'Does Google support IndexNow?',
        answer: ['No. Google has not adopted IndexNow. It finds changes through crawling and XML sitemaps, so keep your sitemap accurate.'],
      },
      {
        question: 'Which search engines use IndexNow?',
        answer: ['Microsoft Bing and Yandex, which launched it, plus others including Seznam, Naver and Yep. A submission to one participating engine is shared with the others.'],
      },
      {
        question: 'Does IndexNow guarantee indexing?',
        answer: ['No. It tells search engines a URL has changed so they can crawl it sooner. Whether the page is indexed still depends on its quality and the engine’s own decisions.'],
      },
    ],
  },
  {
    slug: 'site-health-score',
    term: 'Site health score',
    aka: ['site health', 'health score', 'SEO health score'],
    category: 'technical',
    short: 'A site health score is a single number, usually 0 to 100, that an SEO audit tool calculates from the technical issues found when it crawls a site.',
    definition: [
      'A site health score is a single number, usually from 0 to 100, that a site audit tool calculates to summarise how many technical SEO problems it found in a crawl and how serious they are. It turns hundreds of individual checks, such as broken links, missing titles, [redirect chains](/glossary/redirect-chain) and noindex pages, into one figure you can track over time.',
      'Every tool calculates it differently, so scores are not comparable between tools. Most weight problems by severity, so a broken page or a blocked crawler counts for more than a missing alt attribute, and most score per page and then average across the site. The score is the tool’s view, not Google’s: Google has no site health score, and a high one does not mean a site will rank.',
    ],
    why: [
      'A single number is useful for tracking direction. If the score drops after a release, something broke; if it rises after a clean-up, the fixes worked. It also gives non-specialists a quick read on whether the technical foundation needs attention.',
      'Use it as a starting point, not a goal. A site can score 95 and still have one critical problem, such as an important section set to noindex, that matters more than everything else combined. Always read the issues behind the score, starting with the most severe, and treat it as one part of a wider [SEO audit](/glossary/seo-audit). OpenSEO’s method is set out on the [audit checks page](/docs/audit-checks).',
    ],
    how: {
      heading: 'How to improve a site health score',
      steps: [
        'Run a full crawl and sort issues by severity.',
        'Fix critical issues first: server errors, broken pages, broken internal links, redirect loops and pages that block crawlers.',
        'Then work through warnings, such as missing titles, duplicate content and thin pages, starting with templates that affect many pages at once.',
        'Re-crawl after each batch of fixes to confirm them and catch new problems.',
        'Schedule regular audits so regressions show up quickly.',
      ],
    },
    example: {
      label: 'How OpenSEO works out its health score',
      body: 'Each page the crawler tried gets a penalty of 25 points per critical issue, 8 per warning and 1 per notice, capped at 100. The score is 100 minus the average penalty across pages, rounded. A site where every page is clean scores 100; one where every page has four critical issues scores 0. Pages blocked by robots.txt are left out, and if no page answered with a success status, the score is 0.',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs 59 technical checks and rolls them into one health score. The audit checks page explains every issue and exactly how the score is worked out.',
      href: '/docs/audit-checks',
      label: 'See how the score is worked out',
    },
    related: ['seo-audit', 'technical-seo', 'lighthouse', 'http-status-codes', 'redirect-chain'],
    faqs: [
      {
        question: 'What is a good site health score?',
        answer: ['It depends on the tool, but scores in the 90s usually mean few serious problems. What matters more is that no critical issues are left on important pages.'],
      },
      {
        question: 'Does Google use a site health score?',
        answer: ['No. It is a summary made by audit tools. Google evaluates pages through its own crawling, indexing and ranking systems.'],
      },
      {
        question: 'Why do different tools give different health scores?',
        answer: ['Each tool runs different checks and weights them differently, so the same site can score very differently. Compare scores within one tool over time, not across tools.'],
      },
    ],
  },
  {
    slug: 'lazy-loading',
    term: 'Lazy loading',
    aka: ['lazy load', 'loading="lazy"'],
    category: 'technical',
    short: 'Lazy loading delays loading images, iframes or other content until they are about to scroll into view, which speeds up the first load of a page.',
    definition: [
      'Lazy loading is a technique that delays loading resources, usually images and iframes, until they are near the visible part of the screen. Instead of downloading every image on a long page at once, the browser fetches each one as the visitor scrolls towards it, which saves data and speeds up the first load.',
      'All major browsers support native lazy loading with the loading="lazy" attribute on <img> and <iframe> elements. Older approaches use JavaScript, ideally the IntersectionObserver API, to swap in the real image source when an element comes into view.',
    ],
    why: [
      'Done well, lazy loading improves [page speed](/glossary/page-speed) by letting the browser focus on what is visible first. Done badly, it hurts in two ways.',
      'First, lazy loading the main image at the top of the page delays [Largest Contentful Paint](/glossary/largest-contentful-paint), because the browser waits before fetching it. Second, Googlebot does not scroll. Google renders pages with a tall viewport, so content set to load when it enters the viewport usually loads, but content that only appears after a scroll event, a click or a “load more” button may never be seen. JavaScript implementations that rely on scroll events, rather than native lazy loading or IntersectionObserver, are the most likely to fail.',
    ],
    how: {
      heading: 'How to lazy load images for SEO',
      steps: [
        'Use native loading="lazy" on images and iframes below the fold.',
        'Do not lazy-load images in the first screen, especially the LCP image; give that one fetchpriority="high" instead.',
        'Keep the real image URL in the src (or srcset) attribute so crawlers can find it, rather than hiding it in a data attribute only a script reads.',
        'Set width and height on lazy images to avoid [layout shifts](/glossary/cumulative-layout-shift).',
        'For content lists, back infinite scroll with paginated URLs that crawlers can reach.',
        'Check the rendered HTML in Search Console’s URL Inspection tool to confirm the images and content appear.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- Hero image: load straight away -->\n<img src="/img/hero.webp" width="1200" height="600" fetchpriority="high" alt="Runner on a trail">\n\n<!-- Further down the page: lazy-load -->\n<img src="/img/gallery-4.webp" width="800" height="600" loading="lazy" alt="Shoe sole close-up">',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop, which flags a lazy-loaded LCP image and offscreen images that should be deferred.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['largest-contentful-paint', 'page-speed', 'image-seo', 'javascript-seo', 'cumulative-layout-shift', 'pagination'],
    faqs: [
      {
        question: 'Is lazy loading bad for SEO?',
        answer: ['No, if you use native lazy loading or IntersectionObserver and keep it off images at the top of the page. It becomes a problem when it delays the LCP image or hides content behind scrolling or clicks.'],
      },
      {
        question: 'Can Google see lazy-loaded images?',
        answer: ['Yes, when the image URL is in the src or srcset attribute and loading happens as elements enter the viewport. Google renders pages with a tall viewport rather than scrolling.'],
      },
    ],
  },
  {
    slug: 'render-blocking-resources',
    term: 'Render-blocking resources',
    aka: ['render blocking resources', 'render-blocking CSS', 'render-blocking JavaScript'],
    category: 'technical',
    short: 'Render-blocking resources are CSS and JavaScript files that the browser must download and process before it can show any of the page.',
    definition: [
      'Render-blocking resources are files, mainly CSS stylesheets and synchronous JavaScript in the head of a page, that a browser must download and process before it can draw anything on screen. Until they arrive, the visitor sees a blank page, even if the HTML has already loaded.',
      'Stylesheets block rendering by default, because the browser does not want to show unstyled content. Scripts in the head without async, defer or type="module" block the HTML parser, because a script might change the page. Each blocking file adds at least one network round trip before the first paint, and more if it loads further files such as fonts or imported CSS.',
    ],
    why: [
      'Render-blocking resources delay First Contentful Paint and [Largest Contentful Paint](/glossary/largest-contentful-paint), which is a Core Web Vital. They hurt most on mobile networks, where each round trip takes longer. [Lighthouse](/glossary/lighthouse) and PageSpeed Insights report them as a performance opportunity, with an estimate of the time you could save.',
    ],
    how: {
      heading: 'How to eliminate render-blocking resources',
      steps: [
        'Find them in the Lighthouse or PageSpeed Insights report, which lists each blocking request.',
        'Add defer to scripts that do not need to run before the page is shown, or async for independent scripts such as analytics.',
        'Inline the small amount of critical CSS needed for the first screen in the head, and load the rest without blocking.',
        'Use media attributes so print or large-screen stylesheets do not block other devices.',
        'Remove unused CSS and JavaScript, and cut third-party scripts in the head.',
        'Self-host or preload key fonts and use font-display: swap so text shows while fonts load.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<head>\n  <!-- Blocking: the browser waits for these -->\n  <link rel="stylesheet" href="/css/all.css">\n  <script src="/js/app.js"></script>\n\n  <!-- Not blocking -->\n  <style>/* critical CSS for the first screen */</style>\n  <link rel="stylesheet" href="/css/print.css" media="print">\n  <script src="/js/app.js" defer></script>\n  <script src="/js/analytics.js" async></script>\n</head>',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs Lighthouse on mobile and desktop, which lists the render-blocking requests on each page it tests.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['page-speed', 'largest-contentful-paint', 'core-web-vitals', 'lighthouse', 'pagespeed-insights', 'javascript-seo'],
    faqs: [
      {
        question: 'What is the difference between async and defer?',
        answer: ['Both download the script without blocking the HTML parser. async runs the script as soon as it arrives, in any order; defer waits until the HTML is parsed and runs scripts in order.'],
      },
      {
        question: 'Is all CSS render-blocking?',
        answer: ['Stylesheets that apply to the current device block rendering by default. Stylesheets with a non-matching media attribute, such as print, do not block the first render.'],
      },
    ],
  },
];
