import { useMemo } from "react";

import { useApp } from "../context/AppContext";
import type { FuelType } from "../types/fuel";
import type { TDict } from "../i18n";
import { convertEur, getCurrencyForCountry } from "../utils/currency";
import { getFuelPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { getTrendSeries, getWeeklyDeltaEur } from "./useTrends";

export const FUEL_ORDER: FuelType[] = ["diesel", "gasoline95", "lpg"];

/** Dataset older than this (days) is labelled as "no newer publication". */
const STALE_AFTER_DAYS = 2;
const FLAT_EPSILON = 0.0005;

export type Freshness =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "fresh"; asOf: string; stale: boolean }
  | { kind: "offline"; asOf: string; savedAt: string | null; checking: boolean };

export type Tone = "good" | "bad" | "neutral";

export function formatShortDate(iso: string | null | undefined, t: TDict, withTime = false) {
  if (!iso) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  // A bare dataset date must not shift a day through the local timezone.
  const d = dateOnly ? new Date(`${iso}T12:00:00`) : new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso;
  const day = `${d.getDate()} ${t.monthsShort[d.getMonth()]}`;
  if (!withTime) return day;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${hh}:${mm}`;
}

/** Signed amount in the display currency, e.g. "+€0.011" or "−2 L". */
export function formatSignedAmount(eur: number, mode: "eur" | "local", currency: string, rates: Record<string, number> | null) {
  const sign = eur > 0 ? "+" : eur < 0 ? "−" : "";
  return `${sign}${formatAmount(Math.abs(eur), mode, currency, rates)}`;
}

/** EUR keeps the dataset's three decimals; local currencies use their own precision. */
export function formatAmount(eur: number | null, mode: "eur" | "local", currency: string, rates: Record<string, number> | null) {
  if (eur == null || !Number.isFinite(eur)) return "—";
  if (mode === "eur") return `€${eur.toFixed(3)}`;
  const local = convertEur(eur, currency, rates);
  if (local == null) return `€${eur.toFixed(3)}`;
  // Precision follows the currency, not the value, so one board never mixes "196" and "69.56".
  // High-denomination currencies (lek, forint, dinar…) drop cents; small moves keep one decimal.
  const rate = rates?.[currency] ?? 1;
  const digits = rate >= 20 ? (Math.abs(local) < 10 ? 1 : 0) : 2;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(local);
  } catch {
    return `${local.toFixed(digits)} ${currency}`;
  }
}

export function toneOf(deltaEur: number | null, lowerIsGood = true): Tone {
  if (deltaEur == null || Math.abs(deltaEur) < FLAT_EPSILON) return "neutral";
  return (deltaEur < 0) === lowerIsGood ? "good" : "bad";
}

/**
 * Everything the Home screen derives from app state, computed once per data /
 * fuel / country change so the render path only formats.
 */
export function useHomeMarket() {
  const ctx = useApp();
  const { data, fuelType, country, selected, prevSelected, trends, fxRates, t, favorites } = ctx;
  const currency = useMemo(() => getCurrencyForCountry(country), [country]);
  const mode = ctx.effectiveCurrencyMode;
  const localRequestedButMissing = ctx.currencyMode === "local" && currency !== "EUR" && !ctx.canLocal;

  const europe = useMemo(() => {
    const rows = (data?.countries ?? [])
      .filter((c) => isEuropeanCountry(c.country))
      .map((c) => ({ country: c.country, price: getFuelPrice(c, fuelType) }))
      .filter((r): r is { country: string; price: number } => typeof r.price === "number" && Number.isFinite(r.price))
      .sort((a, b) => a.price - b.price);
    const total = rows.length;
    const average = total ? rows.reduce((sum, r) => sum + r.price, 0) / total : null;
    return { rows, total, average };
  }, [data, fuelType]);

  const prices = useMemo(() => {
    const out = {} as Record<FuelType, number | null>;
    for (const fuel of FUEL_ORDER) {
      const v = getFuelPrice(selected, fuel);
      out[fuel] = typeof v === "number" && Number.isFinite(v) ? v : null;
    }
    return out;
  }, [selected]);

  const current = prices[fuelType];

  const signal = useMemo(() => {
    const inEurope = isEuropeanCountry(country);
    const rank =
      current != null && europe.total && inEurope ? europe.rows.filter((r) => r.price < current).length + 1 : null;
    const diffEur = current != null && europe.average != null ? current - europe.average : null;

    // Real 7-day change from trend history; falls back to the previous cached
    // fetch when trends are unavailable (same semantics as before the redesign).
    const weekly = getWeeklyDeltaEur(trends, country, fuelType);
    const previous = getFuelPrice(prevSelected, fuelType);
    const deltaEur = weekly ?? (current != null && previous != null ? current - previous : null);

    return { rank, diffEur, deltaEur, inEurope };
  }, [country, current, europe, trends, fuelType, prevSelected]);

  const series = useMemo(() => {
    const raw = getTrendSeries(trends, country, fuelType);
    if (!raw || !trends) return null;
    const points = raw
      .map((v, i) => ({ v, date: trends.dates[i] }))
      .filter((p): p is { v: number; date: string } => typeof p.v === "number" && Number.isFinite(p.v));
    if (points.length < 2) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const p of points) {
      if (p.v < min) min = p.v;
      if (p.v > max) max = p.v;
    }
    return { points, min, max, days: trends.dates.length };
  }, [trends, country, fuelType]);

  const saved = useMemo(() => {
    const byCountry = new Map((data?.countries ?? []).map((c) => [c.country, c]));
    return favorites
      .filter((c) => byCountry.has(c))
      .map((c) => {
        const price = getFuelPrice(byCountry.get(c), fuelType);
        return {
          country: c,
          price: typeof price === "number" && Number.isFinite(price) ? price : null,
          deltaEur: getWeeklyDeltaEur(trends, c, fuelType),
        };
      });
  }, [data, favorites, fuelType, trends]);

  const freshness: Freshness = useMemo(() => {
    if (!data) return ctx.loading ? { kind: "loading" } : { kind: "none" };
    if (ctx.isFromCache) {
      return {
        kind: "offline",
        asOf: formatShortDate(data.as_of, t),
        savedAt: ctx.cacheSavedAtUtc ? formatShortDate(ctx.cacheSavedAtUtc, t, true) : null,
        checking: ctx.loading || ctx.refreshing,
      };
    }
    const asOfMs = new Date(`${data.as_of}T12:00:00`).getTime();
    const ageDays = Number.isFinite(asOfMs) ? (Date.now() - asOfMs) / 86400000 : 0;
    return { kind: "fresh", asOf: formatShortDate(data.as_of, t), stale: ageDays > STALE_AFTER_DAYS };
  }, [data, ctx.loading, ctx.refreshing, ctx.isFromCache, ctx.cacheSavedAtUtc, t]);

  const fmt = (eur: number | null) => formatAmount(eur, mode, currency, fxRates);
  const fmtSigned = (eur: number) => formatSignedAmount(eur, mode, currency, fxRates);

  return {
    currency,
    mode,
    localRequestedButMissing,
    europe,
    prices,
    current,
    signal,
    series,
    saved,
    freshness,
    refreshFailed: !!ctx.error && !!data,
    fmt,
    fmtSigned,
  };
}
