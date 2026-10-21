"use client";

import { useCallback } from "react";
import type { KeywordToSave, N, S, TrendPoint } from "./types";

type ParamValue = string | number | boolean | null | undefined;

/** Writes form state to the URL without a navigation, so a view can be shared or reloaded. */
export function useSetUrl() {
  return useCallback((patch: Record<string, ParamValue>) => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === null || value === "" || value === false) params.delete(key);
      else params.set(key, value === true ? "1" : String(value));
    }
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, []);
}

/** Parses an optional integer field; empty or invalid text means "not set". */
export function optInt(text: string | null | undefined, min = 0, max = Number.MAX_SAFE_INTEGER): number | undefined {
  if (text == null || text.trim() === "") return undefined;
  const value = Number(text);
  if (!Number.isFinite(value)) return undefined;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function oneOf<T extends string>(value: string | null | undefined, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

export const finite = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

export const fixed = (value: N, digits = 1) => (finite(value) ? value.toFixed(digits) : "—");
/** Dollar amount with cents, for CPC columns. */
export const money = (value: N) => (finite(value) ? `$${value.toFixed(2)}` : "—");
export const percent = (value: N, digits = 0) => (finite(value) ? `${value.toFixed(digits)}%` : "—");
export const text = (value: S) => (value == null || value === "" ? "—" : value);

/** "2026-01-01" or ISO → "Jan 2026"; anything unparseable is returned as is. */
export function monthLabel(value: string) {
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" });
}

export function shortDate(value: S) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

/** Path + query of a URL for dense tables; falls back to the raw string. */
export function urlPath(value: S) {
  if (!value) return "—";
  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return value;
  }
}


export function toSave(row: {
  keyword: string;
  volume?: N;
  cpc?: N;
  competition?: N;
  difficulty?: N;
  intent?: S;
  trend?: TrendPoint[] | null;
}): KeywordToSave {
  return {
    keyword: row.keyword,
    volume: finite(row.volume) ? Math.round(row.volume) : null,
    cpc: finite(row.cpc) ? row.cpc : null,
    competition: finite(row.competition) ? row.competition : null,
    difficulty: finite(row.difficulty) ? Math.round(row.difficulty) : null,
    intent: row.intent ?? null,
    // The API requires a number on every trend point; rows from YepAPI can omit one.
    trend: Array.isArray(row.trend) && row.trend.some((point) => finite(point?.volume)) ? row.trend.filter((point) => finite(point?.volume)) : null,
  };
}

/** Monthly points oldest first, whatever order they came in (YepAPI sends newest first). */
export const chronological = <T extends { month: string; volume?: number | null }>(points: (T | null | undefined)[] | null | undefined): T[] =>
  (points ?? []).filter((point): point is T => Boolean(point?.month) && finite(point?.volume)).sort((a, b) => a.month.localeCompare(b.month));

export const csvDate = () => new Date().toISOString().slice(0, 10);
export const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "export";

/** Splits pasted text (one per line, or comma separated) into unique trimmed entries. */
export function splitLines(value: string, { commas = false }: { commas?: boolean } = {}) {
  const parts = value.split(commas ? /[\n,]+/ : /\n+/).map((part) => part.trim()).filter(Boolean);
  return [...new Set(parts)];
}

/**
 * Share of searches that click an organic result at positions 1 to 100. Positions 1 to 10 follow
 * a typical desktop curve from public click-through studies. Past page one the studies thin out,
 * so the tail decays geometrically from 1% at position 11 to 0.1% at position 100. Used only to
 * estimate visits, and labelled as an estimate.
 */
const CTR = [
  0.28, 0.15, 0.11, 0.08, 0.07, 0.05, 0.04, 0.03, 0.03, 0.025,
  ...Array.from({ length: 90 }, (_, index) => 0.01 * 0.1 ** (index / 89)),
];

export const estimatedVisits = (volume: N, position: N) => {
  if (!finite(volume) || !finite(position)) return null;
  const rank = Math.round(position);
  return rank >= 1 && rank <= CTR.length ? Math.round(volume * (CTR[rank - 1] as number)) : null;
};

export type DifficultyBand = "easy" | "medium" | "hard";

/**
 * Keyword difficulty 0-100 in words (the gauge) and in three bands (pill colours, the checker's
 * groups). The bands group the words: easy is Easy and Fairly easy (under 30), medium is Medium
 * (30-49), hard is Hard and Very hard (50 and up). The score is rounded first, so the number shown
 * and its band always agree. Null when there is no score.
 */
export function difficultyLevel(value: N): { score: number; word: string; band: DifficultyBand } | null {
  if (!finite(value)) return null;
  const score = Math.min(100, Math.max(0, Math.round(value)));
  const word = score < 15 ? "Easy" : score < 30 ? "Fairly easy" : score < 50 ? "Medium" : score < 70 ? "Hard" : "Very hard";
  const band: DifficultyBand = score < 30 ? "easy" : score < 50 ? "medium" : "hard";
  return { score, word, band };
}

/** The three difficulty bands with their score ranges, as difficultyLevel draws them. */
export const DIFFICULTY_BANDS = [
  { key: "easy", label: "Easy", note: "0–29" },
  { key: "medium", label: "Medium", note: "30–49" },
  { key: "hard", label: "Hard", note: "50–100" },
] as const satisfies readonly { key: DifficultyBand; label: string; note: string }[];

const QUESTION = /^(how|what|why|when|where|which|who|whose|can|could|does|do|did|is|are|was|should|will|would)\b/i;
export const isQuestion = (keyword: string) => QUESTION.test(keyword.trim()) || keyword.trim().endsWith("?");
