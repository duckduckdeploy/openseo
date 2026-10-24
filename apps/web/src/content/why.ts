import type { Faq } from './pricing';

/** Content for /why-openseo: who OpenSEO is for, what sets it apart, and plain answers about the project. */

export interface WhyCard {
  title: string;
  body: string;
  /** Things this reader gets, shown as a short list. */
  points?: string[];
}

export const audiences: WhyCard[] = [
  {
    title: 'Business owners doing their own SEO',
    body: 'You want more customers to find your site, without learning a big SEO suite or paying for one every month.',
    points: [
      'An AI agent that explains what the data means and picks the next step',
      'Free site audits and Search Console reports for your own site',
      'A monthly spending limit, so a busy week never becomes a big bill',
    ],
  },
  {
    title: 'Marketers and agencies',
    body: 'You already know SEO. You want one place per client for research, tracking and reports, and an agent that can do the legwork.',
    points: [
      'One project per site, each with its own goals and notes',
      'Rank tracking, backlinks and AI visibility in one workspace',
      'Change the skills to match your own process',
    ],
  },
  {
    title: 'Developers and AI builders',
    body: 'You want SEO data your code and agents can call, on infrastructure you control.',
    points: [
      'A REST API and an MCP server with every feature',
      'MIT licensed: fork it, extend it, ship it',
      'One Docker command to run it on your own server',
    ],
  },
];

export const differences: WhyCard[] = [
  {
    title: 'Open source, all of it',
    body: 'The app, the API, the crawler and the MCP server are MIT licensed. Nothing is held back for a paid edition, so you can read every line and change what you need.',
  },
  {
    title: 'Your data stays yours',
    body: 'Self-host with Docker and your keywords, rankings and audits live in your own database. The hosted app runs the same open code, so you can see exactly what it does with your data.',
  },
  {
    title: 'You decide what you spend',
    body: 'OpenSEO never charges you. Search data is billed per lookup to your own data key, every call is listed with its cost, and a monthly limit stops spending past it.',
  },
  {
    title: 'Built for AI agents',
    body: 'Claude, ChatGPT, Cursor, Codex and Gemini can use every feature through the MCP server, with a cost ceiling on each paid call so an agent never spends more than you agreed.',
  },
];

/** The skills in plugins/openseo/skills, described for readers. */
export const skills = [
  { name: 'SEO coach', what: 'Learns your site and goals, sets up the project and picks the first things worth doing.' },
  { name: 'Keyword research', what: 'Finds keywords worth targeting, groups them by intent and saves the best ones.' },
  { name: 'Competitor analysis', what: 'Works out a competitor’s traffic, best keywords and the gap with your site.' },
  { name: 'SEO audit', what: 'Audits any domain from search data and turns it into a short action plan.' },
  { name: 'Site audit', what: 'Crawls your site for free and finds the technical fixes most likely to help.' },
  { name: 'Search Console review', what: 'Finds queries one push from page one and pages losing ground.' },
  { name: 'Local SEO', what: 'Checks a business on Google Maps, its reviews and where it ranks street by street.' },
];

export const whyFaqs: Faq[] = [
  {
    question: 'What is OpenSEO?',
    answer: [
      'OpenSEO is a free, open-source SEO platform at openseo.gg. It covers keyword research, rank tracking, backlinks, site audits, AI visibility, local rankings and Search Console reports. You can use it online or self-host it with Docker, and AI agents can use every feature through its MCP server.',
    ],
  },
  {
    question: 'Is OpenSEO free?',
    answer: [
      'Yes. The software is MIT licensed, self-hosting is free and unlimited for good, and the hosted app is free with every feature unlimited today. Search data such as keyword volumes and backlinks is billed per lookup to your own data key, never by OpenSEO. See [pricing](/pricing).',
    ],
  },
  {
    question: 'Where does the OpenSEO source code live?',
    answer: [
      'On GitHub at [github.com/duckduckdeploy/openseo](https://github.com/duckduckdeploy/openseo), under the MIT licence. The code there is the same code that runs openseo.gg.',
    ],
  },
  {
    question: 'Are there other tools called OpenSEO?',
    answer: [
      'Yes, other projects use the same or a similar name and are not related to this one. This OpenSEO lives at openseo.gg, with its code at github.com/duckduckdeploy/openseo.',
    ],
  },
  {
    question: 'Does OpenSEO work with ChatGPT and Claude?',
    answer: [
      'Yes. Connect Claude, ChatGPT, Cursor, Codex or Gemini to the [OpenSEO MCP server](/features/seo-mcp-server) and your agent can research keywords, check rankings, audit sites and save its work to your projects. The [MCP setup guide](/docs/mcp) walks through it.',
    ],
  },
  {
    question: 'Can I self-host OpenSEO?',
    answer: [
      'Yes. One Docker image and one compose file run the database, API, dashboard and site on your PC, a home server or a small cloud server. Every feature is unlocked and unlimited. Read the [self-hosting guide](/docs/self-hosting).',
    ],
  },
  {
    question: 'Is OpenSEO an Ahrefs or Semrush alternative?',
    answer: [
      'For many sites, yes. It covers the research and tracking most people use those suites for, without a monthly plan. Compare [OpenSEO vs Ahrefs](/compare/ahrefs-alternative) and [OpenSEO vs Semrush](/compare/semrush-alternative) to see where each one is stronger.',
    ],
  },
];
