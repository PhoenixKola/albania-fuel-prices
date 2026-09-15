import type { RoadRoute, RoadStatus } from "../models/road";
import type { Lang } from "../models/i18n";

export const ROAD_FRESH_DAYS = 1;
export const ROAD_STALE_AFTER_DAYS = 3;

export type RoadFreshness = {
  ageDays: number | null;
  label: string;
  state: "fresh" | "recent" | "stale" | "unknown";
};

function utcDateValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function roadFreshness(checkedAt: string | null, now = new Date()): RoadFreshness {
  if (!checkedAt) return { ageDays: null, label: "Unknown", state: "unknown" };
  const checked = utcDateValue(checkedAt);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (checked === null) return { ageDays: null, label: "Unknown", state: "unknown" };
  const ageDays = Math.max(0, Math.floor((today - checked) / 86_400_000));
  if (ageDays === 0) return { ageDays, label: "Checked today", state: "fresh" };
  if (ageDays === 1) return { ageDays, label: "Checked yesterday", state: "fresh" };
  if (ageDays <= ROAD_STALE_AFTER_DAYS) return { ageDays, label: `Checked ${ageDays} days ago`, state: "recent" };
  return { ageDays, label: `Stale · checked ${ageDays} days ago`, state: "stale" };
}

export function roadFreshnessLabel(freshness: RoadFreshness, lang: Lang): string {
  if (lang === "en") return freshness.label;
  if (freshness.ageDays === null) return "E panjohur";
  if (freshness.ageDays === 0) return "Kontrolluar sot";
  if (freshness.ageDays === 1) return "Kontrolluar dje";
  if (freshness.state === "stale") return `E vjetruar · kontrolluar ${freshness.ageDays} ditë më parë`;
  return `Kontrolluar ${freshness.ageDays} ditë më parë`;
}

export function formatRoadTimestamp(value: string, lang: Lang = "en") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "sq" ? "sq-AL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Tirane",
    timeZoneName: "short",
  }).format(date);
}

export function formatRoadMetricTimestamp(value: string, lang: Lang = "en") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: "" };
  return {
    date: new Intl.DateTimeFormat(lang === "sq" ? "sq-AL" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Tirane" }).format(date),
    time: new Intl.DateTimeFormat(lang === "sq" ? "sq-AL" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Tirane", timeZoneName: "short" }).format(date),
  };
}

export function countRouteStatuses(route: RoadRoute) {
  return route.routeSections.reduce<Record<RoadStatus, number>>(
    (counts, section) => ({ ...counts, [section.status]: counts[section.status] + 1 }),
    { OPEN: 0, CAUTION: 0, RESTRICTED: 0, CLOSED: 0, UNKNOWN: 0 }
  );
}

export function statusTone(status: RoadStatus) {
  return status.toLowerCase();
}

export function routeShareText(route: RoadRoute, url: string) {
  return `${route.title}: ${route.overallStatus}. ${route.statusExplanation} Last checked ${formatRoadTimestamp(route.lastCheckedAt)}. ${url}`;
}
