"use client";

import { KeywordDifficultyChecker } from "@/components/research/pages/keyword-difficulty";
import { ToolsPage } from "@/components/research/tools-page";

export default function KeywordDifficultyCheckerTool() {
  return <ToolsPage>{(project) => <KeywordDifficultyChecker project={project} />}</ToolsPage>;
}
