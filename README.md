<p align="center">
  <a href="https://openseo.gg"><img src=".github/assets/banner.svg" alt="OpenSEO: the open-source SEO suite you control" width="100%"></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge" alt="MIT licence"></a>
  <a href="#-self-host-with-docker"><img src="https://img.shields.io/badge/self--host-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Self-host with Docker"></a>
  <a href="https://openseo.gg/docs/mcp"><img src="https://img.shields.io/badge/MCP-76%20tools-7c3aed?style=for-the-badge" alt="76 MCP tools"></a>
  <a href="https://openseo.gg"><img src="https://img.shields.io/badge/openseo.gg-live-2563eb?style=for-the-badge" alt="openseo.gg"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node-26%2B-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node 26+">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/Postgres-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/status-released%20%26%20active-2350e6?style=flat-square" alt="Status: released, with active updates">
</p>

<h3 align="center">
  <a href="https://openseo.gg">Website</a>
  &nbsp;·&nbsp;
  <a href="https://openseo.gg/docs">Docs</a>
  &nbsp;·&nbsp;
  <a href="https://openseo.gg/docs/self-hosting">Self-hosting</a>
  &nbsp;·&nbsp;
  <a href="https://openseo.gg/docs/mcp">Connect an agent</a>
  &nbsp;·&nbsp;
  <a href="https://openseo.gg/docs/rest-api">REST API</a>
  &nbsp;·&nbsp;
  <a href="https://openseo.gg/tools">SEO tools</a>
</h3>

<br>

**OpenSEO** ([openseo.gg](https://openseo.gg)) is an open-source alternative to Ahrefs and Semrush. It covers full SEO audits of any domain, keyword research, rank tracking, backlinks, technical site audits, AI visibility and local rank tracking, and reads your own Google Search Console and Analytics data. Run it on your own machine or server, read every line of it, and hand it to your AI agent.

No monthly plan: the software is free, and search data is paid per lookup, under a monthly limit you set. A rank check is from $0.02, a keyword search of 150 ideas about $0.08.

⭐ **If OpenSEO is useful to you, a star helps other people find it.**

> [!NOTE]
> OpenSEO is released and gets active updates. [Issues](https://github.com/duckduckdeploy/openseo/issues) and ideas are very welcome.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/screens/keyword-overview-dark.webp">
    <img src="apps/web/public/screens/keyword-overview.webp" alt="The Keyword overview: difficulty, volume, traffic potential, volume by country and keyword ideas for one keyword" width="100%">
  </picture>
</p>

## 📸 A look inside

Every tool is one search: type a keyword, domain or URL, pick a country (and a city or state where it helps), press Enter, and everything loads together. The search is in the address, so any view can be bookmarked or shared. Each tool has [its own page](https://openseo.gg/tools), and [the guide](https://openseo.gg/docs/tutorials/seo-tools) goes through every screen.

<table>
  <tr>
    <td width="50%"><img src="apps/web/public/screens/serp-checker-table.webp" alt="SERP checker with each result's authority, links and traffic"><br><sub><b>SERP checker</b>: the live top 10 with SERP features in place and each page's DR, links and traffic</sub></td>
    <td width="50%"><img src="apps/web/public/screens/seo-audit.webp" alt="SEO audit of zapier.com: findings in order of importance above its traffic and authority"><br><sub><b><a href="https://openseo.gg/tools/seo-audit">SEO audit</a></b>: any domain on one page, with what to do first</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="apps/web/public/screens/backlinks-history.webp" alt="Backlink history charts"><br><sub><b>Backlinks</b>: totals, monthly history, strongest links, anchors and link intersect</sub></td>
    <td width="50%"><img src="apps/web/public/screens/keyword-gap.webp" alt="Keyword gap between two domains"><br><sub><b>Competitors</b>: who you compete with, and the keyword gap with any of them</sub></td>
  </tr>
</table>

## 🆓 Try it free, no account

Six tools run right on the website, a few free checks a day, no sign-up:

| Tool | What it checks |
|---|---|
| [Keyword generator](https://openseo.gg/tools/keyword-generator) | 50 keyword ideas for a seed, with volume, difficulty and CPC |
| [Keyword difficulty checker](https://openseo.gg/tools/keyword-difficulty-checker) | Difficulty of up to 20 keywords |
| [SERP checker](https://openseo.gg/tools/serp-checker) | The live Google top 20 for a keyword |
| [Website traffic checker](https://openseo.gg/tools/website-traffic-checker) | Estimated Google traffic of up to 5 sites |
| [Website authority checker](https://openseo.gg/tools/website-authority-checker) | Domain Rating, referring domains and backlinks of up to 3 sites |
| [AI Overview checker](https://openseo.gg/tools/ai-overview-checker) | Whether Google shows an AI Overview, and which sites it cites |

## ✨ Why OpenSEO

- 🔓 **Open source, all of it.** The app, the API, the crawler and the agent server are MIT licensed. Change what you need and keep your changes.
- 🏠 **Your server, your data.** One Docker command runs the whole suite on your own computer or server. Your keywords, rankings and audits stay in your own database.
- 💸 **No surprise bills.** Every call is listed with its cost, and a monthly limit stops all spending once it is reached.
- 🤖 **Agents on a leash.** 76 MCP tools cover the whole workspace. Every paid tool takes `dry_run` and `max_cost_usd`, so an agent cannot spend more than you agreed.
- 📈 **Your own Google data.** Connect Search Console. You get queries one push from page one, and pages scored by where improving them is most worth it.
- 🎯 **Focused workflows.** The SEO work most sites actually do, without the hundred reports nobody opens.

## 🧰 Workflows

<table>
  <tr>
    <th width="26%" align="left">Area</th>
    <th align="left">What you get</th>
  </tr>
  <tr>
    <td width="26%">🩺 <a href="https://openseo.gg/tools/seo-audit">SEO audit</a></td>
    <td>A full audit of any domain on one page: findings in order of importance, traffic and authority, keywords close to the top 3, a keyword gap and a backlink gap with its closest competitors, backlink profile. Search data only, no crawl</td>
  </tr>
  <tr>
    <td width="26%">🔎 <a href="https://openseo.gg/tools/keyword-analysis-tool">Keyword overview</a></td>
    <td>Difficulty, volume, traffic potential, volume by country, ideas and the live top 10 for one keyword, down to a city</td>
  </tr>
  <tr>
    <td width="26%">💡 <a href="https://openseo.gg/tools/keyword-generator">Keyword ideas</a></td>
    <td>Matching terms, related searches, questions and suggestions with volume, CPC, difficulty, intent and trend; saved lists with tags</td>
  </tr>
  <tr>
    <td width="26%">📋 <a href="https://openseo.gg/tools/serp-checker">SERP checker</a></td>
    <td>The live top 10 on desktop or mobile, with each result's DR, UR, links and traffic</td>
  </tr>
  <tr>
    <td width="26%">📍 <a href="https://openseo.gg/features/keyword-rank-tracker">Rank tracking</a></td>
    <td>Google positions on desktop and mobile, by country, city or exact coordinates, on a schedule. Each check reads the top 20, 50 or 100 ($0.02 to $0.10), in the background on a schedule or on demand. History survives removing a keyword</td>
  </tr>
  <tr>
    <td width="26%">📊 <a href="https://openseo.gg/features/search-console-dashboard">Search performance</a></td>
    <td>Search Console: totals against the previous period, striking-distance queries, every keyword synced daily, opportunity scores</td>
  </tr>
  <tr>
    <td width="26%">🌐 <a href="https://openseo.gg/tools/website-seo-analysis">Domain overview</a></td>
    <td>Estimated traffic, ranking distribution, top keywords, top pages, competitors</td>
  </tr>
  <tr>
    <td width="26%">📄 <a href="https://openseo.gg/tools/on-page-seo-audit">Page analyser</a></td>
    <td>One page's authority, links, traffic, on-page checks, keywords and backlinks</td>
  </tr>
  <tr>
    <td width="26%">🔗 <a href="https://openseo.gg/tools/backlink-checker">Backlink checker</a></td>
    <td>Summary, monthly history, backlinks, referring domains, anchors, top pages, link intersect</td>
  </tr>
  <tr>
    <td width="26%">🥊 <a href="https://openseo.gg/tools/seo-competitor-analysis">Competitors</a></td>
    <td>Organic and SERP competitors, keyword gap</td>
  </tr>
  <tr>
    <td width="26%">🕷️ <a href="https://openseo.gg/features/site-audit">Site audit</a></td>
    <td>Our own crawler for technical issues on your pages: 59 checks and a health score; Lighthouse with failed audits rated by severity</td>
  </tr>
  <tr>
    <td width="26%">🧠 <a href="https://openseo.gg/features/ai-visibility-tracker">AI visibility</a></td>
    <td>Tracked prompts across many chat models with web search: mentions, citations, position, share of voice. A mention counts only when the answer points to your domain, so a namesake isn't counted as you, and prompts that name your brand are left out of the rates</td>
  </tr>
  <tr>
    <td width="26%">🗺️ <a href="https://openseo.gg/features/local-rank-tracker">Local rank tracker</a></td>
    <td>Business lookup, profile, reviews, geo-grid rank maps</td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%"><img src="apps/web/public/screens/ai-tracking.webp" alt="AI visibility tracking across chat models"><br><sub><b>AI visibility</b>: mentions, citations and share of voice across 120+ models, paid per prompt run</sub></td>
    <td width="50%"><img src="apps/web/public/screens/rank-tracker.webp" alt="Rank tracker with positions and history"><br><sub><b>Rank tracking</b>: the top 20, 50 or 100, desktop and mobile, any city</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="apps/web/public/screens/site-audit.webp" alt="Site audit health score and issues"><br><sub><b>Site audit</b>: our own crawler, a health score and the worst issues first</sub></td>
    <td width="50%"><img src="apps/web/public/screens/local-grid.webp" alt="Geo-grid rank map over a city"><br><sub><b>Local rank tracker</b>: geo-grid rank maps on Google Maps</sub></td>
  </tr>
</table>

## 🥊 OpenSEO vs the paid suites

| | Ahrefs, Semrush, SE Ranking, Moz | OpenSEO |
|---|---|---|
| Source code | Closed | Open source (MIT) |
| Where it runs | Their cloud | openseo.gg, or your own server with Docker |
| Price | Monthly plans from $49 (Moz) to $140 (Semrush) to start | Free software; data paid per lookup |
| Seats | Paid per user | No seats |
| AI agents | API or MCP on some plans | 76 MCP tools and a REST API, spending capped per call |
| Data depth | Their own crawlers and indexes, the deepest | A large commercial dataset through a provider |

Honest side-by-sides, including when each one is the better buy: [Ahrefs](https://openseo.gg/compare/ahrefs-alternative) · [Semrush](https://openseo.gg/compare/semrush-alternative) · [SE Ranking](https://openseo.gg/compare/se-ranking-alternative) · [Mangools](https://openseo.gg/compare/mangools-alternative) · [Ubersuggest](https://openseo.gg/compare/ubersuggest-alternative) · [Moz](https://openseo.gg/compare/moz-alternative) · [Screaming Frog](https://openseo.gg/compare/screaming-frog-alternative) · [Otterly.AI](https://openseo.gg/compare/otterly-alternative)

## 🐳 Self-host with Docker

You need [Docker](https://docs.docker.com/get-docker/). On Windows or macOS that's Docker Desktop with at least 4 GB of memory.

```bash
git clone https://github.com/duckduckdeploy/openseo.git openseo
cd openseo
cp .env.example .env
# In .env, set AUTH_SECRET (32+ random characters)
# and ENCRYPTION_KEY (openssl rand -base64 32)
docker compose up -d --build
```

| Service | Address |
|---|---|
| Dashboard | http://localhost:3200 |
| Site and docs | http://localhost:3101 |
| API and MCP | http://localhost:4100 (`/api/*`, `/mcp`) |

One image runs everything: Postgres, the API with its MCP server and background worker, the dashboard and the site. Database migrations run when the API starts.

**On a cloud server with your own domain**, add HTTPS with automatic Let's Encrypt certificates:

1. Point your domain, `app.` and `api.` at the server.
2. Set `OPENSEO_DOMAIN`, `APP_URL`, `WEB_URL`, `PUBLIC_API_URL` and `POSTGRES_PASSWORD` in `.env`.
3. Run `docker compose --profile https up -d --build`.

The [self-hosting guide](https://openseo.gg/docs/self-hosting) covers servers, updates, backups and every setting.

## 🤖 Connect your AI agent

The [SEO MCP server](https://openseo.gg/features/seo-mcp-server) gives agents the whole workspace as 76 tools, listed with their prices in [MCP tools](https://openseo.gg/docs/mcp-tools).

**ChatGPT and Claude (web and desktop):** add a custom connector with the URL `{API_URL}/mcp` and OAuth sign-in. You sign in with your OpenSEO account and approve; no key needed. Connected apps can be revoked in Settings.

For other agents, create an API key under Settings and store it in an environment variable named `OPENSEO_API_KEY`.

**The quick way:** copy the setup prompt from Settings and paste it into your agent. The agent connects itself and checks the connection with free calls only.

**Claude Code:** install the plugin, which bundles the connection and the skills:

```bash
/plugin install openseo --marketplace duckduckdeploy/openseo
```

Set `OPENSEO_MCP_URL` to point it at a self-hosted install.

**Any other MCP client:** add `{API_URL}/mcp` with the header `Authorization: Bearer <key>`. The [MCP guide](https://openseo.gg/docs/mcp) has the exact config for:

- Claude Code and Claude Desktop
- Cursor
- VS Code
- Codex
- Gemini CLI
- OpenCode
- Windsurf

### 🧩 Skills

Ready-made SEO workflows in [`plugins/openseo/skills`](plugins/openseo/skills), built on the 76 MCP tools:

| Skill | What it does |
|---|---|
| [`seo-coach`](plugins/openseo/skills/seo-coach/SKILL.md) | Learn SEO on your own site, and pick the first thing worth doing |
| [`seo-audit`](plugins/openseo/skills/seo-audit/SKILL.md) | Any domain's rankings, links and competitors, as a short plan |
| [`site-audit`](plugins/openseo/skills/site-audit/SKILL.md) | Crawl your site: the one or two technical fixes that matter most |
| [`keyword-research`](plugins/openseo/skills/keyword-research/SKILL.md) | Topics worth writing about, grouped and saved |
| [`competitor-analysis`](plugins/openseo/skills/competitor-analysis/SKILL.md) | Their strategy, the keyword gap, and where you can win |
| [`search-console-review`](plugins/openseo/skills/search-console-review/SKILL.md) | Quick wins from your own Google data, free |
| [`local-seo`](plugins/openseo/skills/local-seo/SKILL.md) | Your Maps profile, reviews and rankings street by street |

Every skill prices paid steps with `dry_run` first and passes the limit you agree as `max_cost_usd`. In Claude Code, `/seo-audit example.com` audits any domain in one call (the `seo_audit` tool, about $0.50 to $0.65) and turns it into a short plan. Or just ask, for example "which of my pages are stuck on page two?". The same features are available over the [REST API](https://openseo.gg/docs/rest-api).

## 🔎 Search data

The crawler, site audit and Google data are free. Keyword volumes, rankings, backlinks and other search data come from [YepAPI](https://yepapi.com?ref=openseo). You add your own key when you set up your account, and each lookup is billed to it at the price the app shows first: a page-one rank check costs $0.01, and 150 keyword ideas cost about $0.08.

## 🛠️ Development

Requirements: Node 26+, pnpm 10, Postgres 15+ (or `docker compose up -d postgres`).

```bash
pnpm install
pnpm db:migrate
pnpm dev                 # API :4100, dashboard :3200, site :3101, with live reload
pnpm typecheck
pnpm test
```

The tests need no database, network or API keys. `apps/api/test` runs the real API against an in-memory Postgres (PGlite) with the real migrations, plus stand-ins for the data provider (`apps/api/src/testing/fake-yepapi.ts`) and Google (`apps/api/src/testing/fake-google.ts`). For local work without a data key, run the stand-in with `pnpm --filter @openseo/api fake-yepapi` and set `YEPAPI_BASE_URL=http://localhost:4199`.

```
apps/api          Fastify API, MCP server, background worker (pg-boss)
apps/app          Dashboard (Next.js)
apps/web          Public site and docs (Next.js)
packages/yepapi   Typed data client with price estimates
packages/crawler  Site-audit crawler
packages/shared   Model catalog and shared helpers
```

User documentation and tutorials live on the site under `/docs` (`apps/web/src/app/docs`).

## 🔐 Security

- Stored data keys and Google tokens are encrypted at rest with AES-256-GCM (`ENCRYPTION_KEY`) and never returned by the API.
- API keys are stored as SHA-256 hashes and shown once.
- OAuth for MCP clients:
  - dynamic client registration and PKCE (S256)
  - exact redirect URIs
  - single-use codes
  - access tokens that last one hour
  - rotating refresh tokens; a reused one ends the grant
  - tokens stored as hashes
- Paid lookups are not retried after a server error or a lost connection, since they may already have been billed.
- The crawler refuses private, loopback and metadata addresses, including through redirects.
- In Docker, the app, site and API listen only on the machine itself. The optional Caddy service is the only thing facing the internet.

## 🤝 Contributing

Clear [issues](https://github.com/duckduckdeploy/openseo/issues) are the most useful contribution: what you did, what you expected and what happened. For code, run `pnpm typecheck` and `pnpm test` before opening a pull request.

## 📄 Licence

[MIT](LICENSE). Use it, change it, host it.

<p align="center"><sub>Made in the open · <a href="https://openseo.gg">openseo.gg</a> · <a href="https://github.com/duckduckdeploy/openseo">⭐ Star on GitHub</a></sub></p>
