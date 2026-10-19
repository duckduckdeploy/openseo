"use client";

import { useSearchParams } from "next/navigation";
import { AuthorityChecker, TrafficChecker } from "@/components/research/pages/site-compare";
import { ProjectPage } from "@/components/research/project-page";
import { useToolNav } from "@/components/research/search-bar";
import { Tabs } from "@/components/research/tabs";
import { oneOf } from "@/components/research/util";
import { PageHeader } from "@/components/ui";
import type { Project } from "@/lib/hooks";

const TABS = ["traffic", "authority"] as const;

/** Traffic and authority of the project's site next to its competitors: one list, two views. */
function Compare({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const tab = oneOf(params.get("tab"), TABS, "traffic");
  return (
    <>
      <PageHeader title="Traffic and authority" description="Your site next to its competitors: estimated search traffic, and the authority of their backlink profiles. Both use the same list." />
      <Tabs
        label="Compare websites"
        active={tab}
        onChange={(next) => nav({ tab: next === "traffic" ? null : next }, { replace: true })}
        items={[
          { key: "traffic", label: "Search traffic", content: <TrafficChecker project={project} embedded /> },
          { key: "authority", label: "Authority", content: <AuthorityChecker project={project} embedded /> },
        ]}
      />
    </>
  );
}

export default function ComparePage() {
  return <ProjectPage>{(project) => <Compare project={project} />}</ProjectPage>;
}
