"use client";

import { AlertTriangle, Download, Info, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cx } from "@/components/ui";
import { dateOnly, num } from "@/lib/api";
import { SEVERITY_LABEL, type Severity } from "./types";

const severityIcon = { critical: OctagonAlert, warning: AlertTriangle, info: Info } as const;
const severityText = { critical: "text-neg", warning: "text-warn", info: "text-muted" } as const;

/** Severity as an icon plus its name, so the meaning never rests on colour alone. */
export function SeverityIcon({ severity, label = false }: { severity: Severity; label?: boolean }) {
  const Icon = severityIcon[severity];
  return (
    <span className={cx("inline-flex items-center gap-1.5", severityText[severity])}>
      <Icon className="size-4 shrink-0" aria-hidden={label} aria-label={label ? undefined : SEVERITY_LABEL[severity]} />
      {label && <span className="font-mono text-[11px] uppercase tracking-wide">{SEVERITY_LABEL[severity]}</span>}
    </span>
  );
}

export function StatusCode({ status }: { status: number | null | undefined }) {
  if (status == null) return <span className="text-faint">—</span>;
  if (status === 0) return <span className="text-neg">no response</span>;
  return <span className={cx("font-mono tabular", status >= 400 ? "text-neg" : status >= 300 ? "text-warn" : "text-ink")}>{status}</span>;
}

/** A signed change, worse-is-red only when `worseWhenUp` says more is bad. */
export function Delta({ value, worseWhenUp = true }: { value: number | null | undefined; worseWhenUp?: boolean }) {
  if (value == null || value === 0) return <span className="font-mono text-faint tabular">0</span>;
  const worse = worseWhenUp ? value > 0 : value < 0;
  return (
    <span className={cx("font-mono tabular", worse ? "text-neg" : "text-pos")}>
      {value > 0 ? "▲" : "▼"} {num(Math.abs(value))}
    </span>
  );
}

export type BarItem = { label: ReactNode; value: number; hint?: string; href?: string };

/**
 * Labelled horizontal bars in one colour: the label carries the meaning, the bar the size. Used for
 * every distribution on the overview, so a reader learns the form once.
 */
export function BarList({ items, total, caption }: { items: BarItem[]; total?: number; caption: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const sum = total ?? items.reduce((a, i) => a + i.value, 0);
  return (
    <ul className="space-y-1.5" aria-label={caption}>
      {items.map((item, index) => {
        const share = sum > 0 ? Math.round((100 * item.value) / sum) : 0;
        return (
          <li key={index} className="group grid grid-cols-[minmax(7rem,10rem)_1fr_auto] items-center gap-3 text-[13px]" title={item.hint ?? `${num(item.value)} (${share}%)`}>
            <span className="truncate text-muted group-hover:text-ink">{item.label}</span>
            <span className="h-2 rounded-sm bg-sunken">
              <span className="block h-2 rounded-sm bg-accent" style={{ width: `${item.value > 0 ? Math.max(2, (100 * item.value) / max) : 0}%` }} />
            </span>
            <span className="min-w-16 text-right font-mono text-xs tabular">
              {num(item.value)} <span className="text-faint">{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** One share of a whole as a single meter, e.g. URLs with errors. */
export function Meter({ value, total, label, tone = "neg" }: { value: number; total: number; label: string; tone?: "neg" | "accent" }) {
  const share = total > 0 ? (100 * value) / total : 0;
  return (
    <div>
      <div className="h-2.5 rounded-sm bg-sunken" role="img" aria-label={`${label}: ${num(value)} of ${num(total)}`}>
        <div className={cx("h-2.5 rounded-sm", tone === "neg" ? "bg-neg" : "bg-accent")} style={{ width: `${value > 0 ? Math.max(1, share) : 0}%` }} />
      </div>
      <p className="mt-1.5 flex justify-between font-mono text-[11px] text-muted tabular">
        <span>
          {label}: <span className="text-ink">{num(value)}</span> ({Math.round(share)}%)
        </span>
        <span>of {num(total)}</span>
      </p>
    </div>
  );
}

type HistoryPoint = { id: string; date: string; score: number | null };

/** Health score per audit, oldest first, single series. */
export function ScoreHistory({ points, label }: { points: HistoryPoint[]; label: string }) {
  if (points.length < 2) return <p className="text-xs text-muted">The trend appears after the next audit.</p>;
  const data = points.map((p) => ({ ...p, day: dateOnly(p.date) }));
  const summary = data.map((p) => `${p.day}: ${p.score ?? "—"}`).join(", ");
  return (
    <div className="h-20 w-full" role="img" aria-label={`${label} by audit, oldest first. ${summary}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap={2}>
          <XAxis dataKey="day" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            cursor={{ fill: "var(--color-sunken)" }}
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="rounded-md border border-line bg-surface px-2.5 py-1.5 font-mono text-xs shadow-pop tabular">
                  <span className="text-muted">{String((payload[0].payload as { day: string }).day)}</span> · {String(payload[0].value ?? "—")}
                </div>
              ) : null
            }
          />
          <Bar dataKey="score" name={label} fill="var(--color-accent)" radius={[2, 2, 0, 0]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** URLs with one issue across audits, oldest first: a tiny line for a table row. */
export function TrendStrip({ values, label }: { values: number[]; label: string }) {
  if (values.length < 2) return <span className="text-faint">—</span>;
  const width = 64;
  const height = 18;
  const max = Math.max(1, ...values);
  const x = (i: number) => 2 + (i / (values.length - 1)) * (width - 4);
  const y = (v: number) => height - 2 - (v / max) * (height - 4);
  const text = `${label}, last ${values.length} audits, oldest first: ${values.join(", ")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text} className="block">
      <title>{text}</title>
      <polyline points={values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")} fill="none" strokeWidth="1.5" className="stroke-accent" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1] ?? 0)} r={2} className="fill-accent" />
    </svg>
  );
}

/** A file download from the API (same origin, so the session cookie goes along). */
export function DownloadLink({ href, children, variant = "button" }: { href: string; children: ReactNode; variant?: "button" | "link" }) {
  return (
    <a
      href={`/api${href}`}
      download
      className={
        variant === "button"
          ? "inline-flex h-8 items-center gap-1.5 rounded-md border border-edge bg-surface px-2.5 text-[13px] font-medium text-ink hover:border-faint"
          : "inline-flex items-center gap-1 text-[13px] text-accent-text underline decoration-accent-line underline-offset-2 hover:decoration-accent-text"
      }
    >
      <Download className="size-3.5" aria-hidden /> {children}
    </a>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-lg border border-line bg-surface p-4", className)}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[15px] font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
