import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  // ---------------------------------------------------------------- analytics
  {
    slug: 'google-search-console',
    term: 'Google Search Console',
    aka: ['GSC', 'Search Console', 'Google Webmaster Tools'],
    category: 'analytics',
    short: 'Google Search Console is Google’s free tool that shows how your site performs in Google Search and flags indexing, security and spam problems.',
    definition: [
      'Google Search Console is a free service from Google that shows how a website performs in Google Search. It reports the queries people searched, how often your pages appeared and were clicked, which pages are indexed, and any crawling, security or manual action problems Google has found on the site.',
      'Search Console was called Google Webmaster Tools until 2015. It is the only place where Google itself tells you how your site is doing in its results. Every other SEO tool estimates; Search Console reports Google’s own data, with some sampling and privacy filtering.',
      'You add a site as a property. A **domain property** (verified by a DNS record) covers every subdomain and both http and https. A **URL-prefix property** covers only addresses that start with the exact prefix you enter, such as https://www.example.com/. You can verify a URL-prefix property with a DNS record, an HTML file, a meta tag, Google Analytics or Google Tag Manager.',
      'The main reports are: the [Performance report](/glossary/search-console-performance-report) (clicks, impressions, CTR and average position by query, page, country, device, search appearance and date); Page indexing (which URLs are indexed and why others are not); Sitemaps; the URL Inspection tool (live test of one URL, with the rendered HTML and a request-indexing button); Core Web Vitals; HTTPS; enhancement reports for [rich results](/glossary/rich-results); Links (top linked pages, top linking sites, top anchor text); and the Security issues and Manual actions reports.',
      'Performance data goes back 16 months. Anything older is gone unless you export it, so save it to a spreadsheet, a warehouse (Search Console has a bulk export to BigQuery) or a tool that stores it for you. Data usually lags by a day or two, though recent days are available in a fresher, provisional view. Links shown in AI Overviews and AI Mode are counted within the web search totals rather than in a separate breakdown.',
    ],
    why: [
      'Search Console is where Google tells you directly whether it can crawl and index your pages, and whether it has penalised you. A [manual action](/glossary/manual-action) only shows up here. So do hacked-content and malware warnings. If you never check it, you can lose rankings for weeks without knowing why.',
      'It is also the most reliable source of query data you will get. Analytics tools see that a visit came from Google but, because search terms are encrypted, not what was searched. Search Console fills that gap: you see the real queries, how many impressions each one earned and how your [click-through rate](/glossary/click-through-rate) compares across pages.',
      'That makes it the starting point for most SEO work: finding [striking distance keywords](/glossary/striking-distance-keywords) to push onto page one, spotting pages whose CTR is low for their position (usually a title problem), catching [keyword cannibalization](/glossary/keyword-cannibalization) where two pages swap for the same query, and confirming whether a change helped.',
    ],
    how: {
      heading: 'How to set up Google Search Console',
      steps: [
        'Go to search.google.com/search-console and sign in with the Google account you want to own the property.',
        'Choose **Domain** and enter your bare domain (example.com). Add the TXT record Google gives you at your DNS provider, wait for it to propagate, then click Verify. Use a URL-prefix property instead only if you cannot edit DNS.',
        'Submit your [XML sitemap](/glossary/xml-sitemap) under Sitemaps so Google can find every page you want indexed.',
        'Add other people under Settings > Users and permissions with Full or Restricted access, rather than sharing your login.',
        'After a few days, open Page indexing to see which URLs are not indexed and why, and the Performance report to see your first queries.',
        'Check the Manual actions and Security issues reports. Both should say no issues detected.',
        'Set up a regular export or connect a tool that stores the data, so you keep more than 16 months of history.',
        'Turn on email notifications so Google can alert you to new indexing errors, manual actions or security problems.',
      ],
    },
    example: {
      label: 'DNS TXT record for a domain property',
      code: 'example.com.  3600  IN  TXT  "google-site-verification=AbC123exampleToken"',
    },
    openseo: {
      body: 'OpenSEO connects to Search Console read-only and stores your query data, so you can see striking-distance queries (positions 5 to 20) with opportunity scores and compare any two periods.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['search-console-performance-report', 'google-analytics-4', 'impressions', 'click-through-rate', 'average-position', 'manual-action', 'indexing', 'bing-webmaster-tools'],
    faqs: [
      {
        question: 'Is Google Search Console free?',
        answer: ['Yes. Search Console is free for anyone who can verify they own or manage a site. There is no paid tier.'],
      },
      {
        question: 'How far back does Search Console data go?',
        answer: ['The Performance report keeps 16 months of data. To keep a longer history you need to export it regularly or use the bulk export to BigQuery, which stores data from the day you turn it on.'],
      },
      {
        question: 'What is the difference between Search Console and Google Analytics?',
        answer: ['Search Console shows what happens in Google Search before the click: queries, impressions, rankings and indexing. [Google Analytics 4](/glossary/google-analytics-4) shows what visitors do on your site after they arrive from any channel. Most sites need both.'],
      },
      {
        question: 'Why don’t Search Console clicks match my analytics sessions?',
        answer: ['They measure different things. Search Console counts clicks on Google’s results, while analytics counts sessions that loaded its tag, so blocked scripts, consent banners, bounces before the tag fires and different time zones all create gaps. Expect them to be close in trend, not identical.'],
      },
    ],
  },
  {
    slug: 'google-analytics-4',
    term: 'Google Analytics 4 (GA4)',
    aka: ['GA4', 'Google Analytics'],
    category: 'analytics',
    short: 'Google Analytics 4 (GA4) is Google’s free web and app analytics tool. It measures visits as events and reports where users come from and what they do.',
    definition: [
      'Google Analytics 4 (GA4) is the current version of Google’s analytics platform. It records what visitors do on a website or app as a stream of events, such as page views, scrolls, clicks and purchases, and reports where those users came from, how engaged they were and which [key events](/glossary/key-events) they completed.',
      'GA4 replaced Universal Analytics, which stopped processing data for standard properties on 1 July 2023. The big change is the data model. Universal Analytics was built around sessions and pageviews; GA4 treats everything as an event with parameters. A page view is a page_view event, a form submission might be a generate_lead event, and you choose which events count as key events.',
      'GA4 also changed its headline metrics. Bounce rate came back in 2022 but is now defined as the inverse of [engagement rate](/glossary/engagement-rate). Conversions were renamed key events in 2024. Standard properties keep detailed user and event data for 2 or 14 months (you set this in Data retention), while standard aggregated reports are not affected by that setting.',
    ],
    why: [
      'Search Console tells you how you were found. GA4 tells you whether those visits were worth anything. To judge SEO by results, you need to know how organic visitors behave: which [landing pages](/glossary/landing-page) they arrive on, whether they engage, and whether they sign up or buy.',
      'The organic search channel in GA4 (the "Organic Search" default channel group) lets you compare SEO with paid, social, email and referral traffic on the same terms, and put a value on it for [SEO ROI](/glossary/seo-roi). GA4 does not show the search queries behind organic visits; link it to Search Console to see query and landing page data side by side.',
    ],
    how: {
      heading: 'How to see organic traffic in GA4',
      steps: [
        'Open Reports > Acquisition > Traffic acquisition.',
        'Keep the primary dimension as Session default channel group and look at the Organic Search row for sessions, engaged sessions, engagement rate and key events.',
        'To see which pages organic visitors land on, open Engagement > Landing page and add a filter or comparison for Session default channel group = Organic Search.',
        'Link Search Console under Admin > Product links > Search Console links, then publish the Search Console collection in the Library so its query and landing page reports appear.',
        'Mark the events that matter to your business as key events so you can see which organic landing pages produce them.',
      ],
    },
    openseo: {
      body: 'OpenSEO reads GA4 alongside Search Console (read-only), so you can see queries, rankings and on-site results for the same pages in one place.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['google-search-console', 'engagement-rate', 'bounce-rate', 'key-events', 'utm-parameters', 'organic-traffic', 'looker-studio'],
    faqs: [
      {
        question: 'Is GA4 free?',
        answer: ['Yes, the standard version of GA4 is free. Google Analytics 360 is a paid version for large organisations with higher limits and service agreements.'],
      },
      {
        question: 'Does GA4 show organic search keywords?',
        answer: ['No. Google encrypts search queries, so GA4 shows the visit as Organic Search but not the keyword. Link GA4 to Search Console to see queries next to landing pages.'],
      },
      {
        question: 'Can I still use Universal Analytics?',
        answer: ['No. Standard Universal Analytics properties stopped processing data in July 2023 and the interface and API were later shut down. GA4 is the only current version.'],
      },
    ],
  },
  {
    slug: 'bing-webmaster-tools',
    term: 'Bing Webmaster Tools',
    aka: ['BWT', 'Bing Webmaster'],
    category: 'analytics',
    short: 'Bing Webmaster Tools is Microsoft’s free console for site owners. It shows Bing search performance, indexing and crawl data, and supports IndexNow.',
    definition: [
      'Bing Webmaster Tools is Microsoft’s free service for monitoring how a website performs in Bing Search. Like Google Search Console, it reports the queries and pages that earn impressions and clicks, lets you submit sitemaps and URLs, shows crawl and indexing problems, and lists backlinks Bing has found to your site.',
      'You can verify a site with an XML file, a meta tag, a DNS record, or by importing it directly from Google Search Console, which is the quickest route. Beyond search performance, it includes URL Inspection, a Site Scan crawler, a keyword research tool, a backlinks report and support for [IndexNow](/glossary/indexnow), the protocol for telling search engines a URL has changed. In 2026 Bing added an AI Performance report, in preview, showing how often your pages are cited in Copilot and Bing’s AI answers.',
    ],
    why: [
      'Bing’s index matters beyond Bing.com. Microsoft Copilot draws on Bing, and other search and AI products have licensed Bing results. If Bing cannot crawl or index a page, you can be missing from more places than one search engine. See [Bing SEO](/glossary/bing-seo) for how ranking differs.',
      'It is also a second opinion on your site. Bing’s crawl reports and backlink data sometimes catch issues that Search Console does not surface, and it is free.',
    ],
    how: {
      heading: 'How to add a site to Bing Webmaster Tools',
      steps: [
        'Sign in at bing.com/webmasters with a Microsoft, Google or Facebook account.',
        'Choose Import from Google Search Console to bring in your verified sites and sitemaps in one step, or add a site manually and verify it.',
        'Check that your sitemap is listed under Sitemaps and has been processed.',
        'Set up IndexNow on your site or CMS so new and changed URLs are submitted automatically.',
        'Review Search Performance and Site Scan after a few days.',
      ],
    },
    related: ['bing-seo', 'google-search-console', 'indexnow', 'xml-sitemap', 'indexing'],
    faqs: [
      {
        question: 'Do I need Bing Webmaster Tools if I use Search Console?',
        answer: ['It is worth the five minutes. It is the only way to see Bing’s own data on your site, it supports IndexNow, and Bing’s index feeds Copilot and other services.'],
      },
      {
        question: 'Can I import my site from Google Search Console?',
        answer: ['Yes. Bing Webmaster Tools can import verified sites and their sitemaps from Search Console, so you do not need to verify each one again.'],
      },
    ],
  },
  {
    slug: 'impressions',
    term: 'Impressions',
    aka: ['search impressions', 'SERP impressions'],
    category: 'analytics',
    short: 'Impressions count how often a link to your site appeared in search results that someone viewed, whether or not they clicked it.',
    definition: [
      'Impressions are the number of times a link to your site appeared in search results that someone viewed. In Google Search Console, an impression is counted when your result is on the page of results the user loaded, whether or not they scrolled down to it, and regardless of whether they clicked.',
      'Search Console counts impressions by property or by page. In the property view, several of your URLs appearing on the same results page usually count as one impression for the site; in the page view, each URL gets its own. That is why page-level totals can add up to more than the site total. Some features, such as carousels, only count an impression once the result is scrolled or expanded into view, and a result on page two only counts if the user goes to page two.',
      'Links to your pages in AI Overviews and AI Mode count towards impressions in the web search type. Impressions are also affected by automated traffic: when Google stopped supporting the num=100 parameter in September 2025, many sites saw desktop impressions drop, which most analysts put down to fewer scrapers loading 100 results at a time.',
    ],
    why: [
      'Impressions measure visibility before anyone clicks. Rising impressions with flat [clicks](/glossary/clicks) usually mean you are ranking for more queries, but lower down or in places that do not earn clicks. Falling impressions across the board point to lost rankings, an indexing problem or a change in how searches are counted.',
      'Impressions are the denominator of [click-through rate](/glossary/click-through-rate), so they tell you how big an opportunity a query is. A query with thousands of impressions and a low CTR is worth a better title; one with a dozen impressions is not.',
    ],
    how: {
      heading: 'How to analyse impressions in Search Console',
      steps: [
        'Open the Performance report and turn on Impressions, Clicks and Average position together.',
        'Sort the Queries table by impressions to find where you are most visible.',
        'Look for queries with high impressions and an average position between 5 and 20: these are your [striking distance keywords](/glossary/striking-distance-keywords).',
        'Compare date ranges. A sudden step change on one date, especially on desktop, is more likely a counting change or an indexing problem than a slow ranking shift.',
        'Filter by page to see whether a drop is site-wide or limited to a section.',
      ],
    },
    openseo: {
      body: 'OpenSEO stores your Search Console impressions beyond the 16-month window and compares any two periods by query and page.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['clicks', 'click-through-rate', 'average-position', 'search-console-performance-report', 'google-search-console'],
    faqs: [
      {
        question: 'Does an impression mean someone saw my result?',
        answer: ['Not necessarily. For standard results, Search Console counts an impression when your link is on the page the user loaded, even if it was below where they scrolled.'],
      },
      {
        question: 'Why did my impressions drop in September 2025?',
        answer: ['Around 10 September 2025 Google stopped honouring the num=100 URL parameter that tools used to load 100 results at once. Many sites saw desktop impressions fall and average position improve at the same time. Google has not confirmed the cause, but the common explanation is that scrapers had been inflating impressions for deep rankings.'],
      },
    ],
  },
  {
    slug: 'clicks',
    term: 'Clicks',
    aka: ['organic clicks', 'search clicks'],
    category: 'analytics',
    short: 'Clicks count how many times someone clicked a search result that took them to your site. Search Console reports them by query, page, device and country.',
    definition: [
      'Clicks are the number of times a user clicked a search result that took them to your site. In Google Search Console, a click is counted when someone clicks a link that leads off Google Search to a page on your property. Clicks that run a new Google search, such as some links inside SERP features, are not counted.',
      'Clicks are the closest thing to organic traffic that Google reports. They are not the same as sessions in [GA4](/glossary/google-analytics-4): analytics only records a session if its tag loads and the user accepts tracking, and it uses its own time zone and session rules. Expect the two numbers to move together but not to match.',
    ],
    why: [
      'Clicks are the outcome that most SEO work is aimed at. [Impressions](/glossary/impressions) and rankings only matter if they turn into visits. Tracking clicks by query and [landing page](/glossary/landing-page) tells you which content actually brings people in.',
      'When clicks fall, compare them with impressions and position. Fewer impressions means lost visibility. Steady impressions with fewer clicks means your results are getting less attention, because of a weaker title, a new SERP feature such as an AI Overview, or competitors with richer snippets.',
    ],
    how: {
      heading: 'How to find why organic clicks dropped',
      steps: [
        'In the Search Console Performance report, compare the last 28 days with the previous period.',
        'Sort the Queries table by click difference to find the queries that lost most.',
        'For each, check whether impressions or average position also fell. If position fell, look at who now outranks you.',
        'If position held but clicks fell, search the query yourself to see what changed on the page: new ads, an AI Overview, a featured snippet or a video carousel.',
        'Switch to the Pages tab to see whether the loss is concentrated on a few URLs.',
      ],
    },
    openseo: {
      body: 'OpenSEO compares Search Console clicks between any two periods and highlights the queries and pages with the biggest changes.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['impressions', 'click-through-rate', 'organic-traffic', 'zero-click-searches', 'search-console-performance-report'],
    faqs: [
      {
        question: 'Why are Search Console clicks higher than GA4 organic sessions?',
        answer: ['Usually because some visitors block or decline analytics, leave before the tag fires, or arrive on pages without the tag. Time zone and attribution differences add to the gap.'],
      },
      {
        question: 'Do clicks affect rankings?',
        answer: ['Google says it uses interaction data in some systems, but clicks are noisy and easy to fake, so trying to inflate them is spam. See [CTR manipulation](/glossary/ctr-manipulation).'],
      },
    ],
  },
  {
    slug: 'click-through-rate',
    term: 'Click-through rate (CTR)',
    aka: ['CTR', 'organic CTR', 'search CTR'],
    category: 'analytics',
    short: 'Click-through rate (CTR) is the share of impressions that become clicks: clicks divided by impressions. It shows how often searchers choose your result.',
    definition: [
      'Click-through rate (CTR) is the percentage of people who clicked your result out of everyone who saw it. You calculate it as clicks divided by impressions, multiplied by 100. In SEO it usually means organic CTR from Google Search Console: how often your listing was chosen when it appeared in the results.',
      'A page with 2,000 impressions and 60 clicks has a CTR of 3%. Search Console shows CTR for the whole site, and for every query, page, country, device and search appearance, so you can see exactly where searchers pass you over.',
      'CTR depends on far more than your title. The biggest factor is position: higher results get a much larger share of clicks, and the drop from the first few results to the bottom of page one is steep (see [organic CTR by position](/glossary/organic-ctr-curve)). The second is the rest of the page. Ads, an [AI Overview](/glossary/ai-overviews), a [featured snippet](/glossary/featured-snippet), a local pack or a video carousel all push organic results down and take attention. Some searches need no click at all, because the answer is on the results page: these are [zero-click searches](/glossary/zero-click-searches).',
      'Then there is the query itself. Branded queries, where people search for you by name, have much higher CTR than generic ones, so a site-wide CTR mixes very different things. Navigational and transactional queries tend to earn more clicks than quick factual ones. Device matters too: mobile results show fewer listings above the fold. Finally, your snippet: the [title tag](/glossary/title-tag), the description Google shows (often your [meta description](/glossary/meta-description), not always), the URL and any [rich results](/glossary/rich-results) such as review stars or prices.',
      'That is why there is no single “good” CTR. A 2% CTR can be excellent for a position 8 result on a query topped by an AI Overview and four ads, and poor for a brand query at position 1. Judge CTR against pages and queries like it, not against an industry average.',
    ],
    why: [
      'CTR tells you how much traffic you get from the visibility you already have. Raising CTR on a page that already ranks is often the fastest SEO win there is: a better title can bring more visits next week, while climbing positions takes months.',
      'It is also a diagnostic. A sudden CTR drop with steady rankings means something changed on the results page, such as a new SERP feature, or your snippet changed, perhaps because Google rewrote your title. A low CTR on a high-impression query is a sign your result does not match what the searcher wanted, which is an [intent](/glossary/search-intent) problem as much as a copy problem.',
      'Google has said it uses some interaction data in ranking systems, but it does not treat CTR as a simple ranking factor, and attempts to fake clicks are spam (see [CTR manipulation](/glossary/ctr-manipulation)). Improve CTR to earn more traffic from your rankings, not to game them.',
    ],
    how: {
      heading: 'How to improve click-through rate',
      steps: [
        'Open the Search Console Performance report, turn on all four metrics and go to the Pages tab. Filter out branded queries (Search Console has a branded queries filter for eligible properties, or use a regex on your brand name).',
        'Look for pages with plenty of impressions, an average position on page one, and a CTR well below other pages at similar positions on your site. These are your candidates.',
        'Search the main query for each page yourself, on mobile and desktop. Note what sits above you and what the top results promise in their titles.',
        'Rewrite the title tag so the main keyword comes first and the benefit is clear: a number, a year for time-sensitive topics, a price, or the specific thing the searcher wants. Keep it to about 50 to 60 characters so it is not cut off.',
        'Write a meta description that answers the query and gives a reason to click. Google may rewrite it, but a good one is used more often.',
        'Add [structured data](/glossary/structured-data) for rich results you are eligible for, such as Product with ratings and price, or video markup.',
        'Make sure the result matches intent. If the top results are lists and yours is a product page, a better title will not fix it; the page needs to change.',
        'Wait two to four weeks, then compare CTR for the same queries and similar positions before and after. Change one thing at a time where you can.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A guide ranks at an average position of 4.2 for “how to descale a kettle”, with 12,400 impressions and 310 clicks in 28 days: a CTR of 2.5%. Other pages on the site at positions 3 to 5 average about 6%. The title was “Kettle Maintenance Guide | Brand”. Changing it to “How to Descale a Kettle (Vinegar, Lemon or Citric Acid)” brings the next 28 days to 690 clicks on 12,100 impressions at a similar position: 5.7%.',
    },
    openseo: {
      body: 'OpenSEO reads your Search Console data and scores each query and page by opportunity, so pages with high impressions and weak CTR for their position rise to the top.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['impressions', 'clicks', 'organic-ctr-curve', 'title-tag', 'meta-description', 'serp-features', 'zero-click-searches', 'search-console-performance-report'],
    faqs: [
      {
        question: 'What is a good CTR for SEO?',
        answer: ['There is no single benchmark. CTR depends on position, the query, branded versus non-branded searches and what else is on the results page. Compare each page with your own pages at similar positions rather than an industry average.'],
      },
      {
        question: 'How is CTR calculated?',
        answer: ['CTR = clicks ÷ impressions × 100. In Search Console, 50 clicks from 1,000 impressions is a 5% CTR.'],
      },
      {
        question: 'Is CTR a Google ranking factor?',
        answer: ['Not in a simple way. Google has said it uses interaction data in some systems, but it does not reward pages for CTR directly, and faking clicks breaks its spam policies.'],
      },
      {
        question: 'Why is my CTR dropping while rankings stay the same?',
        answer: ['Usually because the results page changed: new ads, an AI Overview, a featured snippet or other SERP features pushing organic results down. A rewritten title or snippet, or seasonal changes in who is searching, can also cause it.'],
      },
    ],
  },
  {
    slug: 'average-position',
    term: 'Average position',
    aka: ['avg position', 'average ranking'],
    category: 'analytics',
    short: 'Average position is the mean of your topmost ranking each time your site appeared in Google results, as reported in Search Console.',
    definition: [
      'Average position is the average ranking of your site in Google Search results, weighted by impressions. In Search Console, each time your site appears, Google takes the position of your topmost result on that results page, then averages those positions across all impressions. Position 1 is the top; lower numbers are better.',
      'Positions are counted from the top of the page and include some SERP features. A link inside a [featured snippet](/glossary/featured-snippet) or an AI Overview gets the position of that element. Elements such as a carousel share one position, so every item inside it has the same position number. Searches where your site does not appear at all are not counted, which is why average position can improve even as visibility falls.',
    ],
    why: [
      'Average position is a useful trend line, not a ranking. It blends every query, device and country together. If you start ranking at position 60 for hundreds of new long-tail queries, your average position gets worse even though your traffic grows. If you lose those rankings, it gets better.',
      'Read it per query and per page, and alongside [impressions](/glossary/impressions) and [clicks](/glossary/clicks). For a precise position on one query in one place, use [rank tracking](/glossary/rank-tracking), which checks the live results instead of averaging what users saw.',
    ],
    how: {
      heading: 'How to read average position',
      steps: [
        'Filter the Search Console Performance report to one query, or one page plus one query, before reading the number.',
        'Split by device and country. A position of 5 on mobile in the UK and 15 on desktop in the US averages to something meaningless.',
        'Check impressions at the same time. A better position with far fewer impressions usually means you stopped appearing for deep queries, not that you climbed.',
        'Use positions 5 to 20 with good impressions as a list of [striking distance keywords](/glossary/striking-distance-keywords).',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A page appears 3 times for one query: once at position 2, once at position 4 and once at position 9. Its average position is (2 + 4 + 9) ÷ 3 = 5. If the same site had two URLs on one of those pages, at positions 2 and 7, only position 2 counts for the site.',
    },
    openseo: {
      body: 'OpenSEO combines Search Console average position with live rank tracking, so you can see both what users saw and where you rank today in a given city.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['rank-tracking', 'keyword-ranking', 'impressions', 'search-console-performance-report', 'striking-distance-keywords'],
    faqs: [
      {
        question: 'Why did my average position improve but traffic drop?',
        answer: ['Most often because you lost impressions for queries where you ranked low. Fewer deep rankings pull the average up while total visibility shrinks. Many sites saw this in September 2025 when Google stopped honouring the num=100 parameter.'],
      },
      {
        question: 'Is average position the same as my ranking?',
        answer: ['No. It is an average across every time you appeared, for every user, location and device. Your ranking for one query in one place at one moment can be quite different.'],
      },
    ],
  },
  {
    slug: 'rank-tracking',
    term: 'Rank tracking',
    aka: ['rank tracker', 'SERP tracking', 'keyword tracking', 'position tracking'],
    category: 'analytics',
    short: 'Rank tracking is checking where your pages rank in search results for chosen keywords over time, by device and location, to measure SEO progress.',
    definition: [
      'Rank tracking is the regular monitoring of where a website ranks in search engine results for a chosen list of keywords. A rank tracker runs each search from a set location and device, records the position of your page and your competitors’ pages, and stores the results so you can see how rankings change over days, weeks and months.',
      'Rank tracking is different from the [average position](/glossary/average-position) in Search Console. Search Console averages what real users saw across every location and device, but only for queries where you already appeared. A rank tracker checks the live results for the exact keywords you choose, including ones you do not rank for yet, in the exact place you care about, and also shows who else ranks and which [SERP features](/glossary/serp-features) appear.',
      'Location matters more than most people expect. Results differ by country and, for anything with local intent, by city or even street. A plumber can rank first in one neighbourhood and not at all two miles away, which is why local businesses use [geo-grid](/glossary/geo-grid) tracking on Google Maps. Device matters too: mobile and desktop results often differ.',
      'Rank trackers record more than a number. A good one records the URL that ranks (so you notice when Google swaps one of your pages for another, a sign of [keyword cannibalization](/glossary/keyword-cannibalization)), the SERP features on the page and whether you own any of them, competitors’ positions, and a [visibility score](/glossary/seo-visibility) that rolls everything up.',
      'How deep a tracker looks has also changed. Until September 2025 many trackers loaded 100 results in one request using Google’s num=100 parameter. Google stopped honouring it, so getting the top 100 now takes around ten requests of ten results each. Some tools reduced depth or update frequency; others raised costs. For most decisions, the top 20 to 30 positions are what matter.',
    ],
    why: [
      'Rankings are the leading indicator in SEO. Traffic and sales lag; positions move first. Tracking them tells you whether new content is gaining ground, whether an update hit you, and whether a competitor is overtaking you on the terms that make you money.',
      'Rank tracking also lets you measure things Search Console cannot: keywords you do not rank for yet, specific cities, competitors’ positions and day-by-day movement during a [core update](/glossary/core-update). It makes [SERP volatility](/glossary/serp-volatility) visible, so you can tell an industry-wide shake-up from a problem on your own site.',
      'Keep it focused. Track the keywords that represent your business, grouped by topic, product or funnel stage, rather than thousands of variations. A tracked set of 100 to 500 well-chosen keywords tells most sites more than a vast list nobody reads.',
    ],
    how: {
      heading: 'How to set up rank tracking',
      steps: [
        'Choose keywords from three sources: terms your money pages should rank for, queries Search Console shows you already get impressions for, and gaps where competitors rank and you do not (see [keyword gap](/glossary/keyword-gap)).',
        'Tag them by topic, page or intent so you can read the data in groups rather than one by one.',
        'Pick the right location for each set: country for national sites, city or coordinates for local businesses. Track mobile and desktop separately if your audience uses both.',
        'Add three to five real search competitors: the sites that rank for your keywords, not just the businesses you think of as rivals.',
        'Choose a frequency. Daily suits competitive or volatile terms and the weeks around launches and updates; weekly or monthly is enough for most long-term tracking.',
        'Note the ranking URL for each keyword and set an alert for big drops or a change of ranking URL.',
        'Review trends monthly alongside Search Console clicks. Act on sustained moves, not single-day changes.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A bakery tracks “wedding cakes manchester” on mobile from the centre of Manchester, weekly. Week 1: position 14, ranking URL /cakes/. After publishing a dedicated /wedding-cakes/ page with photos and prices, week 6: position 6, ranking URL /wedding-cakes/. The change of ranking URL confirms the new page, not the old one, is now the one Google prefers.',
    },
    openseo: {
      body: 'OpenSEO tracks Google positions on desktop and mobile by country, city or coordinates, to the top 100, daily, weekly, monthly or on demand, with competitors and SERP features recorded for every check.',
      href: '/features/rank-tracking',
      label: 'See rank tracking',
    },
    related: ['keyword-ranking', 'average-position', 'seo-visibility', 'ranking-distribution', 'serp-features', 'serp-volatility', 'geo-grid', 'striking-distance-keywords'],
    faqs: [
      {
        question: 'Why does my rank tracker show a different position from what I see in Google?',
        answer: ['Your own search is affected by your exact location, device, language and past searches. Rank trackers search from a fixed location without personal history, which is closer to what a typical new searcher sees.'],
      },
      {
        question: 'How often should I check rankings?',
        answer: ['Weekly is enough for most sites. Use daily tracking for competitive keywords, new launches or during a Google update, and avoid reacting to single-day changes.'],
      },
      {
        question: 'Is Search Console enough for rank tracking?',
        answer: ['It is a good start, but it only shows averaged positions for queries where you already appear. You need a rank tracker to monitor specific keywords, locations and competitors.'],
      },
      {
        question: 'What happened to rank tracking after num=100 was removed?',
        answer: ['From September 2025 Google stopped returning 100 results per request through the num=100 parameter, so trackers need about ten requests to see the top 100. Many tools changed how deep or how often they check, or what it costs.'],
      },
    ],
  },
  {
    slug: 'keyword-ranking',
    term: 'Keyword ranking',
    aka: ['search ranking', 'keyword position', 'SERP position'],
    category: 'analytics',
    short: 'A keyword ranking is the position a page holds in search results for a given query, in a given place and on a given device.',
    definition: [
      'A keyword ranking is the position at which a web page appears in search results for a specific query. Position 1 is the first organic result. A ranking always belongs to a keyword, a location, a device and a moment, because results differ between cities, between mobile and desktop, and from day to day.',
      'Tools count positions in different ways. Some count only classic organic links; others count every result block, including a [featured snippet](/glossary/featured-snippet), [People Also Ask](/glossary/people-also-ask) or a [local pack](/glossary/local-pack), so the same listing can be “position 3” in one tool and “position 6” in another. With continuous scrolling, “page one” also means less than it did; positions 1 to 10 is the usual stand-in.',
    ],
    why: [
      'Rankings drive clicks. Results near the top earn far more traffic than results further down, so moving from position 9 to position 3 on a valuable query can multiply its visits. Tracking rankings per keyword tells you which pages are gaining or losing ground before traffic catches up.',
      'Rankings also show which page Google considers the best match for a query. If the URL changes, or two of your pages alternate, you may have [keyword cannibalization](/glossary/keyword-cannibalization).',
    ],
    how: {
      heading: 'How to check keyword rankings',
      steps: [
        'For a quick live check, use a SERP checker set to the country or city you care about, rather than searching in your own browser.',
        'For trends, add the keyword to a [rank tracker](/glossary/rank-tracking) with a fixed location and device.',
        'In Search Console, filter the Performance report by the query to see your average position over time across all users.',
        'Note the ranking URL as well as the number.',
      ],
    },
    openseo: {
      body: 'The OpenSEO SERP checker shows the live top 10 for any keyword on desktop or mobile, in any country, state or city, with each result’s authority, links and traffic.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['rank-tracking', 'average-position', 'serp', 'ranking-factors', 'ranking-distribution', 'organic-ctr-curve'],
    faqs: [
      {
        question: 'How do I check my Google ranking for a keyword?',
        answer: ['Use a SERP checker or rank tracker set to your target location, or search in a private window. Personal history and location change what you see, so a tool with a fixed location is more reliable.'],
      },
      {
        question: 'How long does it take to rank for a keyword?',
        answer: ['It varies widely with competition, your site’s authority and the content. Low-competition terms can rank within weeks; competitive ones often take many months.'],
      },
    ],
  },
  {
    slug: 'ranking-distribution',
    term: 'Ranking distribution',
    aka: ['position distribution', 'keyword position distribution'],
    category: 'analytics',
    short: 'Ranking distribution shows how many of a site’s keywords sit in each position band, such as 1–3, 4–10, 11–20 and 21–100.',
    definition: [
      'Ranking distribution is a breakdown of how many keywords a site or page ranks for in each band of positions, typically 1–3, 4–10, 11–20, 21–50 and 51–100. Instead of an average, it shows the shape of your visibility: how much sits at the top, how much on page one and how much is waiting just below it.',
      'It is usually shown as a stacked bar or area chart over time. Watching the bands move tells you whether keywords are climbing from the back of the results towards the front, or slipping the other way.',
    ],
    why: [
      'Averages hide progress. When a site starts ranking for hundreds of new keywords at positions 40 to 90, its [average position](/glossary/average-position) gets worse, even though that is often the first sign that new content is being picked up. The distribution shows it plainly: the 51–100 band grows, and, months later, keywords move into 11–20 and 4–10.',
      'The 4–20 bands are the most actionable. Keywords there are close enough to the top that better content, [internal links](/glossary/internal-links) or a stronger title can push them into the positions that earn most clicks. They are your [striking distance keywords](/glossary/striking-distance-keywords).',
    ],
    how: {
      heading: 'How to use a ranking distribution',
      steps: [
        'Compare this month’s distribution with three and six months ago to see which way keywords are moving.',
        'Export the keywords in the 4–10 and 11–20 bands and sort by search volume to find the biggest opportunities.',
        'Compare your distribution with a competitor’s. A competitor with far more keywords in 1–3 for the same topics has something worth studying.',
      ],
    },
    openseo: {
      body: 'The OpenSEO domain overview shows any domain’s ranking distribution along with its traffic, top keywords, top pages and competitors.',
      href: '/tools/domain-overview',
      label: 'Open the domain overview',
    },
    related: ['keyword-ranking', 'rank-tracking', 'seo-visibility', 'striking-distance-keywords', 'average-position'],
    faqs: [
      {
        question: 'What is a healthy ranking distribution?',
        answer: ['There is no fixed shape, but a growing site usually shows keywords moving from the lower bands into 4–10 and 1–3 over time. Most sites have far more keywords ranking low than high.'],
      },
      {
        question: 'Why do so many of my keywords rank below position 50?',
        answer: ['Pages rank loosely for many related and long-tail queries. Those low rankings bring little traffic, but they show where Google sees you as relevant and where better content could help.'],
      },
    ],
  },
  {
    slug: 'organic-ctr-curve',
    term: 'Organic CTR by position',
    aka: ['CTR curve', 'click curve', 'CTR by ranking position'],
    category: 'analytics',
    short: 'Organic CTR by position is the pattern of how click-through rate falls as a result moves down the page: top results get most clicks.',
    definition: [
      'Organic CTR by position, or the CTR curve, describes how the share of searchers who click a result changes with its ranking. The first organic result gets the most clicks, the next few get noticeably fewer, and click-through rate keeps falling down the page, with results on page two getting very few clicks.',
      'The exact numbers vary so much that any single table is misleading. Third-party studies measure different sets of queries and get different figures, and they date quickly as Google adds new features. What stays consistent is the shape: steep at the top, flattening further down. The curve is flatter, and lower, when ads, an [AI Overview](/glossary/ai-overviews), a [featured snippet](/glossary/featured-snippet) or a local pack sit above the organic results, and steeper for branded and navigational searches where people know exactly which result they want.',
    ],
    why: [
      'The curve explains why small ranking gains near the top matter far more than gains lower down. Moving from 12 to 9 might add a few clicks; moving from 4 to 1 can multiply them. It is how tools estimate traffic from rankings and [traffic potential](/glossary/traffic-potential).',
      'Your own curve is more useful than a published one. Plot CTR against average position for your non-branded queries in Search Console, and you have a benchmark for your site. Pages well below your curve at their position are good candidates for a better title and description.',
    ],
    how: {
      heading: 'How to build your own CTR curve',
      steps: [
        'Export queries from the Search Console Performance report for the last three months, with clicks, impressions, CTR and position.',
        'Remove branded queries, and queries with very few impressions.',
        'Round positions to whole numbers and, for each position from 1 to 20, total the clicks and impressions, then divide to get CTR.',
        'Chart CTR against position. Do mobile and desktop separately if you have enough data.',
        'Flag pages whose CTR is well below the curve for their position and review their titles and snippets.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s search performance view scores Search Console queries by opportunity, taking into account impressions, position and CTR.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['click-through-rate', 'keyword-ranking', 'traffic-potential', 'zero-click-searches', 'serp-features'],
    faqs: [
      {
        question: 'What is the CTR of position 1 on Google?',
        answer: ['It varies widely by query, device and what else appears above the organic results, and published studies disagree. Use your own Search Console data for non-branded queries as your benchmark.'],
      },
      {
        question: 'Do AI Overviews change the CTR curve?',
        answer: ['They push organic results further down and can answer the query outright, so CTR for results below them tends to be lower. The size of the effect varies by query.'],
      },
    ],
  },
  {
    slug: 'traffic-value',
    term: 'Traffic value',
    aka: ['organic traffic value', 'traffic cost'],
    category: 'analytics',
    short: 'Traffic value estimates what a site’s organic traffic would cost if you bought the same clicks with search ads, using each keyword’s CPC.',
    definition: [
      'Traffic value is an estimate of what a website’s organic search traffic would cost if the same clicks were bought through paid search ads. For each keyword a site ranks for, a tool multiplies the estimated monthly organic clicks by that keyword’s [cost per click](/glossary/cost-per-click), then adds up the results across all keywords.',
      'It is a model, built on two estimates: traffic (from search volume, position and a CTR curve) and CPC (from advertisers’ bids). Treat it as a way to compare sites, pages and periods, not as revenue. Keywords with no ad competition contribute nothing, however much traffic they bring, so informational sites can look less valuable than they are.',
    ],
    why: [
      'Traffic value weights traffic by commercial intent. A thousand visits from “best accounting software” are worth more to a business than a thousand from “what is double-entry bookkeeping”, and CPC reflects that. It gives a better sense of which pages matter than raw visits do.',
      'It is also a simple way to put SEO in money terms for people who know paid search, and a starting point for an [SEO ROI](/glossary/seo-roi) case. Use your own conversion data for the real figure.',
    ],
    example: {
      label: 'Worked example',
      body: 'A page gets an estimated 800 visits a month from “project management software” (CPC $18) and 1,500 visits from long-tail informational terms with an average CPC of $0.40. Its traffic value is (800 × $18) + (1,500 × $0.40) = $14,400 + $600 = $15,000 a month.',
    },
    openseo: {
      body: 'The OpenSEO domain overview shows estimated traffic and traffic value for any domain, along with its top keywords and pages.',
      href: '/tools/domain-overview',
      label: 'Open the domain overview',
    },
    related: ['cost-per-click', 'organic-traffic', 'seo-roi', 'traffic-potential', 'commercial-intent'],
    faqs: [
      {
        question: 'Is traffic value the same as revenue from SEO?',
        answer: ['No. It is what the clicks would cost as ads, not what they earn. Real value depends on your conversion rate and order values.'],
      },
      {
        question: 'Why is traffic value low for a site with lots of traffic?',
        answer: ['If most of its keywords are informational with little advertiser competition, their CPCs are low or zero, so the traffic counts for little in this model.'],
      },
    ],
  },
  {
    slug: 'seo-visibility',
    term: 'SEO visibility score',
    aka: ['visibility score', 'search visibility', 'visibility index'],
    category: 'analytics',
    short: 'An SEO visibility score is a single number showing how visible a site is in search for a set of keywords, weighting rankings by expected clicks.',
    definition: [
      'An SEO visibility score is a single metric that summarises how visible a website is in search results for a set of keywords. Tools weight each ranking by the share of clicks that position typically earns, often also by search volume, and combine them into a percentage or index. Ranking first for every tracked keyword would give the maximum score.',
      'There is no standard formula. Each tool builds its score from its own CTR curve, keyword set and weighting, so scores are only comparable within the same tool and the same keyword set. In a [rank tracker](/glossary/rank-tracking), visibility is calculated over your tracked keywords; in a domain tool, over the tool’s whole keyword database.',
    ],
    why: [
      'Visibility turns hundreds of keyword positions into one trend line. That makes it easy to see the effect of a [core update](/glossary/core-update), a site migration or a content push, and to compare yourself with competitors over the same keywords. It is closely related to [share of voice](/glossary/share-of-voice).',
      'Because it weights by expected clicks, it rewards moves near the top and mostly ignores moves on page five, which is how traffic behaves too.',
    ],
    how: {
      heading: 'How to track SEO visibility',
      steps: [
        'Build a stable keyword set that represents your market, and leave it mostly unchanged so the score stays comparable over time.',
        'Add competitors to the same set so you can compare scores directly.',
        'Check the trend weekly and look into sharp moves: which keywords changed, and which pages.',
      ],
    },
    openseo: {
      body: 'OpenSEO rank tracking records your positions and competitors’ for every tracked keyword, so you can see visibility change over time.',
      href: '/features/rank-tracking',
      label: 'See rank tracking',
    },
    related: ['rank-tracking', 'share-of-voice', 'ranking-distribution', 'organic-ctr-curve', 'seo-kpis'],
    faqs: [
      {
        question: 'What is a good visibility score?',
        answer: ['It depends on the tool and the keyword set. Compare your score with competitors on the same keywords, and with your own past scores, rather than with a fixed number.'],
      },
      {
        question: 'Why did my visibility drop but traffic didn’t?',
        answer: ['Visibility only covers the keywords being measured. If you lost positions on tracked terms but gained on others, or the lost keywords brought little traffic, the two can diverge.'],
      },
    ],
  },
  {
    slug: 'engagement-rate',
    term: 'Engagement rate',
    aka: ['GA4 engagement rate', 'engaged sessions rate'],
    category: 'analytics',
    short: 'Engagement rate in GA4 is the share of sessions that were engaged: lasted 10+ seconds, had a key event, or had 2+ page or screen views.',
    definition: [
      'Engagement rate is a [Google Analytics 4](/glossary/google-analytics-4) metric showing the percentage of sessions that were engaged sessions. GA4 counts a session as engaged if it lasted longer than 10 seconds, included at least one [key event](/glossary/key-events), or included at least two page or screen views. Engagement rate is engaged sessions divided by all sessions.',
      'The 10-second threshold is the default; you can raise it up to 60 seconds in the data stream’s tag settings. Engagement rate is the opposite of [bounce rate](/glossary/bounce-rate) in GA4: the two always add up to 100%.',
    ],
    why: [
      'Engagement rate is a quick check on whether organic visitors found what they came for. A landing page that ranks well but has a much lower engagement rate than similar pages may be mismatched to [search intent](/glossary/search-intent), slow, or buried under pop-ups.',
      'It is better than the old Universal Analytics bounce rate for content pages, because a reader who spends three minutes on one article and leaves now counts as engaged rather than as a bounce.',
    ],
    how: {
      heading: 'How to find engagement rate in GA4',
      steps: [
        'Open Reports > Engagement > Landing page (or Pages and screens).',
        'If engagement rate is not shown, choose Customise report and add the Engagement rate metric.',
        'Add a comparison for Session default channel group = Organic Search to see organic visitors only.',
        'Compare pages of the same type, such as blog posts with blog posts, rather than across the whole site.',
      ],
    },
    related: ['bounce-rate', 'google-analytics-4', 'key-events', 'landing-page', 'seo-kpis'],
    faqs: [
      {
        question: 'What is a good engagement rate in GA4?',
        answer: ['It varies by site and page type. Compare pages with similar purposes and track your own trend rather than chasing a universal benchmark.'],
      },
      {
        question: 'How do I change the engaged session time in GA4?',
        answer: ['In Admin > Data streams, choose your web stream, open Configure tag settings > Show more > Adjust session timeout, and change the timer for engaged sessions, up to 60 seconds.'],
      },
    ],
  },
  {
    slug: 'bounce-rate',
    term: 'Bounce rate',
    aka: ['GA4 bounce rate'],
    category: 'analytics',
    short: 'Bounce rate in GA4 is the share of sessions that were not engaged. It equals 100% minus engagement rate.',
    definition: [
      'Bounce rate is the percentage of sessions that were not engaged. In [Google Analytics 4](/glossary/google-analytics-4), it is simply 100% minus [engagement rate](/glossary/engagement-rate): a bounce is a session that lasted 10 seconds or less (by default), had no key event and had only one page or screen view.',
      'This is a different definition from Universal Analytics, where a bounce was any single-page session with no further interaction, however long the visitor stayed. Bounce rates in GA4 are therefore usually lower than old Universal Analytics figures for the same site, and you should not compare the two directly.',
    ],
    why: [
      'A high bounce rate on an organic [landing page](/glossary/landing-page) can point to a mismatch between what the searcher wanted and what the page offers, a slow page, or an intrusive interstitial. It is a clue, not a verdict: someone who found a phone number in five seconds and called may count as a bounce.',
      'Google has said it does not use Google Analytics data such as bounce rate in ranking. Use it to improve pages for visitors, not as a ranking metric.',
    ],
    how: {
      heading: 'How to reduce bounce rate',
      steps: [
        'Check the query behind the page in Search Console and make sure the first screen answers it.',
        'Speed up the page, especially on mobile: look at [Core Web Vitals](/glossary/core-web-vitals).',
        'Remove or delay pop-ups that cover the content on arrival.',
        'Add clear next steps: related articles, internal links, or a simple call to action.',
        'If quick answers are the point of the page, track a key event such as a phone click instead of judging it by bounce rate.',
      ],
    },
    related: ['engagement-rate', 'google-analytics-4', 'landing-page', 'search-intent', 'key-events'],
    faqs: [
      {
        question: 'Is bounce rate a Google ranking factor?',
        answer: ['No. Google has said it does not use Google Analytics data in ranking. A high bounce rate can be a symptom of a page that does not satisfy searchers, though.'],
      },
      {
        question: 'Where is bounce rate in GA4?',
        answer: ['It is not in most standard reports by default. Use Customise report to add the Bounce rate metric, or build it into an exploration.'],
      },
    ],
  },
  {
    slug: 'key-events',
    term: 'Key events (conversions)',
    aka: ['GA4 key events', 'conversions', 'goals'],
    category: 'analytics',
    short: 'Key events are the GA4 events you mark as important to your business, such as a purchase or sign-up. Google renamed conversions to key events in 2024.',
    definition: [
      'Key events are the actions in [Google Analytics 4](/glossary/google-analytics-4) that you mark as important to your business, such as a purchase, a sign-up, a demo request or a phone click. Any GA4 event can be marked as a key event. In 2024 Google renamed GA4 “conversions” to “key events”; “conversions” now refers to key events used in Google Ads.',
      'The rename separated two ideas. A key event measures something that matters on your site in GA4. A conversion is a key event that has been imported into Google Ads for bidding and reporting, where it follows Google Ads attribution and counting rules. Universal Analytics called the equivalent “goals”.',
    ],
    why: [
      'Key events are how you connect SEO to results. Traffic and rankings are means to an end; key events from organic search show which [landing pages](/glossary/landing-page) and topics actually produce leads or sales. They are the basis for [SEO ROI](/glossary/seo-roi) and for the most meaningful [SEO KPIs](/glossary/seo-kpis).',
      'They also change how GA4 counts engagement: a session with a key event is always an engaged session.',
    ],
    how: {
      heading: 'How to set up key events in GA4',
      steps: [
        'Decide which actions matter: a completed purchase, a form submission, a sign-up, a booking, a click to call.',
        'Make sure each is tracked as an event. Many are collected automatically or through enhanced measurement; others need Google Tag Manager or a code change.',
        'In Admin > Data display > Events, find the event and mark it as a key event (or create the key event under Key events if the event has not fired yet).',
        'Optionally give it a value, so you can report key event value by channel.',
        'Check Reports > Acquisition > Traffic acquisition and filter to Organic Search to see key events from SEO.',
      ],
    },
    example: {
      label: 'Sending a sign-up event with gtag.js',
      code: 'gtag("event", "sign_up", {\n  method: "email"\n});',
    },
    related: ['google-analytics-4', 'engagement-rate', 'seo-roi', 'seo-kpis', 'landing-page', 'utm-parameters'],
    faqs: [
      {
        question: 'What is the difference between a key event and a conversion in GA4?',
        answer: ['A key event is an event you mark as important in GA4. A conversion is a key event that is also used in Google Ads. Since 2024 GA4 uses “key events” for its own reporting.'],
      },
      {
        question: 'How many key events can I have in GA4?',
        answer: ['Standard GA4 properties allow up to 30 key events, and Analytics 360 allows more. Keep the list to the actions that really matter.'],
      },
    ],
  },
  {
    slug: 'landing-page',
    term: 'Landing page',
    aka: ['entry page', 'organic landing page'],
    category: 'analytics',
    short: 'A landing page is the first page a visitor arrives on. In SEO it is the page that ranks and receives the click from search results.',
    definition: [
      'A landing page is the first page a visitor sees when they arrive on a website, whether from search, an ad, an email or a link. In SEO, an organic landing page is the page that ranks in search results and receives the click. In marketing, “landing page” also means a standalone page built for one campaign.',
      'Analytics tools report landing pages so you can see where sessions start. In [GA4](/glossary/google-analytics-4), the Landing page report groups sessions by the first page viewed; in Search Console, the Pages tab of the Performance report shows which URLs earned clicks from Google Search.',
    ],
    why: [
      'Most SEO decisions happen page by page. Knowing which landing pages bring organic visits, which engage and which produce [key events](/glossary/key-events) tells you where to invest: improve the pages that already attract traffic but convert poorly, and build more like the ones that do both.',
      'Landing page data also reveals problems. A page that suddenly loses organic sessions may have lost rankings, been de-indexed, or been replaced by another of your pages for the same query.',
    ],
    how: {
      heading: 'How to find your top organic landing pages',
      steps: [
        'In GA4, open Reports > Engagement > Landing page, and compare with Session default channel group = Organic Search.',
        'Sort by sessions, then look at engagement rate and key events for each.',
        'In Search Console, open the Pages tab in the Performance report to see clicks and impressions per URL, and click a page to see the queries it ranks for.',
        'For pages with many visits but few key events, review whether the page matches the intent of its top queries and has a clear next step.',
      ],
    },
    openseo: {
      body: 'OpenSEO brings together Search Console and GA4 data for each page, so you can see a landing page’s queries, rankings and on-site results together.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['google-analytics-4', 'key-events', 'engagement-rate', 'search-intent', 'organic-traffic', 'local-landing-pages'],
    faqs: [
      {
        question: 'Is a landing page the same as a homepage?',
        answer: ['Only when people arrive on the homepage. Any page can be a landing page; for most sites, most organic visits land on inner pages.'],
      },
      {
        question: 'Should campaign landing pages be indexed?',
        answer: ['Pages built only for ads or email, often with near-duplicate content, are usually better kept out of the index with noindex. Pages meant to rank should be indexable and written for search intent.'],
      },
    ],
  },
  {
    slug: 'utm-parameters',
    term: 'UTM parameters',
    aka: ['UTM tags', 'UTM codes', 'campaign parameters'],
    category: 'analytics',
    short: 'UTM parameters are tags added to a URL, such as utm_source and utm_medium, that tell analytics tools where a visit came from.',
    definition: [
      'UTM parameters are query string tags added to the end of a URL that tell analytics tools where a visit came from. The three most used are utm_source (the site or sender, such as newsletter), utm_medium (the channel, such as email) and utm_campaign (the campaign name). utm_term and utm_content are optional, and GA4 also reads utm_id and a few others.',
      'When someone clicks a tagged link, [GA4](/glossary/google-analytics-4) reads the parameters and attributes the session to that source, medium and campaign, instead of guessing from the referrer. UTM stands for Urchin Tracking Module, after the company Google bought to build Google Analytics.',
    ],
    why: [
      'You do not need UTMs for organic search: Google traffic is identified automatically. You do need them on links you control elsewhere, such as emails, social posts and partner placements, so that traffic is not lumped into Direct or Referral and organic numbers stay clean.',
      'Never add UTMs to [internal links](/glossary/internal-links). Clicking one starts a new attribution in GA4 and overwrites the real source, so organic visits get credited to your own campaign. Tagged URLs can also create duplicate URLs for crawlers; a [canonical tag](/glossary/canonical-tag) pointing at the clean URL handles that.',
    ],
    how: {
      heading: 'How to use UTM parameters',
      steps: [
        'Agree on a naming convention and stick to it: lowercase, with hyphens, and a fixed list of mediums (email, social, cpc, referral).',
        'Add utm_source, utm_medium and utm_campaign to every external link you place in emails, social posts, ads and partner content.',
        'Keep UTM-tagged URLs out of your sitemap and internal navigation.',
        'Make sure tagged pages carry a canonical tag to the clean URL.',
        'Check GA4 Traffic acquisition with Session source / medium and Session campaign to confirm the tags are recorded.',
      ],
    },
    example: {
      label: 'A tagged link',
      code: 'https://www.example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=october-launch',
    },
    related: ['google-analytics-4', 'url-parameters', 'canonical-tag', 'internal-links', 'seo-reporting'],
    faqs: [
      {
        question: 'Do UTM parameters affect SEO?',
        answer: ['Not directly, but they can create duplicate URLs if crawled. Use a canonical tag to the clean URL and never use UTMs on internal links.'],
      },
      {
        question: 'Are UTM parameters case sensitive?',
        answer: ['Yes. GA4 treats “Email” and “email” as different values, which is why a lowercase naming convention matters.'],
      },
    ],
  },
  {
    slug: 'seo-kpis',
    term: 'SEO KPIs',
    aka: ['SEO metrics', 'SEO key performance indicators'],
    category: 'analytics',
    short: 'SEO KPIs are the metrics you choose to judge whether SEO is working, such as organic clicks, rankings, visibility and key events from organic search.',
    definition: [
      'SEO KPIs (key performance indicators) are the handful of metrics a team chooses to measure whether its SEO is meeting its goals. Common ones are organic clicks or sessions, non-branded [impressions](/glossary/impressions), [keyword rankings](/glossary/keyword-ranking) for priority terms, visibility, [key events](/glossary/key-events) and revenue from organic search, and indexing health.',
      'Good KPIs fall into three layers. Outcome KPIs measure business results: leads, sales, revenue from organic. Performance KPIs measure search results: clicks, CTR, rankings, visibility. Health KPIs measure the site itself: indexed pages, crawl errors, [Core Web Vitals](/glossary/core-web-vitals). Outcomes matter most; the other two explain why they move.',
    ],
    why: [
      'SEO is slow and noisy. Without agreed KPIs, every ranking wobble becomes a debate and every report a list of numbers. A few clear KPIs, tied to business goals, tell everyone what success looks like and when to change course.',
      'Separate branded from non-branded search. Branded traffic follows brand awareness, advertising and PR; non-branded traffic is where SEO work shows most clearly.',
    ],
    how: {
      heading: 'How to choose SEO KPIs',
      steps: [
        'Start from the business goal: more leads, more sales, more sign-ups, lower acquisition cost.',
        'Pick one or two outcome KPIs, such as key events or revenue from organic search.',
        'Add three or four performance KPIs that lead to them: non-branded clicks, rankings or visibility for priority keywords, CTR on key pages.',
        'Add one or two health KPIs from Search Console and your site audit.',
        'Set a baseline from the last 12 months and a realistic target, allowing for seasonality.',
        'Report them on a fixed schedule, monthly for most teams.',
      ],
    },
    openseo: {
      body: 'OpenSEO puts Search Console and GA4 data, rank tracking and site audit health scores in one place, covering the outcome, performance and health layers.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['seo-reporting', 'seo-roi', 'seo-visibility', 'key-events', 'organic-traffic', 'site-health-score'],
    faqs: [
      {
        question: 'What are the most important SEO KPIs?',
        answer: ['Organic key events or revenue, non-branded organic clicks, and rankings or visibility for the keywords that matter to your business. The right set depends on your goals.'],
      },
      {
        question: 'Is keyword ranking a good KPI?',
        answer: ['As a leading indicator, yes, for a focused set of priority keywords. On its own it is not enough: rankings matter only if they bring clicks and results.'],
      },
    ],
  },
  {
    slug: 'seo-reporting',
    term: 'SEO reporting',
    aka: ['SEO report', 'SEO dashboard'],
    category: 'analytics',
    short: 'SEO reporting is the regular summary of search performance, explaining what changed, why, and what to do next, for a team or client.',
    definition: [
      'SEO reporting is the regular process of collecting search performance data, explaining what changed and why, and recommending what to do next. A typical SEO report covers organic traffic and [key events](/glossary/key-events), Search Console clicks and impressions, rankings for priority keywords, technical health, links gained and lost, and the work done in the period.',
      'Data comes from [Google Search Console](/glossary/google-search-console), [GA4](/glossary/google-analytics-4), a rank tracker, a backlink tool and a site crawler. Dashboards in [Looker Studio](/glossary/looker-studio) or another tool keep numbers up to date; the written part, what happened and what you will do about it, is what makes it a report.',
    ],
    why: [
      'Reporting is how SEO earns trust and budget. Because results take months, stakeholders need to see leading indicators moving and understand what is being done. A report that explains a drop before anyone asks is worth more than a page of charts.',
      'It also keeps the team honest. Comparing results against [SEO KPIs](/glossary/seo-kpis) every month shows which work pays off and which does not.',
    ],
    how: {
      heading: 'How to write an SEO report',
      steps: [
        'Open with a three-line summary: the headline result, the main reason, and the next action.',
        'Show your KPIs against the previous period and the same period last year, to account for seasonality.',
        'Explain the biggest movements: which pages, queries or keywords drove them, and any outside cause such as a Google update.',
        'List the work completed and what it has done so far.',
        'End with the plan for the next period and any decisions you need from the reader.',
        'Keep the same structure every time so changes are easy to spot.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s MCP server and REST API let an AI agent or script pull rankings, Search Console data and audits for automated reports.',
      href: '/features/mcp-and-api',
      label: 'See the MCP server and API',
    },
    related: ['seo-kpis', 'looker-studio', 'seo-roi', 'google-search-console', 'google-analytics-4', 'rank-tracking'],
    faqs: [
      {
        question: 'How often should you send SEO reports?',
        answer: ['Monthly suits most teams and clients. Weekly updates make sense during migrations, launches or Google updates; quarterly reviews are good for strategy.'],
      },
      {
        question: 'What should an SEO report include?',
        answer: ['A short summary, KPIs against previous periods, the reasons for major changes, the work done, and the plan for next period.'],
      },
    ],
  },
  {
    slug: 'seo-roi',
    term: 'SEO ROI',
    aka: ['return on investment from SEO', 'SEO return on investment'],
    category: 'analytics',
    short: 'SEO ROI is the return from organic search compared with what you spent on it: (value from SEO − cost of SEO) ÷ cost of SEO.',
    definition: [
      'SEO ROI (return on investment) measures how much value organic search brings in compared with what was spent to get it. The usual formula is (value from organic search − cost of SEO) ÷ cost of SEO × 100. Value is revenue or the estimated value of leads from [organic traffic](/glossary/organic-traffic); cost includes staff time, agencies, tools, content and links.',
      'The hard part is the value side. Ecommerce sites can read organic revenue from analytics. Lead-generation sites need a value per lead: the share of leads that become customers multiplied by the average customer value. Attribution matters as well, because many customers find you through search, leave, and come back through another channel.',
    ],
    why: [
      'ROI is how SEO competes with other channels for budget. Paid search stops the day you stop paying; SEO work keeps paying back as long as the pages keep ranking, so ROI tends to grow over time while costs stay flat.',
      'Calculating it also shows where SEO pays most. Comparing ROI for different sections or content types tells you which work to do more of.',
    ],
    how: {
      heading: 'How to calculate SEO ROI',
      steps: [
        'Total the cost of SEO for the period: salaries or time spent, agency fees, tools, content, [link building](/glossary/link-building) and any other spend.',
        'Measure organic results: revenue from Organic Search in GA4, or the number of organic [key events](/glossary/key-events) such as leads.',
        'For leads, multiply by your lead-to-customer rate and average customer value.',
        'If you want only the effect of your work, subtract the baseline organic value you had before.',
        'Apply the formula and look at it over at least 12 months, since SEO returns build slowly.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A firm spends $60,000 a year on SEO. Organic search brings 400 leads; 10% become customers worth $3,000 each, so organic value is 400 × 0.10 × $3,000 = $120,000. SEO ROI = ($120,000 − $60,000) ÷ $60,000 × 100 = 100%.',
    },
    related: ['seo-kpis', 'traffic-value', 'key-events', 'seo-reporting', 'organic-traffic'],
    faqs: [
      {
        question: 'How long does SEO take to show ROI?',
        answer: ['Often six to twelve months or more, depending on competition and starting point. Returns tend to grow after that, because rankings keep bringing traffic without paying per click.'],
      },
      {
        question: 'Can I use traffic value to measure SEO ROI?',
        answer: ['As a rough proxy. Traffic value estimates what the clicks would cost as ads; your own revenue and lead data give a truer figure.'],
      },
    ],
  },
  {
    slug: 'looker-studio',
    term: 'Looker Studio',
    aka: ['Data Studio', 'Google Data Studio'],
    category: 'analytics',
    short: 'Looker Studio, renamed Data Studio in 2026, is Google’s free dashboard tool, often used to build SEO reports from Search Console and GA4.',
    definition: [
      'Looker Studio is Google’s free tool for building dashboards and reports from data sources such as Google Search Console, Google Analytics 4, Google Sheets and BigQuery. It began as Google Data Studio, was renamed Looker Studio in October 2022, and in April 2026 Google renamed it Data Studio again. Existing reports and connectors carried over unchanged.',
      'Reports are built from connectors. The Search Console connector offers two tables: Site Impression (aggregated by property, as in the main Performance report) and URL Impression (aggregated by page). Mixing them gives figures that do not match, a common source of confusion.',
    ],
    why: [
      'It turns [SEO reporting](/glossary/seo-reporting) from a monthly copy-and-paste into a live dashboard that anyone with access can open. You can combine Search Console queries, GA4 [key events](/glossary/key-events) and spreadsheet data in one view, share it with clients and filter it by page, country or device.',
      'Dashboards only show what the connectors provide, though: the same Search Console limits apply, such as anonymised queries and the 16-month history.',
    ],
    how: {
      heading: 'How to build an SEO dashboard in Looker Studio',
      steps: [
        'Open the tool (datastudio.google.com or lookerstudio.google.com) and create a blank report.',
        'Add the Search Console connector, choose your property, then pick Site Impression or URL Impression and Web as the search type.',
        'Add the GA4 connector for the same site.',
        'Add a time series of clicks and impressions, a table of top queries, and a table of landing pages with sessions and key events from GA4.',
        'Add a date range control and filters for device and country, then share the report with view access.',
      ],
    },
    related: ['seo-reporting', 'google-search-console', 'google-analytics-4', 'seo-kpis'],
    faqs: [
      {
        question: 'Is Looker Studio the same as Looker?',
        answer: ['No. Looker is Google Cloud’s paid business intelligence platform. Looker Studio, now called Data Studio again, is the free dashboard tool.'],
      },
      {
        question: 'Is Looker Studio free?',
        answer: ['Yes, the standard version is free. A paid Pro version adds team management and support.'],
      },
    ],
  },
  {
    slug: 'search-console-performance-report',
    term: 'Search Console Performance report',
    aka: ['GSC performance report', 'Search results report'],
    category: 'analytics',
    short: 'The Search Console Performance report shows clicks, impressions, CTR and average position for your site in Google Search, by query, page and more.',
    definition: [
      'The Search Console Performance report is the part of [Google Search Console](/glossary/google-search-console) that shows how your site performs in Google Search. It reports four metrics, [clicks](/glossary/clicks), [impressions](/glossary/impressions), CTR and average position, and lets you break them down by query, page, country, device, search appearance and date, for up to 16 months.',
      'There are separate Performance reports for Search results, Discover and Google News, where the site is eligible. In the Search results report you can pick a search type (web, image, video or news), filter with exact text or regular expressions, compare two date ranges, and add annotations to the chart. Query groups and a branded queries filter were added in late 2025 for eligible properties.',
      'Some data is held back. Queries made by very few people are anonymised for privacy and do not appear in the Queries table, though they still count in the chart totals, so the table usually adds up to less than the total. The interface shows up to 1,000 rows; the API and bulk export give more.',
    ],
    why: [
      'It is the only first-party view of which queries bring people to your site from Google. Nearly every SEO question, from “which pages lost traffic?” to “what should we write next?”, starts here.',
      'The comparisons are its strength. Comparing the last 28 days with the previous period, or year on year, by query or page shows exactly where gains and losses came from.',
    ],
    how: {
      heading: 'How to use the Search Console Performance report',
      steps: [
        'Open Performance > Search results and turn on all four metrics.',
        'Set the date range to the last 3 months, or use Compare for period-on-period changes.',
        'Use the Queries tab to see what people searched, and the Pages tab to see which URLs earned clicks. Click a row to filter everything else by it.',
        'Filter out branded queries to see the effect of SEO work more clearly.',
        'Look for queries with high impressions and positions 5 to 20, and pages with a low CTR for their position.',
        'Export the data, or connect a tool that stores it, before it ages out after 16 months.',
      ],
    },
    example: {
      label: 'Regex filter: questions only',
      code: '^(who|what|when|where|why|how|can|does|is|are)\\b',
    },
    openseo: {
      body: 'OpenSEO reads the Performance report data read-only, keeps it beyond 16 months, and lists striking-distance queries (positions 5 to 20) with opportunity scores.',
      href: '/features/search-performance',
      label: 'See search performance',
    },
    related: ['google-search-console', 'clicks', 'impressions', 'click-through-rate', 'average-position', 'striking-distance-keywords', 'google-discover'],
    faqs: [
      {
        question: 'Why don’t the query rows add up to the total clicks?',
        answer: ['Rare queries are anonymised to protect privacy. They are counted in the totals but not shown as rows, so the table usually adds up to less.'],
      },
      {
        question: 'Can I see more than 1,000 rows?',
        answer: ['Not in the interface. Use the Search Console API, which returns more rows per request, or the bulk data export to BigQuery for everything.'],
      },
    ],
  },
  // ---------------------------------------------------------------- serp
  {
    slug: 'serp-features',
    term: 'SERP features',
    aka: ['search features', 'SERP elements', 'Google SERP features'],
    category: 'serp',
    short: 'SERP features are the results on Google’s results page that are not plain blue links, such as AI Overviews, featured snippets, local packs and videos.',
    definition: [
      'SERP features are any elements on a search engine results page other than the standard organic “ten blue links”. On Google they include AI Overviews, [featured snippets](/glossary/featured-snippet), [People Also Ask](/glossary/people-also-ask), the [local pack](/glossary/local-pack), [knowledge panels](/glossary/knowledge-panel), image packs, video carousels, Top stories, shopping results, sitelinks and ads.',
      'They fall into a few families. **Answer features** try to answer the query on the page: AI Overviews, featured snippets, knowledge panels and People Also Ask. **Vertical results** pull in other kinds of content: images, videos, news, products, local businesses, forums and short videos. **Enhanced listings** change how a normal organic result looks: [rich snippets](/glossary/rich-snippets) such as review stars and prices, [sitelinks](/glossary/sitelinks), and thumbnails. **Paid features** are search ads and shopping ads. **Navigation aids** such as [related searches](/glossary/related-searches) help users refine the query.',
      'Which features appear depends on what Google thinks the searcher wants. A local service query brings a map pack. A product query brings shopping results. A how-to query often brings videos and People Also Ask. A news topic brings Top stories. The mix changes often: Google tests new layouts constantly, retires features (HowTo rich results went in 2023, the sitelinks search box in 2024, FAQ rich results entirely in 2026) and adds others, most visibly AI Overviews and AI Mode.',
      'Some features you can win, and some you can only influence. Rich results generally need [structured data](/glossary/structured-data) plus content that meets Google’s guidelines. Featured snippets and AI Overview citations come from well-structured pages that already rank. Knowledge panels draw on Google’s Knowledge Graph. Local packs depend on your [Google Business Profile](/glossary/google-business-profile). No markup guarantees a feature; Google decides what to show.',
    ],
    why: [
      'SERP features change how many clicks a ranking is worth. Position 1 under an AI Overview, four ads and a map pack can sit far down the screen, especially on mobile, while position 1 on a plain page sits at the top. That is why the same position earns very different [click-through rates](/glossary/click-through-rate) on different queries, and why some searches end without a click at all (see [zero-click searches](/glossary/zero-click-searches)).',
      'They are also extra ways in. A page that ranks fifth can still be the featured snippet, be cited in the AI Overview, show in the video carousel and appear in People Also Ask. Owning several features on one results page can earn more attention than a single higher ranking.',
      'Features tell you what Google thinks the intent is. If the page for your target keyword is full of videos and product listings, a long text article is unlikely to compete. Check the features before you decide what kind of page to create.',
    ],
    how: {
      heading: 'How to win SERP features',
      steps: [
        'For each priority keyword, record which features appear and which sites own them. A SERP checker or rank tracker can do this at scale.',
        'Match the format. If videos appear, make a video and put it on a page where it is the main content. If a list snippet appears, answer with a clear list.',
        'Answer the core question in 40 to 60 words directly under a heading that matches the query, to compete for featured snippets and AI citations.',
        'Add structured data for the rich results you qualify for, such as Product, Review, Recipe, Event, Article or Video, and test it with the Rich Results Test.',
        'Use descriptive file names, [alt text](/glossary/alt-text) and good-quality images for image packs.',
        'For local queries, complete and maintain your Google Business Profile.',
        'Track which features you own over time. Losing a featured snippet or a citation can explain a traffic drop when your ranking has not changed.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'For “how to tile a bathroom wall” the results page shows an AI Overview, a video carousel, People Also Ask and then organic results. A site ranking fourth with an article and no video is competing for a fraction of the attention. Adding a step-by-step video to the page, a short direct answer under “How to tile a bathroom wall” and clear numbered steps give it a chance at the carousel, the AI Overview citations and People Also Ask.',
    },
    openseo: {
      body: 'The OpenSEO SERP checker shows the live top 10 with the SERP features on the page, and rank tracking records which features appear and whether you own them on every check.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['serp', 'featured-snippet', 'people-also-ask', 'ai-overviews', 'local-pack', 'knowledge-panel', 'rich-results', 'zero-click-searches'],
    faqs: [
      {
        question: 'What are the most common SERP features?',
        answer: ['On Google: ads, AI Overviews, featured snippets, People Also Ask, local packs, images, videos, Top stories, shopping results, knowledge panels, sitelinks and related searches. Which ones appear depends on the query.'],
      },
      {
        question: 'Do SERP features reduce organic traffic?',
        answer: ['They can. Features that answer the query or push organic results down tend to lower clicks on standard listings. But you can also win many of them, which brings traffic of its own.'],
      },
      {
        question: 'Does schema markup guarantee a SERP feature?',
        answer: ['No. Structured data makes a page eligible for some rich results, but Google decides whether to show them, based on the query, the content and its guidelines.'],
      },
      {
        question: 'How do I track SERP features?',
        answer: ['Use a rank tracker or SERP checker that records features for each keyword. Search Console’s search appearance filter also shows clicks from some rich result types.'],
      },
    ],
  },
  {
    slug: 'featured-snippet',
    term: 'Featured snippet',
    aka: ['answer box', 'snippet box', 'position zero'],
    category: 'serp',
    short: 'A featured snippet is a highlighted extract from a web page shown near the top of Google’s results to answer the query directly, with a link to the source.',
    definition: [
      'A featured snippet is a highlighted box near the top of Google’s search results that shows a short extract from one web page answering the query, with the page’s title and link. Google picks the extract automatically from pages that already rank well. It is often called “position zero” because it appears above the first standard organic result.',
      'Featured snippets come in a few formats. **Paragraph** snippets give a short block of text, often a definition or a direct answer. **List** snippets show numbered steps or a bulleted list, usually drawn from [headings](/glossary/header-tags) or HTML lists. **Table** snippets show rows of data such as prices, sizes or comparisons. **Video** snippets point to a section of a video, usually on YouTube. Some snippets also show an image taken from a different page.',
      'Google chooses the page and the text. There is no markup that makes a page a featured snippet, and you cannot apply for one. The source page nearly always already ranks on page one, though not necessarily first. Since January 2020, the page in the featured snippet is not repeated as a separate organic listing on page one: the snippet is its page-one result.',
      'The results page around featured snippets has changed. [AI Overviews](/glossary/ai-overviews) now appear on many informational queries, often above or instead of a featured snippet, and Google shows featured snippets on fewer queries than it used to. The skills are the same, though: a page that gives a clear, quotable answer to a question is the kind of source both featured snippets and AI answers draw on. See [answer engine optimization](/glossary/answer-engine-optimization).',
      'You can control how much of your content Google uses. The nosnippet meta tag stops any snippet being shown for the page, and the data-nosnippet attribute keeps a specific section out of snippets. max-snippet limits the length of text Google can show. These controls apply to all text snippets, including the normal description under your result, so use them sparingly.',
    ],
    why: [
      'A featured snippet puts your page at the very top of the organic results, with a larger listing and your answer in full view. For question-type and definition queries, that visibility can bring a lot of traffic and strengthens brand recognition. It can also be read aloud by voice assistants.',
      'It can cut both ways. If the snippet answers the whole question, for example a date or a conversion, many searchers will not click. Snippets work best for queries where the extract gives a taste and the reader needs the page for the rest, such as steps, comparisons or explanations.',
      'Because snippets can be won from positions 2 to 10, they are one of the few ways to jump above stronger sites without outranking them. They also change hands often, so keep an eye on them.',
    ],
    how: {
      heading: 'How to get a featured snippet',
      steps: [
        'Find [question keywords](/glossary/question-keywords) where you already rank on page one and a featured snippet appears. A [rank tracker](/glossary/rank-tracking) or SERP checker can list them; Search Console shows the queries, though not the snippet itself.',
        'Look at the current snippet: its format (paragraph, list or table), its length and the question it answers.',
        'Add a heading that matches the question as people ask it, such as “What is a heat pump?” or “How to reset a router”.',
        'Directly under it, answer in 40 to 60 words for a paragraph snippet. Start with the subject and a plain definition, with no preamble.',
        'For list snippets, use a real HTML ordered or unordered list, or a sequence of subheadings, with one short step per item.',
        'For table snippets, use a real HTML table with clear column headings.',
        'Then go deeper below the answer, so readers have a reason to click through.',
        'Make sure the page is indexable, fast and already a good result for the query; the snippet is chosen from pages Google already ranks well.',
        'Check back after the page is recrawled and track the snippet over time.',
      ],
    },
    example: {
      label: 'HTML structured for a list snippet',
      code: '<h2>How to descale a kettle</h2>\n<ol>\n  <li>Fill the kettle halfway with equal parts water and white vinegar.</li>\n  <li>Bring it to the boil, then switch it off.</li>\n  <li>Leave it to soak for 30 minutes.</li>\n  <li>Pour it away and rinse the kettle twice with fresh water.</li>\n  <li>Boil clean water once and discard it.</li>\n</ol>',
    },
    openseo: {
      body: 'The OpenSEO SERP checker shows the live top 10 for any keyword with the SERP features on the page, including featured snippets, so you can see who holds it and in what format.',
      href: '/tools/serp-checker',
      label: 'Open the SERP checker',
    },
    related: ['position-zero', 'serp-features', 'people-also-ask', 'ai-overviews', 'answer-engine-optimization', 'question-keywords', 'zero-click-searches'],
    faqs: [
      {
        question: 'Is a featured snippet the same as position zero?',
        answer: ['Yes, in everyday SEO language. “Position zero” refers to the featured snippet appearing above the first standard organic result. In Search Console, a featured snippet is reported as position 1.'],
      },
      {
        question: 'Can I mark up my page to get a featured snippet?',
        answer: ['No. There is no structured data for featured snippets. Google picks the text from the page’s content, so clear headings, direct answers, lists and tables help.'],
      },
      {
        question: 'How do I stop Google showing my page as a featured snippet?',
        answer: ['Add the nosnippet robots meta tag, or wrap sections in data-nosnippet. Both also remove those parts from ordinary snippets, so apply them carefully.'],
      },
      {
        question: 'Do featured snippets still exist with AI Overviews?',
        answer: ['Yes, but Google shows them on fewer queries, and on many informational searches an AI Overview now appears first. Well-structured answers help with both.'],
      },
    ],
  },
  {
    slug: 'people-also-ask',
    term: 'People Also Ask',
    aka: ['PAA', 'People also ask box', 'related questions'],
    category: 'serp',
    short: 'People Also Ask is a Google results box of questions related to the search. Each one expands to show a short answer from a web page, with a link.',
    definition: [
      'People Also Ask (PAA) is a box in Google’s search results listing questions related to the original query. Clicking a question expands it to show a short answer, usually an extract from a web page with its title and link, much like a [featured snippet](/glossary/featured-snippet). Expanding one question typically loads more related questions below.',
      'PAA appears on a large share of searches, especially informational ones, and can show anywhere on the page, not only near the top. The questions come from what people search for around the topic, so they are a direct window into the follow-up questions your audience has. The answers are drawn from pages Google considers good sources for each question, not necessarily the pages ranking for the original query.',
      'PAA answers come in the same shapes as featured snippets: a paragraph, a list, a table or a video. Google regularly tests how PAA looks and how many questions it shows. As with featured snippets, there is no markup that makes your page a PAA answer; FAQ structured data does not put you there, and Google stopped showing FAQ rich results entirely in 2026.',
      'People Also Ask is related to, but different from, [related searches](/glossary/related-searches) at the bottom of the page, which suggest whole new queries, and from [Google Autocomplete](/glossary/google-autocomplete), which predicts a query as you type. All three are useful for [keyword research](/glossary/keyword-research).',
    ],
    why: [
      'PAA is one of the easiest SERP features for a smaller site to appear in. Each question is a separate opportunity, and Google often pulls answers from pages that do not rank on page one for the main query. A clear answer to a specific question can earn you a spot on a results page you would otherwise never appear on.',
      'It is also research handed to you. The questions show what people want to know next, in their own words. Answering them makes a page more complete for readers, and the questions make good subheadings. Many [question keywords](/glossary/question-keywords) and long-tail topics start life as PAA questions.',
      'PAA questions overlap with what people ask AI assistants. Pages that answer specific questions directly are well placed for AI Overviews and [AI citations](/glossary/ai-citations) too.',
    ],
    how: {
      heading: 'How to rank in People Also Ask',
      steps: [
        'Search your main keywords and note the PAA questions. Expand a few to see the next layer. Do it on mobile and desktop, and in the country you target.',
        'Group the questions by theme. Questions that belong to your topic go into the page as subheadings; questions that are big enough to stand alone may need their own pages.',
        'Use the question, or a close version of it, as an H2 or H3.',
        'Answer it immediately below in 40 to 60 words, in plain language, starting with the subject of the question.',
        'Use a list or table where the question calls for steps or comparisons.',
        'Add detail after the short answer for readers who want more.',
        'Keep answers accurate and up to date. PAA answers change hands often, especially for questions with dated information.',
        'Check the PAA box again after the page is recrawled to see whether your answer has been picked up.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'For “heat pump” Google shows questions such as “How much does a heat pump cost to run?”, “Do heat pumps work in cold weather?” and “What are the disadvantages of a heat pump?”. A heat pump guide adds each as an H2, answers it in two or three sentences directly below, and then expands with figures and examples. Weeks later the page is the source for one PAA answer even though it ranks eighth for “heat pump”.',
    },
    openseo: {
      body: 'OpenSEO keyword ideas list the questions people search around any keyword, with volume, difficulty and intent, so you can choose which to answer.',
      href: '/tools/keyword-ideas',
      label: 'Find question keywords',
    },
    related: ['featured-snippet', 'question-keywords', 'serp-features', 'related-searches', 'google-autocomplete', 'answer-engine-optimization', 'faq-page'],
    faqs: [
      {
        question: 'How do I get into People Also Ask?',
        answer: ['Use the question as a heading and answer it clearly in 40 to 60 words directly underneath, then expand. Google chooses answers from pages it already sees as good sources on the topic.'],
      },
      {
        question: 'Does FAQ schema help with People Also Ask?',
        answer: ['No. PAA answers come from page content, not FAQ structured data. Google retired FAQ rich results in 2026.'],
      },
      {
        question: 'Where do People Also Ask questions come from?',
        answer: ['Google generates them from related searches people make. They change with the query, location, language and over time.'],
      },
      {
        question: 'Do People Also Ask clicks show in Search Console?',
        answer: ['Yes, under the query that triggered the box. Search Console counts an impression only when someone expands the question and your link appears, and a click when they click that link.'],
      },
    ],
  },
  {
    slug: 'knowledge-panel',
    term: 'Knowledge panel',
    aka: ['Google knowledge panel', 'knowledge graph panel'],
    category: 'serp',
    short: 'A knowledge panel is the information box Google shows for a well-known person, organisation, place or thing, drawn from its Knowledge Graph.',
    definition: [
      'A knowledge panel is an information box that Google shows in search results for a known entity, such as a person, company, place, film or book. On desktop it usually sits to the right of the results; on mobile, near the top. It summarises key facts, such as a description, logo and social profiles, drawn from Google’s [Knowledge Graph](/glossary/knowledge-graph).',
      'Google generates knowledge panels automatically from many sources across the web. You cannot create one, but an individual or organisation that is the subject of a panel can claim it by verifying with Google, then suggest changes. Panels for local businesses are different: they come from [Google Business Profile](/glossary/google-business-profile) and are managed there.',
    ],
    why: [
      'A knowledge panel is a sign that Google understands your brand as an [entity](/glossary/entity). It gives branded searches a trustworthy, prominent summary, and the facts in it often feed the way AI assistants describe you.',
      'Wrong or outdated information in a panel can mislead customers, so it is worth claiming yours and keeping the sources it draws on accurate.',
    ],
    how: {
      heading: 'How to get a knowledge panel',
      steps: [
        'Publish a clear About page that states who you are, what you do and where, consistently.',
        'Add Organization (or Person) structured data to your homepage with your logo, official name and sameAs links to your official profiles.',
        'Keep your name and details consistent across official profiles, directories and reputable sources such as Wikipedia or Wikidata where you genuinely qualify.',
        'If a panel appears, sign in with an account linked to your official site or profiles, select “Claim this knowledge panel” and follow the verification steps.',
        'Once verified, use “Suggest edits” to correct facts.',
      ],
    },
    example: {
      label: 'Organization JSON-LD',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Example Ltd",\n  "url": "https://www.example.com/",\n  "logo": "https://www.example.com/logo.png",\n  "sameAs": [\n    "https://www.linkedin.com/company/example",\n    "https://github.com/example"\n  ]\n}\n</script>',
    },
    related: ['knowledge-graph', 'entity', 'serp-features', 'google-business-profile', 'schema-markup', 'branded-keywords'],
    faqs: [
      {
        question: 'Can I create a Google knowledge panel?',
        answer: ['No. Google creates panels automatically when it has enough reliable information about an entity. You can make that more likely with consistent information and structured data, and claim the panel once it appears.'],
      },
      {
        question: 'How do I edit my knowledge panel?',
        answer: ['Claim it through Google’s verification process, then use Suggest edits. Anyone can send feedback, but verified owners’ suggestions carry more weight.'],
      },
    ],
  },
  {
    slug: 'sitelinks',
    term: 'Sitelinks',
    aka: ['Google sitelinks'],
    category: 'serp',
    short: 'Sitelinks are extra links to other pages of a site that Google shows under a search result, usually for brand searches.',
    definition: [
      'Sitelinks are additional links to pages within a website that Google sometimes shows beneath a search result, to help users jump straight to an important section. They appear most often for navigational and branded searches, for example links to Pricing, Login and Contact under a company’s homepage result.',
      'Google generates sitelinks automatically. There is no setting or markup to request them, and Search Console no longer lets you demote individual sitelinks. The sitelinks search box, a search field that used to appear under some results, was retired in November 2024.',
    ],
    why: [
      'Sitelinks make a result much bigger and send searchers directly to the page they wanted, which helps branded [click-through rate](/glossary/click-through-rate). They also push competitors further down the page for your brand name.',
      'They reflect how well Google understands your [site architecture](/glossary/site-architecture). Clear navigation and descriptive internal links make good sitelinks more likely. Sites with a flat, confusing structure, or many near-identical pages, tend to get fewer or less useful sitelinks.',
    ],
    how: {
      heading: 'How to get sitelinks',
      steps: [
        'Use a clear, logical structure with your important pages linked from the main navigation.',
        'Give those pages descriptive, unique [title tags](/glossary/title-tag) and headings.',
        'Use concise, descriptive anchor text in internal links.',
        'If an unwanted page appears as a sitelink, improve your navigation or, if the page should not be in search at all, noindex it.',
      ],
    },
    related: ['serp-features', 'site-architecture', 'internal-links', 'branded-keywords', 'breadcrumbs'],
    faqs: [
      {
        question: 'How do I remove a sitelink?',
        answer: ['There is no direct control. Google removed the sitelink demotion tool from Search Console. You can noindex the page if it should not appear in search, or change your internal linking.'],
      },
      {
        question: 'Can structured data give me sitelinks?',
        answer: ['No. Sitelinks are generated from your site’s structure and links. The old sitelinks search box markup no longer does anything.'],
      },
    ],
  },
  {
    slug: 'rich-snippets',
    term: 'Rich snippets',
    aka: ['rich snippet', 'enhanced snippets'],
    category: 'serp',
    short: 'Rich snippets are search results enhanced with extra details, such as review stars, prices or cooking times, usually from structured data.',
    definition: [
      'Rich snippets are standard search results enhanced with extra information pulled from the page, such as star ratings, review counts, prices, stock status, cooking times or event dates. Google mostly generates them from [structured data](/glossary/structured-data) on the page. Google’s own documentation now calls these and other enhanced results [rich results](/glossary/rich-results).',
      'Eligibility depends on the type of content and Google’s guidelines for it. Product pages can show price, availability and ratings; recipes can show ratings and times; events can show dates. Some kinds have been retired: HowTo rich results in 2023 and FAQ rich results in 2026. Review snippets are not shown for “self-serving” reviews that a business publishes about itself on its own site using LocalBusiness or Organization markup.',
    ],
    why: [
      'Rich snippets make a listing larger and more informative than its neighbours, which tends to lift [click-through rate](/glossary/click-through-rate). They also pre-qualify clicks: a shopper who sees the price before clicking is more likely to buy.',
      'They do not raise rankings directly. Markup that misrepresents the page, such as fake ratings, can lead to a manual action for [structured data spam](/glossary/structured-data-spam).',
    ],
    how: {
      heading: 'How to get rich snippets',
      steps: [
        'Check Google’s search gallery for the rich result types that fit your content.',
        'Add the matching [schema markup](/glossary/schema-markup) in JSON-LD, including all required properties.',
        'Make sure every value in the markup is visible on the page and true.',
        'Test the page with the Rich Results Test, then deploy.',
        'Watch the enhancement reports in Search Console for errors.',
      ],
    },
    example: {
      label: 'Product JSON-LD with rating and price',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Trail Running Shoe",\n  "image": "https://www.example.com/shoe.jpg",\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": "4.6",\n    "reviewCount": "128"\n  },\n  "offers": {\n    "@type": "Offer",\n    "price": "119.00",\n    "priceCurrency": "GBP",\n    "availability": "https://schema.org/InStock"\n  }\n}\n</script>',
    },
    related: ['rich-results', 'structured-data', 'schema-markup', 'json-ld', 'serp-features', 'structured-data-spam'],
    faqs: [
      {
        question: 'What is the difference between rich snippets and rich results?',
        answer: ['Rich snippets is the older name for enhanced listings like review stars and prices. Google now uses rich results for these and for other enhanced features such as carousels.'],
      },
      {
        question: 'Why aren’t my rich snippets showing?',
        answer: ['Valid markup makes a page eligible but does not guarantee display. Google may decide not to show it for the query, the content may not meet its guidelines, or the page may not have been recrawled yet.'],
      },
    ],
  },
  {
    slug: 'image-pack',
    term: 'Image pack',
    aka: ['images pack', 'image results'],
    category: 'serp',
    short: 'An image pack is a row or block of image results inside Google’s main search results, linking to Google Images and the source pages.',
    definition: [
      'An image pack is a group of image thumbnails that Google shows within its regular web results when it thinks images would help the searcher. Clicking an image opens a larger preview with a link to the page it came from. Image packs are common for visual queries such as products, designs, places, animals and “ideas” searches.',
      'The images come from Google Images, so the same [image SEO](/glossary/image-seo) factors apply: a relevant page, a descriptive file name, good [alt text](/glossary/alt-text), nearby text that explains the image, and an image Google can crawl and index.',
    ],
    why: [
      'An image pack is a second route onto page one for visual queries, and often sits above many organic results. For ecommerce, design and travel sites, image search can bring meaningful traffic.',
      'It also tells you something about intent: if Google shows images, searchers want to see things, so your page should show them too.',
    ],
    how: {
      heading: 'How to rank in the image pack',
      steps: [
        'Use original, high-quality images rather than stock photos used everywhere else.',
        'Give images descriptive file names and alt text that describe what they show.',
        'Place images near relevant text and headings on a page about the same topic.',
        'Use standard image formats and the HTML img element, so Google can find them.',
        'List important images in your sitemap or an image sitemap, and do not block image URLs in robots.txt.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<img src="/images/oak-dining-table-6-seater.jpg" alt="Solid oak six-seater dining table in a bright kitchen" width="1200" height="800">',
    },
    related: ['image-seo', 'alt-text', 'serp-features', 'video-carousel', 'xml-sitemap'],
    faqs: [
      {
        question: 'Do image pack clicks show in Search Console?',
        answer: ['Clicks from image results in the main web search count under the Web search type. Clicks from Google Images itself are under the Image search type.'],
      },
      {
        question: 'Does alt text help images rank?',
        answer: ['Yes. Google uses alt text, with computer vision and the page content, to understand what an image shows.'],
      },
    ],
  },
  {
    slug: 'video-carousel',
    term: 'Video carousel',
    aka: ['video results', 'video pack'],
    category: 'serp',
    short: 'A video carousel is a scrollable row of video results in Google Search, often from YouTube, shown when video suits the query.',
    definition: [
      'A video carousel is a horizontally scrolling row of video results that Google shows within search results when it thinks a video would answer the query well. Each card shows a thumbnail, title, source, length and date. Many come from YouTube, but videos hosted on other sites can appear if Google can find and index them.',
      'Since 2023 Google only shows video results for pages where the video is the main content of the page; a video embedded in the sidebar of an article is unlikely to qualify. Videos can also show “key moments” that link to specific timestamps, set through chapters on YouTube or Clip or SeekToAction markup elsewhere.',
    ],
    why: [
      'For “how to”, review and tutorial queries with [informational intent](/glossary/informational-intent), video carousels often appear high on the page and take a lot of attention. If you do not have a video, a competitor’s video may be the result people see first.',
      'Google treats the carousel as one position in Search Console, so every video in it shares the same position number.',
    ],
    how: {
      heading: 'How to get videos into Google results',
      steps: [
        'Make the video the main content of a dedicated page, with a descriptive [title tag](/glossary/title-tag) and text around it.',
        'Use a supported video format and make sure Google can fetch the video file or player and a thumbnail image.',
        'Add VideoObject [structured data](/glossary/structured-data) with name, description, thumbnailUrl and uploadDate.',
        'Add chapters (on YouTube) or Clip markup so Google can show key moments.',
        'Check the Video indexing report in Search Console for problems.',
      ],
    },
    example: {
      label: 'VideoObject JSON-LD',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "VideoObject",\n  "name": "How to bleed a radiator",\n  "description": "A three-minute guide to bleeding a radiator safely.",\n  "thumbnailUrl": "https://www.example.com/video/bleed-radiator.jpg",\n  "uploadDate": "2026-03-04",\n  "duration": "PT3M12S",\n  "contentUrl": "https://www.example.com/video/bleed-radiator.mp4"\n}\n</script>',
    },
    related: ['serp-features', 'structured-data', 'image-pack', 'rich-results', 'informational-intent'],
    faqs: [
      {
        question: 'Do I need YouTube to appear in video carousels?',
        answer: ['No, but YouTube videos appear very often. Videos on your own site can appear if they are the main content of the page and Google can index them.'],
      },
      {
        question: 'Why is my video not indexed?',
        answer: ['Common reasons are that the video is not the main content of the page, Google cannot fetch the video or thumbnail, or the page itself is not indexed. The Video indexing report in Search Console lists the reason.'],
      },
    ],
  },
  {
    slug: 'top-stories',
    term: 'Top stories',
    aka: ['Top stories carousel', 'news box'],
    category: 'serp',
    short: 'Top stories is the Google results section that shows recent news articles about a query, usually as a carousel or list near the top.',
    definition: [
      'Top stories is a section of Google’s search results that shows recent, relevant news articles for queries about current events or newsworthy topics. It usually appears as a carousel or a short list near the top of the page, with each article’s headline, publisher, image and how long ago it was published.',
      'Any page that meets Google News content policies can appear; you do not need to apply to Google News, and AMP has not been required since 2021. Google looks for timely, original reporting from publishers with signals of authority on the topic.',
    ],
    why: [
      'For publishers, Top stories can bring large amounts of traffic within hours of a story breaking. It favours [freshness](/glossary/freshness) and authority, so it rewards sites that report quickly and reliably on topics they cover often.',
      'For other sites, it shows which queries Google treats as news. Ranking with an evergreen guide there is harder while a story is live.',
    ],
    how: {
      heading: 'How to appear in Top stories',
      steps: [
        'Publish original, timely reporting on topics you cover regularly.',
        'Show clear dates, bylines with author pages, and contact and editorial information: the trust signals behind [E-E-A-T](/glossary/eeat).',
        'Add Article or NewsArticle structured data with headline, image, datePublished and dateModified.',
        'Use large, high-quality images (at least 1200 pixels wide) and allow them in previews with max-image-preview:large.',
        'Make sure new articles are crawled quickly: link them from the homepage and a news [XML sitemap](/glossary/xml-sitemap).',
      ],
    },
    example: {
      label: 'NewsArticle JSON-LD',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "NewsArticle",\n  "headline": "City council approves new cycle lanes",\n  "image": ["https://www.example.com/news/cycle-lanes.jpg"],\n  "datePublished": "2026-10-18T08:00:00+01:00",\n  "dateModified": "2026-10-18T09:30:00+01:00",\n  "author": [{ "@type": "Person", "name": "Sam Patel", "url": "https://www.example.com/authors/sam-patel" }]\n}\n</script>',
    },
    related: ['serp-features', 'freshness', 'google-discover', 'eeat', 'structured-data'],
    faqs: [
      {
        question: 'Do I need AMP to appear in Top stories?',
        answer: ['No. Google dropped the AMP requirement in 2021. Any page that meets Google News policies can appear.'],
      },
      {
        question: 'Do I need to be in Google News to appear in Top stories?',
        answer: ['No application is needed. Google automatically considers sites that publish news and meet its content policies.'],
      },
    ],
  },
  {
    slug: 'shopping-results',
    term: 'Shopping results',
    aka: ['Google Shopping results', 'product listings', 'free listings'],
    category: 'serp',
    short: 'Shopping results are product listings in Google Search showing images, prices and stores, from Merchant Center feeds or product structured data.',
    definition: [
      'Shopping results are product listings that Google shows in search results and the Shopping tab, with an image, price, store name and often ratings. Some are paid Shopping ads; others are free listings that any merchant can earn. Both draw on product data from Google Merchant Center, and Google can also use Product [structured data](/glossary/structured-data) from your pages.',
      'Free product listings have been available since 2020. Organic product results can show in several ways: a product grid, a popular products module, a product knowledge panel, or a rich snippet with price and availability on a normal result.',
    ],
    why: [
      'For product searches with [transactional intent](/glossary/transactional-intent), shopping results often take the most visible space on the page, above standard organic links. An ecommerce site without accurate product data is missing from the part of the page buyers look at first.',
      'Free listings also cost nothing per click, so they add to your organic traffic.',
    ],
    how: {
      heading: 'How to get free shopping listings',
      steps: [
        'Create a Google Merchant Center account and verify and claim your website.',
        'Submit a product feed, or let Merchant Center read your product structured data.',
        'Turn on free listings (the free listings or “Google surfaces” programme) in Merchant Center.',
        'Keep price, availability and shipping accurate. Mismatches between the feed and the page lead to disapprovals.',
        'Add good images, GTINs and clear product titles.',
      ],
    },
    related: ['ecommerce-seo', 'serp-features', 'paid-results', 'rich-snippets', 'transactional-intent'],
    faqs: [
      {
        question: 'Are Google Shopping results free?',
        answer: ['Some are. Shopping ads are paid per click, while free listings are unpaid. Both use product data from Merchant Center.'],
      },
      {
        question: 'Do I need Merchant Center for shopping results?',
        answer: ['It is the most reliable route, and it is required for Shopping ads. Google can also use Product structured data on your pages for some organic product features.'],
      },
    ],
  },
  {
    slug: 'related-searches',
    term: 'Related searches',
    aka: ['Searches related to', 'People also search for'],
    category: 'serp',
    short: 'Related searches are the query suggestions Google shows on the results page, often at the bottom, to help people refine or broaden their search.',
    definition: [
      'Related searches are suggested queries that Google shows on the search results page, most often at the bottom under “People also search for” or “Searches related to”. They are generated from what other people searched around the same topic, and clicking one runs that new search.',
      'They differ from [People Also Ask](/glossary/people-also-ask), which shows questions with expandable answers, and from [Google Autocomplete](/glossary/google-autocomplete), which appears while you type. Related searches often reveal variations, sub-topics and the next step in a search journey.',
    ],
    why: [
      'Related searches are a free, direct source of keyword ideas that real people use. They are especially good for finding [long-tail keywords](/glossary/long-tail-keywords), synonyms and sub-topics to cover in a page or a topic cluster.',
      'They also show how Google connects topics, which helps you plan internal links between related pages.',
    ],
    how: {
      heading: 'How to use related searches for keyword research',
      steps: [
        'Search your seed keyword and scroll to the related searches.',
        'Click through a few to see the related searches for those queries in turn.',
        'Add the useful ones to your keyword list and check their volume and difficulty.',
        'Decide which belong as sections of an existing page and which need their own page.',
      ],
    },
    openseo: {
      body: 'OpenSEO keyword ideas include related searches for any keyword, with volume, difficulty, CPC, intent and a 12-month trend.',
      href: '/tools/keyword-ideas',
      label: 'Find keyword ideas',
    },
    related: ['people-also-ask', 'google-autocomplete', 'keyword-research', 'long-tail-keywords', 'seed-keyword'],
    faqs: [
      {
        question: 'Where do Google related searches come from?',
        answer: ['Google generates them from patterns in what people search around the same topic. They vary by location, language and over time.'],
      },
      {
        question: 'Are related searches the same as LSI keywords?',
        answer: ['No. Related searches are real query suggestions from Google. “LSI keywords” is an SEO label for loosely related words, and Google says it does not use latent semantic indexing.'],
      },
    ],
  },
  {
    slug: 'google-discover',
    term: 'Google Discover',
    aka: ['Discover feed', 'Google feed'],
    category: 'serp',
    short: 'Google Discover is a personalised feed of articles and videos in the Google app and on mobile, shown by interest without a search query.',
    definition: [
      'Google Discover is a personalised content feed that shows articles, videos and other content to users based on their interests, without them typing a search. It appears in the Google app, below the search box on the Google mobile homepage, and in some Android launchers. Discover picks content from pages that are indexed in Google and meet its content policies.',
      'There is no keyword to target and no markup required. Discover favours timely, interesting content with large, high-quality images, and its traffic tends to come in spikes rather than a steady flow. Sites with enough Discover traffic see a separate Discover performance report in Search Console.',
    ],
    why: [
      'For publishers and content sites, Discover can deliver large volumes of traffic, sometimes more than search on a given day. Because it reaches people who were not searching, it is also a way to find new readers.',
      'It is unpredictable. Plan for Discover as a bonus on top of search, not a foundation.',
    ],
    how: {
      heading: 'How to get traffic from Google Discover',
      steps: [
        'Publish timely or genuinely interesting content on topics your site covers well, written for people rather than to fill a quota.',
        'Use titles that describe the content accurately; Google warns against [clickbait titles](/glossary/clickbait-titles) and misleading ones.',
        'Use large, compelling images at least 1200 pixels wide, and allow them with the max-image-preview:large robots setting.',
        'Follow [E-E-A-T](/glossary/eeat) basics: clear authorship, dates and publisher information.',
        'Check the Discover report in [Google Search Console](/glossary/google-search-console) to see which pages are picked up.',
      ],
    },
    example: {
      label: 'Allow large image previews',
      code: '<meta name="robots" content="max-image-preview:large">',
    },
    related: ['top-stories', 'search-console-performance-report', 'freshness', 'clickbait-titles', 'eeat'],
    faqs: [
      {
        question: 'How do I get into Google Discover?',
        answer: ['There is nothing to apply for. Indexed pages that meet Discover’s content policies are eligible; timely, high-quality content with large images and accurate titles does best.'],
      },
      {
        question: 'Why is my Discover traffic so volatile?',
        answer: ['Discover is driven by interest and freshness, not queries, so traffic comes in spikes as stories are shown and then drop away.'],
      },
    ],
  },
  {
    slug: 'position-zero',
    term: 'Position zero',
    aka: ['position 0', 'rank zero'],
    category: 'serp',
    short: 'Position zero is the informal name for a featured snippet: the answer box Google shows above the first standard organic result.',
    definition: [
      'Position zero is an informal SEO term for the [featured snippet](/glossary/featured-snippet), the highlighted answer box that Google shows above the first standard organic result. It is called “zero” because it sits above position 1. Google itself does not use the term; in Search Console, a featured snippet counts as a normal position, usually 1.',
      'Since January 2020, the page shown in the featured snippet is not also listed again as a standard result on page one, so winning position zero replaces your normal listing rather than adding to it. Today many informational queries show an AI Overview at the top, and some SEOs use “position zero” more loosely for whatever answer sits there.',
    ],
    why: [
      'Being the featured snippet gives you the most prominent organic placement on the page, and can lift a page from lower on page one to the top. It also makes your content the answer voice assistants may read out.',
      'Because the answer is right there, some searchers will not click. Position zero is worth most when the query needs more than a one-line answer.',
    ],
    how: {
      heading: 'How to win position zero',
      body: [
        'Rank on page one first, then structure the answer: a heading that matches the question, a direct 40 to 60 word answer below it, and lists or tables where the query calls for them. See [how to get a featured snippet](/glossary/featured-snippet) for the full steps, and track which snippets you hold with [rank tracking](/glossary/rank-tracking).',
      ],
    },
    related: ['featured-snippet', 'serp-features', 'people-also-ask', 'ai-overviews', 'zero-click-searches'],
    faqs: [
      {
        question: 'Is position zero better than position 1?',
        answer: ['It is more prominent, but it replaces your standard listing rather than adding to it, and it can reduce clicks when the answer is fully visible. For most queries it is still worth having.'],
      },
      {
        question: 'Do AI Overviews replace position zero?',
        answer: ['On many informational queries an AI Overview now appears at the top, above or instead of a featured snippet. Clear, quotable answers help you appear in both.'],
      },
    ],
  },
  {
    slug: 'paid-results',
    term: 'Paid search results',
    aka: ['search ads', 'sponsored results', 'PPC ads', 'Google Ads results'],
    category: 'serp',
    short: 'Paid search results are ads shown on search results pages, labelled Sponsored on Google, where advertisers pay when someone clicks.',
    definition: [
      'Paid search results are adverts that appear on a search results page, usually above and below the organic results, where advertisers pay for clicks. On Google they come from Google Ads and are labelled “Sponsored”. They include text ads, which look much like organic listings, and Shopping ads with product images and prices.',
      'Ad positions are decided by an auction that weighs each advertiser’s bid against the ad’s quality and expected impact. Paid results are part of [search engine marketing](/glossary/search-engine-marketing), alongside SEO; buying ads does not affect organic rankings.',
    ],
    why: [
      'Ads take space at the top of many commercial results pages, which pushes organic results down and affects how many clicks a top organic ranking earns. Check how many ads appear for your target keywords before you estimate traffic.',
      'Ad data helps SEO. [Cost per click](/glossary/cost-per-click) shows how much advertisers will pay for a keyword, which is a good proxy for its commercial value, and keywords that convert well in ads are often worth targeting organically.',
    ],
    how: {
      heading: 'How to use paid search data for SEO',
      steps: [
        'Look at CPC alongside search volume when you prioritise keywords: high CPC usually means buying intent.',
        'Use your own Google Ads conversion data to find keywords worth ranking for organically.',
        'Check how many ads and shopping results show for a keyword before estimating organic traffic from it.',
        'Where you rank first organically for your own brand, test whether pausing brand ads changes total clicks.',
      ],
    },
    related: ['search-engine-marketing', 'cost-per-click', 'organic-search', 'shopping-results', 'serp-features', 'commercial-intent'],
    faqs: [
      {
        question: 'Do Google Ads improve organic rankings?',
        answer: ['No. Google keeps ads and organic ranking separate. Running ads does not raise, or lower, your organic positions.'],
      },
      {
        question: 'How can I tell an ad from an organic result?',
        answer: ['On Google, ads are labelled “Sponsored”. Organic results have no label.'],
      },
    ],
  },
  {
    slug: 'zero-click-searches',
    term: 'Zero-click searches',
    aka: ['zero-click search', 'no-click searches'],
    category: 'serp',
    short: 'Zero-click searches are searches that end without a click to any website, because the answer is on the results page or the user gives up.',
    definition: [
      'Zero-click searches are searches where the user does not click through to any website from the results page. The user may get the answer from an AI Overview, a [featured snippet](/glossary/featured-snippet), a knowledge panel, a calculator, a weather box or a map, refine the query, or simply leave.',
      'Estimates of how many searches end without a click vary widely between studies and methods, and they have been rising as Google adds more answers to the results page. Exact shares are less useful than the trend: for many quick factual queries, ranking first no longer guarantees much traffic.',
    ],
    why: [
      'Zero-click behaviour changes which keywords are worth targeting. A query like “time in Tokyo” or “50 euros to dollars” will rarely send visits however well you rank, while “best family hotels in Tokyo” still does. Factor it in when you estimate [traffic potential](/glossary/traffic-potential).',
      'Visibility still has value without the click. Being the source of an answer, a cited link in an AI Overview, or the business in the local pack builds brand awareness and can lead to a branded search, a phone call or a visit later. Measure [impressions](/glossary/impressions) and brand search, not only clicks.',
    ],
    how: {
      heading: 'How to adapt to zero-click searches',
      steps: [
        'Check the results page before targeting a keyword. If the answer is fully on the page, expect few clicks.',
        'Prioritise queries that need more than a one-line answer: comparisons, how-tos, research and buying decisions.',
        'Aim to be the cited source in AI Overviews and featured snippets, so your brand appears even without a click.',
        'For local businesses, keep your Google Business Profile complete: calls and direction requests are results too.',
        'Track impressions, branded searches and conversions alongside clicks.',
      ],
    },
    related: ['serp-features', 'ai-overviews', 'featured-snippet', 'click-through-rate', 'ai-visibility', 'knowledge-panel'],
    faqs: [
      {
        question: 'Are zero-click searches bad for SEO?',
        answer: ['They reduce clicks on some queries, but they do not make SEO pointless. Focus on queries that need a visit, and treat answer visibility as brand exposure.'],
      },
      {
        question: 'Do AI Overviews increase zero-click searches?',
        answer: ['They answer more queries directly on the page, which tends to reduce clicks to websites for those queries. The effect varies by query type.'],
      },
    ],
  },
  {
    slug: 'serp-volatility',
    term: 'SERP volatility',
    aka: ['ranking volatility', 'SERP fluctuations', 'rank fluctuations'],
    category: 'serp',
    short: 'SERP volatility is how much search results change over a period. High volatility often signals a Google update or a shake-up in a niche.',
    definition: [
      'SERP volatility is a measure of how much search results change from one day to the next. When many rankings move at once across many keywords, volatility is high, which often happens during a [Google core update](/glossary/core-update) or another [algorithm update](/glossary/google-algorithm-update). When results barely change, volatility is low.',
      'Volatility trackers measure it by checking the same large set of keywords every day and scoring how far positions moved. You can also measure it for your own keyword set in a rank tracker: how many of your tracked keywords moved, and by how much.',
    ],
    why: [
      'Volatility gives context to your own ranking changes. If your rankings drop on a day when the whole industry shows heavy movement, an update is the likely cause and you should wait for it to finish before reacting. If they drop while the wider results are calm, the cause is more likely on your site: a technical problem, a lost link or a page change.',
      'Some results pages are naturally more volatile than others, for example news topics, new queries and pages where Google is unsure of intent. Ranking on volatile keywords needs more frequent monitoring.',
    ],
    how: {
      heading: 'How to check SERP volatility',
      steps: [
        'Check Google’s Search Status Dashboard for confirmed ranking updates.',
        'Look at public volatility trackers to see whether movement is industry-wide.',
        'In your rank tracker, compare how many tracked keywords moved this week with a normal week.',
        'Break the movement down by topic or page type to see where changes are concentrated.',
        'Wait until an announced update has finished rolling out before making major changes.',
      ],
    },
    openseo: {
      body: 'OpenSEO rank tracking can check positions daily, so you can see how much your keywords and competitors move during an update.',
      href: '/features/rank-tracking',
      label: 'See rank tracking',
    },
    related: ['core-update', 'google-algorithm-update', 'rank-tracking', 'keyword-ranking', 'serp'],
    faqs: [
      {
        question: 'Why do my rankings change every day?',
        answer: ['Small daily movements are normal. Google constantly tests and updates results, and competitors change their pages. Look at trends over weeks rather than single days.'],
      },
      {
        question: 'How long does SERP volatility last after a core update?',
        answer: ['Core updates usually take up to two weeks or so to roll out, and results can keep shifting during that time. Google announces start and completion on its Search Status Dashboard.'],
      },
    ],
  },
  {
    slug: 'google-autocomplete',
    term: 'Google Autocomplete',
    aka: ['Google Suggest', 'autocomplete predictions', 'search suggestions'],
    category: 'serp',
    short: 'Google Autocomplete predicts what you are searching for as you type, suggesting full queries based on real searches, location and language.',
    definition: [
      'Google Autocomplete is the feature that suggests complete search queries as you type in the search box. Google calls these predictions, not suggestions: they reflect real searches people make, including trending ones, adjusted for your language, location and sometimes your past searches. Picking one runs that search.',
      'Predictions are filtered by Google’s Autocomplete policies, which remove, for example, sexually explicit, hateful, violent or dangerous predictions, and some predictions about people that could be harmful. You cannot buy or submit predictions, and trying to manipulate them with automated searches breaks Google’s policies.',
    ],
    why: [
      'Autocomplete is one of the best free sources of [long-tail keywords](/glossary/long-tail-keywords) and [question keywords](/glossary/question-keywords), in the exact words people use. Typing a seed keyword followed by each letter of the alphabet, or by “how”, “vs” or “for”, reveals many variations.',
      'Predictions also show how people think about a topic, which brands they associate with it, and which modifiers matter, such as “near me”, “price” or a year.',
    ],
    how: {
      heading: 'How to find keywords with Google Autocomplete',
      steps: [
        'Open a private browser window, set to the country you target, and type your seed keyword slowly.',
        'Note the predictions, then add a space and each letter of the alphabet to see more.',
        'Try question words before the keyword (how, what, why, can) and modifiers after it (for, vs, near, best).',
        'Check volume and difficulty for the predictions worth targeting.',
      ],
    },
    example: {
      label: 'Predictions for “dog harness”',
      body: 'dog harness for small dogs · dog harness vs collar · dog harness no pull · dog harness size chart · dog harness how to put on',
    },
    openseo: {
      body: 'OpenSEO keyword ideas include Google suggestions for any keyword, with search volume, difficulty, CPC and intent attached.',
      href: '/tools/keyword-ideas',
      label: 'Find keyword ideas',
    },
    related: ['long-tail-keywords', 'question-keywords', 'related-searches', 'people-also-ask', 'keyword-research', 'seed-keyword', 'automated-queries'],
    faqs: [
      {
        question: 'How does Google decide autocomplete predictions?',
        answer: ['From real searches, including how often a query is searched and whether it is trending, adjusted for language and location, then filtered by Google’s Autocomplete policies.'],
      },
      {
        question: 'Can I remove a Google autocomplete prediction?',
        answer: ['You can report a prediction that breaks Google’s policies using the feedback option under the search box. Google removes those that violate its rules.'],
      },
    ],
  },
];
