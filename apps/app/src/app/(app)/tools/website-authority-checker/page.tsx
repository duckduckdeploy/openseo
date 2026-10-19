"use client";

import { AuthorityChecker } from "@/components/research/pages/site-compare";
import { ToolsPage } from "@/components/research/tools-page";

export default function WebsiteAuthorityCheckerTool() {
  return <ToolsPage>{(project) => <AuthorityChecker project={project} />}</ToolsPage>;
}
