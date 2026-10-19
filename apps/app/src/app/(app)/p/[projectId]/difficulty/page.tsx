"use client";

import { KeywordDifficultyChecker } from "@/components/research/pages/keyword-difficulty";
import { ProjectPage } from "@/components/research/project-page";

export default function KeywordDifficultyPage() {
  return <ProjectPage>{(project) => <KeywordDifficultyChecker project={project} />}</ProjectPage>;
}
