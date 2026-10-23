import { RANK_DEPTHS } from "@openseo/shared";
import type { RunStatus, Schedule } from "./kit";

export type Device = "desktop" | "mobile";
export const DEVICES: Device[] = ["desktop", "mobile"];

export type RankEstimate = { checks: number; min: number; max: number };

export type Tracker = {
  id: string;
  projectId: string;
  name: string;
  domain: string;
  locationCode: number | null;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  language: string;
  devices: Device[];
  depth: number;
  schedule: Schedule;
  nextRunAt: string | null;
  createdAt: string;
};

export type TrackerRow = Tracker & { keywordCount: number; lastRunAt: string | null; activeRunId: string | null; estimate: RankEstimate };

export type RankRun = {
  id: string;
  trackerId: string;
  status: RunStatus;
  trigger: "manual" | "schedule" | "api";
  total: number;
  done: number;
  failed: number;
  costUsd: number;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type TrackerDetail = Tracker & { keywordCount: number; estimate: RankEstimate; runs: RankRun[] };

export type KeywordStatus = "pending" | "error" | "not_found" | "new" | "entered" | "tracked";

export type KeywordRow = {
  id: string;
  keyword: string;
  pinned: boolean;
  tags: string[];
  position: number | null;
  previousPosition: number | null;
  change: number | null;
  status: KeywordStatus;
  url: string | null;
  checkedDepth: number | null;
  features: string[];
  ownedFeatures: string[];
  inLocalPack: boolean | null;
  error: string | null;
  best: number | null;
  history: (number | null)[];
};

export type RankResults = {
  device: Device;
  runs: { id: string; finishedAt: string | null; costUsd: number }[];
  summary: {
    keywords: number;
    ranking: number;
    averagePosition: number | null;
    top3: number;
    top10: number;
    top20: number;
    improved: number;
    declined: number;
  };
  keywords: KeywordRow[];
};

export type CompetitorRow = { domain: string; keywords: number; top3: number; averagePosition: number };

export type SerpCompetitor = { position: number; domain: string; url: string; title?: string };

export type KeywordHistory = {
  device: Device;
  points: { checkedAt: string; position: number | null; url: string | null; checkedDepth: number }[];
  latest: {
    position: number | null;
    url: string | null;
    title: string | null;
    checkedDepth: number;
    features: string[];
    ownedFeatures: string[];
    competitors: SerpCompetitor[];
    error: string | null;
    checkedAt: string;
  } | null;
};

/** The depth choices, shallowest first. SERP features count toward the depth. */
export const DEPTH_OPTIONS = RANK_DEPTHS.map((depth) => ({ depth, label: `Top ${depth}` }));
export const DEPTH_HINT = "Results read per keyword. Top 20 covers the first two pages; top 100 also records competitors and positions far down. SERP features count toward the depth.";

export const featureLabel = (feature: string) =>
  feature
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .toLowerCase();

export const whereText = (tracker: Pick<Tracker, "locationName" | "latitude" | "longitude">) =>
  tracker.latitude != null && tracker.longitude != null
    ? `${tracker.locationName.replaceAll(",", ", ")} (${tracker.latitude.toFixed(4)}, ${tracker.longitude.toFixed(4)})`
    : tracker.locationName.replaceAll(",", ", ");
