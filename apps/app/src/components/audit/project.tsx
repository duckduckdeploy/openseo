"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { EmptyState, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { useProject } from "@/lib/hooks";
import { LighthouseCard } from "./lighthouse";
import { formFrom, PROJECT_MAX_PAGES, SettingsCard, StartAudit } from "./setup";
import type { AuditRow, AuditSettings } from "./types";
import { AuditView } from "./view";

const historyPath = (projectId: string) => `/projects/${projectId}/audits`;

function useAuditSettings(projectId: string) {
  return useQuery({ queryKey: ["audit-settings", projectId], queryFn: () => api<AuditSettings | null>(`/projects/${projectId}/audit-settings`) });
}

/** One project audit, or the latest when `auditId` is null; the setup screen when there is none. */
export function ProjectAudit({ projectId, auditId }: { projectId: string; auditId: string | null }) {
  const router = useRouter();
  const project = useProject(projectId);
  const settings = useAuditSettings(projectId);
  const audits = useQuery({ queryKey: ["audits", historyPath(projectId)], queryFn: () => api<AuditRow[]>(historyPath(projectId)), enabled: auditId === null });
  const hrefOf = (id: string) => (id ? `/p/${projectId}/audit/${id}` : `/p/${projectId}/audit`);

  if (project.isPending || settings.isPending || (auditId === null && audits.isPending)) return <Spinner />;
  const error = project.error ?? settings.error ?? audits.error;
  if (error || !project.data) return <ErrorNote error={error} />;
  const domain = project.data.domain;
  const form = formFrom(settings.data ?? null, domain);
  const settingsCard = <SettingsCard key={settings.dataUpdatedAt} projectId={projectId} settings={settings.data ?? null} domain={domain} />;
  const id = auditId ?? audits.data?.[0]?.id ?? null;

  if (!id) {
    return (
      <>
        <PageHeader
          title="Site audit"
          description="Crawl your site for 100+ technical SEO issues, from status codes and redirects to canonicals, hreflang and AI crawler access. Schedule it, and every run is compared with the last."
        />
        <StartAudit
          title="Run your first audit"
          path={historyPath(projectId)}
          form={form}
          maxPages={PROJECT_MAX_PAGES}
          onStarted={(audit) => router.push(hrefOf(audit.id))}
        />
        <div className="mb-6">{settingsCard}</div>
        <EmptyState title="No audits yet">The crawl is free. YepAPI is used only for rendering JavaScript and for pages the site blocks, if you allow it, up to the cap you set.</EmptyState>
        <LighthouseCard projectId={projectId} domain={domain} />
      </>
    );
  }

  return (
    <AuditView
      auditId={id}
      historyPath={historyPath(projectId)}
      hrefOf={hrefOf}
      newCrawl={{ path: historyPath(projectId), form, maxPages: PROJECT_MAX_PAGES }}
      historyExtra={settingsCard}
      extraTab={{ label: "Lighthouse", content: <LighthouseCard projectId={projectId} domain={domain} /> }}
    />
  );
}
