"use client";

import { SeoAudit } from "@/components/research/pages/seo-audit";
import { ToolsPage } from "@/components/research/tools-page";

export default function SeoAuditTool() {
  return <ToolsPage>{(project) => <SeoAudit project={project} />}</ToolsPage>;
}
