"use client";

import { useState } from "react";
import { Price } from "@/components/research/lookup-ui";
import { ms, ScoreGauge, Segmented } from "@/components/tracking/kit";
import { Badge, Button, Card, CardHeader, cx, ErrorNote, Field, Input, Spinner, Table } from "@/components/ui";
import { dateTime, usd } from "@/lib/api";
import { useEstimate, useLookup } from "@/lib/lookup";
import { type Severity, sortLighthouseAudits } from "@openseo/shared";

type LighthouseAudit = { id: string; category: string; title: string; description: string; score: number; displayValue?: string; opportunity: boolean; savingsMs?: number; severity?: Severity };
type LighthouseData = {
  url: string;
  device: "mobile" | "desktop";
  performanceScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  seoScore: number | null;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  cumulativeLayoutShift: number | null;
  speedIndex: number | null;
  totalBlockingTime: number | null;
  audits?: LighthouseAudit[];
};
type LighthouseInput = { url: string; device: "mobile" | "desktop" };

const severityTone = { critical: "neg", warning: "warn", info: "neutral" } as const;

function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge tone={severityTone[severity]}>{severity}</Badge>;
}

// YepAPI documents scores as 0–1; accept 0–100 too so a change of scale cannot show "1 out of 100".
const toHundred = (score: number | null | undefined) => (score == null ? null : score <= 1 ? score * 100 : score);
const plain = (markdown: string) => markdown.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

function Vital({ label, value, text, good, fair }: { label: string; value: number | null; text: string; good: number; fair: number }) {
  const grade = value == null ? null : value <= good ? "Good" : value <= fair ? "Needs work" : "Poor";
  return (
    <div className="rounded-md border border-line px-3 py-2">
      <dt className="font-mono text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-mono text-base font-medium tabular">{value == null ? "—" : text}</span>
        {grade && <span className={cx("font-mono text-[11px] uppercase", grade === "Good" ? "text-pos" : grade === "Poor" ? "text-neg" : "text-warn")}>{grade}</span>}
      </dd>
    </div>
  );
}

export function LighthouseCard({ projectId, domain }: { projectId: string; domain: string | null }) {
  const [url, setUrl] = useState(domain ? `https://${domain.replace(/^https?:\/\//, "")}` : "");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const lookup = useLookup<LighthouseData, LighthouseInput>(projectId, "lighthouse");
  const valid = /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(url.trim());
  const input: LighthouseInput | null = valid ? { url: url.trim(), device } : null;
  const estimate = useEstimate(projectId, "lighthouse", input);
  const data = lookup.data;
  // Sorted here too, so results cached before severities were added still read the same way.
  const failed = sortLighthouseAudits(data?.audits ?? []);
  const counts = { critical: 0, warning: 0, info: 0 };
  for (const audit of failed) counts[audit.severity]++;

  return (
    <Card className="mt-6">
      <CardHeader title="Lighthouse" description="Performance, accessibility, best practices and SEO scores for one URL, with Core Web Vitals and what to fix." />
      <form
        className="flex flex-wrap items-end gap-3 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (input) lookup.run(input);
        }}
      >
        <div className="min-w-0 flex-1 basis-64">
          <Field label="URL">
            <Input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://acme.com/pricing" required />
          </Field>
        </div>
        <Segmented
          label="Device"
          value={device}
          onChange={setDevice}
          options={[
            { id: "mobile", label: "Mobile" },
            { id: "desktop", label: "Desktop" },
          ]}
        />
        <Button type="submit" variant="primary" loading={lookup.isPending} disabled={!valid || estimate.stale}>
          Run Lighthouse
        </Button>
        <div className="w-full">
          <Price estimate={estimate} active={input !== null} note="per test, from your YepAPI balance. A repeat within the hour is free." />
        </div>
      </form>
      {lookup.error && (
        <div className="px-4 pb-4">
          <ErrorNote error={lookup.error} />
        </div>
      )}
      {lookup.isPending && (
        <div className="px-4">
          <Spinner label="Running Lighthouse" />
        </div>
      )}
      {data && lookup.result && !lookup.isPending && (
        <div className="space-y-5 border-t border-line p-4">
          <p className="font-mono text-xs break-all text-muted">
            {data.url} · {data.device} · {lookup.result.cached ? "from cache, free" : `cost ${usd(lookup.result.costUsd)}`} · {dateTime(lookup.result.fetchedAt)}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ScoreGauge label="Performance" score={toHundred(data.performanceScore)} />
            <ScoreGauge label="Accessibility" score={toHundred(data.accessibilityScore)} />
            <ScoreGauge label="Best practices" score={toHundred(data.bestPracticesScore)} />
            <ScoreGauge label="SEO" score={toHundred(data.seoScore)} />
          </div>
          <dl className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            <Vital label="Largest contentful paint" value={data.largestContentfulPaint} text={ms(data.largestContentfulPaint)} good={2500} fair={4000} />
            <Vital label="Cumulative layout shift" value={data.cumulativeLayoutShift} text={data.cumulativeLayoutShift?.toFixed(3) ?? "—"} good={0.1} fair={0.25} />
            <Vital label="Total blocking time" value={data.totalBlockingTime} text={ms(data.totalBlockingTime)} good={200} fair={600} />
            <Vital label="First contentful paint" value={data.firstContentfulPaint} text={ms(data.firstContentfulPaint)} good={1800} fair={3000} />
            <Vital label="Speed index" value={data.speedIndex} text={ms(data.speedIndex)} good={3400} fair={5800} />
          </dl>
          <div>
            <h3 className="mb-1 font-display text-sm font-semibold">Failed audits ({failed.length})</h3>
            {failed.length > 0 && (
              <p className="mb-2 text-xs text-muted">
                {counts.critical} critical, {counts.warning} warnings, {counts.info} notices. Critical: saves 300 ms or more, or scores under 50. Warning: saves 100 ms or more, or scores under 90.
              </p>
            )}
            {failed.length === 0 ? (
              <p className="text-[13px] text-muted">Nothing scored under 0.9.</p>
            ) : (
              <Table className="relative rounded-md border border-line">
                <thead>
                  <tr>
                    <th scope="col">Severity</th>
                    <th scope="col">Audit</th>
                    <th scope="col">Category</th>
                    <th scope="col" className="text-right">Score</th>
                    <th scope="col" className="text-right">Est. saving</th>
                  </tr>
                </thead>
                <tbody>
                  {failed.map((audit) => (
                    <tr key={audit.id}>
                      <td>
                        <SeverityBadge severity={audit.severity} />
                      </td>
                      <td className="min-w-64">
                        <span className="font-medium">{audit.title}</span>
                        {audit.displayValue && <span className="ml-2 font-mono text-xs text-muted">{audit.displayValue}</span>}
                        <span className="block text-xs text-muted">{plain(audit.description)}</span>
                      </td>
                      <td>
                        <Badge>{audit.category}</Badge>
                      </td>
                      <td className="text-right font-mono tabular">{Math.round(toHundred(audit.score) ?? 0)}</td>
                      <td className="text-right font-mono whitespace-nowrap tabular">{audit.savingsMs ? ms(audit.savingsMs) : <span className="text-faint">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
