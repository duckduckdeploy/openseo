import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'white-hat-seo',
    term: 'White hat SEO',
    aka: ['ethical SEO', 'white hat search engine optimisation'],
    category: 'spam',
    hat: 'white',
    short: 'White hat SEO is search optimisation that follows Google’s guidelines: useful content, a crawlable site and links you earn rather than buy.',
    definition: [
      'White hat SEO is the practice of improving a site’s search visibility using methods that follow search engines’ guidelines. It means writing content people want, making pages easy to crawl and understand, and earning links and mentions on merit, rather than trying to trick ranking systems.',
      'The name comes from old Western films, where the hero wore a white hat and the villain a black one. In SEO it marks the safe end of a scale that runs through [grey hat SEO](/glossary/grey-hat-seo) to [black hat SEO](/glossary/black-hat-seo). Google does not use the term itself. Its version is the Search Essentials: technical requirements, spam policies and key best practices. Work that stays inside those is white hat.',
      'In practice, white hat SEO covers the whole normal job: [keyword research](/glossary/keyword-research), [content optimisation](/glossary/content-optimization), technical fixes, internal linking, [structured data](/glossary/structured-data) that matches what is on the page, and [link building](/glossary/link-building) through things like [digital PR](/glossary/digital-pr), original research and broken link outreach.',
    ],
    why: [
      'White hat work compounds. A useful page keeps ranking after the next [core update](/glossary/core-update), links earned on merit keep passing value, and you never have to unpick anything. Shortcuts tend to work until a spam update or a manual reviewer catches them, and then the gains disappear, often with interest.',
      'It also protects the business behind the site. A client, investor or buyer can look at a white hat site’s backlinks and content without finding anything that needs hiding. If you are comparing approaches, the [white vs grey vs black hat comparison](/glossary/white-vs-grey-vs-black-hat-seo) sets them side by side.',
    ],
    how: {
      heading: 'How to do white hat SEO',
      steps: [
        'Start from search intent: find what people search for and what the top results give them, then build a page that answers it better.',
        'Make the site easy to crawl and index: clean internal links, a sitemap, correct canonicals, fast pages that work on mobile.',
        'Write for people first. Show real experience and expertise, cite sources, and keep pages up to date.',
        'Earn links with things worth linking to: data, tools, guides, expert comment for journalists. Label any paid placement with rel="sponsored".',
        'Measure with Search Console and rank tracking, and fix what the data shows rather than chasing tricks.',
      ],
    },
    openseo: {
      body: 'OpenSEO covers the white hat workflow end to end: keyword research, site audits, rank tracking, backlink analysis and Search Console data, all in one open-source app.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['grey-hat-seo', 'black-hat-seo', 'white-vs-grey-vs-black-hat-seo', 'google-spam-policies', 'link-building', 'content-optimization'],
    faqs: [
      {
        question: 'Is white hat SEO slower than black hat?',
        answer: ['Often at the start, yes. Black hat tactics can move rankings quickly, but those gains are fragile. White hat results build more slowly and tend to last through algorithm updates.'],
      },
      {
        question: 'Is paying for SEO services white hat?',
        answer: ['Yes. Paying someone to research, write, fix or promote your site is fine. What breaks Google’s rules is paying for links that pass ranking credit without a nofollow or sponsored label.'],
      },
      {
        question: 'Does Google reward white hat SEO?',
        answer: ['Google rewards pages that are helpful and reliable for the query. White hat SEO is simply the set of methods aimed at being that page, without breaking its spam policies.'],
      },
    ],
  },
  {
    slug: 'grey-hat-seo',
    term: 'Grey hat SEO',
    aka: ['gray hat SEO'],
    category: 'spam',
    hat: 'grey',
    risks: [
      'Tactics that look harmless at small scale can be judged a link scheme or spam once they become a pattern.',
      'Google’s policies and enforcement change. A March 2024 update turned some grey tactics, such as expired domain reuse and parasite pages, into named violations.',
      'A manual action or algorithmic demotion if the tactic crosses into what the spam policies describe.',
      'Money and time spent on links or pages that Google simply ignores.',
    ],
    short: 'Grey hat SEO covers tactics that are not banned outright but sit close to Google’s spam policies and can become spam when overdone.',
    definition: [
      'Grey hat SEO is the use of tactics that are not clearly forbidden by search engine guidelines but are not clearly safe either. They usually try to speed up results, and they become spam when done at scale, done mainly for rankings, or done in a way that hides who paid for what.',
      'Common grey hat tactics include [guest posting](/glossary/guest-posting) mainly for links, [link exchanges](/glossary/link-exchanges) between friendly sites, [niche edits](/glossary/niche-edits) where you ask for a link in an old article, buying [expired domains](/glossary/expired-domains) to redirect, and [clickbait titles](/glossary/clickbait-titles) that oversell a page. None is automatically a violation. Each has a version that is fine and a version that breaks Google’s link spam or scaled content rules.',
      'The grey zone exists because intent matters. Google’s link spam policy says links made “primarily” to manipulate rankings are spam. One guest article for a relevant audience is ordinary marketing. Fifty paid guest posts with exact-match anchors are a link scheme.',
    ],
    why: [
      'Most SEO arguments happen in the grey zone. You need to know where the line is so you can use the safe version of a tactic and stop before it becomes a pattern Google’s systems are built to catch.',
      'It also matters when you hire. Agencies that sell “safe” guest posts or link insertions are usually selling grey or black hat links. Read the [black hat SEO](/glossary/black-hat-seo) page for what happens when the line is crossed, and the [comparison](/glossary/white-vs-grey-vs-black-hat-seo) for how to tell the three apart.',
    ],
    how: {
      heading: 'How to keep grey hat tactics safe',
      steps: [
        'Ask whether you would do it if search engines did not exist. A guest article that brings readers passes; one written only for the link does not.',
        'Never exchange money, goods or free products for a followed link. If a placement is paid, it needs rel="sponsored" or rel="nofollow".',
        'Watch for patterns: the same anchor text, the same kind of site, the same template, repeated many times.',
        'Keep anchor text natural and the linking site relevant to yours.',
        'Review your link profile regularly and stop any tactic that is producing links you would not want a Google reviewer to see.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows your anchors, referring domains and monthly new and lost links, so you can see whether a tactic is turning into a pattern.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['white-hat-seo', 'black-hat-seo', 'white-vs-grey-vs-black-hat-seo', 'guest-posting', 'link-exchanges', 'niche-edits', 'link-schemes'],
    faqs: [
      {
        question: 'Is grey hat SEO safe?',
        answer: ['Some of it, done sparingly and honestly, is. The risk grows with scale and with how much of the tactic exists only for rankings.'],
      },
      {
        question: 'Is guest posting grey hat?',
        answer: ['It depends on the purpose. Writing for a relevant site to reach its readers is fine. Guest posts bought or written mainly for keyword-rich links are named in Google’s link spam policy.'],
      },
    ],
  },
  {
    slug: 'black-hat-seo',
    term: 'Black hat SEO',
    aka: ['black hat search engine optimisation', 'spamdexing', 'search spam'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A manual action from a Google reviewer, shown in Search Console’s Manual actions report, which can demote pages or remove the whole site from results until you fix the problem and pass a review.',
      'Algorithmic demotion by Google’s automated spam systems, including SpamBrain, with no notice and no review button. Recovery takes months of compliance.',
      'Deindexing: a site judged to be pure spam can drop out of Google entirely, taking all its organic traffic with it.',
      'Lost link value and wasted spend: when Google neutralises spammy links, whatever they were worth is gone for good, along with the money paid for them.',
      'Business, reputational and legal harm: lost revenue, angry clients and, for some tactics, legal exposure, such as fines under the US FTC rule on fake reviews or data breach duties after a hack.',
    ],
    short: 'Black hat SEO is the use of tactics that break search engines’ spam policies, such as paid links, cloaking or keyword stuffing, to rank faster.',
    definition: [
      'Black hat SEO is the use of deceptive or manipulative tactics that break search engines’ spam policies in order to rank higher. Instead of making a page more useful, it tries to trick ranking systems, for example with paid links, cloaking, hidden text, keyword stuffing or mass-produced pages. It risks penalties and removal from search results.',
      'The term is the opposite of [white hat SEO](/glossary/white-hat-seo), with [grey hat SEO](/glossary/grey-hat-seo) in between. Google does not grade tactics by hat. It publishes [spam policies](/glossary/google-spam-policies), and black hat SEO is anything that breaks them. Bing has similar rules in its Webmaster Guidelines.',
      'Black hat SEO falls into two groups. Content and on-page tricks change what is on your own site to fool ranking systems. Link tricks fake the votes of confidence that other sites give you. A third, smaller group targets other people’s sites, through hacking, spam comments or [negative SEO](/glossary/negative-seo).',
    ],
    why: [
      'People use black hat SEO because it can work in the short term. Earning links and writing good pages takes months. Buying a hundred links or publishing ten thousand templated pages takes days. In competitive niches, or for people running many throwaway sites, a few weeks of traffic can pay for the tactic before Google catches up. Some people also use it because an agency sold it to them as normal SEO.',
      'The catch is that the gains are borrowed. Google has spent more than two decades building systems to spot these patterns, and it now uses machine learning to do it at scale. When it catches a site, it does not just stop the trick from working. It can demote or remove the site, and the effort that went into the trick is lost.',
      'Manual actions. A Google reviewer can apply a [manual action](/glossary/manual-action) to pages or a whole site. You see it in Search Console’s Manual actions report, with a type such as “Unnatural links to your site”, “Cloaking and/or sneaky redirects” or “Major spam problems”. Affected pages rank lower or disappear until you fix every instance and a [reconsideration request](/glossary/reconsideration-request) is accepted. Google is explicit that fixing only some pages does not earn a partial return.',
      'Algorithmic demotion. Far more spam is handled by automated systems than by people. [SpamBrain](/glossary/spambrain), Google’s AI-based spam prevention system, and its other spam systems run all the time and get notable upgrades in named spam updates. An [algorithmic penalty](/glossary/algorithmic-penalty) arrives with no message and no review button. You only see a traffic drop, often lined up with an update date.',
      'Deindexing and lost link value. The worst cases are removed from Google’s index altogether, which is [deindexing](/glossary/deindexing). Links get a harsher rule: Google says that when its systems nullify spammy links, any ranking benefit they gave is lost and cannot be regained. Every pound or dollar spent on those links is gone, and the rankings they propped up fall back to where the site’s honest signals put them.',
      'Slow recovery. Cleaning up takes work: auditing thousands of links, rewriting or deleting pages, rebuilding a hacked server. Then you wait. Manual reviews take days or weeks, link cases longer. For algorithmic drops, Google says improvement can come once its systems learn over a period of months that a site complies. Many sites never return to their old peak, because the old peak was built on the spam.',
      'Business and reputational harm. For a business, a lost month of organic traffic is lost revenue, leads and bookings. Agencies that use black hat tactics on client sites put the client’s domain at risk without telling them, and the client carries the cost. When the tactic is public, such as fake reviews or spam comments with your brand in them, it damages trust with customers too.',
      'Legal exposure. Most black hat SEO only breaks Google’s rules. Some breaks the law. The US Federal Trade Commission’s rule on consumer reviews, in force since October 2024, bans buying or selling fake reviews and allows civil penalties, and the UK’s Digital Markets, Competition and Consumers Act banned fake reviews from April 2025. Hacking a site to plant links is a computer misuse offence, and if your site is hacked and personal data is exposed, data protection law such as the GDPR can require you to report it. Scraping and republishing other people’s work can infringe copyright and draw legal removal requests, which Google also counts against a site.',
      'How to recover. Confirm what happened (Manual actions and Security issues reports, update dates against your traffic). Remove the cause everywhere: take down or nofollow paid links, ask for bought links to be removed and [disavow](/glossary/disavow) what you cannot remove, delete or rewrite spam pages, close hacked entry points. Document all of it. If there is a manual action, submit a reconsideration request; if not, keep building white hat signals and wait for the next reassessment. The [penalty recovery](/glossary/google-penalty-recovery) page walks through each step.',
    ],
    how: {
      heading: 'Main black hat SEO techniques',
      body: [
        'Each of these has its own glossary page with what it looks like, the policy it breaks and how to clean it up.',
        'Content and on-page: [keyword stuffing](/glossary/keyword-stuffing) (cramming keywords into a page), [hidden text and links](/glossary/hidden-text) (text visitors cannot see), [cloaking](/glossary/cloaking) (showing Google different content from users), [sneaky redirects](/glossary/sneaky-redirects) (sending users somewhere other than what Google indexed), [doorway pages](/glossary/doorway-pages) (near-identical pages built to funnel searchers), [scraped content](/glossary/scraped-content) and [article spinning](/glossary/article-spinning) (copied or reworded content), [scaled content abuse](/glossary/scaled-content-abuse) (mass-produced pages with little value, whether written by AI, people or both), [thin affiliate pages](/glossary/thin-affiliate-pages) and [structured data spam](/glossary/structured-data-spam) (markup that misleads, such as fake review stars).',
        'Links: [link schemes](/glossary/link-schemes) in general, [paid links](/glossary/paid-links) that pass ranking credit, [private blog networks](/glossary/private-blog-network), [link farms](/glossary/link-farms) and [comment spam](/glossary/comment-spam).',
        'Abusing other sites or domains: [site reputation abuse](/glossary/site-reputation-abuse), also called parasite SEO (renting space on a strong site to rank third-party pages), [expired domain abuse](/glossary/expired-domain-abuse) (buying a trusted old domain to host unrelated content) and [hacked content](/glossary/hacked-content) (spam injected into someone else’s site).',
        'Faking signals: [CTR manipulation](/glossary/ctr-manipulation) with bots or paid clickers, [automated queries](/glossary/automated-queries) sent to Google without permission, and [fake reviews](/glossary/fake-reviews) or [review gating](/glossary/review-gating) on a business profile.',
      ],
    },
    example: {
      label: 'Signs a site you bought or an agency you hired used black hat SEO',
      body: 'A message in Search Console’s Manual actions or Security issues report.\nA backlink profile full of sites with no real audience, the same few exact-match anchors, or links from unrelated foreign-language pages.\nInvoices or reports that mention “guest posts”, “link insertions”, “PBN”, “high-DR links” or a fixed price per link.\nA sudden spike in referring domains in one month, followed by a traffic drop after a spam or core update.\nHundreds of near-identical city or keyword pages, or pages you did not create (often in another language) showing in a site: search.\nText that only appears when you view the source, or redirects that send mobile visitors somewhere else.\nReviews that arrived in bursts, from accounts with no other activity.',
    },
    openseo: {
      body: 'To check a site you bought or an agency’s work, run the backlink checker for paid-looking links, odd anchors and link spikes, and a site audit for hidden text, sneaky redirects and pages that should not be there.',
      href: '/tools/backlink-checker',
      label: 'Check a backlink profile',
    },
    related: ['white-hat-seo', 'grey-hat-seo', 'white-vs-grey-vs-black-hat-seo', 'google-spam-policies', 'manual-action', 'algorithmic-penalty', 'google-penalty-recovery', 'spambrain', 'link-schemes', 'cloaking'],
    faqs: [
      {
        question: 'Is black hat SEO illegal?',
        answer: [
          'Most black hat SEO is not a crime. It breaks Google’s rules, not the law, and the punishment is lost rankings. Some tactics do cross into law: hacking sites to inject links is computer misuse, fake reviews are banned by the US FTC’s 2024 rule and the UK’s DMCC Act, and scraping can infringe copyright.',
        ],
      },
      {
        question: 'Can black hat SEO still work?',
        answer: [
          'Sometimes, briefly. Spam still reaches page one in some niches, which is why people keep trying. But Google’s automated systems catch most of it over time, and when they do, the site usually loses more than it gained.',
        ],
      },
      {
        question: 'How long does a Google penalty last?',
        answer: [
          'A manual action stays until you fix the problem and Google accepts a reconsideration request; reviews take several days or weeks, longer for links. An algorithmic demotion has no fixed length. Google says sites can improve once its systems learn over a period of months that the site now complies.',
        ],
      },
      {
        question: 'Can a competitor hurt my site with black hat SEO?',
        answer: [
          'Rarely through links. Google says its systems ignore most spammy links pointing at a site, so a pile of junk backlinks usually does nothing. Hacking your site, posting fake reviews or filing false removal requests are more real threats, and you should report them.',
        ],
      },
      {
        question: 'How do I recover from black hat SEO?',
        answer: [
          'Find and remove every trace of the tactic, then either request review (for a manual action) or wait for Google to reassess (for an algorithmic drop). The [penalty recovery](/glossary/google-penalty-recovery) page has the step-by-step process.',
        ],
      },
    ],
  },
  {
    slug: 'white-vs-grey-vs-black-hat-seo',
    term: 'White hat vs grey hat vs black hat SEO',
    aka: ['white hat vs black hat SEO', 'white hat vs gray hat vs black hat SEO', 'SEO hats'],
    category: 'spam',
    short: 'White hat SEO follows Google’s rules, black hat SEO breaks its spam policies, and grey hat SEO sits in between, where tactics can tip into spam.',
    definition: [
      'White hat, grey hat and black hat SEO are labels for how a tactic relates to search engines’ rules. White hat SEO follows Google’s guidelines. Black hat SEO breaks its spam policies to manipulate rankings. Grey hat SEO is not clearly banned but sits close to the line and can become spam when overdone.',
      '[White hat SEO](/glossary/white-hat-seo) is the normal work of making a site useful and easy to understand: content that answers the query, a sound technical setup, and links earned because the page deserves them. Nothing about it needs hiding from a Google reviewer, a client or a journalist.',
      '[Black hat SEO](/glossary/black-hat-seo) is any tactic that breaks Google’s [spam policies](/glossary/google-spam-policies): buying followed links, [cloaking](/glossary/cloaking), hidden text, [keyword stuffing](/glossary/keyword-stuffing), mass-produced pages, renting space on strong sites, hacking. It aims at the ranking system, not the reader, and it usually depends on Google not noticing.',
      '[Grey hat SEO](/glossary/grey-hat-seo) is the large middle: guest posts written partly for links, [link exchanges](/glossary/link-exchanges), [niche edits](/glossary/niche-edits), redirecting [expired domains](/glossary/expired-domains), [clickbait titles](/glossary/clickbait-titles). Each has a legitimate version and a spam version. The difference is usually scale, payment and purpose.',
    ],
    why: [
      'The three differ on four things. Intent: white hat aims at users, black hat at the algorithm, grey hat at both. Disclosure: white hat has nothing to hide, black hat depends on hiding (unlabelled payments, content only Google sees), grey hat often keeps quiet about why something was done. Risk: white hat carries none from Google, black hat risks a [manual action](/glossary/manual-action) or algorithmic demotion, grey hat risks those once it becomes a pattern. Durability: white hat results tend to survive updates, black hat gains disappear when caught, grey hat gains are uncertain.',
      'The line also moves. In March 2024 Google added policies on [scaled content abuse](/glossary/scaled-content-abuse), [site reputation abuse](/glossary/site-reputation-abuse) and [expired domain abuse](/glossary/expired-domain-abuse), turning tactics many people called grey into named violations. A tactic that is grey today can be black next year, which is a good reason to stay well inside the line rather than on it.',
      'Knowing the labels helps when you hire. If an agency’s plan relies on buying links or publishing hundreds of near-identical pages, it is selling black hat work, whatever it calls it.',
    ],
    how: {
      heading: 'How to tell white, grey and black hat apart',
      steps: [
        'Would you do it if search engines did not exist? If the tactic only makes sense for rankings, it is at least grey.',
        'Does it pay for links? Money, goods, services or free products given for a followed link make it a paid link, which is black hat unless the link carries rel="sponsored" or rel="nofollow".',
        'Does it show users and Google different things? Cloaking, hidden text and sneaky redirects are black hat by definition.',
        'Would you be comfortable showing it to a Google reviewer, a client or a competitor? If it depends on nobody looking closely, it is black hat.',
        'Is it a one-off or a pattern? One reciprocal link with a partner is normal. Hundreds of swapped links, guest posts or templated pages are a scheme.',
        'Does it add value of its own? Pages that copy, spin or mass-produce content without adding anything break the scraping and scaled content policies.',
        'Does it use someone else’s site or reputation? Hosting third-party pages to borrow a site’s ranking power, or planting content without permission, is black hat.',
      ],
    },
    example: {
      label: 'Common techniques, labelled by hat',
      body: 'Writing a guide that answers the query — white hat\nFixing broken links, slow pages and crawl errors — white hat\nPitching original data to journalists for coverage (digital PR) — white hat\nAsking a site that mentions you to add a link — white hat\nA paid placement marked rel="sponsored" — white hat\nWriting a guest post for a relevant site’s readers — white hat to grey hat\nA guest post written mainly for a keyword-rich link — grey hat\nSwapping links with a partner site — grey hat (link exchange)\nAsking a site to add your link to an old article — grey hat (niche edit)\nRedirecting a relevant expired domain to your site — grey hat\nA headline that oversells the page — grey hat (clickbait)\nBuying a link on a niche blog — black hat (paid link)\nRunning a network of sites to link to yourself — black hat (PBN)\nRepeating a keyword dozens of times on a page — black hat (keyword stuffing)\nWhite text on a white background — black hat (hidden text)\nShowing Googlebot a different page from users — black hat (cloaking)\nHundreds of near-identical city pages — black hat (doorway pages)\nPublishing thousands of unedited AI pages for search traffic — black hat (scaled content abuse)\nRenting a section of a news site for coupon pages — black hat (site reputation abuse)\nBuying or incentivising fake reviews — black hat (fake reviews)',
    },
    openseo: {
      body: 'Use the backlink checker to see which kind of links a site actually has, and a site audit to catch hidden text, redirects and thin pages before Google does.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['white-hat-seo', 'grey-hat-seo', 'black-hat-seo', 'google-spam-policies', 'link-schemes', 'manual-action'],
    faqs: [
      {
        question: 'What is the difference between white hat and black hat SEO?',
        answer: ['White hat SEO improves a site within Google’s guidelines. Black hat SEO breaks Google’s spam policies to rank faster, and risks penalties or removal from results.'],
      },
      {
        question: 'Is grey hat SEO allowed?',
        answer: ['Grey hat tactics are not banned outright, but Google judges them by purpose and pattern. Done at scale or for paid links, they become spam.'],
      },
      {
        question: 'Does Google use the terms white hat and black hat?',
        answer: ['Not officially. Google publishes Search Essentials and spam policies; the hat labels are the SEO industry’s shorthand for where a tactic sits against those rules.'],
      },
    ],
  },
  {
    slug: 'google-spam-policies',
    term: 'Google spam policies',
    aka: ['Google spam policies for web search', 'Google webmaster guidelines', 'Google Search Essentials spam policies'],
    category: 'spam',
    short: 'Google’s spam policies list the practices that can get a site demoted or removed from Google Search, from cloaking and link spam to scaled content abuse.',
    definition: [
      'Google’s spam policies are the rules, published in Google Search Central, that describe practices Google treats as spam in web search. Sites that break them may rank lower or not appear in results at all, through automated systems or a manual action from a human reviewer.',
      'The policies are part of Google Search Essentials, which replaced the old Webmaster Guidelines in 2022. The named policies are: cloaking, doorway abuse, expired domain abuse, hacked content, hidden text and link abuse, keyword stuffing, link spam, machine-generated traffic, malicious practices (malware, unwanted software and back button hijacking), misleading functionality, scaled content abuse, scraping, site reputation abuse, sneaky redirects, thin affiliation and user-generated spam.',
      'A further section covers other behaviour that can lead to demotion: a high volume of valid legal removal requests, exploitative personal information removal practices, policy circumvention (moving a violation to a new subdomain or site) and scam and fraud. Expired domain abuse, scaled content abuse and site reputation abuse were added in March 2024.',
    ],
    why: [
      'The spam policies are the line between [white hat](/glossary/white-hat-seo) and [black hat SEO](/glossary/black-hat-seo). Every glossary entry for a black hat technique maps to one of them, and every [manual action](/glossary/manual-action) type in Search Console points back to them.',
      'Google detects violations with automated systems, including [SpamBrain](/glossary/spambrain), and with human review. Anyone can report suspected spam to Google. Knowing the exact policies helps you avoid tactics that sound reasonable but are named violations, such as reusing an [expired domain](/glossary/expired-domain-abuse) for unrelated content or publishing thousands of templated pages.',
    ],
    how: {
      heading: 'How to check your site against the spam policies',
      steps: [
        'Read the policy list on Google Search Central once in full; it is short and gives examples for each.',
        'Check Search Console’s Manual actions and Security issues reports.',
        'Audit your backlinks for bought, swapped or networked links, and your outbound links for paid links without rel="sponsored".',
        'Crawl the site for hidden text, unexpected redirects, thin or near-duplicate pages and pages you did not create.',
        'Review any third-party or user-generated sections, which are common sources of site reputation abuse and user-generated spam.',
      ],
    },
    openseo: {
      body: 'The site audit crawls every page and flags thin pages, duplicates, redirects and other technical issues that overlap with the spam policies.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['black-hat-seo', 'manual-action', 'spambrain', 'link-schemes', 'scaled-content-abuse', 'site-reputation-abuse', 'cloaking'],
    faqs: [
      {
        question: 'Where are Google’s spam policies?',
        answer: ['On Google Search Central, under Search Essentials, on the page titled “Spam policies for Google web search”.'],
      },
      {
        question: 'What happens if you break Google’s spam policies?',
        answer: ['Your pages may rank lower or be removed from results. That can happen automatically or through a manual action, which you see in Search Console.'],
      },
      {
        question: 'Do Google’s spam policies apply to AI content?',
        answer: ['They apply to how content is made and why, not the tool. Google says using automation, including AI, to mass-produce pages mainly to manipulate rankings is scaled content abuse.'],
      },
    ],
  },
  {
    slug: 'manual-action',
    term: 'Manual action (Google penalty)',
    aka: ['manual penalty', 'Google penalty', 'manual action penalty'],
    category: 'spam',
    short: 'A manual action is a penalty a Google reviewer applies when a site breaks its spam policies, demoting or removing pages until the issue is fixed.',
    definition: [
      'A manual action is a penalty applied by a human reviewer at Google when they find that pages on a site break Google’s spam policies. Affected pages, or the whole site, can rank lower or be removed from search results. Google tells you about it in Search Console’s Manual actions report.',
      'Each manual action has a type and a scope: site-wide or partial (some pages or sections). Spam-related types include unnatural links to your site, unnatural links from your site, thin content with little or no added value, cloaking and/or sneaky redirects, hidden text and/or keyword stuffing, user-generated spam, site abused with third-party spam, spammy free host, major spam problems, cloaked images, sneaky mobile redirects, structured data issue, back button hijacking, AMP content mismatch and site reputation policy. There are separate types for News and Discover policy violations.',
      'Manual actions are different from an [algorithmic penalty](/glossary/algorithmic-penalty). A manual action comes with a notice and a way to ask for review. An algorithmic demotion has neither.',
    ],
    why: [
      'A manual action can wipe out a site’s [organic traffic](/glossary/organic-traffic) overnight, and it stays until you fix the problem and Google accepts a [reconsideration request](/glossary/reconsideration-request). It is the clearest consequence of [black hat SEO](/glossary/black-hat-seo).',
      'The upside is that it is specific. The report tells you the type and gives example URLs, so you know what to fix. Google is strict about scope, though: fixing only some affected pages does not earn a partial return.',
    ],
    how: {
      heading: 'How to check for a manual action',
      steps: [
        'Open Google Search Console for the property and go to Security & Manual Actions, then Manual actions.',
        '“No issues detected” means there is no manual action. Otherwise, expand each action to see its type, scope and sample URLs.',
        'Read Google’s description of that type and its fix steps.',
        'Fix the issue on every affected page, not just the samples, and make sure Google can crawl those pages.',
        'Click Request Review and explain what was wrong, what you changed and the result. See the [penalty recovery](/glossary/google-penalty-recovery) guide for detail.',
      ],
    },
    openseo: {
      body: 'If the action is for unnatural links, the backlink checker lists your referring domains, anchors and link history so you can find the links to remove or disavow.',
      href: '/tools/backlink-checker',
      label: 'Audit your backlinks',
    },
    related: ['reconsideration-request', 'google-penalty-recovery', 'algorithmic-penalty', 'google-spam-policies', 'google-search-console', 'deindexing'],
    faqs: [
      {
        question: 'How do I know if I have a Google penalty?',
        answer: ['Check the Manual actions report in Search Console. If it is clear but traffic fell sharply around a spam or core update date, you may have an algorithmic demotion instead.'],
      },
      {
        question: 'Do manual actions expire?',
        answer: ['Google does not publish an expiry rule. The reliable way to lift one is to fix every instance of the problem and have a reconsideration request accepted.'],
      },
      {
        question: 'Does a manual action affect the whole site?',
        answer: ['Not always. The report shows whether it is site-wide or partial, and partial actions affect only the listed pages or sections.'],
      },
    ],
  },
  {
    slug: 'algorithmic-penalty',
    term: 'Algorithmic penalty',
    aka: ['algorithmic demotion', 'algorithmic action'],
    category: 'spam',
    short: 'An algorithmic penalty is a ranking drop caused by Google’s automated systems, not a human reviewer, with no notice in Search Console.',
    definition: [
      'An algorithmic penalty is a loss of rankings caused by Google’s automated systems rather than a human reviewer. It happens when systems such as SpamBrain or Google’s core ranking systems judge a site’s content or links as spammy or unhelpful. There is no notice in Search Console and no review request to file.',
      'Google does not use the word “penalty” for these. It talks about systems that demote or ignore content. The best-known historical examples are Panda (low-quality content, folded into core ranking in 2015), Penguin (link spam, part of core ranking since 2016) and the helpful content system (part of core ranking since March 2024). Today, [SpamBrain](/glossary/spambrain) and the other spam systems handle most spam, with notable changes announced as spam updates.',
      'For links, an algorithmic hit often means the spammy links are simply ignored. Rankings fall because the support they gave is gone, not because the site is punished on top.',
    ],
    why: [
      'Most sites hurt by spam tactics never see a [manual action](/glossary/manual-action). They see a traffic graph that drops around a [Google algorithm update](/glossary/google-algorithm-update) and nothing in Search Console to explain it, which makes the cause harder to diagnose.',
      'Recovery is slower too. Google says that after a spam update, changes may help if its systems “learn over a period of months” that the site complies. For links that have been neutralised, it says any benefit they gave is lost and cannot be regained.',
    ],
    how: {
      heading: 'How to diagnose an algorithmic penalty',
      steps: [
        'Rule out a manual action and security issue in Search Console first.',
        'Line up the traffic drop against Google’s published ranking update dates (core updates, spam updates).',
        'Check whether the drop hit the whole site or specific sections, and which queries fell in the Search Console Performance report.',
        'If it lines up with a spam update, audit for policy breaches: bought links, scaled or scraped pages, thin affiliate content.',
        'If it lines up with a core update and you find no spam, the issue is more likely content quality or relevance; improve the pages that lost most.',
        'Fix what you find, then keep publishing and earning links the white hat way. There is nothing to submit.',
      ],
    },
    openseo: {
      body: 'Search performance compares periods from your Search Console data, so you can see exactly which pages and queries lost clicks after an update.',
      href: '/features/search-performance',
      label: 'Compare search performance',
    },
    related: ['manual-action', 'spambrain', 'core-update', 'google-algorithm-update', 'google-penalty-recovery', 'helpful-content'],
    faqs: [
      {
        question: 'Can you submit a reconsideration request for an algorithmic penalty?',
        answer: ['No. Reconsideration requests only exist for manual actions. For algorithmic drops you fix the issues and wait for Google’s systems to reassess the site.'],
      },
      {
        question: 'Is a core update drop a penalty?',
        answer: ['Not usually. Google says core updates reassess content overall and a drop does not mean a site broke its rules. Spam updates are the ones aimed at policy breaches.'],
      },
    ],
  },
  {
    slug: 'google-penalty-recovery',
    term: 'Google penalty recovery',
    aka: ['penalty removal', 'recovering from a Google penalty', 'manual action recovery'],
    category: 'spam',
    short: 'Google penalty recovery is the process of finding and fixing spam policy breaches so a site regains rankings after a manual action or demotion.',
    definition: [
      'Google penalty recovery is the work of restoring a site’s rankings after a manual action or algorithmic demotion. It means finding what broke Google’s spam policies, fixing every instance of it, documenting the fixes and, for a manual action, asking Google to review the site through a reconsideration request.',
      'Recovery has two tracks. A [manual action](/glossary/manual-action) has a clear end: when Google accepts your review request, the action is revoked. An [algorithmic penalty](/glossary/algorithmic-penalty) has no request to file; you fix the problem and wait for Google’s systems to reassess, which Google says can take months.',
      'Recovery rarely means a full return to the old peak. If rankings were held up by bought links or spam pages, removing them removes that support. The goal is a clean site that can grow again on honest signals.',
    ],
    why: [
      'A penalty can cut most of a site’s traffic, so a quick, complete fix matters. Half-fixes waste time: Google says fixing the issue on just some pages will not earn a partial return, and a rejected request means another round of review.',
      'Recovery is also common after buying a site or changing agency, when you inherit someone else’s [black hat SEO](/glossary/black-hat-seo). Knowing the process lets you clean up properly rather than just stopping the tactic.',
    ],
    how: {
      heading: 'How to recover from a Google penalty',
      steps: [
        'Identify the type. Check Search Console’s Manual actions and Security issues reports. If both are clear, compare the drop date with Google’s spam and core update dates.',
        'Collect evidence. Export the sample URLs from the manual action, your full backlink list and a full crawl of the site.',
        'For link problems: list bought, swapped, PBN and other unnatural links. Ask site owners to remove them or add rel="nofollow" or rel="sponsored", keeping a record of each request. [Disavow](/glossary/disavow) the domains you cannot get removed.',
        'For unnatural links from your site: remove paid outbound links or mark them rel="sponsored" or rel="nofollow".',
        'For content problems: delete or rewrite thin, scraped, spun, doorway or mass-produced pages; remove hidden text and keyword stuffing; fix redirects and cloaking.',
        'For hacked content: clean the site, close the security hole, change passwords and update software, then check that the spam pages are gone.',
        'Make sure Google can crawl the fixed pages (no login, robots.txt block or noindex in the way), and test them with the URL Inspection tool.',
        'For a manual action, submit a [reconsideration request](/glossary/reconsideration-request) that explains the issue, the steps you took and the outcome. Do not resubmit while one is pending.',
        'For an algorithmic drop, there is nothing to submit. Keep the site clean and invest in [white hat SEO](/glossary/white-hat-seo) while Google reassesses.',
      ],
    },
    openseo: {
      body: 'Use the backlink checker to export referring domains and anchors for a link cleanup, and the site audit to find thin, duplicate and redirected pages.',
      href: '/tools/backlink-checker',
      label: 'Start a link audit',
    },
    related: ['manual-action', 'reconsideration-request', 'algorithmic-penalty', 'disavow', 'toxic-backlinks', 'black-hat-seo'],
    faqs: [
      {
        question: 'How long does Google penalty recovery take?',
        answer: ['For a manual action, Google says most reviews take several days or weeks, longer for link cases, after you have fixed everything. Algorithmic recoveries can take months.'],
      },
      {
        question: 'Will my rankings come back after a penalty is lifted?',
        answer: ['They can recover, but often not to the old level if the old rankings depended on the spam you removed.'],
      },
      {
        question: 'Should I start a new domain instead?',
        answer: ['Sometimes people do, but Google’s policy circumvention rules cover moving violations to new sites. Starting again only helps if the new site is clean.'],
      },
    ],
  },
  {
    slug: 'reconsideration-request',
    term: 'Reconsideration request',
    aka: ['request review', 'manual action review'],
    category: 'spam',
    short: 'A reconsideration request asks Google to review a site after you fix the issue behind a manual action, so the action can be lifted.',
    definition: [
      'A reconsideration request is a request, sent through Google Search Console, asking Google to review a site after you have fixed the problems that caused a manual action. If a reviewer agrees the site now complies with Google’s spam policies, the manual action is revoked.',
      'You send it from the Manual actions report with the Request Review button. Security issues, such as hacked content, have their own review request in the Security issues report. Google emails you when the request is received and again when the review is done. Requests apply only to manual actions; there is nothing to request for an [algorithmic penalty](/glossary/algorithmic-penalty).',
    ],
    why: [
      'It is the only way to lift a [manual action](/glossary/manual-action) on purpose. A good request gets the action lifted on the first try. A vague one, or one sent before every page is fixed, gets rejected and costs weeks.',
      'Google says a good request explains the exact quality issue, describes the steps you took to fix it and documents the outcome. For link actions, that means showing which links you removed, which you could not remove and how you [disavowed](/glossary/disavow) the rest.',
    ],
    how: {
      heading: 'How to write a reconsideration request',
      steps: [
        'Fix the issue on every affected page first, and check Google can crawl those pages.',
        'Open Search Console, go to Manual actions and click Request Review on the action.',
        'Name the problem plainly, for example “we bought links through an agency in 2024–2025”, without blaming Google or making excuses.',
        'List what you did: pages removed or rewritten, links removed, outreach sent, the disavow file uploaded, the security hole closed.',
        'Link to evidence, such as a shared spreadsheet of removal requests and responses.',
        'Say how you will stop it happening again, for example new rules for agencies or a review of user-generated content.',
        'Submit once and wait. Most reviews take several days or weeks, link reviews longer. Do not resubmit while a request is pending.',
        'If it is rejected, read the response, fix what remains and submit again.',
      ],
    },
    example: {
      label: 'Outline of a reconsideration request',
      body: 'Issue: Unnatural links to our site, from paid guest posts bought by a previous agency between 2023 and 2025.\nWhat we did: audited all 1,240 referring domains; contacted 310 site owners (log linked); 142 links removed; the remaining 168 domains disavowed (file uploaded on 3 October).\nPrevention: we no longer buy links, and any sponsored content now uses rel="sponsored".',
    },
    openseo: {
      body: 'The backlink checker lists every referring domain with its anchors, which is a solid starting point for the link audit your request needs to describe.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['manual-action', 'google-penalty-recovery', 'disavow', 'google-search-console', 'toxic-backlinks'],
    faqs: [
      {
        question: 'How long does a reconsideration request take?',
        answer: ['Google says most take several days or weeks, and link-related requests can take longer. You get an email when it is done.'],
      },
      {
        question: 'What if my reconsideration request is rejected?',
        answer: ['The response explains that issues remain. Fix more thoroughly, add evidence and submit a new request.'],
      },
    ],
  },
  {
    slug: 'spambrain',
    term: 'SpamBrain',
    aka: ['Google SpamBrain'],
    category: 'spam',
    short: 'SpamBrain is Google’s AI-based spam prevention system, used to detect spam content and link spam in search results.',
    definition: [
      'SpamBrain is Google’s AI-based spam prevention system. It uses machine learning to detect sites and pages that break Google’s spam policies, including spammy content, sites that buy links and sites used to pass links, so they can be demoted or ignored in search results.',
      'Google first described SpamBrain by name in 2022, in its webspam report, and said it had been using the system since 2018. In the December 2022 link spam update, Google said SpamBrain could now detect both sites buying links and sites used to sell them, and neutralise those links. Google lists it among its spam detection systems and says it improves them over time, with notable changes released as spam updates.',
    ],
    why: [
      'SpamBrain is why [black hat SEO](/glossary/black-hat-seo) has become a worse bet. Spam used to be caught by rules a clever spammer could learn to dodge. A learning system can pick up new patterns, such as a fresh type of [PBN](/glossary/private-blog-network) or a new kind of [scaled content](/glossary/scaled-content-abuse), without anyone writing a rule for it.',
      'It works without notice. If SpamBrain demotes your site or neutralises your links, there is no message in Search Console, only an [algorithmic](/glossary/algorithmic-penalty) drop. Google says link value lost this way cannot be regained.',
    ],
    how: {
      heading: 'How to stay clear of SpamBrain',
      steps: [
        'Do not buy, sell or swap followed links; label paid placements with rel="sponsored".',
        'Do not publish content at scale without adding value, whether written by people or AI.',
        'Keep your site secure so it is not hacked and used to host spam.',
        'If traffic drops on a spam update date, audit for policy breaches and fix them, then wait for reassessment.',
      ],
    },
    related: ['algorithmic-penalty', 'google-spam-policies', 'link-schemes', 'paid-links', 'scaled-content-abuse', 'google-algorithm-update'],
    faqs: [
      {
        question: 'What does SpamBrain detect?',
        answer: ['Google says it targets content and behaviour that break its spam policies, including spam sites and link spam. Google does not publish how it works in detail.'],
      },
      {
        question: 'Can SpamBrain penalise good sites by mistake?',
        answer: ['No system is perfect, but Google’s documentation focuses on spam. If you have done nothing that breaks the policies, a drop is more likely a core update or a technical problem.'],
      },
    ],
  },
  {
    slug: 'deindexing',
    term: 'Deindexing',
    aka: ['deindexed', 'removed from Google index', 'de-indexing'],
    category: 'spam',
    short: 'Deindexing is when pages or a whole site are removed from a search engine’s index, so they no longer appear in results at all.',
    definition: [
      'Deindexing is the removal of pages, or a whole site, from a search engine’s index, so they no longer appear in search results at all. It can be a penalty for serious spam, the result of a technical mistake such as a stray noindex tag, or something a site owner does on purpose.',
      'Google can drop sites that break its spam policies badly, for example through a “Major spam problems” [manual action](/glossary/manual-action) for aggressive spam. But most deindexing in practice is self-inflicted: a [noindex](/glossary/noindex) tag left on after a redesign, a robots.txt block on the whole site with no other way for Google to see the pages, server errors, or pages Google judges too thin or duplicated to keep in its [index](/glossary/indexing).',
      'Deindexing on purpose is normal too. You might noindex internal search results, use Search Console’s Removals tool to hide a page urgently, or prune low-value pages.',
    ],
    why: [
      'A deindexed page cannot get any organic traffic. For a whole site, that is the most severe outcome of [black hat SEO](/glossary/black-hat-seo) and the first thing to rule out when traffic falls to near zero.',
      'Because technical causes are common, check them before assuming a penalty. The fix for a stray noindex takes minutes; the fix for a spam penalty takes months.',
    ],
    how: {
      heading: 'How to check if a page is deindexed',
      steps: [
        'Use the URL Inspection tool in Search Console to see whether the URL is on Google and why not if it is not.',
        'Check the Page indexing report for excluded pages and the reasons given.',
        'Check the Manual actions and Security issues reports.',
        'Look for noindex in the page’s meta robots tag or X-Robots-Tag header, and for robots.txt rules blocking the page.',
        'Fix the cause, then request indexing for important URLs and resubmit the sitemap.',
      ],
    },
    openseo: {
      body: 'The site audit flags pages with noindex, blocked by robots.txt or returning errors, which are the most common accidental causes of deindexing.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['indexing', 'noindex', 'manual-action', 'robots-txt', 'google-search-console', 'black-hat-seo'],
    faqs: [
      {
        question: 'How do I know if my site is deindexed?',
        answer: ['Check the Page indexing report and URL Inspection in Search Console. A site: search gives a rough idea but is not a reliable count.'],
      },
      {
        question: 'Can a deindexed site come back?',
        answer: ['Yes. Fix the cause, then Google can recrawl and reindex. For a manual action, you also need an accepted reconsideration request.'],
      },
    ],
  },
  {
    slug: 'negative-seo',
    term: 'Negative SEO',
    aka: ['negative SEO attack'],
    category: 'spam',
    hat: 'black',
    risks: [
      'For the attacker: hacking or fake reviews can break computer misuse and consumer protection laws, and fake removal requests can amount to fraud.',
      'For the target: hacked pages or injected spam can trigger a security warning or manual action until cleaned up.',
      'For the target: fake negative reviews can hurt local rankings and conversions until they are removed.',
      'Wasted effort on both sides: Google ignores most spammy links, so link attacks and panicked mass disavows usually achieve nothing.',
    ],
    short: 'Negative SEO is the use of black hat tactics against someone else’s site, such as spammy links, hacking or fake reviews, to hurt its rankings.',
    definition: [
      'Negative SEO is the use of black hat tactics against a competitor’s site to make it rank lower. The usual forms are pointing thousands of spammy links at the site, hacking it to inject spam, copying its content elsewhere, posting fake negative reviews and filing false removal requests.',
      'It is labelled black hat because it is done to others, not because the target did anything wrong. Google’s position is that negative SEO is rarely effective. Its systems are built to ignore most spammy links rather than count them against a site, and Google has said for years that it works hard to stop third parties harming sites this way.',
      'The forms that do cause harm are the ones that change the target site itself or its reputation directly: hacking, which can get spam pages indexed under the site’s name, and [fake reviews](/glossary/fake-reviews) on its Google Business Profile.',
    ],
    why: [
      'Fear of negative SEO drives a lot of bad decisions, mainly mass disavowing of every odd link. Most sites collect some junk links naturally, and Google already ignores them. Disavowing good links by mistake can do more damage than the attack.',
      'Knowing the real risks lets you spend effort where it counts: site security, review monitoring and checking Search Console, rather than chasing every spam domain in your [link profile](/glossary/link-profile).',
    ],
    how: {
      heading: 'How to protect against negative SEO',
      steps: [
        'Keep the site secure: update the CMS and plugins, use strong passwords and two-factor login, and check the Security issues report in Search Console.',
        'Watch your backlink profile monthly for sudden spikes of spammy links, but do not act on them unless something changes.',
        'Use the [disavow tool](/glossary/disavow) only when you have a manual action for unnatural links, or when you believe a large set of spammy links is likely to cause one. Google says most sites never need it.',
        'Monitor your reviews and report fake ones through Google Business Profile.',
        'If your content is copied and outranks you, file a copyright removal request.',
        'Report spam to Google through its spam report form.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows new and lost links month by month, so a sudden flood of spammy domains stands out and you can judge whether it needs action.',
      href: '/tools/backlink-checker',
      label: 'Monitor your backlinks',
    },
    related: ['disavow', 'toxic-backlinks', 'black-hat-seo', 'hacked-content', 'fake-reviews', 'link-profile'],
    faqs: [
      {
        question: 'Does negative SEO work?',
        answer: ['Rarely, through links. Google says it ignores most spammy links. Hacking and fake reviews can do real harm, which is why security and review monitoring matter more.'],
      },
      {
        question: 'Should I disavow spammy links pointing to my site?',
        answer: ['Usually not. Google suggests disavowing only if you have, or expect, a manual action for unnatural links, for example after buying links in the past.'],
      },
      {
        question: 'How do I know if I am under a negative SEO attack?',
        answer: ['Signs include a sudden flood of spammy links with explicit anchors, pages appearing on your site that you did not create, or a burst of one-star reviews from new accounts.'],
      },
    ],
  },
  {
    slug: 'keyword-stuffing',
    term: 'Keyword stuffing',
    aka: ['keyword spamming'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Hidden text and/or keyword stuffing” manual action in Search Console.',
      'Algorithmic demotion: stuffed pages read as low quality and tend to rank worse, not better.',
      'Lower conversions, because stuffed copy is hard to read and looks untrustworthy.',
      'Wasted time writing and maintaining copy that only exists for search engines.',
    ],
    short: 'Keyword stuffing is filling a page with keywords, numbers or place names in an unnatural way to manipulate rankings, against Google’s spam policies.',
    definition: [
      'Keyword stuffing is loading a web page with keywords or numbers in an attempt to manipulate its rankings, so the words appear out of context or in unnatural lists and repeats. It breaks Google’s spam policy on keyword stuffing and makes pages harder to read.',
      'Google’s examples include lists of phone numbers with no real value, blocks of text listing the cities and regions a page wants to rank for, and repeating the same words so often the text sounds unnatural. Stuffing can also hide in title tags, alt text, meta tags and footers, or be combined with [hidden text](/glossary/hidden-text).',
      'It is a leftover from early search engines that counted keyword repeats. Modern ranking systems understand topics, synonyms and context, so repeating a phrase adds nothing and can trigger spam systems.',
    ],
    why: [
      'Keyword stuffing is still common, often by accident, when people follow outdated [keyword density](/glossary/keyword-density) targets. Google has no ideal density.',
      'The white hat alternative is [content optimisation](/glossary/content-optimization): use the main keyword where it fits naturally (title, H1, opening), cover related subtopics and questions, and write for the reader.',
    ],
    how: {
      heading: 'How to spot and fix keyword stuffing',
      steps: [
        'Read the page aloud. If a phrase repeats in a way a person would not write, it is stuffed.',
        'Look for lists of city names, keyword variants or phone numbers in footers and sidebars.',
        'Check title tags and alt text for strings of comma-separated keywords.',
        'Rewrite with one clear use of the main keyword where it belongs, and synonyms and related terms elsewhere.',
        'Replace location lists with genuine [local landing pages](/glossary/local-landing-pages) only where you really serve that area with something specific to say.',
      ],
    },
    example: {
      label: 'What keyword stuffing looks like',
      body: 'Looking for cheap plumbers London? Our cheap plumbers London team are the best cheap plumbers London has. Call cheap plumbers London today. We cover London, Camden, Hackney, Islington, Brixton, Croydon, Ealing, Barnet...',
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings and shows the keywords it actually ranks for, which helps you write naturally instead of repeating one phrase.',
      href: '/tools/page-analyser',
      label: 'Analyse a page',
    },
    related: ['keyword-density', 'content-optimization', 'hidden-text', 'black-hat-seo', 'manual-action', 'lsi-keywords'],
    faqs: [
      {
        question: 'How many times should a keyword appear on a page?',
        answer: ['There is no set number. Use it where it reads naturally, usually in the title, H1 and early on, and let related words do the rest.'],
      },
      {
        question: 'Is keyword stuffing in meta keywords a problem?',
        answer: ['Google ignores the meta keywords tag, so it neither helps nor counts as visible stuffing, but it is wasted effort.'],
      },
    ],
  },
  {
    slug: 'cloaking',
    term: 'Cloaking',
    aka: ['SEO cloaking'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Cloaking and/or sneaky redirects” manual action, or “Major spam problems” for aggressive cases.',
      'Removal from search results for the cloaked pages or the whole site.',
      'If the cloaking comes from a hack, users may be sent to harmful pages and browsers may show security warnings.',
      'Loss of trust from users who land on something other than what the search result promised.',
    ],
    short: 'Cloaking is showing search engines different content from what users see in order to manipulate rankings, which breaks Google’s spam policies.',
    definition: [
      'Cloaking is the practice of showing different content to search engines than to users in order to manipulate search rankings and mislead people. The server detects a crawler like Googlebot and serves it one page, while human visitors get something else. It is a clear breach of Google’s cloaking policy.',
      'Google’s examples include showing a page about travel destinations to search engines while users see a page about discount drugs, and inserting text or keywords only when the request comes from a search engine. Cloaked images, where Google Images sees a different picture from the site, have their own manual action type.',
      'Not every difference is cloaking. Paywalls and subscription content are fine if Google sees the full content you show subscribers and you follow Google’s guidance on flexible sampling. Showing different layouts to mobile and desktop users, or translating for different languages, is fine when the content is the same for Googlebot and users in the same situation.',
    ],
    why: [
      'Cloaking is one of the oldest and most clearly banned tactics. It is also a common sign of a hacked site: attackers often cloak injected spam so the owner sees a normal page while Google sees pharma or casino links.',
      'The white hat alternative is to make the real page good enough to rank: [content optimisation](/glossary/content-optimization), and [server-side rendering](/glossary/server-side-rendering) if you worry Googlebot cannot see JavaScript content.',
    ],
    how: {
      heading: 'How to check a site for cloaking',
      steps: [
        'Use URL Inspection in Search Console and view the crawled page and screenshot. Compare it with what you see in a browser.',
        'Compare the title and snippet Google shows for the page with the live page; big differences are a warning sign.',
        'Look in server config, CDN rules and plugins for logic that changes content by user agent or IP for search engines.',
        'If you find cloaking you did not add, treat the site as hacked: clean it, close the hole and request review.',
        'Remove any intentional cloaking and serve everyone the same content, then request review if there is a manual action.',
      ],
    },
    example: {
      label: 'What cloaking looks like',
      body: 'A search result shows “Beginner’s guide to houseplants” with a matching snippet. Clicking it opens a page selling replica watches. URL Inspection shows Googlebot sees the houseplant guide; your browser never does.',
    },
    openseo: {
      body: 'The site audit crawls pages as a crawler would and flags unexpected redirects and content issues, a useful first check alongside URL Inspection.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['sneaky-redirects', 'hacked-content', 'black-hat-seo', 'manual-action', 'googlebot', 'user-agent'],
    faqs: [
      {
        question: 'Is dynamic rendering cloaking?',
        answer: ['Google has said dynamic rendering is not cloaking as long as the content is similar for users and crawlers. It now calls dynamic rendering a workaround rather than a recommended approach.'],
      },
      {
        question: 'Is a paywall cloaking?',
        answer: ['Not if Googlebot sees the full content subscribers get and you mark up paywalled content as Google describes.'],
      },
    ],
  },
  {
    slug: 'hidden-text',
    term: 'Hidden text and links',
    aka: ['hidden text', 'hidden links', 'invisible text'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Hidden text and/or keyword stuffing” manual action in Search Console.',
      'Algorithmic demotion of the pages involved.',
      'Hidden outbound links can also trigger an “Unnatural links from your site” action.',
      'Hidden links you did not add are often a sign of a hack, which carries security risks for your visitors.',
    ],
    short: 'Hidden text and links are words or links placed on a page so search engines see them but visitors cannot, a breach of Google’s spam policies.',
    definition: [
      'Hidden text and links are content placed on a page so that search engines can read it but visitors cannot see it, added to manipulate rankings. Google’s hidden text and link abuse policy names white text on a white background, text hidden behind an image, text positioned off screen, zero font size or opacity, and links hidden in tiny characters.',
      'Hidden text is usually stuffed with keywords. Hidden links are usually there to pass [link equity](/glossary/link-equity) to another site, often one that paid for the link or one a hacker is promoting.',
      'Plenty of hidden content is fine. Google says accordions, tabs, sliders, tooltips and text that only shows after a click or hover are normal design, as long as they improve the experience. Text for screen readers, such as visually hidden labels, is also fine.',
    ],
    why: [
      'Hidden text is easy to add by accident with an old theme or a plugin, and easy to inherit from a previous owner or agency. Hidden links are one of the most common signs that a site has been hacked.',
      'The white hat alternative is to put useful content where people can see it, with [content optimisation](/glossary/content-optimization), and to earn links through [link building](/glossary/link-building) rather than hiding them.',
    ],
    how: {
      heading: 'How to find hidden text and links',
      steps: [
        'Select all text on the page (Ctrl+A or Cmd+A) to reveal text in the same colour as the background.',
        'View the page source and search for keyword blocks or links you do not see on screen.',
        'Look in CSS for display:none, visibility:hidden, font-size:0, opacity:0 or large negative positions applied to text that is not part of a real UI element.',
        'Check footers, widgets and theme files for links to sites you do not recognise.',
        'Remove anything hidden for search engines; if you did not add it, treat it as a hack and secure the site.',
      ],
    },
    example: {
      label: 'What hidden text looks like in the source',
      code: '<div style="position:absolute; left:-9999px;">\n  cheap flights cheap flights london cheap flights paris\n  <a href="https://example-casino.test/">online casino</a>\n</div>',
    },
    openseo: {
      body: 'The site audit crawls every page and lists outbound links, so links to sites you never chose stand out.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['keyword-stuffing', 'cloaking', 'hacked-content', 'black-hat-seo', 'outbound-links', 'manual-action'],
    faqs: [
      {
        question: 'Is content in accordions or tabs hidden text?',
        answer: ['No. Google says content revealed by tabs, accordions and similar elements is fine, and it indexes it.'],
      },
      {
        question: 'Is text for screen readers hidden text?',
        answer: ['No. Visually hidden labels that help assistive technology are an accessibility practice, not spam, as long as they are not stuffed with keywords.'],
      },
    ],
  },
  {
    slug: 'doorway-pages',
    term: 'Doorway pages',
    aka: ['doorway abuse', 'doorways', 'gateway pages', 'bridge pages'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Thin content with little or no added value” manual action, which covers doorways.',
      'Algorithmic demotion of the templated pages, and sometimes the wider site.',
      'Index bloat and wasted crawl budget on hundreds of near-identical URLs.',
      'Poor experience and lost trust when visitors land on a page that just pushes them elsewhere.',
    ],
    short: 'Doorway pages are near-identical pages or sites built to rank for many similar searches and funnel visitors to one destination, against Google’s policies.',
    definition: [
      'Doorway pages are sites or pages created to rank for specific, similar search queries and send visitors to one main destination, without offering real value themselves. Google’s doorway abuse policy covers them, and they are one of the patterns behind the “thin content” manual action.',
      'Google’s examples include having many domain names or pages targeted at specific regions or cities that funnel users to one page, pages generated to funnel visitors to the usable part of a site, and substantially similar pages that sit closer to search results than to a clear, browsable structure.',
      'The classic modern doorway is a set of city pages, “Plumber in Leeds”, “Plumber in York”, “Plumber in Hull”, with the same text and only the city name swapped.',
    ],
    why: [
      'Location and service pages are a normal part of local SEO, so it is easy to slide into doorways when you scale them up. The difference is whether each page has something genuinely its own.',
      'The white hat alternative is [local landing pages](/glossary/local-landing-pages) done properly: one page per real location or service area, with local details, staff, photos, reviews, prices, and the case studies or information that actually differ. [Programmatic SEO](/glossary/programmatic-seo) can be fine too, when each page is built on unique, useful data.',
    ],
    how: {
      heading: 'How to spot and fix doorway pages',
      steps: [
        'List your location and variant pages and compare their text. If most of it is the same with one word swapped, they are doorways.',
        'Ask whether each page would be useful to someone who landed on it directly, and whether you actually serve that place.',
        'Merge pages that have nothing unique into one stronger page, and 301 redirect the old URLs.',
        'Rebuild the pages you keep with local content: address, area served, local projects, reviews, opening hours, directions.',
        'Link them into a clear, browsable structure rather than leaving them as orphan pages for search only.',
      ],
    },
    example: {
      label: 'What doorway pages look like',
      body: '/plumber-leeds, /plumber-york, /plumber-hull, /plumber-bradford… 200 pages, each saying “Looking for a plumber in [city]? We are the best plumbers in [city]. Call now.” with the same body text, no local address and a button to the same contact page.',
    },
    openseo: {
      body: 'The site audit flags duplicate and near-duplicate titles and descriptions and thin pages, which is how doorway sets usually show up in a crawl.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['local-landing-pages', 'thin-content', 'duplicate-content', 'programmatic-seo', 'scaled-content-abuse', 'black-hat-seo'],
    faqs: [
      {
        question: 'Are location pages doorway pages?',
        answer: ['Not if each one has unique, useful content about a place you really serve. They become doorways when they are templated copies with only the city name changed.'],
      },
      {
        question: 'How many location pages is too many?',
        answer: ['There is no number. It depends on whether you have something specific to say about each place and whether you actually operate there.'],
      },
    ],
  },
  {
    slug: 'sneaky-redirects',
    term: 'Sneaky redirects',
    aka: ['deceptive redirects', 'sneaky mobile redirects'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Cloaking and/or sneaky redirects” or “Sneaky mobile redirects” manual action.',
      'Removal of the affected pages from results.',
      'Users sent to scam or malware pages, with browser security warnings and lasting brand damage.',
      'If the redirect comes from an ad network or a hack, revenue and traffic you did not know you were losing.',
    ],
    short: 'Sneaky redirects send users to a different page than the one search engines saw, to deceive them, which breaks Google’s spam policies.',
    definition: [
      'Sneaky redirects are redirects that send a visitor to a different URL than the one they clicked in search results, in a way meant to deceive users or search engines. Google’s sneaky redirects policy covers showing search engines one page while sending users to another, and sending only mobile users to a spam domain.',
      'Redirects themselves are normal. A [301 redirect](/glossary/301-redirect) after moving a page, consolidating two pages or switching to HTTPS is fine. Redirecting users from a login page is fine. The problem is when the destination is different in kind and hidden from Google.',
      'Many sneaky mobile redirects are not deliberate. They come from a hacked site or a third-party script or ad network that takes over mobile traffic.',
    ],
    why: [
      'Sneaky redirects hurt users directly, so Google treats them seriously, and they can take traffic away from a site whose owner does not know they exist, because the owner rarely browses their own site from a phone via a search result.',
      'The white hat alternative is to use redirects only for real moves, with [301s](/glossary/301-redirect) to the closest equivalent page and [canonical tags](/glossary/canonical-tag) where you need to consolidate.',
    ],
    how: {
      heading: 'How to find sneaky redirects',
      steps: [
        'Search for your site on a mobile phone and click through from Google results, not by typing the URL.',
        'Check the Manual actions and Security issues reports in Search Console.',
        'Review third-party scripts, ad tags and plugins added recently; remove any you do not need.',
        'Look in .htaccess, server config and CMS files for redirect rules based on referrer or user agent that you did not write.',
        'Remove the redirect or the script causing it, secure the site and request review if there is a manual action.',
      ],
    },
    example: {
      label: 'What a sneaky redirect looks like',
      body: 'A visitor on a phone taps your recipe page in Google. The recipe loads for a moment, then the browser jumps to a “You have won a prize” page. On desktop, or when typing the URL directly, the recipe page loads normally.',
    },
    openseo: {
      body: 'The site audit follows every redirect on your site and reports chains, loops and unexpected destinations.',
      href: '/features/site-audit',
      label: 'Check your redirects',
    },
    related: ['cloaking', 'hacked-content', '301-redirect', 'redirect-chain', 'manual-action', 'black-hat-seo'],
    faqs: [
      {
        question: 'Is a 301 redirect a sneaky redirect?',
        answer: ['No. Redirecting a moved or merged page with a 301 is the normal, recommended practice. Sneaky redirects deceive users about where they are going.'],
      },
      {
        question: 'Why does my site redirect on mobile only?',
        answer: ['Usually a hack or a malicious ad or script. Check recent plugins and third-party code, and the Security issues report.'],
      },
    ],
  },
  {
    slug: 'scraped-content',
    term: 'Scraped content',
    aka: ['content scraping', 'scraping'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Thin content with little or no added value” manual action.',
      'Algorithmic demotion; scraped pages rarely outrank the original for long.',
      'Copyright removal requests, and Google says a high volume of valid legal removals can demote a site’s other content too.',
      'Legal action from the content owner for copyright infringement.',
    ],
    short: 'Scraped content is material copied from other sites and republished, with little or no change or added value, against Google’s scraping policy.',
    definition: [
      'Scraped content is content taken from other websites and republished without adding original value. Google’s scraping policy covers copying content and republishing it, copying it after small changes such as swapping synonyms, republishing feeds from other sites, and embedding other people’s videos or images without adding anything.',
      'Scraping is often automated, with bots pulling articles, product descriptions or search results into templated pages. It overlaps with [article spinning](/glossary/article-spinning) and, when done at volume, with [scaled content abuse](/glossary/scaled-content-abuse).',
      'Quoting, curating and syndicating are different. Quoting a source with commentary, a roundup that adds analysis, or licensed syndication with a [canonical tag](/glossary/canonical-tag) pointing to the original are normal practices.',
    ],
    why: [
      'Scraping can look like a quick way to fill a site, but the pages offer nothing searchers could not already find, which is exactly what Google’s systems try to filter out.',
      'The white hat alternative is original work with [information gain](/glossary/information-gain): your own data, testing, photos, experience or analysis. If someone scrapes you, a DMCA or copyright removal request to Google is the fix.',
    ],
    how: {
      heading: 'How to deal with scraped content',
      steps: [
        'On your own site: find pages copied from elsewhere (search a sentence in quotes) and rewrite them with original material, or remove them.',
        'For product pages, rewrite manufacturer descriptions and add your own specs, photos and FAQs.',
        'If you syndicate, ask partners to use a canonical tag to your original.',
        'If others scrape you and outrank you, file a copyright removal request with Google and contact the host.',
      ],
    },
    example: {
      label: 'What scraped content looks like',
      body: 'A “news” site whose every article is a word-for-word copy of articles from other outlets, posted minutes later, with the original links stripped out and ads added around them.',
    },
    related: ['duplicate-content', 'article-spinning', 'scaled-content-abuse', 'thin-content', 'canonical-tag', 'information-gain'],
    faqs: [
      {
        question: 'Will scraped copies of my content hurt my rankings?',
        answer: ['Usually not. Google tries to identify the original. If a copy does outrank you, file a copyright removal request.'],
      },
      {
        question: 'Is using manufacturer product descriptions scraping?',
        answer: ['It is duplicate content rather than a spam violation in itself, but pages with nothing beyond copied descriptions add little value and struggle to rank.'],
      },
    ],
  },
  {
    slug: 'article-spinning',
    term: 'Article spinning',
    aka: ['content spinning', 'spun content', 'spintax'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Thin content with little or no added value” or “Major spam problems” manual action at scale.',
      'Algorithmic demotion by Google’s spam systems, which are built to spot rewritten and mass-produced text.',
      'Copyright claims from the original authors.',
      'A site full of awkward, unreadable text that loses readers and links.',
    ],
    short: 'Article spinning is rewriting existing content with synonyms or software to pass it off as new, which Google treats as scraping or scaled content abuse.',
    definition: [
      'Article spinning is the practice of taking an existing article and rewriting it, by swapping words for synonyms, shuffling sentences or running it through software or AI, to produce versions that look new but add nothing. Google’s scraping policy names copying content after modifying it slightly, such as substituting synonyms.',
      'Spinning used to be done with “spintax” templates that produced hundreds of variants from one article, often for link-building networks. Today the same idea is often done with AI paraphrasing tools. When it is done at volume to manipulate rankings, it is [scaled content abuse](/glossary/scaled-content-abuse).',
    ],
    why: [
      'Spinning promises lots of “unique” content cheaply. Search engines do not care whether the words are different; they care whether the page adds anything. Spun pages add nothing by design, and spun text often reads badly.',
      'The white hat alternative is to write from your own knowledge or research, and to use AI tools, if at all, to help produce something original and checked, as described under [AI-generated content](/glossary/ai-generated-content).',
    ],
    how: {
      heading: 'How to spot spun content',
      steps: [
        'Look for odd synonyms in fixed phrases (“search engine improvement” for “search engine optimisation”).',
        'Compare suspect pages with the top results for the topic; spun pages follow the same structure and points with different wording.',
        'Check content bought from writers or agencies with a plagiarism tool, and ask how it was produced.',
        'Remove or rewrite spun pages with original material, rather than spinning them again.',
      ],
    },
    example: {
      label: 'What spun text looks like',
      body: 'Original: “Search engine optimisation helps your website get more visitors.”\nSpun: “Web index streamlining assists your site with acquiring more guests.”',
    },
    related: ['scraped-content', 'scaled-content-abuse', 'ai-generated-content', 'duplicate-content', 'private-blog-network', 'black-hat-seo'],
    faqs: [
      {
        question: 'Is paraphrasing with AI article spinning?',
        answer: ['If you are rewriting someone else’s article to pass it off as new without adding anything, yes, whatever tool you use.'],
      },
      {
        question: 'Can Google detect spun content?',
        answer: ['Google does not publish how, but its spam policies name it and its systems are designed to detect low-value, rewritten and mass-produced pages.'],
      },
    ],
  },
  {
    slug: 'scaled-content-abuse',
    term: 'Scaled content abuse',
    aka: ['mass-produced content', 'spammy automatically generated content'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Major spam problems” or “Thin content” manual action; Google lists scaled content abuse as a typical cause of major spam problems.',
      'Algorithmic demotion of the pages or the whole site by Google’s spam systems.',
      'Index bloat and wasted crawl budget on thousands of low-value URLs.',
      'Wasted spend on generating content that Google filters out.',
    ],
    short: 'Scaled content abuse is producing many pages mainly to manipulate rankings, with little value for users, whether made by AI, people or both.',
    definition: [
      'Scaled content abuse is generating many pages mainly to manipulate search rankings rather than to help users. Google added the policy in March 2024 and says it applies however the content is made: by automation such as generative AI, by people, or by a mix of both.',
      'Google’s examples include using AI tools to generate many pages without adding value, scraping feeds or search results to build pages, stitching content from different pages together without adding value, creating multiple sites to hide the scale, and pages stuffed with keywords that make little sense to a reader.',
      'The policy replaced Google’s older rule on spammy automatically generated content. The focus moved from how content is made to why it is made and whether it helps anyone.',
    ],
    why: [
      'Generative AI made it cheap to publish thousands of pages, and many sites tried. This policy is Google’s answer. It does not ban AI content: Google says using AI to create helpful content is fine. It bans scale without value.',
      'The white hat alternative is a smaller set of pages that each earn their place, built around real [search intent](/glossary/search-intent) and [information gain](/glossary/information-gain). [Programmatic SEO](/glossary/programmatic-seo) can be legitimate when every page is built on genuinely useful, unique data.',
    ],
    how: {
      heading: 'How to avoid scaled content abuse',
      steps: [
        'Before publishing a batch of pages, ask whether each one would be worth visiting if search engines did not exist.',
        'Make sure each page has something unique: data, examples, reviews, prices, expert input.',
        'Have a person review and edit AI-assisted content for accuracy and usefulness.',
        'Audit existing large page sets: check which get impressions and clicks in Search Console, and merge, improve or remove the rest.',
        'Do not spread the same content across several sites to hide its scale.',
      ],
    },
    example: {
      label: 'What scaled content abuse looks like',
      body: 'A new site publishes 15,000 AI-written “Best [product] in [city]” pages in two months. The pages share one template, list the same products, contain no testing or local information, and none has been reviewed by a person.',
    },
    openseo: {
      body: 'Search performance shows which pages actually earn impressions and clicks, so you can find the low-value parts of a large page set to merge or prune.',
      href: '/features/search-performance',
      label: 'Review page performance',
    },
    related: ['ai-generated-content', 'programmatic-seo', 'thin-content', 'doorway-pages', 'helpful-content', 'content-pruning'],
    faqs: [
      {
        question: 'Does Google penalise AI content?',
        answer: ['Not for being AI. Google says AI-made content is fine if it is helpful. Using AI to mass-produce pages mainly to rank is scaled content abuse.'],
      },
      {
        question: 'Is programmatic SEO scaled content abuse?',
        answer: ['Not by default. It becomes abuse when the pages add little value, such as templates with only a keyword swapped.'],
      },
    ],
  },
  {
    slug: 'site-reputation-abuse',
    term: 'Site reputation abuse (parasite SEO)',
    aka: ['parasite SEO', 'site reputation abuse', 'parasite hosting'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Site reputation policy” manual action on the host site, outside the European Economic Area, removing or demoting the third-party section.',
      'Inside the EEA, Google may rank the affected section separately from the main site, so it loses the host’s ranking strength.',
      'For the host: damage to its reputation with readers who find coupon or casino pages under a trusted brand.',
      'For the third party: money paid for placements that stop ranking.',
    ],
    short: 'Site reputation abuse, or parasite SEO, is publishing third-party pages on a trusted site mainly to borrow its ranking power, against Google’s policies.',
    definition: [
      'Site reputation abuse, often called parasite SEO, is publishing third-party content on a host site mainly to take advantage of the host’s ranking signals. A typical case is a news or university site renting a subfolder to someone who fills it with coupon, casino or payday loan pages that have nothing to do with the host.',
      'Google announced the policy in March 2024 and began enforcing it in May 2024. In November 2024 it clarified that first-party involvement, such as the host owning a stake or overseeing the content, does not make it acceptable if the aim is still to exploit the host’s rankings. Google’s current policy notes that it is handled differently in the European Economic Area, where affected sections may be ranked on their own rather than receiving a manual action.',
      'Not all third-party content is abuse. Google says sponsored content, native advertising, affiliate content and syndicated content are not violations in themselves when they fit the host site and are under its editorial oversight, and when paid links are labelled with rel="sponsored".',
    ],
    why: [
      'Parasite SEO grew because big trusted domains could rank almost anything. That pushed weak pages above specialist sites and annoyed searchers, so Google made it a named violation.',
      'The white hat alternative for a brand is to build its own site’s authority with [digital PR](/glossary/digital-pr) and [link building](/glossary/link-building). For a publisher, it is keeping sponsored content close to its readers’ interests and labelled.',
    ],
    how: {
      heading: 'How to spot site reputation abuse',
      steps: [
        'As a publisher, list every section produced or managed by a third party and ask whether it fits your site and audience.',
        'Check whether you edit or review that content, or whether a partner publishes freely under your domain.',
        'Look for sections ranking for topics far from your site’s purpose, such as coupons on a news site.',
        'Move unrelated third-party content off your domain or noindex it.',
        'Label paid content and paid links clearly with rel="sponsored".',
      ],
    },
    example: {
      label: 'What site reputation abuse looks like',
      body: 'A local newspaper’s site has a /deals/ folder with 3,000 coupon code pages for national retailers. A marketing company writes them, the newsroom never sees them, and they exist because the newspaper’s domain ranks well.',
    },
    openseo: {
      body: 'Domain overview shows which pages and keywords a domain ranks for, so a section ranking far outside the site’s topic is easy to spot.',
      href: '/tools/domain-overview',
      label: 'Open domain overview',
    },
    related: ['expired-domain-abuse', 'google-spam-policies', 'manual-action', 'sponsored-attribute', 'black-hat-seo', 'scaled-content-abuse'],
    faqs: [
      {
        question: 'Is sponsored content site reputation abuse?',
        answer: ['Not by itself. Google says sponsored and affiliate content is fine when it fits the site and is under editorial oversight, with paid links marked rel="sponsored".'],
      },
      {
        question: 'Why is it called parasite SEO?',
        answer: ['Because the third-party pages live on a host site and feed off its reputation, rather than building their own.'],
      },
    ],
  },
  {
    slug: 'expired-domain-abuse',
    term: 'Expired domain abuse',
    aka: ['expired domain spam'],
    category: 'spam',
    hat: 'black',
    risks: [
      'Manual action or algorithmic demotion of the domain under Google’s expired domain abuse policy.',
      'The old domain’s link value may be ignored, so the purchase price is wasted.',
      'Reputational harm when users looking for the old organisation land on unrelated content.',
      'If the domain is used in a PBN, it can drag down the sites it links to.',
    ],
    short: 'Expired domain abuse is buying a lapsed domain and using its old reputation to rank low-value or unrelated content, against Google’s spam policies.',
    definition: [
      'Expired domain abuse is buying an expired domain and reusing it mainly to rank low-value content on the old site’s reputation. Google added the policy in March 2024. Its examples include affiliate content on a domain that used to belong to a government agency, selling products on a former non-profit’s domain, and casino content on an old school site.',
      'Buying an expired domain is not banned. People buy old domains for brand names or to restart a related project. It becomes abuse when the purpose is to exploit the links and trust the old site earned for something unrelated and unhelpful. Using expired domains to build a [private blog network](/glossary/private-blog-network) is a link scheme as well.',
    ],
    why: [
      'Expired domains are sold on the strength of their backlinks and metrics such as Ahrefs’ Domain Rating. That is exactly the signal Google’s policy targets. The grey hat version, redirecting a relevant old domain into your site, is covered under [expired domains](/glossary/expired-domains).',
      'The white hat alternative is building your own domain’s authority, through [link building](/glossary/link-building), or acquiring a related site and genuinely continuing its content.',
    ],
    how: {
      heading: 'How to check an expired domain before buying',
      steps: [
        'Look up its history in the Wayback Machine: what was it, and is your use related?',
        'Check its backlinks for spam patterns or signs it was already used in a network.',
        'Check whether it still has pages indexed and any traffic.',
        'If your plan is to host unrelated content because of its old links, do not buy it.',
      ],
    },
    example: {
      label: 'What expired domain abuse looks like',
      body: 'The domain of a closed children’s charity, still linked from local councils and newspapers, is bought at auction and relaunched as a payday loan comparison site with the same name.',
    },
    openseo: {
      body: 'The backlink checker shows an old domain’s referring domains, anchors and link history, so you can see what it was before you buy it.',
      href: '/tools/backlink-checker',
      label: 'Check a domain’s links',
    },
    related: ['expired-domains', 'private-blog-network', 'site-reputation-abuse', 'link-schemes', 'domain-rating', 'black-hat-seo'],
    faqs: [
      {
        question: 'Is buying an expired domain against Google’s rules?',
        answer: ['No. It is abuse only when you use it mainly to rank low-value content on the back of the old site’s reputation.'],
      },
      {
        question: 'Do expired domain backlinks still pass value?',
        answer: ['Google has said for years that it tries to recognise when a domain changes hands and purpose. Assume old links may count for little if the new site is unrelated.'],
      },
    ],
  },
  {
    slug: 'link-schemes',
    term: 'Link schemes',
    aka: ['link spam', 'unnatural links', 'link manipulation'],
    category: 'spam',
    hat: 'black',
    risks: [
      'An “Unnatural links to your site” manual action, or “Unnatural links from your site” if you sell or trade links.',
      'Links neutralised by SpamBrain, with any ranking benefit lost for good.',
      'Algorithmic demotion when the scheme is large or repeated.',
      'Wasted spend on links, plus the cost of a cleanup and disavow.',
    ],
    short: 'A link scheme is any attempt to create links mainly to manipulate rankings, such as buying, swapping or automating links, which is Google’s link spam.',
    definition: [
      'A link scheme is any practice of creating links mainly to manipulate a site’s search rankings, rather than links people give because the content deserves them. Google now calls this link spam, and it is one of the most common reasons for a manual action. It covers links to your site and links from it.',
      'Google’s link spam policy lists examples: buying or selling links that pass ranking credit, including exchanging goods, services or free products for links; excessive link exchanges; automated programs or services that create links; requiring a link as part of a contract or terms of service without letting the linking site qualify it; text ads that pass ranking credit; paid articles, guest posts or press releases with keyword-rich links; low-quality directory or bookmark links; links hidden in widely distributed widgets; widely distributed links in site-wide footers or templates; forum comments with optimised links in the post or signature; and low-value content made to manipulate links.',
      'Specific forms each have their own entry: [paid links](/glossary/paid-links), [private blog networks](/glossary/private-blog-network), [link farms](/glossary/link-farms), [comment spam](/glossary/comment-spam) and, at the grey edge, [link exchanges](/glossary/link-exchanges).',
    ],
    why: [
      'Links still matter to Google, which says PageRank remains part of its core ranking systems. That is why link schemes persist, and why Google invests so much in catching them. Since the December 2022 link spam update, its SpamBrain system can detect sites buying links and sites used to pass them.',
      'The white hat alternative is [link building](/glossary/link-building) that earns links: [digital PR](/glossary/digital-pr), [broken link building](/glossary/broken-link-building), research and tools people cite. Paid placements are fine when marked rel="sponsored" or rel="nofollow".',
    ],
    how: {
      heading: 'How to spot and clean up link schemes',
      steps: [
        'Export your backlinks and sort by referring domain.',
        'Flag sites with no real audience, unrelated topics, many outbound links on every page or “write for us” pages with prices.',
        'Flag exact-match commercial anchors repeated across many domains, and sudden spikes of new links.',
        'Ask owners of links you bought or swapped to remove them or add rel="sponsored" or rel="nofollow". Keep a log.',
        'Disavow the domains you cannot clean up if you have, or expect, a manual action.',
        'On your own site, remove or qualify any paid outbound links.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows referring domains, anchors and monthly new and lost links, which is where bought links and networks usually show up.',
      href: '/tools/backlink-checker',
      label: 'Audit your backlinks',
    },
    related: ['paid-links', 'private-blog-network', 'link-farms', 'link-exchanges', 'disavow', 'toxic-backlinks', 'link-building'],
    faqs: [
      {
        question: 'What counts as an unnatural link?',
        answer: ['A link that exists mainly to influence rankings rather than because the linking site chose to point people to you, such as bought, swapped or automated links.'],
      },
      {
        question: 'Are directory links a link scheme?',
        answer: ['Low-quality directories created for links are named in Google’s policy. Genuine, curated directories and local citations that people use are fine.'],
      },
    ],
  },
  {
    slug: 'paid-links',
    term: 'Paid links',
    aka: ['buying backlinks', 'sponsored links', 'link buying'],
    category: 'spam',
    hat: 'black',
    risks: [
      'An “Unnatural links to your site” manual action for the buyer, and “Unnatural links from your site” for the seller.',
      'Links nullified by Google’s systems, with the money spent lost.',
      'Algorithmic demotion if paid links make up a large part of your profile.',
      'Ongoing cost: link sellers often remove links when payments stop, or sell to spam sites on the same page.',
    ],
    short: 'Paid links are links bought to pass ranking credit, without rel="sponsored" or nofollow, which breaks Google’s link spam policy.',
    definition: [
      'Paid links are links that a site gets in exchange for money, goods, services or free products, and that pass ranking credit because they are not marked with rel="sponsored" or rel="nofollow". Buying or selling such links is link spam under Google’s spam policies, for both buyer and seller.',
      'Paid links come in many forms: a fee per link on a blog, a “guest post” with a price list, a link inserted into an old article ([niche edits](/glossary/niche-edits)), free products sent to a reviewer in exchange for a followed link, or a sponsorship that requires a link.',
      'Paying for exposure is fine. Advertising, sponsorships and affiliate links are all allowed as long as the links are qualified with [rel="sponsored"](/glossary/sponsored-attribute) (preferred) or [rel="nofollow"](/glossary/nofollow-link). Then they send traffic without passing ranking credit.',
    ],
    why: [
      'Buying links is the most common black hat tactic, and much of it is sold as normal SEO by agencies offering “high-DR guest posts”. Google’s systems are built to detect link selling at scale, and links they catch stop counting.',
      'The white hat alternative is to earn links with [digital PR](/glossary/digital-pr), research, tools and [link building](/glossary/link-building) outreach, and to label any paid placement honestly.',
    ],
    how: {
      heading: 'How to spot paid links',
      steps: [
        'In your own profile, look for links from sites that sell guest posts, carry “sponsored” articles on every topic, or link to casinos, CBD and loans on the same pages.',
        'Check invoices and agency reports for per-link pricing or “guaranteed DR”.',
        'On your site, check outbound links in sponsored posts, reviews and partner pages for missing rel="sponsored".',
        'Remove or qualify the links, disavow those you cannot remove if there is a manual action, and stop buying.',
      ],
    },
    example: {
      label: 'A paid link done the compliant way',
      code: '<a href="https://example.com/" rel="sponsored">Example running shoes</a>',
    },
    openseo: {
      body: 'The backlink checker lists referring domains and anchors, so clusters of links from guest-post sites and commercial anchors are easy to see.',
      href: '/tools/backlink-checker',
      label: 'Check your backlinks',
    },
    related: ['link-schemes', 'sponsored-attribute', 'nofollow-link', 'niche-edits', 'guest-posting', 'digital-pr', 'link-building'],
    faqs: [
      {
        question: 'Is it illegal to buy backlinks?',
        answer: ['Generally not, but it breaks Google’s spam policies. Advertising rules in some countries also require paid content to be disclosed.'],
      },
      {
        question: 'Can Google tell if a link is paid?',
        answer: ['Not always, but Google says its systems detect sites that buy and sell links, and patterns like price lists and off-topic sponsored posts are easy to spot.'],
      },
      {
        question: 'Are affiliate links paid links?',
        answer: ['Google asks for affiliate links to be marked rel="sponsored" or rel="nofollow". Most affiliate programmes already use redirect URLs that do not pass ranking credit.'],
      },
    ],
  },
  {
    slug: 'private-blog-network',
    term: 'Private blog network (PBN)',
    aka: ['PBN', 'blog network', 'PBN links'],
    category: 'spam',
    hat: 'black',
    risks: [
      'An “Unnatural links to your site” manual action for the sites being boosted.',
      'The whole network being neutralised at once, wiping out the value of every link in it.',
      'Deindexing of the network’s sites.',
      'High, wasted cost: domains, hosting and content for sites that exist only to pass links.',
    ],
    short: 'A private blog network (PBN) is a group of sites, often on expired domains, built only to link to a money site and boost its rankings.',
    definition: [
      'A private blog network (PBN) is a group of websites controlled by one person or company and used to link to a target site to boost its search rankings. The sites are often built on expired domains with existing backlinks, and they pretend to be independent blogs. PBNs are a link scheme under Google’s spam policies.',
      'PBN operators try to hide the network with different hosting, themes and owners, and fill the sites with filler content. Many sell links from their network to clients, which makes the clients’ links paid links too. Rebuilding [expired domains](/glossary/expired-domain-abuse) for this purpose also breaks the expired domain abuse policy.',
    ],
    why: [
      'PBNs are marketed as a way to control your own powerful links. In practice, they leave a footprint that Google’s systems are built to find, and when one site is caught, the rest often follow.',
      'The white hat alternative is [link building](/glossary/link-building) through [digital PR](/glossary/digital-pr) and [editorial links](/glossary/editorial-links) you earn on sites with real readers.',
    ],
    how: {
      heading: 'How to spot PBN links',
      steps: [
        'Look for linking sites with thin, generic posts on many unrelated topics and no real audience or social presence.',
        'Check whether the domains have a history as something else in the Wayback Machine.',
        'Notice shared footprints: the same theme, author names, contact details or outbound link patterns across sites.',
        'Check whether these sites rank for anything themselves; PBN sites usually have little or no organic traffic.',
        'Ask for removal where you can and disavow the network if you have or expect a manual action.',
      ],
    },
    example: {
      label: 'What a PBN link looks like',
      body: 'A blog called “Home Garden Tech Life” posts one 500-word article a week on any topic. Each article links to a different commercial site with an exact-match anchor such as “best personal injury lawyer”. The domain was a bakery’s site until 2022.',
    },
    openseo: {
      body: 'The backlink checker shows each referring domain’s authority and traffic, so linking sites with authority but no traffic, a typical PBN sign, stand out.',
      href: '/tools/backlink-checker',
      label: 'Check for PBN links',
    },
    related: ['link-schemes', 'expired-domain-abuse', 'expired-domains', 'paid-links', 'link-farms', 'toxic-backlinks'],
    faqs: [
      {
        question: 'Do PBNs still work?',
        answer: ['Some still move rankings for a while, which is why they are sold. Google targets them directly, and when caught, the links stop counting.'],
      },
      {
        question: 'Is owning several websites that link to each other a PBN?',
        answer: ['Not by itself. Related sites you genuinely run can link where it helps users. A PBN exists to pass links and hides its common ownership.'],
      },
    ],
  },
  {
    slug: 'link-farms',
    term: 'Link farms',
    aka: ['link farm', 'link exchange network'],
    category: 'spam',
    hat: 'black',
    risks: [
      'An “Unnatural links to your site” manual action.',
      'Links ignored by Google, with no ranking value at all.',
      'Your site associated with spam neighbourhoods in your link profile.',
      'Cleanup work to remove or disavow large numbers of junk links.',
    ],
    short: 'A link farm is a group of sites or pages that exist mainly to link to each other or to anyone who joins, in order to inflate rankings.',
    definition: [
      'A link farm is a group of websites or pages that link to each other, or to any site that pays or joins, with the sole aim of inflating link counts for search rankings. The pages carry long lists of unrelated links and little real content. Link farms are a form of link spam under Google’s spam policies.',
      'Link farms differ from [private blog networks](/glossary/private-blog-network) mainly in effort: a PBN tries to look like real blogs, while a link farm makes little attempt to hide. Automated link-building tools often create links on link farms, low-quality directories and bookmark sites, all of which Google’s policy names.',
    ],
    why: [
      'Link farms belong to the early days of search, but they are still sold as cheap “1,000 backlinks” packages. Google has ignored this kind of link for a long time, so they rarely do anything except clutter your [link profile](/glossary/link-profile).',
      'The white hat alternative is fewer, relevant links from sites with real readers, earned through [link building](/glossary/link-building) such as [unlinked mention](/glossary/unlinked-mentions) outreach.',
    ],
    how: {
      heading: 'How to spot link farm links',
      steps: [
        'Look for referring pages with dozens or hundreds of outbound links to unrelated sites.',
        'Look for sites whose only content is lists of links, “resources” or directories with no editorial standards.',
        'Watch for big bursts of new referring domains with no matching coverage or mention.',
        'Ignore them unless you bought them; if you did, or you have a manual action, disavow them.',
      ],
    },
    openseo: {
      body: 'The backlink checker shows new referring domains month by month, so a bulk package of farm links shows up as a spike.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['link-schemes', 'private-blog-network', 'toxic-backlinks', 'disavow', 'link-velocity', 'paid-links'],
    faqs: [
      {
        question: 'Can a link farm hurt my site?',
        answer: ['Links you did not ask for are usually just ignored. If you paid for a link farm package, remove or disavow the links.'],
      },
      {
        question: 'Are web directories link farms?',
        answer: ['Curated directories that people use are not. Directories that accept anyone, have no audience and exist for links are treated as link spam.'],
      },
    ],
  },
  {
    slug: 'comment-spam',
    term: 'Comment spam',
    aka: ['blog comment spam', 'forum spam', 'user-generated spam'],
    category: 'spam',
    hat: 'black',
    risks: [
      'For the spammer: links ignored, and possibly an “Unnatural links to your site” manual action.',
      'For the host site: a “User-generated spam” or “Site abused with third-party spam” manual action.',
      'For the host site: spam pages diluting quality and linking to harmful sites.',
      'Brand damage when spam mentioning your business appears across many sites.',
    ],
    short: 'Comment spam is posting links in blog comments, forums or profiles to gain backlinks, which breaks Google’s link spam and user-generated spam policies.',
    definition: [
      'Comment spam is posting promotional links in blog comments, forum posts, guestbooks or user profiles, usually automatically, to gain backlinks or traffic. For the person posting, it is link spam: Google’s policy names forum comments with optimised links in the post or signature. For the site hosting it, it is user-generated spam.',
      'Most comment spam is posted by bots, with generic praise (“Great post, very helpful!”) and a keyword-rich name or link. It also shows up as spam profile pages and fake forum accounts. Because most platforms add rel="ugc" or rel="nofollow" to comment links, the links rarely pass value anyway.',
    ],
    why: [
      'If you run a site with comments or a forum, unmoderated spam can earn you a manual action even though you did nothing wrong. Google expects site owners to manage [user-generated content](/glossary/user-generated-content).',
      'The white hat alternative for getting links is to take part genuinely in communities and earn links through [link building](/glossary/link-building). For hosts, it is moderation and [rel="ugc"](/glossary/ugc-attribute) on user links.',
    ],
    how: {
      heading: 'How to stop comment spam',
      steps: [
        'Turn on moderation or hold first-time comments for approval.',
        'Use anti-spam filters and CAPTCHA on comment and sign-up forms.',
        'Add rel="ugc" or rel="nofollow" to links in comments and profiles; most platforms do this by default.',
        'Noindex or limit new user profile pages until users have a track record.',
        'Delete existing spam, then request review if you have a manual action.',
      ],
    },
    example: {
      label: 'What comment spam looks like',
      body: 'Name: Best Cheap Car Insurance\nComment: Very informative article, thanks for sharing! Check my site for more information.\n(Link to an insurance comparison site, posted on a knitting blog.)',
    },
    related: ['user-generated-content', 'ugc-attribute', 'link-schemes', 'nofollow-link', 'manual-action', 'black-hat-seo'],
    faqs: [
      {
        question: 'Do blog comment links help SEO?',
        answer: ['Almost never. Most are nofollow or ugc, and Google names optimised comment links as link spam.'],
      },
      {
        question: 'Can spam comments get my site penalised?',
        answer: ['Yes, if there is a lot of it. Google has manual actions for user-generated spam and for sites abused with third-party spam.'],
      },
    ],
  },
  {
    slug: 'ctr-manipulation',
    term: 'CTR manipulation',
    aka: ['click-through rate manipulation', 'click bots', 'CTR bots'],
    category: 'spam',
    hat: 'black',
    risks: [
      'Breach of Google’s machine-generated traffic policy and Terms of Service.',
      'Little or no lasting effect: Google works to filter out fake and automated clicks.',
      'Polluted Search Console and analytics data, so you can no longer trust your own numbers.',
      'Wasted spend on bot services or paid clickers.',
    ],
    short: 'CTR manipulation is using bots or paid clickers to search for a keyword and click your result, to fake user signals. It breaks Google’s rules.',
    definition: [
      'CTR manipulation is the attempt to raise a page’s rankings by faking searches and clicks on its result, using bots, click farms, paid microtask workers or proxy networks. The idea is to make a result look more popular than it is. Automated traffic like this falls under Google’s machine-generated traffic policy and breaks Google’s Terms of Service.',
      'It is often sold for local SEO, with services that simulate people searching for a business and clicking through to its Google Business Profile, asking for directions or dwelling on the site.',
      'Google has confirmed, including in testimony during the US antitrust case, that it uses aggregated user interaction data in ranking. It also spends heavily on detecting fake and automated traffic, and gives no sign that bought clicks are a reliable signal.',
    ],
    why: [
      'CTR manipulation is attractive because it seems invisible. In practice, it pollutes your own [click-through rate](/glossary/click-through-rate) and impressions data, and any effect tends to fade when the clicks stop.',
      'The white hat alternative is to earn real clicks with better [title tags](/glossary/title-tag) and [meta descriptions](/glossary/meta-description), rich results from honest [structured data](/glossary/structured-data), and a stronger brand people search for.',
    ],
    how: {
      heading: 'How to spot CTR manipulation',
      steps: [
        'In Search Console, look for sudden jumps in impressions or clicks on a few queries with no matching change in sales, leads or engagement.',
        'In analytics, check for bursts of very short or very uniform sessions from unusual locations or devices.',
        'Ask any agency directly whether they use click or “user signal” services, and stop if they do.',
        'Improve real CTR instead: rewrite titles and descriptions for the queries where you rank but get few clicks.',
      ],
    },
    openseo: {
      body: 'Search performance shows real clicks, impressions and CTR from Search Console for each query, so you can improve titles where real users skip your result.',
      href: '/features/search-performance',
      label: 'Find low-CTR queries',
    },
    related: ['click-through-rate', 'automated-queries', 'title-tag', 'clickbait-titles', 'google-business-profile', 'black-hat-seo'],
    faqs: [
      {
        question: 'Does click-through rate affect rankings?',
        answer: ['Google uses user interaction data in aggregate, but it is one signal among many and heavily filtered. Faking clicks is against its rules and unreliable.'],
      },
      {
        question: 'Can a competitor use click bots against me?',
        answer: ['They could inflate or distort your data, but there is no evidence this reliably harms rankings. Keep an eye on Search Console for odd spikes.'],
      },
    ],
  },
  {
    slug: 'structured-data-spam',
    term: 'Structured data spam',
    aka: ['schema spam', 'spammy structured markup', 'fake review stars'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Structured data issue” manual action in Search Console.',
      'Loss of rich result eligibility, for the affected pages or the whole site.',
      'Lost trust when users see star ratings or prices that do not match the page.',
      'Legal exposure where markup fakes reviews or prices, under consumer protection rules.',
    ],
    short: 'Structured data spam is schema markup that misleads, such as fake review stars or markup for content not on the page, to win rich results.',
    definition: [
      'Structured data spam is schema markup that does not match the visible page or misrepresents it, added to win rich results such as review stars, FAQs or prices. Google’s structured data guidelines require markup to describe content users can see, and breaking them can lead to a “Structured data issue” manual action.',
      'Common forms are fake or invented review ratings, marking up content that is not on the page, marking a non-recipe page as a recipe or a company as a product, inflated prices or availability, and self-serving reviews: Google does not show review stars for LocalBusiness and Organization markup where the business reviews itself.',
    ],
    why: [
      'Rich results can lift [click-through rate](/glossary/click-through-rate), which tempts people to fake them. Google’s answer is to remove eligibility for rich results, which takes away the benefit of honest markup too.',
      'The white hat alternative is accurate [schema markup](/glossary/schema-markup) for content that is really on the page, written in [JSON-LD](/glossary/json-ld) and checked with Google’s Rich Results Test.',
    ],
    how: {
      heading: 'How to find structured data spam',
      steps: [
        'Check the Manual actions report and the rich result reports (Enhancements) in Search Console.',
        'Run key templates through the Rich Results Test and compare every marked-up value with what is visible on the page.',
        'Look for review markup with no visible reviews, or ratings applied site-wide by a plugin.',
        'Remove markup that does not match the page and fix the template that adds it.',
        'Request review if there is a manual action.',
      ],
    },
    example: {
      label: 'What spammy markup looks like',
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Garden hose",\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": "4.9",\n    "reviewCount": "2840"\n  }\n}\n</script>\n<!-- The page shows no reviews at all: the rating is invented. -->',
    },
    openseo: {
      body: 'The site audit checks structured data across your pages, so you can find markup a plugin or template added everywhere.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['structured-data', 'schema-markup', 'rich-results', 'rich-snippets', 'fake-reviews', 'manual-action'],
    faqs: [
      {
        question: 'Can I mark up my own reviews of my business?',
        answer: ['Google does not show review stars for self-serving reviews in LocalBusiness or Organization markup. Product reviews from real customers on the page are fine.'],
      },
      {
        question: 'Does structured data spam hurt rankings?',
        answer: ['The usual result is losing rich results rather than rankings, but a manual action can apply to the whole site’s rich result eligibility.'],
      },
    ],
  },
  {
    slug: 'hacked-content',
    term: 'Hacked content and injected spam',
    aka: ['hacked site', 'injected spam', 'SEO spam injection', 'Japanese keyword hack', 'pharma hack'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A security warning in Search Console and possibly in browsers, which drives visitors away.',
      'Spam pages indexed under your domain, demoting or crowding out your real pages.',
      'Users sent to scams or malware, with lasting damage to trust in your brand.',
      'Legal duties if personal data was exposed, such as breach reporting under data protection law like the GDPR.',
      'For the attacker: hacking is a criminal offence in most countries.',
    ],
    short: 'Hacked content is spam pages, links or redirects placed on a site without the owner’s permission by exploiting a security hole.',
    definition: [
      'Hacked content is any content placed on a site without the owner’s permission because of a security weakness. In SEO spam, attackers inject links, hidden keywords, whole spam pages or redirects to boost their own sites or send users to scams. Google’s hacked content policy covers code injection, page injection, content injection and malicious redirects.',
      'Well-known patterns include the “Japanese keyword hack”, which creates thousands of auto-generated pages in Japanese selling counterfeit goods, and pharma hacks, which inject drug keywords and links. Attackers often [cloak](/glossary/cloaking) the spam so the site owner sees normal pages while Google sees the spam.',
      'Google reports hacked content in Search Console’s Security issues report, not the Manual actions report. It is the black hat technique most likely to happen to a site whose owner did nothing wrong.',
    ],
    why: [
      'A hacked site can lose rankings, get flagged as unsafe and expose visitors to harm, all without the owner noticing for weeks. Outdated CMS plugins and weak passwords are the usual entry points.',
      'Hacking someone else’s site to plant links is plainly black hat and illegal. If you see links from hacked sites in your own profile, someone may be using your domain as a target in [negative SEO](/glossary/negative-seo) or as cover for a spam campaign.',
    ],
    how: {
      heading: 'How to clean up a hacked site',
      steps: [
        'Check the Security issues report in Search Console and search Google for site:yourdomain.com with spam terms (for example casino, viagra or Japanese characters).',
        'Take a backup of the current state for investigation, then lock down access: change all passwords and remove unknown admin users.',
        'Find and close the entry point: update the CMS, themes and plugins, and remove anything unused.',
        'Remove injected files, pages, code and .htaccess rules; restoring a clean backup is often fastest.',
        'Return a 404 or 410 for spam URLs so Google drops them, and check your sitemap was not altered.',
        'Request a review from the Security issues report once the site is clean.',
        'If personal data may have been exposed, follow your legal obligations to report the breach.',
      ],
    },
    example: {
      label: 'What hacked content looks like',
      body: 'A site: search for a dentist’s website shows 4,000 results, most with Japanese titles about designer handbags, at URLs like /?shop=12345 that the dentist never created. Visiting them directly shows a normal page.',
    },
    openseo: {
      body: 'The site audit crawls your site and lists pages, redirects and outbound links, so injected pages and links to strange domains show up.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['cloaking', 'sneaky-redirects', 'hidden-text', 'negative-seo', 'deindexing', 'https'],
    faqs: [
      {
        question: 'How do I know if my site has been hacked?',
        answer: ['Check Search Console’s Security issues report, search site:yourdomain.com for unfamiliar pages, and look for redirects when visiting from a Google result on mobile.'],
      },
      {
        question: 'How long does it take to recover from a hack?',
        answer: ['Once the site is clean and reviewed, warnings can lift within days. Spam URLs can take longer to drop out of the index.'],
      },
    ],
  },
  {
    slug: 'thin-affiliate-pages',
    term: 'Thin affiliate pages',
    aka: ['thin affiliation', 'thin affiliate content'],
    category: 'spam',
    hat: 'black',
    risks: [
      'A “Thin content with little or no added value” manual action.',
      'Algorithmic demotion, especially across sites built on the same template.',
      'Wasted effort: pages with only merchant copy rarely rank against the merchant itself.',
      'Lost affiliate revenue when the pages drop out of results.',
    ],
    short: 'Thin affiliate pages are affiliate pages that copy product descriptions or reviews from the merchant and add no original value, against Google’s policy.',
    definition: [
      'Thin affiliate pages are pages with affiliate links whose product descriptions and reviews are copied straight from the merchant or network, with no original content or added value. Google’s thin affiliation policy targets them, especially when they appear across networks of similar sites.',
      'Affiliate marketing itself is fine. Google says being an affiliate is not a problem; the issue is pages that offer nothing beyond what the merchant already offers. A product review based on real testing, a comparison with original photos and data, or a buying guide with expert advice can all carry affiliate links and rank well.',
    ],
    why: [
      'Affiliate sites live on search traffic, so thin pages are a direct risk to income. Google’s systems also favour pages showing first-hand experience, a part of [E-E-A-T](/glossary/eeat).',
      'The white hat alternative is to add [information gain](/glossary/information-gain): hands-on testing, original photos, measurements, pros and cons, who it suits, and honest comparisons. Mark affiliate links with [rel="sponsored"](/glossary/sponsored-attribute).',
    ],
    how: {
      heading: 'How to fix thin affiliate pages',
      steps: [
        'Find pages whose main text matches the merchant’s description (search a sentence in quotes).',
        'Decide which pages are worth improving, based on impressions and clicks, and which to merge or remove.',
        'Add original content: testing notes, photos, specs you measured, comparisons, a clear verdict.',
        'Make the author and their experience visible.',
        'Mark affiliate links rel="sponsored" or rel="nofollow".',
      ],
    },
    example: {
      label: 'What a thin affiliate page looks like',
      body: 'A page titled “Best Coffee Grinder Review” with the manufacturer’s description pasted in, a stock photo, and a “Check price” button. Hundreds of similar pages on the site follow the same template for other products.',
    },
    openseo: {
      body: 'Search performance shows which affiliate pages get impressions but few clicks, a good shortlist for improving or pruning.',
      href: '/features/search-performance',
      label: 'Review page performance',
    },
    related: ['thin-content', 'scraped-content', 'information-gain', 'eeat', 'sponsored-attribute', 'comparison-pages'],
    faqs: [
      {
        question: 'Does Google penalise affiliate sites?',
        answer: ['No, not for being affiliates. It targets affiliate pages that add nothing beyond copied merchant content.'],
      },
      {
        question: 'Do affiliate links need rel="sponsored"?',
        answer: ['Google asks for affiliate links to be marked rel="sponsored" or rel="nofollow".'],
      },
    ],
  },
  {
    slug: 'automated-queries',
    term: 'Automated queries',
    aka: ['machine-generated traffic', 'automated traffic to Google', 'scraping Google'],
    category: 'spam',
    hat: 'black',
    risks: [
      'Breach of Google’s machine-generated traffic policy and Terms of Service.',
      'IP blocks, CAPTCHAs and rate limiting from Google.',
      'Distorted impression and click data if bots trigger your results.',
      'Wasted infrastructure spend on traffic Google filters out.',
    ],
    short: 'Automated queries are searches sent to Google by bots without permission, covered by Google’s machine-generated traffic policy.',
    definition: [
      'Automated queries are searches or other requests sent to Google Search by software rather than people, without Google’s express permission. Google’s machine-generated traffic policy says this consumes resources and interferes with serving users, and names sending automated queries to Google and scraping results for rank-checking or other automated access as examples.',
      'This is also behind [CTR manipulation](/glossary/ctr-manipulation), where bots search a keyword and click a chosen result to fake user interest, and behind bots that inflate impressions for a site.',
    ],
    why: [
      'Automated queries do not improve a site’s rankings, and they break both the spam policies and Google’s Terms of Service. They also distort the [impressions](/glossary/impressions) and clicks data you rely on.',
      'The white hat way to get data about your own site’s performance in Google is [Google Search Console](/glossary/google-search-console), including its API, which Google provides for this purpose.',
    ],
    how: {
      heading: 'How to avoid automated query problems',
      steps: [
        'Do not run scripts that search Google and click results.',
        'Get your own performance data from Search Console and its API.',
        'If Search Console shows sudden impressions with no clicks on odd queries, check whether bots may be triggering your results, and do not read too much into them.',
        'Ask any vendor that offers “user signals” or traffic boosts how it works, and avoid it if it relies on bots.',
      ],
    },
    openseo: {
      body: 'Search performance reads your Search Console data through Google’s own API, so you can see real clicks, impressions and positions for your site.',
      href: '/features/search-performance',
      label: 'Connect Search Console',
    },
    related: ['ctr-manipulation', 'google-search-console', 'impressions', 'google-spam-policies', 'black-hat-seo'],
    faqs: [
      {
        question: 'Is scraping Google against the rules?',
        answer: ['Google’s machine-generated traffic policy names scraping results for rank-checking and other automated access without express permission, and its Terms of Service prohibit it.'],
      },
      {
        question: 'Do bots affect my Search Console data?',
        answer: ['They can show up as impressions. Google filters much automated traffic, but unusual spikes on odd queries are worth treating with caution.'],
      },
    ],
  },
  {
    slug: 'link-exchanges',
    term: 'Link exchanges',
    aka: ['link swaps', 'link trading', 'reciprocal link exchange'],
    category: 'spam',
    hat: 'grey',
    risks: [
      'Excessive link exchanges are named in Google’s link spam policy and can lead to an “Unnatural links” manual action.',
      'Swapped links that Google recognises as a pattern may be ignored, so the effort is wasted.',
      'Three-way or ABC swaps arranged to hide the trade are still link schemes.',
      'Outbound links to low-quality partners can look like link selling from your side.',
    ],
    short: 'A link exchange is an agreement between sites to link to each other. Occasional relevant swaps are fine; excessive ones are link spam.',
    definition: [
      'A link exchange is an arrangement where two or more sites agree to link to each other, mainly to gain backlinks. A few natural mutual links between related sites are normal. Google’s link spam policy names “excessive link exchanges” and partner pages made only for cross-linking, so swapping at scale is a link scheme.',
      'The line sits between links that would exist anyway and links that exist only because of the trade. A supplier linking to its stockists, and stockists linking back, is normal. A cold email offering “a link for a link” to any site, or a “partners” page with fifty unrelated sites, is a scheme. Three-way swaps (site A links to B, B’s other site links to A) are designed to hide the trade and are not safer.',
      'Mutual links in general are covered under [reciprocal links](/glossary/reciprocal-links).',
    ],
    why: [
      'Link swap offers are some of the most common emails SEOs receive, and they often come from sites that sell links too. Accepting them can put your site in the same neighbourhood.',
      'The white hat alternative is [link building](/glossary/link-building) that earns links on merit, such as [digital PR](/glossary/digital-pr), and linking out only where it helps your readers. See [grey hat SEO](/glossary/grey-hat-seo) for how this tactic sits on the scale.',
    ],
    how: {
      heading: 'How to tell if a link exchange is safe',
      steps: [
        'Would both links exist without the deal? If yes, it is a normal mutual link.',
        'Are the sites closely related, so readers benefit from the link?',
        'Is it a one-off with a real partner, or one of many swaps with strangers?',
        'Is any money, product or service attached? Then it is a paid link and needs rel="sponsored".',
        'Turn down three-way swaps and “partner page” arrangements outright.',
      ],
    },
    openseo: {
      body: 'The backlink checker’s link intersect and referring domains views show where your links come from, so a pattern of swapped links is easy to spot.',
      href: '/tools/backlink-checker',
      label: 'Open the backlink checker',
    },
    related: ['reciprocal-links', 'link-schemes', 'grey-hat-seo', 'paid-links', 'outbound-links', 'link-building'],
    faqs: [
      {
        question: 'Are link exchanges against Google’s rules?',
        answer: ['Excessive link exchanges are. Occasional mutual links between related sites, for good reasons, are not.'],
      },
      {
        question: 'Are three-way link exchanges safer?',
        answer: ['No. They are designed to hide a trade, which is still a link scheme.'],
      },
    ],
  },
  {
    slug: 'clickbait-titles',
    term: 'Clickbait titles',
    aka: ['clickbait', 'clickbait headlines'],
    category: 'spam',
    hat: 'grey',
    risks: [
      'Google may rewrite titles that do not reflect the page, removing the hook you wrote.',
      'Readers who feel misled leave quickly, and the page loses trust and links.',
      'For news sites, misleading headlines can breach Google News and Discover policies and lead to a manual action there.',
      'Long-term brand damage when people learn to skip your results.',
    ],
    short: 'Clickbait titles promise more than the page delivers to win clicks. Compelling titles are fine; misleading ones are grey hat and can backfire.',
    definition: [
      'A clickbait title is a headline or title tag written to make people click by exaggerating, withholding key information or promising something the page does not deliver. It is not named as a spam policy for web search, which is why it sits in the grey zone rather than black hat.',
      'The line is accuracy. A title that is specific, interesting and true, such as “7 houseplants that survive low light (tested over a winter)”, is good copywriting. A title like “This one plant will change your life” on a generic list, or a news headline that misstates the story, is clickbait.',
      'Google’s guidance asks for titles that are descriptive and avoid exaggerated or shocking wording, and its Discover content policies specifically warn against clickbait and misleading titles. Google also rewrites titles in results when they do not describe the page well.',
    ],
    why: [
      'Clicks matter, and a strong [title tag](/glossary/title-tag) can lift [click-through rate](/glossary/click-through-rate) from the same ranking. But if visitors bounce because the page did not match the promise, you lose their trust and Google may rewrite your title.',
      'The white hat alternative is a title that leads with the keyword, says what the page delivers, and adds a true detail that makes it worth choosing. [SEO copywriting](/glossary/search-engine-friendly-copywriting) covers this. See [grey hat SEO](/glossary/grey-hat-seo) for where this sits.',
    ],
    how: {
      heading: 'How to write clickable titles without clickbait',
      steps: [
        'Start with what the page is about, using the keyword people search for.',
        'Add something specific and true: a number, a year, a format, a result.',
        'Check that the first screen of the page delivers what the title promises.',
        'Avoid all-caps, shock words and teasers that hide the subject.',
        'Watch CTR and engagement together: a title that raises clicks but sends people straight back needs fixing.',
      ],
    },
    example: {
      label: 'Clickbait vs a strong title',
      body: 'Clickbait: “You won’t believe what this one trick does to your rankings”\nStrong: “How to fix keyword cannibalisation: a 5-step process with examples”',
    },
    openseo: {
      body: 'Search performance shows CTR by query from Search Console, so you can test better titles where you rank but few people click.',
      href: '/features/search-performance',
      label: 'Find low-CTR pages',
    },
    related: ['title-tag', 'click-through-rate', 'ctr-manipulation', 'google-discover', 'grey-hat-seo', 'search-engine-friendly-copywriting'],
    faqs: [
      {
        question: 'Does Google penalise clickbait?',
        answer: ['Not under the web search spam policies, but it can rewrite misleading titles, and Discover and News policies can act against misleading headlines.'],
      },
      {
        question: 'What is the difference between a catchy title and clickbait?',
        answer: ['A catchy title makes a true promise interesting. Clickbait makes a promise the page does not keep.'],
      },
    ],
  },
];
