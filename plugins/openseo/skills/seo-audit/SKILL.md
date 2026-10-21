---
name: seo-audit
description: Audit any domain from search data in one call (traffic, rankings, keywords, backlinks, competitors) and turn it into a short action plan of the opportunities worth acting on first. Use when asked to audit, evaluate or review a website or domain, yours or anyone's, or to find its SEO opportunities. For crawling the user's own pages for technical issues, use the site-audit skill.
---

# SEO audit

The goal is a short plan, not a data dump: the three to five moves most likely to bring this domain more search traffic, each with the numbers behind it.

## Money rules (every OpenSEO skill)

- `seo_audit` costs about $0.49 to $0.65 per domain. A repeat within a day is free.
- Before running it, call it with `dry_run: true` and say the price. Pass the agreed limit as `max_cost_usd`.
- End with what the paid calls cost in total.

## Steps

1. **Pick the domain and market.**
   - If the user names a domain, use it. Otherwise use the project's domain from `list_projects` and `get_project`; read the context for goals and known competitors.
   - Rankings are per country. Use the project's market, or pass `locationCode` from `search_locations` when the user means another country.
2. **Run the audit.** Call `seo_audit` with the domain.
   - If the user or the project context names competitors, pass up to three as `competitors`; otherwise the closest organic competitors are used, leaving out platforms like YouTube and Reddit.
   - If `errors` lists parts that failed, say which, and carry on with the rest.
3. **Read it in this order.**
   - `findings`: already sorted, high severity first, each with its number.
   - `summary`: Domain Rating, traffic, keywords, top-10 count, referring domains and ranking movement.
   - `opportunities.strikingDistance`: keywords at positions 4 to 20 and the ranking URL. Group them by URL: one page improved can move several keywords.
   - `opportunities.keywordGap`: the competitor's keywords the domain lacks, already kept to its topic and to difficulty 60 or less. Keep the ones that fit the business.
   - `opportunities.backlinkGap`: sites linking to competitors but not to the domain. Those linking to both competitors are the best prospects.
4. **Check what you're unsure of** (optional, priced first). For one page that matters, `onpage_check` ($0.03) or `lighthouse` ($0.05). For a keyword you'd recommend, `serp` shows who ranks today.
5. **Report.**
   - One line on where the domain stands: traffic, authority and whether rankings are growing or slipping.
   - **The top three to five moves**, most valuable first. For each: what to do, on which page or keyword, and the number that makes it worth it.
   - Plain words; explain any SEO term in one line.
   - If the domain is the user's own, suggest a Site audit (`site-audit` skill) for technical issues, which this audit does not check.
6. **Remember.** If the domain belongs to a project, add the audit date and the top moves to the project context with `update_project_context`.
