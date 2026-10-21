"use client";

import { SeoAudit } from "@/components/research/pages/seo-audit";
import { ProjectPage } from "@/components/research/project-page";

export default function SeoAuditPage() {
  return <ProjectPage>{(project) => <SeoAudit project={project} />}</ProjectPage>;
}
