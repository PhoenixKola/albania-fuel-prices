import { useCallback, useMemo } from "react";

import { useApp } from "../context/AppContext";
import { getFuelPrice } from "../utils/fuel";
import { getCurrencyForCountry } from "../utils/currency";
import { hasRate } from "../utils/money";
import { isEuropeanCountry } from "../utils/regions";
import { getFlagForCountry } from "../utils/countryFlag";
import { getWeeklyDeltaEur } from "./useTrends";
import { formatAmount, formatSignedAmount } from "./useHomeMarket";

export type CompareLane = {
  country: string;
  flag: string;
  eur: number | null;
  /** Price in the comparison currency (EUR, or the home currency in local mode). */
  primary: string | null;
  /** Price in the market's own currency when that differs from the comparison currency. */
  secondary: string | null;
  /** The market uses another currency but no FX rate is available for it. */
  secondaryMissing: boolean;
  europeRank: number | null;
  gapEur: number | null;
  /** 0 = cheapest selected, 1 = dearest selected. */
  position: number | null;
  isCheapest: boolean;
  isDearest: boolean;
  weekEur: number | null;
};

/** Everything Compare shows, derived once per data/fuel/selection/currency change. */
export function useCompareModel() {
  const { data, fuelType, compareCountries, maxCompare, trends, fxRates, effectiveCurrencyMode, currency } = useApp();
  const mode = effectiveCurrencyMode;
  const primaryCurrency = mode === "local" ? currency : "EUR";

  const fmt = useCallback((eur: number | null) => formatAmount(eur, mode, currency, fxRates), [mode, currency, fxRates]);
  const fmtSigned = useCallback((eur: number) => formatSignedAmount(eur, mode, currency, fxRates), [mode, currency, fxRates]);

  // Saved selections beyond the current allowance (an unlock that expired) stay stored but hidden.
  const visible = useMemo(() => compareCountries.slice(0, maxCompare), [compareCountries, maxCompare]);
  const hidden = useMemo(() => compareCountries.slice(maxCompare), [compareCountries, maxCompare]);

  const europe = useMemo(() => {
    const rows = (data?.countries ?? [])
      .filter((c) => isEuropeanCountry(c.country))
      .map((c) => ({ country: c.country, price: getFuelPrice(c, fuelType) }))
      .filter((r): r is { country: string; price: number } => typeof r.price === "number" && Number.isFinite(r.price))
      .sort((a, b) => a.price - b.price);
    return { total: rows.length, rank: new Map(rows.map((r, i) => [r.country, i + 1])) };
  }, [data, fuelType]);

  const lanes = useMemo(() => {
    const byName = new Map((data?.countries ?? []).map((c) => [c.country, c]));
    const raw = visible.map((country) => {
      const v = getFuelPrice(byName.get(country) ?? null, fuelType);
      return { country, eur: typeof v === "number" && Number.isFinite(v) ? v : null };
    });
    const priced = raw.filter((r): r is { country: string; eur: number } => r.eur != null);
    const min = priced.length ? Math.min(...priced.map((r) => r.eur)) : null;
    const max = priced.length ? Math.max(...priced.map((r) => r.eur)) : null;
    const span = min != null && max != null ? max - min : 0;
    const distinct = priced.length >= 2 && span > 0.0005;

    const out: CompareLane[] = raw.map(({ country, eur }) => {
      const marketCurrency = getCurrencyForCountry(country);
      const differs = marketCurrency !== primaryCurrency;
      const canConvert = marketCurrency === "EUR" || hasRate(marketCurrency, fxRates);
      const secondary =
        eur == null || !differs || !canConvert
          ? null
          : formatAmount(eur, marketCurrency === "EUR" ? "eur" : "local", marketCurrency, fxRates);
      const gap = eur != null && min != null ? eur - min : null;
      return {
        country,
        flag: getFlagForCountry(country),
        eur,
        primary: eur == null ? null : fmt(eur),
        secondary,
        secondaryMissing: eur != null && differs && !canConvert,
        europeRank: europe.rank.get(country) ?? null,
        gapEur: gap,
        position: gap == null ? null : span > 0 ? gap / span : 0,
        isCheapest: distinct && gap != null && gap < 0.0005,
        isDearest: distinct && eur != null && max != null && max - eur < 0.0005,
        weekEur: getWeeklyDeltaEur(trends, country, fuelType),
      };
    });

    // Priced markets ordered cheapest first; unreported ones keep their place at the end.
    return [...out.filter((l) => l.eur != null).sort((a, b) => (a.eur as number) - (b.eur as number)), ...out.filter((l) => l.eur == null)];
  }, [data, visible, fuelType, primaryCurrency, fxRates, fmt, europe, trends]);

  const priced = lanes.filter((l) => l.eur != null);
  const cheapest = priced[0] ?? null;
  const dearest = priced.length ? priced[priced.length - 1] : null;
  const spreadEur = cheapest && dearest ? (dearest.eur as number) - (cheapest.eur as number) : null;

  return { lanes, visible, hidden, cheapest, dearest, spreadEur, pricedCount: priced.length, europeTotal: europe.total, fmt, fmtSigned };
}
