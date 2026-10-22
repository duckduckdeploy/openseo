"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { formFrom, HistoryTable, StartAudit, TOOL_MAX_PAGES } from "./setup";
import type { AuditRow } from "./types";
import { AuditView } from "./view";

const HISTORY = "/tools/site-audits";
const hrefOf = (id: string) => (id ? `/tools/site-audit/${id}` : "/tools/site-audit");
// The tool shows no prices, so it runs the free crawl: no rendering, no paid unblocking.
const FORM = { ...formFrom(null, null), maxPages: "100", renderMode: "off" as const, useFallback: false };

/** The Site Audit tool: one-off audits of any site, kept per user, outside any project. */
export function ToolAudit({ auditId }: { auditId: string | null }) {
  const router = useRouter();
  const audits = useQuery({ queryKey: ["audits", HISTORY], queryFn: () => api<AuditRow[]>(HISTORY), enabled: auditId === null });
  if (auditId) return <AuditView auditId={auditId} historyPath={HISTORY} hrefOf={hrefOf} newCrawl={{ path: HISTORY, form: FORM, maxPages: TOOL_MAX_PAGES, paidOptions: false }} />;
  if (audits.isPending) return <Spinner />;
  if (audits.error) return <ErrorNote error={audits.error} />;
  return (
    <>
      <PageHeader
        title="Site audit"
        description="Crawl any website for 100+ technical SEO issues: status codes, redirect chains, broken links, canonicals, sitemaps, hreflang, structured data and AI crawler access. Export the fixes for Claude or any coding agent."
      />
      <StartAudit title="Audit a website" path={HISTORY} form={FORM} maxPages={TOOL_MAX_PAGES} paidOptions={false} onStarted={(audit) => router.push(hrefOf(audit.id))} />
      {audits.data.length > 0 && <HistoryTable audits={audits.data} hrefOf={hrefOf} />}
      <p className="mt-4 text-xs text-muted">Audit up to {TOOL_MAX_PAGES} pages here. For bigger sites, weekly audits with history, and rendering of JavaScript sites, add the site as a project.</p>
    </>
  );
}
