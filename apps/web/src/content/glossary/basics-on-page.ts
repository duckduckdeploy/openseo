import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'seo',
    term: 'SEO (search engine optimization)',
    aka: ['search engine optimisation', 'search engine optimization', 'organic SEO'],
    category: 'basics',
    short: 'SEO (search engine optimization) is the work of making your website easier to find, understand and choose in unpaid search results.',
    definition: [
      'SEO (search engine optimization) is the practice of improving a website so it appears higher in the unpaid results of search engines such as Google and Bing. It covers the technical health of the site, the content on each page, and the reputation the site earns from links and mentions elsewhere on the web.',
      'Every time someone types a query, a [search engine](/glossary/search-engine) picks a handful of pages from the billions it knows about and orders them on a [results page](/glossary/serp). Getting into that list happens in three stages. First the engine finds your pages by following links ([crawling](/glossary/crawling)). Then it reads and stores them ([indexing](/glossary/indexing)). Finally, when someone searches, its [ranking algorithm](/glossary/search-algorithm) decides which stored pages answer the query best. SEO is the work of making each of those three stages go well for your site.',
      'People usually split SEO into three parts. [Technical SEO](/glossary/technical-seo) makes sure search engines can crawl, render and index your pages without trouble: speed, redirects, sitemaps, canonical tags, mobile layout. [On-page SEO](/glossary/on-page-seo) is about each page itself: the words, the [title tag](/glossary/title-tag), headings, images and internal links, and whether the page answers what the searcher wanted. [Off-page SEO](/glossary/off-page-seo) is what happens elsewhere: other sites linking to you ([backlinks](/glossary/backlink)), reviews, and mentions of your brand.',
      'Underneath all three sits one idea: [search intent](/glossary/search-intent). Search engines want to show the result that best satisfies the person searching. A page that ranks well is usually the most useful answer to a specific question, from a site the engine has reason to trust. Google describes what it looks for in terms of helpfulness and [E-E-A-T](/glossary/eeat): experience, expertise, authoritativeness and trust.',
      'SEO is different from paid search. Ads appear because you pay per click; organic results appear because the engine judged your page relevant. You can’t pay Google to rank higher organically. That makes SEO slower to show results, often months rather than days, but the traffic keeps coming without a cost per click. The two together are often called [search engine marketing](/glossary/search-engine-marketing).',
      'SEO now also reaches beyond the classic ten blue links. Search results include [featured snippets](/glossary/featured-snippet), maps, videos and [AI Overviews](/glossary/ai-overviews), and AI assistants such as ChatGPT and Perplexity search the web and cite sources. Much of the same work, clear content, a healthy site and a trusted brand, also helps you show up there. That newer field is often called [AI visibility](/glossary/ai-visibility) or generative engine optimisation.',
    ],
    why: [
      'Search is how most people look for information, products and services online. When someone types a question that your business answers, SEO decides whether they find you or a competitor. Visitors from [organic search](/glossary/organic-search) arrive with a need already in mind, which makes them more likely to read, sign up or buy than most other kinds of traffic.',
      'Organic traffic also compounds. A page that ranks keeps bringing visitors month after month without paying for each click, and the links and trust a site builds make the next page easier to rank. Stop paying for ads and the ad traffic stops; a well-ranked page can keep working for years if you keep it accurate and up to date.',
      'Finally, SEO work tends to improve the site for people too. Faster pages, clearer navigation, honest titles and content that answers the question are what search engines reward because they are what users want.',
    ],
    how: {
      heading: 'How to start with SEO',
      steps: [
        'Make sure Google can see your site. Verify it in [Google Search Console](/glossary/google-search-console), submit an [XML sitemap](/glossary/xml-sitemap), and check the Page indexing report for pages that are excluded.',
        'Fix the technical basics. Run an [SEO audit](/glossary/seo-audit) to find broken links, redirect chains, missing titles, slow pages and pages blocked by robots.txt or noindex.',
        'Do [keyword research](/glossary/keyword-research). Find the words your audience actually types, how many people search them, how hard they are to rank for, and what intent sits behind each one.',
        'Map one main keyword to each page. Give every important topic its own page, so two of your pages don’t compete for the same search.',
        'Write and optimise the page. Answer the query better than what already ranks, then write a clear title tag, a meta description, a single H1, descriptive headings and alt text for images.',
        'Link your pages together. Use internal links with descriptive anchor text so visitors and crawlers can reach every important page in a few clicks.',
        'Earn links and mentions. Publish things worth citing, such as original data, tools and guides, and tell the people who would care. Avoid buying links: it breaks Google’s spam policies.',
        'Measure and repeat. Track rankings and clicks over weeks, not days, look for queries where you sit just off page one, and improve those pages first.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A bakery in Leeds wants more cake orders. Keyword research shows people search “birthday cakes Leeds” and “custom cake delivery Leeds”. The bakery creates a page for each, with clear photos, prices, delivery areas and a title tag like “Custom Birthday Cakes in Leeds | Delivery Available”. It fixes its slow homepage, adds the shop to Google Business Profile, asks happy customers for reviews and gets listed by a local wedding blog. Over a few months the pages move from page three to the top five and orders from search rise.',
    },
    openseo: {
      body: 'OpenSEO covers the main parts of SEO in one open-source tool: keyword research, rank tracking, backlinks, a site audit and Search Console data. Start with the keyword overview to see what a topic is worth.',
      href: '/tools/keyword-overview',
      label: 'Open the keyword overview',
    },
    related: ['technical-seo', 'on-page-seo', 'off-page-seo', 'keyword-research', 'search-intent', 'eeat', 'crawling', 'indexing'],
    faqs: [
      {
        question: 'What does SEO stand for?',
        answer: ['SEO stands for search engine optimization (optimisation in British spelling). It means improving a website so it ranks higher in unpaid search results.'],
      },
      {
        question: 'How long does SEO take to work?',
        answer: [
          'There is no fixed timeline. Technical fixes can show up within days of a recrawl, while new pages on a new site often take several months to rank for competitive terms. It depends on competition, the site’s existing authority and how much you publish and improve.',
        ],
      },
      {
        question: 'Can I do SEO myself?',
        answer: [
          'Yes. The basics, helpful content, clear titles, a crawlable site and a few good links, need no special access. Google publishes a free SEO Starter Guide, and Search Console shows how Google sees your site.',
        ],
      },
      {
        question: 'Is SEO dead because of AI search?',
        answer: [
          'No. Search engines still send large amounts of traffic, and AI features such as AI Overviews and AI assistants draw on pages that are indexed and trusted. Clicks may be shared differently, but being findable and credible still matters.',
        ],
      },
      {
        question: 'Can you pay Google to rank higher?',
        answer: ['Not in the organic results. You can pay for ads, which are labelled “Sponsored”, but Google says it never accepts payment to include or rank a page in its organic results.'],
      },
    ],
  },
  {
    slug: 'search-engine',
    term: 'Search engine',
    aka: ['web search engine'],
    category: 'basics',
    short: 'A search engine is a system that finds pages on the web, stores them in an index and returns the most relevant ones for each query.',
    definition: [
      'A search engine is software that discovers pages on the web, stores what it finds in a huge database called an index, and returns a ranked list of results when someone types a query. Google, Bing, Yandex, Baidu and DuckDuckGo are search engines; YouTube and Amazon run search engines for their own content.',
      'Most web search engines work in the same three stages. A [web crawler](/glossary/web-crawler) follows links and fetches pages ([crawling](/glossary/crawling)). The engine processes each page, renders it, works out what it is about and stores it ([indexing](/glossary/indexing)). When a query arrives, ranking systems pick and order the indexed pages that best match it, then display them on a [SERP](/glossary/serp) alongside ads and other features.',
      'Not every search engine has its own index. Some build their results partly or wholly from another engine’s index; for example, Yahoo’s web results are powered by Bing. AI assistants with web search, such as ChatGPT search and Perplexity, also retrieve pages and then summarise them, which is why the line between search engines and answer engines is blurring.',
    ],
    why: [
      'SEO only exists because search engines decide who gets seen. Knowing how they find, store and rank pages tells you what to fix: a page that can’t be crawled can’t be indexed, and a page that isn’t indexed can’t rank, however good it is.',
      'Google holds most of the search market in most countries, so SEO advice is usually Google-first. But [Bing SEO](/glossary/bing-seo) matters too, partly because Bing’s index feeds other services.',
    ],
    how: {
      heading: 'How to check a search engine has your page',
      steps: [
        'Search for your exact page title in quotes, or use the site: operator, for example site:example.com/page. This is a rough check only.',
        'For Google, open the URL Inspection tool in Search Console. It tells you whether the URL is indexed and when it was last crawled.',
        'For Bing, use URL Inspection in Bing Webmaster Tools.',
        'If the page is missing, check for a noindex tag, a robots.txt block, a canonical pointing elsewhere or a lack of internal links to it.',
      ],
    },
    openseo: {
      body: 'The SERP checker shows the live top 10 Google returns for any query, in any country or city, so you can see exactly what the engine chooses today.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['crawling', 'indexing', 'search-algorithm', 'googlebot', 'serp', 'bing-seo'],
    faqs: [
      {
        question: 'What is the most used search engine?',
        answer: ['Google is by far the most used web search engine worldwide. Bing is second in many markets, and Baidu and Yandex are strong in China and Russia respectively.'],
      },
      {
        question: 'Is ChatGPT a search engine?',
        answer: ['Not in the classic sense, but ChatGPT search can look up the web and cite pages. It retrieves results and writes an answer rather than showing a ranked list of links.'],
      },
    ],
  },
  {
    slug: 'organic-search',
    term: 'Organic search',
    aka: ['natural search', 'unpaid search', 'organic results'],
    category: 'basics',
    short: 'Organic search is the unpaid part of search results, where pages appear because the search engine judged them relevant, not because someone paid.',
    definition: [
      'Organic search refers to the unpaid listings on a search results page. Pages appear there because the search engine’s algorithm judged them the best match for the query, not because an advertiser paid. SEO is the work of earning and improving these organic positions.',
      'On a Google results page, ads are marked “Sponsored” and usually sit at the top and bottom. Everything else, the blue links, plus organic features such as [featured snippets](/glossary/featured-snippet), [People Also Ask](/glossary/people-also-ask) and image or video results, is organic. Map listings in the [local pack](/glossary/local-pack) are also unpaid, though local ads can appear there too.',
    ],
    why: [
      'Organic results take most of the clicks for many queries, and you don’t pay for each one. Once a page ranks, it can bring steady [organic traffic](/glossary/organic-traffic) for a long time.',
      'Organic positions can’t be bought. That makes them harder to win but also more trusted by many searchers, and a competitor with a bigger ad budget can’t simply outbid you.',
    ],
    how: {
      heading: 'How to see your organic search performance',
      steps: [
        'Open the Performance report in [Google Search Console](/glossary/google-search-console). It shows clicks, impressions, CTR and average position for organic Google results only.',
        'In Google Analytics 4, filter traffic by the “Organic Search” default channel group to see what organic visitors do on the site.',
        'Track the positions of your target keywords over time with a rank tracker, so you notice gains and drops early.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s search performance view reads your Search Console and GA4 data and highlights queries in positions 5 to 20 that are closest to bringing more organic clicks.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['organic-traffic', 'paid-results', 'serp', 'seo', 'search-engine-marketing'],
    faqs: [
      {
        question: 'What is the difference between organic and paid search?',
        answer: ['Paid search results are ads you pay for per click; organic results are free listings ranked by the search engine’s algorithm. SEO targets organic results and PPC targets paid ones.'],
      },
      {
        question: 'Are featured snippets organic?',
        answer: ['Yes. Featured snippets, People Also Ask and most other SERP features are chosen by Google’s algorithms from indexed pages, so they count as organic.'],
      },
    ],
  },
  {
    slug: 'organic-traffic',
    term: 'Organic traffic',
    aka: ['organic visitors', 'SEO traffic'],
    category: 'basics',
    short: 'Organic traffic is the visitors who reach your site by clicking an unpaid search result rather than an ad, link or social post.',
    definition: [
      'Organic traffic is the visits a website gets from people clicking its unpaid listings in search engines such as Google or Bing. It excludes paid ads, social media, email and direct visits. It is the main outcome SEO is measured by, alongside the leads and sales those visits bring.',
      'Analytics tools sort visits into channels using the referrer and campaign tags. In Google Analytics 4, visits from search engines without ad tracking land in the “Organic Search” channel. Search Console counts something slightly different, clicks from Google’s organic results, so the two numbers rarely match exactly.',
      'SEO tools also estimate organic traffic for any site, including competitors. They multiply each keyword’s [search volume](/glossary/search-volume) by an expected click-through rate for the site’s position. These are estimates, useful for comparison, not a record of real visits.',
    ],
    why: [
      'Organic traffic shows whether your SEO work is reaching people. Rankings alone can mislead: a top position for a keyword nobody searches brings nothing, while a page ranking for hundreds of small queries can bring a lot.',
      'Because the clicks are unpaid, organic traffic often has a lower cost per visitor than ads over time. Its [traffic value](/glossary/traffic-value), what the same clicks would cost as ads, is one way to put a figure on it.',
    ],
    how: {
      heading: 'How to grow organic traffic',
      steps: [
        'Find pages ranking in positions 5 to 20 in Search Console and improve them first; small gains there bring the most clicks.',
        'Rewrite titles and meta descriptions on pages with many impressions but a low [click-through rate](/glossary/click-through-rate).',
        'Fill content gaps: topics your competitors rank for and you don’t.',
        'Fix technical issues that stop pages being indexed.',
        'Earn links to your most important pages.',
      ],
    },
    openseo: {
      body: 'The website traffic checker estimates the organic traffic of up to 100 sites side by side, and the domain overview adds one site’s traffic value and top pages.',
      href: '/tools/website-traffic-checker',
      label: 'Check website traffic',
    },
    related: ['organic-search', 'traffic-value', 'google-analytics-4', 'google-search-console', 'click-through-rate', 'striking-distance-keywords'],
    faqs: [
      {
        question: 'Why does organic traffic differ between Search Console and GA4?',
        answer: ['Search Console counts clicks on Google’s organic results, while GA4 counts sessions from all search engines and only when its tag loads and consent allows it. Ad blockers, consent banners and attribution rules all cause gaps.'],
      },
      {
        question: 'How accurate are organic traffic estimates in SEO tools?',
        answer: ['They are rough. They are modelled from keyword volumes and typical click rates, so treat them as a way to compare sites and spot trends, not as exact visit counts.'],
      },
    ],
  },
  {
    slug: 'serp',
    term: 'SERP (search engine results page)',
    aka: ['search engine results page', 'SERPs', 'results page'],
    category: 'basics',
    short: 'A SERP (search engine results page) is the page a search engine shows after a query: organic links, ads, and features like snippets and maps.',
    definition: [
      'A SERP, or search engine results page, is the page a search engine shows in response to a query. It mixes organic results, paid ads and special features such as featured snippets, maps, images, videos and AI-generated summaries. Every SERP is built for that query, location, device and language.',
      'Modern SERPs are far more than ten blue links. Depending on the query you may see a [local pack](/glossary/local-pack) for “near me” searches, shopping results for products, a [knowledge panel](/glossary/knowledge-panel) for well-known entities, [People Also Ask](/glossary/people-also-ask) boxes and an [AI Overview](/glossary/ai-overviews) at the top. Together these are called [SERP features](/glossary/serp-features).',
      'Results also differ by person. Location, language and device change what appears, which is why rank trackers check from a set location and device rather than your own browser.',
    ],
    why: [
      'The SERP is where you compete. Looking at it tells you what Google thinks the searcher wants: if the top results are all how-to guides, a product page is unlikely to rank. It also shows which features you could win and how much space is left for organic links.',
      'A first position under four ads, a map and an AI Overview may get fewer clicks than a third position on a plain results page, so studying the SERP helps you set realistic expectations.',
    ],
    how: {
      heading: 'How to analyse a SERP',
      steps: [
        'Search the keyword from the country and device you care about, or use a SERP checker so your personal history doesn’t skew it.',
        'Note the page types ranking: guides, lists, product pages, tools, videos. That is the intent Google has settled on.',
        'Note the SERP features present and whether any are realistic for you to win.',
        'Look at the ranking sites’ authority and links to judge how hard it is to break in.',
        'Read the top pages and list what they cover, then plan how yours can be more useful.',
      ],
    },
    openseo: {
      body: 'The SERP checker shows the live top 10 on desktop or mobile, in any country or city, with each result’s authority, links and traffic and the SERP features present.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['serp-features', 'organic-search', 'paid-results', 'search-intent', 'featured-snippet', 'serp-volatility'],
    faqs: [
      {
        question: 'What does SERP stand for?',
        answer: ['SERP stands for search engine results page: the page of results you see after typing a query.'],
      },
      {
        question: 'Why do I see different Google results from my colleague?',
        answer: ['Google tailors results to location, language and device, and sometimes to recent searches. Checking from a fixed location in a neutral tool gives a fairer view.'],
      },
    ],
  },
  {
    slug: 'search-algorithm',
    term: 'Search algorithm',
    aka: ['ranking algorithm', 'Google algorithm'],
    category: 'basics',
    short: 'A search algorithm is the set of systems a search engine uses to decide which indexed pages to show for a query and in what order.',
    definition: [
      'A search algorithm is the collection of rules and machine-learning systems a search engine uses to choose which pages to show for a query and in what order. It weighs many signals, such as relevance to the words searched, content quality, links, freshness, location and page experience, to rank results.',
      'Google’s “algorithm” is really many systems working together. Google documents several in its guide to ranking systems, including [PageRank](/glossary/pagerank) (links), BERT and neural matching (understanding language), the reviews system, freshness systems, deduplication, and [SpamBrain](/glossary/spambrain) for spam detection. Since March 2024 the signals from the former helpful content system are part of the core ranking systems.',
      'Google changes these systems constantly, with thousands of small changes a year and a few broad [core updates](/glossary/core-update). The exact weighting of signals isn’t public.',
      'In broad terms, the algorithm first works out what the query means, including spelling, synonyms and the likely [search intent](/glossary/search-intent). It then finds indexed pages that could be relevant, assesses their quality and usefulness, and considers context such as the searcher’s location, language and device. The final results page can mix web pages with images, videos, local results and AI-generated answers, each chosen by its own systems.',
    ],
    why: [
      'Everything in SEO is an attempt to match what the algorithm rewards. You don’t need its source code: Google states plainly that it aims to reward helpful, reliable, people-first content, and most lasting SEO work follows from that.',
      'Understanding that the algorithm is a set of systems also explains odd behaviour, such as a page ranking well for one query and badly for a near-identical one.',
    ],
    openseo: {
      body: 'Rank tracking in OpenSEO records your positions daily, weekly or monthly, so you can see when an algorithm change moved your pages.',
      href: '/features/rank-tracking',
      label: 'See rank tracking',
    },
    related: ['ranking-factors', 'google-algorithm-update', 'core-update', 'pagerank', 'spambrain', 'helpful-content'],
    faqs: [
      {
        question: 'How often does Google change its algorithm?',
        answer: ['Constantly. Google makes thousands of changes a year, most too small to notice, and announces larger ones such as core and spam updates on its Search Status Dashboard.'],
      },
      {
        question: 'Is the Google algorithm public?',
        answer: ['No. Google publishes guidance and describes its main ranking systems, but not the code or the weights it gives to each signal.'],
      },
    ],
  },
  {
    slug: 'ranking-factors',
    term: 'Ranking factors',
    aka: ['ranking signals', 'Google ranking factors', 'SEO ranking factors'],
    category: 'basics',
    short: 'Ranking factors are the signals search engines use to decide how high a page appears, such as relevance, content quality, links and page experience.',
    definition: [
      'Ranking factors are the signals a search engine weighs when deciding which pages to show and in what order. They include how well a page matches the query, the quality and originality of its content, links from other sites, the searcher’s location and language, freshness, and whether the page is usable on a phone.',
      'Google confirms some signals and says little about others. Confirmed or clearly documented ones include relevance of content to the query, links (through [PageRank](/glossary/pagerank) and related systems), [HTTPS](/glossary/https), [Core Web Vitals](/glossary/core-web-vitals) as part of page experience, mobile-friendliness, and location for local queries. Google has said some things are not ranking factors, including the meta keywords tag, word count and its own Search Quality Rater ratings.',
      'Factors also interact. A fast page with nothing useful on it won’t rank; a great page that can’t be indexed won’t either. Google describes page experience signals as mattering mostly when several pages are similarly relevant.',
    ],
    why: [
      'Knowing which factors carry real weight stops you wasting time. Relevance, helpful content and links tend to matter far more than tweaks like exact keyword placement.',
      'It also protects you from myths. Lists claiming “200 ranking factors” mix confirmed signals with guesses; check claims against Google’s own documentation.',
    ],
    how: {
      heading: 'How to work on ranking factors',
      steps: [
        'Match search intent first: give the searcher the type of page and answer they want.',
        'Make the content genuinely helpful and show real experience and expertise.',
        'Make sure the page is crawlable, indexable, served over HTTPS and works on mobile.',
        'Earn links from relevant, trusted sites and link to the page from your own related pages.',
        'Improve page speed and stability where Core Web Vitals are poor.',
      ],
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings, its links and URL Rating, and the keywords it ranks for, so you can compare it with what ranks above it.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['search-algorithm', 'eeat', 'backlink', 'core-web-vitals', 'search-intent', 'local-ranking-factors'],
    faqs: [
      {
        question: 'What is the most important Google ranking factor?',
        answer: ['Google doesn’t rank its signals publicly. In practice, relevance to the query and helpful content come first, with links as a strong signal of trust between similar pages.'],
      },
      {
        question: 'Is page speed a ranking factor?',
        answer: ['Yes, as part of page experience through Core Web Vitals, but it is a relatively light signal. A faster page won’t outrank a far more relevant one.'],
      },
      {
        question: 'Is word count a ranking factor?',
        answer: ['No. Google has said word count is not a ranking factor. Write as much as the topic needs to answer the query well.'],
      },
    ],
  },
  {
    slug: 'google-algorithm-update',
    term: 'Google algorithm update',
    aka: ['Google update', 'algorithm change'],
    category: 'basics',
    short: 'A Google algorithm update is a change to how Google ranks results. Big ones, like core and spam updates, are announced and can move rankings sharply.',
    definition: [
      'A Google algorithm update is a change Google makes to the systems that rank search results. Most of the thousands of changes it makes each year are small and unannounced. Larger ones, such as core updates, spam updates and reviews updates, are confirmed on the Google Search Status Dashboard and can shift rankings across many sites.',
      'Updates come in a few kinds. [Core updates](/glossary/core-update) are broad changes to how Google assesses content overall. Spam updates improve systems like [SpamBrain](/glossary/spambrain) that catch [Google spam policy](/glossary/google-spam-policies) violations. Others target a specific area, such as product reviews or how a type of SERP feature is chosen. A rollout usually takes days to a couple of weeks.',
      'Some historic updates have names, such as Panda (low-quality content, 2011), Penguin (link spam, 2012) and the helpful content update (2022). Panda and Penguin were later folded into Google’s core systems, and the helpful content system became part of core ranking in March 2024.',
    ],
    why: [
      'An update can raise or cut a site’s traffic overnight without the site changing anything. Knowing when updates roll out lets you tell an algorithm shift apart from a technical problem on your own site, such as an accidental noindex.',
      'Updates also show the direction Google is heading: towards rewarding first-hand, people-first content and against scaled, low-value pages.',
    ],
    how: {
      heading: 'How to check if an update hit your site',
      steps: [
        'Check the Google Search Status Dashboard for updates around the date your traffic changed.',
        'Compare clicks and positions in Search Console before and after, using at least a week on each side of the rollout.',
        'Rule out technical causes first: indexing drops, server errors, robots.txt changes or a site migration.',
        'Look at which pages and queries moved. A broad, site-wide drop points to a core or spam update; one section points to something specific.',
        'Check Search Console’s Manual actions report. An algorithm update is not a manual action, but you should rule one out.',
        'Improve content quality based on what now ranks, rather than making quick fixes, and wait for the next update to see recovery.',
      ],
    },
    openseo: {
      body: 'Rank tracking keeps a daily, weekly or monthly history of your positions and competitors’, so you can line up ranking moves with update dates.',
      href: '/features/rank-tracking',
      label: 'See rank tracking',
    },
    related: ['core-update', 'search-algorithm', 'serp-volatility', 'algorithmic-penalty', 'helpful-content', 'spambrain'],
    faqs: [
      {
        question: 'How many times a year does Google update its algorithm?',
        answer: ['Google makes thousands of changes a year. Only a handful, typically several core updates and a few spam updates, are announced.'],
      },
      {
        question: 'Is an algorithm update the same as a Google penalty?',
        answer: ['No. A manual action is a reviewer’s decision that appears in Search Console. An update is an automatic change that affects many sites, and losing rankings in one is not a penalty you can appeal.'],
      },
    ],
  },
  {
    slug: 'core-update',
    term: 'Google core update',
    aka: ['broad core update', 'core algorithm update'],
    category: 'basics',
    short: 'A Google core update is a broad change to Google’s main ranking systems, released several times a year, that can move rankings for many sites.',
    definition: [
      'A Google core update is a significant, broad change to Google’s core ranking systems, the systems that judge how relevant and useful content is overall. Google releases several each year, announces them on the Search Status Dashboard, and rollouts typically take around two weeks. They are not aimed at any particular site or type of site.',
      'Google explains core updates with an analogy: it is like refreshing a list of the best films. The older films haven’t got worse; newer or previously underrated ones may now deserve a higher place. A drop after a core update doesn’t necessarily mean something is wrong with your page, only that Google now judges other pages more useful for those queries.',
      'The March 2024 core update was unusually large and folded the helpful content system into core ranking, so judgements about [helpful content](/glossary/helpful-content) now come from the core systems.',
    ],
    why: [
      'Core updates cause some of the biggest traffic swings in SEO, both up and down. Sites that rely on organic traffic need to recognise them and respond sensibly instead of panicking.',
      'There is no quick fix for a core update drop. Google advises improving content quality overall and notes that recovery, if it comes, often shows at a later core update.',
    ],
    how: {
      heading: 'How to respond to a core update',
      steps: [
        'Wait until the rollout is finished before drawing conclusions.',
        'In Search Console, compare a week or more after the update with a similar period before it.',
        'Identify which pages lost the most and look at the pages that now outrank them.',
        'Assess your content honestly against Google’s questions on helpful, people-first content and [E-E-A-T](/glossary/eeat).',
        'Improve or consolidate weak pages rather than deleting at random. Avoid quick tweaks made only for search engines.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s search performance view compares periods in your Search Console data, which makes it easier to see which queries and pages moved after an update.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['google-algorithm-update', 'helpful-content', 'eeat', 'serp-volatility', 'content-audit'],
    faqs: [
      {
        question: 'How long does a Google core update take to roll out?',
        answer: ['Usually about two weeks, though some have taken longer. Google posts the start and end on the Search Status Dashboard.'],
      },
      {
        question: 'How do I recover from a core update?',
        answer: ['Focus on improving content quality and usefulness across the site. Google says changes may take months to be reflected, and recovery often shows at the next core update.'],
      },
    ],
  },
  {
    slug: 'crawling',
    term: 'Crawling',
    aka: ['web crawling', 'crawl', 'spidering'],
    category: 'basics',
    short: 'Crawling is how search engines discover pages: automated bots fetch URLs and follow the links on them to find more pages.',
    definition: [
      'Crawling is the process by which search engines discover pages on the web. Automated programs called crawlers or bots, such as [Googlebot](/glossary/googlebot), request URLs, download the content and follow the links they find to reach new pages. Crawling is the first step: a page that is never crawled can’t be indexed or ranked.',
      'A crawler starts from URLs it already knows, from earlier crawls, links on other sites and [XML sitemaps](/glossary/xml-sitemap) you submit. For each URL it checks [robots.txt](/glossary/robots-txt) to see whether it is allowed in, requests the page, notes the [HTTP status code](/glossary/http-status-codes), and passes the content on for processing. Links found on the page are added to a queue to crawl later.',
      'Google decides how often and how much to crawl a site. Its [crawl budget](/glossary/crawl-budget) depends on how much your server can handle without slowing down (the crawl capacity limit) and how much Google wants to crawl your URLs, based on their popularity and how often they change (crawl demand). Popular, frequently updated pages are crawled more often than old, rarely linked ones.',
      'Crawling and [indexing](/glossary/indexing) are different steps. A crawled page may still not be indexed, for example because it has a noindex tag, is a duplicate of another URL, or Google judged it not useful enough. Equally, robots.txt stops crawling, not indexing: a blocked URL can still appear in results, without a description, if other sites link to it.',
      'Google uses a mobile crawler (Googlebot Smartphone) for most sites, because indexing is mobile-first. After fetching, Google renders pages that rely on JavaScript in a recent version of Chromium, which can happen some time after the first fetch. Links that only exist after JavaScript runs can still be found, but plain HTML links with an href are the most reliable way to be discovered.',
    ],
    why: [
      'If a search engine can’t crawl a page, nothing else you do for that page matters. Crawl problems are common and often invisible: a stray robots.txt rule, a broken internal link, a login wall, a server that times out, or navigation built only with JavaScript click handlers.',
      'For small sites, Google says crawl budget is rarely a concern. For large sites, with hundreds of thousands or millions of URLs, endless [faceted navigation](/glossary/faceted-navigation), [URL parameters](/glossary/url-parameters) and duplicate URLs can waste crawling on unimportant pages while new or updated ones wait.',
      'Crawl health also affects freshness. When you update prices or publish news, you want the change picked up quickly. Fast servers, clean internal linking and accurate sitemaps help crawlers find what changed.',
    ],
    how: {
      heading: 'How to make your site easy to crawl',
      steps: [
        'Check robots.txt and make sure it doesn’t block pages, CSS or JavaScript that you want indexed.',
        'Link to every important page from at least one other crawlable page, with normal <a href> links. Avoid [orphan pages](/glossary/orphan-page).',
        'Keep important pages within a few clicks of the homepage; a flat [site architecture](/glossary/site-architecture) is easier to crawl.',
        'Submit an XML sitemap that lists only canonical, indexable URLs returning 200, with accurate lastmod dates.',
        'Fix broken links, [redirect chains](/glossary/redirect-chain) and 5xx server errors, which waste crawls.',
        'Keep the server fast. Slow responses and errors make Google slow its crawl rate.',
        'On large sites, stop crawlers wandering into infinite URL spaces: limit crawlable filter combinations and parameters.',
        'Watch the Crawl stats report in Search Console and, on big sites, your server logs, to see what Googlebot actually requests.',
      ],
    },
    example: {
      label: 'A crawl path',
      body: 'Googlebot fetches example.com/, reads robots.txt, which allows it, and finds links to /blog/ and /products/. It fetches /blog/ and finds links to ten articles, then queues them. One article links to /products/blue-mug, which is not in the sitemap but is now discovered through that link. A filter link like /products/?colour=blue&size=s&sort=price creates thousands of near-identical URLs; if left open, Googlebot may spend many requests there instead of on new articles.',
    },
    openseo: {
      body: 'OpenSEO’s site audit runs its own crawler over your site the way a search engine would, flagging broken links, redirects, blocked pages, orphan pages and 59 technical checks in total.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['indexing', 'rendering', 'googlebot', 'web-crawler', 'robots-txt', 'crawl-budget', 'xml-sitemap', 'log-file-analysis'],
    faqs: [
      {
        question: 'What is the difference between crawling and indexing?',
        answer: ['Crawling is fetching a page; indexing is analysing it and storing it so it can appear in results. A page can be crawled and still not indexed.'],
      },
      {
        question: 'How do I get Google to crawl my site?',
        answer: ['Link to your pages from pages Google already knows, submit an XML sitemap in Search Console, and use URL Inspection to request indexing of an individual URL. Requesting indexing does not guarantee it.'],
      },
      {
        question: 'How often does Google crawl a website?',
        answer: ['It varies by site and page. Popular, frequently changing pages may be crawled several times a day, others only every few weeks or months. The Crawl stats report in Search Console shows your site’s pattern.'],
      },
      {
        question: 'Does blocking a page in robots.txt remove it from Google?',
        answer: ['No. Robots.txt stops crawling, but a blocked URL can still be indexed from links. To keep a page out of results, allow crawling and use a noindex tag instead.'],
      },
    ],
  },
  {
    slug: 'indexing',
    term: 'Indexing',
    aka: ['search engine indexing', 'Google indexing', 'indexation'],
    category: 'basics',
    short: 'Indexing is when a search engine analyses a crawled page and stores it in its index, so it becomes eligible to appear in search results.',
    definition: [
      'Indexing is the step where a search engine processes a crawled page and stores information about it in its index, a huge database of web content. Only indexed pages can appear in search results. During indexing, the engine reads the text, titles, links, images and structured data, and decides which URL is the canonical version.',
      'Indexing happens after [crawling](/glossary/crawling) and, for pages that use JavaScript, after [rendering](/glossary/rendering). Google analyses the page’s content and meaning, identifies its language and the queries it might answer, and groups duplicates together. From a group of similar pages it chooses one canonical URL to show; the others are treated as duplicates. Your [canonical tag](/glossary/canonical-tag) is a strong hint, not a command.',
      'You can control indexing in a few ways. A [meta robots tag](/glossary/meta-robots-tag) or X-Robots-Tag header with noindex keeps a page out. A canonical tag suggests which duplicate to keep. A 301 redirect tells Google to index the destination instead. A 404 or 410 status tells it the page is gone, and Google drops it after recrawling. An [XML sitemap](/glossary/xml-sitemap) lists the URLs you want indexed, but listing a URL doesn’t force Google to index it.',
      'Indexing is not guaranteed. Google states it does not index every page it finds. A page may be left out because it carries a [noindex](/glossary/noindex) rule, duplicates another page, is low quality or [thin](/glossary/thin-content), returns an error, or because Google simply hasn’t got to it yet. Search Console’s Page indexing report lists the reasons, such as “Crawled - currently not indexed” (Google fetched it and chose not to index it) and “Discovered - currently not indexed” (Google knows the URL but hasn’t crawled it yet).',
      'Since mobile-first indexing became the default, Google mainly indexes the mobile version of each page. Content that only exists on your desktop version may not be indexed at all.',
    ],
    why: [
      'If a page isn’t indexed, it gets zero search traffic, whatever its quality. Indexing problems are some of the most common reasons important pages go missing from Google, and they are often caused by a single tag or setting.',
      'The opposite problem matters too. [Index bloat](/glossary/index-bloat), thousands of thin, duplicate or parameter URLs in the index, can dilute your site’s quality signals and waste crawl budget. Good SEO controls what is indexed, not just whether pages are.',
      'Indexing is also where Google forms its view of what each page is about. Clear titles, headings, internal links and structured data help it understand and file the page correctly.',
    ],
    how: {
      heading: 'How to get a page indexed',
      steps: [
        'Inspect the URL in [Google Search Console](/glossary/google-search-console). The URL Inspection tool shows whether it is indexed, the canonical Google chose, and any blocking issue.',
        'Remove anything blocking it: a noindex meta tag or X-Robots-Tag header, a robots.txt disallow rule, or a login requirement.',
        'Make sure the page returns a 200 status code and that its canonical tag points to itself (or to the version you want indexed).',
        'Link to it from relevant, already-indexed pages on your site, and include it in your XML sitemap.',
        'Make the content substantial and distinct. Pages that duplicate others or add little are often crawled but not indexed.',
        'Click “Request indexing” in URL Inspection for new or updated important pages. Use it sparingly; it queues a crawl but doesn’t guarantee indexing.',
        'Check the Page indexing report every few weeks for important URLs moving into excluded states.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- Lets Google index this page (the default; no tag needed) -->\n<link rel="canonical" href="https://example.com/guides/indexing">\n\n<!-- Keeps a page out of the index -->\n<meta name="robots" content="noindex">',
    },
    openseo: {
      body: 'The site audit flags indexability problems across your site, including noindex tags, canonical conflicts, non-200 pages in sitemaps and orphan pages.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawling', 'rendering', 'noindex', 'canonical-tag', 'index-bloat', 'google-search-console', 'mobile-first-indexing', 'deindexing'],
    faqs: [
      {
        question: 'How long does it take Google to index a new page?',
        answer: ['Anything from a few hours to several weeks. Pages on established, well-linked sites tend to be indexed faster than pages on a brand-new site.'],
      },
      {
        question: 'How do I check if a page is indexed?',
        answer: ['Use the URL Inspection tool in Search Console for a definitive answer. A site: search, such as site:example.com/page, gives a rough indication only.'],
      },
      {
        question: 'What does “Crawled - currently not indexed” mean?',
        answer: ['Google fetched the page but decided not to index it, at least for now. It usually points to thin, duplicate or low-value content, or weak internal linking. Improving the page and linking to it helps.'],
      },
      {
        question: 'Can I force Google to index my page?',
        answer: ['No. You can request indexing in Search Console, but Google decides. Making the page useful, unique and well linked is the most reliable route.'],
      },
    ],
  },
  {
    slug: 'rendering',
    term: 'Rendering',
    aka: ['page rendering', 'JavaScript rendering', 'web rendering'],
    category: 'basics',
    short: 'Rendering is when a search engine runs a page’s HTML, CSS and JavaScript to build the page as a browser would, so it can see the final content.',
    definition: [
      'Rendering is the step in which a search engine executes a page’s code, HTML, CSS and JavaScript, to build the page the way a browser shows it. For pages whose content or links are added by JavaScript, rendering is what lets the search engine see that content. Google renders pages using a recent version of Chromium.',
      'Google’s process runs in stages: crawl the raw HTML, queue the page for rendering, render it in a headless browser, then index the rendered result. Rendering takes resources, so it may happen a little after the first crawl. If JavaScript fails, times out or is blocked by robots.txt, Google may index an incomplete page.',
      'How your site is built changes how much rendering matters. With [server-side rendering](/glossary/server-side-rendering) the HTML already contains the content. With [client-side rendering](/glossary/client-side-rendering) the first HTML is mostly empty, and everything depends on the search engine running your JavaScript. Some other crawlers, including many AI crawlers, may not run JavaScript at all.',
    ],
    why: [
      'If key text, links or metadata appear only after JavaScript runs, any rendering failure hides them from search. This is a common cause of single-page apps ranking poorly. See [JavaScript SEO](/glossary/javascript-seo).',
      'Rendering also affects what Google sees for layout and mobile usability, and whether lazily loaded content is found.',
    ],
    how: {
      heading: 'How to check how Google renders a page',
      steps: [
        'Open the URL Inspection tool in Search Console, run a live test and view the rendered HTML and screenshot.',
        'Compare the rendered HTML with what you see in the browser. Missing text or links point to rendering problems.',
        'Make sure robots.txt doesn’t block the JavaScript and CSS files the page needs.',
        'Put critical content, links, titles and canonical tags in the server-sent HTML where possible.',
      ],
    },
    openseo: {
      body: 'The site audit includes Lighthouse runs on mobile and desktop, which help spot render-blocking resources and slow JavaScript.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawling', 'indexing', 'javascript-seo', 'server-side-rendering', 'client-side-rendering', 'render-blocking-resources'],
    faqs: [
      {
        question: 'Can Google render JavaScript?',
        answer: ['Yes. Googlebot uses an evergreen version of Chromium and runs most modern JavaScript. It still helps to keep important content in the initial HTML, because rendering can fail or be delayed.'],
      },
      {
        question: 'Do AI crawlers render JavaScript?',
        answer: ['Many don’t, or not reliably. If you want AI tools to read your pages, serve the main content in the HTML itself.'],
      },
    ],
  },
  {
    slug: 'googlebot',
    term: 'Googlebot',
    aka: ['Google crawler', 'Google spider', 'Googlebot Smartphone'],
    category: 'basics',
    short: 'Googlebot is Google’s web crawler. It fetches pages so Google Search can index them, using a smartphone crawler for most sites.',
    definition: [
      'Googlebot is the web crawler Google uses to find and fetch pages for Google Search. It comes in two main types, Googlebot Smartphone and Googlebot Desktop, and because of mobile-first indexing most sites are crawled mainly by the smartphone crawler. Googlebot respects robots.txt rules aimed at it.',
      'Googlebot identifies itself in the [user agent](/glossary/user-agent) string, but anyone can fake that, so Google recommends verifying real Googlebot traffic with a reverse DNS lookup (the host should end in googlebot.com or google.com) or by checking against Google’s published IP ranges. Google also runs other crawlers, such as Googlebot Image and Googlebot Video, plus special-purpose fetchers. Google-Extended is not a separate crawler but a robots.txt token that controls whether content may be used for training and grounding Gemini models; it doesn’t affect Search.',
      'Googlebot fetches up to the first 15MB of an HTML or supported text file, then renders the page with an evergreen Chromium.',
    ],
    why: [
      'If Googlebot can’t reach a page, Google can’t index it. Blocking it by mistake, through robots.txt, a firewall, a bot-protection service or rate limiting, is a quick way to lose rankings.',
      'Watching what Googlebot crawls tells you whether Google spends its time on the pages you care about. See [log file analysis](/glossary/log-file-analysis).',
    ],
    how: {
      heading: 'How to check Googlebot can access your site',
      steps: [
        'Run a live test in Search Console’s URL Inspection tool to see if Googlebot can fetch and render the page.',
        'Check the Crawl stats report for errors, response times and the share of requests by Googlebot type.',
        'Make sure your firewall or CDN bot protection allows verified Googlebot.',
        'Verify suspicious “Googlebot” hits in your logs with reverse DNS before trusting them.',
      ],
    },
    example: {
      label: 'robots.txt',
      code: '# Rules for Googlebot only\nUser-agent: Googlebot\nDisallow: /internal-search/\n\n# Rules for everyone else\nUser-agent: *\nDisallow: /admin/',
    },
    openseo: {
      body: 'OpenSEO’s site audit crawls your site and flags pages blocked by robots.txt or returning errors, the same problems that stop Googlebot.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['web-crawler', 'crawling', 'robots-txt', 'user-agent', 'crawl-budget', 'mobile-first-indexing', 'ai-crawlers'],
    faqs: [
      {
        question: 'How do I know if a visit is really Googlebot?',
        answer: ['Do a reverse DNS lookup on the IP address; it should resolve to googlebot.com or google.com, and a forward lookup should return the same IP. Google also publishes its crawler IP ranges.'],
      },
      {
        question: 'Does blocking Google-Extended affect my rankings?',
        answer: ['No. Google says Google-Extended doesn’t affect inclusion or ranking in Google Search. It only controls use in Gemini models.'],
      },
    ],
  },
  {
    slug: 'web-crawler',
    term: 'Web crawler',
    aka: ['crawler', 'spider', 'bot', 'search engine bot'],
    category: 'basics',
    short: 'A web crawler is an automated program that visits web pages, downloads them and follows their links, used by search engines and SEO tools.',
    definition: [
      'A web crawler, also called a spider or bot, is an automated program that browses the web by requesting pages and following the links on them. Search engines use crawlers to discover content for their index; SEO tools use them to audit sites; AI companies use them to collect content for models and live answers.',
      'Well-known crawlers include [Googlebot](/glossary/googlebot), Bingbot, Applebot, and AI crawlers such as GPTBot, OAI-SearchBot and ClaudeBot. Reputable crawlers identify themselves in their [user agent](/glossary/user-agent) and follow [robots.txt](/glossary/robots-txt). Bad bots often ignore robots.txt and pretend to be a browser or Googlebot.',
    ],
    why: [
      'Crawlers are how your pages get into search engines and, increasingly, AI answers. Knowing which bots visit, and controlling them with robots.txt, lets you allow the useful ones and limit those that only cost you bandwidth.',
      'Running a crawler over your own site is also the fastest way to find broken links, redirects and missing tags, because it sees the site the way a search engine does. An [SEO audit](/glossary/seo-audit) usually starts with exactly that crawl.',
      'Crawlers have limits. Many don’t run JavaScript, most only follow links in plain <a href> elements, and all of them give up on pages that time out or return errors. If your content only appears after a click or a script, some crawlers will never see it.',
    ],
    how: {
      heading: 'How to control web crawlers',
      steps: [
        'Use robots.txt to allow or disallow crawlers by user agent.',
        'Use noindex for pages you want crawled but kept out of search results.',
        'Check server logs to see which crawlers visit and how often.',
        'Block abusive bots at the firewall or CDN, since they may ignore robots.txt.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit uses its own crawler to walk your site and report technical problems with a health score.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['googlebot', 'crawling', 'robots-txt', 'ai-crawlers', 'user-agent', 'log-file-analysis'],
    faqs: [
      {
        question: 'Is a web crawler the same as a scraper?',
        answer: ['They overlap. A crawler discovers pages by following links; a scraper extracts specific data from pages. Many tools do both.'],
      },
      {
        question: 'Do all crawlers obey robots.txt?',
        answer: ['No. Robots.txt is a voluntary standard. Search engine and most AI company crawlers follow it, but malicious bots often don’t.'],
      },
    ],
  },
  {
    slug: 'on-page-seo',
    term: 'On-page SEO',
    aka: ['on-site SEO', 'on-page optimisation', 'on-page optimization'],
    category: 'basics',
    short: 'On-page SEO is optimising the content and HTML of each page, such as text, title tag, headings, images and internal links, to rank and earn clicks.',
    definition: [
      'On-page SEO is the practice of optimising the content and HTML of individual pages so search engines understand them and searchers choose them. It covers the main text, the [title tag](/glossary/title-tag), [meta description](/glossary/meta-description), headings, URL, images and [internal links](/glossary/internal-links), and how well the page answers the search intent behind its target keyword.',
      'On-page SEO sits between the other two parts of SEO. [Technical SEO](/glossary/technical-seo) makes sure the page can be crawled and indexed at all. [Off-page SEO](/glossary/off-page-seo) builds the reputation that comes from elsewhere. On-page SEO is everything you control on the page itself, and it is usually the fastest of the three to change.',
      'The most important on-page factor is content that matches [search intent](/glossary/search-intent). If people searching “best running shoes” want comparisons, a single product page won’t rank however well its tags are written. After intent come the signals that help Google read the page: a descriptive title, a clear H1, logical subheadings, the topic’s key terms used naturally, descriptive alt text and links to related pages.',
      'Some on-page elements mainly affect clicks rather than rankings. The meta description isn’t a ranking factor, but a good one can raise your click-through rate. Google often rewrites both titles and descriptions in results when it thinks another wording better fits the query, so honest, specific copy tends to survive best.',
      'On-page SEO has changed. Old advice to repeat a keyword a set number of times, or to stuff it into meta keywords, no longer helps and can look like [keyword stuffing](/glossary/keyword-stuffing). Modern search understands synonyms and related ideas, so cover the topic thoroughly in plain language instead of chasing an exact-match density.',
    ],
    why: [
      'On-page SEO tells search engines what a page is about and whether it deserves to rank for a query. Two pages with similar links can rank very differently because one answers the question clearly and the other doesn’t.',
      'It is also fully under your control and quick to act on. You can’t make another site link to you today, but you can rewrite a vague title, add a missing section or link a new page from your strongest one this afternoon.',
      'Good on-page work improves the visit, not just the ranking. Clear headings, useful images and relevant internal links help people find what they came for, which supports conversions as well as SEO.',
    ],
    how: {
      heading: 'How to do on-page SEO',
      steps: [
        'Choose one [primary keyword](/glossary/primary-keyword) per page and check the SERP to see what type of page ranks.',
        'Write content that fully answers that intent, with first-hand detail, examples and anything that adds information the top results lack.',
        'Write a unique title tag that leads with the topic and stays roughly within 50 to 60 characters so it isn’t cut off.',
        'Write a meta description that summarises the page and gives a reason to click, around 150 to 160 characters.',
        'Use one clear H1 and break the content up with descriptive H2 and H3 headings in a logical order.',
        'Keep the URL short and readable, with hyphens between words.',
        'Add images with descriptive alt text, compressed and sized correctly.',
        'Link to the page from related pages on your site with descriptive anchor text, and link out from it to related pages.',
        'Add structured data where a matching rich result exists, such as Product, Article or Recipe.',
        'Review the page in Search Console after a few weeks and refine the title, sections and links based on the queries it actually gets.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<head>\n  <title>How to Repot a Snake Plant (Step by Step)</title>\n  <meta name="description" content="Repot a snake plant in 6 steps: when to do it, what soil and pot to use, and how to avoid root rot. With photos.">\n  <link rel="canonical" href="https://example.com/guides/repot-snake-plant">\n</head>\n<body>\n  <h1>How to repot a snake plant</h1>\n  <h2>When to repot</h2>\n  <h2>What you need</h2>\n  <img src="/img/snake-plant-roots.webp" alt="Snake plant with roots circling the bottom of its pot" width="800" height="600">\n</body>',
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings, and shows the keywords it ranks for and its strongest backlinks.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['title-tag', 'meta-description', 'header-tags', 'internal-links', 'content-optimization', 'on-page-checklist', 'search-intent', 'technical-seo'],
    faqs: [
      {
        question: 'What is the difference between on-page and off-page SEO?',
        answer: ['On-page SEO covers everything on your own pages, such as content, titles, headings and internal links. Off-page SEO covers signals from elsewhere, mainly backlinks, mentions and reviews.'],
      },
      {
        question: 'Is on-page SEO still important?',
        answer: ['Yes. Search engines still need clear signals of what a page is about, and content that matches intent remains the foundation of ranking.'],
      },
      {
        question: 'How many times should I use a keyword on a page?',
        answer: ['There is no target number. Use the main term in the title, H1 and early on where it reads naturally, then cover the topic fully with related words. Repetition for its own sake doesn’t help.'],
      },
      {
        question: 'Do meta keywords help on-page SEO?',
        answer: ['No. Google has ignored the meta keywords tag for ranking since at least 2009.'],
      },
    ],
  },
  {
    slug: 'off-page-seo',
    term: 'Off-page SEO',
    aka: ['off-site SEO', 'off-page optimisation', 'off-page optimization'],
    category: 'basics',
    short: 'Off-page SEO is everything done outside your own site to build its reputation and rankings, mainly earning backlinks, mentions and reviews.',
    definition: [
      'Off-page SEO is the work done outside your own website to improve its standing in search results. Its core is earning [backlinks](/glossary/backlink) from other sites, but it also includes brand mentions, reviews, local citations, social and community presence, and digital PR. Together these signal to search engines that others trust and recommend you.',
      'Links have been central to Google since its [PageRank](/glossary/pagerank) algorithm. A link from another site works like a vote: it helps Google discover your page and suggests it is worth something. Not all votes are equal. A link from a respected, relevant site counts for far more than dozens from unrelated or low-quality sites, and links that are paid or swapped to manipulate rankings break Google’s rules on [link schemes](/glossary/link-schemes).',
      'Off-page SEO goes beyond links. For local businesses, [online reviews](/glossary/online-reviews), a complete Google Business Profile and consistent [local citations](/glossary/local-citations) affect map rankings. For AI search, being mentioned and cited by trusted publications helps AI assistants recognise your brand. And the reputation signals that Google’s quality raters look for under [E-E-A-T](/glossary/eeat), what independent sources say about a site or author, are largely off-page.',
      'The safe approach is to earn attention rather than manufacture it: publish things worth linking to and get them in front of the people who would care. [Link building](/glossary/link-building) done this way, through [digital PR](/glossary/digital-pr), original research, useful tools and genuine relationships, builds lasting value. Shortcuts such as [private blog networks](/glossary/private-blog-network) or bought links risk manual actions and links that Google simply ignores.',
      'Quality matters far more than quantity. A useful way to judge a link is to ask whether it would be worth having if search engines didn’t exist: would it send relevant visitors, and did the other site choose to link because your page helps their readers? Links that pass that test are [editorial links](/glossary/editorial-links), the kind Google’s systems are built to value. Counting [referring domains](/glossary/referring-domain), how many different sites link to you, usually tells you more than counting total links, because a hundred links from one site are usually worth much less than one link each from a hundred different sites.',
      'Off-page signals take longer to build than on-page ones and are partly outside your control. That is also why they are valuable: a competitor can copy your page structure overnight but can’t copy years of earned links and reputation.',
    ],
    why: [
      'For competitive queries, many pages are equally relevant and well written. Off-page signals, especially links from trusted sites, are often what separates the top results from the rest.',
      'Off-page work also brings value beyond rankings: referral traffic from the linking sites, brand awareness, and trust from customers who see you mentioned in places they already read.',
      'Monitoring your off-page profile protects you too. Lost links, sudden spammy links or negative reviews are easier to deal with when you notice them early.',
    ],
    how: {
      heading: 'How to do off-page SEO',
      steps: [
        'Audit your current backlink profile: how many referring domains you have, which pages attract links and which anchors are used.',
        'Look at which sites link to your competitors but not to you, using a [link intersect](/glossary/link-intersect) report.',
        'Create linkable assets: original data, free tools, in-depth guides, templates or expert commentary.',
        'Pitch journalists, bloggers and resource pages that cover your topic, with something genuinely useful for their readers.',
        'Turn [unlinked brand mentions](/glossary/unlinked-mentions) into links by politely asking the author to add one.',
        'Reclaim lost links by fixing broken pages that used to attract links, or redirecting them to the right replacement.',
        'For local businesses, complete your Google Business Profile, keep NAP details consistent and ask customers for reviews.',
        'Avoid paying for links that pass ranking credit. If a link is paid or sponsored, it should carry rel="sponsored" or rel="nofollow".',
      ],
    },
    openseo: {
      body: 'The backlink checker shows any site’s backlinks, referring domains, anchors, new and lost links by month, and a link intersect to find sites that link to competitors but not you.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['backlink', 'link-building', 'referring-domain', 'digital-pr', 'brand-mentions', 'online-reviews', 'link-schemes', 'on-page-seo'],
    faqs: [
      {
        question: 'Is off-page SEO just link building?',
        answer: ['Link building is the biggest part, but off-page SEO also covers brand mentions, reviews, local citations, PR and community presence.'],
      },
      {
        question: 'Do social media shares help SEO?',
        answer: ['Google has said social signals such as likes and shares are not a direct ranking factor. Social activity can still help indirectly by getting content seen by people who may link to it.'],
      },
      {
        question: 'Is it against Google’s rules to buy backlinks?',
        answer: ['Buying links that pass ranking credit is a link scheme under Google’s spam policies. Paid placements are fine if the link is marked rel="sponsored" or rel="nofollow".'],
      },
      {
        question: 'How many backlinks do I need to rank?',
        answer: ['There is no fixed number. It depends on the links the pages already ranking have. Compare referring domains and their quality for the top results, rather than aiming for a count.'],
      },
    ],
  },
  {
    slug: 'technical-seo',
    term: 'Technical SEO',
    aka: ['technical search engine optimisation', 'tech SEO'],
    category: 'basics',
    short: 'Technical SEO is making sure search engines can crawl, render and index your site, covering speed, redirects, canonicals, sitemaps and mobile.',
    definition: [
      'Technical SEO is the work of making a website easy for search engines to crawl, render, understand and index. It covers site structure, [robots.txt](/glossary/robots-txt), XML sitemaps, redirects, canonical tags, HTTP status codes, page speed, mobile usability, HTTPS, structured data and JavaScript rendering. It is the foundation that on-page and off-page SEO depend on.',
      'Think of it in the order a search engine works. First it must reach your pages: technical SEO removes [crawling](/glossary/crawling) barriers such as broken links, server errors, robots.txt blocks and pages that no internal link points to. Then it must see the content: if you rely on JavaScript, the page has to render correctly. Then it must decide what to store: canonical tags, noindex rules, redirects and duplicate handling tell it which URLs matter. Finally, the page experience, speed, stability and mobile layout, feeds into how the page is treated in ranking.',
      'Typical technical SEO tasks include fixing [404 errors](/glossary/404-error) and [redirect chains](/glossary/redirect-chain), setting [canonical tags](/glossary/canonical-tag) on duplicate URLs, keeping a clean XML sitemap, controlling [faceted navigation](/glossary/faceted-navigation) and parameters on big sites, adding [hreflang](/glossary/hreflang) for multi-language sites, adding [structured data](/glossary/structured-data) for rich results, and improving [Core Web Vitals](/glossary/core-web-vitals): LCP of 2.5 seconds or less, INP of 200 milliseconds or less and CLS of 0.1 or less.',
      'Site migrations, changing domain, platform or URL structure, are among the riskiest technical SEO projects. Without a careful redirect map, a site can lose much of its organic traffic.',
      'Technical SEO doesn’t make a page rank by itself. A technically perfect page with weak content won’t win. But technical problems can stop excellent content from ranking at all, and on large sites a single template bug can affect thousands of URLs at once.',
    ],
    why: [
      'If search engines can’t crawl or index a page, nothing else you do for it counts. Technical issues are often invisible to visitors, a page looks fine in a browser but carries a noindex tag, so they can go unnoticed for months.',
      'Technical SEO scales. Fixing a template, an internal linking pattern or a redirect rule can improve hundreds or thousands of pages in one change, which makes it high value on large sites.',
      'It also improves the site for users. Faster pages, fewer broken links and a site that works on every phone help conversions as well as rankings.',
    ],
    how: {
      heading: 'How to do a technical SEO audit',
      steps: [
        'Crawl the whole site with an SEO crawler to collect status codes, titles, canonicals, directives and internal links for every URL.',
        'Check indexing in Search Console’s Page indexing report and compare with the crawl: are your important pages indexed, and are junk URLs being indexed?',
        'Review robots.txt and the XML sitemap. The sitemap should list only canonical, indexable 200 pages.',
        'Fix broken internal links, redirect chains and loops, and update links to point straight to the final URL.',
        'Check canonical tags and duplicates: each set of duplicate pages should point to one preferred URL.',
        'Test mobile usability and Core Web Vitals with Search Console’s Core Web Vitals report, PageSpeed Insights or Lighthouse.',
        'Check rendering for JavaScript-heavy templates with URL Inspection.',
        'Validate structured data with the Rich Results Test.',
        'Confirm the site is served over HTTPS with no mixed content and that HTTP redirects to HTTPS.',
        'Prioritise fixes by impact: problems on many pages or on your most valuable pages first.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit runs its own crawler with 59 technical checks and a health score, plus Lighthouse mobile and desktop tests. Every issue is explained in the audit checks docs.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['crawling', 'indexing', 'rendering', 'site-architecture', 'core-web-vitals', 'canonical-tag', 'xml-sitemap', 'seo-audit'],
    faqs: [
      {
        question: 'What is the difference between technical SEO and on-page SEO?',
        answer: ['Technical SEO is about the site’s infrastructure: whether pages can be crawled, rendered and indexed, and how fast they are. On-page SEO is about each page’s content and HTML elements such as titles and headings.'],
      },
      {
        question: 'Do I need to code to do technical SEO?',
        answer: ['Not always. You can find most issues with crawlers and Search Console. Fixing them may need a developer or CMS settings, and understanding basic HTML helps a lot.'],
      },
      {
        question: 'How often should I run a technical SEO audit?',
        answer: ['Run a full audit at least a few times a year and after any major change such as a redesign or migration. Large sites benefit from scheduled weekly crawls.'],
      },
      {
        question: 'Are Core Web Vitals part of technical SEO?',
        answer: ['Yes. They measure loading (LCP), responsiveness (INP) and visual stability (CLS), and are part of Google’s page experience signals.'],
      },
    ],
  },
  {
    slug: 'international-seo',
    term: 'International SEO',
    aka: ['multilingual SEO', 'multi-regional SEO', 'global SEO'],
    category: 'basics',
    short: 'International SEO is optimising a site to rank in several countries or languages, using the right URL structure, hreflang and localised content.',
    definition: [
      'International SEO is the practice of setting up a website so search engines show the right version to people in different countries or speaking different languages. It covers choosing a URL structure, adding [hreflang](/glossary/hreflang) annotations, translating and localising content, and doing keyword research separately for each market.',
      'There are three common URL structures. Country-code domains such as example.de give the clearest country signal but split authority across sites. Subdirectories such as example.com/de/ keep everything on one domain and are easiest to maintain. Subdomains such as de.example.com sit in between. Google says all can work; choose based on your business and resources.',
      'Hreflang tells Google which language or regional version to show for a given searcher, and helps it treat translated pages as alternatives rather than duplicates. Google says it doesn’t use the HTML [lang attribute](/glossary/lang-attribute) to determine language, but works it out from the content.',
    ],
    why: [
      'Without a clear setup, the wrong version may rank: your US page in the UK, or English content for Spanish searchers. That means lost clicks and confused visitors.',
      'Keywords also differ between markets. People in different countries use different words, currencies and spellings, so direct translation often misses what people actually search.',
    ],
    how: {
      heading: 'How to set up international SEO',
      steps: [
        'Decide whether you are targeting languages, countries, or both.',
        'Choose a URL structure: ccTLDs, subdirectories or subdomains.',
        'Do keyword research in each market rather than translating keywords.',
        'Localise content properly, including prices, units, examples and spelling.',
        'Add reciprocal hreflang tags for every version, including a self-reference and an x-default where useful.',
        'Avoid automatically redirecting users by IP; offer a language or country switcher instead, so Googlebot can crawl every version.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<link rel="alternate" hreflang="en-gb" href="https://example.com/uk/">\n<link rel="alternate" hreflang="en-us" href="https://example.com/us/">\n<link rel="alternate" hreflang="de" href="https://example.com/de/">\n<link rel="alternate" hreflang="x-default" href="https://example.com/">',
    },
    openseo: {
      body: 'OpenSEO keyword tools show volume by country, and rank tracking checks positions in any country or city, so you can measure each market separately.',
      href: '/tools/keyword-overview',
      label: 'Open the keyword overview',
    },
    related: ['hreflang', 'lang-attribute', 'keyword-research', 'technical-seo', 'duplicate-content'],
    faqs: [
      {
        question: 'Is a subdirectory or ccTLD better for international SEO?',
        answer: ['Neither is always better. ccTLDs send the strongest country signal; subdirectories are simpler and share one domain’s authority. Many sites choose subdirectories for ease of maintenance.'],
      },
      {
        question: 'Is translated content duplicate content?',
        answer: ['No. Translations into different languages are not treated as duplicates. Very similar pages in the same language for different regions should use hreflang so Google picks the right one.'],
      },
    ],
  },
  {
    slug: 'ecommerce-seo',
    term: 'Ecommerce SEO',
    aka: ['e-commerce SEO', 'online store SEO', 'shop SEO'],
    category: 'basics',
    short: 'Ecommerce SEO is optimising an online shop’s category and product pages to rank in search, while controlling filters, duplicates and stock changes.',
    definition: [
      'Ecommerce SEO is the practice of optimising an online shop so its category and product pages rank in search engines and attract buyers. It combines keyword research for commercial and transactional searches, unique product and category content, structured data for products, and technical work on filters, duplicates and out-of-stock pages.',
      'Category pages usually target broader, high-volume searches like “men’s running shoes”, while product pages target specific models. Shops often face technical issues others don’t: [faceted navigation](/glossary/faceted-navigation) that creates millions of filter URLs, the same product reachable at several URLs, thin manufacturer descriptions copied across many shops, and products that come and go.',
      'Product [structured data](/glossary/structured-data) can make listings eligible for rich results showing price, availability and reviews, and a Google Merchant Center feed lets products appear in free shopping listings.',
    ],
    why: [
      'Search is one of the main ways people find products. Ranking for a category term can bring buyers at the moment they are ready to compare and purchase.',
      'Shops are large and template-driven, so a single technical issue, such as indexable filter pages, can create huge [index bloat](/glossary/index-bloat) and waste crawl budget.',
    ],
    how: {
      heading: 'How to optimise an ecommerce site',
      steps: [
        'Map keywords to categories and products, with one primary keyword per page.',
        'Write unique category intros and product descriptions instead of copying the manufacturer’s text.',
        'Add Product structured data with price, availability and reviews where genuine.',
        'Decide which filter combinations deserve indexable pages; keep the rest out of the index and limit crawling of them.',
        'Use canonical tags for products reachable at several URLs.',
        'Handle discontinued products: redirect to a close replacement or category, or return 404/410 if nothing fits. Keep temporarily out-of-stock pages live.',
      ],
    },
    openseo: {
      body: 'Keyword ideas in OpenSEO show volume, difficulty, CPC and intent for product and category terms, which helps you map keywords to the right pages.',
      href: '/tools/keyword-ideas',
      label: 'Open keyword ideas',
    },
    related: ['faceted-navigation', 'transactional-intent', 'structured-data', 'shopping-results', 'duplicate-content', 'index-bloat'],
    faqs: [
      {
        question: 'Should product pages or category pages rank?',
        answer: ['Usually category pages rank for broad terms such as “oak dining tables” and product pages for specific names and models. Check the SERP for each keyword to see which page type Google prefers.'],
      },
      {
        question: 'What should I do with out-of-stock products?',
        answer: ['If the product will return, keep the page live and mark it out of stock. If it is gone for good, redirect to the closest alternative or return a 404 or 410.'],
      },
    ],
  },
  {
    slug: 'enterprise-seo',
    term: 'Enterprise SEO',
    aka: ['large-scale SEO', 'enterprise search optimisation'],
    category: 'basics',
    short: 'Enterprise SEO is SEO for very large sites and organisations, where scale, templates, many teams and governance shape the work.',
    definition: [
      'Enterprise SEO is search engine optimisation for large organisations and very large websites, often with hundreds of thousands or millions of pages, several brands or countries, and many teams touching the site. The principles are the same as any SEO, but the work centres on scale: templates, automation, crawl management, processes and buy-in.',
      'At this size, one change to a page template affects thousands of URLs, so a small fix can bring big gains and a small mistake big losses. [Crawl budget](/glossary/crawl-budget), [log file analysis](/glossary/log-file-analysis), internal linking at scale and release processes that catch SEO regressions before they go live all matter more than on a small site.',
      'Enterprise sites also tend to span several markets, so [international SEO](/glossary/international-seo) and hreflang, consistent templates across brands, and shared standards for titles, canonicals and internal links become part of the job.',
    ],
    why: [
      'Large sites have the most to gain and lose from search. A deploy that accidentally adds noindex or breaks canonicals can wipe out traffic across an entire section within days.',
      'The hardest part is often organisational. SEO depends on developers, content teams, product owners and legal, so making the case for changes and building them into workflows is a core skill.',
    ],
    how: {
      heading: 'How to manage enterprise SEO',
      steps: [
        'Prioritise template-level fixes that improve many pages at once.',
        'Add SEO checks to release processes so regressions are caught before deploy.',
        'Monitor indexing, crawl stats and rankings by site section, not just site-wide.',
        'Analyse server logs to see what Googlebot actually crawls.',
        'Automate reporting, and tie SEO metrics to revenue so priorities get agreed.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s MCP server and REST API let agents and scripts run keyword, ranking and audit lookups at scale, with spending ceilings per call.',
      href: '/features/mcp-and-api',
      label: 'See the MCP server and API',
    },
    related: ['technical-seo', 'crawl-budget', 'log-file-analysis', 'site-architecture', 'programmatic-seo', 'seo-reporting'],
    faqs: [
      {
        question: 'What makes enterprise SEO different?',
        answer: ['Scale and coordination. The techniques are the same, but changes happen through templates and teams, so governance, automation and prioritisation matter more.'],
      },
      {
        question: 'Does crawl budget matter for enterprise sites?',
        answer: ['Often, yes. Google says crawl budget mainly concerns very large or fast-changing sites, which describes many enterprise sites.'],
      },
    ],
  },
  {
    slug: 'programmatic-seo',
    term: 'Programmatic SEO',
    aka: ['pSEO', 'pages at scale'],
    category: 'basics',
    short: 'Programmatic SEO is creating many pages from templates and data to target large sets of similar searches, such as “X in [city]” queries.',
    definition: [
      'Programmatic SEO is the practice of generating large numbers of pages from a template and a dataset, each targeting a variant of a search pattern, such as “weather in [city]”, “[currency] to [currency]” or “[tool] alternatives”. Done well, each page answers a real query with genuinely useful, specific data.',
      'Well-known examples include travel sites with a page per route, property sites with a page per area, and directories with a page per business. What makes them work is a unique, useful dataset behind each page, not the template.',
      'The risk is producing thousands of near-identical pages that add nothing. Google’s spam policies on [scaled content abuse](/glossary/scaled-content-abuse) cover generating many pages primarily to manipulate rankings rather than help users, however the pages are produced. Location pages that differ only in the city name can also count as [doorway pages](/glossary/doorway-pages).',
    ],
    why: [
      'For the right business, programmatic pages can capture large amounts of long-tail search that would be impossible to cover by hand.',
      'Done badly, they create [thin content](/glossary/thin-content), index bloat and spam-policy risk across the whole site, not just the generated pages.',
    ],
    how: {
      heading: 'How to do programmatic SEO safely',
      steps: [
        'Start from a dataset that gives each page real, distinct value.',
        'Check there is real search demand for the pattern, not just in theory.',
        'Build a template that changes meaningfully per page: data, comparisons, images, local details.',
        'Only publish pages with enough data; noindex or skip thin combinations.',
        'Link pages logically through categories and hubs so they can be crawled.',
        'Launch in batches and watch indexing and engagement before scaling up.',
      ],
    },
    openseo: {
      body: 'Keyword ideas finds matching terms with volume and difficulty, which helps you check how much demand a search pattern really has before you build pages for it.',
      href: '/tools/keyword-ideas',
      label: 'Open keyword ideas',
    },
    related: ['scaled-content-abuse', 'doorway-pages', 'thin-content', 'long-tail-keywords', 'local-landing-pages', 'index-bloat'],
    faqs: [
      {
        question: 'Is programmatic SEO against Google’s guidelines?',
        answer: ['Not in itself. It becomes a problem when pages are mass-produced mainly to rank and give users little value, which falls under Google’s scaled content abuse policy.'],
      },
      {
        question: 'Can I use AI for programmatic SEO?',
        answer: ['Google doesn’t ban AI-generated content, but using any method to generate many low-value pages for ranking is scaled content abuse. The pages must be useful on their own.'],
      },
    ],
  },
  {
    slug: 'eeat',
    term: 'E-E-A-T',
    aka: ['EEAT', 'E-A-T', 'experience, expertise, authoritativeness, trustworthiness'],
    category: 'basics',
    short: 'E-E-A-T stands for experience, expertise, authoritativeness and trustworthiness: the qualities Google’s quality raters look for in content.',
    definition: [
      'E-E-A-T stands for experience, expertise, authoritativeness and trustworthiness. It is a framework from Google’s [Search Quality Rater Guidelines](/glossary/search-quality-rater-guidelines) for judging whether content and its creator can be relied on. Google added the first E, experience, in December 2022. Trust is the most important of the four.',
      'Each letter asks a different question. Experience: has the creator actually used the product, visited the place or lived through the situation? Expertise: do they have the knowledge or skill the topic needs? Authoritativeness: is the creator or site a recognised go-to source on the subject? Trustworthiness: is the page accurate, honest, safe and reliable? Google’s guidelines describe trust as the centre of the framework, with the other three supporting it. A page can be untrustworthy even if it looks expert, for example a store with no contact details or a review written by someone paid to praise the product.',
      'E-E-A-T is not a single ranking factor or score. Google has said there is no E-E-A-T score in its systems. Instead, its ranking systems use a mix of signals that Google intends to align with what raters judge as high E-E-A-T, and raters’ assessments help Google check whether its systems are working. Google also says it gives E-E-A-T more weight for topics that could affect people’s health, finances, safety or wellbeing, known as [YMYL](/glossary/ymyl) topics.',
      'What counts depends on the topic. For a medical treatment, formal expertise and accuracy matter most. For a review of hiking boots, first-hand experience of wearing them may matter more than a qualification. For a forum post about living with a condition, lived experience is valuable in itself.',
      'E-E-A-T comes from both on-page and off-page evidence. On-page: who wrote the content, their background, sources cited, original photos and data, clear contact and business information, and accuracy. Off-page: what independent sources say about the site and author, such as reviews, press coverage, awards and mentions. Raters are told to look for reputation information from outside the site rather than only what a site says about itself.',
    ],
    why: [
      'E-E-A-T describes what Google is trying to reward. When content is similar in relevance, the source that shows real experience and earns trust tends to win, especially after [core updates](/glossary/core-update) that refine how quality is assessed.',
      'For YMYL topics, weak E-E-A-T can keep a site from ranking at all. Google wants to avoid showing unreliable health or financial advice, so it leans heavily towards trusted sources there.',
      'Building E-E-A-T also helps beyond Google. AI assistants and answer engines favour sources that are widely cited and clearly credible, and readers trust content with a named, qualified author.',
    ],
    how: {
      heading: 'How to improve E-E-A-T',
      steps: [
        'Show who created the content. Add author names, short bios with relevant experience or qualifications, and author pages.',
        'Show first-hand experience: your own photos, test results, measurements, screenshots, and specific details only someone who did it would know.',
        'Cite reliable sources for factual claims and keep content accurate and up to date. Fix or remove outdated advice.',
        'Make the site trustworthy: clear contact details, an about page, editorial and review policies, secure checkout and easy-to-find returns or refund information.',
        'Have experts write or review YMYL content, and say who reviewed it.',
        'Build reputation off your site: earn coverage, reviews and links from respected sources in your field, and respond to criticism honestly.',
        'Avoid things that destroy trust: misleading titles, hidden affiliate relationships, fake reviews and content written to rank rather than to help.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Two pages review the same robot vacuum. Page A rewrites the manufacturer’s specs and links to a shop. Page B is written by a named reviewer who used it for a month in a flat with two dogs, shows her own photos of the dustbin after a week, measures noise levels, explains what it failed to clean and discloses the affiliate link. Page B shows experience, expertise and trust; it is the kind of page Google’s systems aim to rank higher.',
    },
    openseo: {
      body: 'Authority shows up in links and mentions. The backlink checker shows which respected sites link to you and to competitors, and AI visibility tracking shows whether AI assistants cite you as a source.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['ymyl', 'search-quality-rater-guidelines', 'helpful-content', 'core-update', 'topical-authority', 'brand-mentions', 'information-gain'],
    faqs: [
      {
        question: 'Is E-E-A-T a ranking factor?',
        answer: ['Not directly. Google says there is no E-E-A-T score. Its ranking systems use many signals intended to reward content that shows E-E-A-T, and quality raters use it to assess search results.'],
      },
      {
        question: 'What is the difference between E-A-T and E-E-A-T?',
        answer: ['E-A-T was expertise, authoritativeness and trustworthiness. In December 2022 Google added experience to the rater guidelines, making it E-E-A-T, to recognise the value of first-hand experience.'],
      },
      {
        question: 'Which part of E-E-A-T matters most?',
        answer: ['Trust. Google’s rater guidelines say trust is the most important member of the E-E-A-T family, and that experience, expertise and authoritativeness all feed into it.'],
      },
      {
        question: 'Do author bios help SEO?',
        answer: ['They help readers and quality raters see who is behind content, which supports trust. A bio alone won’t lift rankings; the expertise must also show in the content and reputation.'],
      },
    ],
  },
  {
    slug: 'ymyl',
    term: 'YMYL (Your Money or Your Life)',
    aka: ['Your Money or Your Life', 'YMYL pages', 'YMYL topics'],
    category: 'basics',
    short: 'YMYL (Your Money or Your Life) means topics that could affect someone’s health, finances, safety or wellbeing, where Google applies higher standards.',
    definition: [
      'YMYL, short for “Your Money or Your Life”, is Google’s term for topics that could significantly affect a person’s health, financial stability, safety, or the welfare of society. Google’s Search Quality Rater Guidelines hold YMYL pages to the highest standards of [E-E-A-T](/glossary/eeat), because poor information on these topics can cause real harm.',
      'Typical YMYL topics include medical and health information, financial advice, legal matters, news on civic issues, and anything involving safety. Not every page in those areas is YMYL to the same degree: a page on the history of banknotes is low risk, a page on how to invest a pension is high risk. Shopping pages where people enter payment details also need high trust.',
      'YMYL is a concept from the [Search Quality Rater Guidelines](/glossary/search-quality-rater-guidelines), not a label Google attaches to your site. Raters are asked to judge YMYL pages more strictly, and Google designs its systems to put more weight on reliability for these queries. In practice that means expertise, sourcing and reputation count for more, and [helpful content](/glossary/helpful-content) needs to be demonstrably accurate.',
    ],
    why: [
      'If your site covers YMYL topics, ranking requires stronger evidence of trust: qualified authors or reviewers, accurate and sourced content, and a solid reputation. Thin or anonymous content in these areas rarely ranks well.',
      'Google has said it gives more weight to signals of reliability for YMYL queries, so weaknesses that might not matter for a hobby blog can matter a lot for a health or finance site.',
    ],
    how: {
      heading: 'How to optimise YMYL content',
      steps: [
        'Have qualified experts write or review the content, and name them with credentials.',
        'Cite primary, authoritative sources such as official bodies and peer-reviewed research.',
        'Review and date content regularly; outdated YMYL advice is a liability.',
        'Be transparent about who runs the site, how to contact you and how you make money.',
        'Avoid sweeping claims you can’t support.',
      ],
    },
    related: ['eeat', 'search-quality-rater-guidelines', 'helpful-content', 'core-update', 'freshness'],
    faqs: [
      {
        question: 'What are examples of YMYL pages?',
        answer: ['Pages on medical symptoms, drug dosages, taxes, loans, investments, legal rights, emergency safety and civic news are typical YMYL pages.'],
      },
      {
        question: 'Is YMYL a ranking factor?',
        answer: ['No. It is a category in Google’s rater guidelines. Google’s systems do, however, give more weight to reliability signals for queries on YMYL topics.'],
      },
    ],
  },
  {
    slug: 'helpful-content',
    term: 'Helpful content',
    aka: ['helpful content update', 'helpful content system', 'people-first content'],
    category: 'basics',
    short: 'Helpful content is Google’s term for people-first content made to help readers, not to rank. Since 2024 it is assessed by Google’s core systems.',
    definition: [
      'Helpful content is Google’s description of content created primarily to help people rather than to attract search engine traffic. Google launched a “helpful content system” in August 2022 to demote sites with a lot of unhelpful, search-first content. In March 2024 that system was folded into Google’s core ranking systems, so helpfulness is now judged by multiple core systems.',
      'Google publishes self-assessment questions for this. Does the content provide original information, research or analysis? Does it show first-hand expertise? Would someone leave feeling they had learned enough to reach their goal? Warning signs include writing to a word count, covering trending topics you have no expertise in, summarising what others say without adding value, and producing lots of content on many topics hoping some will rank.',
      'It doesn’t matter how the content is made. Google has said AI-assisted content is fine if it is helpful, but mass-produced pages made mainly to rank break the [scaled content abuse](/glossary/scaled-content-abuse) policy.',
    ],
    why: [
      'Helpfulness is at the centre of how Google assesses content quality. Sites hit by the original helpful content updates often saw site-wide drops, not just on the weakest pages.',
      'Because it is part of [core updates](/glossary/core-update) now, improving helpfulness is the main way to recover from core update losses.',
    ],
    how: {
      heading: 'How to make content more helpful',
      steps: [
        'Write for a specific audience that would come to your site directly, not just for search traffic.',
        'Add something new: original data, first-hand testing, examples, photos or expert opinion. See [information gain](/glossary/information-gain).',
        'Answer the question quickly, then go deeper for those who want more.',
        'Remove or improve pages that exist only to catch keywords.',
        'Make authorship and sources clear.',
      ],
    },
    openseo: {
      body: 'The SERP checker shows what the top 10 already cover, so you can see what your page needs to add to be more useful than what ranks.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['eeat', 'core-update', 'information-gain', 'scaled-content-abuse', 'content-audit', 'thin-content'],
    faqs: [
      {
        question: 'Does the helpful content update still exist?',
        answer: ['Not as a separate system. Since March 2024, Google assesses helpfulness through its core ranking systems, and there are no separate helpful content updates.'],
      },
      {
        question: 'Can AI content be helpful content?',
        answer: ['Yes, according to Google, if it is accurate, original and made to help people. Using AI or any method to churn out low-value pages to rank is against Google’s spam policies.'],
      },
    ],
  },
  {
    slug: 'search-quality-rater-guidelines',
    term: 'Search Quality Rater Guidelines',
    aka: ['quality rater guidelines', 'QRG', 'SQRG', 'Google rater guidelines'],
    category: 'basics',
    short: 'The Search Quality Rater Guidelines are Google’s public handbook for human raters who assess the quality of search results.',
    definition: [
      'The Search Quality Rater Guidelines are a public document Google gives to the external human raters who evaluate search results. Raters use it to judge page quality, including [E-E-A-T](/glossary/eeat), and how well results meet the needs of a query. Their ratings help Google test changes to its ranking systems, but don’t directly change any page’s ranking.',
      'The guidelines cover Page Quality rating (the purpose of a page, its main content, the reputation of the site and creator, and E-E-A-T) and Needs Met rating (how well a result serves the searcher’s likely intent). They define [YMYL](/glossary/ymyl) topics and describe what lowest-quality pages look like, such as deceptive, spammy or harmful content. Google updates the document from time to time.',
      'Raters work on real queries and are asked to think about the needs of people in their own locale. Their ratings are combined to evaluate proposed changes: Google runs experiments, compares results with and without a change, and uses rater judgements as one input in deciding whether to launch it. The guidelines are therefore a statement of what Google wants its systems to achieve, not a list of [ranking factors](/glossary/ranking-factors).',
    ],
    why: [
      'The guidelines are the most detailed public description of what Google considers good and bad content. Reading them helps you understand the direction of Google’s ranking systems, even though raters don’t set rankings.',
      'They are especially useful for YMYL sites and for recovering from [core updates](/glossary/core-update), as they spell out what high and low quality look like.',
    ],
    how: {
      heading: 'How to use the quality rater guidelines',
      steps: [
        'Download the current version from Google and read the sections on page quality and E-E-A-T.',
        'Assess your own key pages as a rater would: purpose, main content, reputation, trust.',
        'Search for independent reviews and mentions of your brand, as raters are told to do.',
        'Use the lowest-quality examples as a checklist of things to remove.',
      ],
    },
    related: ['eeat', 'ymyl', 'helpful-content', 'core-update', 'search-intent'],
    faqs: [
      {
        question: 'Do quality raters affect my rankings?',
        answer: ['No. Google says rater ratings don’t directly affect rankings. They are used to measure whether Google’s systems are producing good results.'],
      },
      {
        question: 'Where can I read the Search Quality Rater Guidelines?',
        answer: ['Google publishes them as a free PDF, linked from its Search Central documentation and its How Search Works site.'],
      },
    ],
  },
  {
    slug: 'search-engine-marketing',
    term: 'Search engine marketing (SEM)',
    aka: ['SEM', 'search marketing', 'paid search marketing'],
    category: 'basics',
    short: 'Search engine marketing (SEM) is promoting a website in search engines. It usually means paid search ads, and sometimes means SEO plus ads together.',
    definition: [
      'Search engine marketing (SEM) is promoting a website through search engines. Today it usually means paid search advertising, such as Google Ads and Microsoft Advertising, where you bid on keywords and pay per click. Some people use SEM as an umbrella term for both paid search and [SEO](/glossary/seo).',
      'Paid search works on an auction. You choose keywords, write ads and set bids; the search engine shows ads based on bid and quality, and you pay when someone clicks. The [cost per click](/glossary/cost-per-click) for a keyword is a useful SEO metric too, because it shows how commercially valuable that search is.',
      'Paid ads appear in labelled “Sponsored” slots on the [SERP](/glossary/serp), usually above and below the organic results, and sometimes in shopping and local results. Clicking an ad and clicking an organic result look similar to a searcher, which is why many businesses plan both together and compare the cost of each click against the [traffic value](/glossary/traffic-value) of their organic rankings.',
    ],
    why: [
      'SEO and paid search target the same results page and complement each other. Ads bring traffic immediately and let you test keywords and copy; SEO builds traffic that doesn’t cost per click and takes longer.',
      'Ad data, such as which keywords convert, can tell you which topics to prioritise for SEO.',
    ],
    how: {
      heading: 'How to combine SEO and paid search',
      steps: [
        'Use ads to test which keywords and messages convert before investing in SEO content.',
        'Use high-CPC keywords as a signal of where organic rankings would be most valuable.',
        'Reduce ad spend on queries where you rank well organically, if tests show the clicks move to organic.',
        'Share title and description wording that performs well between ads and organic pages.',
      ],
    },
    openseo: {
      body: 'Keyword tools in OpenSEO show CPC alongside volume and difficulty, so you can see what a click would cost as an ad.',
      href: '/tools/keyword-ideas',
      label: 'Open keyword ideas',
    },
    related: ['seo', 'paid-results', 'cost-per-click', 'organic-search', 'traffic-value'],
    faqs: [
      {
        question: 'What is the difference between SEO and SEM?',
        answer: ['SEO earns unpaid rankings; SEM, in its common meaning, is paid search advertising. In the broader definition, SEO is part of SEM.'],
      },
      {
        question: 'Is PPC the same as SEM?',
        answer: ['PPC (pay per click) is the payment model behind most search ads, so the terms are often used interchangeably. PPC also covers ads outside search, such as social ads.'],
      },
    ],
  },
  {
    slug: 'seo-audit',
    term: 'SEO audit',
    aka: ['site audit', 'website SEO audit', 'SEO health check'],
    category: 'basics',
    short: 'An SEO audit is a review of a website’s technical health, content and links to find what holds it back in search and what to fix first.',
    definition: [
      'An SEO audit is a structured review of a website to find issues and opportunities affecting its search performance. A full audit covers technical SEO (crawling, indexing, speed, redirects), on-page SEO (titles, content, headings), content quality and gaps, and the backlink profile. The output is a prioritised list of fixes.',
      'Most audits start with a crawl of the whole site and data from [Google Search Console](/glossary/google-search-console). The crawl finds issues like broken links, missing titles, duplicate content and redirect chains; Search Console shows what Google actually indexes and which queries bring clicks. A [content audit](/glossary/content-audit) and backlink review add the content and authority side.',
    ],
    why: [
      'An audit shows where effort will pay off. Many sites have a few issues, an indexing block or a slow template, that matter far more than everything else.',
      'Regular audits catch problems introduced by redesigns, plugins or deploys before they cost traffic.',
    ],
    how: {
      heading: 'How to do an SEO audit',
      steps: [
        'Crawl the site and list errors: 4xx and 5xx pages, redirects, missing or duplicate titles, noindex pages and orphan pages.',
        'Compare the crawl with Search Console’s Page indexing report.',
        'Check Core Web Vitals and mobile usability for key templates.',
        'Review on-page elements on your most important pages.',
        'Find pages that lost traffic and content gaps against competitors.',
        'Review backlinks and lost links.',
        'Rank fixes by impact and effort, and start with what affects the most valuable pages.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s site audit crawls your site with 59 technical checks, gives a health score and runs Lighthouse on mobile and desktop. The tutorial walks you through acting on the results.',
      href: '/docs/tutorials/site-audit',
      label: 'Read the site audit tutorial',
    },
    related: ['technical-seo', 'site-health-score', 'content-audit', 'on-page-checklist', 'core-web-vitals', 'link-profile'],
    faqs: [
      {
        question: 'How often should I do an SEO audit?',
        answer: ['A full audit a few times a year and after any major site change is a good rhythm. Automated crawls can run weekly between audits.'],
      },
      {
        question: 'How long does an SEO audit take?',
        answer: ['An automated crawl of a small site takes minutes. A thorough manual audit of a large site, with prioritised recommendations, can take days or weeks.'],
      },
    ],
  },
  {
    slug: 'seo-strategy',
    term: 'SEO strategy',
    aka: ['SEO plan', 'search strategy'],
    category: 'basics',
    short: 'An SEO strategy is a plan for which searches to win, which pages to create or improve, and how to earn the authority to rank for them.',
    definition: [
      'An SEO strategy is a plan for improving a website’s organic search performance to meet business goals. It sets which audiences and keywords to target, what content to create or improve, what technical work is needed, how to earn links, and how success will be measured. It turns SEO from a list of tasks into priorities.',
      'A good strategy starts from the business, not from keywords: what you sell, to whom, and what counts as success. From there, [keyword research](/glossary/keyword-research) and competitor analysis show where demand is and where you can realistically compete. Topics are grouped into clusters, mapped to pages, and scheduled alongside technical fixes and link building.',
    ],
    why: [
      'Without a strategy, SEO effort spreads thin: random blog posts, fixes that don’t matter, keywords that never convert. A plan focuses limited time on the work most likely to pay.',
      'A written strategy also makes it easier to get buy-in, budget and help from developers and writers.',
    ],
    how: {
      heading: 'How to build an SEO strategy',
      steps: [
        'Define goals and KPIs, such as leads, sales or sign-ups from organic search.',
        'Audit where you are: rankings, traffic, technical health and links.',
        'Research keywords and group them into topics by intent.',
        'Analyse competitors and find [keyword gaps](/glossary/keyword-gap).',
        'Choose priority topics by value, difficulty and how well they fit your business.',
        'Plan content, technical fixes and link building as a timeline.',
        'Track results and revise the plan every quarter.',
      ],
    },
    openseo: {
      body: 'The competitors tool finds your organic competitors and the keyword gap between you, a good starting point for deciding which topics to target.',
      href: '/tools/competitors',
      label: 'Open the competitors tool',
    },
    related: ['keyword-research', 'keyword-gap', 'topic-cluster', 'seo-kpis', 'seo-audit', 'content-marketing'],
    faqs: [
      {
        question: 'What should an SEO strategy include?',
        answer: ['Goals, target audiences and keywords, a content plan, technical priorities, a link building approach and how you will measure results.'],
      },
      {
        question: 'How long before an SEO strategy shows results?',
        answer: ['Usually months. Quick wins from technical fixes or improving pages near page one can show sooner; new content in competitive areas takes longer.'],
      },
    ],
  },
  {
    slug: 'bing-seo',
    term: 'Bing SEO',
    aka: ['Bing optimisation', 'Microsoft Bing SEO'],
    category: 'basics',
    short: 'Bing SEO is optimising a site to rank in Microsoft Bing, whose index also feeds other search services and AI tools.',
    definition: [
      'Bing SEO is the practice of optimising a website for Microsoft’s Bing search engine. Most of it overlaps with Google SEO: crawlable pages, helpful content, clear titles and quality links. Bing has its own tools, Bing Webmaster Tools, and supports [IndexNow](/glossary/indexnow) for notifying it instantly when pages change.',
      'Bing’s index matters beyond Bing itself. It powers Yahoo’s web results, is one of the sources DuckDuckGo uses, and supports Microsoft Copilot’s web answers. Bing’s Webmaster Guidelines say it considers relevance, quality and credibility, user engagement, freshness, location and page load time.',
    ],
    why: [
      'Bing is often overlooked, which means less competition. Its audience can be meaningful, especially on Windows desktops and in some countries and industries.',
      'Because several services rely on Bing’s index, a site missing from Bing can also be missing from places it would otherwise appear, including some AI answers that draw on web results. Checking Bing is a cheap way to widen your [AI visibility](/glossary/ai-visibility).',
      'Bing has its own local listings too. A [Bing Places](/glossary/bing-places) profile is the Bing equivalent of a Google Business Profile and can be imported from it.',
    ],
    how: {
      heading: 'How to optimise for Bing',
      steps: [
        'Verify your site in [Bing Webmaster Tools](/glossary/bing-webmaster-tools); you can import it from Search Console.',
        'Submit your XML sitemap there.',
        'Set up IndexNow so new and updated URLs are reported automatically.',
        'Check Bing’s Site Scan and URL Inspection for crawl and indexing issues.',
        'Make sure robots.txt doesn’t block Bingbot.',
      ],
    },
    related: ['bing-webmaster-tools', 'indexnow', 'search-engine', 'bing-places', 'seo'],
    faqs: [
      {
        question: 'Is Bing SEO different from Google SEO?',
        answer: ['Mostly not. The fundamentals are the same. Bing offers IndexNow and its own webmaster tools, and its ranking signals and weighting differ in detail.'],
      },
      {
        question: 'Is Bing worth optimising for?',
        answer: ['Usually yes, because the extra work is small. Most of it is the same as Google SEO, and Bing’s index reaches Yahoo, parts of DuckDuckGo and Microsoft Copilot.'],
      },
      {
        question: 'How do I get my site indexed on Bing?',
        answer: ['Verify the site in Bing Webmaster Tools, submit your XML sitemap and use IndexNow or URL submission for new pages. Make sure Bingbot isn’t blocked.'],
      },
    ],
  },
  {
    slug: 'title-tag',
    term: 'Title tag',
    aka: ['title element', 'meta title', 'SEO title', 'page title', 'title link'],
    category: 'on-page',
    short: 'A title tag is the HTML element that names a page. Google often uses it as the clickable headline in results, so it affects rankings and clicks.',
    definition: [
      'A title tag is the HTML <title> element in a page’s <head> that states the page’s title. Browsers show it in the tab, and search engines usually use it as the clickable headline of the result, which Google calls the title link. It is one of the strongest on-page signals of what a page is about.',
      'The title tag lives in the page’s code, not in the visible body. It is different from the [H1](/glossary/h1-tag), which is the main heading readers see on the page, though the two often say similar things. Each page should have exactly one title element, and every title on your site should be unique.',
      'Google doesn’t always show your title as written. Since August 2021 it has generated title links from several sources: the title element first, but also the main heading, other prominent text, og:title, anchor text pointing to the page and more. It rewrites titles that are missing, empty, stuffed with keywords, too long, the same across many pages (“Home”, “Untitled”) or that don’t match the page’s content. Writing an accurate, specific title is the best way to have yours used.',
      'Length is measured in pixels, not characters. Google doesn’t set a maximum for the title element, but it truncates the displayed title link to fit the device width, roughly 600 pixels on desktop. In practice that is about 50 to 60 characters, depending on letter widths. See [title tag length](/glossary/title-tag-length). Words past the cut-off can still be read by Google, but searchers won’t see them.',
      'A good title tag does two jobs. For search engines, it signals the topic, so the main keyword or a close variant belongs near the start. For people, it is the first thing they read on the [SERP](/glossary/serp), so it needs to promise the right thing in a way that earns the click. A title that ranks but never gets clicked wastes the position; a title that gets clicks but misleads drives visitors straight back.',
    ],
    why: [
      'The title is a strong relevance signal and usually the most visible part of your search result. Improving titles is one of the quickest ways to lift both rankings and [click-through rate](/glossary/click-through-rate) without changing the page’s content.',
      'Weak titles are common. Duplicate titles across templates, titles that are just the brand name, or titles that bury the topic behind filler make it harder for Google to tell pages apart and give searchers no reason to click.',
      'Titles also appear when a page is shared, bookmarked or saved, and AI tools and other search engines read them to understand the page.',
    ],
    how: {
      heading: 'How to write a title tag',
      steps: [
        'Describe the page’s content accurately and specifically. Ask what the searcher wants to know before they click.',
        'Put the main keyword, or the most natural phrasing of it, near the start.',
        'Keep it within about 50 to 60 characters so the important part isn’t cut off. Check the pixel width in a preview tool if in doubt.',
        'Make every title on the site unique. For templated pages, include the distinguishing detail, such as the product name, city or date.',
        'Add your brand at the end with a separator, such as “ | Brand”, if there is space. The homepage can lead with the brand.',
        'Give a reason to click: a number, the year for time-sensitive content, a format (“guide”, “checklist”, “calculator”) or a benefit, as long as the page delivers it.',
        'Avoid keyword stuffing, all caps and clickbait. These make rewrites more likely and can hurt trust.',
        'Check in [Search Console](/glossary/google-search-console) which queries the page gets, and refine the title to match how people actually search.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<head>\n  <title>Sourdough Starter: How to Make One in 7 Days | Baker’s Notes</title>\n</head>',
    },
    openseo: {
      body: 'The page analyser checks any page’s title, description and headings and shows the keywords it ranks for. The site audit flags missing, duplicate and over-long titles across your whole site.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['title-tag-length', 'meta-description', 'h1-tag', 'click-through-rate', 'on-page-seo', 'clickbait-titles', 'open-graph'],
    faqs: [
      {
        question: 'How long should a title tag be?',
        answer: ['Aim for about 50 to 60 characters. Google truncates by pixel width (around 600 pixels on desktop), so the exact limit varies with the letters used.'],
      },
      {
        question: 'Why does Google change my title tag?',
        answer: ['Google rewrites title links it thinks don’t describe the page well, for example titles that are missing, stuffed with keywords, too long, duplicated across pages or out of date. Make the title accurate, concise and unique to reduce rewrites.'],
      },
      {
        question: 'Is the title tag the same as the H1?',
        answer: ['No. The title tag sits in the <head> and appears in search results and browser tabs. The H1 is the main heading visible on the page. They can be similar but needn’t be identical.'],
      },
      {
        question: 'Should I put my brand name in the title tag?',
        answer: ['Usually yes, at the end and briefly, if space allows. Google may add the site name itself in some results, and it shows site names separately on many SERPs.'],
      },
    ],
  },
  {
    slug: 'meta-description',
    term: 'Meta description',
    aka: ['meta description tag', 'description tag', 'search snippet'],
    category: 'on-page',
    short: 'A meta description is an HTML tag that summarises a page. Google may show it as the snippet under the title; it affects clicks, not rankings.',
    definition: [
      'A meta description is an HTML tag in the page’s <head> that gives a short summary of the page. Search engines may show it as the snippet of text under the title in search results. Google says it is not a ranking factor, but a clear, relevant description can persuade more people to click.',
      'Google uses the meta description when it thinks it describes the page better than text from the page itself. Otherwise it builds a snippet from the page content that matches the query, so the same page can show different snippets for different searches. Descriptions are truncated by width, so around 150 to 160 characters is a common target. Google also supports nosnippet and max-snippet rules in the [meta robots tag](/glossary/meta-robots-tag) to limit snippets.',
    ],
    why: [
      'The snippet is your sales pitch on the SERP. A specific description that matches the searcher’s intent can raise [click-through rate](/glossary/click-through-rate) even if your position doesn’t change.',
      'Missing or duplicate descriptions are a common audit issue. They don’t cause penalties, but they give Google less to work with and waste an opportunity.',
    ],
    how: {
      heading: 'How to write a meta description',
      steps: [
        'Summarise what the page offers in one or two sentences.',
        'Include the main keyword naturally; Google bolds words matching the query.',
        'Add a concrete detail or reason to click: price, steps, time, what’s included.',
        'Keep it to roughly 150 to 160 characters.',
        'Write a unique description for each important page; for large templated sites, generate them from page data.',
        'Don’t promise what the page doesn’t deliver.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<meta name="description" content="Learn to make a sourdough starter with just flour and water in 7 days. Daily photos, feeding schedule and fixes for common problems.">',
    },
    openseo: {
      body: 'The site audit flags missing and duplicate meta descriptions, and the page analyser checks the description of any single page.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['title-tag', 'click-through-rate', 'rich-snippets', 'meta-robots-tag', 'on-page-seo'],
    faqs: [
      {
        question: 'Is the meta description a ranking factor?',
        answer: ['No. Google has said meta descriptions don’t affect rankings. They matter because they can improve click-through rate.'],
      },
      {
        question: 'Why is Google not showing my meta description?',
        answer: ['Google builds its own snippet when it thinks page text matches the query better than your description. Making the description specific and relevant to the page’s main queries helps.'],
      },
      {
        question: 'How long should a meta description be?',
        answer: ['There is no official limit, but snippets are truncated to fit the screen. Around 150 to 160 characters keeps the main message visible.'],
      },
    ],
  },
  {
    slug: 'h1-tag',
    term: 'H1 tag',
    aka: ['H1', 'H1 heading', 'heading 1', 'main heading'],
    category: 'on-page',
    short: 'An H1 tag is the main heading of a web page. It tells readers and search engines what the page is about, and most pages should have one.',
    definition: [
      'An H1 tag is the HTML <h1> element used for a page’s main visible heading. It tells visitors and search engines what the page is about and sits at the top of the heading structure, above H2 to H6 subheadings. Most pages should have one clear H1 that matches the topic of the page.',
      'The H1 is different from the [title tag](/glossary/title-tag). The title appears in search results and the browser tab; the H1 appears on the page. They often share the main keyword but can be worded differently: the title can be tuned for clicks, the H1 for the reader who has already arrived. Google uses headings to understand page structure and may use the H1 when it rewrites a title link.',
    ],
    why: [
      'A clear H1 confirms to readers that they landed in the right place and helps search engines understand the main topic. Missing H1s, or H1s used for a logo or “Welcome”, waste that signal.',
      'Google has said multiple H1s aren’t a problem for its systems. Still, one H1 keeps the structure clear for screen reader users and makes the page’s focus obvious.',
    ],
    how: {
      heading: 'How to write an H1 tag',
      steps: [
        'Write one H1 per page that describes its main topic.',
        'Include the primary keyword or a natural variant.',
        'Keep it short and readable; it is a heading, not a paragraph.',
        'Place it at the top of the main content, not in the header or sidebar.',
        'Use H2 and H3 for the sections below it. See [heading hierarchy](/glossary/heading-hierarchy).',
      ],
    },
    example: { label: 'HTML', code: '<h1>How to make a sourdough starter</h1>' },
    openseo: {
      body: 'The page analyser checks a page’s headings, and the site audit flags missing or duplicate H1s across your site.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['header-tags', 'heading-hierarchy', 'title-tag', 'on-page-seo', 'primary-keyword'],
    faqs: [
      {
        question: 'Can a page have more than one H1?',
        answer: ['Yes, technically, and Google says it handles it fine. One H1 is still the clearest choice for readers and accessibility.'],
      },
      {
        question: 'Should the H1 be the same as the title tag?',
        answer: ['It can be, but needn’t be. Both should describe the same topic; the title can be tailored to search results and the H1 to the page.'],
      },
    ],
  },
  {
    slug: 'header-tags',
    term: 'Header tags (H1–H6)',
    aka: ['heading tags', 'HTML headings', 'H1-H6', 'H2 tags', 'subheadings'],
    category: 'on-page',
    short: 'Header tags (H1–H6) are HTML headings that structure a page into sections, helping readers scan and search engines understand the content.',
    definition: [
      'Header tags are the six HTML heading elements, <h1> to <h6>, used to give a page a structure of titles and subtitles. H1 is the main heading, H2s mark the main sections, H3s subsections within them, and so on. They help readers scan, help screen reader users navigate, and help search engines understand what each part of a page covers.',
      'Headings should reflect the content’s outline, not visual style. Using an H2 just because you want bigger text, or bold paragraphs instead of real headings, makes the structure harder to read for assistive technology and search engines. Style headings with CSS and choose the level by meaning.',
      'The levels should nest in order: an H3 belongs under an H2, not straight under the H1. See [heading hierarchy](/glossary/heading-hierarchy) for how to keep the outline clean. The H1 is covered in its own entry, the [H1 tag](/glossary/h1-tag).',
    ],
    why: [
      'Clear subheadings help Google identify which part of a page answers a specific question, which can help with [featured snippets](/glossary/featured-snippet) and passage-level ranking. They also make long pages easier to read, so visitors find their answer and stay.',
      'Headings are a natural place for secondary keywords and question phrasings, as long as they read well.',
    ],
    how: {
      heading: 'How to use header tags',
      steps: [
        'Use one H1 for the page’s main topic.',
        'Use H2s for each major section and H3s for points within a section.',
        'Make headings descriptive: a reader should understand the section from the heading alone.',
        'Phrase some headings as the questions people search, then answer right below.',
        'Don’t use headings for styling, navigation labels or boilerplate.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<h1>Sourdough starter guide</h1>\n  <h2>What you need</h2>\n  <h2>How to make a starter</h2>\n    <h3>Day 1: mix flour and water</h3>\n    <h3>Days 2 to 7: feed daily</h3>\n  <h2>Common problems</h2>',
    },
    openseo: {
      body: 'The page analyser lists a page’s headings so you can check its structure against competing pages.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['h1-tag', 'heading-hierarchy', 'featured-snippet', 'readability', 'on-page-seo'],
    faqs: [
      {
        question: 'Do header tags help SEO?',
        answer: ['Yes, by making the page’s topic and structure clear to search engines and readers. They are a helpful signal, not a lever you can pull by stuffing keywords into them.'],
      },
      {
        question: 'How many H2s should a page have?',
        answer: ['As many as the content has main sections. There is no ideal number.'],
      },
    ],
  },
  {
    slug: 'url-slug',
    term: 'URL slug',
    aka: ['slug', 'permalink', 'URL path'],
    category: 'on-page',
    short: 'A URL slug is the last part of a URL that names a specific page, such as /blue-running-shoes. Short, readable slugs help users and search engines.',
    definition: [
      'A URL slug is the part of a URL that identifies a specific page, usually after the last slash, for example “repot-snake-plant” in example.com/guides/repot-snake-plant. A good slug is short, readable, uses lowercase words separated by hyphens and describes the page’s topic.',
      'Most content systems create a slug from the page title automatically, which can produce long slugs full of stop words or dates. Editing it before publishing is easy; changing it later means setting up a [301 redirect](/glossary/301-redirect) from the old URL.',
      'The slug sits inside the full URL, which may also include folders that show where the page lives, such as /guides/ or /shop/shoes/. Together they make up an [SEO-friendly URL](/glossary/seo-friendly-url) when they are short, consistent and descriptive. Stick to letters, numbers and hyphens; non-ASCII characters work but are encoded in links and can look messy when shared.',
    ],
    why: [
      'Google says it uses words in URLs as a lightweight signal and shows the URL as breadcrumbs or a path in some results. A descriptive slug helps people judge a link before clicking it, in search, in shared links and in anchor text when people paste the bare URL.',
      'Changing slugs without redirects breaks links and loses the authority they carried, so getting slugs right the first time saves trouble.',
    ],
    how: {
      heading: 'How to write a URL slug',
      steps: [
        'Use the main keyword or a short description of the page.',
        'Use lowercase letters and separate words with hyphens, not underscores or spaces.',
        'Drop filler words where the slug still reads naturally.',
        'Avoid dates and numbers that will date the page, unless they are part of the topic.',
        'Once published, don’t change the slug without a 301 redirect.',
      ],
    },
    example: {
      label: 'Good and bad slugs',
      body: 'Good: /guides/repot-snake-plant. Weaker: /guides/how-to-repot-your-snake-plant-the-complete-2026-guide. Bad: /p?id=4821&cat=7.',
    },
    related: ['seo-friendly-url', '301-redirect', 'url-parameters', 'breadcrumbs', 'site-architecture'],
    faqs: [
      {
        question: 'Should I put keywords in my URL slug?',
        answer: ['Yes, briefly. A keyword in the slug is a small relevance signal and helps users see what the page is about. Don’t stuff several keywords in.'],
      },
      {
        question: 'Hyphens or underscores in URLs?',
        answer: ['Hyphens. Google recommends hyphens to separate words in URLs; underscores may be read as joining words.'],
      },
    ],
  },
  {
    slug: 'seo-friendly-url',
    term: 'SEO-friendly URL',
    aka: ['clean URL', 'search-friendly URL', 'readable URL'],
    category: 'on-page',
    short: 'An SEO-friendly URL is short, readable and descriptive, uses hyphens and lowercase, and shows where a page sits in the site’s structure.',
    definition: [
      'An SEO-friendly URL is a web address that is easy for people and search engines to read and understand. It uses real words that describe the page, hyphens between words, lowercase letters, a logical folder structure and as few parameters as possible, for example example.com/shoes/running/womens rather than example.com/index.php?cat=12&id=884.',
      'Google’s URL structure guidance recommends simple, descriptive URLs, hyphens to separate words, and avoiding long ID numbers, session IDs and unnecessary [URL parameters](/glossary/url-parameters) that can create duplicate URLs. URLs are case-sensitive, so /Shoes and /shoes are different pages to a crawler.',
      'Folder structure is part of the picture. URLs like /guides/houseplants/snake-plant tell people and crawlers where a page sits, line up with [breadcrumbs](/glossary/breadcrumbs), and let you filter reports by section. Keep the depth sensible: two or three folders is usually plenty.',
    ],
    why: [
      'Readable URLs build trust in search results and when shared. A logical folder structure also helps Google understand site sections and can help with reporting by section.',
      'Messy URLs cause technical problems: duplicates from parameters and case variations, wasted crawl budget and diluted link signals.',
    ],
    how: {
      heading: 'How to create SEO-friendly URLs',
      steps: [
        'Use a short, descriptive [slug](/glossary/url-slug) with hyphens.',
        'Use a shallow, logical folder structure that mirrors your site architecture.',
        'Use lowercase consistently and redirect uppercase variants.',
        'Keep tracking and filter parameters out of indexable URLs where possible, and canonicalise those that remain.',
        'Use HTTPS, and pick one version of the host (www or non-www) and redirect the other.',
      ],
    },
    openseo: {
      body: 'The site audit flags URL problems such as redirect chains, duplicate URLs and parameter-driven duplicates.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['url-slug', 'url-parameters', 'site-architecture', 'canonical-tag', 'duplicate-content'],
    faqs: [
      {
        question: 'Does URL length affect SEO?',
        answer: ['Not directly in any meaningful way. Shorter URLs are easier to read and share, which is the main reason to keep them short.'],
      },
      {
        question: 'Should I change old URLs to be more SEO-friendly?',
        answer: ['Usually only as part of a planned restructure. Every change needs a 301 redirect, and the small gain rarely justifies the risk on its own.'],
      },
    ],
  },
  {
    slug: 'alt-text',
    term: 'Alt text',
    aka: ['alt attribute', 'alt tag', 'image alt text', 'alternative text'],
    category: 'on-page',
    short: 'Alt text is a short written description of an image in its HTML alt attribute. It helps screen reader users and tells search engines what the image shows.',
    definition: [
      'Alt text, set with the HTML alt attribute on an <img> element, is a short text alternative that describes an image. Screen readers read it aloud to people who can’t see the image, browsers show it if the image fails to load, and search engines use it, along with the page context, to understand what the image shows.',
      'Good alt text describes the image’s content and purpose in context, briefly. Purely decorative images should have an empty alt attribute (alt="") so screen readers skip them. Alt text is not a place for lists of keywords: Google warns that keyword stuffing in alt attributes makes for a poor user experience and can make a site look spammy.',
      'Alt text is one part of [image SEO](/glossary/image-seo). Google also reads the filename, captions and the text around the image, so an image placed next to a relevant paragraph is easier to understand than one floating alone in a gallery.',
    ],
    why: [
      'Alt text is one of the main ways Google understands images, which helps them rank in Google Images and image results within the main SERP. When an image is a link, its alt text acts like [anchor text](/glossary/anchor-text).',
      'It is also an accessibility requirement under WCAG and, in many countries, accessibility law. Good alt text helps real people first.',
    ],
    how: {
      heading: 'How to write alt text',
      steps: [
        'Describe what the image shows and why it is there, in one short sentence or phrase.',
        'Be specific: “Golden retriever puppy chewing a red rope toy” beats “dog”.',
        'Include a keyword only if it describes the image naturally.',
        'Don’t start with “image of” or “picture of”; screen readers already announce an image.',
        'Use alt="" for decorative images, and describe the action for linked images or buttons.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<img src="/img/starter-day-5.webp" alt="Sourdough starter on day 5, bubbly and doubled in size in a glass jar" width="800" height="600">\n\n<!-- Decorative divider: empty alt -->\n<img src="/img/divider.svg" alt="">',
    },
    openseo: {
      body: 'The site audit flags images with missing alt attributes across your site.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['image-seo', 'anchor-text', 'image-pack', 'on-page-seo', 'keyword-stuffing'],
    faqs: [
      {
        question: 'Is alt text a ranking factor?',
        answer: ['It helps images rank in image search and helps Google understand page content. Its effect on the page’s web ranking is small; its main value is accessibility and image search.'],
      },
      {
        question: 'How long should alt text be?',
        answer: ['There is no strict limit, but keep it concise, usually a short sentence. Use the surrounding text or a caption for longer explanations.'],
      },
      {
        question: 'Is it an alt tag or alt attribute?',
        answer: ['Technically an alt attribute on the <img> element. “Alt tag” is a common informal name for the same thing.'],
      },
    ],
  },
  {
    slug: 'image-seo',
    term: 'Image SEO',
    aka: ['image optimisation', 'image optimization', 'Google Images SEO'],
    category: 'on-page',
    short: 'Image SEO is optimising images so they load fast, are understood by search engines and can rank in Google Images and image results.',
    definition: [
      'Image SEO is the practice of optimising images so search engines can find, understand and rank them, and so they don’t slow the page down. It covers descriptive filenames and [alt text](/glossary/alt-text), placing images near relevant text, modern formats and compression, correct sizing, lazy loading below the fold and image sitemaps or structured data where useful.',
      'Google finds images through the src attribute of <img> elements; images set only as CSS backgrounds aren’t indexed as images. Google Images supports formats including JPEG, PNG, GIF, WebP, SVG and AVIF. Images are often the largest file on a page and frequently the [Largest Contentful Paint](/glossary/largest-contentful-paint) element, so they matter for speed too.',
    ],
    why: [
      'Image results bring traffic for visual searches such as products, recipes, design and places, and images can appear in the main SERP, in Discover and in product listings.',
      'Unoptimised images are a common cause of slow pages and layout shift, which hurt user experience and Core Web Vitals.',
    ],
    how: {
      heading: 'How to optimise images for SEO',
      steps: [
        'Use original, relevant images rather than generic stock where you can.',
        'Give files descriptive names, such as sourdough-starter-day-5.webp.',
        'Write useful alt text and place images near related text or captions.',
        'Compress images and serve modern formats like WebP or AVIF, at the size they are displayed, with srcset for different screens.',
        'Set width and height attributes to prevent layout shift.',
        'Lazy-load images below the fold, but never the main image at the top of the page.',
        'Add images to structured data for products, recipes and articles where relevant.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<img src="/img/oak-table-800.webp"\n     srcset="/img/oak-table-400.webp 400w, /img/oak-table-800.webp 800w, /img/oak-table-1600.webp 1600w"\n     sizes="(max-width: 600px) 100vw, 800px"\n     alt="Solid oak dining table set for six"\n     width="800" height="533" loading="lazy">',
    },
    openseo: {
      body: 'The site audit flags missing alt text, and its Lighthouse runs show heavy or unoptimised images that slow your pages.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['alt-text', 'image-pack', 'lazy-loading', 'largest-contentful-paint', 'page-speed', 'cumulative-layout-shift'],
    faqs: [
      {
        question: 'What is the best image format for SEO?',
        answer: ['WebP and AVIF usually give the smallest files at good quality and are supported by Google and modern browsers. Use SVG for logos and icons.'],
      },
      {
        question: 'Do image filenames matter for SEO?',
        answer: ['A little. Google says filenames can give it clues about an image’s subject, so descriptive names are better than IMG_4821.jpg.'],
      },
    ],
  },
  {
    slug: 'internal-links',
    term: 'Internal links',
    aka: ['internal linking', 'internal link', 'site links'],
    category: 'on-page',
    short: 'Internal links are links from one page on your site to another. They help visitors navigate, help crawlers find pages and spread link authority.',
    definition: [
      'Internal links are hyperlinks that point from one page to another page on the same website, such as navigation menus, breadcrumbs, related posts and links within the body text. They help visitors move around the site, help search engines discover and understand pages, and pass ranking signals from stronger pages to weaker ones.',
      'Search engines find most pages by following links, so a page with no internal links pointing to it, an [orphan page](/glossary/orphan-page), may never be crawled. The [anchor text](/glossary/anchor-text) of internal links tells Google what the target page is about. Pages linked from many important pages, like the homepage, tend to be treated as more important, because [link equity](/glossary/link-equity) flows through internal links as well as external ones.',
      'Contextual links, placed in the body text where they are relevant, are especially useful because they connect related topics. That is the idea behind [topic clusters](/glossary/topic-cluster): a pillar page links to detailed subtopic pages and they link back.',
    ],
    why: [
      'Internal linking is one of the few ranking levers fully under your control. Linking a new page from a strong, relevant page can help it get crawled and ranked faster.',
      'It also shapes how visitors move through the site towards conversions, and keeps important pages within a few clicks of the homepage.',
    ],
    how: {
      heading: 'How to build internal links',
      steps: [
        'Link to every important page from at least one relevant page, using normal <a href> links.',
        'Use descriptive anchor text that says what the target page is about; avoid “click here”.',
        'Link from your strongest pages, such as those with the most backlinks, to pages you want to boost.',
        'Add links in the body where they genuinely help the reader, not only in footers and sidebars.',
        'Link related pages to each other in clusters.',
        'Fix broken internal links and update links that point to redirected URLs.',
        'Check [crawl depth](/glossary/crawl-depth): keep key pages within about three clicks of the homepage.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<p>Before you feed it, check that your <a href="/guides/sourdough-starter">sourdough starter</a> has doubled in size.</p>',
    },
    openseo: {
      body: 'The site audit maps your internal links, flags orphan pages, broken links and links to redirects, and shows how deep each page sits.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['anchor-text', 'orphan-page', 'link-equity', 'site-architecture', 'crawl-depth', 'topic-cluster', 'breadcrumbs'],
    faqs: [
      {
        question: 'How many internal links should a page have?',
        answer: ['There is no fixed number. Add links where they help the reader; a page with hundreds of links dilutes each one and is hard to use.'],
      },
      {
        question: 'Should internal links be nofollow?',
        answer: ['Generally no. Nofollow on internal links stops signals flowing to your own pages. Use noindex or robots.txt, not nofollow, to manage pages you don’t want in search.'],
      },
      {
        question: 'Do internal links help rankings?',
        answer: ['Yes. They help Google discover pages, understand their topic through anchor text and judge their importance within the site.'],
      },
    ],
  },
  {
    slug: 'meta-robots-tag',
    term: 'Meta robots tag',
    aka: ['robots meta tag', 'meta robots', 'robots directives'],
    category: 'on-page',
    short: 'A meta robots tag is an HTML tag that tells search engines whether to index a page, follow its links and how to show it in results.',
    definition: [
      'A meta robots tag is an HTML <meta> element in a page’s <head> that gives search engines instructions for that page, such as noindex (don’t show it in results), nofollow (don’t follow its links) or nosnippet (don’t show a text snippet). Without it, the default is index, follow. You can target all crawlers with name="robots" or one, such as name="googlebot".',
      'Common values include noindex, nofollow, none (both), nosnippet, max-snippet:[number], max-image-preview:[none|standard|large], max-video-preview:[number], noimageindex, notranslate, indexifembedded and unavailable_after:[date]. For non-HTML files such as PDFs, the same rules can be sent in an HTTP header with the [X-Robots-Tag](/glossary/x-robots-tag).',
      'A crawler has to fetch the page to see the tag. If robots.txt blocks the URL, Google never reads the noindex, and the URL can still be indexed from links. To remove a page from results, allow crawling and use noindex. See [robots.txt](/glossary/robots-txt) for how the two interact.',
      'Nofollow in the meta robots tag applies to every link on the page. To mark a single link, use the rel attribute on that link instead; see [nofollow](/glossary/nofollow). Google treats nofollow as a hint rather than a strict rule.',
    ],
    why: [
      'The meta robots tag is how you keep thin, private or duplicate pages, such as internal search results, thank-you pages and staging sites, out of search results.',
      'It is also a common cause of disaster: a noindex left on after a redesign or copied from staging can remove a whole site from Google.',
    ],
    how: {
      heading: 'How to use the meta robots tag',
      steps: [
        'Add noindex to pages that shouldn’t appear in search, and leave them crawlable.',
        'Don’t put noindex on pages you list in your XML sitemap or point canonicals to.',
        'Use max-snippet or nosnippet if you need to limit how much text appears in results.',
        'After any launch or migration, check key templates for unwanted noindex tags.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- Keep out of search results, but follow links -->\n<meta name="robots" content="noindex, follow">\n\n<!-- Limit snippets for Google only -->\n<meta name="googlebot" content="max-snippet:50, max-image-preview:large">',
    },
    openseo: {
      body: 'The site audit flags noindex pages, including noindex pages that sit in your sitemap or receive internal links.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['noindex', 'nofollow', 'x-robots-tag', 'robots-txt', 'indexing'],
    faqs: [
      {
        question: 'What is the difference between robots.txt and the meta robots tag?',
        answer: ['Robots.txt controls crawling across URLs or folders. The meta robots tag controls indexing and display of a single page, and only works if the page can be crawled.'],
      },
      {
        question: 'Do I need a meta robots tag on every page?',
        answer: ['No. The default is index, follow, so you only need the tag when you want something different.'],
      },
    ],
  },
  {
    slug: 'meta-keywords',
    term: 'Meta keywords tag',
    aka: ['meta keywords', 'keywords meta tag'],
    category: 'on-page',
    short: 'The meta keywords tag is an old HTML tag for listing a page’s keywords. Google ignores it for ranking and has done since at least 2009.',
    definition: [
      'The meta keywords tag is an HTML <meta name="keywords"> element that lists keywords a page is supposed to be about. Search engines used it in the 1990s, but it was abused so heavily with stuffed and irrelevant words that Google stopped using it. Google confirmed in 2009 that it doesn’t use the meta keywords tag in web search ranking.',
      'The tag is harmless to leave in place for Google, but it has no SEO benefit. It can even reveal your target keywords to competitors who look at your source code. Some internal site search tools still read it, which is the only good reason to keep it.',
      'Don’t confuse it with other meta tags that do matter. The [meta description](/glossary/meta-description) can be shown as your search snippet, and the [meta robots tag](/glossary/meta-robots-tag) controls indexing. Only the keywords tag is obsolete.',
    ],
    why: [
      'Knowing the tag is obsolete saves time. Old plugins, checklists and agency reports sometimes still ask for it; effort is better spent on the [title tag](/glossary/title-tag), content and internal links.',
      'It is also a useful example of why stuffing doesn’t work: signals that are easy to manipulate get ignored. See [keyword stuffing](/glossary/keyword-stuffing).',
    ],
    how: {
      heading: 'How to handle meta keywords',
      steps: [
        'Don’t add meta keywords for SEO.',
        'Remove existing ones if they list competitor names or look stuffed, or simply leave them if harmless.',
        'Put your keyword effort into titles, headings, body copy and internal anchor text.',
      ],
    },
    example: {
      label: 'HTML (obsolete)',
      code: '<!-- Ignored by Google for ranking -->\n<meta name="keywords" content="sourdough, starter, bread, baking">',
    },
    related: ['keyword-stuffing', 'title-tag', 'meta-description', 'on-page-seo', 'ranking-factors'],
    faqs: [
      {
        question: 'Does Google use meta keywords?',
        answer: ['No. Google announced in 2009 that it doesn’t use the meta keywords tag in its web search ranking.'],
      },
      {
        question: 'Why did Google stop using meta keywords?',
        answer: ['Because site owners could write anything in the tag, it was widely stuffed with irrelevant terms. Google relies on the visible content of the page instead, which is far harder to fake.'],
      },
      {
        question: 'Should I remove meta keywords from my site?',
        answer: ['It isn’t urgent; they don’t hurt rankings in Google. Remove them if they reveal strategy to competitors or look spammy.'],
      },
    ],
  },
  {
    slug: 'open-graph',
    term: 'Open Graph tags',
    aka: ['Open Graph', 'OG tags', 'og:image', 'Open Graph protocol'],
    category: 'on-page',
    short: 'Open Graph tags are meta tags that control how a page looks when shared on social platforms and messaging apps: title, description and image.',
    definition: [
      'Open Graph tags are <meta> elements, defined by the Open Graph protocol created by Facebook, that tell social networks and messaging apps how to display a page when someone shares its link. The core tags are og:title, og:type, og:image and og:url, usually with og:description and og:site_name. They use the property attribute, for example property="og:title".',
      'Facebook, LinkedIn, WhatsApp, Slack, Discord, iMessage and many others read Open Graph tags to build link previews. X reads its own [Twitter card](/glossary/twitter-card) tags but falls back to Open Graph for the title, description and image when they are missing. Open Graph tags aren’t a Google ranking factor, though Google may use og:title as one source for title links.',
      'Open Graph text can differ from your [title tag](/glossary/title-tag) and [meta description](/glossary/meta-description). A search title is written for someone looking for an answer; a social title is seen by someone scrolling a feed, so it can be shorter and more conversational. The image matters most: it is usually the largest part of the preview.',
    ],
    why: [
      'A share with a clear title and large image gets noticed and clicked; a share with no image or the wrong text gets scrolled past. Better previews mean more referral traffic and more people seeing content that might earn links.',
      'Without Open Graph tags, platforms guess, often picking a logo, a cookie banner or the first random image on the page.',
    ],
    how: {
      heading: 'How to add Open Graph tags',
      steps: [
        'Add og:title, og:description, og:image, og:url and og:type to the <head> of each page.',
        'Use a large image; 1200 × 630 pixels is the size Facebook recommends for link previews.',
        'Use an absolute URL for og:image and og:url.',
        'Test with Facebook’s Sharing Debugger or LinkedIn’s Post Inspector, which also refresh cached previews.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<meta property="og:title" content="How to make a sourdough starter">\n<meta property="og:description" content="Flour, water and 7 days. A step-by-step guide with photos.">\n<meta property="og:image" content="https://example.com/img/starter-og.jpg">\n<meta property="og:url" content="https://example.com/guides/sourdough-starter">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="Baker’s Notes">',
    },
    related: ['twitter-card', 'title-tag', 'meta-description', 'on-page-seo', 'structured-data'],
    faqs: [
      {
        question: 'Do Open Graph tags help SEO?',
        answer: ['Not directly. They don’t affect Google rankings, but better social previews bring more clicks and visibility, which can lead to links and mentions.'],
      },
      {
        question: 'What size should an og:image be?',
        answer: ['1200 × 630 pixels is the common recommendation and works well on most platforms.'],
      },
    ],
  },
  {
    slug: 'twitter-card',
    term: 'Twitter card (X card)',
    aka: ['X card', 'Twitter cards', 'twitter:card'],
    category: 'on-page',
    short: 'A Twitter card (now X card) is a set of meta tags that controls how a link looks when posted on X, including its title, description and image.',
    definition: [
      'A Twitter card, now often called an X card, is a set of <meta name="twitter:..."> tags that control how a link preview appears when someone posts it on X (formerly Twitter). The twitter:card tag sets the layout, most often summary (small square image) or summary_large_image (large image above the text). Other types are app and player.',
      'X looks for its own tags first, such as twitter:title, twitter:description and twitter:image, and falls back to the matching [Open Graph](/glossary/open-graph) tags if they are missing. So many sites only add twitter:card plus Open Graph tags. Like Open Graph, Twitter cards don’t affect Google rankings.',
      'Twitter card tags use the name attribute (name="twitter:card"), while Open Graph uses property (property="og:title"). Mixing them up is a common reason previews fail. X caches previews, so after changing tags you may need to wait or post a fresh URL to see the update. For search snippets, the [meta description](/glossary/meta-description) still does the work.',
    ],
    why: [
      'Posts with a large image preview take up more space in the feed and tend to draw more attention than bare links.',
      'Without a twitter:card tag, X may show a minimal preview even if your Open Graph tags are present.',
    ],
    how: {
      heading: 'How to add a Twitter card',
      steps: [
        'Add <meta name="twitter:card" content="summary_large_image"> to the page’s <head>.',
        'Make sure Open Graph title, description and image tags are present, or add twitter:title, twitter:description and twitter:image.',
        'Optionally add twitter:site with your X handle.',
        'Post the link, or preview it in a draft, to check how it appears.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:site" content="@example">\n<meta name="twitter:title" content="How to make a sourdough starter">\n<meta name="twitter:image" content="https://example.com/img/starter-og.jpg">',
    },
    related: ['open-graph', 'title-tag', 'meta-description', 'on-page-seo'],
    faqs: [
      {
        question: 'What is the difference between summary and summary_large_image?',
        answer: ['summary shows a small square thumbnail next to the title; summary_large_image shows a wide image above the title. Most articles and product pages use summary_large_image.'],
      },
      {
        question: 'Do I need Twitter card tags if I have Open Graph tags?',
        answer: ['You need at least twitter:card to choose the layout. X falls back to Open Graph for the title, description and image.'],
      },
      {
        question: 'Do Twitter cards help SEO?',
        answer: ['Not for Google rankings. They improve how links look on X, which can bring more clicks and visibility.'],
      },
    ],
  },
  {
    slug: 'breadcrumbs',
    term: 'Breadcrumbs',
    aka: ['breadcrumb navigation', 'breadcrumb trail', 'BreadcrumbList'],
    category: 'on-page',
    short: 'Breadcrumbs are a row of links showing where a page sits in a site’s hierarchy, such as Home > Shoes > Running. They help users and search engines.',
    definition: [
      'Breadcrumbs are a navigation trail near the top of a page that shows the path from the homepage to the current page, for example Home > Garden > Houseplants > Snake plant. Each step links to that level of the site. They help visitors see where they are and give search engines extra internal links and structure.',
      'Breadcrumbs work best on sites with a clear hierarchy, such as shops, documentation and large blogs, where a visitor arriving from search may land several levels deep. They should mirror your [site architecture](/glossary/site-architecture) and the folders in your [URLs](/glossary/seo-friendly-url) where possible, so the structure tells one consistent story.',
      'You can mark breadcrumbs up with BreadcrumbList [structured data](/glossary/structured-data) so Google understands the trail. Google has used breadcrumbs in place of the raw URL in desktop results; in January 2025 it simplified mobile results to show only the site’s domain, not the breadcrumb path.',
    ],
    why: [
      'Breadcrumbs add relevant [internal links](/glossary/internal-links) up the hierarchy on every page, which helps crawlers and spreads link signals to category pages.',
      'They make large sites, especially shops and documentation, easier to navigate, which helps visitors who land deep in the site from search.',
    ],
    how: {
      heading: 'How to add breadcrumbs',
      steps: [
        'Reflect your real site hierarchy, not the path the visitor happened to take.',
        'Make each step except the current page a link.',
        'Place the trail near the top of the main content.',
        'Add BreadcrumbList structured data in JSON-LD and test it with the Rich Results Test.',
      ],
    },
    example: {
      label: 'JSON-LD',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    { "@type": "ListItem", "position": 1, "name": "Garden", "item": "https://example.com/garden/" },\n    { "@type": "ListItem", "position": 2, "name": "Houseplants", "item": "https://example.com/garden/houseplants/" },\n    { "@type": "ListItem", "position": 3, "name": "Snake plant" }\n  ]\n}\n</script>',
    },
    related: ['internal-links', 'site-architecture', 'structured-data', 'schema-markup', 'url-slug'],
    faqs: [
      {
        question: 'Do breadcrumbs help SEO?',
        answer: ['Yes, indirectly. They add useful internal links, clarify site structure and help users navigate. Breadcrumb markup can also be shown in desktop search results.'],
      },
      {
        question: 'Why don’t my breadcrumbs show in Google on mobile?',
        answer: ['Since January 2025, Google’s mobile results show only the site’s domain in the URL line, not the breadcrumb path. Breadcrumbs can still appear on desktop, and they still help users and crawlers on your site.'],
      },
      {
        question: 'Does the last breadcrumb need a link?',
        answer: ['No. The current page is usually shown as plain text. In BreadcrumbList markup the last item can omit the item URL.'],
      },
    ],
  },
  {
    slug: 'word-count',
    term: 'Word count',
    aka: ['content length', 'article length'],
    category: 'on-page',
    short: 'Word count is the number of words on a page. Google says it isn’t a ranking factor; the right length is whatever fully answers the query.',
    definition: [
      'Word count is the number of words in a page’s main content. In SEO it comes up as a question of how long content should be. Google has said word count is not a ranking factor, and its guidance on helpful content warns against writing to a particular word count because you’ve heard Google prefers it.',
      'Long pages often rank well for broad topics because covering a topic thoroughly takes words, not because length itself is rewarded. For a quick fact, a short page that answers immediately is better. Very short pages with little unique content can, however, be judged [thin content](/glossary/thin-content).',
      'Word count is more useful as a diagnostic than a target. Very low counts across many templated pages can flag thin pages in an audit, and very high counts can flag pages that ramble or try to cover several topics at once. What matters is whether the page satisfies the [search intent](/glossary/search-intent) behind the query.',
    ],
    why: [
      'Chasing a word count leads to padding, which makes pages worse for readers and buries the answer. It also wastes writing time.',
      'Looking at the length of pages that already rank gives a rough sense of how much depth a topic needs, which is useful when planning a brief.',
    ],
    how: {
      heading: 'How to decide content length',
      steps: [
        'Check the top-ranking pages to see how deep they go, not to match their word count.',
        'List the questions a searcher has, and answer each one fully.',
        'Lead with the direct answer, then add detail for those who want it.',
        'Cut repetition, filler intros and anything a reader would skip.',
      ],
    },
    openseo: {
      body: 'The SERP checker shows the current top 10 for any keyword, so you can see what depth and format already rank.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['thin-content', 'helpful-content', 'content-brief', 'search-intent', 'readability'],
    faqs: [
      {
        question: 'Is word count a ranking factor?',
        answer: ['No. Google has said so directly. Length only matters insofar as it lets you answer the query fully.'],
      },
      {
        question: 'How long should a blog post be for SEO?',
        answer: ['As long as it takes to answer the reader’s question well and no longer. Check what ranks for your keyword for a sense of the depth expected.'],
      },
    ],
  },
  {
    slug: 'above-the-fold',
    term: 'Above the fold',
    aka: ['above-the-fold content', 'first screen', 'initial viewport'],
    category: 'on-page',
    short: 'Above the fold is the part of a page visible without scrolling. It should show the main content quickly, not a wall of ads or banners.',
    definition: [
      'Above the fold is the part of a web page that a visitor sees on load, before scrolling. The phrase comes from newspapers, where the top half of the front page was visible on the stand. Its size depends on the device and screen, so on a phone it is far smaller than on a desktop monitor.',
      'For SEO and user experience, the area above the fold should make the page’s purpose obvious and show the main content quickly. Google has long penalised pages where ads crowd out content at the top, through its 2012 page layout algorithm, and intrusive interstitials that cover the content are a poor page experience. The largest element visible here is often what [Largest Contentful Paint](/glossary/largest-contentful-paint) measures.',
      'There is no single fold line. A phone in portrait might show a few hundred pixels of height, a laptop much more. Design for the smallest common screen first, since Google uses [mobile-first indexing](/glossary/mobile-first-indexing) and most searches in many markets happen on phones.',
    ],
    why: [
      'Visitors decide in seconds whether a page answers their search. If they see only a cookie banner, a pop-up and an ad, many leave.',
      'Speed matters most above the fold: Core Web Vitals measure how fast that first view loads and whether it shifts around.',
    ],
    how: {
      heading: 'How to optimise above-the-fold content',
      steps: [
        'Show the H1 and the start of the main content on the first screen on mobile.',
        'Keep ads, banners and pop-ups from pushing content below the fold.',
        'Load the hero image fast: don’t lazy-load it, and consider fetchpriority="high".',
        'Reserve space for images and embeds to avoid layout shift.',
      ],
    },
    openseo: {
      body: 'The site audit includes Lighthouse runs on mobile and desktop that measure how fast the first screen loads and whether it shifts.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['largest-contentful-paint', 'cumulative-layout-shift', 'core-web-vitals', 'lazy-loading', 'page-speed'],
    faqs: [
      {
        question: 'Does content above the fold rank better?',
        answer: ['Google indexes the whole page, so content lower down still counts. But a page that hides its main content behind ads or interstitials gives a poor experience, which Google’s systems discourage.'],
      },
      {
        question: 'Should I lazy-load images above the fold?',
        answer: ['No. Lazy-loading the first visible image delays it and usually worsens Largest Contentful Paint.'],
      },
    ],
  },
  {
    slug: 'title-tag-length',
    term: 'Title tag length',
    aka: ['title length', 'meta title length', 'title character limit'],
    category: 'on-page',
    short: 'Title tag length is how long a page title is. Google truncates by pixel width, about 600px on desktop, so aim for roughly 50 to 60 characters.',
    definition: [
      'Title tag length is the length of a page’s <title> element. Google doesn’t set a character limit, but it truncates title links in results to fit the available width, roughly 600 pixels on desktop. In practice that means about 50 to 60 characters before an ellipsis appears, depending on how wide the letters are.',
      'Because the limit is in pixels, “WWWWW” takes more room than “iiiii”, and capital letters use more space than lowercase. Mobile layouts can show title links on more than one line, so the visible length differs by device. Google may also rewrite titles that are very long. Words past the cut-off may still be read by Google; they just aren’t shown.',
      'Length is one part of writing a good [title tag](/glossary/title-tag). A title that fits but is vague will still underperform, so check [click-through rate](/glossary/click-through-rate) in Search Console after changes rather than relying on a character count alone.',
    ],
    why: [
      'A truncated title can cut off the part that persuades people to click, or the brand, or make the result look careless.',
      'Very short titles waste space that could describe the page better, while very long ones are more likely to be rewritten.',
    ],
    how: {
      heading: 'How to check title tag length',
      steps: [
        'Write the important words first, so truncation only removes less important ones.',
        'Aim for about 50 to 60 characters and check the pixel width in a SERP preview tool.',
        'Trim filler words and drop the brand from the end if space is tight.',
        'Check for titles flagged as too long or too short in a site audit.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Too long (82 characters): “The Complete Beginner’s Guide to Making Your Own Sourdough Starter at Home in 2026”. Better (45 characters): “How to Make a Sourdough Starter (7-Day Guide)”.',
    },
    openseo: {
      body: 'The site audit flags titles that are missing, duplicated, too long or too short across every page it crawls.',
      href: '/features/site-audit',
      label: 'See the site audit',
    },
    related: ['title-tag', 'meta-description', 'click-through-rate', 'on-page-seo'],
    faqs: [
      {
        question: 'What is the maximum title tag length for Google?',
        answer: ['There is no official maximum. Google truncates displayed titles at roughly 600 pixels on desktop, which is usually 50 to 60 characters.'],
      },
      {
        question: 'Is a long title tag bad for SEO?',
        answer: ['Not directly, but it may be truncated or rewritten, and stuffing extra keywords into it can look spammy. Keep the essential message within the visible part.'],
      },
    ],
  },
  {
    slug: 'heading-hierarchy',
    term: 'Heading hierarchy',
    aka: ['heading structure', 'heading order', 'document outline'],
    category: 'on-page',
    short: 'Heading hierarchy is the logical order of H1 to H6 headings on a page, so sections nest correctly and readers and crawlers can follow the outline.',
    definition: [
      'Heading hierarchy is the nested order of a page’s headings, from H1 down to H6, so that each heading level reflects its place in the content’s outline. An H1 introduces the page, H2s divide it into main sections, H3s split those sections, and so on, like the numbered levels of a table of contents.',
      'A clean hierarchy matters most for accessibility: screen reader users often jump between headings to navigate, and skipped or misused levels make that confusing. Google uses headings to understand the structure of a page, but has said that heading order isn’t something it penalises, so the reason to get it right is mainly clarity for people.',
      'Hierarchy applies to the HTML levels, not how headings look. You can style an H3 large or an H2 small with CSS. The [H1 tag](/glossary/h1-tag) sits at the top, and the full set of [header tags](/glossary/header-tags) should read like a sensible table of contents if you list them on their own.',
    ],
    why: [
      'A logical outline helps readers skim to the part they need and helps search engines match sections of a page to specific queries, which can support featured snippets.',
      'Accessibility guidelines (WCAG) expect headings to convey structure, so a clean hierarchy helps you meet them.',
    ],
    how: {
      heading: 'How to fix heading hierarchy',
      steps: [
        'Start with one H1 for the page topic.',
        'Use H2 for main sections and H3 only inside an H2 section.',
        'Avoid skipping levels, such as going straight from H2 to H4.',
        'Don’t use headings for visual styling or for sidebar and footer labels that aren’t part of the content outline.',
        'Review the outline with a browser extension or accessibility checker.',
      ],
    },
    example: {
      label: 'Outline',
      body: 'H1 Snake plant care → H2 Light → H2 Watering → H3 How often to water → H3 Signs of overwatering → H2 Repotting.',
    },
    openseo: {
      body: 'The page analyser lists a page’s headings in order, so you can spot missing or skipped levels.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['header-tags', 'h1-tag', 'readability', 'featured-snippet', 'on-page-seo'],
    faqs: [
      {
        question: 'Does skipping heading levels hurt SEO?',
        answer: ['Not noticeably. Google has said heading order isn’t a big factor. It does make the page harder to use with assistive technology, so it is still worth fixing.'],
      },
      {
        question: 'Can I use an H3 without an H2?',
        answer: ['It is valid HTML, but it breaks the logical outline. Use the level that matches the section’s place in the structure.'],
      },
    ],
  },
  {
    slug: 'content-optimization',
    term: 'Content optimization',
    aka: ['content optimisation', 'SEO content optimisation', 'on-page content optimization'],
    category: 'on-page',
    hat: 'white',
    short: 'Content optimization is improving a page’s content so it better matches search intent, covers the topic fully and earns more clicks and rankings.',
    definition: [
      'Content optimization is the process of improving a page’s content so it better answers the searches it targets and performs better in search. It includes matching search intent, covering the subtopics and questions searchers expect, adding original information, improving structure and readability, and tuning the title, meta description, headings and internal links.',
      'It applies to new pages and existing ones. Often the biggest wins come from optimising pages that already rank on page two or low on page one: these are close to bringing real traffic, and Search Console shows which queries they are already being tested for. Done honestly, content optimization is white hat. It tips into spam only when it becomes [keyword stuffing](/glossary/keyword-stuffing) or rewriting content purely for search engines without helping readers.',
    ],
    why: [
      'Most sites have pages that are almost good enough. Improving them is usually faster and cheaper than writing new content, and the gains show sooner.',
      'Search intent and competition change. Regular optimization keeps pages accurate and competitive and counters [content decay](/glossary/content-decay).',
    ],
    how: {
      heading: 'How to optimise content for SEO',
      steps: [
        'Pick pages with impressions but few clicks, or rankings in positions 5 to 20, from Search Console.',
        'Check the queries each page gets and the current SERP for its main keyword.',
        'Confirm the page matches the intent shown by the top results; change the format if it doesn’t.',
        'Add missing subtopics, questions and first-hand details, and remove outdated or padded sections.',
        'Rewrite the title and meta description for the queries the page actually receives.',
        'Improve headings, add images or tables where they help, and add internal links from related pages.',
        'Update the page date only if you made meaningful changes, then track results for a few weeks.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s search performance view finds striking-distance queries in positions 5 to 20 and gives them opportunity scores, a ready-made list of pages to optimise.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['on-page-seo', 'content-refresh', 'striking-distance-keywords', 'search-intent', 'content-decay', 'information-gain', 'keyword-stuffing'],
    faqs: [
      {
        question: 'What is content optimization in SEO?',
        answer: ['It is improving a page’s content and on-page elements so it better matches what searchers want and ranks higher for its target queries.'],
      },
      {
        question: 'How often should I optimise content?',
        answer: ['Review important pages at least once or twice a year, and sooner if traffic drops or the SERP changes.'],
      },
    ],
  },
  {
    slug: 'on-page-checklist',
    term: 'On-page SEO checklist',
    aka: ['on-page SEO checklist', 'SEO checklist', 'page optimisation checklist'],
    category: 'on-page',
    short: 'An on-page SEO checklist is a list of items to check on each page, from intent and title tag to headings, images, links and structured data.',
    definition: [
      'An on-page SEO checklist is a repeatable list of checks to run on a page before or after publishing, to make sure its content and HTML give it the best chance to rank and earn clicks. It covers search intent, content quality, title tag, meta description, headings, URL, images, internal links, structured data and indexability.',
      'A checklist doesn’t make a page rank by itself; it catches avoidable mistakes. The most important item, whether the page truly answers the search better than what already ranks, needs judgement rather than a tick box. The rest are quick to verify.',
      'Use it alongside, not instead of, a site-wide [SEO audit](/glossary/seo-audit): the checklist covers one page in depth, the audit covers technical issues across every URL. Each item below links back to the fuller explanation, starting with [search intent](/glossary/search-intent) and the [title tag](/glossary/title-tag).',
    ],
    why: [
      'Small omissions are common: a missing title, a page left on noindex, images without alt text, no internal links pointing in. A checklist catches them before they cost traffic.',
      'It also makes quality consistent across writers and teams.',
    ],
    how: {
      heading: 'On-page SEO checklist',
      steps: [
        'Intent: the page type and format match what ranks for the main keyword.',
        'Content: answers the query early, covers key subtopics, adds original value and is accurate.',
        'Title tag: unique, descriptive, main keyword near the start, about 50 to 60 characters.',
        'Meta description: specific summary with a reason to click, about 150 to 160 characters.',
        'Headings: one clear H1, logical H2 and H3 structure.',
        'URL: short, readable slug with hyphens.',
        'Images: compressed, sized, with descriptive alt text and width and height set.',
        'Internal links: linked from relevant pages, and links out to related pages with descriptive anchors.',
        'Structured data: added where a matching rich result exists, and validated.',
        'Indexability: returns 200, no accidental noindex, self-referencing canonical, included in the sitemap.',
        'Mobile and speed: works on a phone and passes Core Web Vitals where possible.',
        'Trust: author, date and sources shown where relevant.',
      ],
    },
    openseo: {
      body: 'The page analyser checks a single page’s title, description and headings, and the site audit runs 59 technical checks across the whole site.',
      href: '/tools/page-analyser',
      label: 'Open the page analyser',
    },
    related: ['on-page-seo', 'title-tag', 'meta-description', 'header-tags', 'alt-text', 'internal-links', 'seo-audit'],
    faqs: [
      {
        question: 'What are the most important on-page SEO factors?',
        answer: ['Content that matches search intent comes first, followed by a descriptive title tag, clear headings and good internal linking.'],
      },
      {
        question: 'Should I run the checklist on old pages too?',
        answer: ['Yes. Running it on pages that already get impressions often brings quicker gains than new pages.'],
      },
    ],
  },
];
