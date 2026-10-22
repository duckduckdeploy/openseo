---
name: site-audit
description: Find the one or two technical fixes most likely to bring more search traffic, from a free crawl of the user's own site plus Search Console when connected. Use when asked for a technical or site audit, to crawl a site, or to find broken pages, redirects, missing tags or slow pages. For a domain's rankings, backlinks, competitors and opportunities, use the seo-audit skill.
---

# Site audit

The goal is not a list of everything wrong. It's the one or two changes most likely to bring more traffic, with the evidence.

## Money rules (every OpenSEO skill)

- The crawl and Search Console are free. Paid steps here are optional: `lighthouse` costs $0.05 a run, JavaScript rendering costs $0.02 a page, and fetching pages the site blocks costs $0.03 a page.
- Before a paid lookup, call it with `dry_run: true` and say the price. Pass the agreed limit as `max_cost_usd`.
- End with what the paid calls cost in total.

## Steps

1. **Pick the project.** Use `list_projects` and `get_project`; read the context for goals and key pages.
2. **Crawl.** If `list_site_audits` shows a finished audit less than a week old, use it. Otherwise:
   - start one with `start_site_audit` (free, plain HTML; 100 to 500 pages is enough to judge)
   - poll `get_site_audit` until it's completed

   If the pages are empty without JavaScript, use `render_mode: "auto"`, which renders only the pages that need it. If the site blocks the crawler (many "Page blocked the crawler" issues), use `use_fallback: true`. Both are paid: agree a cap first and pass it as `max_cost_usd`, which the audit will not exceed.
3. **Read the issues.**
   - From `get_site_audit`, take the health score and the issue groups, critical first. Each group says what changed since the previous audit (new, removed).
   - Use `get_audit_issues` with a `type` to see the affected URLs for the groups that matter, and `get_audit_links` to see which pages link to broken or redirecting URLs.
   - If the user wants the issues fixed in their code, call `get_audit_fix_brief`: it orders the work, groups URLs by template and names the most-linked culprits (a broken link on every page is in the footer).
4. **Weigh by traffic.**
   - If Search Console is connected (`get_google_connections`), call `get_search_opportunities` and `get_search_performance`.
   - A critical issue on a page with impressions matters more than one on a page nobody sees.
5. **Check speed only where it counts.** For the one or two most important pages, offer a `lighthouse` run at $0.05 each. Its failed audits come rated critical, warning or info.
6. **Report.**
   - The health score in one line.
   - The **top one or two fixes**: what, which pages, why it matters, how to fix it.
   - Then a short "also worth doing" list, at most five items.
   - Plain words; no jargon without a one-line explanation.
7. **Remember.** Add the audit date and the top fixes to the project context with `update_project_context`.
