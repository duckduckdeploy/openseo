import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'backlink',
    term: 'Backlink',
    aka: ['inbound link', 'incoming link', 'external link'],
    category: 'links',
    short: 'A backlink is a link from another website to yours. Search engines treat backlinks as votes of trust and use them to rank and discover pages.',
    definition: [
      'A backlink is a hyperlink on one website that points to a page on a different website. If a news site links to your guide, that link is a backlink to you. Search engines use backlinks to find new pages and as a signal of how trusted and useful a page is.',
      'Every backlink has two ends. The linking page is the source, and your page is the target. The clickable words are the [anchor text](/glossary/anchor-text), and the HTML can carry attributes such as `rel="nofollow"` or `rel="sponsored"` that tell search engines how to treat the link.',
      'Backlinks are counted in two ways. The total number of links counts every individual link, so a site that links to you from its footer on 5,000 pages gives you 5,000 backlinks. The number of [referring domains](/glossary/referring-domain) counts each linking website once. Referring domains is usually the more useful number, because ten links from ten different sites say far more than ten links from one site.',
      'Not all backlinks are equal. A link from a relevant, well-known page that people actually read and click is worth much more than a link from a page nobody visits. Links buried in footers, sidebars, comment sections or link directories tend to carry little weight. Google has also become good at ignoring links that look manipulative, so a pile of low-quality links usually does nothing at all.',
    ],
    why: [
      'Links were the foundation of Google’s original ranking system, [PageRank](/glossary/pagerank), and Google still lists links among the signals it uses to understand how pages relate and which ones are trusted. For competitive queries, the pages in the top ten nearly always have strong backlink profiles. Good content without links can struggle to rank, while links pointing at weak content rarely keep it at the top for long.',
      'Backlinks also bring referral traffic and help Google discover your pages faster. A link from a popular article can send visitors for years, and those visitors may link to you in turn.',
      'Because links matter, they are also the most abused signal in SEO. Buying links or trading them at scale breaks Google’s spam policies on [link schemes](/glossary/link-schemes). The safe path is to earn links by publishing things people want to cite.',
    ],
    how: {
      heading: 'How to check your backlinks',
      steps: [
        'Run your domain through a backlink checker to see total backlinks, referring domains and the monthly trend of new and lost links.',
        'Sort by the strength of the linking page, not just the linking domain. A strong page on an average site can beat a weak page on a famous one.',
        'Look at which of your pages earn the most links. These show what kind of content attracts citations, so you can make more of it.',
        'Review your anchor text. Most anchors should be your brand name, the bare URL or natural phrases. A high share of exact-match commercial anchors is a red flag.',
        'Compare your profile with the sites that outrank you, and use a link intersect to find sites that link to several competitors but not to you.',
        'Check for [lost backlinks](/glossary/lost-backlinks) every month and reclaim valuable ones that dropped because of a broken page or a redesign.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- On example-news.com, pointing to your site -->\n<p>The <a href="https://yoursite.com/guide/keyword-research">keyword research guide from YourSite</a> explains this well.</p>',
    },
    openseo: {
      body: 'The backlink checker shows backlink totals, referring domains, monthly new and lost links, your strongest backlinks, anchors and top linked pages for any domain or URL.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['referring-domain', 'anchor-text', 'link-building', 'link-equity', 'pagerank', 'link-profile', 'dofollow-link', 'nofollow-link'],
    faqs: [
      {
        question: 'Are backlinks still important for SEO?',
        answer: [
          'Yes. Google still uses links to discover pages and judge how trusted they are, though it weighs them alongside content quality, relevance and many other signals. Quality matters far more than quantity.',
        ],
      },
      {
        question: 'How many backlinks do I need to rank?',
        answer: [
          'There is no fixed number. It depends on the keyword and the sites already ranking. Check the referring domains of the current top ten pages for your target keyword to get a realistic benchmark.',
        ],
      },
      {
        question: 'What is the difference between a backlink and a referring domain?',
        answer: [
          'A backlink is a single link. A referring domain is a website that links to you at least once. One referring domain can give you one backlink or thousands.',
        ],
      },
      {
        question: 'Can bad backlinks hurt my site?',
        answer: [
          'Usually not. Google says it ignores most spammy links on its own. Links become a problem when they are part of a link scheme you built, which can lead to a manual action.',
        ],
      },
    ],
  },
  {
    slug: 'referring-domain',
    term: 'Referring domain',
    aka: ['linking domain', 'ref domain', 'RD'],
    category: 'links',
    short: 'A referring domain is a website that links to your site at least once. Each domain counts once, no matter how many links it sends.',
    definition: [
      'A referring domain is a unique website that has at least one link pointing to your site. If one blog links to you from 40 posts, that is 40 [backlinks](/glossary/backlink) but one referring domain. SEO tools count referring domains to show how many separate sites vouch for you.',
      'Some tools count by root domain (example.com), so blog.example.com and shop.example.com are grouped together. Others count subdomains separately. Tools may also report referring IPs or subnets, which help spot networks of sites that sit on the same hosting and may belong to one owner.',
    ],
    why: [
      'The number of referring domains usually tracks rankings more closely than the raw number of backlinks. Ten different sites linking to you is a stronger signal than one site linking ten times, because each one is a separate editorial decision.',
      'Watching referring domains over time also tells you whether your [link building](/glossary/link-building) is working. A rising line means more sites are discovering and citing you. A sudden spike from many unknown domains can mean spam or a [negative SEO](/glossary/negative-seo) attempt, which Google usually ignores but is worth a look.',
    ],
    how: {
      heading: 'How to get more referring domains',
      steps: [
        'Find the pages on your site that already attract links and create more content of the same kind, such as original data, tools or detailed guides.',
        'Run a [link intersect](/glossary/link-intersect) to find sites that link to two or more competitors but not to you. They already cover your topic.',
        'Pitch new sites rather than chasing extra links from sites that already link to you. A second link from the same domain adds little.',
        'Turn [unlinked brand mentions](/glossary/unlinked-mentions) into links by asking the author to add one.',
      ],
    },
    example: {
      body: 'Site A has 12,000 backlinks from 90 referring domains, mostly sitewide footer links. Site B has 1,800 backlinks from 640 referring domains. Site B almost certainly has the broader, more trusted link profile, even though its backlink count is far lower.',
    },
    openseo: {
      body: 'The backlink checker lists every referring domain with its authority and first-seen date, and shows how the count has changed month by month.',
      href: '/tools/backlink-checker',
      label: 'Check referring domains',
    },
    related: ['backlink', 'link-profile', 'domain-rating', 'link-building', 'link-intersect', 'link-velocity'],
    faqs: [
      {
        question: 'Is it better to have more backlinks or more referring domains?',
        answer: [
          'More referring domains. Links from many different relevant sites are a stronger signal than many links from a handful of sites.',
        ],
      },
      {
        question: 'Do subdomains count as separate referring domains?',
        answer: [
          'It depends on the tool. Many group subdomains under their root domain, while some count each subdomain on its own. Check how your tool counts before comparing numbers across tools.',
        ],
      },
    ],
  },
  {
    slug: 'anchor-text',
    term: 'Anchor text',
    aka: ['link text', 'link label'],
    category: 'links',
    short: 'Anchor text is the visible, clickable text of a link. Search engines read it as a clue to what the linked page is about.',
    definition: [
      'Anchor text is the visible, clickable text of a hyperlink. In `<a href="/rank-tracking">rank tracking guide</a>`, the anchor text is “rank tracking guide”. Search engines use anchor text, along with the words around the link, to understand what the target page is about.',
      'Anchors are usually grouped into a few types. Branded anchors use a company or site name (“OpenSEO”). Exact-match anchors repeat the target keyword word for word (“keyword research tool”). Partial-match anchors include the keyword with other words (“this free keyword research guide”). Naked URLs use the address itself (“openseo.gg”). Generic anchors say nothing about the target (“click here”, “this article”). Image links have no text, so Google uses the image’s [alt text](/glossary/alt-text) instead.',
      'Anchor text matters for both [internal links](/glossary/internal-links) between your own pages and [backlinks](/glossary/backlink) from other sites, but the rules differ. On your own site you control every anchor, and descriptive anchors help both users and search engines. On other sites you mostly do not control the anchor, and that is exactly why a natural mix matters.',
      'A natural backlink profile is mostly branded, URL and generic anchors, because that is how people link when nobody tells them what to write. When a large share of a site’s backlinks use the same commercial keyword, it suggests the links were placed rather than earned.',
      'Search engines also look beyond the anchor itself. The sentence around a link, the heading it sits under and the topic of the linking page all add context. A generic “here” inside a sentence about canonical tags still tells Google something; a keyword anchor in an unrelated footer tells it very little.',
    ],
    why: [
      'Anchor text was one of the earliest signals Google used, from its original research paper onwards. It helps Google match a page to queries, sometimes even for words that do not appear on the page itself.',
      'Because it worked so well, it was heavily abused. Google’s Penguin update in 2012 targeted sites with unnatural, keyword-stuffed anchor profiles, and Google’s [spam policies](/glossary/google-spam-policies) still name links with optimised anchor text in articles, guest posts and press releases as an example of link spam. Over-optimised anchors are one of the clearest footprints of a [link scheme](/glossary/link-schemes).',
      'For internal links, good anchors are a quick, safe win. Linking “see our [rank tracking](/features/keyword-rank-tracker) guide” instead of “click here” tells search engines and screen-reader users exactly where the link goes.',
    ],
    how: {
      heading: 'How to choose anchor text',
      steps: [
        'Describe the target page in a few natural words. A reader should know what they will get before they click.',
        'For internal links, use descriptive anchors that include the topic of the target page. Vary the wording rather than using one exact phrase on every page.',
        'Avoid generic anchors like “click here” or “read more” on their own. They give no context to users or search engines.',
        'Do not ask other sites for exact-match keyword anchors. If someone asks what to link, suggest your brand name or the page title.',
        'Audit your backlink anchors from time to time. If a commercial keyword makes up a large share, find out where those links came from.',
        'Keep anchors short. A full sentence as a link is hard to read and dilutes the signal.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- Descriptive (good) -->\n<a href="/glossary/canonical-tag">how canonical tags work</a>\n\n<!-- Generic (weak) -->\n<a href="/glossary/canonical-tag">click here</a>\n\n<!-- Exact-match, repeated across many sites (a link scheme footprint) -->\n<a href="https://example.com/">best cheap car insurance</a>',
    },
    openseo: {
      body: 'The backlink checker groups every anchor pointing to a domain or URL, so you can see your brand, URL and keyword mix at a glance.',
      href: '/tools/backlink-checker',
      label: 'See your anchor text',
    },
    related: ['backlink', 'internal-links', 'link-schemes', 'link-profile', 'alt-text', 'link-equity'],
    faqs: [
      {
        question: 'Does anchor text still matter?',
        answer: [
          'Yes. Google’s link best practices still ask for descriptive anchor text, and Google uses it to understand linked pages. It matters most for internal links, where you choose the words.',
        ],
      },
      {
        question: 'What is a good anchor text ratio?',
        answer: [
          'There is no official ratio and any exact percentage you read is a rule of thumb. A natural profile is dominated by branded, URL and generic anchors, with exact-match keyword anchors a small minority.',
        ],
      },
      {
        question: 'Can I use the same anchor text for internal links?',
        answer: [
          'Yes, Google does not penalise repeated internal anchors. Varying them is still useful, because different phrasings help match the page to related queries and read more naturally.',
        ],
      },
      {
        question: 'What anchor text does Google use for image links?',
        answer: [
          'For a linked image, Google uses the image’s alt attribute as the anchor text. Give linked images a short, descriptive alt.',
        ],
      },
    ],
  },
  {
    slug: 'dofollow-link',
    term: 'Dofollow link',
    aka: ['followed link', 'follow link'],
    category: 'links',
    short: 'A dofollow link is a normal link with no rel="nofollow", "sponsored" or "ugc" value, so it can pass ranking credit to the page it points to.',
    definition: [
      'A dofollow link is an ordinary hyperlink that has no `rel="nofollow"`, `rel="sponsored"` or `rel="ugc"` value. Search engines can follow it and count it as a vote for the target page, passing [link equity](/glossary/link-equity). “Dofollow” is SEO slang: there is no `rel="dofollow"` attribute in HTML.',
      'Every link is followed by default. You only change that by adding a rel value. So when an SEO tool reports “dofollow backlinks”, it means links that carry none of the qualifying attributes.',
    ],
    why: [
      'Followed links are the ones most likely to influence rankings, which is why link builders prize them. A profile of only [nofollow links](/glossary/nofollow-link) can still bring traffic and help discovery, but followed editorial links are what move positions.',
      'This is also where the rules bite. Google’s spam policies say paid links and links in exchange for goods or services must be qualified with `rel="sponsored"` or `rel="nofollow"`. A followed link that was paid for is a [paid link](/glossary/paid-links) in breach of the policy.',
    ],
    how: {
      heading: 'How to check if a link is dofollow',
      steps: [
        'Right-click the link in your browser and choose Inspect.',
        'Look at the `<a>` tag. If it has no `rel` attribute, or the `rel` value contains none of nofollow, sponsored or ugc, it is followed.',
        'Check the page’s `<meta name="robots">` tag too. A page-level `nofollow` applies to every link on it.',
        'For many links at once, use a backlink checker that labels each link’s attributes.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<!-- Followed ("dofollow") -->\n<a href="https://example.com/">Example</a>\n\n<!-- Still followed: noopener is not a link qualifier -->\n<a href="https://example.com/" rel="noopener">Example</a>\n\n<!-- Not followed -->\n<a href="https://example.com/" rel="nofollow">Example</a>',
    },
    openseo: {
      body: 'The backlink checker marks which of your backlinks are followed and which carry nofollow, sponsored or ugc attributes.',
      href: '/tools/backlink-checker',
      label: 'Check link attributes',
    },
    related: ['nofollow-link', 'sponsored-attribute', 'ugc-attribute', 'link-equity', 'backlink', 'nofollow'],
    faqs: [
      {
        question: 'Is there a rel="dofollow" attribute?',
        answer: [
          'No. Links are followed by default, and “dofollow” is just a name for a link without a qualifying rel value. Adding `rel="dofollow"` does nothing.',
        ],
      },
      {
        question: 'Are dofollow links better than nofollow links?',
        answer: [
          'For rankings, followed editorial links usually carry more weight. Nofollow links still have value for traffic, brand exposure and a natural-looking profile.',
        ],
      },
    ],
  },
  {
    slug: 'nofollow-link',
    term: 'Nofollow link',
    aka: ['rel="nofollow"', 'nofollowed link'],
    category: 'links',
    short: 'A nofollow link carries rel="nofollow", asking search engines not to pass ranking credit. Since 2019 Google treats it as a hint, not a rule.',
    definition: [
      'A nofollow link is a hyperlink with `rel="nofollow"` in its HTML. It tells search engines that the site does not want to vouch for the linked page or pass ranking credit to it. Google introduced nofollow in 2005 to fight blog comment spam.',
      'In September 2019 Google changed how it treats nofollow. It became a hint rather than a directive, meaning Google may still use the link for ranking or discovery if it chooses, and since March 2020 that hint also applies to crawling and indexing. At the same time Google added two more specific values, [rel="sponsored"](/glossary/sponsored-attribute) for paid links and [rel="ugc"](/glossary/ugc-attribute) for user-generated content. Nofollow still works for both.',
      'This page is about nofollow on individual links. A page-level `nofollow` in the [meta robots tag](/glossary/meta-robots-tag) applies to every link on the page; see [nofollow](/glossary/nofollow) for the directive itself.',
    ],
    why: [
      'Nofollow is how you link to something without endorsing it, and it is how you stay inside Google’s rules when a link is paid or untrusted. Many large sites, such as Wikipedia and most social networks, nofollow all outbound links by default.',
      'Nofollow backlinks can still be worth having. They send visitors, put your brand in front of new readers and can lead to followed links from people who discover you. A natural link profile contains plenty of them.',
    ],
    how: {
      heading: 'When to use nofollow',
      steps: [
        'Use `rel="sponsored"` (or nofollow) on any link you were paid for or given something in exchange for, including affiliate links.',
        'Use `rel="ugc"` (or nofollow) on links in comments, forum posts and other content your users add.',
        'Use nofollow when you need to link to a page but do not want to vouch for it, for example a source you are criticising.',
        'Do not nofollow your own [internal links](/glossary/internal-links) to “sculpt” PageRank. It does not save link equity and it can stop Google crawling those pages.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<a href="https://example.com/" rel="nofollow">Example</a>\n\n<!-- Values can be combined -->\n<a href="https://shop.example.com/product" rel="sponsored nofollow">Product</a>',
    },
    openseo: {
      body: 'The backlink checker shows which backlinks are nofollow, so you can see the split between followed and nofollowed links for any domain.',
      href: '/tools/backlink-checker',
      label: 'Check nofollow links',
    },
    related: ['nofollow', 'dofollow-link', 'sponsored-attribute', 'ugc-attribute', 'paid-links', 'comment-spam'],
    faqs: [
      {
        question: 'Do nofollow links help SEO?',
        answer: [
          'Not directly in the way followed links do, but since 2019 Google may use them as a hint. They also bring traffic and visibility that can lead to followed links.',
        ],
      },
      {
        question: 'Does Google follow nofollow links?',
        answer: [
          'It can. Since March 2020 nofollow is a hint for crawling and indexing too, so Google may crawl a nofollowed URL. Use noindex or robots.txt if you need to keep a page out of search.',
        ],
      },
    ],
  },
  {
    slug: 'sponsored-attribute',
    term: 'rel="sponsored"',
    aka: ['sponsored attribute', 'sponsored link attribute'],
    category: 'links',
    short: 'rel="sponsored" is a link attribute that marks a link as paid, sponsored or an affiliate link, so it does not pass ranking credit.',
    definition: [
      '`rel="sponsored"` is an HTML link attribute that tells search engines a link is an advert, a sponsorship, an affiliate link or otherwise given in exchange for payment or something of value. Google introduced it in September 2019 alongside `rel="ugc"`, as a more specific option than `rel="nofollow"`.',
      'Like nofollow, sponsored is treated as a hint. Google says either `sponsored` or `nofollow` is acceptable for paid links, and you can combine them (`rel="sponsored nofollow"`). Existing nofollow paid links do not need changing.',
    ],
    why: [
      'Google’s spam policies say that buying or selling links that pass ranking credit is a [link scheme](/glossary/link-schemes). Marking paid links as sponsored keeps the advert, the affiliate commission or the sponsorship within the rules, because the link no longer tries to influence rankings.',
      'Leaving paid links followed is the core of the [paid links](/glossary/paid-links) problem. Sites that sell followed links risk a manual action that removes their ability to pass link value, and buyers risk a manual action for unnatural links.',
    ],
    how: {
      heading: 'How to use rel="sponsored"',
      steps: [
        'Add `rel="sponsored"` to every affiliate link, sponsored post link, paid placement and advert link.',
        'Apply it to links given in exchange for free products, discounts or other benefits, not just cash.',
        'If your CMS or affiliate plugin adds links automatically, check its settings so new links get the attribute.',
        'Combine with other values where they apply, for example `rel="sponsored noopener"`.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<a href="https://partner.example.com/?ref=you" rel="sponsored">Try Partner</a>',
    },
    related: ['nofollow-link', 'ugc-attribute', 'dofollow-link', 'paid-links', 'link-schemes', 'outbound-links'],
    faqs: [
      {
        question: 'Do affiliate links need rel="sponsored"?',
        answer: [
          'Google asks for affiliate links to be qualified with `rel="sponsored"` or `rel="nofollow"`. Separately, advertising rules in many countries require you to disclose affiliate links to readers.',
        ],
      },
      {
        question: 'Is rel="sponsored" better than rel="nofollow"?',
        answer: [
          'Google prefers sponsored for paid links because it is more specific, but says nofollow is also fine. Neither passes ranking credit as a rule.',
        ],
      },
    ],
  },
  {
    slug: 'ugc-attribute',
    term: 'rel="ugc"',
    aka: ['ugc attribute', 'user-generated content link attribute'],
    category: 'links',
    short: 'rel="ugc" is a link attribute for links inside user-generated content, such as comments and forum posts, signalling the site does not vouch for them.',
    definition: [
      '`rel="ugc"` is an HTML link attribute that marks links inside user-generated content, such as blog comments, forum posts, reviews and community answers. It tells search engines the site owner did not place or vouch for the link. Google introduced it in September 2019, and like nofollow it is treated as a hint.',
      'Google says sites may remove the attribute from links posted by trusted, long-standing members, much as some forums lift restrictions for established users.',
      'The value can be combined with others. A comment link that is also an affiliate link could carry `rel="ugc sponsored"`. Google says you do not need to change existing nofollow links on user content; [nofollow](/glossary/nofollow-link) remains a valid alternative.',
    ],
    why: [
      'Open comment and forum sections attract [comment spam](/glossary/comment-spam): people posting links purely to get backlinks. Qualifying those links with ugc or nofollow removes the reward and protects your site from looking like it links to spam.',
      'If spammers can post followed links on your site at scale, Google may treat that as spam on your site. Google’s spam policies cover spammy user-generated content, and badly moderated sections can drag down how Google views the whole site.',
    ],
    how: {
      heading: 'How to add rel="ugc" to comments',
      steps: [
        'Check your CMS or forum software. Many add nofollow or ugc to comment links by default.',
        'If not, add the attribute in the comment template or with a filter so every user-submitted link gets `rel="ugc"`.',
        'Moderate new comments, and consider blocking links entirely for brand-new accounts.',
        'Run a [site audit](/features/site-audit) occasionally to check that user-generated sections are not full of spam links.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<div class="comment">\n  Great post! I wrote about this too:\n  <a href="https://commenter.example/post" rel="ugc nofollow">my take</a>\n</div>',
    },
    related: ['nofollow-link', 'sponsored-attribute', 'user-generated-content', 'comment-spam', 'dofollow-link'],
    faqs: [
      {
        question: 'Should I use rel="ugc" or rel="nofollow" for comments?',
        answer: [
          'Either works. Google prefers ugc because it is more specific, and you can use both together.',
        ],
      },
      {
        question: 'Do ugc links pass PageRank?',
        answer: [
          'Google treats ugc as a hint, so it generally does not count the link as an endorsement, but it may still use the link in some cases.',
        ],
      },
    ],
  },
  {
    slug: 'link-building',
    term: 'Link building',
    aka: ['link acquisition', 'link earning'],
    category: 'links',
    hat: 'white',
    short: 'Link building is the work of getting other websites to link to yours, to earn referral traffic and the trust that helps pages rank.',
    definition: [
      'Link building is the process of getting other websites to link to pages on your site. Those [backlinks](/glossary/backlink) help search engines discover your pages and judge how trusted they are. Done well, it means creating things worth citing and making sure the right people know about them.',
      'Link building is part of [off-page SEO](/glossary/off-page-seo). The methods range from purely editorial, where links come without any outreach, to active campaigns: pitching data to journalists, fixing broken links on other sites, contributing expert quotes, and asking people who mention you to add a link.',
      'There is a clear line between earning links and manufacturing them. Google’s spam policies describe [link schemes](/glossary/link-schemes) as links intended to manipulate rankings, and list buying or selling links, excessive link exchanges, automated link creation and links with optimised anchor text in articles and guest posts distributed at scale. White hat link building stays on the right side of that line: the link exists because someone chose to cite you, not because you paid or traded for it.',
      'Most effective link building comes down to two things. First, a linkable asset: something on your site that another writer genuinely benefits from citing, such as original research, a free tool, a definitive guide, or a clear explanation of a hard topic. Second, distribution: getting that asset in front of the people who write about the subject. Neither works well alone. A great asset nobody sees earns nothing, and outreach for a weak page is just spam.',
      'Common white hat methods include [digital PR](/glossary/digital-pr), [broken link building](/glossary/broken-link-building), [link reclamation](/glossary/link-reclamation), turning [unlinked brand mentions](/glossary/unlinked-mentions) into links, responding to journalist requests, and the [skyscraper technique](/glossary/skyscraper-technique). Some popular methods, such as [guest posting](/glossary/guest-posting) and [niche edits](/glossary/niche-edits), are grey: fine in some forms, a link scheme in others.',
    ],
    why: [
      'Links remain one of the strongest signals for competitive rankings. When two pages are equally relevant and useful, the one more trusted sites cite usually wins. For new sites in particular, a lack of links is often what holds rankings back.',
      'Good link building does more than move rankings. A link from a well-read article sends referral visitors, builds brand awareness, and often leads to more links as other writers find you through it. Links earned this way are also durable, because they sit on pages that stay live.',
      'Bad link building is one of the fastest ways into trouble. Bought links, private blog networks and mass-produced guest posts can trigger a [manual action](/glossary/manual-action) for unnatural links, and Google’s SpamBrain system is designed to detect and neutralise link spam. At best you waste money on links Google ignores. At worst you lose rankings and spend months cleaning up.',
    ],
    how: {
      heading: 'How to build backlinks the safe way',
      steps: [
        'Benchmark first. Check the referring domains of the pages ranking for your target keywords, so you know how many links a page realistically needs.',
        'Find what already earns links in your niche. Look at your competitors’ most-linked pages: they show which formats (data, tools, guides) attract citations.',
        'Create a linkable asset that is better or more original than what exists: new data, a free tool, a clear guide, or expert commentary nobody else has.',
        'Build a target list of relevant sites: those linking to competitors (a link intersect), journalists covering your topic, and pages with broken links to similar resources.',
        'Write short, personal outreach that explains why the link helps their readers. Do not ask for specific keyword anchors and do not offer payment.',
        'Reclaim what you already have: fix broken pages that used to earn links, redirect old URLs, and ask sites that mention you without linking to add one.',
        'Track results monthly: new and lost referring domains, which pages gained links, and whether rankings for the target pages moved.',
        'Keep everything you could explain to a Google reviewer. If a link only exists because money changed hands, it should be marked `rel="sponsored"`.',
      ],
    },
    example: {
      body: 'A bike-shop chain publishes a yearly study of bike theft by city, using police data. Local newspapers and cycling blogs cover the findings and link to the study page. Internal links from the study pass some of that authority to the shop’s service and product pages. No link was bought, and every link sits in a relevant article.',
    },
    openseo: {
      body: 'The backlink checker shows your competitors’ strongest backlinks and top linked pages, and its link intersect finds sites that link to them but not you. The [competitors tool](/tools/seo-competitor-analysis) helps you pick which sites to benchmark against.',
      href: '/tools/backlink-checker',
      label: 'Find link opportunities',
    },
    related: ['backlink', 'referring-domain', 'digital-pr', 'broken-link-building', 'link-reclamation', 'link-schemes', 'off-page-seo', 'white-hat-seo'],
    faqs: [
      {
        question: 'Is link building against Google’s guidelines?',
        answer: [
          'No. Earning links by creating useful content and telling people about it is fine. What breaks Google’s policies is manipulating links: buying or selling them, excessive exchanges, automated links, and keyword-rich links placed at scale.',
        ],
      },
      {
        question: 'How long does link building take to work?',
        answer: [
          'Usually weeks to months. Google needs to crawl the linking pages, and the effect on rankings builds up over time. Be wary of anyone promising results in days.',
        ],
      },
      {
        question: 'Is it safe to buy backlinks?',
        answer: [
          'No. Buying links that pass ranking credit is a link scheme under Google’s spam policies and can lead to a manual action. Paid placements are fine only if the link is marked `rel="sponsored"` or `rel="nofollow"`.',
        ],
      },
      {
        question: 'What is the easiest way to get backlinks?',
        answer: [
          'Link reclamation and unlinked mentions are usually the quickest wins, because the site already knows and likes you. After that, original data and helpful tools tend to earn links with the least effort per link.',
        ],
      },
    ],
  },
  {
    slug: 'link-equity',
    term: 'Link equity (link juice)',
    aka: ['link juice', 'link value', 'link authority'],
    category: 'links',
    short: 'Link equity, or link juice, is the ranking value a link passes from one page to another, based on the linking page’s authority and relevance.',
    definition: [
      'Link equity is the ranking value a link passes from the linking page to the page it points to. “Link juice” is the informal name. A link from a trusted, relevant page that itself has many links passes more equity than a link from a weak or unrelated page. The idea comes from Google’s [PageRank](/glossary/pagerank).',
      'Link equity is not a number Google publishes. It is a way of thinking about which links help most. Factors that seem to affect it include the authority of the linking page, how relevant it is to your page, where the link sits (in the main content or a footer), how many other links share the page, and whether the link is followed or carries [nofollow](/glossary/nofollow-link), sponsored or ugc.',
      'Equity also flows inside your own site. Your homepage usually holds the most, and [internal links](/glossary/internal-links) spread it to deeper pages. Pages with no internal links, known as [orphan pages](/glossary/orphan-page), receive none.',
    ],
    why: [
      'Thinking in terms of equity explains why one link from a respected industry site can matter more than a hundred directory links, and why where you point your internal links matters. Pages that earn backlinks can pass value to the commercial pages that rarely attract links on their own.',
      'It also explains why broken pages and redirects matter. A backlink to a URL that now returns a 404 passes nothing. A [301 redirect](/glossary/301-redirect) to a relevant replacement page lets that link keep counting.',
    ],
    how: {
      heading: 'How to make the most of link equity',
      steps: [
        'Find your most-linked pages and link from them to the important pages you want to rank.',
        'Redirect old or deleted URLs that still have backlinks to the closest relevant page with a 301.',
        'Fix internal links that go through [redirect chains](/glossary/redirect-chain), and link straight to the final URL.',
        'Keep important pages within a few clicks of the homepage, so internal equity reaches them.',
        'Do not nofollow internal links to try to sculpt equity. Google stopped redistributing that value long ago, so it is simply lost.',
      ],
    },
    example: {
      body: 'Your free “SEO checklist” page has links from 80 referring domains, but your paid audit service page has three. Adding a clear internal link from the checklist to the audit page passes some of the checklist’s equity to a page that would rarely earn links itself.',
    },
    openseo: {
      body: 'The backlink checker shows your top linked pages, so you know which pages hold the most link equity and are best placed to pass it on through internal links.',
      href: '/tools/backlink-checker',
      label: 'Find your top linked pages',
    },
    related: ['pagerank', 'backlink', 'internal-links', 'dofollow-link', '301-redirect', 'url-rating'],
    faqs: [
      {
        question: 'Does nofollow pass link juice?',
        answer: [
          'As a rule, no. Since 2019 Google treats nofollow as a hint, so it may sometimes use the link, but you should not count on nofollow links passing equity.',
        ],
      },
      {
        question: 'Do 301 redirects lose link equity?',
        answer: [
          'Google has said 301 and other server-side redirects do not lose PageRank. Redirect to a relevant page, though: redirecting everything to the homepage may be treated like a soft 404.',
        ],
      },
    ],
  },
  {
    slug: 'pagerank',
    term: 'PageRank',
    aka: ['PR', 'Google PageRank', 'toolbar PageRank'],
    category: 'links',
    short: 'PageRank is Google’s original algorithm for scoring pages by the number and quality of links pointing to them. Google still uses a version of it.',
    definition: [
      'PageRank is an algorithm, developed by Google founders Larry Page and Sergey Brin at Stanford in the late 1990s, that scores the importance of web pages from the links between them. A page is important if important pages link to it. PageRank was the core idea behind Google’s early ranking and is named after Larry Page.',
      'The model imagines a “random surfer” who clicks links at random and, every so often, jumps to a random page instead. A page’s PageRank is the probability that the surfer lands on it. In the original paper, the chance of following a link rather than jumping, called the damping factor, was set at 0.85. Each page splits its PageRank across the links on it, so a link from a page with few outbound links passes more than one from a page with hundreds.',
      'From 2000 Google showed a 0 to 10 PageRank score in its browser toolbar. That “toolbar PageRank” was updated less and less often, and Google removed it in 2016. Its removal did not mean PageRank stopped mattering. Google has since said it still uses PageRank internally, though the modern version has changed a great deal from the original paper and is one signal among hundreds.',
      'Because toolbar PageRank is gone, SEO tools built their own estimates of link authority, such as Ahrefs’ [Domain Rating](/glossary/domain-rating) and [URL Rating](/glossary/url-rating) and Moz’s [Domain Authority](/glossary/domain-authority). These are third-party metrics modelled on similar ideas. Google does not use them.',
    ],
    why: [
      'PageRank is why links matter in SEO at all. It turned the web’s link graph into a measure of trust, and nearly every link-building practice, good or bad, traces back to it.',
      'It also explains several things that still hold. Links from strong pages are worth more than links from weak ones. A page that links out to hundreds of sites passes little to each. Internal links distribute authority around your own site. And links Google decides not to trust, such as nofollow, sponsored or spam links, may pass nothing.',
      'When PageRank was visible, people traded and sold links by their PR score, which led directly to nofollow, Google’s rules on [paid links](/glossary/paid-links) and the Penguin update. Today the safe takeaway is simple: earn links from pages that are themselves trusted and relevant.',
      'PageRank also shaped how Google treats link attributes. When Google introduced nofollow in 2005, the point was to let sites link without passing PageRank. Some SEOs then nofollowed their own internal links to push PageRank towards chosen pages, a practice called PageRank sculpting. Google changed how it handled this in 2009 so that the value of a nofollowed link is simply lost rather than redistributed, which ended sculpting as a tactic.',
    ],
    how: {
      heading: 'How to apply PageRank thinking today',
      steps: [
        'Prioritise links from pages that have their own backlinks and traffic, not just from big domains.',
        'Prefer links in the main content of a relevant page over links in footers, sidebars or long lists of links.',
        'Use internal links to send authority from your most-linked pages to the pages you want to rank.',
        'Keep important pages shallow in your [site architecture](/glossary/site-architecture), so authority reaches them in a few hops.',
        'Ignore anyone selling “high PR” links. Toolbar PageRank has not existed since 2016, and selling followed links breaks Google’s policies.',
      ],
    },
    example: {
      label: 'Simplified PageRank formula (original paper)',
      code: 'PR(A) = (1 - d) + d × ( PR(T1)/C(T1) + ... + PR(Tn)/C(Tn) )\n\nd     = damping factor, usually 0.85\nT1…Tn = pages that link to A\nC(T)  = number of outbound links on page T',
    },
    openseo: {
      body: 'OpenSEO’s backlink and page tools show authority scores for domains and URLs, which are third-party estimates of link strength in the spirit of PageRank.',
      href: '/tools/on-page-seo-audit',
      label: 'Analyse a page’s links',
    },
    related: ['link-equity', 'backlink', 'domain-rating', 'url-rating', 'domain-authority', 'search-algorithm', 'internal-links'],
    faqs: [
      {
        question: 'Does Google still use PageRank?',
        answer: [
          'Yes. Google has said it still uses PageRank as one of many ranking signals, though the current version differs from the original algorithm and the score is no longer public.',
        ],
      },
      {
        question: 'How can I check my PageRank?',
        answer: [
          'You cannot. Google removed public toolbar PageRank in 2016. Tools offer their own estimates, such as Ahrefs’ Domain Rating or Moz’s Domain Authority, but these are not Google’s scores.',
        ],
      },
      {
        question: 'Is PageRank the same as Domain Authority?',
        answer: [
          'No. PageRank is Google’s own internal, page-level algorithm. Domain Authority is a score made by Moz to estimate ranking potential, and Google does not use it.',
        ],
      },
      {
        question: 'Who invented PageRank?',
        answer: [
          'Larry Page and Sergey Brin, as part of their research at Stanford University that became Google. The name refers to Larry Page as well as to web pages.',
        ],
      },
    ],
  },
  {
    slug: 'domain-rating',
    term: 'Domain Rating (DR)',
    aka: ['DR', 'Ahrefs DR'],
    category: 'links',
    short: 'Domain Rating (DR) is Ahrefs’ 0–100 score of the strength of a website’s backlink profile. It is a third-party metric, not used by Google.',
    definition: [
      'Domain Rating (DR) is a metric created by Ahrefs that scores the strength of a website’s backlink profile on a scale from 0 to 100. It is based on how many unique domains link to the site and how strong those linking domains are. Higher means a stronger link profile. Google does not use DR.',
      'The scale is logarithmic, so moving from 70 to 80 takes far more links than moving from 10 to 20. DR is also relative: as the web and the strongest sites grow, a site’s score can drift down even if its own links stay the same. DR measures the whole domain; the page-level counterpart is [URL Rating](/glossary/url-rating).',
    ],
    why: [
      'DR is a quick way to compare link strength between sites, to size up how hard a competitor will be to outrank, and to sort link prospects. It roughly reflects the same idea as [PageRank](/glossary/pagerank): links from strong sites count more.',
      'It is easy to over-trust. DR says nothing about relevance, traffic or whether the site is spam, and it can be inflated with manipulative links. Some people sell links from sites with high DR and no real audience. Use it as one input, not a goal.',
    ],
    how: {
      heading: 'How to use Domain Rating',
      steps: [
        'Compare your DR with the sites ranking for your target keywords to gauge competition, alongside their page-level links.',
        'When judging a link prospect, check its real organic traffic and topic, not just DR.',
        'Track your own DR as a long-term trend, not a weekly target.',
      ],
    },
    openseo: {
      body: 'The website authority checker shows the Domain Rating, referring domains and backlinks of up to 10 sites side by side, so you judge a site against its competitors rather than on one number.',
      href: '/tools/website-authority-checker',
      label: 'Check Domain Rating',
    },
    related: ['url-rating', 'domain-authority', 'pagerank', 'referring-domain', 'link-profile'],
    faqs: [
      {
        question: 'Does Google use Domain Rating?',
        answer: [
          'No. DR is Ahrefs’ own metric. Google has said it does not use any “domain authority” style score from third-party tools.',
        ],
      },
      {
        question: 'What is a good Domain Rating?',
        answer: [
          'It depends on your niche. What matters is how you compare with the sites ranking for your keywords, not an absolute number.',
        ],
      },
    ],
  },
  {
    slug: 'url-rating',
    term: 'URL Rating (UR)',
    aka: ['UR', 'Ahrefs UR'],
    category: 'links',
    short: 'URL Rating (UR) is Ahrefs’ 0–100 score of the strength of one page’s backlink profile, including internal and external links.',
    definition: [
      'URL Rating (UR) is a metric created by Ahrefs that scores the strength of a single page’s backlink profile on a 0 to 100 logarithmic scale. Unlike [Domain Rating](/glossary/domain-rating), it looks at one URL, and it counts both external backlinks and internal links. It is a third-party estimate, not a Google score.',
      'UR is closer in spirit to the original [PageRank](/glossary/pagerank), which also scored individual pages rather than whole sites. Two pages on the same domain can have very different UR: a heavily linked study might be far stronger than a product page buried in the site.',
    ],
    why: [
      'Rankings are earned by pages, not domains. A page with strong links on a modest site can outrank a weak page on a famous one. UR helps you see that, both when you size up the current top ten for a keyword and when you choose which of your pages to link from internally.',
      'For link building, UR shows which specific page will pass the most value. A link from a strong page on a medium site can be worth more than a link from a fresh, unlinked page on a big one.',
    ],
    how: {
      heading: 'How to use URL Rating',
      steps: [
        'Check the UR of the pages ranking for your target keyword to see how much page-level link strength you are up against.',
        'Find your own highest-UR pages and add internal links from them to pages you want to boost.',
        'When comparing link prospects, look at the UR of the exact page that would link to you.',
      ],
    },
    openseo: {
      body: 'The page analyser shows a page’s URL Rating alongside its links, traffic, ranking keywords and strongest backlinks.',
      href: '/tools/on-page-seo-audit',
      label: 'Analyse a page',
    },
    related: ['domain-rating', 'pagerank', 'link-equity', 'backlink', 'internal-links'],
    faqs: [
      {
        question: 'What is the difference between DR and UR?',
        answer: [
          'DR scores a whole domain’s backlink profile. UR scores one page and includes internal links. Both are Ahrefs metrics.',
        ],
      },
      {
        question: 'Is URL Rating a Google ranking factor?',
        answer: [
          'No. Google does not use UR. It is a tool estimate of link strength that tends to correlate with how well a page’s links support it.',
        ],
      },
    ],
  },
  {
    slug: 'domain-authority',
    term: 'Domain Authority (DA)',
    aka: ['DA', 'Moz DA', 'Moz Domain Authority'],
    category: 'links',
    short: 'Domain Authority (DA) is Moz’s 1–100 score predicting how well a website might rank, based mainly on its links. Google does not use it.',
    definition: [
      'Domain Authority (DA) is a metric created by Moz that predicts how likely a website is to rank in search results, on a scale from 1 to 100. It is calculated by a machine-learning model that uses link data, such as the number and quality of linking root domains. It is a third-party score and is not used by Google.',
      'Like other link-based scores, DA is logarithmic and relative. It is easier to grow from 20 to 30 than from 70 to 80, and scores can shift when Moz updates its model or link index. Moz also has a page-level counterpart, Page Authority. Because tools use different link indexes and formulas, DA is not directly comparable with Ahrefs’ [Domain Rating](/glossary/domain-rating).',
    ],
    why: [
      'DA is widely quoted, especially in outreach and when people sell links, so it helps to know what it is and is not. It is useful for comparing your site with competitors using the same tool. It is not a measure of quality, relevance or trust from Google’s side.',
      'Google’s representatives have said many times that Google has no “domain authority” score of the kind tools publish. Chasing a higher DA by acquiring low-quality links misses the point and can put you on the wrong side of [link scheme](/glossary/link-schemes) rules.',
    ],
    how: {
      heading: 'How to use Domain Authority',
      steps: [
        'Compare DA only between sites measured with the same tool.',
        'Treat DA as a rough filter for link prospects, then check relevance and real traffic.',
        'Ignore offers that sell links by DA. A high score with no real audience is a common sign of a link network.',
      ],
    },
    openseo: {
      body: 'The website authority checker compares the authority of up to 10 sites, and the domain overview puts one site’s authority next to its traffic and keywords, so you can see whether a strong score comes with a real audience.',
      href: '/tools/website-authority-checker',
      label: 'Check website authority',
    },
    related: ['domain-rating', 'url-rating', 'pagerank', 'link-profile', 'private-blog-network'],
    faqs: [
      {
        question: 'Does Google use Domain Authority?',
        answer: [
          'No. DA is Moz’s metric. Google has said it does not use a site-wide authority score like DA or DR.',
        ],
      },
      {
        question: 'How do I increase my Domain Authority?',
        answer: [
          'Earn links from more relevant, trusted websites. DA rises as a side effect of the same work that helps rankings, so focus on that rather than the score itself.',
        ],
      },
    ],
  },
  {
    slug: 'link-profile',
    term: 'Link profile',
    aka: ['backlink profile'],
    category: 'links',
    short: 'A link profile is the full set of backlinks pointing to a site: who links, how many, with what anchors and attributes, and how it changes over time.',
    definition: [
      'A link profile, or backlink profile, is the complete set of [backlinks](/glossary/backlink) pointing to a website or page. It covers how many links and [referring domains](/glossary/referring-domain) there are, how strong and relevant the linking sites are, which anchor texts they use, the mix of followed and nofollowed links, and how all of this changes over time.',
      'A natural profile tends to look varied. Links come from sites of all sizes, mostly in your topic area, with anchors dominated by your brand and URLs. An unnatural profile often has a footprint: lots of links from unrelated sites, the same commercial anchor repeated, sudden bursts from new domains, or links from networks of sites with no real audience.',
    ],
    why: [
      'Your link profile is how search engines see your reputation across the web. A strong, relevant profile supports rankings for competitive keywords. A profile full of manipulative links can lead to a [manual action](/glossary/manual-action) if you built them, or simply to links Google ignores.',
      'Comparing link profiles is also one of the clearest ways to see why a competitor outranks you, and what kind of links you would need to catch up.',
    ],
    how: {
      heading: 'How to analyse a link profile',
      steps: [
        'Start with totals and trends: referring domains over time, and new and lost links each month.',
        'Check the strongest backlinks and the pages they point to.',
        'Review the [anchor text](/glossary/anchor-text) mix for over-optimised commercial anchors.',
        'Look at the share of followed versus nofollowed links and at link types (editorial, directory, forum, sitewide).',
        'Compare with two or three competitors who rank above you.',
        'Note anything that looks like a scheme you or a past agency built. That, not random spam, is what needs cleaning up.',
      ],
    },
    openseo: {
      body: 'The backlink checker covers the whole link profile in one place: totals, monthly history, strongest links, referring domains, anchors, top linked pages and link intersect.',
      href: '/tools/backlink-checker',
      label: 'Analyse a link profile',
    },
    related: ['backlink', 'referring-domain', 'anchor-text', 'toxic-backlinks', 'link-velocity', 'lost-backlinks'],
    faqs: [
      {
        question: 'What is a healthy backlink profile?',
        answer: [
          'One with links from a range of relevant, real websites, a natural anchor mix led by branded and URL anchors, and steady growth rather than sudden unexplained spikes.',
        ],
      },
      {
        question: 'How often should I check my link profile?',
        answer: [
          'Monthly is enough for most sites. Check sooner after a sudden ranking drop or a manual action notice in Search Console.',
        ],
      },
    ],
  },
  {
    slug: 'toxic-backlinks',
    term: 'Toxic backlinks',
    aka: ['spammy backlinks', 'bad backlinks', 'unnatural links'],
    category: 'links',
    short: 'Toxic backlinks are low-quality or manipulative links to your site. Google ignores most of them; only links from schemes you built tend to need action.',
    definition: [
      'Toxic backlinks is an SEO-tool term for links that look spammy or manipulative, such as links from link farms, hacked pages, scraper sites or unrelated foreign-language directories. The idea is that they could harm your rankings. Google does not use the term, and in most cases it simply ignores links like these.',
      '“Toxic score” or “spam score” numbers come from third-party tools, each with its own formula. They flag patterns, not proof. Many links they mark as toxic are normal for any site that has been online a while, such as scrapers copying your content or automated stats pages listing your domain.',
      'Google’s view is that it is good at recognising and discounting spammy links on its own, and that most sites never need to act on them. Its link spam updates, powered by SpamBrain, aim to neutralise the value of spam links rather than punish the site they point to. The links that can genuinely cause problems are ones that form a pattern of manipulation for your benefit: links you, or an agency on your behalf, bought, exchanged or placed at scale. Those can lead to a [manual action](/glossary/manual-action) for unnatural links.',
    ],
    why: [
      'Misunderstanding toxic links leads to wasted effort and real damage. People pay for cleanup services and disavow hundreds of harmless, or even useful, links because a tool flagged them, and gain nothing in return.',
      'On the other hand, if your site has a history of [paid links](/glossary/paid-links) or [private blog network](/glossary/private-blog-network) links, ignoring them is a risk. Knowing the difference is what matters.',
    ],
    how: {
      heading: 'How to deal with toxic backlinks',
      steps: [
        'Check Search Console for a manual action under Security & Manual Actions. If there is none, you are very unlikely to need to do anything about random spam links.',
        'Ask whether anyone ever bought or built links for the site. If so, list those links: they are the real risk, not scrapers.',
        'Try to have manipulative links you control removed, by contacting the site or cancelling the paid placement.',
        'Use the [disavow tool](/glossary/disavow) only for links you could not remove that are part of a scheme, or when you have a manual action.',
        'If you see a sudden flood of spam links you did not build, note it and keep monitoring. Google usually ignores [negative SEO](/glossary/negative-seo) attempts.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows referring domains with their authority, anchors and first-seen dates, so you can spot unnatural patterns such as bursts of links with commercial anchors.',
      href: '/tools/backlink-checker',
      label: 'Review your backlinks',
    },
    related: ['disavow', 'link-schemes', 'negative-seo', 'manual-action', 'link-profile', 'spambrain'],
    faqs: [
      {
        question: 'Do toxic backlinks hurt rankings?',
        answer: [
          'Usually not. Google says it ignores most spammy links automatically. Links can hurt when they are part of a link scheme built to manipulate rankings, which can lead to a manual action.',
        ],
      },
      {
        question: 'Should I disavow toxic backlinks?',
        answer: [
          'Most sites should not. Google recommends the disavow tool only if you have a manual action for unnatural links, or many manipulative links you built and cannot remove.',
        ],
      },
      {
        question: 'Is “toxic score” a Google metric?',
        answer: [
          'No. Toxic and spam scores are made by SEO tools. Google does not publish a link toxicity score.',
        ],
      },
    ],
  },
  {
    slug: 'disavow',
    term: 'Disavow tool',
    aka: ['disavow links', 'disavow file', 'Google disavow'],
    category: 'links',
    short: 'The disavow tool lets you ask Google to ignore specific links to your site. Google says most sites never need it and it can harm if misused.',
    definition: [
      'The disavow tool is a Google Search Console feature that lets you upload a list of links or domains you want Google to ignore when it assesses your site. Google introduced it in 2012. It is meant for links you cannot get removed that are part of a [link scheme](/glossary/link-schemes), and Google says most sites will never need it.',
      'You upload a plain text file, encoded in UTF-8 or 7-bit ASCII, with one URL or one `domain:` entry per line and optional comment lines starting with `#`. Disavowing is a strong suggestion rather than an instant switch: Google needs to recrawl the linking pages before the change takes effect, which can take weeks. Uploading a new file replaces the old one, so always keep the full list.',
    ],
    why: [
      'Google’s own guidance is that you should disavow only if you have a large number of spammy, artificial or low-quality links pointing to your site, and those links have caused a [manual action](/glossary/manual-action), or you are confident they will. In most cases, Google says, it can work out which links to trust without your help.',
      'Using the tool carelessly can do more harm than good. Disavowing good links removes their value, and Google labels it an advanced feature to use with caution. It is also not a fix for ranking drops caused by content quality or core updates.',
    ],
    how: {
      heading: 'How to disavow links',
      steps: [
        'Confirm you need to. Check for a manual action for unnatural links in Search Console, or a known history of bought or schemed links.',
        'Try to get the bad links removed first by contacting site owners. Record what you tried, especially if you will file a [reconsideration request](/glossary/reconsideration-request).',
        'Build the file: one URL or `domain:example.com` per line. Use domain entries for sites where every link is bad.',
        'Open the disavow links tool for your Search Console property, select the property and upload the file.',
        'If you had a manual action, file a reconsideration request explaining what you removed and disavowed.',
        'Keep the file. To change it later, edit and re-upload the complete list.',
      ],
    },
    example: {
      label: 'disavow.txt',
      code: '# Paid links from a 2021 campaign, removal requests ignored\ndomain:spammy-network-example.com\ndomain:cheap-links-example.net\n\n# Single pages we could not get changed\nhttps://blog.example.org/sponsored-post-2021/',
    },
    openseo: {
      body: 'Use the backlink checker to list referring domains and anchors when you need to identify which links came from an old campaign.',
      href: '/tools/backlink-checker',
      label: 'List your backlinks',
    },
    related: ['toxic-backlinks', 'manual-action', 'link-schemes', 'reconsideration-request', 'google-penalty-recovery', 'google-search-console'],
    faqs: [
      {
        question: 'Do I need to disavow spam links?',
        answer: [
          'Probably not. Google says most sites do not need the disavow tool, because it already ignores most spammy links. It is for manual actions and link schemes you cannot undo.',
        ],
      },
      {
        question: 'How long does a disavow take to work?',
        answer: [
          'Google processes the file as it recrawls the linking pages, which can take several weeks or longer.',
        ],
      },
      {
        question: 'Can disavowing hurt my rankings?',
        answer: [
          'Yes, if you disavow links that were helping you. Google treats disavowed links as if they do not count, so be sure before you add good domains.',
        ],
      },
    ],
  },
  {
    slug: 'broken-link-building',
    term: 'Broken link building',
    aka: ['dead link building', 'broken link outreach'],
    category: 'links',
    hat: 'white',
    short: 'Broken link building means finding broken links on other sites and suggesting your relevant page as the replacement. It is a white hat tactic.',
    definition: [
      'Broken link building is a link-building tactic where you find links on other websites that point to pages that no longer exist, then contact the site owner to suggest your own relevant page as a replacement. It helps the site fix a [404 error](/glossary/404-error) for its readers and earns you a link.',
      'There are two common ways in. One is to scan resource pages in your niche for dead outbound links. The other is to find a dead page on a competitor’s or defunct site that still has many backlinks, recreate a better version of its content, and tell every site that linked to the old page.',
    ],
    why: [
      'It works because it offers real value, which makes it a solid part of any [link building](/glossary/link-building) plan. Broken links frustrate readers and make pages look neglected, so many editors are happy to swap in a working alternative. It stays within Google’s guidelines, because the site owner chooses to link on merit and nothing is paid.',
      'The replacement page has to genuinely match what the old link promised. If it does not, the outreach is just a cold pitch and response rates drop sharply.',
    ],
    how: {
      heading: 'How to do broken link building',
      steps: [
        'Find dead pages with backlinks: look up competitors’ or industry sites’ pages that return 404 but still have [referring domains](/glossary/referring-domain).',
        'Check what the dead page offered, using a web archive if needed.',
        'Make sure you have a page that covers the same topic as well or better. Create or update one if not.',
        'List the sites still linking to the dead page and find the right contact for each.',
        'Send a short note: name the page, the broken link and your suggested replacement. Keep it helpful, not pushy.',
        'Follow up once, then move on.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows the top linked pages of any domain, so you can find competitor pages with many backlinks, then check which are now dead.',
      href: '/tools/backlink-checker',
      label: 'Find linked pages',
    },
    related: ['link-building', 'link-reclamation', '404-error', 'outbound-links', 'skyscraper-technique', 'white-hat-seo'],
    faqs: [
      {
        question: 'Is broken link building still effective?',
        answer: [
          'Yes, when the replacement is genuinely relevant. Generic pitches to sites with any broken link work poorly; targeted pitches for a close match work much better.',
        ],
      },
      {
        question: 'Is broken link building white hat?',
        answer: [
          'Yes. You are suggesting a useful fix and the site owner decides whether to link. It only becomes a problem if you pay for the replacement link and it is not marked sponsored.',
        ],
      },
    ],
  },
  {
    slug: 'guest-posting',
    term: 'Guest posting',
    aka: ['guest blogging', 'guest post'],
    category: 'links',
    hat: 'grey',
    risks: [
      'A manual action for unnatural links if Google sees a pattern of guest posts built for links, especially with keyword-rich anchors.',
      'Links from guest-post farms being ignored by SpamBrain, so the time or money spent earns nothing.',
      'Your brand appearing on low-quality sites that sell posts to anyone, which can hurt your reputation with readers.',
      'Wasted spend if you pay for posts on sites that later get penalised or deindexed.',
    ],
    short: 'Guest posting is writing an article for another site, often with a link back. It is fine for exposure; done at scale for links, it is a link scheme.',
    definition: [
      'Guest posting is writing an article published on someone else’s website under your name, usually with a bio and a link back to your site. It can build your reputation and reach a new audience. It is grey hat, because the same activity, done mainly for links and at scale, is a [link scheme](/glossary/link-schemes) under Google’s spam policies.',
      'Google warned about this directly in 2017, saying that large-scale article campaigns with keyword-rich links break its guidelines, and its spam policies list links with optimised anchor text in articles and guest posts distributed on other sites as link spam. Google also suggests that links in guest posts written mainly for the link should be qualified with `rel="nofollow"` or `rel="sponsored"`.',
    ],
    why: [
      'Where the line falls: one well-researched article for a respected publication in your field, written to share expertise, with a natural brand or bio link, is ordinary publishing. It tips into spam when you write many thin posts for unrelated sites, use exact-match commercial anchors, pay for placement on sites that publish anyone’s posts (which makes them [paid links](/glossary/paid-links)), or pay with the same article spun across many blogs.',
      'A simple test: would you still want to write this post if the link were nofollow? If the only value is the followed link, Google is likely to see it the same way. Many “write for us” sites exist mostly to sell posts, and their links carry little weight.',
    ],
    how: {
      heading: 'How to guest post without risking a penalty',
      steps: [
        'Write only for sites that are relevant to your field and have a real readership.',
        'Pitch genuinely useful content, the kind you would publish on your own site.',
        'Keep links natural: a brand or author bio link, plus in-content links only where they help the reader.',
        'Never ask for exact-match commercial anchor text.',
        'Do not pay for placement. If money or goods change hands, the link must be marked `rel="sponsored"`.',
        'Keep volume modest. A handful of strong posts beats dozens of weak ones.',
      ],
    },
    example: {
      body: 'Fine: a security engineer writes a detailed explainer for a well-known developer blog, with an author bio linking to her company. Link scheme: an agency publishes 50 near-identical 600-word posts on unrelated “write for us” blogs, each paid for and each linking to the client with the anchor “best personal injury lawyer”.',
    },
    openseo: {
      body: 'Check a prospective site’s real traffic, keywords and links in the domain overview before you write for it.',
      href: '/tools/website-seo-analysis',
      label: 'Vet a guest post site',
    },
    related: ['link-building', 'link-schemes', 'paid-links', 'anchor-text', 'digital-pr', 'grey-hat-seo'],
    faqs: [
      {
        question: 'Is guest posting bad for SEO?',
        answer: [
          'Not in itself. Writing for relevant publications to share expertise is fine. It becomes a link scheme when done at scale for links, with keyword-rich anchors or paid placement.',
        ],
      },
      {
        question: 'Should guest post links be nofollow?',
        answer: [
          'Google suggests nofollow or sponsored for links in guest posts written mainly to gain links. A natural author bio link on an editorially chosen post is a grey area most editors decide themselves.',
        ],
      },
      {
        question: 'Are paid guest posts allowed?',
        answer: [
          'Only if the links are marked `rel="sponsored"` or `rel="nofollow"`. A paid guest post with a followed link is a paid link under Google’s spam policies.',
        ],
      },
    ],
  },
  {
    slug: 'digital-pr',
    term: 'Digital PR',
    aka: ['digital public relations', 'link-building PR'],
    category: 'links',
    hat: 'white',
    short: 'Digital PR is earning coverage and links from news sites, blogs and online publications by giving journalists stories, data or expert comment.',
    definition: [
      'Digital PR is the practice of earning coverage, brand mentions and links from online publications by giving journalists and writers something newsworthy: original research, data stories, expert commentary, tools or creative campaigns. It combines traditional public relations with SEO goals such as [backlinks](/glossary/backlink) from authoritative, relevant sites.',
      'Typical campaigns include survey or data studies, indexes ranking cities or products, reactive commentary on breaking news, expert quotes for journalist requests, and interactive tools. Success is measured in coverage, links and [brand mentions](/glossary/brand-mentions), and increasingly in visibility in AI answers, which often cite the same publications.',
    ],
    why: [
      'Links from news and major publications are among the hardest to get and the most valuable, because they are editorial and come from trusted sites. Digital PR is one of the few reliable ways to earn them at any scale without breaking Google’s rules.',
      'It also builds things links alone do not: brand awareness, credibility with readers, and signals of expertise that support [E-E-A-T](/glossary/eeat).',
    ],
    how: {
      heading: 'How to run a digital PR campaign',
      steps: [
        'Pick an angle journalists in your niche care about. Look at what they covered recently.',
        'Create the asset: original data, a survey, a study or expert analysis. Make the headline finding clear in one sentence.',
        'Publish it on a page of your site with the methodology, charts and quotable findings.',
        'Build a list of relevant journalists and pitch them a short, specific story, not a press release blast.',
        'Offer an expert for comment, and reply quickly. News moves fast.',
        'Track coverage, then ask for a link politely where a mention has none.',
      ],
    },
    openseo: {
      body: 'Use the backlink checker to see which pages earned new links after a campaign, and the AI visibility checker to see whether AI assistants now cite your study.',
      href: '/tools/backlink-checker',
      label: 'Track campaign links',
    },
    related: ['link-building', 'haro', 'editorial-links', 'brand-mentions', 'unlinked-mentions', 'eeat'],
    faqs: [
      {
        question: 'What is the difference between digital PR and link building?',
        answer: [
          'Digital PR is one way to build links, focused on earning coverage from publications through newsworthy stories. Link building also includes tactics like broken link building and reclamation.',
        ],
      },
      {
        question: 'Are press release links good for SEO?',
        answer: [
          'Links in press releases distributed through wire services generally pass little or no value, and Google’s spam policies name optimised anchors in press releases as link spam. The value comes from journalists covering the story and linking on their own.',
        ],
      },
    ],
  },
  {
    slug: 'link-intersect',
    term: 'Link intersect',
    aka: ['link gap', 'backlink gap', 'common backlinks'],
    category: 'links',
    short: 'Link intersect finds websites that link to several of your competitors but not to you. Those sites are your most likely link prospects.',
    definition: [
      'Link intersect is a backlink analysis that finds websites linking to two or more of your competitors but not to your site. The idea is simple: if a site already links to several businesses like yours, it covers your topic and is open to linking, so it is a strong prospect for outreach.',
      'It is also called a link gap or backlink gap, and it is the link equivalent of a [keyword gap](/glossary/keyword-gap). You enter your domain and a few competitors, and the tool returns the [referring domains](/glossary/referring-domain) they share that you lack, often with the pages and anchors involved.',
    ],
    why: [
      'Cold outreach to random sites has low success rates. A link intersect narrows your list to sites that have already shown interest in your topic: industry roundups, resource pages, review sites, local directories and journalists who cover your space.',
      'It also shows you the kinds of links your competitors rely on, which helps you decide which [link building](/glossary/link-building) tactics are worth your time.',
    ],
    how: {
      heading: 'How to run a link intersect',
      steps: [
        'Pick three to five real competitors, ideally ones ranking for your target keywords.',
        'Run the link intersect with your domain as the target and theirs as the comparison.',
        'Sort by how many competitors each site links to. Sites linking to three or more are the best prospects.',
        'Open the linking pages to see why they link: a list, a review, a quote, a directory.',
        'Work out what you would need to be included, then pitch or apply.',
      ],
    },
    openseo: {
      body: 'The backlink gap tool runs a link intersect: enter your site and up to 20 competitors to see the referring domains that link to them and not to you.',
      href: '/tools/backlink-gap',
      label: 'Run a backlink gap',
    },
    related: ['link-building', 'referring-domain', 'keyword-gap', 'backlink', 'link-profile'],
    faqs: [
      {
        question: 'How many competitors should I use for a link intersect?',
        answer: [
          'Three to five usually works well. Fewer gives a short list, and more brings in sites that are less relevant.',
        ],
      },
      {
        question: 'Is a link intersect the same as a backlink gap?',
        answer: [
          'Yes. Tools use different names for the same analysis: sites linking to competitors but not to you.',
        ],
      },
    ],
  },
  {
    slug: 'outbound-links',
    term: 'Outbound links',
    aka: ['external links', 'outgoing links'],
    category: 'links',
    short: 'Outbound links are links from your site to other websites. Linking to useful sources helps readers and does not drain your rankings.',
    definition: [
      'Outbound links, also called external links, are links on your pages that point to other websites. They are the other side of a [backlink](/glossary/backlink): your outbound link is someone else’s backlink. They can be followed, or qualified with `rel="nofollow"`, `rel="sponsored"` or `rel="ugc"`.',
      'A common myth is that every outbound link “leaks” ranking value and should be avoided or nofollowed. Linking to relevant, trustworthy sources is a normal part of good writing, and Google does not penalise it.',
    ],
    why: [
      'Linking to sources lets readers check your claims and find more detail, which makes your page more useful and more credible. It is part of showing your work, which supports [E-E-A-T](/glossary/eeat).',
      'What you link to does matter. Links to spammy or hacked sites, or followed links you were paid to include, can count against you. Google’s spam policies treat selling followed links as a [link scheme](/glossary/link-schemes). Broken outbound links also make a page look neglected.',
    ],
    how: {
      heading: 'How to use outbound links well',
      steps: [
        'Link to the original source of any statistic, quote or claim.',
        'Choose reputable, relevant sites, and link to the specific page, not just the homepage.',
        'Mark paid or affiliate links `rel="sponsored"`, and user-submitted links `rel="ugc"`.',
        'Check outbound links regularly for 404s and redirects to unrelated sites.',
        'Avoid long lists of unrelated links, which look like a link farm.',
      ],
    },
    openseo: {
      body: 'The site audit crawls your pages and flags broken outbound links and other link issues across the site.',
      href: '/features/site-audit',
      label: 'Audit your links',
    },
    related: ['backlink', 'sponsored-attribute', 'nofollow-link', 'internal-links', 'link-farms', 'broken-link-building'],
    faqs: [
      {
        question: 'Do outbound links help SEO?',
        answer: [
          'Not as a direct ranking boost, but they make content more useful and credible. Google does not penalise linking to good sources.',
        ],
      },
      {
        question: 'Should external links be nofollow?',
        answer: [
          'Only when they are paid, user-generated or you do not want to vouch for the site. Ordinary editorial links to good sources can be followed.',
        ],
      },
      {
        question: 'Should external links open in a new tab?',
        answer: [
          'It is a usability choice with no SEO effect. If you use `target="_blank"`, modern browsers apply `noopener` behaviour by default, and adding `rel="noopener"` is harmless.',
        ],
      },
    ],
  },
  {
    slug: 'reciprocal-links',
    term: 'Reciprocal links',
    aka: ['link swaps', 'link trading', 'mutual links'],
    category: 'links',
    hat: 'grey',
    risks: [
      'A manual action for unnatural links when exchanges are excessive or organised, such as “link to me and I’ll link to you” deals or partner pages built for cross-linking.',
      'Swapped links being discounted, so the effort brings no ranking benefit.',
      'Association with link networks and low-quality sites, which can drag on how your site is perceived.',
    ],
    short: 'Reciprocal links are when two sites link to each other. Natural ones are normal; excessive or arranged swaps for rankings are a link scheme.',
    definition: [
      'Reciprocal links happen when two websites link to each other. Plenty are natural: a supplier and a retailer linking to each other, two researchers citing each other’s work, or partners listing each other. They become a problem when the links exist only because of a deal: “link to me and I’ll link to you”.',
      'Google’s spam policies list “excessive link exchanges” and “partner pages exclusively for the sake of cross-linking” as [link schemes](/glossary/link-schemes). That is why reciprocal linking is grey: the same link pattern can be normal or manipulative depending on why it exists and how much of it there is. See also [link exchanges](/glossary/link-exchanges).',
    ],
    why: [
      'Where the line falls: an occasional reciprocal link that helps readers on both sites is fine and very common. It tips into a scheme when you agree swaps to gain rankings, especially at scale, with sites outside your topic, through three-way (A to B to C) arrangements designed to hide the pattern, or via a “links” or “partners” page that lists dozens of unrelated sites.',
      'If you are approached with a link swap offer, the honest question is whether you would link to that page if no link came back. If not, it is an exchange for ranking purposes. And if the “swap” is really one link in return for money or a service, it is a [paid link](/glossary/paid-links).',
    ],
    how: {
      heading: 'How to handle reciprocal links safely',
      steps: [
        'Link to partners when it genuinely helps your readers, and let them decide whether to link back.',
        'Decline swap offers from unrelated sites or cold emails proposing trades.',
        'Avoid three-way and network exchange schemes; they are still link schemes.',
        'If you have an old “link partners” page full of swapped links, remove it or nofollow the links.',
      ],
    },
    related: ['link-exchanges', 'link-schemes', 'paid-links', 'link-farms', 'outbound-links', 'grey-hat-seo'],
    faqs: [
      {
        question: 'Are reciprocal links bad for SEO?',
        answer: [
          'Not when they occur naturally. Google’s policies target excessive link exchanges and partner pages made only for cross-linking.',
        ],
      },
      {
        question: 'Do three-way link exchanges avoid penalties?',
        answer: [
          'No. They are designed to hide a link exchange, which makes them more clearly a link scheme, not less.',
        ],
      },
    ],
  },
  {
    slug: 'editorial-links',
    term: 'Editorial links',
    aka: ['editorial backlinks', 'earned links', 'natural links'],
    category: 'links',
    short: 'Editorial links are backlinks a writer or editor chooses to give because your content is worth citing, without payment or a link exchange.',
    definition: [
      'An editorial link is a backlink that a writer or editor adds by choice, because your page is a useful source for their readers. Nobody paid for it, traded for it or placed it themselves. Editorial links usually sit in the main body of an article, next to text about the topic.',
      'They are the opposite of [paid links](/glossary/paid-links) and other [link schemes](/glossary/link-schemes), and they are the kind of link Google’s systems are built to reward.',
      'Editorial links can come with no outreach at all, when someone finds your content through search, or as the result of white hat outreach such as [digital PR](/glossary/digital-pr), where you tell a journalist about your research and they decide to cite it. The decision to link stays with the publisher.',
    ],
    why: [
      'Google’s guidance has long described good links as those given freely, as an editorial vote. Editorial links are the hardest to fake and the safest to have: they come from relevant pages, they are surrounded by context, and they bring real readers.',
      'They also compound. A page that ranks well because of editorial links gets found by more writers, who link to it in turn. That is why pages with original data or clear explanations often keep earning links for years.',
    ],
    how: {
      heading: 'How to earn editorial links',
      steps: [
        'Publish things writers need to cite: original statistics, studies, free tools, clear definitions and expert analysis.',
        'Make findings quotable, with a clear headline number or statement and a visible methodology.',
        'Rank for the queries writers search when they need a source, such as “[topic] statistics”.',
        'Tell relevant journalists and bloggers when you publish something new.',
        'Keep the page updated, so it stays the source people link to.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows which of your pages earn the strongest links, so you can see what content attracts editorial citations.',
      href: '/tools/backlink-checker',
      label: 'See your top linked pages',
    },
    related: ['backlink', 'link-building', 'digital-pr', 'paid-links', 'link-equity', 'information-gain'],
    faqs: [
      {
        question: 'What is an editorial backlink?',
        answer: [
          'A link a publisher adds because they chose to cite your content, not because you paid, traded or placed it yourself.',
        ],
      },
      {
        question: 'Can editorial links be nofollow?',
        answer: [
          'Yes. Some publishers nofollow all outbound links as policy. The link is still editorial and still brings traffic and credibility.',
        ],
      },
    ],
  },
  {
    slug: 'unlinked-mentions',
    term: 'Unlinked brand mentions',
    aka: ['unlinked mentions', 'brand mentions without links'],
    category: 'links',
    hat: 'white',
    short: 'Unlinked brand mentions are places that name your brand, product or people without linking to you. Asking for a link is an easy white hat win.',
    definition: [
      'An unlinked brand mention is a page that names your company, product, founder or research but does not link to your site. Turning these mentions into links is one of the simplest white hat link-building tactics: the writer already knows you and chose to write about you, so asking them to add a link is a small, reasonable request.',
      'Mentions are found by searching for your brand name, product names, key people and the titles of your studies, then checking which results do not link. Mentions also count on their own for AI search, where assistants learn about brands from how often and where they are named. See [brand mentions](/glossary/brand-mentions).',
    ],
    why: [
      'It is one of the easiest forms of [link reclamation](/glossary/link-reclamation). The success rate is usually far higher than cold outreach, because you are asking for a fix, not a favour. The link also helps the writer’s readers, who otherwise have to search for you.',
      'It keeps link building within Google’s rules: the publisher decides, and there is no exchange of value.',
    ],
    how: {
      heading: 'How to find unlinked brand mentions',
      steps: [
        'Search Google for your brand in quotes, excluding your own site: `"YourBrand" -site:yourbrand.com`.',
        'Repeat for product names, founders and the titles of your reports.',
        'Set up alerts for new mentions so you can ask while the article is fresh.',
        'Check each page. If it names you without a link, find the author or editor.',
        'Send a short, friendly thank-you with the exact URL you suggest linking to.',
      ],
    },
    example: {
      body: '“Thanks for including our 2026 bike theft study in your article on city cycling. Readers might want the full city-by-city table, which is here: yoursite.com/bike-theft-2026. Would you be open to linking it?”',
    },
    openseo: {
      body: 'Track how often AI assistants mention your brand with AI visibility, then turn web mentions into links.',
      href: '/features/ai-visibility-tracker',
      label: 'Track brand mentions',
    },
    related: ['brand-mentions', 'link-reclamation', 'link-building', 'digital-pr', 'editorial-links'],
    faqs: [
      {
        question: 'Do unlinked mentions help SEO?',
        answer: [
          'They can help search engines and AI assistants understand your brand, but Google has not confirmed they count like links. A linked mention clearly helps more.',
        ],
      },
      {
        question: 'Is it okay to ask for a link from a mention?',
        answer: [
          'Yes. Politely asking a writer to link to you is fine. Offering payment for the link is not, unless it is marked sponsored.',
        ],
      },
    ],
  },
  {
    slug: 'link-reclamation',
    term: 'Link reclamation',
    aka: ['backlink reclamation', 'link recovery'],
    category: 'links',
    hat: 'white',
    short: 'Link reclamation is recovering backlinks you have lost or that point to broken URLs, by fixing pages, adding redirects or asking sites to update links.',
    definition: [
      'Link reclamation is the process of recovering the value of backlinks you have lost or are wasting. That covers links to pages that now return 404, links removed when an article changed, links broken by a migration, and [unlinked brand mentions](/glossary/unlinked-mentions). It is often the quickest form of link building, as the links once existed once.',
      'Most reclamation is on your side. When a page that earned links is deleted or moved without a redirect, those links pass nothing. Adding a [301 redirect](/glossary/301-redirect) from the old URL to the most relevant live page recovers them without contacting anyone.',
    ],
    why: [
      'Sites lose links all the time through redesigns, URL changes, expired content and publishers editing old posts. Every lost link from a good site is equity you already earned and are now missing.',
      'Reclamation is cheap compared with earning new links, and it is entirely within Google’s guidelines.',
    ],
    how: {
      heading: 'How to reclaim lost backlinks',
      steps: [
        'List your pages with backlinks that now return 404 or 410 errors, and redirect each to the closest relevant live page.',
        'After any migration, check that old URLs with links redirect in a single hop.',
        'Review [lost backlinks](/glossary/lost-backlinks) each month. For valuable ones, check why: was the link removed, the page deleted or the URL changed?',
        'If a site linked to an old URL of yours, ask them to update it to the new one.',
        'If an article was updated and your link dropped, reach out with a reason it still helps readers.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows lost links month by month and your top linked pages, so you can spot linked URLs that now break.',
      href: '/tools/backlink-checker',
      label: 'Find lost links',
    },
    related: ['lost-backlinks', 'broken-link-building', 'unlinked-mentions', '301-redirect', '404-error', 'link-equity'],
    faqs: [
      {
        question: 'What is the fastest way to reclaim links?',
        answer: [
          'Redirect your own broken URLs that still have backlinks. It needs no outreach and recovers the links once Google recrawls them.',
        ],
      },
      {
        question: 'Should I redirect every 404 to my homepage?',
        answer: [
          'No. Redirect each URL to the most relevant page. Google may treat mass redirects to the homepage as soft 404s, and the links may not count.',
        ],
      },
    ],
  },
  {
    slug: 'skyscraper-technique',
    term: 'Skyscraper technique',
    aka: ['skyscraper content', 'skyscraper link building'],
    category: 'links',
    hat: 'white',
    short: 'The skyscraper technique means finding content that earned many links, making something clearly better, and asking the linking sites to cite yours.',
    definition: [
      'The skyscraper technique is a link-building method popularised by Brian Dean of Backlinko in 2015. You find a page in your niche that has earned lots of backlinks, create a clearly better version, then contact the sites linking to the original and suggest they link to yours too.',
      'The name comes from building a taller building than the one next to it. “Better” is the hard part. Early versions of the tactic focused on making content longer, which led to a lot of bloated copycat articles. What works now is adding something the original lacks: newer data, original research, expert input, clearer visuals or a tool. That is the idea of [information gain](/glossary/information-gain).',
    ],
    why: [
      'It targets people who have already shown they link to the topic, so the prospect list is warm, much like a [link intersect](/glossary/link-intersect). It stays white hat because the linking site makes its own decision on merit.',
      'It fails when the new page is only a rewrite. Editors get many skyscraper pitches, and they rarely swap a working link for one that is not obviously better.',
    ],
    how: {
      heading: 'How to use the skyscraper technique',
      steps: [
        'Find pages in your topic with many referring domains, using a backlink checker on competitors’ top linked pages.',
        'Read the original and the pages linking to it. Note what is outdated, missing or hard to use.',
        'Build a version that is materially better: fresher data, original insight, better structure or a useful tool.',
        'Contact the linking sites with a short note explaining what is new and why it helps their readers.',
        'Keep the page updated so it stays the best resource.',
      ],
    },
    openseo: {
      body: 'The backlink checker’s top linked pages report shows which competitor content earned the most links, which is where skyscraper research starts.',
      href: '/tools/backlink-checker',
      label: 'Find top linked pages',
    },
    related: ['link-building', 'broken-link-building', 'information-gain', 'content-marketing', 'editorial-links'],
    faqs: [
      {
        question: 'Does the skyscraper technique still work?',
        answer: [
          'It can, but only when your content is genuinely better or more original. Longer rewrites of the same information rarely earn links today.',
        ],
      },
      {
        question: 'Who created the skyscraper technique?',
        answer: [
          'Brian Dean of Backlinko named and popularised it in 2015, though the underlying idea of outreach for better content is older.',
        ],
      },
    ],
  },
  {
    slug: 'link-velocity',
    term: 'Link velocity',
    aka: ['link growth rate', 'backlink velocity'],
    category: 'links',
    short: 'Link velocity is how fast a site gains or loses backlinks over time. It is a useful monitoring metric, not a confirmed Google ranking factor.',
    definition: [
      'Link velocity is the rate at which a website or page gains new [backlinks](/glossary/backlink) or [referring domains](/glossary/referring-domain) over a period, such as per month. Some definitions use net growth: new links minus lost ones. It is a way to read the trend in your link profile rather than its size at one moment.',
      'There is a long-running theory that gaining links “too fast” looks unnatural to Google. Google has not confirmed link velocity as a ranking factor, and natural spikes happen all the time, for example when an article goes viral. What draws scrutiny is the type of links, not the speed alone.',
    ],
    why: [
      'As a monitoring metric, link velocity is useful. A steady rise shows your content and outreach are working. A sharp drop can mean a site removed many links or a migration broke linked pages. A sudden burst from unknown domains with odd anchors can signal spam or a [negative SEO](/glossary/negative-seo) attempt.',
      'Comparing link velocity with competitors also shows who is actively building links and how fast you would need to grow to catch up.',
    ],
    how: {
      heading: 'How to monitor link velocity',
      steps: [
        'Track new and lost referring domains each month, not just total backlinks.',
        'Investigate spikes: check whether they come from real coverage or from spammy, unrelated sites.',
        'Investigate drops: look for deleted pages, broken redirects or a site that removed a sitewide link.',
        'Compare your monthly growth with two or three competitors.',
      ],
    },
    openseo: {
      body: 'The backlink checker charts the monthly history of new and lost links for any domain, so you can see link velocity at a glance.',
      href: '/tools/backlink-checker',
      label: 'See link history',
    },
    related: ['referring-domain', 'lost-backlinks', 'link-profile', 'negative-seo', 'backlink'],
    faqs: [
      {
        question: 'Can getting too many backlinks too fast hurt?',
        answer: [
          'Speed alone is not a known penalty trigger, and natural link spikes are common. A fast rise in manipulative links, such as bought links with keyword anchors, is the real risk.',
        ],
      },
      {
        question: 'What is a good link velocity?',
        answer: [
          'There is no universal number. Steady growth in relevant referring domains, compared with your competitors, is a better benchmark.',
        ],
      },
    ],
  },
  {
    slug: 'lost-backlinks',
    term: 'Lost backlinks',
    aka: ['lost links', 'removed backlinks'],
    category: 'links',
    short: 'Lost backlinks are links that used to point to your site but no longer do, because the link, page or target URL changed or was removed.',
    definition: [
      'Lost backlinks are links that SEO tools previously found pointing to your site but no longer find. A link can be lost because the publisher removed it, deleted or moved the page, added `nofollow`, or because your own target page now returns an error. Some losses are temporary, for example when a tool cannot reach a page for a while.',
      'Losing links is normal, and every [link profile](/glossary/link-profile) loses some each month. Old articles get pruned, sites close and blogs redesign. The ones worth worrying about are links from strong, relevant pages, especially to your important pages.',
    ],
    why: [
      'Losing a few strong links can cause a ranking drop, especially for competitive keywords where the margin between positions is small. Spotting lost links quickly gives you the best chance of getting them back.',
      'Patterns in lost links also reveal problems on your own site, such as a migration that broke URLs or a deleted page that had many links.',
    ],
    how: {
      heading: 'How to recover lost backlinks',
      steps: [
        'Review lost links monthly and filter to the strongest referring domains.',
        'Check the reason: is the linking page gone, the link removed, or your URL broken?',
        'If your URL broke, restore it or add a [301 redirect](/glossary/301-redirect) to the right page.',
        'If the linking page moved, find its new URL and check whether the link survived.',
        'If the link was removed, contact the editor with a reason it still helps, such as an updated version of your page.',
      ],
    },
    openseo: {
      body: 'The backlink checker’s monthly history shows new and lost links side by side, so you can catch losses from strong sites early.',
      href: '/tools/backlink-checker',
      label: 'Check lost backlinks',
    },
    related: ['link-reclamation', 'link-velocity', 'backlink', '301-redirect', 'link-profile'],
    faqs: [
      {
        question: 'Why am I losing backlinks?',
        answer: [
          'Usually because linking pages were deleted or updated, sites closed, or your own URLs changed without redirects. Some tool-reported losses are temporary crawl issues.',
        ],
      },
      {
        question: 'Do lost backlinks affect rankings?',
        answer: [
          'They can, if the lost links were strong and relevant. Losing weak or spammy links rarely makes a difference.',
        ],
      },
    ],
  },
  {
    slug: 'niche-edits',
    term: 'Niche edits (link insertions)',
    aka: ['niche edits', 'link insertions', 'curated links', 'contextual link insertion'],
    category: 'links',
    hat: 'grey',
    risks: [
      'Paid link insertions without `rel="sponsored"` are paid links under Google’s spam policies and can lead to a manual action for unnatural links.',
      'Sites that sell insertions often sell to anyone, so Google may already discount their outbound links, leaving you with wasted spend.',
      'Insertions on hacked or low-quality pages can associate your brand with spam.',
      'Links that vanish when the seller removes them or the site is deindexed.',
    ],
    short: 'A niche edit adds a link to an existing article on another site. Asking for a useful update is fine; paying for the insertion makes it a paid link.',
    definition: [
      'A niche edit, or link insertion, is a link added to an article that has already been published on another website, rather than a link in new content. In practice the term mostly describes a paid service, which is where the risk of breaking Google’s spam policies comes in.',
      'A buyer pays a site owner, or a broker, to insert a followed link with a chosen anchor into an older post that already has authority and traffic.',
      'It is grey because the act of updating an old article is not the problem. A writer who adds your study to their post after you point it out is giving an [editorial link](/glossary/editorial-links). The moment money, goods or a service is exchanged for that link and it is followed, it is a [paid link](/glossary/paid-links), which Google’s spam policies treat as a [link scheme](/glossary/link-schemes).',
    ],
    why: [
      'Where the line falls: suggesting a relevant, better or updated resource to an editor, who decides on merit and is not paid, is fine. That is how [broken link building](/glossary/broken-link-building) and [link reclamation](/glossary/link-reclamation) work. Paying for the insertion, choosing a keyword-rich anchor, or buying insertions in bulk from a list of sites is a link scheme, however natural the link looks on the page.',
      'Niche edit sellers often market their links as undetectable because they sit in aged content. Google’s link spam systems look at patterns across the web, not just a single page, and sites known to sell links can have their outbound links discounted.',
    ],
    how: {
      heading: 'How to ask for link insertions safely',
      steps: [
        'Only pitch articles where your page genuinely adds something for readers.',
        'Let the editor choose whether to link and what anchor to use.',
        'Do not pay, offer gifts, or trade services for the link. If you do sponsor content, require `rel="sponsored"`.',
        'Avoid brokers selling lists of “niche edit” sites. Those lists are a common footprint of link networks.',
      ],
    },
    related: ['paid-links', 'link-schemes', 'editorial-links', 'broken-link-building', 'private-blog-network', 'grey-hat-seo'],
    faqs: [
      {
        question: 'Are niche edits safe?',
        answer: [
          'Unpaid edits that an editor chooses to make are safe. Paid niche edits with followed links are paid links under Google’s spam policies and carry the risk of a manual action.',
        ],
      },
      {
        question: 'Are niche edits better than guest posts?',
        answer: [
          'Both are judged the same way: if the link was paid for or placed at scale for rankings, it is a link scheme. Neither is a safe shortcut.',
        ],
      },
    ],
  },
  {
    slug: 'expired-domains',
    term: 'Expired domains',
    aka: ['expired domain names', 'dropped domains', 'aged domains'],
    category: 'links',
    hat: 'grey',
    risks: [
      'Breaking Google’s expired domain abuse policy, which can lead to a manual action or the site being demoted or removed from results.',
      'Google resetting or ignoring the old domain’s link signals once it changes hands, so the purchase brings no ranking benefit.',
      'Inheriting a bad history, such as an old manual action or spam links.',
      'Redirects from many expired domains to your site being treated as a link scheme.',
    ],
    short: 'Expired domains are domain names their owner let lapse. Reusing one for a real project is fine; buying it to exploit its old links is spam.',
    definition: [
      'An expired domain is a domain name whose registration lapsed and was not renewed, so it became available to register or buy at auction. Many expired domains still have backlinks from their previous life, which is why SEOs buy them. Using one is grey hat: legitimate in some cases, spam in others.',
      'In March 2024 Google added an expired domain abuse policy to its spam policies. It describes buying an expired domain and repurposing it primarily to manipulate search rankings by hosting content that provides little to no value to users, with examples such as affiliate content on a site that used to belong to a government agency or casino content on a former school site. See [expired domain abuse](/glossary/expired-domain-abuse).',
    ],
    why: [
      'Where the line falls: buying an expired domain because the name suits your new business, or relaunching a related site with genuinely useful content, is fine. It tips into spam when the main reason for the purchase is the old domain’s links and reputation: filling it with unrelated or low-value content, using it as part of a [private blog network](/glossary/private-blog-network), or 301-redirecting batches of expired domains to your site to funnel their links. Those uses are [link schemes](/glossary/link-schemes), and buying a domain for its links is effectively buying [paid links](/glossary/paid-links) in bulk.',
      'Google has also said for years that it can recognise when a domain changes hands and may not carry old signals over. Even when it is not penalised, an expired domain’s link value is far from guaranteed.',
    ],
    how: {
      heading: 'How to check an expired domain before buying',
      steps: [
        'Look at its history in a web archive to see what the site used to be.',
        'Check its backlinks and anchors for signs of spam, foreign-language link farms or past PBN use.',
        'Ask whether your planned use is related to its past purpose and genuinely useful to visitors.',
        'After buying, add it to Search Console and check for any existing manual action.',
        'Do not buy domains just to redirect them for links.',
      ],
    },
    openseo: {
      body: 'Run the domain through the backlink checker to see its referring domains, anchors and link history before you buy.',
      href: '/tools/backlink-checker',
      label: 'Check a domain’s backlinks',
    },
    related: ['expired-domain-abuse', 'private-blog-network', 'link-schemes', 'paid-links', '301-redirect', 'grey-hat-seo'],
    faqs: [
      {
        question: 'Is buying an expired domain against Google’s rules?',
        answer: [
          'No, buying one is not. Repurposing it mainly to manipulate rankings with low-value content is expired domain abuse under Google’s spam policies.',
        ],
      },
      {
        question: 'Do expired domains keep their backlinks?',
        answer: [
          'The links may still exist, but Google can reset or ignore old signals when a domain changes owner and purpose, so there is no guarantee they count.',
        ],
      },
      {
        question: 'Can I 301 redirect an expired domain to my site?',
        answer: [
          'It is technically possible, but doing it to capture another site’s links is a link scheme. It only makes sense when the old site was genuinely merged into yours.',
        ],
      },
    ],
  },
  {
    slug: 'haro',
    term: 'HARO and journalist requests',
    aka: ['HARO', 'Help a Reporter Out', 'journalist request services', 'source request services', '#journorequest'],
    category: 'links',
    hat: 'white',
    short: 'HARO and other journalist request services send reporters’ requests for expert sources, so you can earn quotes, mentions and editorial links.',
    definition: [
      'HARO (Help a Reporter Out) is the best-known journalist request service: a service that connects reporters who need expert sources with people who can help. Journalists post a query, such as “nutritionist needed to comment on protein bars”, and experts reply with a quote. If it is used, you may earn a mention and often a link.',
      'HARO launched in 2008 and was later owned by Cision. Cision rebranded it as Connectively in 2024 and then closed Connectively in December 2024. In April 2025 the HARO brand was sold to Featured.com, which relaunched it as an email service. Other services work in a similar way, including Qwoted and Featured, and many journalists post requests on social media with hashtags such as #journorequest.',
    ],
    why: [
      'Answering journalist requests can earn [editorial links](/glossary/editorial-links) and brand mentions from news and industry publications that are hard to reach any other way. The journalist decides what to use, so it fits within Google’s guidelines as part of [digital PR](/glossary/digital-pr).',
      'Expect low hit rates. Popular requests attract many replies, including a growing share of generic AI-written pitches, so editors favour fast, specific answers from people with real credentials. Some publications nofollow outbound links, but the mention and credibility still help.',
    ],
    how: {
      heading: 'How to get links from journalist requests',
      steps: [
        'Sign up to one or two services and filter requests to topics where you have real expertise.',
        'Reply quickly. Many requests fill within hours.',
        'Answer the question directly in the first lines, with a quotable sentence and a specific detail or number you can stand behind.',
        'Include your name, title, company and a link to a relevant page or bio.',
        'Never pay for placement in an article through these services, and do not use AI to invent experience you do not have.',
        'Track which pitches were used and check the published article for the link.',
      ],
    },
    openseo: {
      body: 'Use the backlink checker to see which new links your PR quotes earned each month.',
      href: '/tools/backlink-checker',
      label: 'Track new backlinks',
    },
    related: ['digital-pr', 'editorial-links', 'link-building', 'brand-mentions', 'eeat'],
    faqs: [
      {
        question: 'Does HARO still exist?',
        answer: [
          'Yes, in a new form. Cision closed HARO’s successor Connectively in December 2024, and the HARO brand was bought by Featured.com, which relaunched it in April 2025.',
        ],
      },
      {
        question: 'Are HARO links good for SEO?',
        answer: [
          'Links from journalists who quote you are editorial links and can be valuable, especially from relevant publications. Not every quote comes with a followed link.',
        ],
      },
      {
        question: 'What are alternatives to HARO?',
        answer: [
          'Other journalist request services such as Qwoted and Featured, and journalists’ own requests on social media under hashtags like #journorequest.',
        ],
      },
    ],
  },
  {
    slug: 'google-business-profile',
    term: 'Google Business Profile',
    aka: ['GBP', 'Google My Business', 'GMB', 'Google business listing'],
    category: 'local',
    short: 'Google Business Profile is Google’s free listing for local businesses, shown in Maps and the local pack with hours, reviews, photos and directions.',
    definition: [
      'Google Business Profile (GBP) is Google’s free tool for businesses to manage how they appear in Google Search and Google Maps. A profile shows your name, address or service area, phone number, hours, website, categories, photos, products or services, and customer reviews. It was called Google My Business until Google renamed it in November 2021.',
      'A profile is what appears in the [local pack](/glossary/local-pack), in Google Maps results and in the knowledge panel when someone searches your business name. Customers can call, get directions, visit your website, book or message you from it, depending on your business type and settings. For many local searches, the profile is the first thing people see, before your website.',
      'Anyone can suggest a place on Maps, so your business may already have a profile. To manage it, you claim it and verify that you are the owner. Google decides which verification methods to offer, which can include a postcard, phone, email or a video recording that shows your location, signage and proof of management. Some changes trigger re-verification.',
      'Profiles have to follow Google’s guidelines for representing your business. The main rules: use your real-world business name with no added keywords or locations, list a real address only where you meet customers in person (otherwise set a service area), pick categories that describe what you are, and do not create profiles for businesses that do not have a real presence. Breaking these can lead to edits, suspension or removal.',
    ],
    why: [
      'For local businesses, the profile is often worth more than the website for search visibility. Google uses profile information to decide which businesses to show for local queries, and the [local ranking factors](/glossary/local-ranking-factors) Google names (relevance, distance and prominence) depend heavily on what your profile says and the reviews it collects.',
      'It also drives actions directly. Calls, direction requests and website clicks happen from the profile, often without the person ever seeing a normal search result. Google’s profile performance report shows these interactions.',
      'A neglected profile hurts. Wrong hours, an old phone number or unanswered negative reviews cost customers, and anyone can suggest edits to your profile, which Google may apply if you do not keep it current.',
    ],
    how: {
      heading: 'How to optimise your Google Business Profile',
      steps: [
        'Claim and verify the profile at business.google.com. Remove duplicates by asking Google to merge or remove them.',
        'Use your exact real-world business name. Adding keywords such as “Best Plumber London” breaks Google’s guidelines and risks suspension.',
        'Choose the most specific primary category that describes your business, then add only the secondary categories that genuinely apply. See [GBP categories](/glossary/gbp-categories).',
        'Enter your address if customers visit you, or a service area if you travel to them. Make your [NAP](/glossary/nap) match your website and citations.',
        'Set accurate regular hours and special hours for holidays.',
        'Add services or products with clear descriptions, and a business description that explains what you do in plain language.',
        'Upload real photos of your premises, team and work, and keep adding new ones.',
        'Ask every customer for a review, reply to reviews, good and bad, and never offer incentives for reviews.',
        'Link to the most relevant page of your site, such as the location page for that branch, and add UTM parameters so you can track profile visits in analytics.',
        'Check the profile every month for suggested edits from users and Google, and correct anything wrong.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s local SEO feature looks up Google Business profiles, shows reviews with the owner reply rate, and maps your rankings across a geo-grid.',
      href: '/features/local-rank-tracker',
      label: 'Explore local SEO',
    },
    related: ['local-pack', 'local-ranking-factors', 'gbp-categories', 'online-reviews', 'nap', 'service-area-business', 'google-maps-seo', 'knowledge-panel'],
    faqs: [
      {
        question: 'Is Google Business Profile free?',
        answer: [
          'Yes. Creating and managing a profile is free. Google sells ads that can appear alongside profiles, but you do not need them to have one.',
        ],
      },
      {
        question: 'Is Google My Business the same as Google Business Profile?',
        answer: [
          'Yes. Google renamed Google My Business to Google Business Profile in November 2021 and moved most management into Search and Maps.',
        ],
      },
      {
        question: 'Can I add keywords to my business name on Google?',
        answer: [
          'No. Google’s guidelines say the name must match your real-world business name. Adding keywords or locations can lead to the profile being suspended.',
        ],
      },
      {
        question: 'Why is my Google Business Profile not showing?',
        answer: [
          'Common reasons are that it is not verified, it is suspended, it was recently edited and is under review, or it ranks lower than nearby competitors for that search. Search your exact business name to check it exists.',
        ],
      },
    ],
  },
  {
    slug: 'local-pack',
    term: 'Local pack (map pack)',
    aka: ['map pack', 'local 3-pack', 'Google 3-pack', 'local results'],
    category: 'local',
    short: 'The local pack is the block of map and business listings Google shows for local searches, usually three businesses from Google Maps.',
    definition: [
      'The local pack, or map pack, is the section of Google search results that shows a map and a short list of local businesses, usually three, for searches with local intent such as “dentist” or “pizza near me”. Each listing comes from a [Google Business Profile](/glossary/google-business-profile).',
      'A listing typically shows the business name, star rating, review count, category, opening hours and quick links to call, get directions or visit the website. Some business types also show prices, menus, booking buttons or a short snippet from a review that matches the search.',
      'It appears when Google thinks the searcher wants something nearby, even if they did not type a place name. Google uses the searcher’s location, so two people a few streets apart can see different businesses. Clicking “more places” opens a longer list of results, often called the local finder, which works like Google Maps.',
      'Sponsored listings can also appear in or above the local pack. These are Google Ads, marked as sponsored, and are separate from the organic ranking. The order of organic listings is decided by Google’s [local ranking factors](/glossary/local-ranking-factors): relevance, distance and prominence.',
      'The local pack is a [SERP feature](/glossary/serp-features). It often appears above the normal organic results, which means a business in the pack can get more visibility than the top organic website for the same search.',
    ],
    why: [
      'For local businesses, the local pack is usually the most valuable spot on the page. It takes up prime space, it shows ratings at a glance and it lets people call or get directions in one tap. Many searchers choose from the pack without scrolling further.',
      'Because the pack shows only a few businesses, the gap between third and fourth place is large. Being in the pack for your main service across your area is often the clearest goal of [local SEO](/features/local-rank-tracker).',
      'Rankings in the pack change with the searcher’s location, so a single rank check from one point gives a misleading picture. A [geo-grid](/glossary/geo-grid) shows how your position varies across your area.',
      'The pack is also tightly policed. Because the rewards are high, it attracts spam: fake listings, keyword-stuffed business names and [fake reviews](/glossary/fake-reviews). Google removes such listings and suspends profiles, and you can report competitors who break the guidelines through Google Maps.',
    ],
    how: {
      heading: 'How to rank in the local pack',
      steps: [
        'Claim, verify and fully complete your Google Business Profile, with an accurate name, address or service area, phone and hours.',
        'Pick the most accurate primary category. It is one of the strongest relevance signals.',
        'Earn a steady flow of genuine reviews and reply to them.',
        'Make your website support the profile: a clear page for each location or service, consistent NAP and LocalBusiness structured data.',
        'Build local prominence with citations in trusted directories, local press, sponsorships and links from local organisations.',
        'Track rankings across a geo-grid, not from a single point, and work on the areas where you are weak.',
        'Avoid shortcuts such as keyword-stuffed names, fake addresses or fake reviews. They break Google’s guidelines and lead to suspension.',
      ],
    },
    example: {
      body: 'A search for “emergency plumber” from a phone in central Leeds shows a map with three plumbers, each with a star rating, review count, “Open 24 hours” and a call button. Searching the same phrase from a suburb five miles away shows a different three.',
    },
    openseo: {
      body: 'The local rank checker shows where you rank in Google Maps across a grid of points around a city, so you can see the areas where you make the local pack and where you do not.',
      href: '/tools/local-rank-checker',
      label: 'Check local pack rankings',
    },
    related: ['google-business-profile', 'local-ranking-factors', 'geo-grid', 'google-maps-seo', 'near-me-searches', 'serp-features', 'online-reviews'],
    faqs: [
      {
        question: 'How many businesses are in the local pack?',
        answer: [
          'Usually three, which is why it is often called the 3-pack. Google can show sponsored listings too, and the layout varies by query and device.',
        ],
      },
      {
        question: 'How long does it take to get into the local pack?',
        answer: [
          'It varies by competition and distance. A complete, accurate profile and steady reviews can help within weeks in a quiet market; competitive city centres can take much longer.',
        ],
      },
      {
        question: 'Can I pay to be in the local pack?',
        answer: [
          'You can run Google Ads that appear as sponsored listings near or in the pack. You cannot pay for an organic position.',
        ],
      },
      {
        question: 'Why do I rank in the map pack in one area but not another?',
        answer: [
          'Distance from the searcher is one of Google’s three main local factors. Your ranking naturally weakens further from your address, which a geo-grid makes visible.',
        ],
      },
    ],
  },
  {
    slug: 'nap',
    term: 'NAP (name, address, phone)',
    aka: ['NAP consistency', 'NAP+W', 'name address phone'],
    category: 'local',
    short: 'NAP stands for name, address and phone number. Keeping your NAP consistent across your site, profiles and directories supports local SEO.',
    definition: [
      'NAP stands for name, address and phone number: the core contact details of a local business. In local SEO, NAP consistency means these details appear the same way on your website, your [Google Business Profile](/glossary/google-business-profile) and across [local citations](/glossary/local-citations) such as directories and review sites. Some people add W for website.',
      'Consistency is about the facts, not exact punctuation. “St” versus “Street” is not a problem. A different phone number, an old address or an outdated business name is.',
    ],
    why: [
      'Search engines and map services gather business data from many sources. When those sources disagree, it is harder for them to trust which details are right, and customers may call a wrong number or travel to an old address.',
      'Inconsistent NAP often comes from moves, rebrands, call-tracking numbers and old directory listings created years ago. Cleaning it up is one of the basic foundations of local SEO.',
    ],
    how: {
      heading: 'How to fix NAP consistency',
      steps: [
        'Decide the canonical version of your name, address and main phone number.',
        'Update your website, ideally in the footer or contact page, and in LocalBusiness structured data.',
        'Update your Google Business Profile, Apple Business Connect and Bing Places listings.',
        'Search for your business name, old addresses and old phone numbers to find outdated listings, and correct them.',
        'If you use call tracking, keep your main number as the primary number in listings where the platform allows an additional number.',
      ],
    },
    example: {
      body: 'Consistent: “Hart & Sons Plumbing, 14 Mill Lane, Leeds LS1 4AB, 0113 496 0000” on your site and in every directory. Inconsistent: one directory still shows your old address on Park Road and a mobile number you stopped using in 2022.',
    },
    related: ['local-citations', 'google-business-profile', 'local-business-schema', 'local-ranking-factors', 'apple-business-connect', 'bing-places'],
    faqs: [
      {
        question: 'Does NAP consistency still matter?',
        answer: [
          'Yes, mainly for accuracy and trust. Exact formatting matters little, but wrong or conflicting details confuse both search engines and customers.',
        ],
      },
      {
        question: 'What does NAP stand for in SEO?',
        answer: [
          'Name, address and phone number. It refers to the core business details that should be consistent wherever your business is listed.',
        ],
      },
    ],
  },
  {
    slug: 'local-citations',
    term: 'Local citations',
    aka: ['business citations', 'citations', 'business listings'],
    category: 'local',
    short: 'A local citation is any online mention of a business’s name, address and phone number, such as a directory listing or a review site profile.',
    definition: [
      'A local citation is any mention of a business’s name, address and phone number ([NAP](/glossary/nap)) on another website. Structured citations are listings on directories and platforms such as Yelp, Apple Maps, Bing Places, industry directories and chambers of commerce. Unstructured citations are mentions in articles, blog posts or local news.',
      'Citations help search engines confirm that a business exists, where it is and what it does. They do not need to include a link to count as a citation, though many do.',
    ],
    why: [
      'Citations on trusted, relevant sites support the prominence part of Google’s [local ranking factors](/glossary/local-ranking-factors), and they are where many customers find you outside Google. Accurate listings on the main data platforms also feed other services, such as in-car navigation and voice assistants.',
      'Quality and accuracy matter more than quantity. A few dozen accurate listings on well-known and industry-specific sites do more than hundreds on low-quality directories, which add little and can spread wrong details.',
    ],
    how: {
      heading: 'How to build local citations',
      steps: [
        'Start with the core platforms: Google Business Profile, Apple Business Connect, Bing Places and the main directories in your country.',
        'Add industry-specific directories, such as those for legal, medical or trade businesses.',
        'Add local ones: chamber of commerce, local business associations, council or tourism sites.',
        'Use exactly the same NAP everywhere, and the same website URL.',
        'Find and fix existing listings with old details before creating new ones.',
        'Earn unstructured citations through local press, sponsorships and community events.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s local SEO feature looks up Google Business profiles so you can check the details that your citations should match.',
      href: '/features/local-rank-tracker',
      label: 'Explore local SEO',
    },
    related: ['nap', 'google-business-profile', 'local-ranking-factors', 'apple-business-connect', 'bing-places', 'backlink'],
    faqs: [
      {
        question: 'Are local citations still important?',
        answer: [
          'They are a foundation rather than a big lever. Accurate listings on major and relevant platforms help; mass-submitting to hundreds of directories rarely does.',
        ],
      },
      {
        question: 'Is a citation the same as a backlink?',
        answer: [
          'No. A citation is a mention of your business details, with or without a link. A backlink is a link to your site, with or without your address.',
        ],
      },
    ],
  },
  {
    slug: 'geo-grid',
    term: 'Geo-grid rank tracking',
    aka: ['geo-grid', 'local rank grid', 'map rank tracking', 'grid rank tracking'],
    category: 'local',
    short: 'Geo-grid rank tracking checks your Google Maps ranking from many points in a grid around an area, showing how your local visibility changes by location.',
    definition: [
      'Geo-grid rank tracking is a way of measuring local rankings by checking where a business ranks in Google Maps for a keyword from many points laid out in a grid, such as 7 by 7 points across a city. The results are shown as a map of coloured pins, each with the rank at that spot.',
      'It exists because local results depend on where the searcher is. A single rank check from your office might show you in first place while customers three miles away never see you. A geo-grid turns that hidden variation into something you can see and track over time.',
    ],
    why: [
      'Distance is one of Google’s three main [local ranking factors](/glossary/local-ranking-factors), so a business’s visibility in the [local pack](/glossary/local-pack) usually fades with distance from its address. A geo-grid shows how far your strong area reaches, where competitors take over, and whether your work on reviews, categories and content is widening your coverage.',
      'It is also a fairer way to report local SEO results. An average rank across a grid, or the share of points where you are in the top three, says far more than one number from one location.',
    ],
    how: {
      heading: 'How to read a geo-grid',
      steps: [
        'Pick the keyword your customers use, such as “emergency dentist”, not your business name.',
        'Choose a grid size and spacing that covers your real service area.',
        'Look for the shape of your strong area: green pins where you are top three, red where you are outside the top ten.',
        'Compare with competitors’ grids to see who dominates which neighbourhoods.',
        'Re-run the grid monthly and after major changes to your profile to measure progress. The [local SEO tutorial](/docs/tutorials/local-seo) walks through a full workflow.',
      ],
    },
    openseo: {
      body: 'The local rank checker runs a Google Maps geo-grid around any city, and OpenSEO’s local SEO feature keeps geo-grid rank maps over time.',
      href: '/tools/local-rank-checker',
      label: 'Run a geo-grid',
    },
    related: ['local-pack', 'local-ranking-factors', 'google-maps-seo', 'rank-tracking', 'service-area-business', 'near-me-searches'],
    faqs: [
      {
        question: 'Why does my local ranking change across town?',
        answer: [
          'Google ranks local results partly by distance from the searcher, so businesses closer to each point often rank higher there. A geo-grid shows this pattern.',
        ],
      },
      {
        question: 'What grid size should I use?',
        answer: [
          'Match it to your service area. A café might need a tight grid of a mile or two; a regional service business might need a grid spanning many miles.',
        ],
      },
    ],
  },
  {
    slug: 'local-ranking-factors',
    term: 'Local ranking factors',
    aka: ['local SEO ranking factors', 'Google Maps ranking factors', 'relevance distance prominence'],
    category: 'local',
    short: 'Local ranking factors decide which businesses Google shows in Maps and the local pack. Google names three: relevance, distance and prominence.',
    definition: [
      'Local ranking factors are the signals Google uses to decide which businesses to show, and in what order, in the [local pack](/glossary/local-pack) and Google Maps. Google says local results are based mainly on three things: relevance, distance and prominence. Everything else feeds into one of these three.',
      'Put simply, relevance is how well a profile matches the search, distance is how far the business is from the searcher or the place named in the query, and prominence is how well known and trusted the business is.',
      'Relevance comes largely from your [Google Business Profile](/glossary/google-business-profile): your categories, business description, services, products and attributes, along with the content of your website. Your primary category is one of the clearest signals of what you are.',
      'Distance is calculated from the searcher’s location, or from a place named in the query, such as “dentist in Bristol”. If Google does not know where the searcher is, it uses what it knows about the search. You cannot change distance, which is why a business rarely ranks well everywhere in a big city.',
      'Prominence reflects how well known a business is, online and offline. Google says it uses information from across the web, such as links, articles and directories, and that review count and rating factor in. It also says your position in web results is a factor, so normal SEO best practices apply. Famous landmarks and well-known brands get a boost because they are prominent in the real world.',
      'Google also states that you cannot pay to improve your local organic ranking. Beyond Google’s summary, the exact weight of each signal is not public. Surveys of local SEO practitioners exist, but they are opinions and correlations, not confirmed factors.',
    ],
    why: [
      'Knowing the three factors keeps your effort on the things that work. You control most of relevance, you can build prominence over time, and you cannot change distance, so you measure it with a [geo-grid](/glossary/geo-grid) instead of worrying about it.',
      'It also helps you avoid tactics that break Google’s guidelines, such as stuffing keywords into the business name to fake relevance, or fake addresses to fake proximity. Both can get a profile suspended.',
      'Finally, it explains why local and organic SEO are connected. The same website that supports your profile’s relevance also earns the links and rankings that feed prominence. A business with a thin site and a strong profile is leaving one of Google’s named signals on the table.',
    ],
    how: {
      heading: 'How to improve local rankings',
      steps: [
        'Relevance: choose the most accurate primary category, add relevant secondary categories, and fill in services, products, attributes and a plain description.',
        'Relevance: give each location and main service its own useful page on your website, linked from the profile.',
        'Distance: make sure your address pin is correct. If you serve customers at their homes, set a [service area](/glossary/service-area-business) instead.',
        'Prominence: earn genuine reviews steadily and reply to them.',
        'Prominence: build accurate [citations](/glossary/local-citations) and links from local press, organisations and industry sites.',
        'Prominence: improve your website’s organic SEO, since web ranking also feeds local prominence.',
        'Keep hours and details accurate so Google can trust the profile.',
        'Measure with a geo-grid across your area, not from one point.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s local SEO feature brings the main factors together: Google Business profile lookups for relevance, reviews and reply rate for prominence, and geo-grid maps to see the effect of distance.',
      href: '/features/local-rank-tracker',
      label: 'Explore local SEO',
    },
    related: ['local-pack', 'google-business-profile', 'gbp-categories', 'online-reviews', 'geo-grid', 'local-citations', 'ranking-factors'],
    faqs: [
      {
        question: 'What are Google’s local ranking factors?',
        answer: [
          'Google names three: relevance, distance and prominence. Profile details and categories drive relevance, the searcher’s location drives distance, and reviews, links, citations and web rankings feed prominence.',
        ],
      },
      {
        question: 'Do reviews affect local rankings?',
        answer: [
          'Yes. Google says review count and review score factor into local ranking, as part of prominence. Reviews must be genuine; fake or incentivised reviews break Google’s policies.',
        ],
      },
      {
        question: 'Does my website affect my Google Maps ranking?',
        answer: [
          'Yes. Google says a business’s position in web results is a factor in prominence, and website content helps relevance.',
        ],
      },
      {
        question: 'Can I pay Google to rank higher locally?',
        answer: [
          'No. Google says there is no way to request or pay for a better local organic ranking. Ads are separate and labelled as sponsored.',
        ],
      },
    ],
  },
  {
    slug: 'google-maps-seo',
    term: 'Google Maps SEO',
    aka: ['Google Maps optimisation', 'Maps SEO', 'map rankings'],
    category: 'local',
    short: 'Google Maps SEO is optimising your business so it ranks higher in Google Maps searches, mainly through your Google Business Profile and reviews.',
    definition: [
      'Google Maps SEO is the work of improving how visible a business is when people search in Google Maps, for queries such as “coffee shop” or “vet open now”. It overlaps heavily with local pack optimisation, since the same [Google Business Profile](/glossary/google-business-profile) and the same [local ranking factors](/glossary/local-ranking-factors) drive both.',
      'Maps differs slightly from the local pack in search. It shows many more results, is used heavily on phones while people are on the move, and is often viewed as a map where the visible area affects which businesses appear. Filters such as “open now” or “top rated” can also change which businesses show.',
    ],
    why: [
      'Many people search directly in the Maps app, particularly for places to visit. Ranking well there brings direction requests, calls and walk-in customers that never reach your website.',
      'Because Maps results shift with the map view and the user’s location, it is a place where accurate profile data and strong reviews matter even more than in normal search.',
    ],
    how: {
      heading: 'How to rank higher on Google Maps',
      steps: [
        'Complete every relevant section of your profile, starting with the primary category, hours and address or service area.',
        'Keep hours accurate, including special hours. Filters like “open now” rely on them.',
        'Collect genuine reviews regularly and reply to them.',
        'Add photos of the outside, inside and your products or work, so people recognise you.',
        'Make sure your map pin sits exactly on your entrance.',
        'Track rankings with a geo-grid to see how visibility changes across your area.',
      ],
    },
    openseo: {
      body: 'The local rank checker shows your Google Maps rankings across a grid around a city, for any keyword.',
      href: '/tools/local-rank-checker',
      label: 'Check Google Maps rankings',
    },
    related: ['google-business-profile', 'local-pack', 'local-ranking-factors', 'geo-grid', 'online-reviews', 'near-me-searches'],
    faqs: [
      {
        question: 'Is Google Maps ranking the same as local pack ranking?',
        answer: [
          'They are closely related and use the same ranking factors, but the results can differ because Maps shows more businesses and depends on the map view.',
        ],
      },
      {
        question: 'How do I get my business on Google Maps?',
        answer: [
          'Create or claim a Google Business Profile and verify it. Once verified, your business can appear in Maps and Search.',
        ],
      },
    ],
  },
  {
    slug: 'online-reviews',
    term: 'Online reviews',
    aka: ['customer reviews', 'Google reviews', 'local reviews'],
    category: 'local',
    short: 'Online reviews are customer ratings and comments on platforms such as Google, Yelp and Trustpilot. They shape local rankings and buying decisions.',
    definition: [
      'Online reviews are ratings and written feedback that customers post about a business on platforms such as Google, Yelp, Tripadvisor, Trustpilot, Facebook and industry sites. On a [Google Business Profile](/glossary/google-business-profile), reviews show as a star rating out of five, a review count and individual comments, with the owner’s replies underneath.',
      'Reviews matter for search in two ways. Google says review count and rating factor into local rankings as part of prominence. And the content of reviews gives Google and customers more detail about what a business offers, which is why reviews that mention a specific service can help a profile look relevant for it.',
    ],
    why: [
      'Reviews are among the few local ranking signals that Google confirms by name, and they are visible in the [local pack](/glossary/local-pack), so they affect both ranking and whether people click. A business with many recent, genuine reviews tends to look more trustworthy than one with a handful of old ones.',
      'They are also governed by rules. Google’s policies ban fake engagement, conflicts of interest, and offering incentives for reviews. In the US, the FTC’s rule on consumer reviews, in force since October 2024, bans buying fake reviews. See [fake reviews](/glossary/fake-reviews) and [review gating](/glossary/review-gating).',
    ],
    how: {
      heading: 'How to get more Google reviews',
      steps: [
        'Ask every customer, not just the happy ones, at the moment the job is done.',
        'Share your profile’s review link by email, text or a QR code at the counter.',
        'Make it easy: one link, one short request, no forms in between.',
        'Never offer discounts, gifts or entries into prize draws in exchange for reviews.',
        'Reply to reviews, positive and negative, so customers see you listen. See [review response rate](/glossary/review-response-rate).',
        'Flag reviews that break Google’s policies, such as spam or conflicts of interest, but do not try to remove honest negative ones.',
      ],
    },
    openseo: {
      body: 'OpenSEO’s local SEO feature shows a Google Business profile’s reviews along with the owner’s reply rate.',
      href: '/features/local-rank-tracker',
      label: 'See reviews and reply rate',
    },
    related: ['review-response-rate', 'fake-reviews', 'review-gating', 'google-business-profile', 'local-ranking-factors', 'local-pack'],
    faqs: [
      {
        question: 'Do Google reviews help SEO?',
        answer: [
          'Yes, for local search. Google says review count and score factor into local ranking. They also affect whether people choose you.',
        ],
      },
      {
        question: 'Can I offer a discount for a Google review?',
        answer: [
          'No. Google’s policies prohibit offering incentives for reviews, whether for positive reviews or any review at all.',
        ],
      },
      {
        question: 'Can I remove a bad Google review?',
        answer: [
          'Only if it breaks Google’s policies, for example spam, off-topic content or a conflict of interest. You can flag it for review. Honest negative reviews stay; reply to them politely instead.',
        ],
      },
    ],
  },
  {
    slug: 'review-response-rate',
    term: 'Review response rate',
    aka: ['owner reply rate', 'review reply rate'],
    category: 'local',
    short: 'Review response rate is the share of customer reviews a business has replied to. Replies show customers you listen and help manage your reputation.',
    definition: [
      'Review response rate is the percentage of a business’s [online reviews](/glossary/online-reviews) that the owner has replied to. If a profile has 200 Google reviews and the owner has replied to 150, the response rate is 75%. It is a simple measure of how actively a business manages its reputation.',
      'Some people also track response time, meaning how quickly replies are posted, and look separately at replies to negative reviews, since those matter most to people reading them.',
    ],
    why: [
      'Google encourages businesses to reply to reviews and says it shows customers you value their feedback. Whether replies directly affect rankings is not confirmed, so treat response rate as a trust and conversion measure rather than a ranking lever.',
      'Replies are public and appear under each review on your [Google Business Profile](/glossary/google-business-profile). A calm, helpful reply to a complaint can reassure future customers more than the complaint puts them off. Ignored complaints suggest nobody is listening.',
    ],
    how: {
      heading: 'How to respond to Google reviews',
      steps: [
        'Reply to every review, starting with negative and recent ones.',
        'Thank the customer by name and mention what they mentioned, so replies do not look copied.',
        'For complaints, apologise for the experience, explain briefly if useful, and offer to continue offline.',
        'Never share private customer details or argue in public.',
        'Set a routine, such as checking for new reviews every few days.',
      ],
    },
    example: {
      body: '“Thanks, Priya. Sorry the delivery arrived late on Saturday. That is not the standard we aim for. I have passed this to our driver team, and if you email me at hello@example.com I would like to make it right. Sam, owner.”',
    },
    openseo: {
      body: 'OpenSEO shows a Google Business profile’s reviews with its owner reply rate, so you can compare your responsiveness with competitors.',
      href: '/features/local-rank-tracker',
      label: 'Check reply rates',
    },
    related: ['online-reviews', 'google-business-profile', 'fake-reviews', 'review-gating', 'local-ranking-factors'],
    faqs: [
      {
        question: 'Should I respond to every Google review?',
        answer: [
          'Yes, if you can. Google recommends replying, and it shows customers that you read and act on feedback.',
        ],
      },
      {
        question: 'Do review replies help local SEO?',
        answer: [
          'Google has not confirmed replies as a ranking factor. They clearly help reputation and can improve how many searchers choose you.',
        ],
      },
    ],
  },
  {
    slug: 'service-area-business',
    term: 'Service area business',
    aka: ['SAB', 'service-area business'],
    category: 'local',
    short: 'A service area business visits or delivers to customers rather than serving them at its address, such as a plumber, cleaner or mobile mechanic.',
    definition: [
      'A service area business (SAB) is a business that serves customers at their location rather than at its own premises, such as plumbers, electricians, cleaners and mobile dog groomers. On a [Google Business Profile](/glossary/google-business-profile), it sets a service area, made of cities, postcodes or regions, and hides its street address.',
      'Google’s guidelines say that if you do not serve customers in person at your address, you should not show it. Hybrid businesses, such as a locksmith with a shop front who also visits customers, can show their address and set a service area as well.',
    ],
    why: [
      'Service area businesses still compete in the [local pack](/glossary/local-pack), but setting a wide service area does not make you rank everywhere in it. Google still uses the business’s location for distance, so visibility usually remains strongest near the verified address.',
      'This is why SABs are tempted to create fake addresses, virtual offices or extra profiles in other towns. Google’s guidelines prohibit them, and they are a common cause of suspended profiles.',
    ],
    how: {
      heading: 'How to set up a service area on Google',
      steps: [
        'In your profile, clear the address if customers do not visit you, then add your service areas.',
        'List the cities or postcodes you genuinely cover. Google says the boundary should not extend much more than about two hours’ drive from your base.',
        'Create a useful page on your site for each main area or service, with real local detail rather than swapped town names.',
        'Use a geo-grid to see where you actually rank across the service area.',
      ],
    },
    openseo: {
      body: 'The local rank checker shows how far your Maps visibility really reaches across your service area.',
      href: '/tools/local-rank-checker',
      label: 'Check your service area rankings',
    },
    related: ['google-business-profile', 'local-landing-pages', 'geo-grid', 'local-ranking-factors', 'doorway-pages'],
    faqs: [
      {
        question: 'Should I hide my address on Google Business Profile?',
        answer: [
          'Yes, if customers do not visit you there. Google’s guidelines require service area businesses that do not serve customers at their address to hide it.',
        ],
      },
      {
        question: 'Can I rank in towns outside my address?',
        answer: [
          'Sometimes, but distance from your business location still limits local pack rankings. Location pages on your website can help you rank in normal organic results for those towns.',
        ],
      },
    ],
  },
  {
    slug: 'near-me-searches',
    term: '"Near me" searches',
    aka: ['near me searches', 'near me keywords', 'near me SEO'],
    category: 'local',
    short: '“Near me” searches are queries such as “pharmacy near me”, where Google uses the searcher’s location to show nearby businesses.',
    definition: [
      '“Near me” searches are queries that include “near me” or similar phrases, such as “pharmacy near me” or “open now near me”. Google interprets them using the searcher’s location, from their device, IP address or past activity, and usually answers with a [local pack](/glossary/local-pack) or Maps results of businesses nearby.',
      'The phrase itself is not a ranking keyword in the usual sense. Google already knows the searcher wants something close, so the result depends on your business’s location, relevance and prominence, not on whether your page says “near me”. Many local searches without “near me”, such as just “pharmacy”, trigger the same kind of result.',
    ],
    why: [
      '“Near me” searches usually come from people ready to act, often on a phone, which makes them valuable for local businesses. Their [search intent](/glossary/search-intent) is clear: find a place and go there or call.',
      'They are also a common source of bad advice. Stuffing “near me” into page titles or your business name does not make you nearer, and adding it to your Google Business Profile name breaks Google’s guidelines.',
    ],
    how: {
      heading: 'How to rank for near me searches',
      steps: [
        'Optimise your Google Business Profile: category, hours, address or service area and reviews.',
        'Make sure your address pin and NAP are correct everywhere.',
        'Create clear location pages that say where you are and what you offer.',
        'Track Maps rankings across a [geo-grid](/glossary/geo-grid) for the main “near me” queries.',
        'Do not add “near me” to your business name or stuff it into content.',
      ],
    },
    openseo: {
      body: 'Run your main “near me” keyword through the local rank checker to see where you appear across a grid around your city.',
      href: '/tools/local-rank-checker',
      label: 'Check near me rankings',
    },
    related: ['local-pack', 'local-ranking-factors', 'google-maps-seo', 'geo-grid', 'search-intent', 'local-landing-pages'],
    faqs: [
      {
        question: 'Should I put “near me” on my website?',
        answer: [
          'It is not needed. Google uses the searcher’s location for these queries. Clear location details on your site help more than repeating “near me”.',
        ],
      },
      {
        question: 'Why do I not show up for near me searches?',
        answer: [
          'Usually because closer or more prominent businesses outrank you at the searcher’s location, or your profile is incomplete. A geo-grid shows where you appear.',
        ],
      },
    ],
  },
  {
    slug: 'local-landing-pages',
    term: 'Local landing pages',
    aka: ['location pages', 'city pages', 'service area pages'],
    category: 'local',
    short: 'Local landing pages are pages on your site for a specific location or service area, giving local details customers and search engines need.',
    definition: [
      'Local landing pages, or location pages, are pages on a business website dedicated to one location or service area, such as “/locations/leeds” or “Boiler repair in Harrogate”. A good one gives the address or area covered, contact details, opening hours, services available there, directions, local photos, staff and reviews.',
      'For businesses with several branches, each branch usually gets one page, which its [Google Business Profile](/glossary/google-business-profile) links to. For [service area businesses](/glossary/service-area-business), pages often cover the main towns served.',
    ],
    why: [
      'Location pages help relevance: they give Google and customers clear, local information that a single contact page cannot. They can also rank in normal organic results for “[service] in [town]” searches, which matters in areas where your profile is too far away for the local pack.',
      'They become a problem when they are copies. Hundreds of pages that only swap the town name are [doorway pages](/glossary/doorway-pages), which Google’s spam policies prohibit, and they rarely rank anyway.',
    ],
    how: {
      heading: 'How to create local landing pages',
      steps: [
        'Make one page per real location, or per main area you serve.',
        'Include the NAP, hours, map, parking or access details and services offered there.',
        'Add genuinely local content: photos of that branch, staff, local projects, reviews from customers there.',
        'Add LocalBusiness structured data for that location.',
        'Link each page from your main navigation or a locations hub, and from the matching Google Business Profile.',
        'Do not mass-produce pages for towns you do not really serve.',
      ],
    },
    openseo: {
      body: 'Use rank tracking with city-level locations to see how each location page ranks in its own area.',
      href: '/features/keyword-rank-tracker',
      label: 'Track city rankings',
    },
    related: ['doorway-pages', 'local-business-schema', 'service-area-business', 'google-business-profile', 'landing-page', 'programmatic-seo'],
    faqs: [
      {
        question: 'Are city pages bad for SEO?',
        answer: [
          'Not if each one is genuinely useful for that place. Near-identical pages that only swap town names are doorway pages and break Google’s spam policies.',
        ],
      },
      {
        question: 'Should each location have its own page?',
        answer: [
          'Yes, for businesses with several real locations. Each page should link from its Google Business Profile and carry that branch’s details.',
        ],
      },
    ],
  },
  {
    slug: 'gbp-categories',
    term: 'Google Business Profile categories',
    aka: ['GBP categories', 'Google business categories', 'primary category'],
    category: 'local',
    short: 'Google Business Profile categories describe what a business is, such as “Plumber”. The primary category is a key signal for local rankings.',
    definition: [
      'Google Business Profile categories are labels from Google’s fixed list, such as “Italian restaurant”, “Plumber” or “Family law attorney”, that describe what a business is. Each profile has one primary category and can add up to nine additional categories. Categories help Google decide which searches a business is relevant for and unlock category-specific features, such as menus or bookings.',
      'Google’s guidance is to use as few categories as needed to describe your core business, and to pick categories that describe what the business is, not everything it sells. A shop that sells some coffee is not a “Coffee shop”.',
    ],
    why: [
      'The primary category is one of the strongest relevance signals among the [local ranking factors](/glossary/local-ranking-factors). Choosing “Emergency dentist” rather than just “Dentist”, where it is true, can make a clear difference for matching searches.',
      'Categories are also a quick way to learn from competitors. The categories used by businesses ranking in the [local pack](/glossary/local-pack) for your keyword show what Google associates with that search.',
    ],
    how: {
      heading: 'How to choose GBP categories',
      steps: [
        'Pick the most specific primary category that accurately describes your main business.',
        'Add secondary categories only for other things you genuinely are, not services you offer occasionally.',
        'Check which categories the top local competitors use for your main keywords.',
        'List individual services in the services section of your [Google Business Profile](/glossary/google-business-profile) instead of adding loosely related categories.',
        'Review categories occasionally, as Google adds new ones.',
      ],
    },
    openseo: {
      body: 'Look up competitors’ Google Business profiles in OpenSEO to see the categories and review data of businesses that outrank you.',
      href: '/features/local-rank-tracker',
      label: 'Look up a profile',
    },
    related: ['google-business-profile', 'local-ranking-factors', 'local-pack', 'google-maps-seo'],
    faqs: [
      {
        question: 'How many categories can I have on Google Business Profile?',
        answer: [
          'One primary category plus up to nine additional ones. Google recommends using as few as you need to describe your core business.',
        ],
      },
      {
        question: 'Does changing my primary category affect rankings?',
        answer: [
          'It can, because the primary category is a strong relevance signal. A change may also trigger re-verification, so make it only when the new category is more accurate.',
        ],
      },
    ],
  },
  {
    slug: 'local-business-schema',
    term: 'LocalBusiness schema',
    aka: ['local business structured data', 'LocalBusiness markup', 'local schema'],
    category: 'local',
    short: 'LocalBusiness schema is structured data that describes a business’s name, address, phone, hours and more in a format search engines can read.',
    definition: [
      'LocalBusiness schema is [structured data](/glossary/structured-data) using the Schema.org `LocalBusiness` type, or a more specific subtype such as `Dentist`, `Restaurant` or `Plumber`, to describe a business in machine-readable form. It usually includes the name, address, phone number, opening hours, geo-coordinates, URL and photos. It is normally added as [JSON-LD](/glossary/json-ld).',
      'Google has a documentation page for local business structured data and says it can use it to show business details in Search, such as in the knowledge panel. It does not replace your Google Business Profile, which remains Google’s main source for local results.',
    ],
    why: [
      'Markup removes doubt about your business details, which supports [NAP](/glossary/nap) consistency and helps search engines connect your website with your profile and listings.',
      'It is cheap to add and easy to get right. Use the most specific subtype available and keep the data identical to what is visible on the page and your profile.',
    ],
    how: {
      heading: 'How to add LocalBusiness schema',
      steps: [
        'Choose the most specific Schema.org subtype for your business.',
        'Add JSON-LD to each location page with that location’s details, not your head office’s.',
        'Include name, address, telephone, url, openingHoursSpecification and geo where you can.',
        'Make sure every value matches what users see on the page.',
        'Test the page with Google’s Rich Results Test and fix any errors.',
      ],
    },
    example: {
      label: 'JSON-LD',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Plumber",\n  "name": "Hart & Sons Plumbing",\n  "url": "https://www.example.com/locations/leeds",\n  "telephone": "+44 113 496 0000",\n  "address": {\n    "@type": "PostalAddress",\n    "streetAddress": "14 Mill Lane",\n    "addressLocality": "Leeds",\n    "postalCode": "LS1 4AB",\n    "addressCountry": "GB"\n  },\n  "geo": {\n    "@type": "GeoCoordinates",\n    "latitude": 53.7965,\n    "longitude": -1.5478\n  },\n  "openingHoursSpecification": [{\n    "@type": "OpeningHoursSpecification",\n    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],\n    "opens": "08:00",\n    "closes": "18:00"\n  }]\n}\n</script>',
    },
    openseo: {
      body: 'The site audit checks your pages for structured data issues alongside its other technical checks.',
      href: '/features/site-audit',
      label: 'Audit your site',
    },
    related: ['structured-data', 'schema-markup', 'json-ld', 'nap', 'local-landing-pages', 'google-business-profile'],
    faqs: [
      {
        question: 'Does LocalBusiness schema help local rankings?',
        answer: [
          'It is not a confirmed local ranking factor. It helps search engines understand and display your business details accurately, which supports your other local SEO work.',
        ],
      },
      {
        question: 'Where should I put LocalBusiness schema?',
        answer: [
          'On the page about that location, such as a location page or the homepage of a single-location business. Each location page should describe only its own branch.',
        ],
      },
    ],
  },
  {
    slug: 'apple-business-connect',
    term: 'Apple Business Connect',
    aka: ['Apple Maps business listing', 'Apple Maps Connect'],
    category: 'local',
    short: 'Apple Business Connect is Apple’s free tool for businesses to claim and manage how their place appears in Apple Maps and other Apple apps.',
    definition: [
      'Apple Business Connect is Apple’s free tool that lets businesses claim and manage their place card on Apple Maps, which also appears in other Apple services such as Siri and Spotlight search. Apple launched it in January 2023. You can edit your name, address, hours, phone, website, photos and category.',
      'Beyond the basics, you can add promotional cards called Showcases and set action links such as booking or ordering, where available. It is Apple’s counterpart to [Google Business Profile](/glossary/google-business-profile) and [Bing Places](/glossary/bing-places). Like them, it requires you to verify that you are authorised to manage the business.',
    ],
    why: [
      'iPhone users who ask Siri for directions or search Apple Maps see Apple’s data, not Google’s. If your Apple listing is missing or wrong, those customers may not find you or may be sent to the wrong place.',
      'It is also a core [local citation](/glossary/local-citations): accurate, verified details on a major platform that keeps your [NAP](/glossary/nap) consistent. If you never claim the listing, Apple builds it from other data sources, which may be out of date.',
    ],
    how: {
      heading: 'How to claim your Apple Maps listing',
      steps: [
        'Sign in to Apple Business Connect with an Apple Account.',
        'Search for your business and claim it, or add it if it is not listed.',
        'Verify ownership using the method Apple offers.',
        'Fill in hours, phone, website, category and photos, matching your Google profile.',
        'Check the listing in Apple Maps on an iPhone after changes go live.',
      ],
    },
    related: ['google-business-profile', 'bing-places', 'local-citations', 'nap'],
    faqs: [
      {
        question: 'Is Apple Business Connect free?',
        answer: [
          'Yes. Claiming and managing a place card is free.',
        ],
      },
      {
        question: 'Do I need Apple Business Connect if I have Google Business Profile?',
        answer: [
          'Yes, if your customers use iPhones. Apple Maps and Siri use Apple’s own business data, not your Google profile.',
        ],
      },
    ],
  },
  {
    slug: 'bing-places',
    term: 'Bing Places',
    aka: ['Bing Places for Business', 'Bing business listing'],
    category: 'local',
    short: 'Bing Places for Business is Microsoft’s free tool for managing how a business appears in Bing search and Bing Maps.',
    definition: [
      'Bing Places for Business is Microsoft’s free tool for businesses to claim and manage their listing in Bing search results and Bing Maps. It works much like [Google Business Profile](/glossary/google-business-profile): you add your name, address or service area, phone, hours, website, categories and photos, then verify the listing.',
      'Bing Places lets you import listings directly from an existing Google Business Profile, which makes setup quick for businesses that already manage one.',
    ],
    why: [
      'Bing has a smaller share of search than Google, but it powers results in Microsoft products such as Windows search and Copilot, and its index is used by some other search services. A missing or wrong listing means lost customers there.',
      'Setting it up takes minutes once your Google profile is in order, so there is little reason to skip it. It is part of good [Bing SEO](/glossary/bing-seo), alongside verifying your site in [Bing Webmaster Tools](/glossary/bing-webmaster-tools).',
      'It is also one of the core [local citations](/glossary/local-citations), so it helps keep your [NAP](/glossary/nap) accurate across the web.',
    ],
    how: {
      heading: 'How to set up Bing Places',
      steps: [
        'Go to Bing Places for Business and sign in with a Microsoft account.',
        'Import your Google Business Profile, or search for and claim your listing.',
        'Check every field, especially categories and hours, since imports are not always perfect.',
        'Complete verification.',
        'Review the listing occasionally and update it when details change, such as new hours or a new phone number, at the same time as your Google profile.',
      ],
    },
    related: ['google-business-profile', 'apple-business-connect', 'local-citations', 'bing-seo', 'bing-webmaster-tools'],
    faqs: [
      {
        question: 'Can I import my Google Business Profile into Bing Places?',
        answer: [
          'Yes. Bing Places offers an import from Google Business Profile, which copies your details and can speed up verification.',
        ],
      },
      {
        question: 'Is Bing Places worth it?',
        answer: [
          'Yes. It is free, quick to set up, and covers searchers on Bing and Microsoft products.',
        ],
      },
    ],
  },
  {
    slug: 'review-gating',
    term: 'Review gating',
    aka: ['review filtering', 'selective review solicitation'],
    category: 'local',
    hat: 'black',
    risks: [
      'Reviews removed and restrictions on your Google Business Profile, because Google’s policies prohibit selectively soliciting positive reviews.',
      'Possible suspension of the profile for repeated policy violations.',
      'Legal risk in the US: the FTC’s Endorsement Guides say review gating that makes reviews substantially more positive can be deceptive, and the FTC has warned companies about it.',
      'Reputational damage if customers learn that unhappy customers were filtered out.',
      'Breaching other review platforms’ rules too: Trustpilot, for example, does not allow businesses to invite only customers they expect to be positive.',
    ],
    short: 'Review gating is asking customers how they feel first and only sending happy ones to leave public reviews. It breaks Google’s review policies.',
    definition: [
      'Review gating is the practice of screening customers before asking for a public review, then sending only satisfied customers to Google or another review site while steering unhappy ones to a private feedback form. A typical gate asks “How was your experience?” and only shows the Google review link to people who choose four or five stars.',
      'It violates Google’s policies for reviews, which prohibit discouraging negative reviews or selectively soliciting positive ones. It is also covered by consumer protection law: the US FTC’s Endorsement Guides, revised in 2023, include review gating as an example of a practice that can be unfair or deceptive when it makes posted reviews substantially more positive than they otherwise would be.',
    ],
    why: [
      'Gating distorts the rating people rely on to choose a business, which is why both Google and regulators treat it as deceptive. Some older review tools built gating in by default, so many businesses do it without realising.',
      'The white hat alternative is simple: ask every customer for a review in the same way, and use private feedback separately, not as a filter. See [online reviews](/glossary/online-reviews) and [review response rate](/glossary/review-response-rate).',
    ],
    how: {
      heading: 'How to spot and stop review gating',
      steps: [
        'Check your review request flow. If the public review link appears only after a positive rating, it is a gate.',
        'Check settings in any review management tool for “filter”, “routing” or “satisfaction threshold” features, and turn them off.',
        'Send every customer the same request with the same direct review link.',
        'Keep private feedback forms if you want them, but offer the public review link to everyone, whatever their answer.',
        'Reply to negative reviews publicly instead of trying to keep them off the platform.',
      ],
    },
    example: {
      body: 'What gating looks like: an email asks “Would you recommend us?” Clicking a happy face opens the Google review page. Clicking a sad face opens a form saying “Tell us privately how we can improve”, with no review link. That flow should be replaced with one request that gives everyone the review link.',
    },
    openseo: {
      body: 'Watch your Google reviews and reply rate in OpenSEO’s local SEO feature, so you can respond to honest negative reviews rather than filtering them out.',
      href: '/features/local-rank-tracker',
      label: 'Monitor your reviews',
    },
    related: ['fake-reviews', 'online-reviews', 'review-response-rate', 'google-business-profile', 'black-hat-seo', 'google-spam-policies'],
    faqs: [
      {
        question: 'Is review gating illegal?',
        answer: [
          'In the US, the FTC says review gating can be a deceptive practice under its Endorsement Guides when it makes reviews substantially more positive, and it has warned companies about it. Other countries have similar consumer protection rules. It also breaks Google’s policies.',
        ],
      },
      {
        question: 'Can I ask only happy customers for reviews?',
        answer: [
          'No. Google prohibits selectively soliciting positive reviews. Ask every customer the same way.',
        ],
      },
      {
        question: 'Can I still collect private feedback?',
        answer: [
          'Yes, as long as it is not used to stop unhappy customers from seeing the public review option.',
        ],
      },
    ],
  },
  {
    slug: 'fake-reviews',
    term: 'Fake reviews',
    aka: ['fake Google reviews', 'paid reviews', 'review fraud', 'astroturfing'],
    category: 'local',
    hat: 'black',
    risks: [
      'Legal risk in the US: the FTC’s rule on consumer reviews, in force since 21 October 2024, bans buying or selling fake reviews and lets the FTC seek civil penalties for each knowing violation.',
      'Legal risk elsewhere, such as the UK, where the Digital Markets, Competition and Consumers Act 2024 banned commissioning or publishing fake reviews from April 2025.',
      'Google removing the reviews and, in some cases, blocking new reviews or showing a warning on the profile that fake reviews were detected.',
      'Suspension of the Google Business Profile for repeated violations.',
      'Lasting reputational damage when customers, journalists or competitors expose the fake reviews.',
    ],
    short: 'Fake reviews are reviews by people who were not real customers, or that misrepresent their experience. They break Google’s policies and US FTC rules.',
    definition: [
      'Fake reviews are reviews that do not reflect a genuine customer’s real experience: reviews written by the business, its staff or friends, bought from review sellers, generated by AI, posted by people who never used the business, or negative reviews planted on a competitor. They violate Google’s policies.',
      'Google’s review policies prohibit fake engagement and reviews from people with a conflict of interest.',
      'In the US, fake reviews are also illegal under the FTC’s Trade Regulation Rule on the Use of Consumer Reviews and Testimonials, which took effect on 21 October 2024. It bans fake reviews and testimonials (including AI-generated ones), buying positive or negative reviews, undisclosed reviews by insiders, company-controlled “independent” review sites, suppressing reviews through threats, and buying fake social media indicators such as followers. The FTC can seek civil penalties against knowing violators.',
    ],
    why: [
      'Reviews influence both [local rankings](/glossary/local-ranking-factors) and customers’ choices, which is why some businesses are tempted to fake them. Google uses automated systems and human review to detect fake reviews, and removes large numbers every year.',
      'The white hat alternative is to earn genuine [online reviews](/glossary/online-reviews) by asking every customer, without incentives, and replying to what they say.',
    ],
    how: {
      heading: 'How to spot fake reviews',
      steps: [
        'Look for bursts: many five-star reviews in a few days after months of silence.',
        'Check reviewer profiles: brand-new accounts, no photo, or reviews for businesses in many distant cities.',
        'Watch for generic wording that could describe any business, or very similar phrasing across reviews.',
        'If a competitor appears to use fake reviews, report them through Google Maps’ review reporting or the business redressal form.',
        'If your own profile is targeted with fake negative reviews, flag each one, keep records, and reply calmly and factually.',
        'If someone in your business bought reviews, stop, ask Google to remove them, and do not hire any “reputation” service that offers to post reviews.',
      ],
    },
    example: {
      body: 'What it looks like: a new café gets 40 five-star Google reviews in one week, most from accounts with no other reviews, each saying “Amazing service, highly recommend!” with no detail about the food. This is the pattern Google’s systems and competitors look for.',
    },
    openseo: {
      body: 'Monitor your own and competitors’ Google reviews and reply rates in OpenSEO’s local SEO feature, so you notice unusual bursts of reviews early.',
      href: '/features/local-rank-tracker',
      label: 'Monitor reviews',
    },
    related: ['review-gating', 'online-reviews', 'review-response-rate', 'google-business-profile', 'black-hat-seo', 'google-spam-policies'],
    faqs: [
      {
        question: 'Are fake reviews illegal?',
        answer: [
          'In the US, yes: the FTC’s rule on consumer reviews, effective October 2024, bans buying, selling and writing fake reviews, with civil penalties for knowing violations. The UK and EU also have laws against them.',
        ],
      },
      {
        question: 'Can Google detect fake reviews?',
        answer: [
          'Google uses automated systems and human reviewers to detect policy-violating reviews and removes many before they are published. It is not perfect, so you can also report suspected fake reviews.',
        ],
      },
      {
        question: 'Can I ask friends and family to review my business?',
        answer: [
          'No, unless they are genuine customers, and even then Google’s policies flag conflicts of interest. Reviews from employees or relatives are not allowed.',
        ],
      },
    ],
  },
];
