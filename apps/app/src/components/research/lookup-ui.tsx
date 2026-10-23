"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check as CheckIcon, Download, RefreshCw, Star } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Button, ErrorNote, Select } from "@/components/ui";
import { api, dateTime, num } from "@/lib/api";
import { useProjects } from "@/lib/hooks";
import { downloadCsv, type LookupQuery } from "@/lib/lookup";
import { isToolsScope } from "@/lib/scope";
import type { KeywordToSave } from "./types";

/**
 * When a whole view was fetched, with one refresh for all its lookups. A view is
 * one search: its lookups run together and are refreshed together. `refresh` narrows what
 * Refresh pays for, when some lookups follow from others: metrics keyed by a SERP's URLs are
 * left out, as the fresh SERP gives them their new input and they load from there.
 */
export function ViewMeta({ lookups, refresh = lookups, label }: { lookups: LookupQuery<unknown>[]; refresh?: LookupQuery<unknown>[]; label?: ReactNode }) {
  const done = lookups.filter((lookup) => lookup.result);
  if (!done.length) return null;
  const fetched = done.map((lookup) => lookup.result?.fetchedAt ?? "").sort().at(-1);
  const refreshing = refresh.some((lookup) => lookup.refreshing);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <p className="min-w-0 text-[13px] text-muted">
        {label && <>{label} · </>}
        fetched {dateTime(fetched)}
      </p>
      <Button size="sm" variant="ghost" loading={refreshing} onClick={() => void Promise.all(refresh.map((lookup) => lookup.refresh()))}>
        {!refreshing && <RefreshCw className="size-3.5" aria-hidden />} Refresh
      </Button>
    </div>
  );
}

/** The errors of a view's lookups, each once. */
export function ViewErrors({ lookups }: { lookups: LookupQuery<unknown>[] }) {
  const errors = lookups.map((lookup) => lookup.error).filter(Boolean);
  if (!errors.length) return null;
  return (
    <div className="mb-6 space-y-2">
      {errors.map((error, index) => (
        <ErrorNote key={index} error={error} />
      ))}
    </div>
  );
}

/** Shown where results will appear: nothing is fetched until the user runs the lookup. */
export function RunPrompt({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p>
    </div>
  );
}

export function ExportButton({ filename, rows, label = "Export CSV" }: { filename: string; rows: () => Record<string, unknown>[]; label?: string }) {
  return (
    <Button size="sm" onClick={() => downloadCsv(filename, rows())}>
      <Download className="size-3.5" aria-hidden /> {label}
    </Button>
  );
}

export function useSaveKeywords(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ keywords, tags = [], locationCode }: { keywords: KeywordToSave[]; tags?: string[]; locationCode?: number }) => {
      let saved = 0;
      // The API accepts up to 1,000 keywords per request.
      for (let start = 0; start < keywords.length; start += 1000) {
        const response = await api<{ saved: number }>(`/projects/${projectId}/saved-keywords`, {
          method: "POST",
          body: { keywords: keywords.slice(start, start + 1000), tags, locationCode },
        });
        saved += response.saved;
      }
      return { saved };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-keywords", projectId] }),
  });
}

/**
 * "Save selected" for any keyword table. Saving is free; it stores the metrics already on screen.
 * In the standalone tools it saves to a project the user picks, with the market the data came from.
 */
export function SaveSelected(props: Parameters<typeof SaveToProject>[0]) {
  return isToolsScope(props.projectId) ? <SaveFromTools {...props} /> : <SaveToProject {...props} />;
}

function SaveFromTools({ projectId: scopeId, locationCode, ...rest }: Parameters<typeof SaveToProject>[0]) {
  const projects = useProjects();
  const [target, setTarget] = useState("");
  const list = projects.data ?? [];
  const chosen = target || list[0]?.id || "";
  if (projects.isPending) return null;
  if (!list.length) {
    return (
      <Link href="/projects" className="text-[13px] font-medium text-ink underline underline-offset-2">
        Create a project to save keywords
      </Link>
    );
  }
  // The scope id carries the market these metrics are for.
  const marketCode = locationCode ?? Number(scopeId.split(":")[1]);
  return (
    <>
      <div className="w-44">
        <Select value={chosen} onChange={(event) => setTarget(event.target.value)} aria-label="Project to save to" className="h-8 text-[13px]">
          {list.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </div>
      <SaveToProject {...rest} projectId={chosen} locationCode={Number.isFinite(marketCode) ? marketCode : undefined} />
    </>
  );
}

function SaveToProject({
  projectId,
  keywords,
  count,
  locationCode,
  onSaved,
}: {
  projectId: string;
  /** Called on click, so the list is only built when needed. */
  keywords: () => KeywordToSave[];
  count: number;
  locationCode?: number;
  onSaved?: () => void;
}) {
  const save = useSaveKeywords(projectId);
  return (
    <>
      <Button
        size="sm"
        variant={count > 0 ? "primary" : "secondary"}
        disabled={count === 0}
        loading={save.isPending}
        onClick={() => save.mutate({ keywords: keywords(), locationCode }, { onSuccess: onSaved })}
      >
        {!save.isPending && <Star className="size-3.5" aria-hidden />}
        {count > 0 ? `Save ${num(count)} selected` : "Save selected"}
      </Button>
      <span role="status" className="text-[13px]">
        {save.isSuccess && (
          <span className="inline-flex items-center gap-1 text-pos">
            <CheckIcon className="size-3.5" aria-hidden />
            Saved {num(save.data.saved)}.{" "}
            <Link href={`/p/${projectId}/saved`} className="font-medium text-ink underline underline-offset-2">
              View saved keywords
            </Link>
          </span>
        )}
      </span>
      {save.error && (
        <div className="w-full">
          <ErrorNote error={save.error} />
        </div>
      )}
    </>
  );
}
