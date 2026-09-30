import { useCallback, useMemo } from "react";

import { useApp } from "../context/AppContext";
import { getFuelPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { getFlagForCountry } from "../utils/countryFlag";
import { getWeeklyDeltaEur } from "./useTrends";
import { formatAmount, formatSignedAmount } from "./useHomeMarket";

export type RankScope = "europe" | "favorites";
export type RankOrder = "cheapest" | "expensive";

export type RankRow = {
  country: string;
  flag: string;
  eur: number;
  /** 1 = cheapest within the scope; equal prices share a rank. */
  rank: number;
  weekEur: number | null;
};

export type LadderItem = { kind: "row"; row: RankRow } | { kind: "average"; eur: number };

/** Prices are compared at the dataset's precision; differences below this count as a tie. */
const TIE = 0.0005;

function rankRows(rows: Array<Omit<RankRow, "rank">>): RankRow[] {
  const sorted = [...rows].sort((a, b) => a.eur - b.eur || a.country.localeCompare(b.country));
  let rank = 0;
  return sorted.map((r, i) => {
    if (i === 0 || r.eur - sorted[i - 1].eur >= TIE) rank = i + 1;
    return { ...r, rank };
  });
}

/** Everything Rankings shows, derived once per data / fuel / scope / order / currency change. */
export function useRankingsModel(scope: RankScope, order: RankOrder) {
  const { data, fuelType, favorites, country, trends, fxRates, effectiveCurrencyMode, currency } = useApp();

  const fmt = useCallback((eur: number | null) => formatAmount(eur, effectiveCurrencyMode, currency, fxRates), [effectiveCurrencyMode, currency, fxRates]);
  const fmtSigned = useCallback((eur: number) => formatSignedAmount(eur, effectiveCurrencyMode, currency, fxRates), [effectiveCurrencyMode, currency, fxRates]);

  const europe = useMemo(() => {
    const rows = (data?.countries ?? [])
      .filter((c) => isEuropeanCountry(c.country))
      .map((c) => ({ country: c.country, eur: getFuelPrice(c, fuelType) }))
      .filter((r): r is { country: string; eur: number } => typeof r.eur === "number" && Number.isFinite(r.eur))
      .map((r) => ({ ...r, flag: getFlagForCountry(r.country), weekEur: getWeeklyDeltaEur(trends, r.country, fuelType) }));
    return rankRows(rows);
  }, [data, fuelType, trends]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  // Favorites are re-ranked among themselves: #2 means second-cheapest favorite, not #2 in Europe.
  const rows = useMemo(
    () => (scope === "europe" ? europe : rankRows(europe.filter((r) => favoriteSet.has(r.country)).map(({ rank: _rank, ...rest }) => rest))),
    [scope, europe, favoriteSet]
  );

  const average = useMemo(() => (rows.length ? rows.reduce((sum, r) => sum + r.eur, 0) / rows.length : null), [rows]);

  const items = useMemo<LadderItem[]>(() => {
    const ordered = order === "cheapest" ? rows : [...rows].reverse();
    const out: LadderItem[] = ordered.map((row) => ({ kind: "row", row }));
    // The Europe-average rung sits where the ladder crosses the average price.
    if (scope === "europe" && average != null && rows.length > 2) {
      const at = ordered.findIndex((r) => (order === "cheapest" ? r.eur > average : r.eur < average));
      if (at > 0) out.splice(at, 0, { kind: "average", eur: average });
    }
    return out;
  }, [rows, order, scope, average]);

  const selectedData = (data?.countries ?? []).find((c) => c.country === country) ?? null;
  const selectedPrice = getFuelPrice(selectedData, fuelType);
  const selected = rows.find((r) => r.country === country) ?? null;
  const selectedIndex = selected ? items.findIndex((it) => it.kind === "row" && it.row.country === country) : -1;

  return {
    rows,
    items,
    total: rows.length,
    average,
    cheapest: rows[0] ?? null,
    dearest: rows.length ? rows[rows.length - 1] : null,
    selected,
    selectedIndex,
    selectedHasPrice: typeof selectedPrice === "number" && Number.isFinite(selectedPrice),
    selectedInScope: scope === "europe" ? isEuropeanCountry(country) : favoriteSet.has(country),
    favoriteSet,
    fmt,
    fmtSigned,
  };
}
