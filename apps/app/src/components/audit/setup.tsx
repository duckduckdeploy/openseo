"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ConfirmDialog, SCHEDULES, type Schedule, Segmented, StatusBadge } from "@/components/tracking/kit";
import { Button, Card, CardHeader, CostNote, ErrorNote, Field, Input, Select, Table, Textarea } from "@/components/ui";
import { api, dateTime, num, usd } from "@/lib/api";
import type { AuditRow, AuditSettings, RenderMode } from "./types";

export const PROJECT_MAX_PAGES = 10_000;
export const TOOL_MAX_PAGES = 500;
const MAX_RENDERED = 500;

export type AuditForm = {
  startUrl: string;
  maxPages: string;
  renderMode: RenderMode;
  useFallback: boolean;
  maxCostUsd: string;
  exclude: string;
  include: string;
  checkExternalLinks: boolean;
  schedule: Schedule;
};

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function formFrom(settings: AuditSettings | null, domain: string | null): AuditForm {
  return {
    startUrl: settings?.startUrl ?? domain ?? "",
    maxPages: String(settings?.maxPages ?? 500),
    renderMode: settings?.renderMode ?? "auto",
    useFallback: settings?.useFallback ?? true,
    // New setups start with a $1 cap; saved settings keep theirs, including no cap.
    maxCostUsd: settings ? (settings.maxCostUsd == null ? "" : String(settings.maxCostUsd)) : "1",
    exclude: (settings?.exclude ?? []).join("\n"),
    include: (settings?.include ?? []).join("\n"),
    checkExternalLinks: settings?.checkExternalLinks ?? true,
    schedule: settings?.schedule ?? "weekly",
  };
}

/** The request body for a run or for saved settings. */
export function bodyOf(form: AuditForm) {
  return {
    startUrl: form.startUrl.trim(),
    maxPages: Number(form.maxPages),
    renderMode: form.renderMode,
    useFallback: form.useFallback,
    maxCostUsd: form.maxCostUsd.trim() === "" ? null : Number(form.maxCostUsd),
    exclude: lines(form.exclude),
    include: lines(form.include),
    checkExternalLinks: form.checkExternalLinks,
  };
}

const paid = (form: AuditForm) => form.renderMode !== "off" || form.useFallback;

/**
 * What to crawl and how. `estimatePath` answers a dry run with the price ceiling; paid help is
 * shown with its cap before anything starts.
 */
export function AuditFields({
  form,
  setForm,
  maxPages,
  estimatePath,
  schedule,
  paidOptions = true,
}: {
  form: AuditForm;
  setForm: (f: AuditForm) => void;
  maxPages: number;
  estimatePath: string;
  schedule?: boolean;
  /** The one-off tool shows no prices, so it offers the free crawl only. */
  paidOptions?: boolean;
}) {
  const set = <K extends keyof AuditForm>(key: K, value: AuditForm[K]) => setForm({ ...form, [key]: value });
  const pages = Number(form.maxPages);
  const limit = form.renderMode === "always" ? Math.min(MAX_RENDERED, maxPages) : maxPages;
  const pagesValid = Number.isInteger(pages) && pages >= 1 && pages <= limit;
  const cap = form.maxCostUsd.trim() === "" ? null : Number(form.maxCostUsd);
  const capValid = cap === null || (Number.isFinite(cap) && cap >= 0 && cap <= 1000);

  const [settled, setSettled] = useState(bodyOf(form));
  useEffect(() => {
    const id = setTimeout(() => setSettled(bodyOf(form)), 300);
    return () => clearTimeout(id);
  }, [form]);
  const estimate = useQuery({
    queryKey: ["audit-estimate", estimatePath, settled.maxPages, settled.renderMode, settled.useFallback, settled.maxCostUsd],
    queryFn: () =>
      api<{ estimate: { min: number; max: number } }>(estimatePath, { method: "POST", query: { dryRun: 1 }, body: { ...settled, startUrl: "example.com" } }).then((r) => r.estimate),
    enabled: paid(form) && pagesValid && capValid,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
      <Field label="Start URL" hint="The crawl follows internal links and sitemaps from here.">
        <Input value={form.startUrl} onChange={(e) => set("startUrl", e.target.value)} required minLength={3} maxLength={2000} placeholder="https://acme.com" />
      </Field>
      <Field label="Max pages" hint={`1 to ${num(limit)}.`}>
        <Input type="number" inputMode="numeric" min={1} max={limit} step={1} value={form.maxPages} onChange={(e) => set("maxPages", e.target.value)} required />
      </Field>
      {!pagesValid && form.maxPages !== "" && <p className="text-xs text-neg sm:col-span-2">{form.renderMode === "always" ? `Audits that render every page are limited to ${MAX_RENDERED} pages.` : `Choose between 1 and ${num(maxPages)} pages.`}</p>}

      {paidOptions && (
        <div className="space-y-2 sm:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted">JavaScript rendering</p>
          <Segmented
            label="JavaScript rendering"
            value={form.renderMode}
            onChange={(value) => set("renderMode", value)}
            options={[
              { id: "off", label: "Off" },
              { id: "auto", label: "Where needed" },
              { id: "always", label: "Every page" },
            ]}
          />
          <p className="text-xs text-muted">
            {form.renderMode === "off"
              ? "Pages are read as their HTML arrives, the way most AI crawlers read them."
              : form.renderMode === "auto"
                ? "Pages whose HTML is an empty app shell are rendered in a browser through YepAPI, at $0.02 each. Everything else stays free."
                : `Every page is rendered through YepAPI at $0.02 each, up to ${MAX_RENDERED} pages.`}
          </p>
        </div>
      )}
      {paidOptions && (
        <div className="sm:col-span-2">
          <Check checked={form.useFallback} onChange={(value) => set("useFallback", value)}>
            <span className="font-medium">Get past blocks</span>
            <span className="block text-xs text-muted">When the site's firewall or bot protection refuses the crawler, fetch that page through YepAPI's residential proxies at $0.03 each. Status codes still come from the direct request.</span>
          </Check>
        </div>
      )}
      {paidOptions && paid(form) && (
        <Field label="Spending cap (USD)" hint="Rendering and unblocking stop here; the crawl itself carries on. Leave empty for no cap.">
          <Input type="number" inputMode="decimal" min={0} max={1000} step={0.5} value={form.maxCostUsd} onChange={(e) => set("maxCostUsd", e.target.value)} placeholder="No cap" className="max-w-40" />
        </Field>
      )}

      <details className="sm:col-span-2">
        <summary className="cursor-pointer text-[13px] font-medium">More options</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Skip URLs matching" hint="One pattern per line; * matches anything. E.g. /cart* or /search?*">
            <Textarea rows={3} value={form.exclude} onChange={(e) => set("exclude", e.target.value)} placeholder="/cart*" />
          </Field>
          <Field label="Only crawl URLs matching" hint="Leave empty to crawl the whole site.">
            <Textarea rows={3} value={form.include} onChange={(e) => set("include", e.target.value)} placeholder="/blog/*" />
          </Field>
          <div className="sm:col-span-2">
            <Check checked={form.checkExternalLinks} onChange={(value) => set("checkExternalLinks", value)}>
              <span className="font-medium">Check external links</span>
              <span className="block text-xs text-muted">Find links to other sites that are broken (up to 300 checked). Free.</span>
            </Check>
          </div>
        </div>
      </details>

      {schedule && (
        <Field label="Run automatically" hint="Each run is compared with the one before, so new and fixed issues show up.">
          <Select value={form.schedule} onChange={(e) => set("schedule", e.target.value as Schedule)} className="max-w-48">
            {SCHEDULES.map((s) => (
              <option key={s} value={s}>
                {s === "manual" ? "Only when I start it" : s[0]?.toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {paidOptions && (
        <div className="sm:col-span-2">
          {paid(form) ? (
            estimate.data ? (
              <CostNote min={0} max={estimate.data.max} note="at most per audit, only for pages that need it, from your YepAPI balance" />
            ) : (
              <span className="font-mono text-xs text-muted">Getting the price…</span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              <span className="rounded-sm bg-sunken px-1.5 py-0.5 text-ink">Free</span> no YepAPI credits used
            </span>
          )}
          <ErrorNote error={estimate.error} />
        </div>
      )}
    </div>
  );
}

export function formValid(form: AuditForm, maxPages: number) {
  const pages = Number(form.maxPages);
  const limit = form.renderMode === "always" ? Math.min(MAX_RENDERED, maxPages) : maxPages;
  const cap = form.maxCostUsd.trim() === "" ? null : Number(form.maxCostUsd);
  return form.startUrl.trim().length >= 3 && Number.isInteger(pages) && pages >= 1 && pages <= limit && (cap === null || (Number.isFinite(cap) && cap >= 0));
}

/** Starts an audit with the given settings; paid help is confirmed with its ceiling first. */
export function StartAudit({
  path,
  form,
  maxPages,
  onStarted,
  onCancel,
  title = "New crawl",
  paidOptions = true,
}: {
  path: string;
  form: AuditForm;
  maxPages: number;
  onStarted: (audit: AuditRow) => void;
  onCancel?: () => void;
  title?: string;
  paidOptions?: boolean;
}) {
  const [current, setCurrent] = useState(form);
  const [confirming, setConfirming] = useState(false);
  const start = useMutation({ mutationFn: () => api<AuditRow & { estimate: { max: number } }>(path, { method: "POST", body: bodyOf(current) }), onSuccess: onStarted });
  const ready = formValid(current, maxPages);
  return (
    <Card className="mb-6">
      <CardHeader
        title={title}
        description={
          paidOptions
            ? "OpenSEO crawls the site itself, politely and following robots.txt. The crawl is free; YepAPI is used only for rendering and blocked pages, if you allow it."
            : "OpenSEO crawls the site itself, politely and following robots.txt."
        }
      />
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          if (paid(current)) setConfirming(true);
          else start.mutate();
        }}
      >
        <AuditFields form={current} setForm={setCurrent} maxPages={maxPages} estimatePath={path} paidOptions={paidOptions} />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" loading={start.isPending && !confirming} disabled={!ready}>
            Start crawl
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        {!confirming && <ErrorNote error={start.error} />}
      </form>
      <ConfirmDialog open={confirming} onClose={() => setConfirming(false)} onConfirm={() => start.mutate()} title="Start the crawl?" confirmLabel="Start crawl" pending={start.isPending} error={start.error}>
        <p>
          The crawl is free. Rendering and unblocking are paid from your YepAPI balance for the pages that need them
          {current.maxCostUsd.trim() !== "" ? (
            <>
              , and stop at <span className="font-mono text-ink tabular">{usd(Number(current.maxCostUsd))}</span>
            </>
          ) : (
            ", with no cap"
          )}
          .
        </p>
      </ConfirmDialog>
    </Card>
  );
}

/** Saved settings: what scheduled runs crawl, and how often. */
export function SettingsCard({ projectId, settings, domain }: { projectId: string; settings: AuditSettings | null; domain: string | null }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => formFrom(settings, domain));
  const save = useMutation({
    mutationFn: () => api<AuditSettings>(`/projects/${projectId}/audit-settings`, { method: "PUT", body: { ...bodyOf(form), startUrl: form.startUrl.trim() || null, schedule: form.schedule } }),
    onSuccess: (saved) => queryClient.setQueryData(["audit-settings", projectId], saved),
  });
  return (
    <Card>
      <CardHeader
        title="Settings and schedule"
        description={
          settings?.schedule && settings.schedule !== "manual" && settings.nextRunAt ? `Next automatic audit: ${dateTime(settings.nextRunAt)}.` : "Audits run only when you start them until a schedule is set."
        }
      />
      <form
        className="space-y-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (formValid(form, PROJECT_MAX_PAGES)) save.mutate();
        }}
      >
        <AuditFields form={form} setForm={setForm} maxPages={PROJECT_MAX_PAGES} estimatePath={`/projects/${projectId}/audits`} schedule />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" loading={save.isPending} disabled={!formValid(form, PROJECT_MAX_PAGES)}>
            Save settings
          </Button>
          {save.isSuccess && !save.isPending && <span className="text-xs text-pos">Saved.</span>}
        </div>
        <ErrorNote error={save.error} />
      </form>
    </Card>
  );
}

export function HistoryTable({ audits, hrefOf, currentId }: { audits: AuditRow[]; hrefOf: (id: string) => string; currentId?: string }) {
  return (
    <Card>
      <CardHeader title="Crawl history" description="Each finished audit is compared with the one before it." />
      <Table className="relative">
        <thead>
          <tr>
            <th scope="col">Started</th>
            <th scope="col">Status</th>
            <th scope="col">How</th>
            <th scope="col" className="text-right">
              Pages
            </th>
            <th scope="col" className="text-right">
              Health
            </th>
            <th scope="col" className="text-right">
              AI score
            </th>
            <th scope="col" className="text-right">
              Errors
            </th>
            <th scope="col" className="text-right">
              Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.id} className={audit.id === currentId ? "bg-accent-soft/50" : undefined}>
              <td className="whitespace-nowrap">
                <Link href={hrefOf(audit.id)} className="underline decoration-line underline-offset-2 hover:decoration-ink">
                  {dateTime(audit.createdAt)}
                </Link>
                {audit.error && <p className="text-xs text-neg">{audit.error}</p>}
              </td>
              <td>
                <StatusBadge status={audit.status} />
              </td>
              <td className="text-xs text-muted">{audit.trigger === "schedule" ? "Scheduled" : audit.trigger === "api" ? "API" : "Manual"}</td>
              <td className="text-right font-mono whitespace-nowrap tabular">
                {num(audit.pagesCrawled)} <span className="text-faint">/ {num(audit.maxPages)}</span>
              </td>
              <td className="text-right font-mono tabular">{audit.healthScore ?? <span className="text-faint">—</span>}</td>
              <td className="text-right font-mono tabular">{audit.aiScore ?? <span className="text-faint">—</span>}</td>
              <td className="text-right font-mono tabular">{audit.summary?.urlsWithErrors != null ? num(audit.summary.urlsWithErrors) : <span className="text-faint">—</span>}</td>
              <td className="text-right font-mono tabular">{audit.costUsd > 0 ? usd(audit.costUsd) : "Free"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
