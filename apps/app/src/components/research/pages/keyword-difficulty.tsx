"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { type Column, DataTable } from "@/components/research/data-table";
import { listParam, ListForm } from "@/components/research/list-form";
import { ExportButton, RunPrompt, SaveSelected, ViewErrors, ViewMeta } from "@/components/research/lookup-ui";
import { DifficultyPill } from "@/components/research/pills";
import { useChangeMarket, useMarket, useToolNav } from "@/components/research/search-bar";
import { Skeleton } from "@/components/research/serp-overview";
import { KeywordLink } from "@/components/research/tool-link";
import type { SavedKeywordsList } from "@/components/research/types";
import { csvDate, finite, splitLines, toSave } from "@/components/research/util";
import { Button, Card, cx, ErrorNote, PageHeader } from "@/components/ui";
import { api, num } from "@/lib/api";
import type { Project } from "@/lib/hooks";
import { type LookupQuery, useLookupQuery } from "@/lib/lookup";
import { isToolsScope, type Market, marketName } from "@/lib/scope";

const MAX = 1000;

type Row = { keyword: string; difficulty: number | null };
type Data = { keywords?: Row[] | null };
type Input = { keywords: string[]; country: string; language: string };

/** The same bands as the difficulty pill: under 30 easy, under 60 medium, else hard. */
const BANDS = [
  { key: "easy", label: "Easy", note: "0–29", test: (d: number) => d < 30, tone: "bg-pos" },
  { key: "medium", label: "Medium", note: "30–59", test: (d: number) => d >= 30 && d < 60, tone: "bg-warn" },
  { key: "hard", label: "Hard", note: "60–100", test: (d: number) => d >= 60, tone: "bg-neg" },
] as const;
type Band = (typeof BANDS)[number]["key"] | "all";

const inputFor = (keywords: string[], market: Market): Input | null => (keywords.length ? { keywords, country: market.country, language: market.language } : null);

/**
 * Keyword difficulty for up to 1,000 keywords at once, grouped into easy, medium and hard, so a
 * long list can be sorted into what is winnable now and what needs more authority first.
 * The URL is the view: ?keywords=&country=&lang=.
 */
export function KeywordDifficultyChecker({ project }: { project: Project }) {
  const params = useSearchParams();
  const nav = useToolNav();
  const changeMarket = useChangeMarket();
  const market = useMarket(project);
  const raw = params.get("keywords") ?? "";
  const keywords = useMemo(() => splitLines(raw).slice(0, MAX), [raw]);
  const input = useMemo(() => inputFor(keywords, market), [keywords, market]);
  const lookup = useLookupQuery<Data, Input>(project.id, "keyword_difficulty", input);
  const lookups = [lookup] as LookupQuery<unknown>[];
  const saved = useMutation({ mutationFn: () => api<SavedKeywordsList>(`/projects/${project.id}/saved-keywords`, { query: { limit: MAX, sort: "volume", order: "desc" } }) });

  return (
    <>
      <PageHeader title="Keyword difficulty checker" description="Check the difficulty of up to 1,000 keywords at once, from 0 (easy) to 100 (hard), and see which you can rank for now." />
      <ListForm
        value={keywords.join("\n")}
        onSubmit={(entries) => nav({ keywords: listParam(entries) })}
        label="Keywords, one per line"
        placeholder={"keyword difficulty checker\nhow to check keyword difficulty"}
        max={MAX}
        clean={(entry) => entry.toLowerCase()}
        market={market}
        onMarket={changeMarket}
        button="Check difficulty"
        pending={lookup.loading}
        actions={(setText) =>
          !isToolsScope(project.id) && (
            <Button type="button" className="h-11" loading={saved.isPending} onClick={() => saved.mutate(undefined, { onSuccess: (list) => setText(list.keywords.map((row) => row.keyword).join("\n")) })}>
              Use my saved keywords
            </Button>
          )
        }
      >
      </ListForm>
      <ErrorNote error={saved.error} />
      <ViewErrors lookups={lookups} />

      {!keywords.length ? (
        <Card>
          <RunPrompt title="Paste your keyword list">Difficulty estimates how hard it is to reach Google&apos;s top 10, from the links the current top pages have.</RunPrompt>
        </Card>
      ) : lookup.loading ? (
        <Card>
          <div className="space-y-2.5 p-4" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      ) : lookup.data ? (
        <Results project={project} rows={lookup.data.keywords ?? []} market={market} lookups={lookups} />
      ) : null}
    </>
  );
}


function Results({ project, rows, market, lookups }: { project: Project; rows: Row[]; market: Market; lookups: LookupQuery<unknown>[] }) {
  const [band, setBand] = useState<Band>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const known = rows.filter((row) => finite(row.difficulty));
  const counts = BANDS.map((b) => ({ ...b, count: known.filter((row) => b.test(row.difficulty as number)).length }));
  const average = known.length ? Math.round(known.reduce((sum, row) => sum + (row.difficulty as number), 0) / known.length) : null;
  const shown = band === "all" ? rows : rows.filter((row) => finite(row.difficulty) && BANDS.find((b) => b.key === band)?.test(row.difficulty));

  const columns: Column<Row>[] = [
    { key: "keyword", header: "Keyword", rowHeader: true, sortValue: (row) => row.keyword, render: (row) => <KeywordLink keyword={row.keyword} market={market} /> },
    { key: "difficulty", header: "Difficulty", title: "Keyword difficulty, 0 (easy) to 100 (hard)", align: "right", firstOrder: "asc", sortValue: (row) => row.difficulty, render: (row) => <DifficultyPill value={row.difficulty} /> },
  ];

  return (
    <div className="space-y-6">
      <ViewMeta lookups={lookups} label={`${num(rows.length)} keywords · ${marketName(market)}`} />
      <Card className="p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Average difficulty</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl font-bold tabular">
              {average ?? "—"} <DifficultyPill value={average} />
            </p>
          </div>
          <p className="text-xs text-muted">{known.length < rows.length ? `${num(rows.length - known.length)} without data (too few searches to score).` : ""}</p>
        </div>
        {/* One bar split by band, with the counts as text beside it. */}
        <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-sunken" aria-hidden>
          {counts.map((b) => (b.count ? <span key={b.key} className={cx("h-full", b.tone)} style={{ width: `${(b.count / Math.max(known.length, 1)) * 100}%` }} /> : null))}
        </div>
        <div role="radiogroup" aria-label="Show keywords by difficulty" className="mt-4 flex flex-wrap gap-2">
          {[{ key: "all" as const, label: "All", note: "", count: rows.length }, ...counts].map((b) => (
            <button
              key={b.key}
              type="button"
              role="radio"
              aria-checked={band === b.key}
              onClick={() => setBand(b.key)}
              className={cx("rounded-md border px-3 py-1.5 text-left text-[13px] transition-colors", band === b.key ? "border-accent-line bg-accent-soft text-accent-text" : "border-line hover:border-faint")}
            >
              <span className="font-medium">{b.label}</span>
              {b.note && <span className="ml-1 opacity-70">{b.note}</span>}
              <span className="ml-2 font-mono text-xs tabular">{num(b.count)}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
          <p className="text-xs text-muted">Select keywords to save them to a project; open one for its volume and who ranks.</p>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <SaveSelected projectId={project.id} count={selected.size} locationCode={market.locationCode} keywords={() => rows.filter((row) => selected.has(row.keyword)).map((row) => toSave(row))} onSaved={() => setSelected(new Set())} />
            <ExportButton filename={`keyword-difficulty-${market.country}-${csvDate()}.csv`} rows={() => rows.map((row) => ({ keyword: row.keyword, difficulty: row.difficulty ?? "" }))} />
          </div>
        </div>
        <DataTable rows={shown} columns={columns} rowKey={(row) => row.keyword} caption="Keyword difficulty" initialSort={{ key: "difficulty", order: "asc" }} selection={{ selected, onChange: setSelected, label: (row) => row.keyword }} empty="No keywords in this band." />
      </Card>
    </div>
  );
}
