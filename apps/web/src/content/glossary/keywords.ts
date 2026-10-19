import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'keyword',
    term: 'Keyword',
    aka: ['search term', 'search query', 'keyphrase'],
    category: 'keywords',
    short: 'A keyword is a word or phrase people type into a search engine. In SEO, it’s the query you want a page to rank for.',
    definition: [
      'A keyword is a word or phrase that people type or speak into a search engine to find something. In SEO, a keyword is the search query you want a page to appear for, such as "running shoes for flat feet". One page usually targets one main keyword and ranks for many close variations.',
      'Strictly, a query is what one person typed, and a keyword is the generalised version you research and target. Searchers rarely use exactly the same words, so Google matches pages to the meaning of a query, not just its wording. A page about "how to repot a monstera" can rank for "repotting monstera plant" and "when to repot monstera" without containing every phrase.',
      'Keywords range from short, broad [head terms](/glossary/head-terms) like "shoes" to specific [long-tail keywords](/glossary/long-tail-keywords) like "waterproof trail running shoes for women". Each comes with data you can research: [search volume](/glossary/search-volume), [keyword difficulty](/glossary/keyword-difficulty), cost per click and [search intent](/glossary/search-intent).',
    ],
    why: [
      'Keywords are the link between what people want and what you publish. If nobody searches for the words on your page, the page can be perfect and still get no organic traffic. Picking keywords is how you decide which pages to write, what to call them and how to structure your site.',
      'Keywords also make SEO measurable. You can track where a page ranks for its keyword over time, see which queries bring clicks in Google Search Console, and judge whether a piece of content is doing its job.',
    ],
    how: {
      heading: 'How to choose a keyword',
      steps: [
        'Start with what your customers would type, not your internal product names.',
        'Look up search volume to check people actually search for it.',
        'Check keyword difficulty and the current top 10 to judge whether you can compete.',
        'Read the results page to work out the intent: guides, product pages, comparisons or tools.',
        'Pick one main keyword per page and make sure no other page on your site targets the same thing.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A bike shop could target "bike repair" (broad, hard, mixed intent), "bike repair near me" (local, ready to buy) or "how to fix a bike chain" (informational, a good guide topic). Same subject, three different keywords, three different pages.',
    },
    openseo: {
      body: 'Type any keyword into the keyword overview to see its volume, difficulty, traffic potential and the live top 10 in any country, state or city.',
      href: '/tools/keyword-overview',
      label: 'Open the keyword overview',
    },
    related: ['keyword-research', 'search-volume', 'keyword-difficulty', 'search-intent', 'primary-keyword', 'long-tail-keywords'],
    faqs: [
      {
        question: 'Do keywords still matter for SEO?',
        answer: ['Yes. Google understands meaning and synonyms far better than it used to, but people still search with words. Knowing which words they use tells you which topics to cover and how to describe them.'],
      },
      {
        question: 'What is the difference between a keyword and a query?',
        answer: ['A query is the exact text one person searched. A keyword is the phrase you research and target, which stands in for a group of similar queries.'],
      },
      {
        question: 'How many keywords should a page target?',
        answer: ['One primary keyword, plus the secondary keywords and variations that share its intent. A good page often ranks for hundreds of related queries without targeting each one.'],
      },
    ],
  },
  {
    slug: 'keyword-research',
    term: 'Keyword research',
    aka: ['keyword analysis', 'keyword discovery'],
    category: 'keywords',
    short: 'Keyword research is finding the search terms your audience uses, then judging which ones are worth targeting by demand, difficulty and intent.',
    definition: [
      'Keyword research is the process of finding the words and phrases people type into search engines, then deciding which of them your site should target. It combines demand (search volume), competition (keyword difficulty), meaning (search intent) and business value to choose the topics and pages most likely to bring useful organic traffic.',
      'Good keyword research has two halves. The first is discovery: building a long list of possible keywords from [seed keywords](/glossary/seed-keyword), Google’s own suggestions, competitor rankings and your customers’ language. The second is selection: filtering that list down to keywords you can realistically rank for and that match what you sell or know.',
      'Each keyword comes with a few data points. [Search volume](/glossary/search-volume) estimates how many times a month it is searched. [Keyword difficulty](/glossary/keyword-difficulty) estimates how hard it is to reach the top 10. Cost per click shows what advertisers pay for it, which hints at commercial value. [Search intent](/glossary/search-intent) tells you what kind of page Google expects to show. Traffic potential estimates the total traffic a top page gets from all the related queries it ranks for.',
      'Keyword research is not a one-off job. Demand changes with seasons and trends, competitors publish new pages, and Google’s results shift. Most teams do a large round of research when planning a site or a content programme, then revisit it every few months, using real data from Search Console to find new opportunities.',
      'The output is usually a prioritised list grouped by topic: which pages to create, which existing pages to improve, and which keyword each page should target. That list feeds keyword mapping, content briefs and rank tracking.',
    ],
    why: [
      'Keyword research stops you writing pages nobody searches for. It is the cheapest way to check demand before you spend time and money on content, and it often reveals topics you had not thought of, phrased the way customers actually phrase them.',
      'It also helps you pick fights you can win. A new site targeting the hardest head terms in its niche will wait a long time for traffic. The same site targeting specific, lower-difficulty long-tail keywords can start getting visits within months and build authority from there.',
      'Finally, it shapes your site structure. Grouping keywords into topics shows you which pages you need, how they relate and how to link them, which in turn helps search engines understand what your site is about.',
    ],
    how: {
      heading: 'How to do keyword research',
      steps: [
        'Write down 5-10 seed keywords: the products, services, problems and topics your audience cares about.',
        'Expand each seed into a long list using matching terms, related searches, questions and Google’s autocomplete suggestions.',
        'Add the keywords your competitors already rank for, using a keyword gap or competitor report.',
        'Pull data for every keyword: search volume, keyword difficulty, CPC, intent and trend.',
        'Remove keywords that do not fit your business or that you could never credibly answer.',
        'Search the most promising keywords yourself and look at the top 10. Note the page types, how strong the ranking sites are and which SERP features appear.',
        'Group keywords that share an intent and a top 10 into clusters. Each cluster becomes one page.',
        'Prioritise clusters by a mix of business value, traffic potential and how easy they look to rank for.',
        'Map each cluster to an existing or new URL, then track the primary keyword for each page.',
        'Every few months, check Search Console for queries you already get impressions for but rank low on, and add them to the plan.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Seed: "standing desk". Expansion finds "standing desk for small spaces", "is a standing desk worth it", "standing desk vs desk converter" and "best standing desk under 300". The first and last are commercial and suit a product or roundup page. The middle two are informational and suit a guide. Difficulty is lower on all four than on the seed, so a newer site might start there.',
    },
    openseo: {
      body: 'OpenSEO’s keyword ideas tool expands a seed into matching terms, related searches, questions and Google suggestions with volume, difficulty, CPC, intent and a 12-month trend. The keyword research tutorial walks through the whole process.',
      href: '/tools/keyword-ideas',
      label: 'Open keyword ideas',
    },
    related: ['keyword', 'seed-keyword', 'search-volume', 'keyword-difficulty', 'search-intent', 'long-tail-keywords', 'keyword-clustering', 'keyword-mapping', 'keyword-gap', 'seo-strategy'],
    faqs: [
      {
        question: 'How often should you do keyword research?',
        answer: ['Do a full round when you plan a site or a new section, then review every three to six months. Check Search Console monthly for new queries that are already sending you impressions.'],
      },
      {
        question: 'Can you do keyword research for free?',
        answer: ['Partly. Google autocomplete, People Also Ask, Google Trends and Search Console are free. They do not give you reliable volume or difficulty numbers, which is what paid tools or a self-hosted tool like OpenSEO add.'],
      },
      {
        question: 'What makes a good keyword?',
        answer: ['A keyword that real people search for, that matches what you offer, and that you can realistically rank for given the strength of the current top 10. High volume alone does not make a keyword good.'],
      },
      {
        question: 'Should you target keywords with no search volume?',
        answer: ['Sometimes. Tools under-report rare and new queries, so a keyword marked as zero can still bring visits, especially if it is very specific to your product. See [zero-volume keywords](/glossary/zero-volume-keywords).'],
      },
    ],
  },
  {
    slug: 'seed-keyword',
    term: 'Seed keyword',
    aka: ['seed term', 'seed keywords'],
    category: 'keywords',
    short: 'A seed keyword is a short starting term, like "coffee" or "CRM", that you expand into a longer list of keyword ideas during keyword research.',
    definition: [
      'A seed keyword is a short, broad term you use as the starting point for keyword research. You type it into a keyword tool to generate hundreds of longer, more specific ideas. For a coffee roaster, seeds might be "coffee beans", "espresso" and "cold brew". You rarely target the seed itself.',
      'Seeds usually describe your products, your services, the problems your customers have, or the main topics of your niche. They do not need research data of their own; their job is to open up the space. Good seeds come from sales calls, support tickets, competitor menus, forums and the words customers use in reviews.',
    ],
    why: [
      'The ideas you find are only as good as the seeds you start from. If you only seed with your own jargon, you will miss the phrases customers actually use. A wide, well-chosen set of seeds turns up [long-tail keywords](/glossary/long-tail-keywords) and [question keywords](/glossary/question-keywords) that are easier to rank for than the seed itself.',
    ],
    how: {
      heading: 'How to find seed keywords',
      steps: [
        'List your main products, services and categories in plain words.',
        'Add the problems those products solve ("back pain at desk", not just "ergonomic chair").',
        'Look at competitors’ navigation menus and category names.',
        'Read customer reviews, support tickets and forum threads for repeated phrases.',
        'Put each seed into a keyword ideas tool and look at matching terms, related searches and questions.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Seed: "sourdough". Expanded ideas include "sourdough starter recipe", "why is my sourdough dense", "sourdough discard pancakes" and "best flour for sourdough". Each is more specific, easier to match to one page and usually less competitive than "sourdough".',
    },
    openseo: {
      body: 'Enter a seed in keyword ideas to get matching terms, related searches, questions and Google suggestions, each with volume and difficulty.',
      href: '/tools/keyword-ideas',
      label: 'Expand a seed keyword',
    },
    related: ['keyword-research', 'keyword', 'long-tail-keywords', 'head-terms', 'question-keywords'],
    faqs: [
      {
        question: 'How many seed keywords do I need?',
        answer: ['Five to twenty is a practical range for most sites. Each one can produce hundreds of ideas, so more seeds mainly help when your business covers several distinct topics.'],
      },
      {
        question: 'Is a seed keyword the same as a head term?',
        answer: ['Often, but not always. A seed is defined by its role as a starting point. A head term is defined by being short and high-volume. Many seeds are head terms, but a niche seed like "sourdough discard" is not.'],
      },
    ],
  },
  {
    slug: 'long-tail-keywords',
    term: 'Long-tail keywords',
    aka: ['long tail keywords', 'long-tail keyword', 'long-tail search terms'],
    category: 'keywords',
    short: 'Long-tail keywords are specific, lower-volume search terms. Each brings little traffic, but together they’re easier to rank for and often convert well.',
    definition: [
      'Long-tail keywords are specific search terms that each get relatively few searches, such as "quiet dishwasher for open plan kitchen" rather than "dishwasher". They are usually easier to rank for, show clearer intent and, added together, make up a large share of all searches. Most are three or more words long, but length is not the definition.',
      'The name comes from the shape of a demand curve. If you plot every keyword in a niche by search volume, a few [head terms](/glossary/head-terms) sit at the tall "head" on the left, and a very long, thin "tail" of rare queries stretches to the right. Chris Anderson popularised the long tail idea in Wired in 2004, describing how online retailers could earn a lot from many niche products. SEO borrowed the image.',
      'There are two kinds of long-tail keyword. Some are specific versions of a popular topic ("best running shoes for flat feet" is a long-tail of "running shoes"); a page targeting the broader topic may rank for them too. Others are their own niche topic with low volume ("how to clean suede trail shoes"), and need a page of their own. Tools that show a [parent topic](/glossary/parent-topic) help you tell the two apart.',
      'Short does not always mean head, and long does not always mean tail. "Facebook login" is two words but searched enormously. "Rh negative blood type pregnancy" is four words but searched often. What makes a keyword long-tail is low individual demand and high specificity.',
      'Long-tail keywords are also where most [question keywords](/glossary/question-keywords) live, and they overlap with the conversational prompts people type into AI assistants, which tend to be long and detailed.',
    ],
    why: [
      'Fewer sites compete for long-tail keywords, and the sites that do are often less authoritative, so a new or small site can reach the first page much sooner. Each ranking brings modest traffic, but dozens of them add up.',
      'Specific searches also reveal specific needs. Someone searching "invoice software for freelance photographers" knows what they want far better than someone searching "invoice software", so the page that answers them well tends to convert better.',
      'Long-tail content builds topical depth. Covering the specific questions in a topic shows search engines your site knows the subject in detail, which can help your broader pages too.',
    ],
    how: {
      heading: 'How to find long-tail keywords',
      steps: [
        'Start from a seed keyword and pull matching terms that contain it, sorted by volume from low to high.',
        'Look at question lists: who, what, why, how, can, should.',
        'Type the seed into Google and note autocomplete suggestions, People Also Ask and related searches.',
        'Read forums, Reddit threads and support tickets for the exact wording people use.',
        'Check Search Console for queries that already show your site in results but get few clicks.',
        'Filter by keyword difficulty to keep the ones you can realistically win.',
        'Check whether each long-tail keyword shares a top 10 with a broader keyword. If it does, cover it as a section of that page. If not, give it its own page.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Head term: "coffee grinder" (high volume, very hard). Long-tail options: "best coffee grinder for french press" (lower volume, clear commercial intent), "burr vs blade coffee grinder" (comparison), "how to clean a burr grinder with rice" (informational). A small coffee blog could rank for the long-tail terms long before it could compete on the head term.',
    },
    openseo: {
      body: 'Keyword ideas lists matching terms, questions and Google suggestions for any seed with volume and difficulty, so you can filter down to low-competition long-tail terms.',
      href: '/tools/keyword-ideas',
      label: 'Find long-tail keywords',
    },
    related: ['head-terms', 'keyword-research', 'seed-keyword', 'question-keywords', 'zero-volume-keywords', 'parent-topic', 'keyword-difficulty'],
    faqs: [
      {
        question: 'How many words is a long-tail keyword?',
        answer: ['Usually three or more, but word count is a rule of thumb, not the definition. A keyword is long-tail because it is specific and searched relatively rarely.'],
      },
      {
        question: 'Are long-tail keywords worth targeting?',
        answer: ['Yes, especially for newer sites. They are usually easier to rank for, the intent is clearer, and many small rankings together can outweigh one hard-won head term.'],
      },
      {
        question: 'Do I need a separate page for every long-tail keyword?',
        answer: ['No. If a long-tail keyword shows the same results as a broader keyword, one page can rank for both. Writing near-identical pages for each variation can cause [keyword cannibalization](/glossary/keyword-cannibalization) and may look like doorway pages.'],
      },
      {
        question: 'What is the opposite of a long-tail keyword?',
        answer: ['A head term, or short-tail keyword: a broad, high-volume search like "shoes" or "insurance".'],
      },
    ],
  },
  {
    slug: 'head-terms',
    term: 'Head terms (short-tail keywords)',
    aka: ['head term', 'short-tail keywords', 'head keywords', 'short tail keywords'],
    category: 'keywords',
    short: 'Head terms are short, broad, high-volume keywords like "shoes" or "insurance". They bring the most searches but are the hardest to rank for.',
    definition: [
      'Head terms, also called short-tail keywords, are broad search terms with high search volume, such as "laptops", "mortgage" or "yoga". They usually have one or two words, attract heavy competition from established sites, and have mixed or unclear intent because people searching them want many different things.',
      'On a demand curve, head terms are the small number of keywords at the tall end, followed by a much longer tail of specific, rarer searches. A head term like "yoga" might mean classes nearby, poses, history, mats or videos. Because of that ambiguity, Google often shows a mixed results page with videos, local results, shopping and guides.',
    ],
    why: [
      'Ranking for a head term can bring large amounts of traffic and brand visibility, so they are usually the targets for home pages and main category pages. But they are slow and expensive to win, and the traffic converts less well than [long-tail keywords](/glossary/long-tail-keywords) because intent is vague.',
      'Most sites get more from head terms indirectly: by building strong pages for the specific keywords around them, earning links and [topical authority](/glossary/topical-authority), and letting a category page climb over time.',
    ],
    how: {
      heading: 'How to target head terms',
      steps: [
        'Check [keyword difficulty](/glossary/keyword-difficulty) and the authority of the top 10 before committing.',
        'Read the results page to see which intent Google favours; match that page type.',
        'Assign the head term to your strongest relevant page, usually a category or home page.',
        'Support it with long-tail pages that link back to it.',
        'Track its position over months, not weeks.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Running shoes" is a head term. A specialist shop might map it to its main running shoe category, then publish guides on "running shoes for flat feet" and "how often to replace running shoes" that link back to that category.',
    },
    openseo: {
      body: 'The SERP checker shows the live top 10 for a head term with each result’s authority, links and traffic, so you can see what you are up against.',
      href: '/tools/serp-checker',
      label: 'Check the top 10',
    },
    related: ['long-tail-keywords', 'seed-keyword', 'keyword-difficulty', 'search-volume', 'search-intent'],
    faqs: [
      {
        question: 'Should a new website target head terms?',
        answer: ['Usually not at first. Start with long-tail keywords you can rank for, build links and authority, and work up to head terms over time.'],
      },
      {
        question: 'What is the difference between head terms and long-tail keywords?',
        answer: ['Head terms are broad and high-volume with vague intent and heavy competition. Long-tail keywords are specific and lower-volume with clearer intent and less competition.'],
      },
    ],
  },
  {
    slug: 'search-volume',
    term: 'Search volume',
    aka: ['keyword search volume', 'monthly search volume', 'MSV'],
    category: 'keywords',
    short: 'Search volume is the estimated number of times a keyword is searched per month in a given location, usually averaged over the past 12 months.',
    definition: [
      'Search volume is an estimate of how many times a keyword is searched in a given month and location, usually shown as a monthly average over the last 12 months. It measures demand: a keyword with a volume of 5,000 is searched roughly 5,000 times a month. It does not tell you how many clicks a ranking page will get.',
      'Volume numbers are estimates, not counts. Google does not publish exact search counts for every keyword. Its Keyword Planner, built for advertisers, groups close variants together and shows only broad ranges to accounts that are not spending much on ads. Third-party SEO tools build their own estimates from sources such as advertising data, [clickstream data](/glossary/clickstream-data) and their own models. That is why two tools often show different numbers for the same keyword.',
      'Volume is always tied to a location and usually to a language. "Football boots" is searched heavily in the UK, while Americans more often search "soccer cleats". Many tools let you check volume by country, and some by region or city, which matters for local businesses.',
      'Because it is an annual average, volume hides [seasonality](/glossary/seasonality). A keyword with an average of 1,000 might get 6,000 searches in December and almost none in July. Look at the monthly trend, not just the average.',
      'Volume also hides how searches turn into clicks. If Google answers a query directly with a featured snippet, a calculator or an AI Overview, many searchers never click a result. [Zero-click searches](/glossary/zero-click-searches) mean a high-volume keyword can still send little traffic.',
    ],
    why: [
      'Volume is the quickest sanity check on a keyword: if almost nobody searches for it, a page targeting it will get little traffic however well it ranks. It helps you compare options and prioritise topics.',
      'Volume also helps you size a topic before you commit. Adding up the volume of every keyword in a [cluster](/glossary/keyword-clustering) gives a rough idea of total demand for a page or a section, and comparing that with what competitors already capture tells you how much room is left.',
      'But treating volume as the main goal is a common mistake. A low-volume keyword with buying intent can be worth far more than a high-volume one that only attracts browsers. And a page rarely ranks for a single keyword; [traffic potential](/glossary/traffic-potential), which adds up all the related searches a top page captures, is usually a better guide to how much traffic a topic can bring.',
    ],
    how: {
      heading: 'How to use search volume',
      steps: [
        'Check volume in the country (or city) you actually serve.',
        'Look at the 12-month trend to spot seasonal peaks and growing or shrinking demand.',
        'Compare keywords relative to each other rather than trusting any single number exactly.',
        'Weigh volume against keyword difficulty, intent and business value before choosing.',
        'Check the top-ranking page’s traffic or the keyword’s traffic potential, since one page usually ranks for many related searches.',
        'Once you rank, compare the estimate with real impressions in Google Search Console.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Christmas jumper" might show a monthly average of 40,000 in the UK, but nearly all of that falls in November and December. "Wool jumper care" might average 900 with steady demand all year. The first needs a page published by October; the second can be written any time.',
    },
    openseo: {
      body: 'The keyword overview shows a keyword’s volume, volume by country and traffic potential; keyword ideas adds a 12-month trend for every suggestion.',
      href: '/tools/keyword-overview',
      label: 'Check search volume',
    },
    related: ['keyword-research', 'traffic-potential', 'seasonality', 'keyword-trend', 'clickstream-data', 'zero-volume-keywords', 'zero-click-searches', 'impressions'],
    faqs: [
      {
        question: 'How accurate is search volume?',
        answer: ['It is an estimate. Treat it as a guide to relative demand between keywords, not an exact count. Different tools use different data and models, so their numbers differ.'],
      },
      {
        question: 'What is a good search volume for a keyword?',
        answer: ['There is no fixed number. In a narrow B2B niche, 50 searches a month can be valuable; in consumer retail you may need thousands. Judge volume alongside intent, difficulty and what a visitor is worth to you.'],
      },
      {
        question: 'Why does Google Keyword Planner show ranges?',
        answer: ['Keyword Planner is built for advertisers. Accounts without enough ad spend see broad ranges such as "1K-10K" instead of exact averages, and close variants are grouped together.'],
      },
      {
        question: 'Does search volume equal traffic?',
        answer: ['No. Volume is searches, not clicks. Your traffic depends on your position, the click-through rate at that position, SERP features that take clicks, and the other queries your page ranks for.'],
      },
    ],
  },
  {
    slug: 'keyword-difficulty',
    term: 'Keyword difficulty',
    aka: ['KD', 'keyword competition', 'SEO difficulty', 'ranking difficulty'],
    category: 'keywords',
    short: 'Keyword difficulty is an SEO tool’s 0-100 estimate of how hard it is to rank on Google’s first page for a keyword, based on the pages already there.',
    definition: [
      'Keyword difficulty (KD) is a score, usually from 0 to 100, that estimates how hard it would be to rank in Google’s top 10 for a keyword. Higher means harder. SEO tools calculate it from the pages that currently rank, most often from how many and how strong their backlinks are. It is a third-party estimate, not a Google metric.',
      'Each tool has its own formula, so a keyword scored 30 in one tool can be 50 in another. Some scores are based mainly on the number of [referring domains](/glossary/referring-domain) pointing at the top-ranking pages. Others blend in the authority of the ranking domains, the number of SERP features, or other signals. Read your tool’s explanation and compare keywords within one tool, not across tools.',
      'Keyword difficulty is not the same as competition in Google Ads. Ad tools also report "competition" as low, medium or high, but that measures how many advertisers bid on the keyword, not how hard it is to rank organically.',
      'What a difficulty score cannot see is just as important. It usually ignores how well the ranking pages actually answer the query, how relevant your site already is to the topic, your own site’s authority, and whether Google favours a particular page type. A keyword may have a low score because the top pages have few links, yet still be hard because they come from big brands Google trusts on that subject. Or a high-scoring keyword may have a weak, outdated page in the top 10 that a better page could beat.',
      'That is why difficulty is a filter, not a verdict. Use it to sort a long list quickly, then look at the actual results page before you decide.',
    ],
    why: [
      'Difficulty helps you spend effort where it can pay off. A new site with few links will struggle with high-difficulty keywords for a long time, while low-difficulty keywords can start bringing traffic within months. Sorting by difficulty is often the quickest way to find realistic targets in a big keyword list.',
      'It also helps you plan. If a keyword you care about is hard, you know you will need links, depth and time, and can budget for [link building](/glossary/link-building) or build up to it with easier pages in the same topic.',
    ],
    how: {
      heading: 'How to assess keyword difficulty',
      steps: [
        'Use the difficulty score to sort and shortlist, comparing keywords within one tool only.',
        'Open the live top 10 for each shortlisted keyword.',
        'Note how many referring domains the ranking pages have and how strong their domains are.',
        'Compare those numbers with your own site and the page you would rank.',
        'Look for weak spots: forum threads, thin or outdated pages, or pages that do not match the intent well.',
        'Check whether Google favours a page type you can create (guide, product page, tool, video).',
        'Pick keywords where you can realistically publish a better page and earn a similar number of links.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Project management software": KD 85, top 10 full of big software brands and review sites with thousands of referring domains. "Project management template for construction": KD 12, top 10 includes two forum threads and a page with five referring domains. A small construction software company has a real chance on the second.',
    },
    openseo: {
      body: 'The keyword difficulty checker scores up to 1,000 keywords at once and sorts them into easy, medium and hard. The keyword analysis tool shows one keyword’s difficulty next to the live top 10 and each result’s links, so you can check the score against reality.',
      href: '/tools/keyword-difficulty-checker',
      label: 'Check keyword difficulty',
    },
    related: ['keyword-research', 'search-volume', 'referring-domain', 'domain-rating', 'serp', 'head-terms', 'long-tail-keywords', 'backlink'],
    faqs: [
      {
        question: 'What is a good keyword difficulty score?',
        answer: ['It depends on your site. A new site with few links should look for low scores in its tool, roughly the bottom third of the scale. An established site with strong links can compete higher. Compare the top-ranking pages with your own site rather than chasing a fixed number.'],
      },
      {
        question: 'Why does keyword difficulty differ between SEO tools?',
        answer: ['Each tool uses its own link data and its own formula. Some weight referring domains heavily, others mix in domain authority or SERP features. Compare scores within one tool.'],
      },
      {
        question: 'Is keyword difficulty a Google metric?',
        answer: ['No. Google does not publish a difficulty score. Keyword difficulty is an estimate made by SEO tools. The "competition" figure in Google Ads Keyword Planner measures advertiser competition, not organic ranking difficulty.'],
      },
      {
        question: 'Can you rank for a high-difficulty keyword?',
        answer: ['Yes, but expect it to take longer and need more links and depth. Building pages for easier keywords in the same topic first usually makes the hard one more achievable.'],
      },
    ],
  },
  {
    slug: 'cost-per-click',
    term: 'Cost per click (CPC)',
    aka: ['CPC', 'cost-per-click', 'average CPC'],
    category: 'keywords',
    short: 'Cost per click (CPC) is what advertisers pay for one click on a search ad. In SEO, a keyword’s CPC hints at how commercially valuable it is.',
    definition: [
      'Cost per click (CPC) is the amount an advertiser pays each time someone clicks their search ad. In keyword research, a keyword’s CPC is the average recent price of a click on it in Google Ads. SEO tools show it as a rough signal of commercial value: advertisers bid more on searches that lead to sales.',
      'CPC is set by an auction, so it depends on how many advertisers want the keyword, how much a customer is worth to them, and the quality of their ads. It varies by country and changes over time. Insurance, legal and finance keywords are known for high CPCs because one customer is worth a lot; informational searches like "what is a mortgage" usually cost less to advertise on than "mortgage broker near me".',
    ],
    why: [
      'You do not pay CPC for organic clicks, but the number is still useful. A high CPC is a sign that a keyword has [commercial](/glossary/commercial-intent) or [transactional intent](/glossary/transactional-intent), so ranking for it organically could be valuable. It is also the basis of [traffic value](/glossary/traffic-value), which estimates what your organic traffic would cost if you bought it as ads.',
      'Low or zero CPC does not mean worthless. Many informational keywords have no advertisers but still build an audience, links and trust that lead to sales later.',
    ],
    how: {
      heading: 'How to use CPC in keyword research',
      steps: [
        'Add CPC as a column when comparing keywords with similar volume and difficulty.',
        'Prioritise high-CPC keywords that match what you sell, since they tend to signal buyers.',
        'Check the intent on the results page; a high CPC with an informational SERP needs a different page.',
        'Remember CPC is a recent average in one market; check it for the country you serve.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Two keywords with similar volume: "accounting software for small business" (CPC well above the niche average) and "what is double entry bookkeeping" (low CPC). The first is likely to attract people choosing a product; the second attracts learners. Both can be worth a page, but they need different pages and different expectations.',
    },
    openseo: {
      body: 'Keyword ideas shows CPC for every suggestion next to volume, difficulty and intent.',
      href: '/tools/keyword-ideas',
      label: 'See CPC for your keywords',
    },
    related: ['traffic-value', 'commercial-intent', 'transactional-intent', 'paid-results', 'search-engine-marketing', 'keyword-research'],
    faqs: [
      {
        question: 'Does CPC affect organic rankings?',
        answer: ['No. CPC is an advertising price. Google’s organic rankings are separate from its ads auction, and buying ads does not improve organic positions.'],
      },
      {
        question: 'Why is CPC high for some keywords?',
        answer: ['Because many advertisers compete for them and a customer from that search is worth a lot. Legal, insurance, finance and B2B software keywords are typical examples.'],
      },
    ],
  },
  {
    slug: 'traffic-potential',
    term: 'Traffic potential',
    aka: ['TP', 'keyword traffic potential'],
    category: 'keywords',
    short: 'Traffic potential estimates the total organic traffic you could get by ranking first for a topic, counting every related query the top page ranks for.',
    definition: [
      'Traffic potential is an estimate of how much organic traffic a page could get if it ranked at the top for a keyword, counting all the related searches it would also rank for. It is usually calculated from the traffic the current top-ranking page receives across every keyword it ranks for, not just the one you looked up.',
      'The idea exists because pages rarely rank for one keyword. A good guide to "how to clean a cast iron pan" also ranks for "cleaning cast iron skillet", "cast iron care" and dozens of other variants. The [search volume](/glossary/search-volume) of the main keyword alone undercounts that. Traffic potential was popularised by Ahrefs, and several tools now offer a similar figure.',
    ],
    why: [
      'Traffic potential is often a better way to prioritise topics than volume. Two keywords with the same volume can have very different traffic potential: one might be the main way people search a topic, the other one variant among many. It also helps you spot keywords with modest volume that sit inside a large topic.',
      'Like all third-party traffic numbers, it is an estimate built on rank, click-through rates and modelled volumes. Use it to compare, not to forecast exactly.',
    ],
    how: {
      heading: 'How to use traffic potential',
      steps: [
        'Look up a keyword and compare its volume with its traffic potential.',
        'If traffic potential is much higher, the keyword is part of a bigger topic; target the topic with one comprehensive page.',
        'Check the [parent topic](/glossary/parent-topic) to see which keyword drives most of that traffic.',
        'Sort shortlisted topics by traffic potential, then weigh against difficulty and business value.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Best time to plant tulip bulbs" shows a volume of 2,000, but the top-ranking page gets around 9,000 visits a month from 300 related queries such as "when to plant tulips" and "planting tulips in autumn". Its traffic potential is about 9,000, so it is worth more than its volume suggests.',
    },
    openseo: {
      body: 'The keyword overview shows traffic potential next to volume and difficulty for any keyword.',
      href: '/tools/keyword-overview',
      label: 'Check traffic potential',
    },
    related: ['search-volume', 'parent-topic', 'organic-traffic', 'keyword-research', 'organic-ctr-curve'],
    faqs: [
      {
        question: 'What is the difference between search volume and traffic potential?',
        answer: ['Search volume counts searches for one keyword. Traffic potential estimates the clicks a top page gets from that keyword and all the related ones it ranks for.'],
      },
      {
        question: 'Is traffic potential accurate?',
        answer: ['It is a model built on estimated rankings, volumes and click-through rates. It is useful for comparing topics, but your real traffic will differ.'],
      },
    ],
  },
  {
    slug: 'search-intent',
    term: 'Search intent',
    aka: ['user intent', 'keyword intent', 'query intent', 'search query intent'],
    category: 'keywords',
    short: 'Search intent is the reason behind a search: what the person wants to know, find or do. Matching it is one of the most important parts of SEO.',
    definition: [
      'Search intent is the goal behind a search query: what the person actually wants to know, find or do. SEOs usually group it into four types: informational (learn something), navigational (reach a specific site), commercial (compare options before buying) and transactional (buy or act now). Pages that match the intent of a query are far more likely to rank.',
      'Google’s whole job is to satisfy intent, so it studies which results people find useful for each query. That means the current results page is the best evidence of intent. If the top 10 for a keyword are all step-by-step guides, Google has concluded people want a guide, and a product page will struggle to rank there however strong it is.',
      'The four types are a convenient shorthand. [Informational intent](/glossary/informational-intent) covers questions and how-to searches. [Navigational intent](/glossary/navigational-intent) covers searches for a brand or a known page. [Commercial intent](/glossary/commercial-intent) covers research before a purchase, like "best" lists, reviews and comparisons. [Transactional intent](/glossary/transactional-intent) covers searches from people ready to buy, sign up or download. Google’s own Search Quality Rater Guidelines use a similar set of categories: Know, Do, Website and Visit-in-person.',
      'Intent is often mixed. "Coffee machine" could mean someone wants to buy one, compare models, or learn how they work, so the results page mixes shopping results, roundups and guides. In those cases Google shows a blend, and you need to decide which slice your page serves.',
      'Intent also has finer layers than the four types. It includes the format people expect (list, video, calculator, template), the angle (for beginners, cheap, fastest, in 2026) and the depth. These details are visible in the titles and SERP features of the ranking pages. A good way to think about it is the three Cs: content type, content format and content angle.',
      'Intent can change. Searches tied to events, news or products shift over time, and Google adjusts the results. A keyword that showed guides last year may show product listings now, so it is worth rechecking intent for your important keywords.',
    ],
    why: [
      'Matching intent is often the single biggest reason a page ranks or does not. Strong links and good writing cannot make up for the wrong type of page. Many "why is my page not ranking" problems are intent mismatches: a sales page targeting a question, or a blog post targeting a search where people want to buy.',
      'Intent also tells you what a visitor is worth and what to put on the page. Informational visitors need clear answers and a next step; commercial visitors need honest comparisons; transactional visitors need prices, stock and a clear way to buy. Getting this right improves conversions as well as rankings.',
      'It shapes site structure. Grouping keywords by intent tells you whether two keywords belong on one page or two, which prevents [keyword cannibalization](/glossary/keyword-cannibalization) and makes keyword mapping easier.',
    ],
    how: {
      heading: 'How to identify search intent',
      steps: [
        'Search the keyword in an incognito or private window, in the country you target, on the device your audience uses.',
        'Note the type of pages in the top 10: blog posts, product pages, category pages, tools, videos or forum threads.',
        'Note the format: lists, step-by-step guides, comparisons, reviews, templates or calculators.',
        'Note the angle in the titles: "for beginners", "cheap", "best", "in 2026", "near me".',
        'Look at SERP features. Shopping results suggest buying; People Also Ask and featured snippets suggest questions; a map pack suggests local intent.',
        'Read the keyword’s modifiers. "How", "what" and "why" lean informational; "best", "vs" and "review" lean commercial; "buy", "price" and "discount" lean transactional.',
        'If the results are mixed, decide which intent your page will serve, and check that enough of the top 10 share it.',
        'Build the page to match the dominant type, format and angle, then add something the ranking pages lack.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Standing desk": top 10 is mostly product category pages and shopping results, so the intent is transactional. "Are standing desks good for you": top 10 is articles and health sites with a featured snippet, so the intent is informational. "Best standing desk": top 10 is review roundups, so the intent is commercial. A desk retailer needs three different pages for these.',
    },
    openseo: {
      body: 'Keyword ideas labels every keyword with its intent, and the SERP checker shows the live top 10 and SERP features so you can confirm what Google rewards.',
      href: '/tools/serp-checker',
      label: 'Check the results page',
    },
    related: ['informational-intent', 'navigational-intent', 'commercial-intent', 'transactional-intent', 'serp', 'serp-features', 'keyword-research', 'helpful-content', 'search-quality-rater-guidelines'],
    faqs: [
      {
        question: 'What are the four types of search intent?',
        answer: ['Informational (to learn), navigational (to reach a specific site or page), commercial (to research before buying) and transactional (to buy or act now).'],
      },
      {
        question: 'Is search intent a ranking factor?',
        answer: ['Not as a single signal, but Google’s systems are built to show results that satisfy what the searcher wants. In practice, a page that does not match the intent of a query rarely ranks well for it.'],
      },
      {
        question: 'How do I find the search intent of a keyword?',
        answer: ['Search it and study the top 10. The type of pages, their format and angle, and the SERP features Google shows tell you what Google thinks people want.'],
      },
      {
        question: 'Can a keyword have more than one intent?',
        answer: ['Yes. Broad keywords often have mixed intent, and Google shows a blend of page types. Pick the intent you can serve best and check that a meaningful share of the top 10 already serves it.'],
      },
    ],
  },
  {
    slug: 'informational-intent',
    term: 'Informational intent',
    aka: ['informational keywords', 'informational queries', 'know queries'],
    category: 'keywords',
    short: 'Informational intent is when a searcher wants to learn something, such as how to do a task or what a term means, rather than buy or visit a site.',
    definition: [
      'Informational intent describes searches made to learn something: an answer, an explanation, instructions or ideas. Queries such as "what is compound interest", "how to tile a bathroom" or "why do cats purr" have informational intent. People searching them are usually not ready to buy, and Google mostly shows guides, articles, videos and direct answers.',
      'Informational searches often start with question words (what, how, why, when, who) but not always; "photosynthesis" or "tiling tips" are informational too. They are where most [question keywords](/glossary/question-keywords) sit, and they trigger SERP features such as featured snippets, People Also Ask, videos and AI Overviews. Google’s Search Quality Rater Guidelines call these "Know" queries.',
    ],
    why: [
      'Informational keywords make up a large share of searches in most niches and are often easier to rank for than commercial terms. Content that answers them well attracts links, builds [topical authority](/glossary/topical-authority) and introduces people to your brand long before they buy.',
      'They are also the searches most exposed to [zero-click searches](/glossary/zero-click-searches) and AI answers, since a short fact can be answered on the results page. Pages that go deeper than a one-line answer, with examples, steps or original data, tend to hold up better and are more likely to be cited.',
    ],
    how: {
      heading: 'How to target informational keywords',
      steps: [
        'Answer the question clearly in the first paragraph, in 40-60 words.',
        'Then expand with the detail, steps or examples the top pages cover, plus something they lack.',
        'Use headings that match the follow-up questions people ask.',
        'Add a relevant next step, such as a related guide or a product that solves the problem, without turning the page into a sales pitch.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A paint shop targets "how long does paint take to dry" with a guide that answers in the opening lines (touch dry and recoat times by paint type), then covers temperature, humidity and tips, and links to its quick-dry paint range at the end.',
    },
    openseo: {
      body: 'Keyword ideas tags each keyword with its intent and lists questions for any topic, so you can find informational terms worth a guide.',
      href: '/tools/keyword-ideas',
      label: 'Find informational keywords',
    },
    related: ['search-intent', 'question-keywords', 'featured-snippet', 'people-also-ask', 'commercial-intent', 'content-marketing'],
    faqs: [
      {
        question: 'Do informational keywords bring sales?',
        answer: ['Rarely straight away, but they bring people into contact with your brand, earn links and support your commercial pages through internal links and topical authority.'],
      },
      {
        question: 'What are examples of informational keywords?',
        answer: ['"How to change a tyre", "what is a Roth IRA", "symptoms of iron deficiency" and "history of the bicycle" are all informational.'],
      },
    ],
  },
  {
    slug: 'navigational-intent',
    term: 'Navigational intent',
    aka: ['navigational keywords', 'navigational queries', 'website queries'],
    category: 'keywords',
    short: 'Navigational intent is when a searcher wants to reach a specific website or page, such as "gmail login" or "ikea returns".',
    definition: [
      'Navigational intent describes searches made to reach a specific website, brand or page the person already has in mind. Examples are "youtube", "netflix login", "bbc weather" and "ikea returns policy". Rather than typing the address, people search for it. Google usually puts the official site first, often with [sitelinks](/glossary/sitelinks).',
      'Most navigational searches are [branded keywords](/glossary/branded-keywords). Google’s Search Quality Rater Guidelines call them "Website" queries. They can be for a whole site ("amazon") or a particular page on it ("amazon order history").',
    ],
    why: [
      'For your own brand, navigational searches are some of your most valuable traffic: these people already want you. You should rank first for them, with a clear title, a helpful snippet and sitelinks to key pages.',
      'For other brands’ navigational keywords, there is usually little point competing. Someone searching "spotify login" wants Spotify, not an article about it. The exceptions are pages that genuinely add something, such as reviews, alternatives or help guides, which shift the intent towards commercial or informational.',
    ],
    how: {
      heading: 'How to optimise for navigational searches',
      steps: [
        'Make sure your home page and key pages have clear, branded title tags.',
        'Give important pages like login, pricing, contact and support clear names and internal links so Google can show them as sitelinks.',
        'Use Organization structured data and keep your brand name consistent across the web.',
        'Track your brand and "brand + page" keywords to catch competitors or resellers ranking above you.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Searches for "acme hosting status" and "acme hosting login" are navigational. Acme should have pages at /status and /login with clear titles so Google can surface them directly, rather than leaving users to find them via the home page.',
    },
    openseo: {
      body: 'Rank tracking monitors your brand keywords in Google on desktop and mobile, including the SERP features that appear.',
      href: '/features/rank-tracking',
      label: 'Track brand keywords',
    },
    related: ['search-intent', 'branded-keywords', 'sitelinks', 'knowledge-panel', 'informational-intent'],
    faqs: [
      {
        question: 'Should I target competitors’ navigational keywords?',
        answer: ['Usually not with ordinary content. A comparison or alternatives page can rank for "competitor + alternatives" or "competitor vs you", but searches for a competitor’s name or login page are for the competitor.'],
      },
      {
        question: 'Are navigational keywords the same as branded keywords?',
        answer: ['They overlap heavily but are not identical. "Nike" is branded and navigational, while "nike vs adidas running shoes" is branded but commercial.'],
      },
    ],
  },
  {
    slug: 'commercial-intent',
    term: 'Commercial intent',
    aka: ['commercial investigation', 'commercial keywords', 'commercial investigation intent'],
    category: 'keywords',
    short: 'Commercial intent is when a searcher is researching before buying, comparing products, brands or services with searches like "best" or "vs".',
    definition: [
      'Commercial intent describes searches made while researching a purchase: the person plans to buy but has not decided what or from whom. Typical examples are "best electric toothbrush", "dyson vs shark vacuum", "hubspot alternatives" and "ninja air fryer review". Google usually shows reviews, roundups, comparison pages and, increasingly, forum discussions.',
      'Commercial keywords often contain modifiers such as best, top, review, vs, compared, alternatives and cheapest. They sit between [informational intent](/glossary/informational-intent) and [transactional intent](/glossary/transactional-intent), and tend to have higher [CPCs](/glossary/cost-per-click) because the searchers are close to buying.',
    ],
    why: [
      'Commercial searches bring visitors who are close to a purchase, so they are valuable for retailers, software companies and affiliate sites. The pages that rank shape which products people put on their shortlist.',
      'They are also where Google is strictest about quality. Its reviews guidance rewards first-hand testing, evidence and honest pros and cons. Thin roundups that rewrite manufacturer descriptions tend to do poorly, and can fall foul of the spam policy on [thin affiliate pages](/glossary/thin-affiliate-pages).',
    ],
    how: {
      heading: 'How to target commercial keywords',
      steps: [
        'Check what format the top 10 use: roundups, one-to-one comparisons or single reviews.',
        'Show first-hand experience: your own testing, photos, measurements and use cases.',
        'Give clear criteria for your picks and say who each option suits.',
        'Be honest about drawbacks, including your own product’s on [comparison pages](/glossary/comparison-pages).',
        'Link to product or sign-up pages so ready buyers have a next step.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Best project management tool for small teams" has commercial intent. A strong page compares five tools on price, team size limits and setup time, with screenshots from real use and a short verdict for each type of team.',
    },
    openseo: {
      body: 'Keyword ideas labels commercial keywords and shows CPC, and the competitors tool finds the comparison keywords rivals rank for and you do not.',
      href: '/tools/keyword-ideas',
      label: 'Find commercial keywords',
    },
    related: ['search-intent', 'transactional-intent', 'informational-intent', 'comparison-pages', 'cost-per-click', 'thin-affiliate-pages'],
    faqs: [
      {
        question: 'What is the difference between commercial and transactional intent?',
        answer: ['Commercial searchers are still comparing options ("best running watch"). Transactional searchers have decided and want to act ("buy garmin forerunner 265").'],
      },
      {
        question: 'Which words signal commercial intent?',
        answer: ['Best, top, review, vs, versus, compared, alternatives, cheapest and "for" a specific use ("best laptop for video editing") are common signals.'],
      },
    ],
  },
  {
    slug: 'transactional-intent',
    term: 'Transactional intent',
    aka: ['transactional keywords', 'transactional queries', 'buyer intent', 'do queries'],
    category: 'keywords',
    short: 'Transactional intent is when a searcher is ready to act: buy, book, sign up or download, with searches like "buy", "price" or "order".',
    definition: [
      'Transactional intent describes searches made by people ready to complete an action, usually a purchase, booking, sign-up or download. Examples include "buy iphone 16 case", "book dentist appointment", "canva pro discount code" and "download vlc". Google typically shows product and category pages, shopping results, ads and local results.',
      'Transactional keywords often include buy, order, price, deal, coupon, discount, cheap, for sale, near me or a specific product model. Google’s Search Quality Rater Guidelines group these under "Do" queries, where the user wants to accomplish a goal. They usually have the highest [CPCs](/glossary/cost-per-click) in a niche and the strongest competition from both ads and organic results.',
    ],
    why: [
      'Transactional searches convert best, so they matter most for revenue. Even a small number of rankings on them can be worth more than large volumes of informational traffic.',
      'They need the right kind of page. Google rarely ranks a blog post for "buy hiking boots"; it ranks product and category pages. Getting your product and category pages indexed, fast and well described is the core of [ecommerce SEO](/glossary/ecommerce-seo).',
    ],
    how: {
      heading: 'How to target transactional keywords',
      steps: [
        'Map each transactional keyword to a product, category or service page, not a blog post.',
        'Put the product name, key attribute and price clearly on the page and in the title tag.',
        'Add Product structured data so Google can show price, availability and reviews.',
        'Make the action obvious: stock status, delivery, a clear buy or book button.',
        'Keep pages fast and mobile-friendly, since searchers are ready to act and leave if blocked.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Buy oak dining table 6 seater" is transactional. The best target is a category page for six-seater oak tables, filtered and titled to match, with prices, delivery times and product structured data.',
    },
    openseo: {
      body: 'Keyword ideas tags transactional keywords and shows their CPC, and rank tracking follows your product pages’ positions, including shopping and other SERP features.',
      href: '/tools/keyword-ideas',
      label: 'Find transactional keywords',
    },
    related: ['search-intent', 'commercial-intent', 'cost-per-click', 'ecommerce-seo', 'shopping-results', 'landing-page'],
    faqs: [
      {
        question: 'What is an example of a transactional keyword?',
        answer: ['"Buy nike pegasus 41", "pizza delivery near me", "adobe acrobat price" and "sign up for netflix" are all transactional.'],
      },
      {
        question: 'Can a blog post rank for transactional keywords?',
        answer: ['Rarely. Google usually ranks product, category and service pages for transactional searches because that is what lets people act.'],
      },
    ],
  },
  {
    slug: 'primary-keyword',
    term: 'Primary keyword',
    aka: ['main keyword', 'focus keyword', 'target keyword', 'focus keyphrase'],
    category: 'keywords',
    short: 'A primary keyword is the main search term a page is built to rank for. It guides the page’s title, H1, URL and content.',
    definition: [
      'A primary keyword is the main search term a page is designed to rank for, also called the focus or target keyword. It is usually the most searched, most representative phrase in a group of keywords that share the same intent. Each important page should have one primary keyword, and no two pages on a site should share it.',
      'The primary keyword guides the page’s core on-page elements: the [title tag](/glossary/title-tag), H1, URL slug and opening paragraph. Around it sit [secondary keywords](/glossary/secondary-keywords), the variations and subtopics the page also covers. A page that ranks well for its primary keyword normally ranks for many related queries too.',
    ],
    why: [
      'Choosing one primary keyword per page gives the page a clear job, which makes it easier to write, optimise and measure. It is also the main defence against [keyword cannibalization](/glossary/keyword-cannibalization), where several pages compete for the same search.',
      'It gives you something specific to track. Watching the primary keyword’s position shows whether a page is improving, slipping or never got going.',
    ],
    how: {
      heading: 'How to choose a primary keyword',
      steps: [
        'Group keywords that share intent and show largely the same top 10.',
        'Pick the one with the highest volume or traffic potential that still describes the page accurately.',
        'Check no other page on your site already targets it.',
        'Use it naturally in the title tag, H1, URL and first paragraph, without forcing it in elsewhere.',
        'Add it to rank tracking.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Cluster: "how to descale a kettle", "descaling a kettle with vinegar", "kettle limescale removal". Primary keyword: "how to descale a kettle" (highest volume). URL: /how-to-descale-a-kettle. The other two become secondary keywords covered in sections of the same page.',
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings and lists the keywords it already ranks for, so you can confirm it targets the right one.',
      href: '/tools/page-analyser',
      label: 'Analyse a page',
    },
    related: ['secondary-keywords', 'keyword-mapping', 'keyword-cannibalization', 'title-tag', 'h1-tag', 'keyword-clustering'],
    faqs: [
      {
        question: 'How many primary keywords should a page have?',
        answer: ['One. Add secondary keywords for variations and subtopics with the same intent.'],
      },
      {
        question: 'Where should the primary keyword go?',
        answer: ['In the title tag, H1, URL and early in the content, written naturally. There is no required number of repetitions; see [keyword density](/glossary/keyword-density).'],
      },
    ],
  },
  {
    slug: 'secondary-keywords',
    term: 'Secondary keywords',
    aka: ['secondary keyword', 'supporting keywords', 'related keywords'],
    category: 'keywords',
    short: 'Secondary keywords are related terms a page targets alongside its primary keyword: variations, synonyms and subtopics with the same intent.',
    definition: [
      'Secondary keywords are the related search terms a page targets alongside its [primary keyword](/glossary/primary-keyword). They include close variations, synonyms and subtopics that share the same search intent, such as "best hiking boots for wide feet" on a page whose primary keyword is "best hiking boots". Covering them helps the page rank for more queries.',
      'Secondary keywords usually appear in subheadings, paragraphs, image alt text and FAQs rather than the title. They are not a list to sprinkle in; they are a map of the questions and angles the searcher expects the page to cover. If a secondary keyword shows a completely different top 10 from the primary, it probably needs its own page.',
    ],
    why: [
      'A page that covers the subtopics searchers care about is more useful and usually ranks for many more queries than one that repeats its main keyword. Secondary keywords help you plan that coverage, find gaps compared with competitors and write headings people recognise.',
    ],
    how: {
      heading: 'How to find secondary keywords',
      steps: [
        'Look at the keywords the current top-ranking pages rank for besides the main one.',
        'Check related searches, People Also Ask and autocomplete for the primary keyword.',
        'Keep only terms whose top 10 overlaps with your primary keyword’s.',
        'Turn the important ones into H2 or H3 sections, and answer smaller questions in the text or an FAQ.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Primary: "how to start a vegetable garden". Secondary: "vegetable garden layout", "easiest vegetables to grow", "when to start a vegetable garden", "raised bed vs in-ground". Each becomes a section of the guide.',
    },
    openseo: {
      body: 'The page analyser lists every keyword a ranking page gets traffic from, a quick source of secondary keywords for your own version.',
      href: '/tools/page-analyser',
      label: 'See what a page ranks for',
    },
    related: ['primary-keyword', 'keyword-clustering', 'lsi-keywords', 'keyword-mapping', 'header-tags'],
    faqs: [
      {
        question: 'How many secondary keywords should I use?',
        answer: ['As many as the page needs to cover the topic properly, often between three and ten meaningful subtopics. Coverage matters more than a count.'],
      },
      {
        question: 'Are secondary keywords the same as LSI keywords?',
        answer: ['People often use the terms interchangeably, but "LSI keywords" is a misleading name. Secondary keywords are simply related searches with the same intent. See [LSI keywords](/glossary/lsi-keywords).'],
      },
    ],
  },
  {
    slug: 'branded-keywords',
    term: 'Branded keywords',
    aka: ['brand keywords', 'branded search', 'branded queries'],
    category: 'keywords',
    short: 'Branded keywords are searches that include a brand or product name, such as "notion templates" or "tesla model 3 range".',
    definition: [
      'Branded keywords are search terms that contain a specific brand, company or product name, such as "airbnb", "notion pricing" or "nike air max sale". Searches for your own brand show existing awareness; searches for other brands can show research or buying intent. Non-branded keywords, like "running shoes", contain no brand name.',
      'Branded searches are often [navigational](/glossary/navigational-intent) ("slack login") but can be commercial ("slack vs teams") or transactional ("slack pro price"). In Google Search Console, separating branded from non-branded queries is one of the most useful ways to read your data.',
    ],
    why: [
      'Branded traffic mostly reflects how well known you are, not how good your SEO is. Separating it from non-branded traffic tells you whether SEO is actually winning new audiences. A site where almost all organic clicks are branded is relying on people who already know it.',
      'Growth in branded search is still a good sign. It usually follows PR, advertising, word of mouth and good content, and it is one of the things that can make AI assistants and Google treat a brand as a recognised [entity](/glossary/entity).',
    ],
    how: {
      heading: 'How to track branded keywords',
      steps: [
        'List your brand name, product names, common misspellings and your domain.',
        'Filter Search Console queries containing those terms to separate branded and non-branded performance.',
        'Make sure you rank first for your own brand terms, with sitelinks to key pages.',
        'Watch for competitors, resellers or review sites outranking you for "brand + pricing", "brand + reviews" or "brand + alternatives".',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A meal kit company called Greenbox sees 12,000 clicks a month. Filtering Search Console for "greenbox" shows 9,000 are branded. The real non-branded figure, 3,000, is the number to grow with content.',
    },
    openseo: {
      body: 'Connect Search Console in OpenSEO to read your queries with period comparisons, and track brand terms with rank tracking.',
      href: '/features/search-performance',
      label: 'Read your Search Console data',
    },
    related: ['navigational-intent', 'brand-mentions', 'google-search-console', 'sitelinks', 'entity'],
    faqs: [
      {
        question: 'Should I bid on my own branded keywords?',
        answer: ['That is an advertising decision. Organically, you should rank first for your own brand anyway; paid brand ads mainly protect against competitors bidding on your name.'],
      },
      {
        question: 'Can I target a competitor’s branded keywords?',
        answer: ['You can publish fair comparison and alternatives pages. Avoid misleading claims or implying you are the competitor, and be careful with trademarked names in ads.'],
      },
    ],
  },
  {
    slug: 'question-keywords',
    term: 'Question keywords',
    aka: ['question-based keywords', 'question queries'],
    category: 'keywords',
    short: 'Question keywords are searches phrased as questions, like "how do solar panels work". They often trigger featured snippets and People Also Ask.',
    definition: [
      'Question keywords are search queries phrased as questions, usually starting with who, what, when, where, why, how, can, does, is or should. Examples are "how do solar panels work", "can dogs eat grapes" and "is it worth getting a heat pump". They are mostly [informational](/glossary/informational-intent) and tend to be specific, low-competition [long-tail keywords](/glossary/long-tail-keywords).',
      'Question keywords often trigger SERP features: [featured snippets](/glossary/featured-snippet), [People Also Ask](/glossary/people-also-ask) boxes and AI Overviews. They also resemble the prompts people give AI assistants, so pages that answer them clearly are well placed to be cited in AI answers.',
    ],
    why: [
      'Questions show you exactly what your audience wants to know, in their words. Answering them well brings targeted traffic, earns snippets and builds trust before people are ready to buy.',
      'They are also easy to organise. Many questions about a topic can be answered on one strong page, with each important question as a heading.',
    ],
    how: {
      heading: 'How to find question keywords',
      steps: [
        'Use a keyword tool’s questions filter on your seed keywords.',
        'Search your seed and expand the People Also Ask box; each click reveals more questions.',
        'Type "how", "why" or "can" before your topic and read autocomplete.',
        'Check forums, Reddit, support tickets and sales calls for questions customers ask.',
        'Group questions with the same answer, and answer each in a direct 40-60 word paragraph under a heading that repeats the question.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Seed: "heat pump". Questions found: "how much does a heat pump cost to run", "do heat pumps work in cold weather", "can a heat pump replace a boiler". Each could be a section of a heat pump guide, or its own page if the results show dedicated articles.',
    },
    openseo: {
      body: 'Keyword ideas has a questions list for any seed, with volume and difficulty for each question.',
      href: '/tools/keyword-ideas',
      label: 'Find question keywords',
    },
    related: ['informational-intent', 'people-also-ask', 'featured-snippet', 'long-tail-keywords', 'faq-page', 'answer-engine-optimization'],
    faqs: [
      {
        question: 'Should each question keyword get its own page?',
        answer: ['Only if the results show dedicated pages for it. Many related questions are better answered together on one page, which avoids thin, overlapping content.'],
      },
      {
        question: 'How do I get a featured snippet for a question keyword?',
        answer: ['Put the question in a heading and answer it directly in the next paragraph in about 40-60 words, then expand. Google chooses snippets automatically, so there is no guarantee.'],
      },
    ],
  },
  {
    slug: 'keyword-cannibalization',
    term: 'Keyword cannibalization',
    aka: ['keyword cannibalisation', 'SEO cannibalization', 'content cannibalization'],
    category: 'keywords',
    short: 'Keyword cannibalization is when several pages on one site target the same keyword and intent, so they compete and none ranks as well as it could.',
    definition: [
      'Keyword cannibalization happens when two or more pages on the same site target the same keyword and search intent, so they compete with each other in Google. Google usually shows one, may switch between them, and the signals that could strengthen one page are split. The result is often weaker rankings than a single page would get.',
      'It is not a penalty, and not every overlap is a problem. Google has said it is normal for a site to have several pages that rank for related queries, and sometimes two of your pages ranking together is good. Cannibalization matters when pages are near-duplicates serving the same intent, when Google keeps swapping which URL ranks, or when the page you want to rank is outranked by a weaker one. It often grows over time as blogs publish several posts on the same topic years apart.',
    ],
    why: [
      'Splitting one topic across several pages divides [backlinks](/glossary/backlink), internal links and engagement between them, and makes it harder for Google to know which page you consider the best answer. Merging them usually produces one stronger page that ranks higher and more steadily.',
      'It also wastes effort. Each extra page needs updating and crawling, and visitors who land on the weaker version may get an outdated answer.',
    ],
    how: {
      heading: 'How to fix keyword cannibalization',
      steps: [
        'In Search Console, filter the Performance report by a query and look at the Pages tab. Several URLs getting impressions for the same query is a sign to investigate.',
        'Check rank tracking history for one keyword switching between two of your URLs.',
        'Confirm the pages really serve the same intent; if they serve different intents, differentiate them instead of merging.',
        'Pick the strongest page (best links, traffic and content) as the one to keep.',
        'Merge the useful content from the others into it, then [301 redirect](/glossary/301-redirect) the old URLs to it.',
        'If a duplicate must stay live (for example, a print or campaign version), point a [canonical tag](/glossary/canonical-tag) at the main page.',
        'Update internal links so they all point to the chosen page with consistent anchor text.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A blog has "Best budget laptops 2024", "Best cheap laptops" and "Top laptops under 500". All three target the same searches and none reaches page one. Merging them into one updated "Best budget laptops" guide and redirecting the other two typically lifts the remaining page.',
    },
    openseo: {
      body: 'Connect Search Console in OpenSEO to see which queries send impressions to more than one of your pages, and use rank tracking to spot URLs swapping places.',
      href: '/features/search-performance',
      label: 'Check your queries',
    },
    related: ['keyword-mapping', 'primary-keyword', 'duplicate-content', 'canonical-tag', '301-redirect', 'content-pruning', 'content-audit'],
    faqs: [
      {
        question: 'Is keyword cannibalization a Google penalty?',
        answer: ['No. It is not a penalty or a spam issue. It is an efficiency problem: your own pages compete and often rank lower than one consolidated page would.'],
      },
      {
        question: 'Is it bad if two of my pages rank for the same keyword?',
        answer: ['Not necessarily. If both rank well and serve slightly different needs, that can be fine. It is a problem when they are near-duplicates, swap places, or keep each other off page one.'],
      },
      {
        question: 'Should I use canonical tags or redirects to fix cannibalization?',
        answer: ['Redirect when the extra page no longer needs to exist for visitors. Use a canonical tag when a near-duplicate must stay accessible. Google treats canonicals as a hint, while redirects are a stronger signal.'],
      },
    ],
  },
  {
    slug: 'keyword-clustering',
    term: 'Keyword clustering',
    aka: ['keyword grouping', 'keyword clusters', 'SERP clustering'],
    category: 'keywords',
    short: 'Keyword clustering is grouping keywords that share intent and search results, so each group can be targeted by one page.',
    definition: [
      'Keyword clustering is grouping related keywords that share the same search intent and similar Google results, so each group can be targeted by one page. For example, "how to descale a kettle", "kettle descaling vinegar" and "remove limescale from kettle" form one cluster. Clustering turns a long keyword list into a list of pages to create.',
      'The most reliable method is SERP overlap: if two keywords share several of the same URLs in their top 10, Google treats them as one topic, so one page can rank for both. Grouping by shared words alone is less reliable, because "apple pie" and "apple support" share a word but nothing else. Many tools automate SERP-based clustering; you can also do it by hand for smaller lists.',
    ],
    why: [
      'Without clustering, it is easy to write a separate page for every keyword variation, which creates thin, overlapping pages and [keyword cannibalization](/glossary/keyword-cannibalization). Clustering gives you fewer, stronger pages that each rank for many queries.',
      'Clusters also make planning easier. Each cluster has a [primary keyword](/glossary/primary-keyword) and secondary keywords, and related clusters can be organised into a [topic cluster](/glossary/topic-cluster) with a pillar page and supporting pages.',
    ],
    how: {
      heading: 'How to cluster keywords',
      steps: [
        'Export your keyword list with volume and intent.',
        'Pick the highest-volume keyword not yet grouped and look at its top 10.',
        'For each remaining keyword, compare its top 10. If they share around three or more URLs, put it in the same cluster.',
        'Split keywords with different intent into separate clusters even if the wording is similar.',
        'Name each cluster by its primary keyword and sum its volume.',
        'Repeat until every keyword is grouped, then map clusters to pages.',
      ],
    },
    example: {
      label: 'Keyword clusters',
      code: 'Cluster: how to descale a kettle\n  how to descale a kettle\n  descale kettle with vinegar\n  kettle limescale removal\n\nCluster: best kettle for hard water\n  best kettle for hard water\n  kettle with limescale filter',
    },
    openseo: {
      body: 'The competitors tool shows SERP competitors for a list of keywords, and the SERP checker shows the live top 10 for each one so you can compare overlap.',
      href: '/tools/serp-checker',
      label: 'Compare search results',
    },
    related: ['keyword-mapping', 'topic-cluster', 'primary-keyword', 'secondary-keywords', 'search-intent', 'keyword-cannibalization', 'parent-topic'],
    faqs: [
      {
        question: 'What is the difference between keyword clustering and topic clusters?',
        answer: ['Keyword clustering groups keywords that one page can target. A topic cluster is a group of pages, a pillar page and supporting articles, covering a broad subject and linked together.'],
      },
      {
        question: 'How many keywords should be in a cluster?',
        answer: ['As many as share the same results. Some clusters hold two keywords, others hundreds of variations.'],
      },
    ],
  },
  {
    slug: 'keyword-mapping',
    term: 'Keyword mapping',
    aka: ['keyword map', 'keyword-to-URL mapping'],
    category: 'keywords',
    short: 'Keyword mapping is assigning target keywords to specific pages on your site, so every page has a clear focus and no two pages compete.',
    definition: [
      'Keyword mapping is the process of assigning each target keyword, or keyword cluster, to one specific URL on your site. The result, a keyword map, is usually a spreadsheet listing each page with its primary keyword, secondary keywords, intent and status. It shows which pages to create, which to optimise and where two pages overlap.',
      'Mapping comes after [keyword research](/glossary/keyword-research) and [keyword clustering](/glossary/keyword-clustering). For existing sites, you start by recording what each page currently ranks for, then fill gaps with new pages. It is also a good base for internal linking, since pages in the same topic should link to each other.',
    ],
    why: [
      'A keyword map prevents [keyword cannibalization](/glossary/keyword-cannibalization), stops you writing the same article twice, and makes it obvious which topics have no page yet. It also gives writers and developers one source of truth for titles, H1s and URLs.',
      'It makes measurement simple: each page has a keyword to track, so you can see which pages are working.',
    ],
    how: {
      heading: 'How to create a keyword map',
      steps: [
        'List your existing indexable URLs from a crawl or sitemap.',
        'Record each page’s current top queries from Search Console.',
        'Assign each keyword cluster to the existing page that best matches its intent.',
        'Where no page fits, mark the cluster as a new page to create, with a proposed URL.',
        'Flag any two pages targeting the same cluster and decide whether to merge or differentiate them.',
        'Add intent, status and priority columns, and update the map whenever you publish.',
      ],
    },
    example: {
      label: 'Keyword map (excerpt)',
      code: 'URL                          | Primary keyword          | Intent        | Status\n/standing-desks              | standing desk            | transactional | live\n/best-standing-desks         | best standing desk       | commercial    | update\n/are-standing-desks-healthy  | are standing desks good  | informational | to write',
    },
    openseo: {
      body: 'The domain overview lists your site’s top pages and the keywords they rank for, a quick starting point for a keyword map.',
      href: '/tools/domain-overview',
      label: 'See your top pages',
    },
    related: ['keyword-clustering', 'primary-keyword', 'keyword-cannibalization', 'site-architecture', 'internal-links', 'content-brief'],
    faqs: [
      {
        question: 'Can I map more than one keyword to a page?',
        answer: ['Yes. Map one primary keyword and its cluster of secondary keywords. Avoid mapping the same primary keyword to two pages.'],
      },
      {
        question: 'What tool do I need for keyword mapping?',
        answer: ['A spreadsheet is enough. You need keyword data from a research tool and current rankings from Search Console or rank tracking.'],
      },
    ],
  },
  {
    slug: 'keyword-gap',
    term: 'Keyword gap',
    aka: ['keyword gap analysis', 'competitor keyword gap', 'content gap analysis'],
    category: 'keywords',
    short: 'A keyword gap is the set of keywords your competitors rank for and you don’t. Keyword gap analysis finds them so you can target them.',
    definition: [
      'A keyword gap is the set of keywords that one or more competitors rank for but your site does not, or ranks for much lower. Keyword gap analysis compares the rankings of several domains side by side to find those keywords. It is a quick way to find proven topics that already bring competitors traffic.',
      'Gap reports usually show keywords where all competitors rank and you do not (the strongest signal), keywords where you rank weaker than everyone, and keywords only you rank for. The idea overlaps with a [content gap](/glossary/content-gap), which looks at missing topics more broadly. Pick competitors who rank for the same searches as you, which may differ from your business rivals.',
    ],
    why: [
      'Keyword gaps show you demand you are missing in your own niche, with evidence that the topic works. They are especially useful for finding commercial and comparison keywords competitors have built pages for.',
    ],
    how: {
      heading: 'How to do a keyword gap analysis',
      steps: [
        'Find your organic competitors: the domains that rank for many of the same keywords as you.',
        'Enter your domain and two to four competitors into a keyword gap tool.',
        'Filter for keywords where at least two competitors rank in the top 10 and you do not.',
        'Remove keywords that do not fit your business, then sort by [search volume](/glossary/search-volume), [keyword difficulty](/glossary/keyword-difficulty) and intent.',
        'Decide whether each gap needs a new page or an improvement to an existing one.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'An accounting software company compares itself with three rivals. All three rank for "invoice template for contractors" and "how to send an invoice by email"; it has no page for either. Both go on the content plan, along with a template download.',
    },
    openseo: {
      body: 'The keyword gap tool compares your domain with a competitor’s: the keywords only they rank for and the ones you share, with volume, difficulty and both positions.',
      href: '/tools/keyword-gap',
      label: 'Run a keyword gap',
    },
    related: ['content-gap', 'keyword-research', 'link-intersect', 'share-of-voice', 'seo-strategy'],
    faqs: [
      {
        question: 'Who should I compare against in a keyword gap?',
        answer: ['Sites that rank for the same searches as you. These search competitors can include publishers and review sites, not only companies you sell against.'],
      },
      {
        question: 'What is the difference between a keyword gap and a content gap?',
        answer: ['A keyword gap is specific keywords competitors rank for and you do not. A content gap is broader: topics or questions your audience needs answered that your site does not cover.'],
      },
    ],
  },
  {
    slug: 'keyword-density',
    term: 'Keyword density',
    aka: ['keyword frequency', 'keyword ratio'],
    category: 'keywords',
    short: 'Keyword density is how often a keyword appears on a page as a share of total words. It isn’t a ranking target; Google has no ideal density.',
    definition: [
      'Keyword density is the number of times a keyword appears on a page divided by the total number of words, shown as a percentage. A 1,000-word page that uses "cast iron pan" 10 times has a keyword density of 1%. It was a popular SEO metric in the early 2000s, when search engines leaned heavily on word counts.',
      'Today it is not a useful target. Google has said there is no ideal keyword density and that it does not count keyword repetitions to rank pages. Modern search understands synonyms, related terms and meaning, so a page can rank for a phrase it barely repeats. Advice to hit "2-3%" comes from old SEO folklore, not from any search engine.',
    ],
    why: [
      'Keyword density matters mainly as a warning sign. Repeating a keyword unnaturally to push the number up is [keyword stuffing](/glossary/keyword-stuffing), which Google’s spam policies forbid and which can lead to lower rankings or a manual action. It also makes pages worse to read.',
      'What does matter is that the page clearly covers its topic: the [primary keyword](/glossary/primary-keyword) in the title, H1 and opening, and the related subtopics a searcher expects. Write for the reader and the density takes care of itself.',
    ],
    how: {
      heading: 'How to use keywords naturally',
      steps: [
        'Use your primary keyword in the title tag, H1, URL and first paragraph.',
        'Cover the topic’s subtopics and questions, using whatever wording reads naturally.',
        'Use synonyms and pronouns instead of repeating the exact phrase.',
        'Read the page aloud. If a phrase sounds forced, rewrite it.',
        'Ignore density targets in SEO plugins; treat any very high figure only as a prompt to check for stuffing.',
      ],
    },
    example: {
      label: 'Keyword density calculation',
      body: 'Density = (times the keyword appears ÷ total words) × 100. A 1,200-word guide that says "sourdough starter" 9 times has a density of 0.75%. That number tells you nothing about how well the page will rank; whether it answers the question does.',
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings and shows which keywords it already ranks for, which is more useful than a density figure.',
      href: '/tools/page-analyser',
      label: 'Analyse a page',
    },
    related: ['keyword-stuffing', 'primary-keyword', 'content-optimization', 'secondary-keywords', 'google-spam-policies'],
    faqs: [
      {
        question: 'What is the ideal keyword density?',
        answer: ['There is none. Google does not use a density target. Use the keyword where it fits naturally and focus on covering the topic well.'],
      },
      {
        question: 'Can high keyword density hurt rankings?',
        answer: ['Unnatural repetition can. Stuffing keywords into text, lists or hidden areas is against Google’s spam policies and can lead to demotion or a manual action. See [keyword stuffing](/glossary/keyword-stuffing).'],
      },
      {
        question: 'Does keyword density matter in 2026?',
        answer: ['Not as a target. It is only worth looking at to catch accidental over-repetition.'],
      },
    ],
  },
  {
    slug: 'lsi-keywords',
    term: 'LSI keywords',
    aka: ['latent semantic indexing keywords', 'LSI', 'semantically related keywords'],
    category: 'keywords',
    short: 'LSI keywords is an SEO name for related terms. Google says it doesn’t use latent semantic indexing; what matters is covering the topic’s related concepts.',
    definition: [
      'LSI keywords is a popular SEO name for terms related to a page’s main keyword, such as "crust" and "mozzarella" on a pizza recipe. It comes from latent semantic indexing, a retrieval method from the late 1980s. Google has said it does not use LSI, so the label misleads, though covering related terms is sound.',
      'Latent semantic indexing was designed to find relationships between words in small, fixed sets of documents. It does not scale to the web and predates the methods modern search engines use. In 2019 Google’s John Mueller stated plainly that there is no such thing as LSI keywords. Google instead understands language with its own systems, including machine learning models and its [Knowledge Graph](/glossary/knowledge-graph) of [entities](/glossary/entity).',
      'When people say LSI keywords, they usually mean one of three things: synonyms and variations of the keyword, related subtopics that a thorough page would mention, or entities connected to the topic (people, places, products, concepts). All three are worth covering, not because a formula requires them, but because a page that covers a topic fully tends to mention them naturally.',
    ],
    why: [
      'The useful idea behind LSI keywords is topical completeness. A page about "how to brew pour-over coffee" that never mentions grind size, water temperature or a filter is probably thin. Checking which related concepts the best pages cover is a good way to find gaps in your own.',
      'The risk is treating "LSI keyword lists" as words to sprinkle in. That produces awkward text, can drift into [keyword stuffing](/glossary/keyword-stuffing), and does nothing that writing a genuinely complete page would not do better.',
    ],
    how: {
      heading: 'How to find related terms for a topic',
      steps: [
        'Read the top-ranking pages and note the subtopics and concepts they all cover.',
        'Check People Also Ask, related searches and autocomplete for the keyword.',
        'Look at the secondary keywords the top pages also rank for.',
        'Add the missing subtopics as sections or examples where they genuinely help the reader.',
        'Skip any term that does not fit; there is no required list.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'For "how to brew pour-over coffee", related concepts include grind size, water temperature, bloom, coffee-to-water ratio, paper filter and gooseneck kettle. A complete guide explains each because brewers need them, not to hit a list.',
    },
    openseo: {
      body: 'Keyword ideas lists related searches and questions for any keyword, and the page analyser shows every keyword a top page ranks for, which reveals the subtopics it covers.',
      href: '/tools/keyword-ideas',
      label: 'Find related terms',
    },
    related: ['secondary-keywords', 'semantic-search', 'entity', 'knowledge-graph', 'keyword-density', 'keyword-stuffing', 'content-optimization'],
    faqs: [
      {
        question: 'Does Google use LSI keywords?',
        answer: ['No. Google has said it does not use latent semantic indexing. It understands related terms through its own language models and Knowledge Graph.'],
      },
      {
        question: 'Are LSI keywords a myth?',
        answer: ['The name and the claim that Google uses LSI are myths. The underlying advice, covering related subtopics and concepts, is reasonable.'],
      },
      {
        question: 'What should I call LSI keywords instead?',
        answer: ['Related keywords, secondary keywords, subtopics or entities, depending on what you mean.'],
      },
    ],
  },
  {
    slug: 'seasonality',
    term: 'Keyword seasonality',
    aka: ['seasonal keywords', 'search seasonality', 'seasonal search trends'],
    category: 'keywords',
    short: 'Keyword seasonality is the regular rise and fall of searches for a keyword through the year, such as "sunscreen" in summer or "advent calendar" in autumn.',
    definition: [
      'Keyword seasonality is the predictable rise and fall in searches for a keyword at certain times of year. "Halloween costumes" peaks in October, "tax return deadline" around tax season, "sunscreen" in summer and "gym membership" in January. A seasonal keyword can have a modest annual average but very high demand for a few weeks.',
      'Seasonality is hidden by monthly averages, so check a 12-month [keyword trend](/glossary/keyword-trend) or Google Trends to see it. Seasons differ by country and hemisphere: "summer dresses" peaks in December in Australia. Some patterns follow events rather than weather, like exams, sports tournaments, product launches and shopping days such as Black Friday.',
    ],
    why: [
      'Pages need time to be crawled, indexed and climb the rankings, so publishing a seasonal page during the peak is usually too late. Planning around seasonality means updating and promoting pages weeks or months before demand rises, while [evergreen content](/glossary/evergreen-content) can be published any time.',
      'It also explains traffic changes. A drop in organic traffic in a slow season may be normal, not a ranking problem; compare year on year rather than month on month.',
    ],
    how: {
      heading: 'How to plan for seasonal keywords',
      steps: [
        'Check the 12-month trend of your important keywords to find peaks.',
        'Publish or [refresh](/glossary/content-refresh) seasonal pages one to three months before the peak.',
        'Keep seasonal pages on a permanent URL (for example /black-friday rather than /black-friday-2026) so they keep their links each year.',
        'Update the content and dates before each season rather than creating a new page.',
        'Compare traffic and rankings year on year to judge performance.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A garden centre sees "christmas trees near me" go from almost nothing in summer to its yearly peak in late November and early December. It refreshes its Christmas tree page in October, on the same URL it has used for years.',
    },
    openseo: {
      body: 'Keyword ideas shows a 12-month trend for every keyword so you can spot seasonal peaks before you plan content.',
      href: '/tools/keyword-ideas',
      label: 'See keyword trends',
    },
    related: ['keyword-trend', 'search-volume', 'evergreen-content', 'content-refresh', 'freshness'],
    faqs: [
      {
        question: 'When should I publish seasonal content?',
        answer: ['Usually one to three months before demand peaks, so the page has time to be indexed and rank. Refreshing an existing page with history is faster than starting a new one.'],
      },
      {
        question: 'How do I find seasonal keywords?',
        answer: ['Look at a keyword’s 12-month trend in a keyword tool or in Google Trends. A clear repeating peak each year means it is seasonal.'],
      },
    ],
  },
  {
    slug: 'zero-volume-keywords',
    term: 'Zero-volume keywords',
    aka: ['zero search volume keywords', 'ZSV keywords', 'no volume keywords'],
    category: 'keywords',
    short: 'Zero-volume keywords are searches that keyword tools report as having no monthly volume, though many still get real searches and clicks.',
    definition: [
      'Zero-volume keywords are search terms that keyword tools show as having zero or near-zero monthly [search volume](/glossary/search-volume). Many still get searched. Tools estimate volume from limited data and often round down rare, new or very specific queries, so a keyword marked as zero can bring real visitors, especially from people close to buying.',
      'There are a few reasons for the gap. Volume databases only cover keywords someone has added, and very new searches have no history. Google has said for years that around 15% of the searches it sees each day are new. Advertising data can group close variants under one keyword, leaving the others at zero. And B2B or niche terms may be searched only a handful of times a month, below what tools display.',
    ],
    why: [
      'Zero-volume keywords often have little competition and very specific intent. A query like "invoice software for dog groomers" may show zero, yet the few people who search it are ideal customers. Together, many such keywords can add up to meaningful traffic.',
      'They are also a good fit for new sites, product-specific questions and terms your customers use that tools have not caught up with.',
    ],
    how: {
      heading: 'How to find zero-volume keywords worth targeting',
      steps: [
        'Check Search Console for queries that show impressions but which tools list as zero.',
        'Mine sales calls, support tickets and forums for specific questions customers ask.',
        'Look at the top 10: if Google shows dedicated, relevant pages, someone is searching.',
        'Check whether the keyword has a broader [parent topic](/glossary/parent-topic); if it does, cover it within that page instead.',
        'Prioritise zero-volume keywords with clear buying intent or a direct link to your product.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'A scheduling app writes a page on "appointment booking software for piano teachers". Tools show zero volume. Six months later Search Console shows a few hundred impressions a month across dozens of similar queries, and the page has brought several paying customers.',
    },
    openseo: {
      body: 'Connect Search Console to OpenSEO to see real impressions for queries that keyword databases miss.',
      href: '/features/search-performance',
      label: 'See your real queries',
    },
    related: ['long-tail-keywords', 'search-volume', 'google-search-console', 'impressions', 'question-keywords'],
    faqs: [
      {
        question: 'Are zero-volume keywords worth targeting?',
        answer: ['Often, when they are specific to your product or customers. Low competition and clear intent can make them more valuable than their reported volume suggests.'],
      },
      {
        question: 'Why does a keyword show zero volume but get clicks?',
        answer: ['Because volume figures are estimates from limited data. Rare, new and niche searches are often under-reported or grouped with other variants.'],
      },
    ],
  },
  {
    slug: 'striking-distance-keywords',
    term: 'Striking distance keywords',
    aka: ['striking distance', 'low-hanging fruit keywords', 'quick win keywords'],
    category: 'keywords',
    short: 'Striking distance keywords are queries a page ranks for just off the top spots, roughly positions 5-20, where small improvements can bring big gains.',
    definition: [
      'Striking distance keywords are search queries a page already ranks for just below the top results, usually somewhere around positions 5 to 20. Because the page is already relevant enough to rank, modest improvements to its content, title or internal links can move it onto page one or into the top three, where most clicks happen.',
      'The exact range varies by who you ask: some use positions 11-20 (the top of page two), others include the lower half of page one. The point is the same: these keywords have proven relevance and demand, so they are usually faster wins than new content. You find them in [Google Search Console](/glossary/google-search-console), which reports the [average position](/glossary/average-position) and impressions for each query.',
    ],
    why: [
      'Clicks fall sharply as you move down the results, so a jump from position 12 to position 4 can multiply a page’s traffic for that query. Improving an existing page is also cheaper and quicker than writing a new one.',
    ],
    how: {
      heading: 'How to find striking distance keywords',
      steps: [
        'In Search Console, open the Performance report for the last three months and show queries with position and impressions.',
        'Filter for average position between about 5 and 20, and sort by impressions.',
        'Check which page ranks for each query and that it is the right page.',
        'Improve that page for the query: answer it more directly, add a section, update the title tag, refresh outdated details.',
        'Add internal links to the page from related pages, using relevant anchor text.',
        'Track the query and compare positions after a few weeks.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Search Console shows "how to clean a dishwasher filter" at average position 11 with 4,000 impressions and 40 clicks. The page mentions filters in one line. Adding a step-by-step section on filters and linking to it from two related posts moves it to position 4.',
    },
    openseo: {
      body: 'OpenSEO’s search performance view pulls striking-distance queries (positions 5-20) from Search Console with opportunity scores, so you can see which to work on first.',
      href: '/features/search-performance',
      label: 'Find striking distance keywords',
    },
    related: ['google-search-console', 'average-position', 'impressions', 'organic-ctr-curve', 'content-refresh', 'internal-links'],
    faqs: [
      {
        question: 'What position counts as striking distance?',
        answer: ['There is no official range. Positions 11-20 are the classic definition; many SEOs include roughly 5-10 as well, since moving into the top three also brings big gains.'],
      },
      {
        question: 'How long does it take to improve a striking distance keyword?',
        answer: ['Changes can show within days to a few weeks after Google recrawls the page, but results vary and are not guaranteed.'],
      },
    ],
  },
  {
    slug: 'parent-topic',
    term: 'Parent topic',
    aka: ['parent keyword', 'parent topic keyword'],
    category: 'keywords',
    short: 'A parent topic is the broader keyword that the top-ranking page for a search gets most of its traffic from. It shows whether one page can cover both.',
    definition: [
      'A parent topic is the broader keyword behind a more specific search: the keyword the current top-ranking page gets most of its traffic from. If the top page for "best time to water tomatoes" gets most of its traffic from "how often to water tomatoes", that is the parent topic. Ahrefs popularised the term.',
      'Parent topics answer a practical question in [keyword research](/glossary/keyword-research): does this keyword need its own page, or can it be covered as part of a broader one? If a keyword’s parent topic is a different keyword, Google is likely treating them as one topic, and a single page can rank for both. If a keyword is its own parent topic, it may warrant a dedicated page.',
    ],
    why: [
      'Parent topics help you avoid writing near-duplicate pages for variations of the same idea, which wastes effort and can cause [keyword cannibalization](/glossary/keyword-cannibalization). They also point you to the version of a topic with the most [traffic potential](/glossary/traffic-potential).',
    ],
    how: {
      heading: 'How to use parent topics',
      steps: [
        'Look up the parent topic for each keyword on your list.',
        'Group keywords that share a parent topic into one cluster.',
        'Target the parent topic as the primary keyword, and the rest as secondary keywords.',
        'Check the SERP: if the results for the specific keyword are very different, it may still need its own page.',
      ],
    },
    example: {
      label: 'Worked example',
      body: '"Can you freeze cooked rice", "how long can cooked rice be frozen" and "freezing rice safely" all have the parent topic "can you freeze rice". One page targeting "can you freeze rice" and answering the variations can rank for all of them.',
    },
    related: ['traffic-potential', 'keyword-clustering', 'primary-keyword', 'secondary-keywords', 'long-tail-keywords'],
    faqs: [
      {
        question: 'Is parent topic a Google metric?',
        answer: ['No. It is a concept from SEO tools, calculated from the keywords the top-ranking page ranks for.'],
      },
      {
        question: 'Should I always target the parent topic instead?',
        answer: ['Usually, if the results are similar. If the specific keyword shows different pages with a different intent, give it its own page.'],
      },
    ],
  },
  {
    slug: 'clickstream-data',
    term: 'Clickstream data',
    aka: ['clickstream', 'click-stream data', 'panel data'],
    category: 'keywords',
    short: 'Clickstream data records the pages and clicks of a panel of users. SEO tools use it to estimate search volume, clicks and traffic.',
    definition: [
      'Clickstream data is a record of the sequence of pages and links a group of internet users visit and click. In SEO, third-party tools use anonymised clickstream data from consenting user panels to estimate search volumes, how many searches lead to a click and how much traffic sites get.',
      'Google does not share exact search counts for every keyword, and its advertising data is grouped and rounded. Panels are typically people using certain browser extensions or apps who agreed to share their browsing. Clickstream data helps tools fill gaps: estimating volume for keywords advertisers ignore, separating close variants, and seeing [zero-click searches](/glossary/zero-click-searches). It is a sample, though, so it reflects whoever is in the panel and is less reliable for small countries, niche topics and rare queries. Panels can also shrink or close, which is one reason tools revise their estimates over time.',
    ],
    why: [
      'Understanding clickstream data explains why SEO tools disagree. Each tool combines different sources, panels and models, so [search volume](/glossary/search-volume) and traffic estimates differ. The numbers are best used to compare keywords and competitors, not as exact counts.',
      'For your own site, first-party data beats any estimate. [Google Search Console](/glossary/google-search-console) shows the real impressions and clicks Google recorded for your pages.',
    ],
    example: {
      label: 'Worked example',
      body: 'A panel shows that of everyone in it who searched "time in tokyo", very few clicked a result, because Google answered on the page. A tool using that data can flag the keyword as mostly zero-click even if its volume is high.',
    },
    related: ['search-volume', 'zero-click-searches', 'traffic-potential', 'google-search-console', 'organic-ctr-curve'],
    faqs: [
      {
        question: 'Is clickstream data accurate?',
        answer: ['It is a sample of users, so it is an estimate. It is more reliable for popular keywords in large markets and less so for niche or rare queries.'],
      },
      {
        question: 'Is clickstream data legal?',
        answer: ['Reputable panels collect it with user consent and anonymise it. Privacy rules such as GDPR apply, and how data is collected varies by provider.'],
      },
    ],
  },
  {
    slug: 'keyword-trend',
    term: 'Keyword trend',
    aka: ['search trend', 'keyword trends', 'search volume trend'],
    category: 'keywords',
    short: 'A keyword trend shows how searches for a keyword change over time, usually month by month, so you can spot growth, decline and seasonal peaks.',
    definition: [
      'A keyword trend shows how search demand for a keyword changes over time, usually as monthly search volume across the past 12 months or longer. It reveals whether interest is growing, falling, steady or [seasonal](/glossary/seasonality). A single monthly average hides all of this, so the trend is an essential second look in keyword research.',
      'Keyword tools show trends as estimated monthly volumes. Google Trends shows relative interest on a 0-100 scale, where 100 is the peak for the chosen time and place; it does not show absolute numbers, but it covers long time spans and lets you compare terms. Sudden spikes often come from news, product launches or viral moments and may not last.',
    ],
    why: [
      'Trends help you invest in topics with a future. A keyword with a modest average but steady growth can be a better target than a bigger one in decline. They also help you time content for seasonal peaks and explain changes in your own traffic.',
    ],
    how: {
      heading: 'How to check a keyword trend',
      steps: [
        'Look at the 12-month trend next to the average volume in your keyword tool.',
        'Use Google Trends to view five years or more and compare related terms.',
        'Separate one-off spikes from steady growth or a repeating seasonal pattern.',
        'Compare against your own [impressions](/glossary/impressions) in [Google Search Console](/glossary/google-search-console) for the same queries.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Two keywords average 2,000 searches a month. One has been climbing steadily for a year; the other spiked to 15,000 in one month after a news story and is now near 500. The first is the better long-term target.',
    },
    openseo: {
      body: 'Keyword ideas shows a 12-month trend for every keyword next to its volume and difficulty.',
      href: '/tools/keyword-ideas',
      label: 'See keyword trends',
    },
    related: ['seasonality', 'search-volume', 'keyword-research', 'freshness', 'impressions'],
    faqs: [
      {
        question: 'What do the numbers in Google Trends mean?',
        answer: ['They are relative interest from 0 to 100, scaled to the highest point in the chosen period and location. They are not search counts.'],
      },
      {
        question: 'Should I target trending keywords?',
        answer: ['Only if the topic suits your site and you can publish quickly. For lasting traffic, prefer keywords with steady or growing demand.'],
      },
    ],
  },
];
