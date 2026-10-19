"use client";

import { AiOverviewChecker } from "@/components/research/pages/ai-overview-checker";
import { ToolsPage } from "@/components/research/tools-page";

export default function AiOverviewCheckerTool() {
  return <ToolsPage>{(project) => <AiOverviewChecker project={project} />}</ToolsPage>;
}
