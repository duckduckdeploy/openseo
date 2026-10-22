"use client";

import { ToolAudit } from "@/components/audit/tool";
import { ToolsPage } from "@/components/research/tools-page";

export default function SiteAuditTool() {
  return <ToolsPage marketless>{() => <ToolAudit auditId={null} />}</ToolsPage>;
}
