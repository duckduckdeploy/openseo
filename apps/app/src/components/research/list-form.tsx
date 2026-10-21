"use client";

import type { ReactNode } from "react";
import { MarketFields, useUrlText } from "@/components/research/search-bar";
import { splitLines } from "@/components/research/util";
import { Button, Textarea } from "@/components/ui";
import { num } from "@/lib/api";
import type { Market } from "@/lib/scope";

/** Lists travel in the URL; very long ones are cut there to what a URL can carry. */
const MAX_URL_CHARS = 6000;

export function listParam(entries: string[]) {
  const joined = entries.join("\n");
  return joined.length <= MAX_URL_CHARS ? joined : joined.slice(0, MAX_URL_CHARS).replace(/\n[^\n]*$/, "");
}

/**
 * The search box of the bulk tools: a list, one entry per line (or comma separated), then the
 * market and the button. Submitting puts the list in the URL; the page runs from there.
 */
export function ListForm({
  value,
  onSubmit,
  label,
  placeholder,
  max,
  clean = (entry) => entry,
  market,
  onMarket,
  button,
  pending,
  actions,
  children,
}: {
  /** The list in the URL, one per line; the field follows it. */
  value: string;
  onSubmit: (entries: string[]) => void;
  label: string;
  placeholder: string;
  max: number;
  /** Normalises one entry (e.g. a URL to its domain). */
  clean?: (entry: string) => string;
  market?: Market;
  onMarket?: (market: Market) => void;
  button: string;
  pending?: boolean;
  /** Buttons next to the submit, e.g. "Use my saved keywords". They receive the setter. */
  actions?: (setText: (text: string) => void) => ReactNode;
  /** Notes on the line under the form. */
  children?: ReactNode;
}) {
  const [text, setText] = useUrlText(value);
  const entries = [...new Set(splitLines(text, { commas: true }).map(clean).filter(Boolean))];
  const over = entries.length > max;
  return (
    <form
      className="mb-8 space-y-3 rounded-xl border border-line bg-surface p-3 shadow-card sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (entries.length) onSubmit(entries.slice(0, max));
      }}
    >
      <Textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} placeholder={placeholder} aria-label={label} autoFocus={!value} autoCapitalize="none" spellCheck={false} className="font-mono text-[13px]" />
      <div className="flex flex-wrap items-center gap-2">
        {market && onMarket && <MarketFields market={market} onChange={onMarket} />}
        <Button type="submit" variant="primary" loading={pending} disabled={!entries.length} className="h-11 w-full px-5 sm:w-auto">
          {button}
        </Button>
        {actions?.(setText)}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        <span className={over ? "text-xs text-neg" : "text-xs text-muted"}>
          One per line or comma separated, up to {num(max)}. {num(entries.length)} entered{over ? `; the first ${num(max)} will be checked` : ""}.
        </span>
        {children && <span className="sm:ml-auto">{children}</span>}
      </div>
    </form>
  );
}
