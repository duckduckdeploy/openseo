"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ProjectAudit } from "@/components/audit/project";
import { Spinner } from "@/components/ui";

function One() {
  const { projectId, auditId } = useParams<{ projectId: string; auditId: string }>();
  return <ProjectAudit projectId={projectId} auditId={auditId} />;
}

export default function AuditDetailPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <One />
    </Suspense>
  );
}
