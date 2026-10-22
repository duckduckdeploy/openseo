"use client";

import { useParams } from "next/navigation";
import { ToolAudit } from "@/components/audit/tool";
import { ToolsPage } from "@/components/research/tools-page";

function One() {
  const { auditId } = useParams<{ auditId: string }>();
  return <ToolAudit auditId={auditId} />;
}

export default function SiteAuditToolResult() {
  return <ToolsPage marketless>{() => <One />}</ToolsPage>;
}
