"use client";

import { AiOverviewChecker } from "@/components/research/pages/ai-overview-checker";
import { ProjectPage } from "@/components/research/project-page";

export default function SerpFeaturesPage() {
  return <ProjectPage>{(project) => <AiOverviewChecker project={project} />}</ProjectPage>;
}
