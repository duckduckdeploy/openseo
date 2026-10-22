import type { GlossaryTerm } from './types';

export const terms: GlossaryTerm[] = [
  {
    slug: 'ai-visibility',
    term: 'AI visibility',
    aka: ['AI search visibility', 'LLM visibility', 'AI brand visibility'],
    category: 'ai-search',
    short: 'AI visibility is how often and how prominently AI assistants such as ChatGPT, Gemini, Claude and Perplexity mention your brand or cite your site.',
    definition: [
      'AI visibility is a measure of how often, and how prominently, AI assistants mention your brand or cite your website when people ask them questions. It covers answer engines such as ChatGPT, Gemini, Claude and Perplexity, plus AI features inside search engines, such as Google’s AI Overviews and AI Mode.',
      'It has two parts that are worth keeping apart. A **mention** is when the answer names your brand, product or person. A **citation** is when the answer links to a page on your site as a source. You can be mentioned without being cited (the model knows you, but sourced the answer elsewhere), and cited without being mentioned (your page supplied a fact, but the answer recommends someone else). Both matter, for different reasons.',
      'AI visibility is not one number in one place. Answers change from run to run, differ between models, and depend on whether the assistant searched the web or answered from what it learned in training. With web search on, the assistant runs searches, reads pages and cites some of them, so your [organic rankings](/glossary/keyword-ranking) and your content both feed into it. Without search, the answer comes from training data, which reflects what was written about you across the web up to the model’s cut-off date.',
      'Because answers vary, you measure AI visibility the way you would measure a poll, not a fixed ranking: you ask a fixed set of questions (prompts) repeatedly, across several models, and look at rates over time. The usual measures are mention rate (share of answers that name you), citation rate (share of answers that link to you), citation position (where your link appears among the sources) and [share of voice](/glossary/share-of-voice) against competitors.',
    ],
    why: [
      'People now ask AI assistants many of the questions they used to type into a search box: “what is the best CRM for a small agency”, “how do I fix a leaking tap”, “which plumbers in Leeds open on Sunday”. When the answer names three companies and links to four pages, the brands and pages left out lose that moment, even if they rank well in classic results.',
      'AI visibility also overlaps with ordinary SEO more than the hype suggests. Google says there are no special requirements to appear in AI Overviews or AI Mode beyond being indexed and eligible for a snippet, and other assistants with web search rely on search results too. Pages that rank, answer the question clearly and are trusted by other sites tend to be the ones cited. Measuring AI visibility tells you whether that work is reaching the answers, and which competitors and sources the models prefer instead.',
      'It is also a check on accuracy. Assistants sometimes describe a brand with out-of-date prices, features that no longer exist or a competitor’s details. You can’t edit an AI answer directly, but you can only fix what you have seen.',
    ],
    how: {
      heading: 'How to measure AI visibility',
      steps: [
        'Write 20-50 prompts that a real customer would ask, across the funnel: problem questions (“how do I…”), category questions (“best X for Y”) and comparison questions (“X vs Y”). Keep most prompts unbranded, because a prompt that names you will mention you by definition.',
        'Run each prompt on the assistants your audience uses, with web search turned on, so the answers cite sources the way users see them.',
        'Record for each answer: whether your brand is mentioned, whether your site is cited, the position of your citation and which competitors and third-party pages are cited instead.',
        'Repeat on a schedule, with the same prompts and models, and compare rates rather than single answers. One answer is an anecdote; fifty runs show a trend.',
        'Study the pages that are cited for prompts you miss. They show the format, depth and sources the models favour, and often point to [content gaps](/glossary/content-gap) or to third-party sites (reviews, lists, forums) where your brand is absent.',
        'Act on what you find with ordinary SEO and PR: improve the pages that should be cited, earn coverage on the sites that are cited, and correct wrong facts at their source.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Prompt: “best open-source rank tracker”. Run 10 times on each of four assistants (40 answers). Your brand is named in 14 answers (35% mention rate) and your site is cited in 9 (22.5% citation rate), usually as the third or fourth source. A competitor is named in 30 answers, and the most cited page overall is a third-party comparison article that doesn’t list you. That article is your first outreach target.',
    },
    openseo: {
      body: 'The free AI visibility checker asks ChatGPT, Gemini, Claude and Perplexity one question with web search on and shows the sources each cites, in order. For ongoing tracking, the AI visibility feature runs your saved prompts across 120+ models and reports brand mentions, citations and position.',
      href: '/features/ai-visibility-tracker',
      label: 'Track AI visibility',
    },
    related: ['generative-engine-optimization', 'ai-citations', 'brand-mentions', 'prompt-tracking', 'share-of-voice', 'ai-overviews'],
    faqs: [
      {
        question: 'How do I check if ChatGPT mentions my brand?',
        answer: [
          'Ask ChatGPT the unbranded questions your customers ask, with search on, and note whether your brand appears and which sources it cites. Because answers vary, repeat each question several times or use a tool that runs prompts on a schedule.',
        ],
      },
      {
        question: 'Is AI visibility the same as SEO?',
        answer: [
          'No, but they overlap heavily. Assistants that search the web lean on search results, so strong rankings and clear, well-sourced pages help. AI visibility adds things classic rank tracking doesn’t show, such as whether your brand is named and which third-party pages shape the answer.',
        ],
      },
      {
        question: 'Why do AI answers change every time I ask?',
        answer: [
          'Language models generate text with some randomness, and assistants with web search may run different searches each time. That is why you track rates across many runs instead of trusting one answer.',
        ],
      },
      {
        question: 'Can I pay to appear in AI answers?',
        answer: [
          'Some assistants have started to show labelled ads alongside answers, but you can’t buy a place inside the organic answer or its citations. Those come from the model and the sources it finds.',
        ],
      },
    ],
  },
  {
    slug: 'generative-engine-optimization',
    term: 'Generative engine optimization (GEO)',
    aka: ['GEO', 'generative engine optimisation', 'generative search optimization'],
    category: 'ai-search',
    short: 'Generative engine optimization (GEO) is the practice of improving how often AI-generated answers mention your brand and cite your pages.',
    definition: [
      'Generative engine optimization (GEO) is the practice of improving how often generative AI systems, such as ChatGPT, Gemini, Perplexity, Claude and Google’s AI Overviews, mention your brand and cite your pages in their answers. It applies SEO thinking to answers that are written by a model rather than listed as ten blue links.',
      'The term was popularised by a 2023 academic paper, “GEO: Generative Engine Optimization”, by researchers at Princeton and other institutions, which tested how changes to a page’s text (adding quotations, statistics and citations, for example) affected how visible it was in generated answers. Since then GEO has become a marketing label with a loose meaning. Some people use it for everything that affects [AI visibility](/glossary/ai-visibility); others treat it as a synonym for [answer engine optimization](/glossary/answer-engine-optimization) or LLM SEO. The differences between these terms are mostly emphasis, not substance.',
      'Most of what works in GEO is SEO you would do anyway. AI assistants with web search find sources through a search index, so a page has to be crawlable, indexable and ranking for the queries the assistant runs. The page then has to answer the question plainly, so that a model can lift a clear sentence or fact from it. And because models also learn from what the wider web says about you, your brand mentions on reviews, lists, forums and news sites shape the answer as much as your own pages.',
      'Be careful with GEO advice that promises shortcuts. Google’s own guidance on optimising for its generative AI features says you don’t need special AI text files, special markup or to break content into tiny chunks, and that creating many pages to target every variation of an AI query can violate its [scaled content abuse](/glossary/scaled-content-abuse) policy. Tactics such as planting fake mentions or hidden instructions for AI models are manipulation and carry the same risks as any other spam.',
    ],
    why: [
      'A growing share of questions is answered inside an AI interface. When the answer recommends specific brands and links to a handful of sources, being one of them is the new version of ranking on page one. When you are absent, you often don’t find out from your analytics, because there was never a click to measure.',
      'GEO also gives you a reason to fix things that help classic SEO: thin pages, vague answers, missing facts, an unclear brand entity, and a lack of independent sites talking about you. Work that improves citations in AI answers rarely hurts rankings, and the reverse is usually true as well.',
    ],
    how: {
      heading: 'How to do generative engine optimization',
      steps: [
        'Start with measurement. Pick the questions your customers ask and track whether AI answers mention and cite you, so you have a baseline and know which prompts to work on.',
        'Get the SEO basics right. Make sure the pages you want cited are indexed, load fast, are not blocked to the search and AI crawlers you care about, and rank for the underlying queries. See [AI crawlers](/glossary/ai-crawlers) for which bots to allow.',
        'Answer the question directly near the top of the page, in a sentence a model could quote. Follow with detail, steps, examples and sources.',
        'Add what only you can add: original data, first-hand testing, prices, specifications, expert quotes. [Information gain](/glossary/information-gain) is what makes a page worth citing over the ten others saying the same thing.',
        'Keep facts about your brand consistent everywhere: your site, your Google Business Profile, directories, social profiles and press. Models build their picture of your brand from all of them.',
        'Earn mentions on the third-party pages that AI answers already cite for your topic, through digital PR, reviews and genuine community participation.',
        'Re-measure on the same prompts and models after each change, and judge by trends across many runs.',
      ],
    },
    openseo: {
      body: 'Use the AI visibility checker to see which sources ChatGPT, Gemini, Claude and Perplexity cite for a question, then track a set of prompts over time across 120+ models with the AI visibility feature.',
      href: '/tools/ai-visibility-checker',
      label: 'Open the AI visibility checker',
    },
    related: ['answer-engine-optimization', 'llm-seo', 'ai-visibility', 'ai-citations', 'ai-overviews', 'seo'],
    faqs: [
      {
        question: 'Is GEO replacing SEO?',
        answer: [
          'No. AI assistants that search the web depend on search indexes and on pages that rank, so SEO is the foundation GEO is built on. GEO adds measurement of AI answers and more attention to brand mentions across the web.',
        ],
      },
      {
        question: 'What is the difference between GEO and AEO?',
        answer: [
          'In practice very little. AEO (answer engine optimization) is the older term, first used for featured snippets and voice assistants; GEO was coined for generative AI answers. Both are about being the source an answer is built from.',
        ],
      },
      {
        question: 'Do I need llms.txt or special schema for GEO?',
        answer: [
          'Google says it doesn’t use llms.txt and that no special markup is needed for its AI features. Structured data is still useful for rich results and for describing your organisation, but it isn’t a GEO switch.',
        ],
      },
      {
        question: 'How long does GEO take to work?',
        answer: [
          'Answers based on live web search can change within days of a page being indexed or updated. Answers drawn from a model’s training data only change when a new model version is trained, which can take months.',
        ],
      },
    ],
  },
  {
    slug: 'answer-engine-optimization',
    term: 'Answer engine optimization (AEO)',
    aka: ['AEO', 'answer engine optimisation'],
    category: 'ai-search',
    short: 'Answer engine optimization (AEO) is optimising content so search features and AI assistants use it to answer questions directly.',
    definition: [
      'Answer engine optimization (AEO) is the practice of structuring content so that search engines and AI assistants use it to answer a question directly, rather than just listing it as a link. Targets include featured snippets, People Also Ask boxes, voice assistants, Google’s AI Overviews and AI Mode, and chat assistants such as ChatGPT and Perplexity.',
      'AEO is older than the current wave of AI search. The term was used in the late 2010s, when [featured snippets](/glossary/featured-snippet) and voice assistants such as Alexa and Google Assistant started reading out a single answer. The aim then was to be that answer. With generative AI, the answer is now often written by a model from several sources, so the aim has widened: be one of the sources the model draws on and cites.',
      'Today AEO and [generative engine optimization](/glossary/generative-engine-optimization) describe almost the same work. AEO tends to stress the format of the answer: clear questions as headings, a direct answer in the first sentence or two, then detail. GEO tends to stress measurement across AI assistants and the role of brand mentions. You don’t need to choose between them.',
      'An “answer engine” is any system whose main output is an answer rather than a list of pages. Perplexity markets itself as one; ChatGPT with search, Gemini, Claude and Copilot work similarly. Google Search is a hybrid: classic results plus AI Overviews and, in AI Mode, a fully conversational answer.',
    ],
    why: [
      'Many questions now end without a click: the answer is on the results page or in the chat. If your content supplies the answer, you still get the brand exposure, a citation link that some users click, and the credibility of being the source. If a competitor supplies it, they get all three.',
      'Writing for answers also makes pages better for people. A reader who lands on your page wants the answer quickly, then the detail. The same structure that helps an AI system extract a clear passage helps a human scan the page.',
      'AEO is not a separate ranking system to game. Google says its AI features use the same index and core ranking systems as Search, and other answer engines rely on search results to find sources. A page that isn’t indexed, or that doesn’t rank for any version of the question, is unlikely to become the answer however well it is formatted.',
    ],
    how: {
      heading: 'How to optimise content for answer engines',
      steps: [
        'Collect the real questions people ask on your topic: People Also Ask, Google Autocomplete, [question keywords](/glossary/question-keywords), support tickets and sales calls.',
        'Use the question, or a close version of it, as a heading, and answer it in the first one or two sentences under that heading. Keep that answer self-contained, so it makes sense if quoted alone.',
        'Follow the short answer with the depth: steps, examples, numbers, caveats and sources. Answer engines favour pages that both answer quickly and support the answer.',
        'Use lists and tables where the content really is a list or a comparison. Don’t force them where it isn’t.',
        'Keep facts current and dated. A model choosing between two sources is more likely to trust the one with a clear, recent date and named author.',
        'Make sure the page is indexed and eligible for snippets: no accidental noindex or nosnippet, and not blocked in robots.txt.',
        'Check the result in the places that matter: the SERP for snippets and AI Overviews, and AI assistants for citations.',
      ],
    },
    example: {
      label: 'Answer-first structure',
      code: `<h2>How long does a boiler service take?</h2>
<p>A standard gas boiler service takes 30 to 60 minutes. An engineer checks the
flue, burner, seals and gas pressure and tests for carbon monoxide.</p>
<h3>What affects how long it takes</h3>
<ul>
  <li>Boiler age and type</li>
  <li>Whether parts need cleaning or replacing</li>
</ul>`,
    },
    openseo: {
      body: 'Check which SERP features, including AI Overviews and People Also Ask, show for a keyword with the SERP checker, then see which sources AI assistants cite for the same question with the AI visibility checker.',
      href: '/tools/ai-visibility-checker',
      label: 'Open the AI visibility checker',
    },
    related: ['generative-engine-optimization', 'featured-snippet', 'people-also-ask', 'zero-click-searches', 'question-keywords', 'ai-overviews'],
    faqs: [
      {
        question: 'Is AEO the same as GEO?',
        answer: [
          'They overlap almost completely. AEO is the older term from the featured-snippet and voice era; GEO was coined for generative AI answers. The practical work, clear answers on strong pages, is the same.',
        ],
      },
      {
        question: 'Does FAQ schema help AEO?',
        answer: [
          'Google stopped showing FAQ rich results in May 2026, and it says no special markup is needed for its AI features. Writing clear questions and answers in the visible page text is what matters.',
        ],
      },
      {
        question: 'What is an answer engine?',
        answer: [
          'An answer engine is a search tool whose main output is a direct answer rather than a list of links, such as Perplexity, ChatGPT search or Google’s AI Mode.',
        ],
      },
      {
        question: 'Does AEO help with voice search?',
        answer: [
          'Yes, the same principles apply. Voice assistants read out one short answer, so pages that state a clear, self-contained answer to a question are the ones most likely to be used.',
        ],
      },
    ],
  },
  {
    slug: 'llm-seo',
    term: 'LLM SEO',
    aka: ['LLM optimization', 'LLMO', 'AI SEO'],
    category: 'ai-search',
    short: 'LLM SEO is optimising your content and brand so large language models such as ChatGPT, Gemini and Claude mention and cite you in their answers.',
    definition: [
      'LLM SEO is the work of making your brand and content more likely to be mentioned and cited by large language models (LLMs), such as those behind ChatGPT, Gemini, Claude and Perplexity. It is another name for much the same practice as [generative engine optimization](/glossary/generative-engine-optimization), with the focus on the models themselves.',
      'An LLM can draw on two kinds of knowledge. The first is what it learned in training: patterns from a huge snapshot of text, up to a cut-off date. The second is what it retrieves at answer time, when the assistant runs a web search and reads pages. LLM SEO deals with both. For training knowledge, what matters is how widely and consistently your brand is described across the web. For retrieval, what matters is ordinary search visibility and pages that answer clearly.',
      'There is no published ranking algorithm for LLM answers, and no reliable way to guarantee inclusion. Treat claims of special LLM ranking factors with caution, and test changes against measured answers.',
    ],
    why: [
      'LLMs are becoming a starting point for research and buying decisions. If a model consistently recommends three tools in your category and yours isn’t one of them, you are missing from a conversation you can’t see in your analytics.',
      'LLM SEO also pushes you towards things that build durable authority: being the source of original facts, getting covered by independent sites and keeping your brand information consistent.',
    ],
    how: {
      heading: 'How to improve LLM visibility',
      steps: [
        'Make sure the AI crawlers you want can reach your site. Blocking search-specific bots such as OAI-SearchBot or PerplexityBot can keep you out of those assistants’ answers.',
        'Publish clear, quotable statements of fact about your product: what it is, who it is for, pricing model, key features. Ambiguity gets filled with guesses.',
        'Earn mentions on the sites models read and cite: reviews, comparison articles, industry publications, forums and Q&A sites.',
        'Keep your organisation’s details consistent across your site, profiles and directories, so the model sees one coherent [entity](/glossary/entity).',
        'Track a fixed set of prompts over time with [prompt tracking](/glossary/prompt-tracking), so you can tell real change from noise.',
      ],
    },
    openseo: {
      body: 'The AI visibility feature tracks your prompts across 120+ models with web search on, so you can see which LLMs mention you, which cite you and where.',
      href: '/features/ai-visibility-tracker',
      label: 'See AI visibility tracking',
    },
    related: ['llm', 'generative-engine-optimization', 'ai-visibility', 'ai-crawlers', 'brand-mentions', 'retrieval-augmented-generation'],
    faqs: [
      {
        question: 'Can I get my content into ChatGPT’s training data?',
        answer: [
          'You can allow OpenAI’s training crawler, GPTBot, in robots.txt, but OpenAI doesn’t promise any page will be used, and a model only reflects new data after its next training run. Being widely discussed across the web has more effect than any single page.',
        ],
      },
      {
        question: 'Is LLM SEO different from GEO?',
        answer: [
          'Not in a meaningful way. Both describe improving how AI models mention and cite you; the names reflect who coined them, not different techniques.',
        ],
      },
    ],
  },
  {
    slug: 'ai-overviews',
    term: 'AI Overviews',
    aka: ['Google AI Overviews', 'AIO', 'Search Generative Experience', 'SGE'],
    category: 'ai-search',
    short: 'AI Overviews are AI-generated summaries that Google shows at the top of some search results, with links to the web pages they draw on.',
    definition: [
      'AI Overviews are AI-generated summaries that Google shows at the top of some search results pages. A Gemini model writes a short answer to the query, drawing on pages from Google’s index, and shows links to supporting websites alongside or within the summary. They appear only for queries where Google’s systems judge a summary adds something to the classic results.',
      'AI Overviews grew out of the Search Generative Experience (SGE), an opt-in experiment in Google’s Search Labs during 2023. Google launched AI Overviews for everyone in the United States in May 2024 and has since expanded them to many more countries and languages. They sit alongside the classic results, unlike [AI Mode](/glossary/ai-mode), which replaces the results page with a conversational answer.',
      'To build an overview, Google may use [query fan-out](/glossary/query-fan-out): running several related searches across subtopics and data sources, then combining what it finds. That is why an AI Overview can cite pages that don’t rank in the top 10 for the original query: they rank for one of the related sub-queries instead.',
      'Google’s guidance is that there are no extra requirements or special optimisations needed to appear in AI Overviews. A page must be indexed and eligible to be shown in Search with a snippet. Beyond that, the same things that help a page rank, and helpful, reliable content, decide whether it is used.',
    ],
    why: [
      'AI Overviews sit above the organic results, so when one appears it takes attention that used to go to the top organic links. Many users read the summary and don’t click any result, which adds to [zero-click searches](/glossary/zero-click-searches). Pages cited in the overview get visibility and some clicks; pages ranking below it may get fewer clicks than their position suggests.',
      'They also change what you should track. A ranking of position 2 means something different when an AI Overview sits above it. Knowing which of your keywords show an AI Overview, and whether your page is cited in it, explains changes in [click-through rate](/glossary/click-through-rate) that rankings alone don’t.',
      'Clicks from AI Overviews are counted in Search Console’s Performance report under the Web search type, together with other Google Search clicks. Google has also been rolling out a separate generative AI report in Search Console that shows impressions in AI features.',
    ],
    how: {
      heading: 'How to get cited in AI Overviews',
      steps: [
        'Find which of your target keywords trigger an AI Overview. Check the live SERP, or use a rank tracker that records SERP features.',
        'Make sure the page you want cited is indexed and snippet-eligible: no noindex, no nosnippet, not blocked to Googlebot in robots.txt. Use the URL Inspection tool in Search Console to confirm.',
        'Answer the query directly and early on the page, then cover the related questions people ask next. Fan-out means Google looks for sources on subtopics, not only the head query.',
        'Add specific, verifiable detail: numbers, steps, comparisons, first-hand experience. Generic text that repeats what ranks already gives Google no reason to cite you.',
        'Strengthen the page’s ranking in the usual ways: [internal links](/glossary/internal-links), backlinks and a good page experience.',
        'Watch clicks and CTR for those keywords in Search Console, and see whether citation changes line up with traffic changes.',
      ],
    },
    example: {
      label: 'Limiting what Google can show',
      code: `<!-- Stop Google using any text from this page in snippets or AI Overviews -->
<meta name="robots" content="nosnippet">

<!-- Or exclude just one part of the page -->
<p>Public intro text.</p>
<div data-nosnippet>Text you don’t want quoted.</div>`,
    },
    openseo: {
      body: 'The AI Overview checker shows which of up to 100 keywords trigger an AI Overview, every site each one cites and whether yours is among them. In a project, rank tracking records AI Overview citations on every check.',
      href: '/tools/ai-overview-checker',
      label: 'Check AI Overviews',
    },
    related: ['ai-mode', 'serp-features', 'zero-click-searches', 'query-fan-out', 'featured-snippet', 'generative-engine-optimization'],
    faqs: [
      {
        question: 'How do I get my site into Google AI Overviews?',
        answer: [
          'Google says there is nothing extra to do beyond being indexed and eligible for a snippet. In practice, pages that rank for the query or its related sub-queries and answer clearly are the ones cited.',
        ],
      },
      {
        question: 'Can I opt out of AI Overviews?',
        answer: [
          'You can use nosnippet, data-nosnippet or max-snippet to limit what Google shows from your pages, including in AI Overviews, but these also limit your normal search snippets. Blocking Google-Extended does not remove you from AI Overviews; it controls use in Gemini apps and model training.',
        ],
      },
      {
        question: 'Do AI Overviews reduce clicks?',
        answer: [
          'For many informational queries, yes, users get the answer without clicking. The effect varies a lot by query and site, so check your own Search Console data for keywords that show an overview.',
        ],
      },
      {
        question: 'What replaced SGE?',
        answer: [
          'AI Overviews. Search Generative Experience was the Search Labs experiment; Google renamed and launched it as AI Overviews in May 2024.',
        ],
      },
    ],
  },
  {
    slug: 'ai-mode',
    term: 'Google AI Mode',
    aka: ['AI Mode'],
    category: 'ai-search',
    short: 'Google AI Mode is a conversational search mode where a Gemini model answers your query in full, with follow-up questions and links to sources.',
    definition: [
      'Google AI Mode is a conversational search experience inside Google Search where a Gemini model answers the query in full, rather than showing a page of ranked links. You can ask follow-up questions, and the answer includes links to the web pages it draws on. It is a separate tab or mode, while [AI Overviews](/glossary/ai-overviews) appear inside normal results.',
      'Google introduced AI Mode as a Search Labs experiment in March 2025 and launched it to all users in the United States in May 2025. Through 2025 and 2026 it expanded to many more countries and languages; Google’s help pages list where it is available now. It is designed for longer, more complex questions, comparisons and multi-step tasks.',
      'AI Mode relies heavily on [query fan-out](/glossary/query-fan-out): it breaks a question into subtopics, runs many related searches at once and combines the results into one answer. As with AI Overviews, Google says no special optimisation is needed: a page must be indexed and eligible for a snippet to be shown.',
    ],
    why: [
      'In AI Mode the answer is the page. There is no list of ten results to rank in, only the sources the model cites. Visibility depends on whether your page is retrieved for any of the fan-out queries and judged useful enough to cite.',
      'Traffic from AI Mode is counted in Search Console’s Performance report under the Web search type, so it is mixed with your other Google traffic. Watching how your cited pages perform, and tracking prompts directly, gives a clearer picture.',
    ],
    how: {
      heading: 'How to appear in Google AI Mode',
      steps: [
        'Cover topics in depth, including the follow-up questions people ask, so your pages match the sub-queries AI Mode runs. A [topic cluster](/glossary/topic-cluster) helps here.',
        'Keep pages indexable and snippet-eligible, and check them with the URL Inspection tool.',
        'Give specific, current facts and clear comparisons; AI Mode is often used for “which should I choose” questions.',
        'Search your important questions in AI Mode yourself and note which sources it cites, then compare those pages with yours.',
      ],
    },
    openseo: {
      body: 'Track the questions that matter to you across AI models, including Google’s Gemini, with the AI visibility feature, and see where your site is cited.',
      href: '/features/ai-visibility-tracker',
      label: 'See AI visibility tracking',
    },
    related: ['ai-overviews', 'query-fan-out', 'generative-engine-optimization', 'zero-click-searches', 'ai-citations'],
    faqs: [
      {
        question: 'What is the difference between AI Mode and AI Overviews?',
        answer: [
          'AI Overviews are a summary at the top of normal search results. AI Mode is a separate conversational mode where the whole response is an AI answer with follow-up questions and source links.',
        ],
      },
      {
        question: 'Does AI Mode show in Search Console?',
        answer: [
          'Yes. Clicks and impressions from AI Mode are included in the Performance report under the Web search type, combined with other Google Search traffic.',
        ],
      },
    ],
  },
  {
    slug: 'chatgpt-search',
    term: 'ChatGPT search',
    aka: ['SearchGPT', 'ChatGPT web search'],
    category: 'ai-search',
    short: 'ChatGPT search is the feature that lets ChatGPT search the web and answer with up-to-date information and links to its sources.',
    definition: [
      'ChatGPT search is the feature that lets ChatGPT look things up on the web while it answers, so responses can include current information and links to the sources used. ChatGPT decides on its own when a question needs a search, and users can also ask it to search. Cited sources appear as inline links and in a sources list.',
      'OpenAI tested the idea as SearchGPT in mid-2024, launched ChatGPT search for paid users in October 2024, opened it to logged-in free users in December 2024 and made it available without an account in February 2025 in supported regions. It works in the ChatGPT apps and on chatgpt.com.',
      'Which sites ChatGPT search can show is controlled by OpenAI’s OAI-SearchBot crawler. OpenAI says that if you block OAI-SearchBot in robots.txt, your pages won’t be shown in ChatGPT search answers, though they may still appear as plain navigational links. That is separate from GPTBot, which collects content for model training, and from ChatGPT-User, which fetches a page when a user’s request needs it. See [AI crawlers](/glossary/ai-crawlers).',
    ],
    why: [
      'ChatGPT is one of the most used AI assistants, and many of its users treat it as a search engine. When it searches, it cites a handful of [sources](/glossary/ai-citations); being one of them puts your page in front of a user at the moment of the question.',
      'Clicks from ChatGPT often carry a referral that analytics can see (for example, chatgpt.com as the source, or a utm_source=chatgpt.com parameter on the link), which lets you measure this traffic in [GA4](/glossary/google-analytics-4).',
    ],
    how: {
      heading: 'How to show up in ChatGPT search',
      steps: [
        'Allow OAI-SearchBot in robots.txt and make sure your firewall or CDN isn’t blocking it.',
        'Make sure your important pages rank in traditional search. Assistants that search the web rely on search results to find candidates to read.',
        'Answer the question clearly near the top of each page, with specific facts that are easy to quote.',
        'Earn mentions on third-party pages that ChatGPT already cites for your topic.',
        'Ask ChatGPT your customers’ questions with search on, repeatedly, and note which sources it cites.',
      ],
    },
    example: {
      label: 'robots.txt',
      code: `# Allow ChatGPT search, opt out of model training
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /`,
    },
    openseo: {
      body: 'The AI visibility checker asks ChatGPT (and Gemini, Claude and Perplexity) a question with web search on and lists the sources it cites, in order.',
      href: '/tools/ai-visibility-checker',
      label: 'Check ChatGPT citations',
    },
    related: ['ai-crawlers', 'ai-citations', 'perplexity', 'ai-visibility', 'robots-txt', 'llm'],
    faqs: [
      {
        question: 'Does blocking GPTBot remove me from ChatGPT search?',
        answer: [
          'No. GPTBot is OpenAI’s training crawler. ChatGPT search inclusion is controlled by OAI-SearchBot, so you can block training and still allow search.',
        ],
      },
      {
        question: 'How do I track traffic from ChatGPT?',
        answer: [
          'In GA4, look for sessions with chatgpt.com as the source or referrer. Many links from ChatGPT also carry utm_source=chatgpt.com.',
        ],
      },
    ],
  },
  {
    slug: 'perplexity',
    term: 'Perplexity',
    aka: ['Perplexity AI'],
    category: 'ai-search',
    short: 'Perplexity is an AI answer engine that searches the web for each question and writes an answer with numbered citations to its sources.',
    definition: [
      'Perplexity is an AI-powered [answer engine](/glossary/answer-engine-optimization) that searches the web for each question and writes a direct answer with numbered citations linking to the sources it used. Founded in 2022, it was one of the first consumer search products built around generated answers with citations rather than a list of links.',
      'Perplexity uses its own crawler, PerplexityBot, to build an index of pages it can surface in answers, and a separate agent, Perplexity-User, to fetch pages live when a user’s question needs them. Perplexity says neither is used to train foundation models. Blocking PerplexityBot in robots.txt is the way to keep pages out of its search results; Perplexity recommends allowing it if you want to appear.',
      'Because every answer shows its sources prominently, Perplexity is a useful place to see how [AI citations](/glossary/ai-citations) work: which pages are chosen, in what order and how often your brand is named.',
    ],
    why: [
      'Perplexity’s users tend to be researchers, professionals and early adopters, often asking detailed or commercial questions. Its citations are visible and clickable, so being cited sends referral traffic you can measure (perplexity.ai as the referrer in analytics).',
      'It also tends to cite a wide range of sources, including smaller sites, forums and recent articles, which can make it easier to break into than results dominated by large brands.',
    ],
    how: {
      heading: 'How to get cited by Perplexity',
      steps: [
        'Allow PerplexityBot in [robots.txt](/glossary/robots-txt) and don’t block it at your CDN or firewall.',
        'Publish pages that answer specific questions directly, with current dates and concrete facts.',
        'Search your important questions on Perplexity, note the sources it cites and see what they include that your page doesn’t.',
        'Track a fixed set of prompts over time, since answers change between runs.',
      ],
    },
    example: {
      label: 'robots.txt',
      code: `User-agent: PerplexityBot
Allow: /`,
    },
    openseo: {
      body: 'The AI visibility checker includes Perplexity alongside ChatGPT, Gemini and Claude, so you can compare which sources each one cites for the same question.',
      href: '/tools/ai-visibility-checker',
      label: 'Open the AI visibility checker',
    },
    related: ['answer-engine-optimization', 'ai-citations', 'chatgpt-search', 'ai-crawlers', 'ai-visibility'],
    faqs: [
      {
        question: 'How does Perplexity choose its sources?',
        answer: [
          'Perplexity hasn’t published its ranking method. It searches its index and the web for each question and cites the pages its system judges most relevant, so clear, specific and current pages tend to do well.',
        ],
      },
      {
        question: 'Does Perplexity respect robots.txt?',
        answer: [
          'Perplexity says PerplexityBot follows robots.txt. Perplexity-User fetches pages on behalf of a user’s live request, and Perplexity’s documentation treats it differently, so check their current crawler page for the details.',
        ],
      },
    ],
  },
  {
    slug: 'ai-citations',
    term: 'AI citations',
    aka: ['LLM citations', 'AI source citations', 'AI answer citations'],
    category: 'ai-search',
    short: 'AI citations are the links an AI assistant shows as sources for its answer. Being cited means your page helped build the answer.',
    definition: [
      'AI citations are the links an AI assistant or AI search feature shows as the sources for its answer, such as the numbered references in Perplexity, the source links in ChatGPT search or the linked cards in Google’s AI Overviews. A citation means the system retrieved your page and presented it as support for the answer.',
      'A citation is different from a [brand mention](/glossary/brand-mentions). An answer can name your brand without linking to you, or link to your page while recommending a competitor. Citations come from retrieval: the assistant ran a search, read pages and chose some to reference. Mentions can also come from training data.',
      'Citations have a position. Most assistants list several sources, and the first ones get the most attention and clicks. Tracking citation position over time is the AI-search equivalent of [rank tracking](/glossary/rank-tracking).',
    ],
    why: [
      'Citations are the main way AI answers send traffic to websites. They are also a signal of trust: if the same assistant keeps citing your page for a topic, you are, in effect, its preferred source.',
      'Studying citations shows you what wins. If AI answers for your key questions cite a comparison article, a Reddit thread and a competitor’s guide, those three pages tell you what format and depth the systems prefer, and where your brand needs to appear.',
    ],
    how: {
      heading: 'How to earn more AI citations',
      steps: [
        'Make the page easy to cite: a direct answer near the top, specific facts, clear headings and a visible date and author.',
        'Rank for the query and its related sub-queries ([query fan-out](/glossary/query-fan-out)). Assistants with web search usually pick citations from what a search returns.',
        'Add something other sources don’t have: original data, a calculator, first-hand testing, expert commentary.',
        'Keep facts current. Outdated prices or figures make a page less useful as a source.',
        'Measure citation rate and position for a set of prompts across several assistants, and re-check after you change a page.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'For the prompt “how much does a loft conversion cost in the UK”, an assistant cites five sources. Your guide appears in 6 of 10 runs, at an average position of 3. After adding a dated cost table by conversion type and region, it appears in 8 of 10 runs at an average position of 2. That is the kind of change worth tracking.',
    },
    openseo: {
      body: 'The AI visibility checker shows the sources each assistant cites, in order. The AI visibility feature tracks whether your site is cited and at what position for your saved prompts.',
      href: '/features/ai-visibility-tracker',
      label: 'Track AI citations',
    },
    related: ['ai-visibility', 'brand-mentions', 'grounding', 'retrieval-augmented-generation', 'prompt-tracking', 'share-of-voice'],
    faqs: [
      {
        question: 'Do AI citations count as backlinks?',
        answer: [
          'No. A citation in an AI answer is a link shown to the user, not a link on a web page that search engines crawl, so it doesn’t pass PageRank. It can still bring visitors.',
        ],
      },
      {
        question: 'Why does an AI cite pages that don’t rank on page one?',
        answer: [
          'Many assistants run several related searches for one question (query fan-out), so a page can be retrieved for a sub-question even if it doesn’t rank for the main query.',
        ],
      },
    ],
  },
  {
    slug: 'brand-mentions',
    term: 'Brand mentions',
    aka: ['brand mention', 'implied links'],
    category: 'ai-search',
    short: 'Brand mentions are references to your brand name on other websites or in AI answers, with or without a link to your site.',
    definition: [
      'Brand mentions are references to your brand, product or company name on other websites, in the news, on forums and social platforms, or in AI-generated answers, whether or not they include a link to your site. A mention with a link is also a [backlink](/glossary/backlink); a mention without one is an unlinked mention.',
      'Mentions matter in two ways. On the web, they show that real people and publications talk about you, and an unlinked mention is often an easy link to ask for (see [unlinked brand mentions](/glossary/unlinked-mentions)). In AI answers, a mention is the outcome itself: the assistant named you when someone asked for a recommendation.',
      'The two are connected. Large language models learn which brands belong to which topics from how often and in what context those brands appear across the web. A brand that is widely and consistently discussed in reviews, lists and articles about a topic is more likely to be named when an AI is asked about that topic.',
    ],
    why: [
      'For AI visibility, mentions on third-party sites may matter as much as your own pages. When an assistant answers “best accounting software for freelancers”, it often draws on comparison articles and community threads. If you aren’t in those, you are unlikely to be in the answer.',
      'Google has not said that unlinked mentions are a ranking factor, so don’t treat them as a substitute for links in classic SEO. Their value there is mainly as link opportunities, brand demand and reputation.',
    ],
    how: {
      heading: 'How to track and grow brand mentions',
      steps: [
        'Track mention rate in AI answers for a set of unbranded prompts, and note which competitors are named instead of you.',
        'Find where you are mentioned on the web with a web search for your brand name excluding your own domain, or with a mention-alert tool.',
        'Ask sites with unlinked mentions to add a link, where it helps their readers.',
        'Get into the lists, reviews and comparisons that AI answers cite for your category, through digital PR, product reviews and genuine outreach.',
        'Make sure your brand is described the same way everywhere, so the model associates you with the right category.',
      ],
    },
    openseo: {
      body: 'The AI visibility feature records whether each answer mentions your brand, across 120+ models, and shows which competitors are named alongside you.',
      href: '/features/ai-visibility-tracker',
      label: 'Track brand mentions in AI answers',
    },
    related: ['unlinked-mentions', 'ai-visibility', 'share-of-voice', 'digital-pr', 'entity', 'ai-citations'],
    faqs: [
      {
        question: 'Are brand mentions a Google ranking factor?',
        answer: [
          'Google has not confirmed that unlinked mentions are used as a ranking signal. Links remain the documented signal, and mentions are best treated as link opportunities and a sign of brand reputation.',
        ],
      },
      {
        question: 'Can I buy brand mentions to appear in AI answers?',
        answer: [
          'Paying for undisclosed placements or fake mentions is manipulation. Google’s guidance on its AI features lists inauthentic mentions as a tactic not to use, and paid placements should be clearly marked as sponsored.',
        ],
      },
    ],
  },
  {
    slug: 'share-of-voice',
    term: 'Share of voice',
    aka: ['SOV', 'search share of voice', 'AI share of voice'],
    category: 'ai-search',
    short: 'Share of voice is your share of the visibility in a market, such as the share of AI answers or search clicks that go to you versus competitors.',
    definition: [
      'Share of voice (SOV) is the share of the available visibility in your market that your brand captures, compared with competitors. In SEO it is usually your share of estimated clicks across a set of tracked keywords. In AI search it is your share of [brand mentions](/glossary/brand-mentions) or [citations](/glossary/ai-citations) across a set of tracked prompts.',
      'The term comes from advertising, where it meant a brand’s share of total ad spend or ad impressions in a category. Search and AI versions apply the same idea to organic visibility. The key is a fixed denominator: a defined set of keywords or prompts and a defined list of competitors, so the number can be compared over time.',
    ],
    why: [
      'Share of voice puts your numbers in context. A 30% mention rate in AI answers sounds weak until you see that the market leader has 35% and everyone else is below 10%. Rankings and mention rates alone don’t tell you whether you are winning.',
      'It is also a good executive metric. It moves slowly, it is relative to competitors and it covers a whole topic rather than one keyword.',
    ],
    how: {
      heading: 'How to calculate share of voice',
      steps: [
        'Choose the set: the keywords you track in [rank tracking](/glossary/rank-tracking), or the prompts you track in AI visibility.',
        'Choose the competitors to compare against.',
        'For search, estimate the clicks each brand gets across the set (search volume × expected CTR at each brand’s position) and divide each brand’s total by the total of all brands.',
        'For AI answers, count how many answers mention or cite each brand, and divide by the total mentions across all brands.',
        'Recalculate on the same set each month or quarter.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'You track 50 prompts across 4 assistants (200 answers). Across those answers, brands are named 400 times: you 80, competitor A 140, competitor B 100, others 80. Your AI share of voice is 80 ÷ 400 = 20%; competitor A’s is 35%.',
    },
    openseo: {
      body: 'Rank tracking includes competitors for your tracked keywords, and the AI visibility feature shows how often your brand is mentioned in AI answers compared with others.',
      href: '/features/ai-visibility-tracker',
      label: 'See AI visibility tracking',
    },
    related: ['seo-visibility', 'brand-mentions', 'ai-visibility', 'rank-tracking', 'prompt-tracking'],
    faqs: [
      {
        question: 'What is a good share of voice?',
        answer: [
          'It depends on how many competitors share the market. The useful comparison is with your direct competitors and with your own number last quarter.',
        ],
      },
      {
        question: 'Is share of voice the same as visibility score?',
        answer: [
          'They are close. A visibility score measures your own estimated share of clicks for a keyword set; share of voice compares that against competitors so the shares add up to 100%.',
        ],
      },
    ],
  },
  {
    slug: 'llm',
    term: 'Large language model (LLM)',
    aka: ['LLM', 'large language models', 'language model'],
    category: 'ai-search',
    short: 'A large language model (LLM) is an AI model trained on huge amounts of text to predict and generate language, such as GPT, Gemini or Claude.',
    definition: [
      'A large language model (LLM) is an AI model trained on very large amounts of text to predict the next word (more precisely, the next token) in a sequence. That simple training goal lets it write, summarise, translate, answer questions and follow instructions. GPT models behind ChatGPT, Google’s Gemini, Anthropic’s Claude and Meta’s Llama are examples.',
      'An LLM’s built-in knowledge is frozen at its training cut-off and stored as patterns, not as a database of facts with sources. It can be wrong while sounding confident, which is often called hallucination. To answer with current, sourced information, assistants combine the model with search, a technique called [retrieval-augmented generation](/glossary/retrieval-augmented-generation).',
      'Most LLMs today are built on the transformer architecture, introduced by Google researchers in 2017. Google also uses language models inside Search to understand queries and content, for example BERT from 2019 and MUM from 2021.',
    ],
    why: [
      'LLMs now sit between many searchers and the web. When they write an answer, they decide which brands to name and which pages to cite, so understanding how they work, and where their knowledge comes from, is the basis of [LLM SEO](/glossary/llm-seo) and AI visibility.',
      'They are also a content tool. Many teams use LLMs to draft, outline or edit. Google allows that, as long as the result is helpful and accurate; see [AI-generated content](/glossary/ai-generated-content).',
    ],
    openseo: {
      body: 'The AI visibility feature runs your prompts on 120+ LLMs with web search on, so you can compare how different models answer the same question.',
      href: '/features/ai-visibility-tracker',
      label: 'Compare AI models',
    },
    related: ['retrieval-augmented-generation', 'llm-seo', 'grounding', 'semantic-search', 'ai-generated-content'],
    faqs: [
      {
        question: 'Do LLMs search the web?',
        answer: [
          'The model on its own doesn’t. Assistants built on LLMs, such as ChatGPT, Gemini, Claude and Perplexity, can call a search tool and give the results to the model, which is how they cite current sources.',
        ],
      },
      {
        question: 'Why do LLMs make things up?',
        answer: [
          'An LLM generates likely text rather than looking up facts, so it can produce plausible but false statements. Grounding the answer in retrieved sources reduces this but doesn’t remove it.',
        ],
      },
    ],
  },
  {
    slug: 'retrieval-augmented-generation',
    term: 'Retrieval-augmented generation (RAG)',
    aka: ['RAG', 'retrieval augmented generation'],
    category: 'ai-search',
    short: 'Retrieval-augmented generation (RAG) is when an AI system fetches relevant documents first and then writes its answer from them.',
    definition: [
      'Retrieval-augmented generation (RAG) is a technique where an AI system first retrieves relevant documents, such as web pages or internal files, and then gives them to a language model to write its answer. The model answers from the retrieved text rather than only from what it learned in training, which makes answers more current and lets it cite sources.',
      'The term comes from a 2020 research paper by Patrick Lewis and colleagues at Facebook AI Research. In AI search, the “retrieval” step is usually a web search, sometimes several ([query fan-out](/glossary/query-fan-out)), followed by fetching and reading the top pages. The “generation” step is the written answer, with [citations](/glossary/ai-citations) pointing back to the retrieved pages.',
      'For SEO, RAG is the reason classic search visibility still matters in AI search. A page that isn’t found in the retrieval step can’t be used or cited, however good it is.',
    ],
    why: [
      'Most AI answers that cite sources are built with some form of RAG. Your page goes through two filters: first it must be retrieved (indexed, crawlable, ranking for the query or a sub-query), then the model must find it useful enough to use and cite. SEO handles the first filter; clear, specific content handles the second.',
      'RAG systems often read only part of a page, or a few passages from it. Pages where the key answer is stated clearly, rather than buried in a long introduction, are easier to use.',
    ],
    how: {
      heading: 'How to make pages work for RAG',
      steps: [
        'Make sure the page can be retrieved: indexed, not blocked to the relevant crawlers, and ranking for the queries it answers.',
        'Put a clear answer near the top, and use descriptive headings so each section makes sense on its own.',
        'Use text for important facts. Facts locked inside images or scripts the crawler can’t render may be missed.',
        'Write naturally for people. Google says there is no need to split content into tiny chunks for AI systems.',
      ],
    },
    openseo: {
      body: 'The AI visibility checker shows which sources each assistant retrieved and cited for a question, which is the visible output of its RAG step.',
      href: '/tools/ai-visibility-checker',
      label: 'See which sources get retrieved',
    },
    related: ['llm', 'grounding', 'query-fan-out', 'ai-citations', 'semantic-search'],
    faqs: [
      {
        question: 'Is RAG the same as grounding?',
        answer: [
          'They are closely related. RAG is the technique of retrieving documents and generating from them; grounding is the goal of tying an answer to verifiable sources. RAG is the most common way to ground an answer.',
        ],
      },
      {
        question: 'Does ChatGPT use RAG?',
        answer: [
          'When ChatGPT searches the web, it retrieves pages and writes its answer from them with citations, which is a form of RAG. Without search, it answers from its training data alone.',
        ],
      },
    ],
  },
  {
    slug: 'query-fan-out',
    term: 'Query fan-out',
    aka: ['fan-out queries', 'query fanout'],
    category: 'ai-search',
    short: 'Query fan-out is when an AI search system splits one question into many related searches, runs them together and combines the results.',
    definition: [
      'Query fan-out is a technique where an AI search system breaks one question into several related sub-queries, runs those searches at the same time and combines the results into a single answer. Google describes it as a set of concurrent, related queries generated by the model to request more information, and uses it in [AI Mode](/glossary/ai-mode) and [AI Overviews](/glossary/ai-overviews).',
      'For example, a question like “best running shoes for flat feet under £100” might fan out into searches about running shoes for flat feet, stability versus neutral shoes, current prices, recent reviews and specific models. Other assistants that search the web, including ChatGPT and Perplexity, often run more than one search per question in a similar way.',
    ],
    why: [
      'Fan-out explains why AI answers cite pages that don’t rank for the original query: those pages rank for one of the sub-queries. It rewards sites that cover a topic thoroughly, including the follow-up questions, rather than a single keyword.',
      'It does not mean you should create a page for every possible sub-query. Google’s guidance says that creating many pages for fan-out variations, primarily to manipulate rankings or AI responses, violates its [scaled content abuse](/glossary/scaled-content-abuse) policy.',
    ],
    how: {
      heading: 'How to optimise for query fan-out',
      steps: [
        'List the sub-questions behind your main topics: comparisons, costs, steps, alternatives, problems. People Also Ask and [related searches](/glossary/related-searches) are good sources.',
        'Cover them where they belong: within a strong main page, or on separate pages when they deserve their own, linked as a [topic cluster](/glossary/topic-cluster).',
        'Give each section a clear heading and a direct answer, so it can be used on its own.',
        'Track rankings for the sub-queries too, not only the head term.',
      ],
    },
    openseo: {
      body: 'Keyword ideas lists related searches and questions around a topic with volume and difficulty, a practical way to map the sub-queries an AI system may fan out into.',
      href: '/tools/keyword-generator',
      label: 'Find related questions',
    },
    related: ['ai-mode', 'ai-overviews', 'topic-cluster', 'retrieval-augmented-generation', 'question-keywords'],
    faqs: [
      {
        question: 'Can I see the fan-out queries Google uses?',
        answer: [
          'Not directly. Google doesn’t show them, but the sources cited in an AI answer, and People Also Ask and related searches for the query, give a good idea of the subtopics involved.',
        ],
      },
      {
        question: 'Should I write a page for every fan-out query?',
        answer: [
          'No. Cover sub-topics where they genuinely help readers. Mass-producing near-identical pages for query variations is scaled content abuse under Google’s spam policies.',
        ],
      },
    ],
  },
  {
    slug: 'grounding',
    term: 'Grounding',
    aka: ['AI grounding', 'grounded generation', 'grounding with search'],
    category: 'ai-search',
    short: 'Grounding is tying an AI model’s answer to real, retrievable sources, such as search results, so it is current and can be checked.',
    definition: [
      'Grounding is the practice of connecting an AI model’s answer to specific, verifiable sources, such as search results, documents or databases, so that the answer reflects those sources rather than only the model’s training. A grounded answer can be checked against the pages it cites. Google, for example, offers “Grounding with Google Search” for developers using its Gemini models.',
      'Grounding is usually done with [retrieval-augmented generation](/glossary/retrieval-augmented-generation): the system retrieves relevant pages and instructs the model to answer from them. It reduces, but doesn’t eliminate, made-up answers.',
      'Google’s Google-Extended control in robots.txt covers grounding. Disallowing Google-Extended tells Google not to use your content for training Gemini models or for grounding in the Gemini apps and Grounding with Google Search for developers. Google says it doesn’t affect inclusion or ranking in Google Search.',
    ],
    why: [
      'Grounded answers are where AI citations come from. When an assistant grounds an answer in your page, your site appears as a source, and the facts in the answer come from you.',
      'It also makes your content’s accuracy matter more. If an assistant grounds an answer in an outdated page of yours, it repeats the outdated facts with your name attached.',
    ],
    how: {
      heading: 'How to control grounding on your content',
      steps: [
        'To opt out of Gemini training and grounding outside Google Search, add a Google-Extended group with Disallow: / to your [robots.txt](/glossary/robots-txt). Google Search, AI Overviews and AI Mode are not affected.',
        'To limit what Google’s own AI features quote from a page, use nosnippet, data-nosnippet or max-snippet, knowing they also limit normal search snippets.',
        'For other assistants, allow or block their search crawlers, such as OAI-SearchBot, Claude-SearchBot or PerplexityBot. Blocking a training crawler alone does not stop grounding in live answers.',
        'If you want to be used as a source, keep key facts accurate, dated and stated plainly in the page text, where a [large language model](/glossary/llm) can find them.',
      ],
    },
    example: {
      label: 'robots.txt',
      code: `User-agent: Google-Extended
Disallow: /`,
    },
    openseo: {
      body: 'The AI visibility checker shows the sources each assistant grounded its answer in, so you can see whether your pages are among them.',
      href: '/tools/ai-visibility-checker',
      label: 'Open the AI visibility checker',
    },
    related: ['retrieval-augmented-generation', 'ai-citations', 'llm', 'ai-crawlers'],
    faqs: [
      {
        question: 'What does Google-Extended block?',
        answer: [
          'Disallowing Google-Extended stops Google using your content to train Gemini models and to ground answers in the Gemini apps and Grounding with Google Search. It does not remove you from Google Search, AI Overviews or AI Mode.',
        ],
      },
      {
        question: 'Does grounding stop AI hallucinations?',
        answer: [
          'It reduces them but doesn’t stop them. A model can still misread or misrepresent a source, so cited answers are worth checking.',
        ],
      },
    ],
  },
  {
    slug: 'llms-txt',
    term: 'llms.txt',
    aka: ['llms txt', 'llms-full.txt'],
    category: 'ai-search',
    short: 'llms.txt is a proposed Markdown file at a site’s root that summarises its content for AI tools. Google Search ignores it.',
    definition: [
      'llms.txt is a proposed standard for a Markdown file placed at the root of a website (/llms.txt) that gives large language models a short summary of the site and links to its most useful pages, often in Markdown versions. It was proposed by Jeremy Howard of Answer.AI in September 2024. It is a proposal, not an adopted web standard.',
      'The idea is that AI tools, especially coding assistants and agents reading documentation, can read a clean, compact overview instead of parsing full HTML pages. A related convention, llms-full.txt, puts the whole documentation in one file.',
      'Google has said plainly that Google Search does not use llms.txt. Its guidance on generative AI features says you don’t need new machine-readable files, AI text files or Markdown versions of pages to appear in Search, including AI Overviews and AI Mode, and that such files neither help nor harm visibility there. Google’s John Mueller has compared llms.txt to the old [meta keywords tag](/glossary/meta-keywords). The major AI assistants have not announced that they use it to choose sources for answers.',
    ],
    why: [
      'For SEO and AI visibility, llms.txt is not a ranking or citation lever, and time spent on it is time not spent on content and links that do matter. Be wary of anyone selling it as a [GEO](/glossary/generative-engine-optimization) shortcut.',
      'It can still be useful in a narrow case: developer documentation that coding agents and IDE assistants read. If your audience uses those tools, or [AI SEO agents](/glossary/ai-seo-agent), a well-kept llms.txt is cheap to maintain and does no harm.',
    ],
    example: {
      label: '/llms.txt',
      code: `# Example Co

> Example Co makes open-source invoicing software for freelancers.

## Docs

- [Quick start](https://example.com/docs/quick-start.md): install and send your first invoice
- [API reference](https://example.com/docs/api.md): every endpoint with examples

## Optional

- [Changelog](https://example.com/changelog.md)`,
    },
    related: ['robots-txt', 'ai-crawlers', 'generative-engine-optimization', 'meta-keywords', 'xml-sitemap'],
    faqs: [
      {
        question: 'Does Google use llms.txt?',
        answer: [
          'No. Google says Google Search ignores llms.txt, so it doesn’t help or hurt your visibility in Search or its AI features.',
        ],
      },
      {
        question: 'Should I add an llms.txt file?',
        answer: [
          'Only if you have documentation that AI coding tools read and you can keep it up to date. For a typical business site it won’t improve rankings or AI citations.',
        ],
      },
      {
        question: 'Is llms.txt the same as robots.txt?',
        answer: [
          'No. robots.txt tells crawlers what they may fetch. llms.txt is a voluntary summary of content for AI tools and controls nothing.',
        ],
      },
    ],
  },
  {
    slug: 'ai-crawlers',
    term: 'AI crawlers (GPTBot, ClaudeBot)',
    aka: ['AI bots', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot', 'Google-Extended', 'LLM crawlers'],
    category: 'ai-search',
    short: 'AI crawlers are bots that AI companies use to collect web content for model training or for AI search answers, such as GPTBot and ClaudeBot.',
    definition: [
      'AI crawlers are automated bots run by AI companies that fetch web pages, either to collect training data for language models or to find and read pages for AI search answers. Examples include OpenAI’s GPTBot and OAI-SearchBot, Anthropic’s ClaudeBot and Claude-SearchBot, and PerplexityBot. Each identifies itself with a [user agent](/glossary/user-agent) you can allow or block in [robots.txt](/glossary/robots-txt).',
      'The key distinction is training versus search. Training crawlers collect content that may be used to train future models; blocking them is an opt-out from training and doesn’t affect whether you are cited in live answers. Search crawlers index pages so an assistant can show and cite them; blocking them can keep you out of that assistant’s answers. A third kind, user-triggered fetchers, visit a page because a user asked the assistant about it, and providers say robots.txt may not apply to them in the same way.',
      'The main ones, as documented by their operators: **GPTBot** (OpenAI, training); **OAI-SearchBot** (OpenAI, ChatGPT search; blocking it keeps your pages out of ChatGPT search answers); **ChatGPT-User** (OpenAI, fetches pages for a user’s request); **ClaudeBot** (Anthropic, training); **Claude-SearchBot** (Anthropic, search results in Claude); **Claude-User** (Anthropic, fetches pages for a user’s request); **PerplexityBot** (Perplexity, its search index; Perplexity says it isn’t used for training); **Perplexity-User** (Perplexity, live fetches for users).',
      'Google works differently. It doesn’t have a separate AI crawler: [Googlebot](/glossary/googlebot) crawls for Search, including AI Overviews and AI Mode. **Google-Extended** is a robots.txt product token, not a separate bot. Disallowing it stops Google using your content to train Gemini models and to ground answers in the Gemini apps and its developer grounding service, but Google says it has no effect on inclusion or ranking in Google Search. To keep content out of AI Overviews you would have to use snippet controls such as nosnippet, which also affect normal results.',
    ],
    why: [
      'Blocking the wrong bot is one of the easiest ways to lose AI visibility by accident. Many sites added blanket blocks on AI bots in 2023-2024 and, in doing so, also blocked the search bots that decide whether they appear in ChatGPT, Claude or Perplexity answers. CDN and firewall “block AI bots” settings can do the same without anyone editing robots.txt.',
      'The opposite choice is also legitimate. A publisher may want to be cited in answers but not used for training. Because the bots are separate, robots.txt lets you make that choice per company and per purpose.',
    ],
    how: {
      heading: 'How to control AI crawlers',
      steps: [
        'Decide your policy for each purpose: training, AI search, and user-triggered fetches.',
        'Write separate robots.txt groups for each user agent. A block on one bot does not block the others.',
        'Check your CDN, WAF or hosting “bot protection” settings, which may block AI bots regardless of robots.txt.',
        'Check your server logs to see which bots actually visit and whether they get 200 responses or 403s. Verify bots by the IP ranges their operators publish, since user agents can be faked.',
        'Review the policy every few months. Operators add and rename bots, so check their documentation.',
      ],
    },
    example: {
      label: 'robots.txt: allow AI search, block training',
      code: `# OpenAI
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

# Anthropic
User-agent: Claude-SearchBot
Allow: /

User-agent: ClaudeBot
Disallow: /

# Perplexity (search index, not training)
User-agent: PerplexityBot
Allow: /

# Google: opt out of Gemini training and grounding (Search is unaffected)
User-agent: Google-Extended
Disallow: /`,
    },
    openseo: {
      body: 'The site audit crawls your site and checks robots.txt and indexability issues, and the AI visibility checker shows whether assistants are actually citing your pages.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['robots-txt', 'user-agent', 'web-crawler', 'chatgpt-search', 'grounding', 'log-file-analysis'],
    faqs: [
      {
        question: 'Should I block GPTBot?',
        answer: [
          'Blocking GPTBot opts your content out of OpenAI model training. It doesn’t remove you from ChatGPT search, which uses OAI-SearchBot, so it is a choice about training, not visibility.',
        ],
      },
      {
        question: 'Does blocking Google-Extended remove me from AI Overviews?',
        answer: [
          'No. AI Overviews and AI Mode use content crawled by Googlebot for Search. Google-Extended only covers Gemini model training and grounding outside Search.',
        ],
      },
      {
        question: 'Do AI crawlers respect robots.txt?',
        answer: [
          'OpenAI, Anthropic, Google and Perplexity say their crawlers follow robots.txt. User-triggered fetchers such as ChatGPT-User may be treated differently, and some bots don’t follow the rules, so check server logs.',
        ],
      },
    ],
  },
  {
    slug: 'prompt-tracking',
    term: 'Prompt tracking',
    aka: ['AI prompt tracking', 'LLM rank tracking', 'AI rank tracking'],
    category: 'ai-search',
    short: 'Prompt tracking is running a fixed set of questions through AI assistants on a schedule to track brand mentions, citations and position.',
    definition: [
      'Prompt tracking is the practice of running a fixed set of questions (prompts) through one or more AI assistants on a regular schedule and recording what the answers say: whether your brand is mentioned, whether your site is cited, the position of the citation and which competitors appear. It is the AI-search equivalent of [rank tracking](/glossary/rank-tracking).',
      'The difference from rank tracking is variability. A Google ranking is fairly stable from one check to the next; an AI answer can change every time you ask. Prompt tracking therefore reports rates (mention rate, citation rate, average position) across many runs, not a single result.',
    ],
    why: [
      'Without tracking, AI visibility is anecdote: someone asks ChatGPT once, sees or doesn’t see the brand, and draws a conclusion. A fixed prompt set, run consistently, shows trends you can act on and lets you judge whether a content or PR change made a difference.',
      'It also shows differences between assistants. A brand can be named often by one model and rarely by another, which points to different sources or training data.',
    ],
    how: {
      heading: 'How to set up prompt tracking',
      steps: [
        'Write prompts the way customers ask, mostly unbranded, across problem, category and comparison questions.',
        'Group them by topic or product line so you can see where you are strong and weak.',
        'Pick the assistants that matter to your audience and run with web search on, to match what users see.',
        'Run on a fixed schedule and keep the prompt set stable. When you change prompts, compare only like with like.',
        'Exclude failed answers and prompts that contain your own brand name from your rates, or they will inflate them.',
        'Compare your mention rate with competitors’ to get your [share of voice](/glossary/share-of-voice).',
      ],
    },
    openseo: {
      body: 'The AI visibility feature saves your prompts and tracks the answers across 120+ models, with brand mentions, citations and position. Prompts that name your brand and failed answers are left out of the rates.',
      href: '/features/ai-visibility-tracker',
      label: 'Start prompt tracking',
    },
    related: ['ai-visibility', 'rank-tracking', 'share-of-voice', 'ai-citations', 'brand-mentions'],
    faqs: [
      {
        question: 'How many prompts should I track?',
        answer: [
          'Enough to cover your main topics with several prompts each, often 20-100 to start. A few dozen well-chosen prompts run regularly tell you more than hundreds run once.',
        ],
      },
      {
        question: 'How often should I run prompt tracking?',
        answer: [
          'Weekly or monthly is common. Answers vary run to run, so more runs give steadier rates.',
        ],
      },
    ],
  },
  {
    slug: 'entity',
    term: 'Entity',
    aka: ['SEO entity', 'named entity', 'entity SEO'],
    category: 'ai-search',
    short: 'An entity is a distinct, identifiable thing, such as a person, place, organisation or product, that search engines and AI models recognise.',
    definition: [
      'An entity, in SEO, is a single, distinct and identifiable thing, such as a person, organisation, place, product, event or concept, that a search engine or AI model can recognise regardless of the words used to name it. “Apple” the company and “apple” the fruit are different entities; “NYC” and “New York City” are the same one.',
      'Search engines store facts about entities and the relationships between them. Google’s [Knowledge Graph](/glossary/knowledge-graph) is the best-known example: it links entities to attributes (founded, headquarters, CEO) and to other entities. This lets Google understand that a query about “the director of Oppenheimer” is about Christopher Nolan, even if the page never uses that phrase.',
      'Language models hold a looser version of the same knowledge, learned from patterns in text. When a model has a clear, consistent picture of your brand as an entity (what you are, what you do, who you serve), it is better able to name you for the right questions.',
    ],
    why: [
      'Entities are how search moved from matching strings to understanding meaning. Being a well-defined entity can bring a [knowledge panel](/glossary/knowledge-panel), better matching for branded and topical queries and more accurate AI descriptions of your business.',
      'Confusion hurts. If your brand name is shared with other things, or your details differ between your site, profiles and directories, search engines and models may mix you up with someone else.',
    ],
    how: {
      heading: 'How to strengthen your brand entity',
      steps: [
        'Describe your organisation clearly and consistently on your site: name, what you do, location, founders, contact details.',
        'Add Organization (or LocalBusiness) [structured data](/glossary/structured-data) with sameAs links to your official profiles.',
        'Keep the same name, description and details on your social profiles, Google Business Profile, directories and Wikidata, where appropriate.',
        'Earn coverage on independent, trusted sites that describe what you do.',
      ],
    },
    example: {
      label: 'JSON-LD',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Co",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Open-source invoicing software for freelancers.",
  "sameAs": [
    "https://www.linkedin.com/company/example-co",
    "https://github.com/example-co"
  ]
}
</script>`,
    },
    related: ['knowledge-graph', 'knowledge-panel', 'semantic-search', 'schema-markup', 'brand-mentions'],
    faqs: [
      {
        question: 'What is entity SEO?',
        answer: [
          'Entity SEO is making sure search engines and AI models clearly understand who you are and what your content is about, through consistent information, structured data and coverage on trusted sites.',
        ],
      },
      {
        question: 'Is a keyword an entity?',
        answer: [
          'Not necessarily. A keyword is a string of words someone types; an entity is the thing it refers to. Several keywords can point to one entity, and one keyword can point to several.',
        ],
      },
    ],
  },
  {
    slug: 'knowledge-graph',
    term: 'Knowledge Graph',
    aka: ['Google Knowledge Graph'],
    category: 'ai-search',
    short: 'The Knowledge Graph is Google’s database of entities and the facts and relationships between them, used to power knowledge panels and answers.',
    definition: [
      'The Knowledge Graph is Google’s database of [entities](/glossary/entity), such as people, places, organisations and things, and the facts and relationships that connect them. Google launched it in 2012 with the phrase “things, not strings”, meaning search would understand real-world things instead of just matching words. It powers [knowledge panels](/glossary/knowledge-panel) and many direct answers in search.',
      'Google gathers Knowledge Graph facts from many sources, including public data, licensed data, websites and information entities provide about themselves, for example through a claimed knowledge panel or Google Business Profile. You can’t submit data to it directly, but you can make your information clear and consistent so Google is more likely to get it right.',
    ],
    why: [
      'If Google recognises your business or person as an entity in the Knowledge Graph, branded searches can show a knowledge panel with your logo, description and links, which takes up a lot of space and builds trust.',
      'Entity understanding also helps Google match your content to queries that don’t use your exact words, and it feeds the facts Google’s AI features draw on.',
    ],
    how: {
      heading: 'How to get into the Knowledge Graph',
      steps: [
        'Publish a clear About page that states who you are and what you do.',
        'Add Organization or Person structured data with sameAs links to your official profiles.',
        'Keep your name and details consistent across the web, including Google Business Profile for local businesses.',
        'Earn coverage from authoritative, independent sources.',
        'If a knowledge panel appears for you, claim it through Google’s verification process to suggest corrections.',
      ],
    },
    related: ['entity', 'knowledge-panel', 'semantic-search', 'structured-data', 'google-business-profile'],
    faqs: [
      {
        question: 'How do I check if I am in the Knowledge Graph?',
        answer: [
          'Search your brand or name and look for a knowledge panel. Developers can also query Google’s Knowledge Graph Search API for an entity.',
        ],
      },
      {
        question: 'Is the Knowledge Graph the same as a knowledge panel?',
        answer: [
          'No. The Knowledge Graph is the underlying database; a knowledge panel is one way Google displays facts from it on the results page.',
        ],
      },
    ],
  },
  {
    slug: 'semantic-search',
    term: 'Semantic search',
    aka: ['semantic SEO'],
    category: 'ai-search',
    short: 'Semantic search is search that matches the meaning and intent behind a query, not just its exact words.',
    definition: [
      'Semantic search is search that tries to understand the meaning and intent of a query, and the meaning of content, rather than only matching the exact words. It uses context, synonyms, [entities](/glossary/entity) and the relationships between concepts, so a search for “how to fix a dripping tap” can return a page titled “Repairing a leaking faucet”.',
      'Google has moved steadily in this direction: the Knowledge Graph in 2012, the Hummingbird algorithm in 2013, RankBrain in 2015, and language models such as BERT in 2019 and MUM in 2021. AI search systems go further, often using vector embeddings, numerical representations of meaning, to find passages that answer a question even when they share few words with it.',
    ],
    why: [
      'Semantic search is why exact-match keyword tricks matter less than they used to, and why [keyword stuffing](/glossary/keyword-stuffing) doesn’t work. A page ranks because it covers the topic well and satisfies the [search intent](/glossary/search-intent), not because it repeats a phrase.',
      'It also means one good page can rank for hundreds of related queries, and that covering a topic thoroughly, with the related concepts people expect, helps a page be found for queries you never targeted directly.',
    ],
    how: {
      heading: 'How to write for semantic search',
      steps: [
        'Start from the intent: what does the searcher need to know or do?',
        'Cover the topic fully, including the related questions and subtopics people expect to see.',
        'Use natural language and synonyms; don’t force exact-match phrases.',
        'Group closely related keywords on one page rather than one page per variant (see [keyword clustering](/glossary/keyword-clustering)).',
      ],
    },
    openseo: {
      body: 'Keyword ideas shows matching terms, related searches and questions for a topic, which helps you see the related concepts a page should cover.',
      href: '/tools/keyword-generator',
      label: 'Find related keywords',
    },
    related: ['entity', 'knowledge-graph', 'search-intent', 'lsi-keywords', 'keyword-clustering', 'llm'],
    faqs: [
      {
        question: 'What is semantic SEO?',
        answer: [
          'Semantic SEO is writing and structuring content around topics, entities and intent rather than single keywords, so search engines understand what the page is about and which queries it answers.',
        ],
      },
      {
        question: 'Are LSI keywords part of semantic search?',
        answer: [
          'Not really. Google has said it doesn’t use latent semantic indexing. Covering related concepts naturally helps, but “LSI keywords” as a technique is a myth.',
        ],
      },
    ],
  },
  {
    slug: 'mcp',
    term: 'Model Context Protocol (MCP)',
    aka: ['MCP', 'MCP server'],
    category: 'ai-search',
    short: 'Model Context Protocol (MCP) is an open standard that lets AI assistants connect to outside tools and data, such as an SEO platform’s API.',
    definition: [
      'Model Context Protocol (MCP) is an open standard for connecting AI assistants and agents to external tools and data sources. An MCP server exposes a set of tools (for example “get keyword ideas” or “run a site audit”) with descriptions and inputs, and any MCP-compatible client, such as Claude, ChatGPT, Cursor or a coding agent, can discover and call them.',
      'Anthropic introduced MCP in November 2024 and, in December 2025, donated it to the Agentic AI Foundation under the Linux Foundation, so it is governed as a vendor-neutral open project. It has been adopted widely across AI products. Before MCP, every assistant needed its own custom integration for every tool; MCP gives them one common way to connect.',
      'For SEO, MCP means an AI assistant can work with real data instead of guessing: pull live search volumes, check rankings, read Search Console data or audit a page, then reason about the results. That is the basis of most [AI SEO agents](/glossary/ai-seo-agent).',
    ],
    why: [
      'Language models don’t know today’s search volumes, your rankings or what links point to your site. Connected to an SEO tool over MCP, an assistant can look them up and give answers grounded in data, which turns it from a writer into an analyst.',
      'MCP also matters for cost and control. Many SEO data lookups cost money, and an agent can make a lot of calls quickly. A well-designed MCP server lets you price a call before running it and set a limit on what any call may spend.',
    ],
    how: {
      heading: 'How to connect an SEO MCP server',
      steps: [
        'Create an API key in the SEO tool that provides the MCP server.',
        'Add the server’s URL and key to your MCP client (for example Claude, Cursor or another agent) following its connection instructions. The [OpenSEO MCP docs](/docs/mcp) show the setup for common clients.',
        'Ask the assistant to list the tools, so you can see what it can do.',
        'Start with free or dry-run calls to check prices, then set a spending limit per call for paid lookups.',
      ],
    },
    openseo: {
      body: 'OpenSEO runs an MCP server with 69 tools covering keyword research, rank tracking, backlinks, site audits, Search Console and AI visibility. Every paid tool takes a spending ceiling (max_cost_usd) and can dry-run to return the price without spending anything.',
      href: '/features/seo-mcp-server',
      label: 'See the MCP server and API',
    },
    related: ['ai-seo-agent', 'llm', 'retrieval-augmented-generation', 'grounding'],
    faqs: [
      {
        question: 'What is an MCP server?',
        answer: [
          'An MCP server is a program that exposes tools and data to AI assistants using the Model Context Protocol. The assistant connects to it, reads the list of tools and calls them as needed.',
        ],
      },
      {
        question: 'Which AI assistants support MCP?',
        answer: [
          'Claude, ChatGPT, Gemini, Microsoft Copilot, Cursor, Visual Studio Code and many coding agents support MCP in some form. Check each client’s documentation for how to add a remote server.',
        ],
      },
      {
        question: 'Is MCP safe to use with paid APIs?',
        answer: [
          'It can be, if the server supports cost controls. Look for tools that can quote a price first and refuse calls above a limit you set.',
        ],
      },
    ],
  },
  {
    slug: 'ai-seo-agent',
    term: 'AI SEO agent',
    aka: ['SEO agent', 'AI agent for SEO', 'agentic SEO'],
    category: 'ai-search',
    short: 'An AI SEO agent is an AI assistant that uses SEO tools by itself to research, analyse and report, working through multiple steps towards a goal.',
    definition: [
      'An AI SEO agent is an AI assistant that can use SEO tools on its own, deciding which calls to make, reading the results and taking the next step, to complete multi-step tasks such as keyword research or a technical audit. Unlike a chatbot that only writes text, an agent acts: it calls tools, gathers data and reports back.',
      'Agents usually connect to tools through [Model Context Protocol (MCP)](/glossary/mcp) or an API, such as OpenSEO’s [MCP server and REST API](/features/seo-mcp-server). A typical run might look like: find keyword ideas for a seed term, filter by difficulty, check the live SERP for the best candidates, compare competitors’ pages and write a content brief, all from one instruction.',
      'Agents are only as good as their data and their limits. Without real data they guess; without limits they can run up costs or make changes you didn’t want. Keep a human in charge of decisions, and use tools that let you cap spending and check prices before a call runs.',
    ],
    why: [
      'Much SEO work is repetitive data gathering: pull keywords, check rankings, compare competitors, list issues. An agent can do that legwork quickly and leave you to judge the results.',
      'Agents also make SEO data available where people already work, in a coding editor or chat assistant, so a developer can check whether a page change broke an SEO rule without leaving their tools.',
    ],
    how: {
      heading: 'How to use an AI SEO agent safely',
      steps: [
        'Connect the agent to a real SEO data source over MCP or API, so it works from data rather than memory.',
        'Give it a specific goal and the context it needs: your site, market, country and what success looks like.',
        'Set a spending limit per call and ask it to dry-run paid lookups first.',
        'Prefer read-only access to your accounts (for example Search Console) unless it truly needs more.',
        'Review its output before acting. Check its numbers against the source and its recommendations against your own judgement.',
      ],
    },
    example: {
      label: 'Agent run',
      body: 'Instruction: “Find low-difficulty keywords for emergency plumbers in Austin and draft a page plan.” The agent dry-runs a keyword ideas call to get the price, runs it with a $0.20 ceiling and difficulty under 30, checks the top 10 for the three best keywords, and returns a short list with volumes, difficulty and an outline. Total spend is reported with the result.',
    },
    openseo: {
      body: 'OpenSEO’s MCP server gives agents 69 tools across keyword research, rankings, backlinks, audits, Search Console and AI visibility. Every paid call takes a ceiling (max_cost_usd) and can dry-run first; the agent tutorial walks through a setup.',
      href: '/docs/mcp',
      label: 'Read the MCP docs',
    },
    related: ['mcp', 'llm', 'keyword-research', 'seo-audit', 'ai-generated-content'],
    faqs: [
      {
        question: 'Can an AI agent do SEO on its own?',
        answer: [
          'It can do much of the research and analysis, but it still needs a human to set goals, check its work and make judgement calls about strategy and content quality.',
        ],
      },
      {
        question: 'How do I stop an AI agent spending too much on SEO data?',
        answer: [
          'Use tools that support per-call spending ceilings and dry runs, so the agent sees the price first and any call above your limit is refused before it runs.',
        ],
      },
    ],
  },
  {
    slug: 'content-marketing',
    term: 'Content marketing',
    aka: ['content strategy'],
    category: 'content',
    short: 'Content marketing is creating and sharing useful content, such as articles, guides, videos and tools, to attract and keep customers.',
    definition: [
      'Content marketing is a marketing approach based on creating and distributing useful, relevant content, such as articles, guides, videos, podcasts, tools and research, to attract a defined audience and, over time, turn some of them into customers. Instead of interrupting people with ads, it earns their attention by answering their questions.',
      'SEO and content marketing overlap heavily. SEO decides which topics people search for and how to make pages findable; content marketing decides what to say, in what format, and how to distribute it beyond search, through email, social, communities and partnerships. Content that is useful enough to be shared also tends to earn the [backlinks](/glossary/backlink) that help it rank.',
    ],
    why: [
      'Search is one of the largest sources of long-term traffic for content. A guide that ranks for a question people ask every month brings visitors for years after it is published, without paying per click, which is why so much content marketing is built around [keyword research](/glossary/keyword-research).',
      'Content also builds the trust and brand recognition that AI assistants and search engines reflect. Brands that publish clear, original material on a topic tend to be cited and mentioned for that topic.',
    ],
    how: {
      heading: 'How to plan content marketing for SEO',
      steps: [
        'Define who you are writing for and what problems they need solved.',
        'Research the questions they search, with volume, difficulty and intent.',
        'Group topics into [topic clusters](/glossary/topic-cluster) around the subjects you want to be known for.',
        'Prioritise pages that match your product and that you can realistically rank for.',
        'Publish with a clear [content brief](/glossary/content-brief), then promote, measure and update.',
      ],
    },
    openseo: {
      body: 'Keyword ideas finds the questions and topics your audience searches, with volume, difficulty and intent, so you can plan content that has search demand.',
      href: '/tools/keyword-generator',
      label: 'Find content ideas',
    },
    related: ['seo-strategy', 'topic-cluster', 'content-brief', 'evergreen-content', 'keyword-research'],
    faqs: [
      {
        question: 'Is content marketing the same as SEO?',
        answer: [
          'No. SEO is about being found in search; content marketing is about creating content that attracts and keeps an audience through any channel. They work best together.',
        ],
      },
      {
        question: 'How long does content marketing take to work?',
        answer: [
          'New content often takes several months to rank, depending on competition and your site’s authority. Results build over time as more pages rank and earn links.',
        ],
      },
    ],
  },
  {
    slug: 'topic-cluster',
    term: 'Topic cluster',
    aka: ['content cluster', 'topic clusters', 'hub and spoke'],
    category: 'content',
    short: 'A topic cluster is a group of pages about one subject: a pillar page covering it broadly, linked to cluster pages that cover subtopics in depth.',
    definition: [
      'A topic cluster is a group of interlinked pages that together cover one subject. A central [pillar page](/glossary/pillar-page) gives a broad overview of the topic and links out to cluster pages, each of which covers one subtopic in depth and links back to the pillar. It is also called a hub-and-spoke model.',
      'For example, a pillar page on “home composting” might link to cluster pages on composting in a flat, what not to compost, hot versus cold composting, fixing a smelly compost bin and choosing a compost bin. Each cluster page targets its own keyword and [search intent](/glossary/search-intent); the pillar targets the broad head term.',
      'Clusters are usually built from keyword research. You group related keywords by the page that should answer them ([keyword clustering](/glossary/keyword-clustering)), decide which group is the broad overview and which are subtopics, and map each group to one URL. That map also prevents [keyword cannibalisation](/glossary/keyword-cannibalization), where several of your pages compete for the same query.',
      'The internal links are what make it a cluster rather than a pile of related articles. They help readers move between related pages, help search engines discover and understand the relationship between pages, and pass link value from pages that earn links to those that need it.',
    ],
    why: [
      'Search engines and AI systems reward sites that cover a subject thoroughly. A cluster shows breadth (many subtopics) and depth (each one properly answered), which builds [topical authority](/glossary/topical-authority) and makes each page in the cluster more likely to rank than an isolated article would be.',
      'Clusters also match how AI search retrieves information. Systems that use query fan-out search for many subtopics of a question; a site with a good page for each subtopic has more chances to be retrieved and cited.',
      'They make planning easier, too. A cluster turns a vague goal (“write about composting”) into a defined list of pages, shows which are missing, and gives each new article an obvious place in the site’s structure.',
    ],
    how: {
      heading: 'How to build a topic cluster',
      steps: [
        'Choose a core topic that matters to your business and is broad enough to have many subtopics.',
        'Research keywords around it: start with a seed term and collect matching terms, questions and related searches.',
        'Group the keywords by intent. Keywords that return mostly the same top results usually belong on one page.',
        'Pick the broadest group as the pillar and the rest as cluster pages. Write down which URL targets which keyword group.',
        'Check what you already have. Map existing pages to the plan, merge duplicates and note the gaps.',
        'Write or improve the pages, starting with those that have the best mix of demand, business value and realistic difficulty.',
        'Link every cluster page to the pillar and the pillar to every cluster page, with descriptive anchor text. Link between cluster pages where it helps the reader.',
        'Track rankings for the whole cluster and add pages as you find new subtopics.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Pillar: “Home composting: a beginner’s guide” (/composting). Cluster pages: /composting/in-a-flat, /composting/what-not-to-compost, /composting/hot-vs-cold, /composting/smelly-compost-bin, /composting/best-compost-bins. Each links to the pillar in its introduction; the pillar has a short section and a link for each.',
    },
    openseo: {
      body: 'Keyword ideas gives you matching terms, questions and related searches with volume, difficulty and intent for a seed topic, the raw material for a cluster. Rank tracking then shows how the whole cluster ranks over time.',
      href: '/tools/keyword-generator',
      label: 'Research a topic cluster',
    },
    related: ['pillar-page', 'topical-authority', 'keyword-clustering', 'internal-links', 'keyword-mapping', 'site-architecture'],
    faqs: [
      {
        question: 'How many pages should a topic cluster have?',
        answer: [
          'There is no fixed number. Cover the subtopics people actually search for and that your audience needs; for most topics that is somewhere between a handful and a few dozen pages.',
        ],
      },
      {
        question: 'Do topic clusters still work for SEO?',
        answer: [
          'Yes. Organising content by topic with strong internal linking helps search engines understand your site and helps readers find related pages. The label matters less than the coverage and the links.',
        ],
      },
      {
        question: 'What is the difference between a topic cluster and keyword clustering?',
        answer: [
          'Keyword clustering groups keywords that one page can rank for. A topic cluster is the set of pages built from those groups, linked around a pillar page.',
        ],
      },
      {
        question: 'Should cluster pages be in a subfolder?',
        answer: [
          'It can help people and tidy reporting, but it isn’t required. The internal links between the pages matter more than the URL structure.',
        ],
      },
      {
        question: 'How do I choose a pillar topic?',
        answer: [
          'Pick a subject that is central to what you sell, broad enough to have many subtopics people search for, and narrow enough that you can cover it well. If you can’t list at least five useful subtopics, it is probably a cluster page, not a pillar.',
        ],
      },
    ],
  },
  {
    slug: 'pillar-page',
    term: 'Pillar page',
    aka: ['pillar content', 'hub page', 'cornerstone content'],
    category: 'content',
    short: 'A pillar page is a broad, in-depth page on a core topic that links to more detailed pages on each subtopic, forming the hub of a topic cluster.',
    definition: [
      'A pillar page is a comprehensive page that covers a core topic broadly and links to more detailed pages on each of its subtopics. It is the hub of a [topic cluster](/glossary/topic-cluster): it targets the broad [head term](/glossary/head-terms), gives readers an overview, and sends them to cluster pages for depth.',
      'A good pillar page is genuinely useful on its own, not just a list of links. It answers the main question, explains the key concepts and gives each subtopic a short section with a link to the full article. It usually targets a high-volume, competitive keyword, and benefits from the [internal links](/glossary/internal-links) pointing to it from every cluster page.',
    ],
    why: [
      'Pillar pages concentrate authority. Every cluster page links to the pillar, and the pillar often earns links in its own right, so it becomes one of the strongest pages on the site and passes that strength back to the cluster through its links.',
      'They also give users and search engines a clear starting point for a topic, which helps both navigation and crawling.',
    ],
    how: {
      heading: 'How to create a pillar page',
      steps: [
        'Pick a broad topic with enough subtopics to support a cluster.',
        'Target the head term and match its intent: usually a guide or overview.',
        'Write a clear introduction that answers the core question directly.',
        'Give each subtopic a short section that summarises it and links to its cluster page.',
        'Add a table of contents with jump links if the page is long.',
        'Update the pillar when you add cluster pages, so every new page is linked.',
      ],
    },
    openseo: {
      body: 'Keyword overview shows the volume, difficulty and traffic potential of a head term, and the live top 10, so you can judge what a pillar page needs to compete.',
      href: '/tools/keyword-analysis-tool',
      label: 'Analyse a pillar keyword',
    },
    related: ['topic-cluster', 'topical-authority', 'internal-links', 'head-terms', 'evergreen-content'],
    faqs: [
      {
        question: 'How long should a pillar page be?',
        answer: [
          'As long as it takes to cover the topic well at overview level. Length isn’t a ranking factor; matching intent and completeness are.',
        ],
      },
      {
        question: 'Is a pillar page the same as a category page?',
        answer: [
          'Not quite. A category page mainly lists products or posts; a pillar page is substantial content on the topic that also links to related pages. Some category pages work as pillars when they include real content.',
        ],
      },
    ],
  },
  {
    slug: 'topical-authority',
    term: 'Topical authority',
    aka: ['topic authority', 'topical relevance'],
    category: 'content',
    short: 'Topical authority is a site’s perceived depth and expertise on a subject, built by covering it thoroughly and being cited on it.',
    definition: [
      'Topical authority is the idea that a website becomes a trusted source on a subject by covering it thoroughly and well, so search engines are more likely to rank its pages for queries on that subject. A site with dozens of useful, linked pages on one topic looks more authoritative than one with a single article on it.',
      'Topical authority is an SEO concept, not a published Google metric. There is no “topical authority score” in Search Console. Google has, however, described systems that try to identify sources with expertise on a topic. In 2023 it said it uses a system to surface sites with topic authority for news queries, and its [helpful content](/glossary/helpful-content) guidance asks whether a site has a primary purpose or focus and demonstrates first-hand expertise. Its quality rater guidelines also stress experience, expertise, authoritativeness and trust ([E-E-A-T](/glossary/eeat)).',
      'Topical authority is built from three things working together. Coverage: answering the main questions and subtopics in a field, often organised as [topic clusters](/glossary/topic-cluster). Quality: pages that are accurate, specific and show real expertise. Recognition: links and mentions from other sites in the field, and people searching for your brand alongside the topic.',
      'Third-party tools often estimate topical authority from how many keywords a site ranks for in a topic, or from the share of a topic’s keywords it covers. Those estimates can be useful, but they are approximations of an idea, not measurements of a Google signal.',
    ],
    why: [
      'Sites with topical authority tend to rank new pages faster and for harder keywords within their topic, because each new page builds on a body of related, linked work. A general site trying to rank one article on a specialist topic is competing against sites that have covered everything around it.',
      'The same pattern shows up in AI search. Assistants that run several searches per question are more likely to keep finding, and citing, a site that has a good page for each subtopic. Models also learn which brands are associated with a subject from how often they are discussed in that context.',
      'Focus is also a defence. Google’s guidance warns against publishing on topics outside your expertise simply because they might bring traffic, and its [site reputation abuse](/glossary/site-reputation-abuse) policy targets third-party content that exploits a site’s ranking signals on unrelated topics.',
    ],
    how: {
      heading: 'How to build topical authority',
      steps: [
        'Choose a focused set of topics that match your business and expertise. Narrow is easier to win than broad.',
        'Map each topic: the main questions, subtopics, comparisons and problems people search for.',
        'Find your gaps by comparing what you cover with what competing sites rank for.',
        'Publish in clusters, completing a topic before moving to the next, rather than scattering single articles.',
        'Show expertise: named authors with relevant experience, original examples, data and clear sourcing.',
        'Link the cluster together tightly, and point links from your strongest pages to new ones.',
        'Earn links and mentions from respected sites in the field through research, digital PR and genuine participation.',
        'Keep the topic current: refresh pages that decay and prune or merge pages that no longer serve readers.',
      ],
    },
    openseo: {
      body: 'The competitors tool shows the keyword gap between you and organic competitors, so you can see which subtopics they rank for and you don’t. Domain overview shows the keywords and top pages a site ranks for.',
      href: '/tools/seo-competitor-analysis',
      label: 'Find your topic gaps',
    },
    related: ['topic-cluster', 'eeat', 'content-gap', 'pillar-page', 'helpful-content', 'internal-links'],
    faqs: [
      {
        question: 'Is topical authority a Google ranking factor?',
        answer: [
          'Google doesn’t publish a topical authority metric. It has described systems that recognise expertise on a topic, especially for news, and its helpful content guidance values focus and first-hand expertise, so the concept is consistent with how Google says it ranks content.',
        ],
      },
      {
        question: 'How do you measure topical authority?',
        answer: [
          'Indirectly. Track how many keywords in a topic you rank for, your share of the topic’s top positions compared with competitors, and how quickly new pages in the topic start ranking.',
        ],
      },
      {
        question: 'How long does it take to build topical authority?',
        answer: [
          'Usually months. It depends on how competitive the topic is, how much you publish and how quickly other sites start linking to and mentioning you.',
        ],
      },
      {
        question: 'Can a small site have topical authority?',
        answer: [
          'Yes. A small site that covers a narrow topic thoroughly and well can outrank large general sites for that topic.',
        ],
      },
      {
        question: 'Does publishing more content increase topical authority?',
        answer: [
          'Only if the content is useful. Publishing many thin or near-duplicate pages to cover a topic can do the opposite and, at scale, may fall under Google’s scaled content abuse policy. Fewer, better pages that genuinely cover the subtopics work better.',
        ],
      },
    ],
  },
  {
    slug: 'content-gap',
    term: 'Content gap',
    aka: ['content gap analysis', 'topic gap'],
    category: 'content',
    short: 'A content gap is a topic or keyword your audience searches for that your site doesn’t cover, often one your competitors already rank for.',
    definition: [
      'A content gap is a topic, question or keyword that your audience searches for but your site doesn’t cover well or at all, often one that competitors already rank for. Content gap analysis is the process of finding those gaps, usually by comparing the keywords your site ranks for with those of competing sites.',
      'Gaps come in a few forms: topics you have never covered, topics covered too thinly to rank, missing stages of the buying journey (for example, plenty of beginner guides but no comparisons), and missing formats, such as a calculator or template that searchers expect.',
    ],
    why: [
      'Closing content gaps is one of the most reliable ways to find new traffic, because competitors have already proved there is demand and that the topic can rank. It also builds [topical authority](/glossary/topical-authority), because each gap you fill makes your coverage of a subject more complete.',
      'In AI search, gaps show up as prompts where competitors are cited and you aren’t. The cited pages often reveal exactly what is missing.',
    ],
    how: {
      heading: 'How to do a content gap analysis',
      steps: [
        'List three to five real organic competitors: sites that rank for your keywords, not just business rivals.',
        'Run a [keyword gap](/glossary/keyword-gap) report to find keywords they rank for and you don’t.',
        'Filter out irrelevant terms and group the rest by topic and intent.',
        'For each group, decide whether to create a new page or improve an existing one.',
        'Prioritise by search volume, business value and difficulty, then add the work to your plan.',
      ],
    },
    openseo: {
      body: 'The competitors tool finds your organic competitors and shows the keyword gap: keywords they rank for that you don’t, with volume and difficulty.',
      href: '/tools/keyword-gap',
      label: 'Run a keyword gap',
    },
    related: ['keyword-gap', 'topical-authority', 'content-audit', 'topic-cluster', 'information-gain'],
    faqs: [
      {
        question: 'What is the difference between a content gap and a keyword gap?',
        answer: [
          'A keyword gap is a list of keywords competitors rank for and you don’t. A content gap is the missing or weak content behind those keywords, grouped into topics and pages.',
        ],
      },
      {
        question: 'How often should I run a content gap analysis?',
        answer: [
          'Quarterly works for most sites, plus whenever a new competitor appears or you plan a new topic area.',
        ],
      },
    ],
  },
  {
    slug: 'evergreen-content',
    term: 'Evergreen content',
    aka: ['evergreen articles'],
    category: 'content',
    short: 'Evergreen content is content that stays relevant and useful for a long time, such as how-to guides and explainers, rather than news.',
    definition: [
      'Evergreen content is content that stays relevant and useful to readers for a long time after it is published, such as how-to guides, explainers, definitions and checklists. It contrasts with news, trend pieces and [seasonal content](/glossary/seasonality), whose interest rises and falls quickly. The name comes from evergreen trees, which keep their leaves all year.',
      'Evergreen doesn’t mean never updated. Facts, prices, screenshots and best practices change, so even evergreen pages need regular review to stay accurate and competitive (see [content refresh](/glossary/content-refresh)).',
    ],
    why: [
      'Evergreen pages target questions people ask every month, so a page that ranks keeps bringing traffic for years. That steady demand makes them the backbone of most SEO content plans, and they tend to earn links over time as people reference them.',
      'They are also good candidates for AI citations, because assistants are asked the same evergreen questions repeatedly.',
      'Not everything should be evergreen. News, launches and [trend](/glossary/keyword-trend) pieces can bring links and attention quickly, then fade. A healthy content plan usually mixes a large base of evergreen pages with some timely pieces, and links the timely pieces to the evergreen guides so their value lasts.',
    ],
    how: {
      heading: 'How to create evergreen content',
      steps: [
        'Pick topics with steady demand. Check the 12-month trend for the keyword and avoid spikes that fade.',
        'Answer fundamental questions in your field: what, why, how, how much, which to choose.',
        'Avoid dates and time-bound phrases in titles and URLs unless the content really is annual.',
        'Schedule a review every 6-12 months to update facts, examples and links.',
      ],
    },
    openseo: {
      body: 'Keyword ideas shows a 12-month trend for every keyword, so you can tell steady evergreen demand from seasonal or fading topics.',
      href: '/tools/keyword-generator',
      label: 'Check keyword trends',
    },
    related: ['content-decay', 'content-refresh', 'keyword-trend', 'seasonality', 'freshness'],
    faqs: [
      {
        question: 'What are examples of evergreen content?',
        answer: [
          'How-to guides, glossaries, beginner explainers, checklists, templates and buying guides for products that don’t change often.',
        ],
      },
      {
        question: 'Does evergreen content need updating?',
        answer: [
          'Yes. Topics stay relevant but details change, so review evergreen pages regularly to keep them accurate.',
        ],
      },
    ],
  },
  {
    slug: 'content-audit',
    term: 'Content audit',
    aka: ['SEO content audit', 'content inventory'],
    category: 'content',
    short: 'A content audit is a review of every page on a site, with data, to decide which to keep, update, merge, redirect or remove.',
    definition: [
      'A content audit is a systematic review of all the content on a website, using performance data, to decide what to do with each page: keep it, update it, merge it with another page, redirect it or remove it. It starts with an inventory of every indexable URL and adds data such as traffic, rankings, backlinks, conversions and age.',
      'A content audit differs from a technical [site audit](/docs/tutorials/site-audit), which looks at crawling, indexing and site health. The two are often run together, because technical problems such as duplicate content or orphan pages show up in both.',
    ],
    why: [
      'Most sites accumulate pages that no longer earn their place: outdated posts, thin pages, near-duplicates and articles competing for the same keyword. These dilute the site’s quality and waste crawling. An audit finds them, and also finds the pages that are close to ranking well and only need an update.',
      'Google’s helpful content guidance looks at whether content across a site is helpful to people, so cleaning up unhelpful pages and improving promising ones can benefit the whole site.',
    ],
    how: {
      heading: 'How to do a content audit',
      steps: [
        'Crawl the site to list every indexable URL, with title, word count and status.',
        'Add data: clicks and impressions from Search Console, sessions and key events from GA4, backlinks and rankings.',
        'Tag each page with an action: keep, [refresh](/glossary/content-refresh), merge, redirect or remove ([content pruning](/glossary/content-pruning)).',
        'Look for [keyword cannibalisation](/glossary/keyword-cannibalization): several pages ranking for the same query.',
        'Work through the actions in priority order, starting with pages that have traffic or links at stake.',
        'Re-run the audit every 6-12 months.',
      ],
    },
    openseo: {
      body: 'The site audit crawls every page and flags thin and duplicate content, while search performance brings in Search Console and GA4 data for each page, so you can decide what to keep, refresh or remove.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['content-pruning', 'content-refresh', 'content-decay', 'seo-audit', 'thin-content', 'keyword-cannibalization'],
    faqs: [
      {
        question: 'How often should I do a content audit?',
        answer: [
          'Once or twice a year for most sites; more often for large or fast-growing sites.',
        ],
      },
      {
        question: 'What data do I need for a content audit?',
        answer: [
          'At minimum, a list of URLs with Search Console clicks and impressions, analytics sessions and conversions, and backlink counts.',
        ],
      },
    ],
  },
  {
    slug: 'content-brief',
    term: 'Content brief',
    aka: ['SEO content brief', 'writer brief'],
    category: 'content',
    short: 'A content brief is a document that tells a writer what a page should cover, who it is for, which keywords it targets and what it must include.',
    definition: [
      'A content brief is a document that tells a writer what a piece of content needs to achieve and include: the target keyword and search intent, the audience, the angle, a suggested outline, questions to answer, sources, internal links, and the call to action. It turns keyword research into clear instructions before writing starts.',
      'A good brief is short enough to read in a few minutes and specific enough that two writers would produce broadly similar pages. It explains why the page exists, not only what words to use.',
    ],
    why: [
      'Most SEO content fails because it doesn’t match [search intent](/glossary/search-intent) or misses what searchers expect, not because of bad writing. A brief that analyses the current top results and the questions people ask prevents those misses before they cost a rewrite.',
      'Briefs also keep pages from overlapping. Stating the target keyword and the URL it belongs to helps avoid [keyword cannibalisation](/glossary/keyword-cannibalization) as a content plan grows.',
    ],
    how: {
      heading: 'How to write a content brief',
      steps: [
        'State the target keyword, secondary keywords and the URL.',
        'Describe the search intent and the format the top results use (guide, list, comparison, tool).',
        'Define the reader: who they are and what they already know.',
        'Give a suggested outline with headings, plus the questions the page must answer.',
        'Note what will make this page better than what ranks: original data, examples, expertise ([information gain](/glossary/information-gain)).',
        'List internal links to add, sources to cite and the call to action.',
      ],
    },
    example: {
      label: 'Brief summary',
      body: 'Keyword: “how to descale a kettle” (informational). URL: /guides/descale-kettle. Reader: home user with limescale, wants a quick method. Format: short step-by-step guide with a method comparison table (vinegar, citric acid, commercial descaler). Must answer: how often, is vinegar safe, how to remove the smell. Add: photos from our own test, time each method took. Link to: /guides/hard-water.',
    },
    openseo: {
      body: 'Keyword overview gives the volume, difficulty, intent and live top 10 for a target keyword, and keyword ideas lists the questions to answer: the research a brief is built from.',
      href: '/tools/keyword-analysis-tool',
      label: 'Research a brief',
    },
    related: ['search-intent', 'primary-keyword', 'secondary-keywords', 'content-optimization', 'search-engine-friendly-copywriting'],
    faqs: [
      {
        question: 'What should a content brief include?',
        answer: [
          'Target keyword, search intent, audience, outline, questions to answer, what makes the page unique, internal links, sources and the call to action.',
        ],
      },
      {
        question: 'How long should a content brief be?',
        answer: [
          'One or two pages is usually enough. If it is longer than the article, it is doing the writer’s job.',
        ],
      },
    ],
  },
  {
    slug: 'content-decay',
    term: 'Content decay',
    aka: ['traffic decay', 'content drift'],
    category: 'content',
    short: 'Content decay is the gradual decline in a page’s rankings and organic traffic over time, after an initial period of good performance.',
    definition: [
      'Content decay is the gradual decline in a page’s search rankings and organic traffic over months or years, after a period of steady performance. It isn’t a penalty; it is what happens when a page stays the same while searcher needs, competitors and search results move on.',
      'Common causes include outdated information, newer and better competing pages, a change in [search intent](/glossary/search-intent) (for example, searchers now want a video or a tool), new SERP features such as AI Overviews taking clicks, loss of backlinks, and your own newer pages competing with the old one.',
    ],
    why: [
      'Decay is slow, so it is easy to miss until a lot of traffic has gone. Catching it early is usually cheaper than writing new content: an established page with links and history often recovers quickly with a well-targeted update.',
      'Separate decay from seasonality. A page about tax returns that drops after the filing deadline is seasonal, not decaying. Compare the same period year on year.',
    ],
    how: {
      heading: 'How to find content decay',
      steps: [
        'In Search Console, compare clicks for each page over the last 3-6 months with the same period a year earlier.',
        'Sort by the biggest absolute loss in clicks, not percentage, so you focus on what matters.',
        'For each declining page, check whether rankings, impressions or CTR fell. Lower CTR at the same position suggests a SERP change; lower impressions suggest lost rankings or demand.',
        'Look at what now ranks above you and what has changed.',
        'Decide whether to [refresh](/glossary/content-refresh), merge or retire the page.',
      ],
    },
    openseo: {
      body: 'Search performance connects Search Console and GA4 with period comparisons, so you can see which pages and queries are losing clicks. Rank tracking shows when the positions moved.',
      href: '/features/search-console-dashboard',
      label: 'Compare periods in search performance',
    },
    related: ['content-refresh', 'freshness', 'content-audit', 'evergreen-content', 'seasonality'],
    faqs: [
      {
        question: 'How do I stop content decay?',
        answer: [
          'You can’t stop it entirely, but regular reviews and updates of your most valuable pages slow it down and often reverse it.',
        ],
      },
      {
        question: 'Is a traffic drop always content decay?',
        answer: [
          'No. It may be seasonality, a Google update, a tracking problem or a technical issue such as a page being deindexed. Check those before rewriting.',
        ],
      },
    ],
  },
  {
    slug: 'content-refresh',
    term: 'Content refresh',
    aka: ['content update', 'updating old content', 'historical optimization'],
    category: 'content',
    hat: 'white',
    short: 'A content refresh is a substantial update of an existing page to make it current, accurate and more useful, so it regains or improves rankings.',
    definition: [
      'A content refresh is a substantial update to an existing page, such as correcting outdated facts, adding missing sections, improving examples and structure and updating links, so that it serves readers better and regains or improves its search rankings. It keeps the same URL, so the page keeps its history and backlinks.',
      'A refresh is different from changing the date. Google has warned against updating the date on a page without making meaningful changes, and it is easy for readers to spot. A real refresh changes what the page says because the topic, the competition or searcher needs have changed.',
    ],
    why: [
      'Refreshing an established page is often the fastest SEO win available. The page already has links, history and some rankings; bringing it up to date can recover lost positions in weeks, while a new page might take months.',
      'It is also a direct fix for [content decay](/glossary/content-decay) and for pages sitting just off page one, the [striking distance keywords](/glossary/striking-distance-keywords) that need a nudge.',
    ],
    how: {
      heading: 'How to refresh old content',
      steps: [
        'Pick pages with something to gain: declining traffic, positions 5-20 or high impressions with low clicks.',
        'Check the current top results and note what they cover that you don’t, and the format they use.',
        'Update facts, prices, statistics, screenshots and examples. Remove what is no longer true.',
        'Add missing subtopics and questions, and tighten anything that no longer earns its space.',
        'Improve the title and meta description if CTR is low for the position.',
        'Fix broken links and add internal links from newer related pages.',
        'Update the visible “last updated” date only when the changes are substantial, then request indexing in Search Console.',
        'Compare clicks and positions over the following weeks.',
      ],
    },
    openseo: {
      body: 'Search performance highlights striking-distance queries (positions 5-20) with opportunity scores, a short list of pages most likely to gain from a refresh.',
      href: '/features/search-console-dashboard',
      label: 'Find pages to refresh',
    },
    related: ['content-decay', 'freshness', 'striking-distance-keywords', 'content-audit', 'content-optimization'],
    faqs: [
      {
        question: 'How often should I update old blog posts?',
        answer: [
          'Review your most valuable pages every 6-12 months, and fast-changing topics more often. Update when something has changed, not on a fixed timer.',
        ],
      },
      {
        question: 'Does changing the date on a post help SEO?',
        answer: [
          'Not on its own. Google advises against changing dates without meaningful updates. Change the date when you have substantially improved the content.',
        ],
      },
      {
        question: 'Should I change the URL when I refresh a page?',
        answer: [
          'No. Keep the same URL so the page keeps its backlinks and history. If you must change it, add a 301 redirect.',
        ],
      },
    ],
  },
  {
    slug: 'content-pruning',
    term: 'Content pruning',
    aka: ['pruning content', 'content removal'],
    category: 'content',
    hat: 'white',
    short: 'Content pruning is removing, merging or redirecting low-value pages so a site’s remaining content is stronger and easier to crawl.',
    definition: [
      'Content pruning is the process of removing, merging, redirecting or noindexing pages that no longer serve readers or the business, such as outdated, thin or duplicate content, so that the rest of the site is stronger and easier for search engines to crawl and understand. It is usually an outcome of a [content audit](/glossary/content-audit).',
      'Pruning doesn’t always mean deleting. Often the best option is to merge several weak pages on the same topic into one strong page and 301-redirect the old URLs to it, keeping any links they earned. Delete only when a page has no traffic, no links and no future value.',
    ],
    why: [
      'Low-quality pages can drag down how a site is perceived overall. Google’s guidance on helpful content looks at content across a site, and removing unhelpful pages is one of the things it suggests may help. Pruning also reduces [index bloat](/glossary/index-bloat), saves crawl budget on large sites and removes pages that cannibalise better ones.',
      'Pruning carelessly is risky. Removing pages that have links, long-tail traffic or conversions can lose more than it gains. Check the data for every page before acting.',
    ],
    how: {
      heading: 'How to prune content safely',
      steps: [
        'Pull a list of every indexable page with clicks, impressions, conversions and backlinks over at least 12 months.',
        'Flag candidates: no or very little traffic, no links, outdated or thin, or duplicating another page.',
        'For each, choose: improve it, merge it into a stronger page and 301-redirect, noindex it (if users need it but search doesn’t), or delete it with a 404 or 410.',
        'Update internal links that point to removed or redirected pages.',
        'Remove deleted URLs from your XML sitemap.',
        'Monitor traffic for the affected sections over the next few months.',
      ],
    },
    openseo: {
      body: 'The site audit flags thin and duplicate pages and broken internal links, and search performance shows which pages get no clicks, so you can prune with data.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['content-audit', 'thin-content', 'index-bloat', '301-redirect', 'duplicate-content', 'keyword-cannibalization'],
    faqs: [
      {
        question: 'Does deleting content help SEO?',
        answer: [
          'It can, if the pages were low quality and had no traffic or links. Merging and redirecting is often better than deleting, because it keeps any value the old pages had.',
        ],
      },
      {
        question: 'Should I use 404 or 410 for pruned pages?',
        answer: [
          'Both tell Google the page is gone. A 410 signals the removal is intentional and permanent, and Google may drop it slightly sooner, but either works.',
        ],
      },
    ],
  },
  {
    slug: 'information-gain',
    term: 'Information gain',
    aka: ['information gain score', 'original content'],
    category: 'content',
    short: 'Information gain is the new, useful information a page adds beyond what other pages on the same topic already say.',
    definition: [
      'Information gain is the amount of new, useful information a page offers beyond what other pages on the same topic already provide. A page with high information gain adds original data, first-hand experience, new examples, expert insight or a better way of explaining something; a page with low information gain rewords what already ranks.',
      'The term comes partly from a Google patent on estimating the “information gain” of documents for a user who has already seen other documents on a topic. A patent shows an idea Google has explored, not proof of how ranking works today, so treat “information gain score” as a useful way of thinking rather than a known metric. Google’s own [helpful content](/glossary/helpful-content) guidance makes the same point plainly: it asks whether content provides original information, research or analysis, and whether it adds substantial value compared with other pages in search results.',
    ],
    why: [
      'When ten pages say the same thing, a search engine has little reason to rank yours, and an AI assistant has little reason to cite it. Original material is what makes a page worth ranking and worth quoting.',
      'It also protects you against the flood of generic content, including mass-produced AI text, that copies the structure of top results. Content built from your own data and experience can’t be cloned easily.',
    ],
    how: {
      heading: 'How to add information gain',
      steps: [
        'Read the top-ranking pages and list what they all say. That is the baseline, not the goal.',
        'Ask what you know that they don’t: your own data, tests, customer questions, mistakes, costs, photos.',
        'Add at least one thing no other page has: an original table, a worked example, a quote from an expert, a calculator.',
        'Show first-hand experience: what you did, what happened, what you would do differently. It supports [E-E-A-T](/glossary/eeat).',
        'Cut sections that only restate what every other page says, unless readers genuinely need them for context.',
      ],
    },
    example: {
      label: 'Worked example',
      body: 'Every top result for “best time to post on LinkedIn” lists the same days and hours from the same studies. A page that adds results from 500 of your own posts, broken down by industry and post type, has clear information gain and is the one other writers will link to.',
    },
    openseo: {
      body: 'The SERP checker shows the live top 10 for a keyword, so you can read what already ranks before deciding what your page will add.',
      href: '/tools/serp-checker',
      label: 'Check the top 10',
    },
    related: ['helpful-content', 'eeat', 'content-gap', 'ai-citations', 'scraped-content'],
    faqs: [
      {
        question: 'Is information gain a Google ranking factor?',
        answer: [
          'Google hasn’t confirmed an information gain score. It does hold a patent on the idea, and its helpful content guidance asks whether content adds original information and substantial value compared with other results.',
        ],
      },
      {
        question: 'How do I add information gain to content?',
        answer: [
          'Add something only you can provide: original data, testing, first-hand experience, expert quotes, examples or tools.',
        ],
      },
    ],
  },
  {
    slug: 'freshness',
    term: 'Content freshness',
    aka: ['freshness', 'query deserves freshness', 'QDF'],
    category: 'content',
    short: 'Content freshness is how recent and up to date a page is. Google ranks fresher content higher for queries where recency matters.',
    definition: [
      'Content freshness is how recent and up to date a page’s content is. Google uses freshness as a signal for queries where recent information matters, such as breaking news, recurring events, prices and fast-changing topics, an idea often called “query deserves freshness”. For timeless queries, such as how to tie a bowline knot, freshness matters little.',
      'Google has said its systems try to show fresh content where it is expected, and introduced a freshness update in 2011 that made results more timely for those queries. Freshness is about the content actually being current, not the date shown on the page.',
    ],
    why: [
      'For time-sensitive topics, an outdated page will lose to a current one however strong it is. “Best laptops”, “mortgage rates”, “iPhone release date” and annual comparisons all reward pages that are kept up to date with a regular [content refresh](/glossary/content-refresh).',
      'Freshness also matters for [AI search](/glossary/ai-visibility). Assistants with web search tend to prefer recent sources for current questions, and an out-of-date page can lead to your brand being quoted with old facts.',
    ],
    how: {
      heading: 'How to keep content fresh',
      steps: [
        'Identify which of your topics are time-sensitive by looking at whether the top results are recent.',
        'Schedule reviews for those pages: monthly or quarterly for fast-moving topics, yearly for slower ones.',
        'Make meaningful updates: new data, current prices, new products, changed advice.',
        'Show a visible “updated” date and keep it truthful; use datePublished and dateModified in [structured data](/glossary/structured-data).',
        'Don’t change dates without changing content. Google’s guidance specifically warns against it.',
      ],
    },
    example: {
      label: 'JSON-LD',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best budget laptops",
  "datePublished": "2025-03-04",
  "dateModified": "2026-10-01"
}
</script>`,
    },
    openseo: {
      body: 'Search performance compares periods so you can see which time-sensitive pages are losing clicks and need an update.',
      href: '/features/search-console-dashboard',
      label: 'See search performance',
    },
    related: ['content-refresh', 'content-decay', 'evergreen-content', 'seasonality', 'top-stories'],
    faqs: [
      {
        question: 'Does Google prefer new content?',
        answer: [
          'Only for queries where recency matters. For evergreen questions, an older page that answers well can outrank newer ones.',
        ],
      },
      {
        question: 'Does updating the published date help rankings?',
        answer: [
          'Not on its own. Google advises against changing dates without substantial changes to the content.',
        ],
      },
    ],
  },
  {
    slug: 'readability',
    term: 'Readability',
    aka: ['reading level', 'Flesch reading ease'],
    category: 'content',
    short: 'Readability is how easy a text is to read and understand, shaped by sentence length, word choice, structure and layout.',
    definition: [
      'Readability is how easy a piece of text is to read and understand. It depends on sentence length, word choice, paragraph length, structure (headings, lists, tables) and layout (font size, line length, spacing). Formulas such as Flesch Reading Ease and Flesch-Kincaid Grade Level estimate it from word and sentence length.',
      'Readability scores are rough guides. They can’t tell whether a text is clear, accurate or well organised, and specialist audiences may need technical terms that lower the score. Google has not said that it uses readability scores as a ranking factor.',
    ],
    why: [
      'Readability matters for SEO indirectly, through the people reading. A page that is hard to follow loses readers, fails to answer the question and is less likely to be shared or linked. Clear writing also makes it easier for search engines and AI systems to extract a direct answer, for example for a [featured snippet](/glossary/featured-snippet).',
      'Most people scan web pages rather than reading every word, so structure (clear headings, short paragraphs, lists) is often more important than any score.',
    ],
    how: {
      heading: 'How to improve readability',
      steps: [
        'Put the answer or main point first, then the detail.',
        'Use short sentences and short paragraphs, and one idea per paragraph.',
        'Prefer plain words. Explain technical terms the first time you use them.',
        'Use descriptive headings and a logical [heading hierarchy](/glossary/heading-hierarchy) so readers can scan.',
        'Use lists for steps and tables for comparisons.',
        'Read it aloud or ask someone from your audience to read it.',
      ],
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings, a quick way to see whether its structure is clear.',
      href: '/tools/on-page-seo-audit',
      label: 'Analyse a page',
    },
    related: ['search-engine-friendly-copywriting', 'heading-hierarchy', 'header-tags', 'helpful-content', 'content-optimization'],
    faqs: [
      {
        question: 'Is readability a Google ranking factor?',
        answer: [
          'Google hasn’t said that it uses readability scores. Readable content helps users, which matters for SEO, but chasing a score is not the goal.',
        ],
      },
      {
        question: 'What reading level should web content be?',
        answer: [
          'Write for your audience. For general consumer content, aim for plain language most adults can read easily; specialist content can be more technical.',
        ],
      },
    ],
  },
  {
    slug: 'user-generated-content',
    term: 'User-generated content',
    aka: ['UGC'],
    category: 'content',
    short: 'User-generated content (UGC) is content created by a site’s users rather than its owners, such as reviews, comments, forum posts and Q&A.',
    definition: [
      'User-generated content (UGC) is content created by a website’s users or customers rather than by the site itself, such as product reviews, comments, forum threads, Q&A answers, photos and community posts. Reddit, Quora, Stack Overflow and review sites are built almost entirely on it.',
      'Search engines treat UGC like any other content: helpful discussions can rank well, and spammy or low-quality UGC can hurt how a site is seen. Google asks sites to mark links in user content with [rel="ugc"](/glossary/ugc-attribute) (introduced in 2019) or nofollow, and to take reasonable steps to prevent spam.',
    ],
    why: [
      'UGC adds real experience and fresh, long-tail language that site owners would never write. Product reviews, for example, answer questions buyers actually have. Forums and discussions are prominent in Google results and are often cited in AI answers.',
      'It also brings risk. Unmoderated comment sections and forums attract [comment spam](/glossary/comment-spam), and spammy UGC can lead to a manual action for user-generated spam. The site owner is responsible for what is published.',
      'UGC is also a source of [brand mentions](/glossary/brand-mentions) and content ideas. The questions customers ask in reviews and forums are often the same ones people type into search engines, and recurring themes are good candidates for an FAQ or a full guide.',
    ],
    how: {
      heading: 'How to manage user-generated content for SEO',
      steps: [
        'Moderate: use spam filters, approve first posts and remove spam quickly.',
        'Add rel="ugc" or rel="nofollow" to links in user content.',
        'Noindex low-value UGC pages, such as empty profiles or threads with no answers.',
        'Show reviews and answers as real HTML text on the page so they can be crawled.',
        'Only mark up reviews with structured data where they meet Google’s review snippet guidelines.',
      ],
    },
    example: {
      label: 'HTML',
      code: '<a href="https://example.com/" rel="ugc nofollow">a link a user posted</a>',
    },
    related: ['ugc-attribute', 'comment-spam', 'online-reviews', 'nofollow-link', 'brand-mentions'],
    faqs: [
      {
        question: 'Is user-generated content good for SEO?',
        answer: [
          'Moderated, helpful UGC can be: it adds fresh, relevant content and real experience. Unmoderated spam can harm a site.',
        ],
      },
      {
        question: 'Should links in comments be nofollow?',
        answer: [
          'Yes. Google recommends rel="ugc" or rel="nofollow" on links in user-generated content.',
        ],
      },
    ],
  },
  {
    slug: 'ai-generated-content',
    term: 'AI-generated content',
    aka: ['AI content', 'AI written content', 'generative AI content'],
    category: 'content',
    short: 'AI-generated content is text, images or other media produced with generative AI tools. Google judges it by quality, not by how it was made.',
    definition: [
      'AI-generated content is text, images, video or other media created wholly or partly with generative AI tools, such as large language models like ChatGPT, Gemini and Claude, or image models. In SEO it usually means articles, product descriptions, metadata and pages drafted by an AI model, with or without human editing.',
      'Google’s position is clear and has been since February 2023: it rewards helpful, reliable, people-first content however it is produced. Using AI is not against its guidelines in itself. What matters is whether the content is useful, accurate and original, and whether it was made primarily to help people or primarily to manipulate search rankings.',
      'The line is drawn by Google’s [scaled content abuse](/glossary/scaled-content-abuse) policy, introduced in March 2024. It covers generating many pages primarily to manipulate rankings and without adding value for users, however the content is made: by AI, by people or by a mix. Mass-producing articles with an AI tool to target thousands of keywords, without real review, expertise or value, falls squarely under it and can lead to a [manual action](/glossary/manual-action) or ranking demotion.',
      'Google’s guidance on using generative AI also stresses accuracy. Language models predict likely text rather than retrieving facts, so they can produce confident errors. Google advises fact-checking and reviewing AI output before publishing, including metadata such as titles and descriptions, and considering telling readers how content was created where that makes sense. For shopping, Merchant Center has stricter rules for labelling AI-generated images and product data.',
    ],
    why: [
      'AI makes content cheap to produce, so the web is full of pages that say the same thing in the same way. That raises the value of what AI can’t supply on its own: first-hand experience, original data, expert judgement and real examples. Google’s [helpful content](/glossary/helpful-content) guidance and its emphasis on [E-E-A-T](/glossary/eeat) point the same way.',
      'Used well, AI is a genuine help: research summaries, outlines, first drafts, rewriting for clarity, translation, product description variants, schema markup and code. Used as a substitute for knowing the subject, it produces thin, generic and sometimes wrong pages that won’t rank and can damage trust in the whole site.',
      'There is also reputational risk. A published factual error, an invented quote or a made-up statistic is your error, whichever tool wrote it.',
    ],
    how: {
      heading: 'How to use AI content safely for SEO',
      steps: [
        'Start from expertise and purpose: decide what the page must say, and why you are the right source, before involving a model.',
        'Use AI for parts of the process (research, outlines, drafts, editing), not as the author of record.',
        'Fact-check every claim, number, quote and link. Remove anything you can’t verify.',
        'Add what the model can’t: your data, tests, photos, examples, opinions and experience.',
        'Have a person with relevant knowledge review and edit, and put a real, accountable author on the page.',
        'Review AI-written titles, meta descriptions and alt text too; they appear in search results.',
        'Don’t publish at a scale you can’t review. Hundreds of unreviewed pages is the pattern scaled content abuse targets.',
        'Consider telling readers how the content was produced where it would help them trust it.',
      ],
    },
    openseo: {
      body: 'The site audit flags thin and duplicate pages across a site, a useful check after publishing AI-assisted content, and the SERP checker shows what already ranks so you can judge what your page must add.',
      href: '/features/site-audit',
      label: 'Run a site audit',
    },
    related: ['scaled-content-abuse', 'helpful-content', 'eeat', 'information-gain', 'llm', 'thin-content'],
    faqs: [
      {
        question: 'Does Google penalise AI-generated content?',
        answer: [
          'Not for being AI-generated. Google rewards helpful content however it is produced. It acts against content made primarily to manipulate rankings, including mass-produced, low-value pages, under its scaled content abuse policy.',
        ],
      },
      {
        question: 'Can Google detect AI content?',
        answer: [
          'Google’s focus is on whether content is helpful and whether it is spam, not on detecting the tool used. Low-quality, scaled content tends to be caught for its quality and patterns, whoever or whatever wrote it.',
        ],
      },
      {
        question: 'Should I disclose that content is AI-generated?',
        answer: [
          'Google suggests considering disclosure where readers would reasonably want to know how content was made. Merchant Center requires AI-generated product images and data to be labelled.',
        ],
      },
      {
        question: 'Can AI-written content rank on Google?',
        answer: [
          'Yes, if it is accurate, useful and adds something to what already ranks. In practice, AI drafts that rank have usually been substantially edited and enriched by people who know the subject.',
        ],
      },
      {
        question: 'Is AI content considered spam?',
        answer: [
          'Not by default. It becomes spam under Google’s policies when it is produced at scale primarily to manipulate rankings and adds little value for users, the same test Google applies to content written by people.',
        ],
      },
    ],
  },
  {
    slug: 'comparison-pages',
    term: 'Comparison pages',
    aka: ['vs pages', 'alternatives pages', 'comparison articles'],
    category: 'content',
    short: 'Comparison pages compare two or more products or options side by side, such as “X vs Y” or “X alternatives”, to help people choose.',
    definition: [
      'Comparison pages are pages that compare two or more products, services or options side by side to help someone choose, such as “Notion vs Obsidian”, “best alternatives to Mailchimp” or “heat pump vs gas boiler”. They target searchers with [commercial intent](/glossary/commercial-intent), who are close to a decision.',
      'Common formats are head-to-head “X vs Y” pages, “X alternatives” lists, “best X for Y” roundups and comparison tables. Companies often publish comparisons with their own competitors; publishers and review sites compare products they have tested.',
    ],
    why: [
      'Comparison searches have smaller volume than broad topics but much higher value, because the searcher is about to choose. They also feature heavily in AI answers: when someone asks an assistant which product to pick, comparison and review pages are often the [sources it cites](/glossary/ai-citations).',
      'Trust is the whole game. Google’s guidance on reviews asks for evidence of [first-hand use](/glossary/eeat), measurements, and the pros and cons of each option, not just a summary of manufacturers’ claims. A comparison that always picks its own publisher, with no evidence, rarely convinces readers or ranks for long.',
    ],
    how: {
      heading: 'How to write a comparison page',
      steps: [
        'Target real searches: check volume for “X vs Y” and “X alternatives” terms in your category.',
        'State who each option is best for in the first few lines.',
        'Compare on the criteria buyers care about, in a table: price, key features, limits, support.',
        'Show evidence: screenshots, tests, real pricing, dated facts.',
        'Be fair about competitors’ strengths and your own weaknesses. Readers notice, and it builds trust.',
        'Keep it current. Pricing and features change, so date the page and review it regularly.',
      ],
    },
    openseo: {
      body: 'Keyword ideas finds “vs” and “alternatives” searches in your category with volume and intent, and the SERP checker shows which comparison pages already rank.',
      href: '/tools/keyword-generator',
      label: 'Find comparison keywords',
    },
    related: ['commercial-intent', 'search-intent', 'ai-citations', 'information-gain', 'thin-affiliate-pages'],
    faqs: [
      {
        question: 'Can I mention competitors’ names on my comparison page?',
        answer: [
          'In general, factual comparative content that names competitors is common and lawful in many countries, but the claims must be accurate and not misleading. Check advertising and trademark rules where you operate.',
        ],
      },
      {
        question: 'Do comparison pages help SEO?',
        answer: [
          'Yes, they target high-intent searches and are often cited by AI assistants. They work best when they are fair, specific and kept up to date.',
        ],
      },
    ],
  },
  {
    slug: 'faq-page',
    term: 'FAQ page',
    aka: ['frequently asked questions page', 'FAQ section', 'FAQ schema'],
    category: 'content',
    short: 'An FAQ page lists common questions about a product, service or topic with short answers, to help users and answer search queries.',
    definition: [
      'An FAQ page is a page (or a section of a page) that lists frequently asked questions about a product, service or topic, each with a short, direct answer. It helps visitors find answers quickly and can match question-style searches people type or ask AI assistants.',
      'FAQ structured data (FAQPage schema) used to make pages eligible for expandable FAQ rich results in Google. Google limited those to well-known government and health sites in August 2023 and stopped showing FAQ rich results altogether in May 2026. The FAQPage type still exists in schema.org, but it no longer produces a special result in Google Search.',
    ],
    why: [
      'Good FAQs answer real questions in plain language, which helps conversion (fewer doubts before buying), reduces support load and gives search engines and AI systems clear question-and-answer pairs to draw on. Many [question keywords](/glossary/question-keywords) can be answered well in an FAQ section.',
      'The main mistake is writing FAQs for search engines rather than people: invented questions stuffed with keywords, or answers duplicated across hundreds of pages. That adds no value and risks being treated as [thin content](/glossary/thin-content).',
    ],
    how: {
      heading: 'How to write an FAQ page',
      steps: [
        'Collect real questions from support tickets, sales calls, reviews, People Also Ask and keyword research.',
        'Use the question as the heading and answer it directly in the first sentence.',
        'Keep answers short, and link to a full page where a topic needs more depth.',
        'Group questions by theme if there are many.',
        'Keep the answers in visible HTML text, not hidden behind scripts that need a click to load.',
        'Review answers when prices, policies or features change.',
      ],
    },
    openseo: {
      body: 'Keyword ideas lists the questions people search about a topic, with volume, a good source for FAQ questions with real demand.',
      href: '/tools/keyword-generator',
      label: 'Find question keywords',
    },
    related: ['question-keywords', 'people-also-ask', 'answer-engine-optimization', 'structured-data', 'rich-results'],
    faqs: [
      {
        question: 'Does FAQ schema still work?',
        answer: [
          'Not for rich results. Google stopped showing FAQ rich results in May 2026. Valid FAQPage markup does no harm, but the visible questions and answers are what help users and search.',
        ],
      },
      {
        question: 'Are FAQ pages good for SEO?',
        answer: [
          'They can be, when they answer real questions clearly. They help users, match question searches and give AI systems clear answers to cite.',
        ],
      },
    ],
  },
  {
    slug: 'search-engine-friendly-copywriting',
    term: 'SEO copywriting',
    aka: ['SEO writing', 'search engine friendly copywriting', 'SEO content writing'],
    category: 'content',
    short: 'SEO copywriting is writing web copy that ranks in search and persuades readers, by matching search intent and answering clearly.',
    definition: [
      'SEO copywriting is writing web content that both ranks in search engines and persuades or helps the people who read it. It combines the research side of SEO (target keywords, [search intent](/glossary/search-intent), the questions people ask) with the craft of copywriting: clear structure, a strong angle and a reason to act.',
      'Modern SEO copywriting is not about repeating a keyword a set number of times. Search engines understand topics and synonyms, so the job is to cover what the searcher needs, in the order they need it, using the words they use, and to write titles and meta descriptions that earn the click.',
    ],
    why: [
      'Ranking only matters if people click and then do something. Good SEO copy improves [click-through rate](/glossary/click-through-rate) from the results page, keeps readers on the page and turns visits into enquiries or sales.',
      'It also avoids the old habits that now hurt: [keyword stuffing](/glossary/keyword-stuffing), padded word counts and vague introductions that delay the answer.',
    ],
    how: {
      heading: 'How to write SEO copy',
      steps: [
        'Research the keyword and look at the top results to understand intent and format.',
        'Write a title tag that includes the main keyword naturally and gives a reason to click.',
        'Open with the answer or the promise of the page, not a warm-up.',
        'Use headings that match the questions readers have, in the order they have them.',
        'Use the main keyword and its natural variations where they fit; read it aloud to check it sounds human.',
        'Back claims with specifics: numbers, examples, proof.',
        'End sections with a clear next step or call to action where it suits the page.',
      ],
    },
    example: {
      label: 'Title and description',
      body: 'Keyword: “how to descale a kettle”. Title: “How to descale a kettle (3 methods we tested)”. Meta description: “Descale a kettle with vinegar, citric acid or a descaler. We tested all three: here’s which works fastest and how to get rid of the taste.” The title matches the query, the description promises the answer and a reason to click.',
    },
    openseo: {
      body: 'The page analyser checks a page’s title, description and headings and shows the keywords it ranks for, a quick check on whether your copy matches what it should rank for.',
      href: '/tools/on-page-seo-audit',
      label: 'Analyse a page',
    },
    related: ['content-optimization', 'title-tag', 'meta-description', 'readability', 'search-intent', 'content-brief'],
    faqs: [
      {
        question: 'What is the difference between copywriting and SEO copywriting?',
        answer: [
          'Copywriting is persuasive writing for any channel. SEO copywriting adds research into what people search and writes so the page can rank and satisfy that search.',
        ],
      },
      {
        question: 'How many times should a keyword appear in a page?',
        answer: [
          'There is no ideal number. Use it in the title, the main heading and where it fits naturally; Google understands variations and synonyms.',
        ],
      },
    ],
  },
];
