"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ProjectAudit } from "@/components/audit/project";
import { Spinner } from "@/components/ui";

function Latest() {
  const { projectId } = useParams<{ projectId: string }>();
  return <ProjectAudit projectId={projectId} auditId={null} />;
}

export default function AuditPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Latest />
    </Suspense>
  );
}
