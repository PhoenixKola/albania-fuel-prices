/**
 * Original fuel price analysis computed from our own daily history.
 *
 * This module is the site's information gain: the upstream source publishes
 * a snapshot of today's prices and nothing else. We have recorded that
 * snapshot every day since February 2026, which lets us compute things that
 * exist nowhere else — price ranges, percentile position, volatility,
 * streaks, records, and cross-border spread history.
 *
 * Pure functions over data/history.json. No network, no dependencies.
 * Every helper degrades to null rather than throwing: a data glitch must
 * never break the daily build.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");

export type FuelKey = "gasoline95" | "diesel" | "lpg";

const FIELD: Record<FuelKey, string> = {
  gasoline95: "gasoline95_eur",
  diesel: "diesel_eur",
  lpg: "lpg_eur",
};

export const FUEL_LABEL: Record<FuelKey, string> = {
  gasoline95: "Petrol (Gasoline 95)",
  diesel: "Diesel",
  lpg: "LPG (Autogas)",
};

export const FUEL_SHORT: Record<FuelKey, string> = {
  gasoline95: "petrol",
  diesel: "diesel",
  lpg: "LPG",
};

type HistoryEntry = {
  as_of: string;
  countries: { country: string; [k: string]: unknown }[];
};

export type Point = { date: string; value: number };

export type FuelStats = {
  fuel: FuelKey;
  /** Daily observations, gaps removed, chronological. */
  points: Point[];
  current: number;
  first: number;
  min: number;
  max: number;
  minDate: string;
  maxDate: string;
  average: number;
  /** 0 = cheapest day observed, 100 = most expensive. */
  percentile: number;
  changePct: { d7: number | null; d30: number | null; d90: number | null; all: number };
  /** Standard deviation of daily % moves — how jumpy this market is. */
  volatilityPct: number;
  /** Consecutive days moving the same direction, ending today. */
  streak: { direction: "up" | "down" | "flat"; days: number };
  daysObserved: number;
};

export type CountryStats = {
  country: string;
  fuels: Partial<Record<FuelKey, FuelStats>>;
};

export type HistoryContext = {
  ok: boolean;
  /** First and last date in the record. */
  startDate: string;
  endDate: string;
  startLabel: string;
  endLabel: string;
  daysObserved: number;
  byCountry: Map<string, CountryStats>;
};

// ─── Loading ────────────────────────────────────────────────────────────────

export function loadHistory(): HistoryContext {
  const empty: HistoryContext = {
    ok: false,
    startDate: "",
    endDate: "",
    startLabel: "",
    endLabel: "",
    daysObserved: 0,
    byCountry: new Map(),
  };

  let series: HistoryEntry[];
  try {
    const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "history.json"), "utf-8"));
    series = raw?.series;
    if (!Array.isArray(series) || series.length < 30) {
      console.warn("⚠ historyStats: history.json too short for analysis — skipping.");
      return empty;
    }
  } catch (err) {
    console.warn("⚠ historyStats: could not read data/history.json — skipping analysis.", err);
    return empty;
  }

  const sorted = [...series].sort((a, b) => a.as_of.localeCompare(b.as_of));
  const names = new Set<string>();
  for (const entry of sorted) {
    for (const c of entry.countries ?? []) names.add(c.country);
  }

  const byCountry = new Map<string, CountryStats>();
  for (const name of names) {
    const fuels: Partial<Record<FuelKey, FuelStats>> = {};
    for (const fuel of Object.keys(FIELD) as FuelKey[]) {
      const points: Point[] = [];
      for (const entry of sorted) {
        const row = entry.countries?.find((c) => c.country === name);
        const v = row?.[FIELD[fuel]];
        if (typeof v === "number" && Number.isFinite(v) && v > 0) {
          points.push({ date: entry.as_of, value: v });
        }
      }
      // Need a meaningful window before claiming anything statistical.
      if (points.length >= 30) {
        const s = computeFuelStats(fuel, points);
        if (s) fuels[fuel] = s;
      }
    }
    if (Object.keys(fuels).length) byCountry.set(name, { country: name, fuels });
  }

  return {
    ok: byCountry.size > 0,
    startDate: sorted[0].as_of,
    endDate: sorted[sorted.length - 1].as_of,
    startLabel: formatDate(sorted[0].as_of),
    endLabel: formatDate(sorted[sorted.length - 1].as_of),
    daysObserved: sorted.length,
    byCountry,
  };
}

// ─── Statistics ─────────────────────────────────────────────────────────────

function computeFuelStats(fuel: FuelKey, points: Point[]): FuelStats | null {
  if (points.length < 2) return null;

  const values = points.map((p) => p.value);
  const current = values[values.length - 1];
  const first = values[0];

  let min = values[0];
  let max = values[0];
  let minDate = points[0].date;
  let maxDate = points[0].date;
  for (const p of points) {
    if (p.value < min) { min = p.value; minDate = p.date; }
    if (p.value > max) { max = p.value; maxDate = p.date; }
  }

  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // Share of observed days that were cheaper than today.
  const cheaper = values.filter((v) => v < current).length;
  const percentile = Math.round((cheaper / values.length) * 100);

  const back = (days: number): number | null => {
    const idx = values.length - 1 - days;
    if (idx < 0) return null;
    const past = values[idx];
    return past > 0 ? ((current - past) / past) * 100 : null;
  };

  // Daily percentage moves → standard deviation = volatility.
  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    if (prev > 0) returns.push(((values[i] - prev) / prev) * 100);
  }
  const rMean = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const variance =
    returns.reduce((acc, r) => acc + (r - rMean) ** 2, 0) / (returns.length || 1);
  const volatilityPct = Math.sqrt(variance);

  return {
    fuel,
    points,
    current,
    first,
    min,
    max,
    minDate,
    maxDate,
    average,
    percentile,
    changePct: { d7: back(7), d30: back(30), d90: back(90), all: ((current - first) / first) * 100 },
    volatilityPct,
    streak: computeStreak(values),
    daysObserved: points.length,
  };
}

/** Consecutive same-direction moves ending on the latest observation. */
function computeStreak(values: number[]): { direction: "up" | "down" | "flat"; days: number } {
  if (values.length < 2) return { direction: "flat", days: 0 };

  const dir = (a: number, b: number): "up" | "down" | "flat" => {
    const diff = b - a;
    if (Math.abs(diff) < 0.0005) return "flat";
    return diff > 0 ? "up" : "down";
  };

  const last = dir(values[values.length - 2], values[values.length - 1]);
  let days = 1;
  for (let i = values.length - 2; i > 0; i--) {
    if (dir(values[i - 1], values[i]) === last) days++;
    else break;
  }
  return { direction: last, days };
}

// ─── Cross-country views ────────────────────────────────────────────────────

export type RankedCountry = { country: string; value: number };

/** Today's ranking for a fuel, cheapest first, over the given countries. */
export function rankToday(
  ctx: HistoryContext,
  fuel: FuelKey,
  include: (name: string) => boolean
): RankedCountry[] {
  const out: RankedCountry[] = [];
  for (const [name, cs] of ctx.byCountry) {
    if (!include(name)) continue;
    const s = cs.fuels[fuel];
    if (s) out.push({ country: name, value: s.current });
  }
  return out.sort((a, b) => a.value - b.value);
}

/** Biggest 30-day movers, most negative (falling) first when dir="down". */
export function biggestMovers(
  ctx: HistoryContext,
  fuel: FuelKey,
  include: (name: string) => boolean,
  dir: "up" | "down",
  limit = 5
): { country: string; changePct: number }[] {
  const rows: { country: string; changePct: number }[] = [];
  for (const [name, cs] of ctx.byCountry) {
    if (!include(name)) continue;
    const c = cs.fuels[fuel]?.changePct.d30;
    if (typeof c === "number") rows.push({ country: name, changePct: c });
  }
  rows.sort((a, b) => (dir === "up" ? b.changePct - a.changePct : a.changePct - b.changePct));
  return rows.filter((r) => (dir === "up" ? r.changePct > 0 : r.changePct < 0)).slice(0, limit);
}

/** Most/least volatile markets over the observed window. */
export function byVolatility(
  ctx: HistoryContext,
  fuel: FuelKey,
  include: (name: string) => boolean
): { country: string; volatilityPct: number }[] {
  const rows: { country: string; volatilityPct: number }[] = [];
  for (const [name, cs] of ctx.byCountry) {
    if (!include(name)) continue;
    const s = cs.fuels[fuel];
    if (s) rows.push({ country: name, volatilityPct: s.volatilityPct });
  }
  return rows.sort((a, b) => b.volatilityPct - a.volatilityPct);
}

/** Average price across the included countries for each observed day. */
export function regionAverageSeries(
  ctx: HistoryContext,
  fuel: FuelKey,
  include: (name: string) => boolean
): Point[] {
  const sums = new Map<string, { total: number; n: number }>();
  for (const [name, cs] of ctx.byCountry) {
    if (!include(name)) continue;
    const s = cs.fuels[fuel];
    if (!s) continue;
    for (const p of s.points) {
      const cur = sums.get(p.date) ?? { total: 0, n: 0 };
      cur.total += p.value;
      cur.n += 1;
      sums.set(p.date, cur);
    }
  }
  return [...sums.entries()]
    .map(([date, v]) => ({ date, value: v.total / v.n }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** History of one country's spread against another (positive = A dearer). */
export function spreadSeries(
  ctx: HistoryContext,
  fuel: FuelKey,
  countryA: string,
  countryB: string
): Point[] {
  const a = ctx.byCountry.get(countryA)?.fuels[fuel];
  const b = ctx.byCountry.get(countryB)?.fuels[fuel];
  if (!a || !b) return [];
  const bMap = new Map(b.points.map((p) => [p.date, p.value]));
  return a.points
    .filter((p) => bMap.has(p.date))
    .map((p) => ({ date: p.date, value: p.value - bMap.get(p.date)! }));
}

// ─── Interpretation helpers ─────────────────────────────────────────────────

/**
 * Plain-language verdict on where today's price sits in the observed range.
 * This is the site's most practically useful original output: "is now a good
 * time to fill up, relative to everything we have recorded?"
 */
export function fillUpVerdict(s: FuelStats): { label: string; detail: string } {
  const p = s.percentile;
  if (p <= 15) {
    return {
      label: "Unusually cheap",
      detail: `Today is cheaper than ${100 - p}% of the days we have recorded. If your tank is low, this is a good time to fill it.`,
    };
  }
  if (p <= 40) {
    return {
      label: "Below average",
      detail: `Today sits in the cheaper ${p === 0 ? "end" : `${p}%`} of our recorded range — a reasonable time to refuel.`,
    };
  }
  if (p < 60) {
    return {
      label: "About average",
      detail: "Today's price is close to the middle of everything we have recorded. No strong reason to wait or rush.",
    };
  }
  if (p < 85) {
    return {
      label: "Above average",
      detail: `Today is more expensive than ${p}% of recorded days. Consider filling only what you need if you can wait.`,
    };
  }
  return {
    label: "Near record high",
    detail: `Today is more expensive than ${p}% of the days we have recorded. Unless your tank is empty, waiting may pay off.`,
  };
}

export function trendWord(changePct: number | null): string {
  if (changePct == null) return "held steady";
  if (Math.abs(changePct) < 0.3) return "barely moved";
  return changePct > 0 ? "rose" : "fell";
}

// ─── Formatting ─────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function eur(value: number): string {
  return `€${value.toFixed(2)}`;
}

export function eur3(value: number): string {
  return `€${value.toFixed(3)}`;
}

export function pct(value: number | null, digits = 1): string {
  if (value == null) return "n/a";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}
