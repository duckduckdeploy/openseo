"use client";

import { TrafficChecker } from "@/components/research/pages/site-compare";
import { ToolsPage } from "@/components/research/tools-page";

export default function WebsiteTrafficCheckerTool() {
  return <ToolsPage>{(project) => <TrafficChecker project={project} />}</ToolsPage>;
}
